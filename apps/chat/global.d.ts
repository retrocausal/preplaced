declare global {
  interface GlobalThis {
    appHost?: HTMLElement | null;
  }
  interface Window {
    appHost?: HTMLElement | null;
  }
}

interface ImportMetaEnv {
  readonly VITE_API_HOST: string;
  readonly VITE_APP_BASE: string;
  // Add other VITE_* variables
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
