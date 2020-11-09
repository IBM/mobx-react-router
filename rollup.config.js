import { register } from 'ts-node';

import tsconfig from './tsconfig.json';

register({
  compilerOptions: tsconfig.compilerOptions
});

module.exports = require('./rollup.config.ts');
