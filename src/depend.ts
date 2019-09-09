let target: null | ISubscriber = null;

type ISubscriber = {
  (): void;
  __isAbandoned?: boolean;
};

type IDepend = {
  subscribe: (func: Function) => void;
  notify: () => void;
};

const setTarget = (func: ISubscriber) => {
  target = func;
};

const unsetTarget = () => {
  const _target = target;
  target = null;
  return () => {
    _target && (_target.__isAbandoned = true);
  };
};

const depend = () => {
  let subscribers: ISubscriber[] = [];
  const subscribe = (func: ISubscriber) => {
    subscribers.push(func);
  };
  const notify = () => {
    subscribers = subscribers.filter(f => {
      if (f.__isAbandoned) return false;
      f();
      return true;
    });
  };
  return { subscribe, notify };
};

Object.defineProperty(depend, 'target', {
  get: (): null | ISubscriber => target,
});

export { setTarget, unsetTarget, IDepend };
export default depend as {
  (): IDepend;
  target: null | ISubscriber;
};
