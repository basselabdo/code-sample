import { SinonSandbox, SinonStub } from 'sinon';
import AccountService from '../../../../src/application/account/account-service';
import BaseMock from '../../base.mock';

export default class AccountServiceMock extends BaseMock<AccountService> {
    getAccountBy: SinonStub;
    createTransaction: SinonStub;
    updateAccount: SinonStub;
    constructor(sandbox: SinonSandbox) {
        super(sandbox, ['getAccountBy', 'createTransaction', 'updateAccount']);
    }
}
