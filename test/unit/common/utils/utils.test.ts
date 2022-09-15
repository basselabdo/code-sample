import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chai from 'chai';
import { flattenObject } from '../../../../src/common/utils/utils';

chai.use(sinonChai);
const expect = chai.expect;
const sandbox = sinon.createSandbox();

describe('Utilities', () => {
    afterEach(() => {
        sandbox.reset();
    });
    describe('flattenObject', () => {
        it('should return null when object is null', () => {
            expect(flattenObject(null as any)).to.eql(null);
        });
        it('should flatten empty object', () => {
            expect(flattenObject({})).to.eql({});
        });
        it('should flatten non-empty object', () => {
            expect(
                flattenObject({
                    key: undefined
                })
            ).to.eql({
                key: undefined
            });
        });
        it('should flatten non-empty object recursive', () => {
            const date = new Date();
            class ABC {}
            expect(
                flattenObject({
                    number: 1,
                    string: 'b',
                    boolean: false,
                    object: {},
                    array: [],
                    date,
                    set: new Set(),
                    map: new Map(),
                    class: new ABC(),
                    nested: {
                        number: 1,
                        string: 'b',
                        boolean: false,
                        object: {},
                        array: [],
                        date,
                        set: new Set(),
                        map: new Map(),
                        class: new ABC()
                    }
                })
            ).to.eql({
                number: 1,
                string: 'b',
                boolean: false,
                array: [],
                date,
                set: new Set(),
                map: new Map(),
                class: new ABC(),
                'nested.number': 1,
                'nested.string': 'b',
                'nested.boolean': false,
                'nested.array': [],
                'nested.date': date,
                'nested.set': new Set(),
                'nested.map': new Map(),
                'nested.class': new ABC()
            });
        });
    });
});
