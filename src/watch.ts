import { setTarget, unsetTarget } from './depend';

const watch = (func: Function) => {
  setTarget(func);
  func();
  unsetTarget();
};

export default watch;
