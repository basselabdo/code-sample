import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import MongoDbMock, {
    MongoCursorMock,
    MongoCollectionMock
} from '../../../mock/persistence/mongo/mongo-db.mock';
import ConfigMock from '../../../mock/common/config.mock';
import MongoTransactionRepositoryImpl from '../../../../src/persistance/transaction/mongo-transaction-repository-impl';
import {
    insertedTransactionEntity,
    transaction,
    transactionSearchCriteria,
    accountTransactions
} from './mongo-transaction-test-data';

chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('MongoTransactionRepositoryImpl', () => {
    const sandbox = sinon.createSandbox();
    const db = new MongoDbMock(sandbox);
    const cursor = new MongoCursorMock(sandbox);
    const transactionsCollection = new MongoCollectionMock(sandbox);
    const config = new ConfigMock(sandbox);
    const repo: MongoTransactionRepositoryImpl = new MongoTransactionRepositoryImpl(
        db.asType(),
        config
    );
    beforeEach(() => {
        config.get
            .withArgs('mongoDb.transactionsCollection')
            .returns('transactions');
    });
    afterEach(() => sandbox.reset());
    describe('insertTransaction', () => {
        describe('when operation is successful', () => {
            beforeEach(() => {
                db.collection
                    .withArgs('transactions')
                    .returns(transactionsCollection);
                transactionsCollection.insertOne.resolves({
                    insertedId: '631fab413b2d5f8a4abbe3bc'
                });
            });
            it('should insert a transaction', async () => {
                const result = await repo.insertTransaction(transaction);
                return expect(result.userEmail).to.eql(
                    insertedTransactionEntity.userEmail
                );
            });
        });
        describe('when operation fails', () => {
            beforeEach(() => {
                db.collection
                    .withArgs('transactions')
                    .returns(transactionsCollection);
            });
            it('should fail when no insertedId', () => {
                transactionsCollection.insertOne.resolves({
                    insertedId: null
                });
                return expect(
                    repo.insertTransaction(transaction)
                ).to.be.eventually.rejectedWith(
                    Error,
                    `Failed to insert transaction ${JSON.stringify(
                        transaction
                    )}, Message: Error: No insertedId!`
                );
            });
            it('should fail when inserting', () => {
                transactionsCollection.insertOne.rejects('oops!');
                return expect(
                    repo.insertTransaction(transaction)
                ).to.be.eventually.rejectedWith(
                    Error,
                    `Failed to insert transaction ${JSON.stringify(
                        transaction
                    )}, Message: oops!`
                );
            });
        });
    });
    describe('getAccountTransactions', () => {
        describe('when operation is successful', () => {
            beforeEach(() => {
                db.collection
                    .withArgs('transactions')
                    .returns(transactionsCollection);
            });
            it('should get account transactions', async () => {
                transactionsCollection.find.returns(cursor);
                cursor.toArray.resolves(accountTransactions);
                const result = await repo.getAccountTransactions(
                    transactionSearchCriteria
                );
                return expect(result).to.deep.eq(accountTransactions);
            });
        });
        describe('when the operation fails', () => {
            beforeEach(() => {
                db.collection
                    .withArgs('transactions')
                    .returns(transactionsCollection);
            });
            it('should get account transactions', () => {
                transactionsCollection.find.returns(cursor);
                cursor.toArray.rejects('oops!');
                return expect(
                    repo.getAccountTransactions(transactionSearchCriteria)
                ).to.be.eventually.rejectedWith(
                    Error,
                    `Failed to get transaction for criteria: ${JSON.stringify(
                        transactionSearchCriteria
                    )}, Error: oops!`
                );
            });
        });
    });
});
