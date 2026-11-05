/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string
  readonly VITE_WEB3FORMS_ACCESS_KEY?: string
  readonly VITE_CONTACT_ENDPOINT?: string
  readonly VITE_SHOW_PLACEHOLDERS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare const __BUILD_YEAR__: number
