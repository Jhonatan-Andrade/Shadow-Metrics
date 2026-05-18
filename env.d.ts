interface ImportMetaEnv {
  readonly VITE_ZABBIX_API_TOKEN: string;
  readonly VITE_ZABBIX_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}