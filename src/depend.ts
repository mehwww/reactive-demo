let target: null | Function = null;

const setTarget = (func: Function) => {
  target = func;
};

const unsetTarget = () => {
  target = null;
};

type IDepend = {
  subscribe: (func: Function) => void;
  notify: () => void;
};

const depend = () => {
  const subscribers: Function[] = [];
  const subscribe = (func: Function) => {
    subscribers.push(func);
  };
  const notify = () => {
    subscribers.forEach(f => f());
  };
  return { subscribe, notify };
};

Object.defineProperty(depend, 'target', {
  get: (): null | Function => target,
});

export { setTarget, unsetTarget, IDepend };
export default depend as {
  (): IDepend;
  target: null | Function;
};
