/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PXE_URL: string;
  // podés declarar otras vars si las necesitás
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
