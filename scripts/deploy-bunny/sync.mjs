// Mirrors a build directory into a Bunny storage zone: uploads every local file
// and deletes remote files the build no longer produces, so removed pages 404.
import { readFile, readdir } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

export async function listLocalFiles(root) {
	const entries = await readdir(root, { recursive: true, withFileTypes: true });
	return entries
		.filter((entry) => entry.isFile())
		.map((entry) => relative(root, join(entry.parentPath, entry.name)).split(sep).join('/'))
		.sort();
}

export function createStorageClient({
	zone,
	password,
	host = 'storage.bunnycdn.com',
	fetchFn = fetch,
	timeoutMs = 60_000,
	backoffMs = 250,
}) {
	const base = `https://${host}/${zone}/`;
	const headers = { AccessKey: password };
	const request = async (method, path, body) => {
		for (let attempt = 1; ; attempt++) {
			// Bunny storage answers bursts with 429/5xx and occasionally never responds;
			// retrying is safe because PUT and DELETE are idempotent.
			let response;
			try {
				response = await fetchFn(base + path, {
					method,
					headers,
					body,
					signal: AbortSignal.timeout(timeoutMs),
				});
			} catch (error) {
				if (attempt >= 5) throw new Error(`${method} ${path}: ${error.message}`);
			}
			if (
				response &&
				(response.ok ||
					response.status === 404 ||
					attempt >= 5 ||
					(response.status < 500 && response.status !== 429))
			) {
				return response;
			}
			await new Promise((resolve) => setTimeout(resolve, 2 ** attempt * backoffMs));
		}
	};
	return {
		async list(dir = '') {
			const response = await request('GET', dir);
			if (response.status === 404) return [];
			if (!response.ok) throw new Error(`list ${dir}: HTTP ${response.status}`);
			const items = await response.json();
			const nested = await Promise.all(
				items.map((item) =>
					item.IsDirectory ? this.list(`${dir}${item.ObjectName}/`) : [`${dir}${item.ObjectName}`]
				)
			);
			return nested.flat().sort();
		},
		async put(path, body) {
			const response = await request('PUT', path, body);
			if (!response.ok) throw new Error(`upload ${path}: HTTP ${response.status}`);
		},
		async remove(path) {
			const response = await request('DELETE', path);
			if (!response.ok && response.status !== 404)
				throw new Error(`delete ${path}: HTTP ${response.status}`);
		},
	};
}

export function planSync(localFiles, remoteFiles) {
	const local = new Set(localFiles);
	return { upload: [...localFiles], remove: remoteFiles.filter((file) => !local.has(file)) };
}

async function inPool(items, size, task) {
	const queue = [...items];
	const worker = async () => {
		for (let item = queue.shift(); item !== undefined; item = queue.shift()) await task(item);
	};
	await Promise.all(Array.from({ length: Math.min(size, items.length) }, worker));
}

export async function syncDirectory({ root, client, concurrency = 16, log = console.log }) {
	const plan = planSync(await listLocalFiles(root), await client.list());
	await inPool(plan.upload, concurrency, async (file) =>
		client.put(file, await readFile(join(root, file)))
	);
	// Delete only after every upload succeeded, so a failed deploy never leaves the site missing pages.
	await inPool(plan.remove, concurrency, (file) => client.remove(file));
	log(
		JSON.stringify({
			event: 'bunny_sync',
			uploaded: plan.upload.length,
			deleted: plan.remove.length,
		})
	);
	return plan;
}
