import deepExtend from '@form-create/utils/lib/deepextend';
import is from '@form-create/utils/lib/type';
import mergeProps from '@form-create/utils/lib/mergeprops';
import {arrayAttrs} from './attrs';
import {err} from '@form-create/utils/lib/console';

const PREFIX = '[[FORM-CREATE-PREFIX-';
const SUFFIX = '-FORM-CREATE-SUFFIX]]';

export function toJson(obj) {
    return JSON.stringify(deepExtend([], obj, true), function (key, val) {
        if (val && val._isVue === true)
            return undefined;

        if (typeof val !== 'function') {
            return val;
        }
        if (val.__inject)
            val = val.__origin;

        if (val.__emit)
            return undefined;

        return PREFIX + val + SUFFIX;
    });
}

function makeFn(fn) {
    return eval('(function(){return ' + fn + ' })()')
}

export function parseJson(json, mode) {
    return JSON.parse(json, function (k, v) {
        if (is.Undef(v) || !v.indexOf) return v;
        try {
            if (v.indexOf(SUFFIX) > 0 && v.indexOf(PREFIX) === 0) {
                v = v.replace(SUFFIX, '').replace(PREFIX, '');
                return makeFn(v.indexOf('function') === -1 && v.indexOf('(') !== 0 ? 'function ' + v : v);
            } else if (!mode && v.indexOf('function') > -1)
                return makeFn(v)
        } catch (e) {
            err(`解析失败:${v}`);
            return undefined;
        }
        return v;
    });
}

export function enumerable(value, writable) {
    return {
        value,
        enumerable: false,
        configurable: false,
        writable: !!writable
    }
}
//todo 优化位置
export function copyRule(rule, mode) {
    return copyRules([rule], mode)[0];
}

export function copyRules(rules, mode) {
    return deepExtend([], [...rules], mode);
}

export function mergeRule(rule, merge) {
    mergeProps([merge], rule, {array: arrayAttrs});
    return rule;
}

export function getRule(rule) {
    return is.Function(rule.getRule) ? rule.getRule() : rule;
}