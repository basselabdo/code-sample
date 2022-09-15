import { expect } from 'chai';
import AppError from '../../../../src/common/error/app-error';

describe('AppError', () => {
    describe('toJSON', () => {
        it('should return json', () => {
            return expect(
                new (class extends AppError {})('test').toJSON()
            ).to.have.keys(['name', 'message', 'stack']);
        });
    });
});
