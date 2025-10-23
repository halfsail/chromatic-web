import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

const file = fileURLToPath(new URL('package.json', import.meta.url));
const json = readFileSync(file, 'utf8');
const pkg = JSON.parse(json);

import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter: adapter(
		// 	{
		// 		pages: 'build',
		// 		assets: 'build',
		// 		fallback: undefined,
		// 		precompress: false,
		// 		strict: true,
		// 	},
		// ),
		version: {
            name: pkg.version,
        },
		adapter: adapter(),
		output: {
			bundleStrategy: 'inline',
		}
	}
};

export default config;
