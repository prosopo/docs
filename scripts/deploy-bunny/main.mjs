import { parseArgs } from 'node:util';
import { createStorageClient, syncDirectory } from './sync.mjs';

const { values } = parseArgs({ options: { dir: { type: 'string', default: 'dist' } } });
const zone = process.env.BUNNY_STORAGE_ZONE;
const password = process.env.BUNNY_STORAGE_PASSWORD;
if (!zone || !password) {
	console.error('BUNNY_STORAGE_ZONE and BUNNY_STORAGE_PASSWORD must be set');
	process.exit(1);
}
await syncDirectory({ root: values.dir, client: createStorageClient({ zone, password }) });
