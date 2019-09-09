import depend, { IDepend } from './depend';
import { DEP } from './utils';

class PrimitiveValue<T> {
  [DEP]: IDepend;
  value: T;

  constructor(val: T) {
    this[DEP] = depend();
    this.value = val;
  }
}

class ObjectiveValue<T> {
  [DEP]: IDepend;
  [x: string]: any;

  constructor(val: T) {
    this[DEP] = depend();
    Object.keys(val as any).forEach(k => {
      if (typeof (val as any)[k] === 'object') {
        this[k] = value((val as any)[k]);
      } else {
        this[k] = (val as any)[k];
      }
    });
  }
}

const makePrimitiveValue = <T = any>(val: T): { value: T } => {
  return new Proxy(new PrimitiveValue(val), {
    get(target, p, receiver) {
      if (depend.target) {
        target[DEP].subscribe(depend.target);
      }
      return target.value;
    },
    set(target, prop, nextVal, receiver) {
      if (prop !== 'value') {
        return Reflect.set(target, name, value, receiver);
      }
      if (nextVal === target.value) return true;
      target.value = nextVal;
      target[DEP].notify();
      return true;
    },
  }) as any;
};

const makeObjectValue = <T = any>(val: T): T => {
  return new Proxy(new ObjectiveValue(val), {
    get(target, p: string, receiver) {
      if (depend.target) {
        target[DEP].subscribe(depend.target);
      }
      return target[p];
    },
    set(target, p: string, nextVal, receiver) {
      if (nextVal === target[p]) return true;
      target[p] = nextVal;
      target[DEP].notify();
      return true;
    },

  }) as any;
};

const value = <T = any>(val: T): T extends object ? T : { value: T } => {
  if (typeof val === 'object') {
    return makeObjectValue(val) as any;
  }
  return makePrimitiveValue(val) as any;
};

export { PrimitiveValue, ObjectiveValue, makePrimitiveValue, makeObjectValue };
export default value;
