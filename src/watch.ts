import { setTarget, unsetTarget } from './depend';

const watch = (
  func: Function,
  callback?: (value: any, prevValue: any) => void,
) => {
  setTarget(() => {
    const nextValue = func();
    if (typeof callback === 'function') {
      callback(nextValue, value);
    }
    value = nextValue;
  });
  let value = func();
  return unsetTarget();
};

export default watch;
