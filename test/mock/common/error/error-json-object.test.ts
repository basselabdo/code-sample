import { expect } from 'chai';
import ErrorToJsonObject from '../../../../src/common/error/error-to-json-object';
import AppError from '../../../../src/common/error/app-error';
import ErrorLike from '../../../../src/common/error/error-like';

describe('ErrorToJsonObject', () => {
    class TestError extends AppError {
        constructor(message: string, cause?: ErrorLike) {
            super(message, cause);
        }
    }

    describe('toJsonObject', () => {
        it('should return json object for native error', () => {
            const error = new Error('some error');
            expect(ErrorToJsonObject.toJsonObject(error)).to.eql({
                name: error.name,
                message: error.message,
                stack: error.stack
            });
        });

        it('should return json object for app error', () => {
            const error = new TestError('some error');
            expect(ErrorToJsonObject.toJsonObject(error)).to.eql({
                name: error.name,
                message: error.message,
                stack: error.stack
            });
        });

        it('should return json object with no cause when maxDepth is 0', () => {
            const error = new TestError('some error', new Error('cause by'));
            expect(ErrorToJsonObject.toJsonObject(error, 0)).to.eql({
                name: error.name,
                message: error.message,
                stack: error.stack
            });
        });

        it('should return json object with cause when maxDepth is 1', () => {
            const error = new TestError('some error', new Error('cause by'));
            expect(ErrorToJsonObject.toJsonObject(error, 1)).to.eql({
                name: error.name,
                message: error.message,
                stack: error.stack,
                cause: {
                    name: (error.cause as any).name,
                    message: (error.cause as any).message,
                    stack: (error.cause as any).stack
                }
            });
        });

        it('should return json object with max number of cause', () => {
            const error = new TestError(
                'some error',
                new TestError('another error', new TestError('more error'))
            );
            expect(ErrorToJsonObject.toJsonObject(error, 1)).to.eql({
                name: error.name,
                message: error.message,
                stack: error.stack,
                cause: {
                    name: (error.cause as any).name,
                    message: (error.cause as any).message,
                    stack: (error.cause as any).stack
                }
            });
        });
    });
});
