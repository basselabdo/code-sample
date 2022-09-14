import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import TransactionServiceImpl from '../../../../src/application/transaction/transaction-service-impl';
import TransactionRepositoryMock from '../../../mock/application/transaction/transaction-repository.mock';
import {
    accountTransactions,
    sendTransaction,
    sendTransactionFail,
    succeededTransaction,
    transactionsSearchCriteriaFail,
    transactionsSearchCriteriaSuccess
} from './transaction-test-data';
chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('TransactionServiceImpl', () => {
    const sandbox = sinon.createSandbox();
    const transactionRepository = new TransactionRepositoryMock(sandbox);
    let transactionServiveImpl: TransactionServiceImpl;
    beforeEach(() => {
        transactionServiveImpl = new TransactionServiceImpl(
            transactionRepository
        );
    });
    afterEach(() => {
        sandbox.reset();
    });

    describe('getAccountTransactions', () => {
        describe('when operation is successful', () => {
            beforeEach(() => {
                transactionRepository.getAccountTransactions
                    .withArgs(transactionsSearchCriteriaSuccess)
                    .resolves(accountTransactions);
            });
            it('should return account transactions', async () => {
                const res = await transactionServiveImpl.getAccountTransactions(
                    transactionsSearchCriteriaSuccess
                );
                return expect(res).to.deep.eq(accountTransactions);
            });
        });
        describe('when operation fails', () => {
            beforeEach(() => {
                transactionRepository.getAccountTransactions
                    .withArgs(transactionsSearchCriteriaFail)
                    .resolves(null);
            });
            it('should return account transactions', async () => {
                const res = await transactionServiveImpl.getAccountTransactions(
                    transactionsSearchCriteriaSuccess
                );
                return expect(res).to.eql(null);
            });
        });
    });
    describe('insertTransaction', () => {
        describe('when operation is successful', () => {
            beforeEach(() => {
                transactionRepository.insertTransaction
                    .withArgs(sendTransaction)
                    .resolves(succeededTransaction);
            });
            it('should return inserted transaction', async () => {
                const res = await transactionServiveImpl.insertTransaction(
                    sendTransaction
                );
                return expect(res.createdAt).to.not.eql(null);
            });
        });
        describe('when operation fails', () => {
            beforeEach(() => {
                transactionRepository.insertTransaction
                    .withArgs(sendTransactionFail)
                    .resolves(null);
            });
            it('should return account transactions', async () => {
                const res = await transactionServiveImpl.insertTransaction(
                    sendTransactionFail
                );
                return expect(res).to.eql(null);
            });
        });
    });
});
