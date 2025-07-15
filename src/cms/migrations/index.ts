import * as migration_20250714_091107 from './20250714_091107';
import * as migration_20250715_194825 from './20250715_194825';

export const migrations = [
  {
    up: migration_20250714_091107.up,
    down: migration_20250714_091107.down,
    name: '20250714_091107',
  },
  {
    up: migration_20250715_194825.up,
    down: migration_20250715_194825.down,
    name: '20250715_194825'
  },
];
