import BaseMock from '../base.mock';
import Config from '../../../src/common/config/config';
import { SinonSandbox, SinonStub } from 'sinon';

export default class ConfigMock extends BaseMock<Config> implements Config {
    get: SinonStub;
    constructor(sandbox: SinonSandbox) {
        super(sandbox, ['get']);
    }
}
