import { PrimitiveValue, makePrimitiveValue } from './value';
import { setTarget, unsetTarget } from './depend';

const computed = <T>(func: () => T): { value: T } => {
  let unsubscribe = () => {};
  const fn = () => {
    setTarget(() => {
      unsubscribe();
      fn();
      res.value = func();
      unsubscribe = unsetTarget();
    });
  };
  fn();
  const res = makePrimitiveValue(func());
  unsubscribe = unsetTarget();
  return res;
};

export default computed;
