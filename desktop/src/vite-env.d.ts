/// <reference types="vite/client" />

interface Window {
  psud?: {
    getVersion: () => Promise<string>;
    getPlatform: () => Promise<string>;
    platform: string;
  };
}
