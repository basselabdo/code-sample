import _ from 'lodash';

export const flattenObject = (obj: object, prev: string = '') => {
    if (obj == null) {
        return obj;
    }
    return Object.entries(obj).reduce((agg: any, [key, value]) => {
        if (_.isPlainObject(value)) {
            const nested = flattenObject(value, prev + key + '.');
            _.assign(agg, nested);
        } else {
            agg[prev + key] = value;
        }
        return agg;
    }, {});
};
