import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { createStorageClient, listLocalFiles, planSync, syncDirectory } from './sync.mjs';

const response = (status, body) =>
	new Response(body === undefined ? null : JSON.stringify(body), { status });

test('planSync uploads every local file and removes only remote leftovers', () => {
	assert.deepEqual(planSync(['a.html', 'b/c.js'], ['a.html', 'old.html']), {
		upload: ['a.html', 'b/c.js'],
		remove: ['old.html'],
	});
});

test('listLocalFiles returns sorted slash-separated paths', async () => {
	const root = await mkdtemp(join(tmpdir(), 'bunny-'));
	try {
		await mkdir(join(root, 'en', 'basics'), { recursive: true });
		await writeFile(join(root, 'index.html'), 'x');
		await writeFile(join(root, 'en', 'basics', 'index.html'), 'y');
		assert.deepEqual(await listLocalFiles(root), ['en/basics/index.html', 'index.html']);
	} finally {
		await rm(root, { recursive: true });
	}
});

test('list walks directories recursively', async () => {
	const tree = {
		'': [
			{ ObjectName: 'en', IsDirectory: true },
			{ ObjectName: 'index.html', IsDirectory: false },
		],
		'en/': [{ ObjectName: 'a.html', IsDirectory: false }],
	};
	const client = createStorageClient({
		zone: 'z',
		password: 'p',
		fetchFn: async (url) => response(200, tree[url.replace('https://storage.bunnycdn.com/z/', '')]),
	});
	assert.deepEqual(await client.list(), ['en/a.html', 'index.html']);
});

test('requests retry on 429, 5xx and network errors, then give up', async () => {
	const outcomes = [503, 429, 'throw', 201];
	const fetchFn = async () => {
		const next = outcomes.shift();
		if (next === 'throw') throw new Error('timed out');
		return response(next);
	};
	const client = createStorageClient({ zone: 'z', password: 'p', fetchFn, backoffMs: 1 });
	await client.put('a', 'x');
	assert.equal(outcomes.length, 0);
	const failing = createStorageClient({
		zone: 'z',
		password: 'p',
		fetchFn: async () => response(401),
	});
	await assert.rejects(failing.put('a', 'x'), /HTTP 401/);
	const unreachable = createStorageClient({
		zone: 'z',
		password: 'p',
		backoffMs: 1,
		fetchFn: async () => {
			throw new Error('timed out');
		},
	});
	await assert.rejects(unreachable.put('a', 'x'), /PUT a: timed out/);
});

test('syncDirectory deletes stale files only after uploads, sending the access key', async () => {
	const root = await mkdtemp(join(tmpdir(), 'bunny-'));
	const calls = [];
	try {
		await writeFile(join(root, 'index.html'), 'x');
		const fetchFn = async (url, init) => {
			calls.push(`${init.method} ${url.split('/z/')[1]}`);
			assert.equal(init.headers.AccessKey, 'secret');
			return init.method === 'GET'
				? response(200, [{ ObjectName: 'gone.html', IsDirectory: false }])
				: response(201);
		};
		const plan = await syncDirectory({
			root,
			client: createStorageClient({ zone: 'z', password: 'secret', fetchFn }),
			log: () => {},
		});
		assert.deepEqual(plan, { upload: ['index.html'], remove: ['gone.html'] });
		assert.deepEqual(calls, ['GET ', 'PUT index.html', 'DELETE gone.html']);
	} finally {
		await rm(root, { recursive: true });
	}
});
