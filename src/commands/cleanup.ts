import * as vscode from 'vscode';
import { clearVscppTemp, getVscppTempSize, formatBytes, getVscppTempRoot } from '../utils/tempFolder';

/**
 * Command to clean up temporary files created by VSC Productivity Pack
 */
export async function cleanupTempFiles() {
	try {
		const tempRoot = getVscppTempRoot();
		const currentSize = getVscppTempSize();
		
		if (currentSize === 0) {
			vscode.window.showInformationMessage('VSC Productivity Pack: No temporary files to clean up.');
			return;
		}
		
		// Ask for confirmation
		const sizeStr = formatBytes(currentSize);
		const choice = await vscode.window.showWarningMessage(
			`Delete all VSC Productivity Pack temporary files? (${sizeStr} in ${tempRoot})`,
			{ modal: true },
			'Delete',
			'Cancel'
		);
		
		if (choice !== 'Delete') {
			return;
		}
		
		// Show progress while cleaning
		await vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			title: "Cleaning up temporary files...",
			cancellable: false
		}, async (progress) => {
			try {
				const deletedCount = clearVscppTemp();
				
				vscode.window.showInformationMessage(
					`VSC Productivity Pack: Cleaned up ${deletedCount} item(s), freed ${sizeStr}`
				);
			} catch (error: any) {
				vscode.window.showErrorMessage(
					`Failed to clean up temporary files: ${error.message}`
				);
				throw error;
			}
		});
	} catch (error: any) {
		console.error('Error cleaning up temp files:', error);
	}
}
