import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const clientDir = join(process.cwd(), 'dist', 'client');
const pagesDir = join(process.cwd(), 'dist', 'pages');
const prefixedAssetsDir = join(clientDir, 'Roomie');

await rm(pagesDir, { recursive: true, force: true });
await mkdir(pagesDir, { recursive: true });
await cp(prefixedAssetsDir, pagesDir, { recursive: true });

for (const file of ['index.html', 'index.rsc', 'favicon.svg', 'og.png']) {
  await cp(join(clientDir, file), join(pagesDir, file));
}

await writeFile(join(pagesDir, '.nojekyll'), '');
