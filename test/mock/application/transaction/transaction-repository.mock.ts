import { SinonSandbox, SinonStub } from 'sinon';
import TransactionRepository from '../../../../src/application/transaction/transaction-repository';
import BaseMock from '../../base.mock';

export default class TransactionRepositoryMock extends BaseMock<
    TransactionRepository
> {
    getAccountTransactions: SinonStub;
    insertTransaction: SinonStub;
    constructor(sandbox: SinonSandbox) {
        super(sandbox, ['getAccountTransactions', 'insertTransaction']);
    }
}
