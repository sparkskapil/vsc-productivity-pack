import { exec } from 'child_process';
import { promisify } from 'util';
import * as vscode from 'vscode';

const execAsync = promisify(exec);

/**
 * Validates if the given directory is part of a Perforce workspace
 * Checks for P4CLIENT, P4PORT, and P4USER configuration
 */
export async function validateP4Workspace(directory: string): Promise<boolean> {
	try {
		const { stdout } = await execAsync('p4 set', { cwd: directory });
		const hasP4Client = stdout.includes('P4CLIENT=');
		const hasP4Port = stdout.includes('P4PORT=');
		const hasP4User = stdout.includes('P4USER=');

		if (!hasP4Client || !hasP4Port || !hasP4User) {
			vscode.window.showErrorMessage(
				'This file is not in a Perforce workspace. ' +
				'Please ensure P4CLIENT, P4PORT, and P4USER are set. ' +
				'Add a p4config.txt file in your depot root or run "p4 set P4CONFIG=p4config.txt"'
			);
			return false;
		}
		return true;
	} catch (error: any) {
		if (error.message.includes('p4: command not found') || error.message.includes('is not recognized')) {
			vscode.window.showErrorMessage('Perforce (p4) command not found. Make sure Perforce is installed and in your PATH');
		} else {
			vscode.window.showErrorMessage('Failed to check Perforce configuration: ' + error.message);
		}
		return false;
	}
}

/**
 * Executes a Perforce command in the given directory
 */
export async function executeP4Command(command: string, directory: string): Promise<{ stdout: string; stderr: string }> {
	return execAsync(command, { cwd: directory });
}
