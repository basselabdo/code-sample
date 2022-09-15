import chai from 'chai';
import sinonChai from 'sinon-chai';
import AppLogger from '../../../../src/common/logger/app-logger';
import AppLoggerLocator from '../../../../src/common/logger/app-logger-locator';

chai.use(sinonChai);

const expect = chai.expect;

describe('AppLoggerLocator', () => {
    beforeEach(() => {
        AppLoggerLocator.load(null as any);
    });

    afterEach(() => {
        AppLoggerLocator.load(null as any);
    });

    describe('getLogger', () => {
        it('should return default logger instance', () => {
            const logger = AppLoggerLocator.getLogger();
            expect(logger.debug).not.to.throw();
            expect(logger.error).not.to.throw();
            expect(logger.info).not.to.throw();
            expect(logger.warn).not.to.throw();
        });
    });

    describe('load', () => {
        it('should replace the logger instance', () => {
            const logger = AppLoggerLocator.getLogger();
            AppLoggerLocator.load(
                new (class extends AppLoggerLocator {
                    getLogger(): AppLogger {
                        return undefined as any;
                    }
                })()
            );
            const anotherLogger = AppLoggerLocator.getLogger();
            expect(anotherLogger).not.to.be.equal(logger);
        });
    });
});
