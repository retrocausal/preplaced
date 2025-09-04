const BASE = "/chat";

const PATHS = {
  AUTH: "/auth/login",
};

export default new Proxy(PATHS, {
  get(target, key) {
    const value = target[key as keyof typeof PATHS];
    return value ? `${BASE}${value}` : null;
  },
});
