import { value, computed, watch } from '../src';

describe("meh's Reactive API demo", () => {
  it('should works with primitive value', () => {
    const a = value(0);
    const b = value('666');
    const c = computed(() => a.value + b.value);
    const d = computed(() => a.value + b.value + c.value);
    expect(c.value).toBe('0666');
    expect(d.value).toBe('0666' + '0666');
    a.value += 1;
    expect(a.value).toBe(1);
    expect(c.value).toBe('1666');
    expect(d.value).toBe('1666' + '1666');
    b.value = '888';
    expect(b.value).toBe('888');
    expect(c.value).toBe('1888');
    expect(d.value).toBe('1888' + '1888');
  });

  it('should works with object value', () => {
    const a = value({ count: 1 });
    const b = value({ count: 2 });
    const b2 = value(3);
    const c = computed(() => ({
      count: a.count + b.count + b2.value + ((a as any).count2 || 0),
    }));
    expect(a.count).toBe(1);
    expect(b.count).toBe(2);
    expect(c.value.count).toBe(6);
    a.count += 2;
    expect(a.count).toBe(3);
    expect(c.value.count).toBe(8);
    b.count += 4;
    expect(b.count).toBe(6);
    expect(c.value.count).toBe(12);
    (a as any).count2 = 1;
    expect(c.value.count).toBe(13);
    b2.value = 0;
    expect(c.value.count).toBe(10);
  });

  it('watch API works', () => {
    const a = value(1);
    const b = value({ count: 2 });
    const c = value(666);
    const compute = jest.fn(() => {
      return a.value + b.count;
    });
    const callback = jest.fn();
    const unwatch = watch(compute, callback);
    expect(compute.mock.calls.length).toBe(1);
    expect(callback.mock.calls.length).toBe(0);
    expect(compute.mock.results[0].value).toBe(3);
    a.value += 3;
    expect(compute.mock.calls.length).toBe(2);
    expect(callback.mock.calls.length).toBe(1);
    expect(compute.mock.results[1].value).toBe(6);
    expect(callback.mock.calls[0][0]).toBe(6);
    expect(callback.mock.calls[0][1]).toBe(3);
    c.value *= 2;
    expect(compute.mock.calls.length).toBe(2);
    expect(compute.mock.results[2]).toBe(undefined);
    expect(callback.mock.calls.length).toBe(1);
    unwatch();
    a.value += 3;
    expect(compute.mock.calls.length).toBe(2);
    expect(compute.mock.results[2]).toBe(undefined);
    expect(callback.mock.calls.length).toBe(1);
  });

  it('computed API works', () => {
    const a = value(1);
    const b = computed(() => a.value * 2);
    const c = computed(() => b.value * 2);
    expect(a.value).toBe(1);
    expect(b.value).toBe(2);
    expect(c.value).toBe(4);
    a.value += 1;
    expect(a.value).toBe(2);
    expect(b.value).toBe(4);
    expect(c.value).toBe(8);
  });

  it('computed value should collect dependency if value is not read at first', () => {
    const a = value(0);
    const b = value(-10);
    const c = computed(() => {
      if (a.value) {
        return b.value;
      }
      return a.value;
    });
    expect(a.value).toBe(0);
    expect(b.value).toBe(-10);
    expect(c.value).toBe(0);
    a.value += 1;
    expect(a.value).toBe(1);
    expect(b.value).toBe(-10);
    expect(c.value).toBe(-10);
    b.value += 1;
    expect(a.value).toBe(1);
    expect(b.value).toBe(-9);
    expect(c.value).toBe(-9);
  });
});
