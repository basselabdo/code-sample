export default interface AppLogger {
    info(...args: any): void;
    error(...args: any): void;
    warn(...args: any): void;
    debug(...args: any): void;
}
