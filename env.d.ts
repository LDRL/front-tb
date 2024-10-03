/// <reference types="vite/client" />

interface ImportMetaEnv {
    VITE_API_URL: string;
    // VITE_APP_NAME: string;
    // Añade otras variables de entorno aquí
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }