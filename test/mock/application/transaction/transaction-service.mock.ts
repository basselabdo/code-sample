import { SinonSandbox, SinonStub } from 'sinon';
import TransactionService from '../../../../src/application/transaction/transaction-service';
import BaseMock from '../../base.mock';

export default class TransactionServiceMock extends BaseMock<
    TransactionService
> {
    getAccountTransactions: SinonStub;
    insertTransaction: SinonStub;
    constructor(sandbox: SinonSandbox) {
        super(sandbox, ['getAccountTransactions', 'insertTransaction']);
    }
}
