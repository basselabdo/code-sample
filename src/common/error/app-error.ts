import ErrorLike from './error-like';
import ErrorToJsonObject from './error-to-json-object';

export default abstract class AppError extends Error {
    constructor(message: string, public readonly cause?: ErrorLike) {
        super(message);
    }

    toJSON(): any {
        return ErrorToJsonObject.toJsonObject(this);
    }
}

AppError.prototype.name = 'AppError';
