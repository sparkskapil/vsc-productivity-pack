import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Command to run git blame on the currently active file
 * Generates a blame file with user and code on each line
 */
export async function gitBlame() {
	try {
		// Get the active text editor
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage('No active file to blame');
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
			vscode.window.showWarningMessage('Please save the file before running git blame');
			return;
		}

		// Check if the file is in a Git repository
		const fileDir = path.dirname(filePath);
		try {
			await execAsync('git rev-parse --git-dir', { cwd: fileDir });
		} catch (error) {
			vscode.window.showErrorMessage('This file is not in a Git repository');
			return;
		}

		// Check if the file is tracked by Git
		try {
			await execAsync(`git ls-files --error-unmatch "${filePath}"`, { cwd: fileDir });
		} catch (error) {
			vscode.window.showErrorMessage('This file is not tracked by Git. Add it to the repository first.');
			return;
		}

		// Get temp directory
		const tempDir = process.env.TMPDIR || process.env.TEMP || process.env.TMP || '/tmp';
		const gitBlameDir = path.join(tempDir, 'gitblame');

		// Create the gitblame directory if it doesn't exist
		if (!fs.existsSync(gitBlameDir)) {
			fs.mkdirSync(gitBlameDir, { recursive: true });
		}

		// Generate output file name
		const fileName = path.basename(filePath);
		const outputFile = path.join(gitBlameDir, `${fileName}.blame`);

		// Show progress
		await vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			title: "Running git blame...",
			cancellable: false
		}, async (progress) => {
			try {
				// Run git blame with --line-porcelain format for detailed info
				// Then parse and format it
				const command = `git blame --line-porcelain "${filePath}"`;
				const { stdout } = await execAsync(command, { cwd: fileDir });

				// Parse git blame porcelain output
				const lines = stdout.split('\n');
				const blameLines: string[] = [];
				let currentCommit = '';
				let currentAuthor = '';
				let currentLine = '';

				for (let i = 0; i < lines.length; i++) {
					const line = lines[i];
					
					// First line of each blame block contains the commit hash
					if (line.match(/^[0-9a-f]{40}/)) {
						currentCommit = line.split(' ')[0].substring(0, 8); // Short commit ID (8 chars)
					} else if (line.startsWith('author ')) {
						currentAuthor = line.substring(7);
					} else if (line.startsWith('\t')) {
						// This is the actual code line
						currentLine = line.substring(1);
						blameLines.push(`${currentCommit} ${currentAuthor.padEnd(20)} ${currentLine}`);
					}
				}

				// Write output to file
				fs.writeFileSync(outputFile, blameLines.join('\n'));

				// Open the generated file
				const doc = await vscode.workspace.openTextDocument(outputFile);
				await vscode.window.showTextDocument(doc);

				vscode.window.showInformationMessage(`Git blame file created: ${outputFile}`);
			} catch (error: any) {
				if (error.message.includes('git: command not found') || error.message.includes('is not recognized')) {
					vscode.window.showErrorMessage('Git command not found. Make sure Git is installed and in your PATH');
				} else if (error.message.includes('no such path')) {
					vscode.window.showErrorMessage('File not tracked in Git repository');
				} else {
					vscode.window.showErrorMessage(`git blame failed: ${error.message}`);
				}
				throw error;
			}
		});
	} catch (error: any) {
		console.error('Error running git blame:', error);
	}
}
