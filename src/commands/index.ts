import * as vscode from 'vscode';

// Import all command handlers
import { p4Annotate } from './annotate';
import { gitBlame } from './gitBlame';
import { cleanupTempFiles } from './cleanup';

/**
 * Register all commands for the VSC Productivity Pack extension
 */
export function registerCommands(context: vscode.ExtensionContext) {
	// Perforce commands
	context.subscriptions.push(
		vscode.commands.registerCommand('vscpp.p4.annotate', p4Annotate)
	);

	// Git commands
	context.subscriptions.push(
		vscode.commands.registerCommand('vscpp.git.blame', gitBlame)
	);

	// Utility commands
	context.subscriptions.push(
		vscode.commands.registerCommand('vscpp.cleanup', cleanupTempFiles)
	);

	// Future commands can be added here:
	// context.subscriptions.push(
	//   vscode.commands.registerCommand('vscpp.p4.diff', p4Diff)
	// );
}
