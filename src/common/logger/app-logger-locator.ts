import AppLogger from './app-logger';

const noopAppLogger: AppLogger = new (class implements AppLogger {
    debug(...args: any): void {}

    error(...args: any): void {}

    info(...args: any): void {}

    warn(...args: any): void {}
})();

export default abstract class AppLoggerLocator {
    private static defaultLocator: AppLoggerLocator = new (class extends AppLoggerLocator {
        getLogger(): AppLogger {
            return noopAppLogger;
        }
    })();
    private static instance: AppLoggerLocator = AppLoggerLocator.defaultLocator;

    static load(locator: AppLoggerLocator): void {
        this.instance = locator;
    }

    static getLogger(): AppLogger {
        if (!this.instance) {
            this.load(this.defaultLocator);
        }
        return this.instance.getLogger();
    }

    abstract getLogger(): AppLogger;
}
