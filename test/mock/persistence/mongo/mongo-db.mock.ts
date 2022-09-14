import { SinonSandbox, SinonStub } from 'sinon';
import { Collection, Db, MongoClient } from 'mongodb';
import BaseMock from '../../base.mock';

export class MongoCollectionMock extends BaseMock<Collection> {
    insertOne: SinonStub;
    find: SinonStub;
    findOne: SinonStub;
    findOneAndUpdate: SinonStub;

    constructor(sandbox: SinonSandbox) {
        super(sandbox, ['insertOne', 'find', 'findOne', 'findOneAndUpdate']);
    }
}

export class MongoClientMock extends BaseMock<MongoClient> {
    db: SinonStub;
    constructor(sandbox: SinonSandbox) {
        super(sandbox, ['db']);
    }
}

export default class MongoDbMock extends BaseMock<Db> {
    collection: SinonStub;
    constructor(sandbox: SinonSandbox) {
        super(sandbox, ['collection']);
    }
}
