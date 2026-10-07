/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Set to "hash" to use #/path URLs (for hosts without SPA rewrites). */
  readonly VITE_ROUTER?: string
  /** Set to "true" to show the dashed "fill this in" hints in a production build. */
  readonly VITE_SHOW_TODOS?: string
}
