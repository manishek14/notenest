import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import * as path from 'path';

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
  useFactory: () => {
    const fs = require('fs');
    const dbPath = path.join(process.cwd(), 'data', 'notenest.db');
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    return {
      type: 'better-sqlite3',
      database: dbPath,
      autoLoadEntities: true,
      synchronize: true,
      entities: [path.join(__dirname, '**', '*.entity.js')],
    } as any;
  },
};
