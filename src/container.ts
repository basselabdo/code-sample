import config from 'config';
import jsonFormatter from './web/json-formatter';
import Config from './common/config/config';
import AccountServiceImpl from './application/account/account-service-impl';
import AccountHandler from './web/account-handler';
import AccountRepositoryImpl from './persistance/account/mongo-account-repository-impl';
import { Db, MongoClient } from 'mongodb';
import TransactionRepositoryImpl from './persistance/transaction/mongo-transaction-repository-impl';
import TransactionServiceImpl from './application/transaction/transaction-service-impl';
export interface Container {
    [key: string]: any;
}
import errorHandler from './web/error-handler';

async function containerFactory(override: Container = {}): Promise<Container> {
    const appConfig: Config = config;
    let mongoDb: Db;
    const mongoDbFactory: () => Promise<Db> = async () => {
        const mongoDbName: string = appConfig.get('mongoDb.dbName');
        const mongoClient = await MongoClient.connect(
            `mongodb://${
                process.env[appConfig.get<string>('mongoDb.dbUserName')]
            }:${
                process.env[appConfig.get<string>('mongoDb.dbPassword')]
            }@${appConfig.get('mongoDb.hostname')}:${appConfig.get(
                'mongoDb.port'
            )}/${appConfig.get('mongoDb.dbName')}`
        );
        mongoDb =
            mongoDbName !== '' ? mongoClient.db(mongoDbName) : mongoClient.db();
        return mongoDb;
    };
    const transactionRepository = new TransactionRepositoryImpl(
        await mongoDbFactory(),
        appConfig
    );
    const transactionService = new TransactionServiceImpl(
        transactionRepository
    );

    const accountRepository = new AccountRepositoryImpl(
        await mongoDbFactory(),
        appConfig
    );
    const accountService = new AccountServiceImpl(
        accountRepository,
        transactionService
    );
    const accountHandler = new AccountHandler(accountService);

    // Return the singletons that is needed to setup the app
    return {
        appConfig,
        jsonFormatter: jsonFormatter(),
        errorHandler: errorHandler(),
        accountHandler
    };
}

export default containerFactory;
