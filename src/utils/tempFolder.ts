import * as path from 'path';
import * as fs from 'fs';

/**
 * Central temporary folder management for VSC Productivity Pack
 * All commands should use this utility to maintain a consistent temp location
 */

const TEMP_ROOT_NAME = 'vsc-productivity-pack';

/**
 * Gets the base temporary directory for the system
 */
function getSystemTempDir(): string {
	return process.env.TMPDIR || process.env.TEMP || process.env.TMP || '/tmp';
}

/**
 * Gets the root temporary folder for VSC Productivity Pack
 * Creates it if it doesn't exist
 */
export function getVscppTempRoot(): string {
	const tempDir = getSystemTempDir();
	const vscppRoot = path.join(tempDir, TEMP_ROOT_NAME);
	
	if (!fs.existsSync(vscppRoot)) {
		fs.mkdirSync(vscppRoot, { recursive: true });
	}
	
	return vscppRoot;
}

/**
 * Gets a subdirectory within the VSC PP temp folder
 * Creates it if it doesn't exist
 * @param subdir - Name of the subdirectory (e.g., 'p4annotate', 'gitblame')
 */
export function getVscppTempSubdir(subdir: string): string {
	const vscppRoot = getVscppTempRoot();
	const subdirPath = path.join(vscppRoot, subdir);
	
	if (!fs.existsSync(subdirPath)) {
		fs.mkdirSync(subdirPath, { recursive: true });
	}
	
	return subdirPath;
}

/**
 * Clears all temporary files created by VSC Productivity Pack
 * @returns Number of files/directories deleted
 */
export function clearVscppTemp(): number {
	const vscppRoot = getVscppTempRoot();
	let deletedCount = 0;
	
	if (!fs.existsSync(vscppRoot)) {
		return 0;
	}
	
	try {
		const items = fs.readdirSync(vscppRoot);
		
		for (const item of items) {
			const itemPath = path.join(vscppRoot, item);
			const stats = fs.statSync(itemPath);
			
			if (stats.isDirectory()) {
				fs.rmSync(itemPath, { recursive: true, force: true });
			} else {
				fs.unlinkSync(itemPath);
			}
			deletedCount++;
		}
		
		return deletedCount;
	} catch (error) {
		console.error('Error clearing VSC PP temp folder:', error);
		throw error;
	}
}

/**
 * Gets the size of the VSC PP temp folder in bytes
 */
export function getVscppTempSize(): number {
	const vscppRoot = getVscppTempRoot();
	
	if (!fs.existsSync(vscppRoot)) {
		return 0;
	}
	
	let totalSize = 0;
	
	function calculateSize(dirPath: string) {
		const items = fs.readdirSync(dirPath);
		
		for (const item of items) {
			const itemPath = path.join(dirPath, item);
			const stats = fs.statSync(itemPath);
			
			if (stats.isDirectory()) {
				calculateSize(itemPath);
			} else {
				totalSize += stats.size;
			}
		}
	}
	
	calculateSize(vscppRoot);
	return totalSize;
}

/**
 * Formats bytes to human-readable string
 */
export function formatBytes(bytes: number): string {
	if (bytes === 0) {
		return '0 Bytes';
	}
	
	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	
	return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
