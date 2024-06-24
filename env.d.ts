/// <reference types="vite/client" />

// eslint-disable-next-line import/unambiguous
interface ImportMetaEnv {
  // DYNAMIC UI
  readonly VITE_DYNAMIC_PROJECT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
