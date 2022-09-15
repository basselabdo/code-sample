import express from 'express';
import swaggerMiddleware, {
    SwaggerMiddleware
} from 'swagger-express-middleware';
import swaggerUI from 'swagger-ui-express';
import { cloneDeep } from 'lodash';
import swaggerDocument from '../swagger.json';
import { Container } from './container';

async function appFactory(container: Container) {
    const {
        appConfig,
        jsonFormatter,
        errorHandler,
        accountHandler
    } = container;

    // Configurations
    const hostname = appConfig.get('hostname');
    const port = appConfig.get('port');

    // Create Express server
    const app = express();

    // Express configuration
    app.set('port', port);
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Add json formatter to response
    app.use(jsonFormatter);

    // Swagger Docs
    const configuredSwaggerDocument = cloneDeep(swaggerDocument);
    configuredSwaggerDocument.host = `${hostname}:${port}`;
    app.use(
        '/docs',
        swaggerUI.serve,
        swaggerUI.setup(configuredSwaggerDocument)
    );

    // Swagger Middleware
    const middleware = await new Promise<SwaggerMiddleware>(
        (resolve, reject) => {
            swaggerMiddleware(
                configuredSwaggerDocument,
                app,
                (err, swagger) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(swagger);
                }
            );
        }
    );

    app.use(
        middleware.metadata(),
        middleware.CORS(),
        middleware.parseRequest(),
        middleware.validateRequest()
    );

    // API handlers
    app.get('/accounts', (req, res, next) =>
        accountHandler.handleGetAccountBy(req, res, next)
    );
    app.get('/accounts/:id', (req, res, next) =>
        accountHandler.handleGetAccountBy(req, res, next)
    );
    app.patch('/accounts/:id', (req, res, next) =>
        accountHandler.handleUpdateAccount(req, res, next)
    );
    app.post('/accounts/:id/transactions', (req, res, next) => {
        accountHandler.handleCreateTransaction(req, res, next);
    });
    app.use(errorHandler);
    return app;
}

export default appFactory;
