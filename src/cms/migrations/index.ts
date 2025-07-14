import * as migration_20250714_091107 from './20250714_091107';

export const migrations = [
  {
    up: migration_20250714_091107.up,
    down: migration_20250714_091107.down,
    name: '20250714_091107'
  },
];
