import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import AccountServiceImpl from '../../../../src/application/account/account-service-impl';
import AccountRepositoryMock from '../../../mock/application/account/account-repository.mock';
import TransactionRepositoryMock from '../../../mock/application/transaction/transaction-repository.mock';
import {
    accountByIdGoodBalance,
    accountByIdLowBalance,
    accountByEmail,
    accountById,
    accountTransactions,
    searchCriteriaEmail,
    searchCriteriaId,
    searchCriteriaIdLowBalance,
    searchCriteriaIdWithNullReturn,
    accountByIdLocked,
    searchCriteriaIdLocked,
    receiveTransaction,
    succeededTransaction,
    searchCriteriaIdCreatingTransaction,
    sendTransaction,
    accountByIdNoTransactions,
    searchCriteriaIdWithoutTransactions
} from './account-test-data';

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('AccountServiceImpl', () => {
    const sandbox = sinon.createSandbox();
    const accountRepository = new AccountRepositoryMock(sandbox);
    const transactionRepository = new TransactionRepositoryMock(sandbox);
    let accountServiveImpl: AccountServiceImpl;
    beforeEach(() => {
        accountServiveImpl = new AccountServiceImpl(
            accountRepository,
            transactionRepository
        );
    });
    afterEach(() => {
        sandbox.reset();
    });

    describe('getAccountBy', () => {
        describe('when operation is successful', () => {
            beforeEach(() => {
                accountRepository.getAccountBy
                    .withArgs(searchCriteriaEmail)
                    .resolves(accountByEmail);
                accountRepository.getAccountBy
                    .withArgs(searchCriteriaId)
                    .resolves(accountById);
                transactionRepository.getAccountTransactions
                    .withArgs({ userEmail: accountByEmail.userEmail })
                    .resolves(accountTransactions);
                transactionRepository.getAccountTransactions
                    .withArgs({ userEmail: accountById.userEmail })
                    .resolves(accountTransactions);
            });
            it('should return success (get Account by email)', async () => {
                const result = await accountServiveImpl.getAccountBy(
                    searchCriteriaEmail
                );
                expect(result._id).to.eql(accountByEmail._id);
            });
            it('should return success (get Account by Id)', async () => {
                const result = await accountServiveImpl.getAccountBy(
                    searchCriteriaId
                );
                expect(result._id).to.eql(accountById._id);
            });
        });
        describe('when operation fails', () => {
            beforeEach(() => {
                accountRepository.getAccountBy
                    .withArgs(searchCriteriaEmail)
                    .resolves(null);
            });
            it('should be rejected with an error', () => {
                return expect(
                    accountServiveImpl.getAccountBy(searchCriteriaEmail)
                ).to.eventually.be.rejectedWith(
                    Error,
                    'Account ({"userEmail":"basel@gmail.com"}) doest not exist!'
                );
            });
        });
    });
    describe('updateAccount', () => {
        describe('when operation is successful', () => {
            beforeEach(() => {
                accountRepository.getAccountBy
                    .withArgs(searchCriteriaEmail)
                    .resolves(accountByEmail);
                accountRepository.updateAccount
                    .withArgs(searchCriteriaEmail, accountByEmail)
                    .resolves(accountByEmail);
            });
            it('should return success operation', async () => {
                const result = await accountServiveImpl.updateAccount(
                    searchCriteriaEmail,
                    accountByEmail
                );
                expect(result._id).to.eql(accountByEmail._id);
            });
        });
        describe('when operation fails', () => {
            beforeEach(() => {
                accountRepository.getAccountBy
                    .withArgs(searchCriteriaEmail)
                    .resolves(null);
                accountRepository.getAccountBy
                    .withArgs(searchCriteriaId)
                    .resolves(accountById);
                accountRepository.updateAccount
                    .withArgs(searchCriteriaId, accountById)
                    .rejects(accountById);
            });
            it('should be rejected with an error when account does not exist', () => {
                return expect(
                    accountServiveImpl.updateAccount(
                        searchCriteriaEmail,
                        accountByEmail
                    )
                ).to.eventually.be.rejectedWith(
                    Error,
                    'Error! Account does not exist!'
                );
            });
            it('should be rejected with an error', () => {
                return expect(
                    accountServiveImpl.updateAccount(
                        searchCriteriaEmail,
                        accountByEmail
                    )
                ).to.eventually.be.rejectedWith(
                    Error,
                    'Error! Account does not exist!'
                );
            });
        });
    });
    describe('createTransaction', () => {
        describe('when operation is successful', () => {
            beforeEach(() => {
                accountRepository.getAccountBy
                    .withArgs(searchCriteriaIdCreatingTransaction)
                    .resolves(accountByIdGoodBalance);
                transactionRepository.getAccountTransactions
                    .withArgs({ userEmail: accountByIdGoodBalance.userEmail })
                    .resolves(accountTransactions);
                transactionRepository.insertTransaction
                    .withArgs(receiveTransaction)
                    .resolves(succeededTransaction);
            });
            it('should return success operation', async () => {
                const result = await accountServiveImpl.createTransaction(
                    accountByIdGoodBalance._id,
                    receiveTransaction
                );
                return expect(result.createdAt).to.not.eql(null);
            });
        });
        describe('when operation fails', () => {
            beforeEach(() => {
                accountRepository.getAccountBy
                    .withArgs(searchCriteriaIdLowBalance)
                    .resolves(accountByIdLowBalance);
                transactionRepository.getAccountTransactions
                    .withArgs({ userEmail: accountByIdLowBalance.userEmail })
                    .withArgs({ userEmail: accountByIdLocked.userEmail })
                    .resolves(accountTransactions);
                transactionRepository.getAccountTransactions
                    .withArgs({
                        userEmail: accountByIdNoTransactions.userEmail
                    })
                    .resolves(null);
                accountRepository.getAccountBy
                    .withArgs(searchCriteriaIdWithoutTransactions)
                    .resolves(accountByIdNoTransactions);
                accountRepository.getAccountBy
                    .withArgs(searchCriteriaIdLocked)
                    .resolves(accountByIdLocked);
                accountRepository.getAccountBy
                    .withArgs(searchCriteriaIdWithNullReturn)
                    .resolves(null);
            });
            it('should throw exception when account has low balance', () => {
                return expect(
                    accountServiveImpl.createTransaction(
                        accountByIdLowBalance._id,
                        sendTransaction
                    )
                ).to.eventually.be.rejectedWith(
                    Error,
                    'Error! Account balance can not be less than 0!'
                );
            });
            it('should throw exception when account does not exist', () => {
                return expect(
                    accountServiveImpl.createTransaction(
                        'id-123-null',
                        sendTransaction
                    )
                ).to.eventually.be.rejectedWith(
                    Error,
                    'Failed creating transaction! Message: Error: Account ({"_id":"id-123-null"}) doest not exist!'
                );
            });
            it('should throw exception when account is locked', () => {
                return expect(
                    accountServiveImpl.createTransaction(
                        accountByIdLocked._id,
                        sendTransaction
                    )
                ).to.eventually.be.rejectedWith(
                    Error,
                    `The Account is locked. Aborting creating transaction: ${sendTransaction}`
                );
            });
            it('should throw exception when account has no transactions', () => {
                return expect(
                    accountServiveImpl.createTransaction(
                        accountByIdNoTransactions._id,
                        sendTransaction
                    )
                ).to.eventually.be.rejectedWith(
                    Error,
                    `Failed getting account transactions!`
                );
            });
        });
    });
});
