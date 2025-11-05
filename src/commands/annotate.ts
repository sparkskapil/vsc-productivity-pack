import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { validateP4Workspace, executeP4Command } from '../utils/p4Client';

/**
 * Command to run p4 annotate on the currently active file
 */
export async function p4Annotate() {
	try {
		// Get the active text editor
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage('No active file to annotate');
			return;
		}

		// Get the file path
		const filePath = editor.document.uri.fsPath;
		if (!filePath) {
			vscode.window.showErrorMessage('Cannot get file path');
			return;
		}

		// Check if file is saved
		if (editor.document.isDirty) {
			vscode.window.showWarningMessage('Please save the file before running annotate');
			return;
		}

		// Check if the file is in a Perforce workspace
		const fileDir = path.dirname(filePath);
		const isValidWorkspace = await validateP4Workspace(fileDir);
		if (!isValidWorkspace) {
			return;
		}

		// Get temp directory (using TMPDIR, TEMP, or TMP environment variable, or /tmp on Linux)
		const tempDir = process.env.TMPDIR || process.env.TEMP || process.env.TMP || '/tmp';
		const p4annotateDir = path.join(tempDir, 'p4annotate');

		// Create the p4annotate directory if it doesn't exist
		if (!fs.existsSync(p4annotateDir)) {
			fs.mkdirSync(p4annotateDir, { recursive: true });
		}

		// Generate output file name
		const fileName = path.basename(filePath);
		const outputFile = path.join(p4annotateDir, `${fileName}.blame`);

		// Show progress
		await vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			title: "Running p4 annotate...",
			cancellable: false
		}, async (progress) => {
			// Run p4 annotate command
			const command = `p4 annotate -c -u "${filePath}"`;
			
			try {
				const { stdout } = await executeP4Command(command, fileDir);
				
				// Write output to file
				fs.writeFileSync(outputFile, stdout);
				
				// Open the generated file
				const doc = await vscode.workspace.openTextDocument(outputFile);
				await vscode.window.showTextDocument(doc);
				
				vscode.window.showInformationMessage(`Annotate file created: ${outputFile}`);
			} catch (error: any) {
				// Check if it's a Perforce error
				if (error.message.includes('not opened on this client')) {
					vscode.window.showErrorMessage('File is not in Perforce depot');
				} else if (error.message.includes('p4: command not found') || error.message.includes('is not recognized')) {
					vscode.window.showErrorMessage('Perforce (p4) command not found. Make sure Perforce is installed and in your PATH');
				} else {
					vscode.window.showErrorMessage(`p4 annotate failed: ${error.message}`);
				}
				throw error;
			}
		});
	} catch (error: any) {
		console.error('Error running p4 annotate:', error);
	}
}
