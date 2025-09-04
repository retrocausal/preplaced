declare global {
  interface GlobalThis {
    appHost?: HTMLElement | null;
  }
  interface Window {
    appHost?: HTMLElement | null;
  }
}
export {};
