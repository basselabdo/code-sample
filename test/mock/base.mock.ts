import { SinonSandbox } from 'sinon';
import _ from 'lodash';

export default abstract class BaseMock<T> {
    protected constructor(sandbox: SinonSandbox, keys: (keyof T)[]) {
        keys.forEach(key => {
            _.set(this, key, sandbox.stub());
        });
    }

    asType(): T {
        return this as any;
    }
}
