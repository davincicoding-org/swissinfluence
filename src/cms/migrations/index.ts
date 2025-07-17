import * as migration_20250714_091107 from './20250714_091107';
import * as migration_20250715_194825 from './20250715_194825';
import * as migration_20250716_094611 from './20250716_094611';
import * as migration_20250716_113811 from './20250716_113811';
import * as migration_20250716_123504 from './20250716_123504';
import * as migration_20250716_134904 from './20250716_134904';
import * as migration_20250716_161810 from './20250716_161810';
import * as migration_20250717_174441 from './20250717_174441';

export const migrations = [
  {
    up: migration_20250714_091107.up,
    down: migration_20250714_091107.down,
    name: '20250714_091107',
  },
  {
    up: migration_20250715_194825.up,
    down: migration_20250715_194825.down,
    name: '20250715_194825',
  },
  {
    up: migration_20250716_094611.up,
    down: migration_20250716_094611.down,
    name: '20250716_094611',
  },
  {
    up: migration_20250716_113811.up,
    down: migration_20250716_113811.down,
    name: '20250716_113811',
  },
  {
    up: migration_20250716_123504.up,
    down: migration_20250716_123504.down,
    name: '20250716_123504',
  },
  {
    up: migration_20250716_134904.up,
    down: migration_20250716_134904.down,
    name: '20250716_134904',
  },
  {
    up: migration_20250716_161810.up,
    down: migration_20250716_161810.down,
    name: '20250716_161810',
  },
  {
    up: migration_20250717_174441.up,
    down: migration_20250717_174441.down,
    name: '20250717_174441'
  },
];
