import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { JsonFormatter } from './json-formatter';
import ErrorToJsonObject from '../common/error/error-to-json-object';
import AppLoggerLocator from '../common/logger/app-logger-locator';

export default function errorHandler(): ErrorRequestHandler {
    return (
        err: any,
        req: Request,
        res: Response & JsonFormatter,
        next: NextFunction
    ) => {
        AppLoggerLocator.getLogger().error(ErrorToJsonObject.toJsonObject(err));
        res.formattedJson(err, undefined);
    };
}
