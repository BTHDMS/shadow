import { Logger } from '@nestjs/common';
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import { mergeDeep } from '../utils/merge_deep';

export default () => {
    let envConfig: IConfig = {};
    let defaultConfig: IConfig = {};
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      defaultConfig = require(`./config.default`).default;
      envConfig = yaml.load(
        readFileSync(
          join(__dirname, `../../config.yml`),
          'utf8',
        ),
      ) as IConfig;
      //合并配置
      envConfig = mergeDeep(envConfig, defaultConfig);
    } catch (e) {
      const logger = new Logger('ConfigModule');
      logger.error(e);
    }
  
    // 返回环境配置
    return envConfig;
  };

export interface IConfig {
    storageAccount?: string;
    adm?: string;
  }