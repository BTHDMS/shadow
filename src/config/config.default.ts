import { IConfig } from './configuration';

export function defineConfig(config: IConfig): IConfig {
  return config;
}

export default defineConfig({
    storageAccount:process.env.storageAccount,
    adm:process.env.adm,

});
