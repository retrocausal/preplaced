export default function Proxify(Object: Record<string, string>, BASE: string) {
  const proxy = new Proxy(Object, {
    get(target, key) {
      const value = target[key as keyof typeof Object];
      return value ? `${BASE}${value}` : null;
    },
  });
  return proxy;
}
