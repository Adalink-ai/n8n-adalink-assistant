// Type declarations for missing dependencies

// For request-promise-native
declare module 'request-promise-native' {
  export interface RequestPromiseOptions {
    [key: string]: any;
  }
}

// For @n8n_io/riot-tmpl
declare module '@n8n_io/riot-tmpl' {
  const tmpl: any;
  export = tmpl;
}
