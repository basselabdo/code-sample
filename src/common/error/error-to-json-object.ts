import ErrorLike from './error-like';

export default class ErrorToJsonObject {
    static toJsonObject(error: ErrorLike, maxDepth: number = 5): ErrorLike {
        const { name, message, stack, cause } = error;
        const errorJsonObject: ErrorLike = {
            name,
            message,
            stack
        };
        if (cause && maxDepth > 0) {
            errorJsonObject.cause = this.toJsonObject(cause, maxDepth - 1);
        }
        return errorJsonObject;
    }
}
