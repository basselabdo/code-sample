import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import errorHandler from '../../../src/web/error-handler';
import { ErrorRequestHandler } from 'express';
import AppLogger from '../../../src/common/logger/app-logger';
import AppLoggerLocator from '../../../src/common/logger/app-logger-locator';

chai.use(sinonChai);

const expect = chai.expect;

describe('ErrorHandler', () => {
    let logger: AppLogger;

    beforeEach(() => {
        logger = {
            info: sinon.stub(),
            warn: sinon.stub(),
            error: sinon.stub(),
            debug: sinon.stub()
        };
        AppLoggerLocator.load(
            new (class extends AppLoggerLocator {
                getLogger(): AppLogger {
                    return logger;
                }
            })()
        );
    });

    it('should create handler', () => {
        const handler = errorHandler();
        expect(handler).to.be.a('function');
    });

    describe('handler', () => {
        let handler: ErrorRequestHandler;
        let res: any;

        beforeEach(() => {
            handler = errorHandler();
            res = { formattedJson: sinon.stub() };
        });

        it('should log and format response', () => {
            const error: any = new Error('test');
            handler(error, undefined as any, res, undefined as any);
            const { name, message, stack } = error;
            expect(logger.error).to.have.been.calledWith({
                name,
                message,
                stack
            });
            expect(res.formattedJson).to.have.been.calledWith(error);
        });
    });
});
