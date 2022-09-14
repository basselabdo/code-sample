import { SinonSandbox, SinonStub } from 'sinon';
import AccountRepository from '../../../../src/application/account/account-repository';
import BaseMock from '../../base.mock';

export default class AccountRepositoryMock extends BaseMock<AccountRepository> {
    getAccountBy: SinonStub;
    createTransaction: SinonStub;
    updateAccount: SinonStub;
    constructor(sandbox: SinonSandbox) {
        super(sandbox, ['getAccountBy', 'updateAccount']);
    }
}
