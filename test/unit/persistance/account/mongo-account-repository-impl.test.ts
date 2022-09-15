import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import MongoDbMock, {
    MongoCollectionMock
} from '../../../mock/persistence/mongo/mongo-db.mock';
import ConfigMock from '../../../mock/common/config.mock';
import MongoAccountRepositoryImpl from '../../../../src/persistance/account/mongo-account-repository-impl';
import {
    findByEmailCriteria,
    findByIdCriteria,
    foundAccount,
    accountToUpdate,
    foundAccountEntity,
    foundAccountEntityNoId
} from './mongo-account-repo-test-data';

chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('MongoAccountRepositoryImpl', () => {
    const sandbox = sinon.createSandbox();
    const db = new MongoDbMock(sandbox);
    const accountsCollection = new MongoCollectionMock(sandbox);
    const config = new ConfigMock(sandbox);
    const repo: MongoAccountRepositoryImpl = new MongoAccountRepositoryImpl(
        db.asType(),
        config
    );
    beforeEach(() => {
        config.get.withArgs('mongoDb.accountsCollection').returns('accounts');
    });
    afterEach(() => sandbox.reset());
    describe('getAccountBy', () => {
        describe('when operation is successful', () => {
            beforeEach(() => {
                db.collection.withArgs('accounts').returns(accountsCollection);
                accountsCollection.findOne.resolves(foundAccount);
            });
            it('should get account by email', async () => {
                const result = await repo.getAccountBy(findByEmailCriteria);
                return expect(result).to.deep.eq(foundAccount);
            });
            it('should get account by id', async () => {
                const result = await repo.getAccountBy(findByIdCriteria);
                return expect(result).to.deep.eq(foundAccount);
            });
        });
        describe('when operation fails', () => {
            beforeEach(() => {
                db.collection.withArgs('accounts').returns(accountsCollection);
                accountsCollection.findOne.rejects('oops!');
            });
            it('should throw an error', () => {
                return expect(
                    repo.getAccountBy(findByEmailCriteria)
                ).to.be.eventually.rejectedWith(
                    Error,
                    'Failed to get Account for criteria: {"userEmail":"findbyEmail@gmail.com"}, Error: oops!'
                );
            });
        });
    });
    describe('updateAccount', () => {
        describe('when operation is successful', () => {
            beforeEach(() => {
                db.collection.withArgs('accounts').returns(accountsCollection);
            });
            it('should successfully find and update account', async () => {
                accountsCollection.findOneAndUpdate.resolves({
                    value: foundAccountEntity
                });
                const result = await repo.updateAccount(
                    findByIdCriteria,
                    accountToUpdate
                );
                return expect(result._id).to.equal(foundAccount._id);
            });
            it('should successfully find and update account (no id)', async () => {
                accountsCollection.findOneAndUpdate.resolves({
                    value: foundAccountEntityNoId
                });
                const result = await repo.updateAccount(
                    findByIdCriteria,
                    accountToUpdate
                );
                return expect(result.userEmail).to.equal(
                    foundAccountEntityNoId.userEmail
                );
            });
        });
        describe('when operation fails', () => {
            beforeEach(() => {
                db.collection.withArgs('accounts').returns(accountsCollection);
                accountsCollection.findOneAndUpdate.rejects('oops!');
            });
            it('should throw an error', () => {
                return expect(
                    repo.updateAccount(findByIdCriteria, accountToUpdate)
                ).to.be.eventually.rejectedWith(
                    Error,
                    'Failed to update an account! Message: oops!'
                );
            });
        });
    });
});
