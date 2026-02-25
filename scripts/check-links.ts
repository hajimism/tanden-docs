import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

const CONTENT_DIR = "content/docs";
const LINK_PATTERN = /\[([^\]]*)\]\(\/docs\/([^)#\s]*)/g;

const collectMdxFiles = async (dir: string): Promise<string[]> => {
	const entries = await readdir(dir, { withFileTypes: true, recursive: true });
	return entries
		.filter((e) => e.isFile() && e.name.endsWith(".mdx"))
		.map((e) => join(e.parentPath, e.name));
};

const resolveDocPath = (linkPath: string): string[] => {
	const base = join(CONTENT_DIR, linkPath);
	return [`${base}.mdx`, join(base, "index.mdx")];
};

const fileExists = async (path: string): Promise<boolean> => {
	try {
		await readFile(path);
		return true;
	} catch {
		return false;
	}
};

const checkFile = async (
	filePath: string,
): Promise<{ file: string; text: string; link: string }[]> => {
	const content = await readFile(filePath, "utf-8");
	const broken: { file: string; text: string; link: string }[] = [];

	for (const match of content.matchAll(LINK_PATTERN)) {
		const [, text, linkPath] = match;
		const candidates = resolveDocPath(linkPath);
		const results = await Promise.all(candidates.map(fileExists));
		const exists = results.some(Boolean);
		if (!exists) {
			broken.push({
				file: relative(".", filePath),
				text,
				link: `/docs/${linkPath}`,
			});
		}
	}
	return broken;
};

const main = async () => {
	const files = await collectMdxFiles(CONTENT_DIR);
	const results = await Promise.all(files.map(checkFile));
	const broken = results.flat();

	if (broken.length === 0) {
		console.log("✓ No broken links found.");
		process.exit(0);
	}

	console.error(`✗ Found ${broken.length} broken link(s):\n`);
	for (const { file, text, link } of broken) {
		console.error(`  ${file}`);
		console.error(`    [${text}](${link})\n`);
	}
	process.exit(1);
};

main();
