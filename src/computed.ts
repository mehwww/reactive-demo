import { PrimitiveValue, makePrimitiveValue } from './value';
import { setTarget, unsetTarget } from './depend';

const computed = <T>(func: () => T): PrimitiveValue<T> => {
  setTarget(() => {
    res.value = func();
  });
  const res = makePrimitiveValue(func());
  unsetTarget();
  return res as any;
};

export default computed;
