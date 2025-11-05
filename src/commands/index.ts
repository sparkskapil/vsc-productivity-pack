import * as vscode from 'vscode';

// Import all command handlers
import { p4Annotate } from './annotate';
import { gitBlame } from './gitBlame';

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

	// Future commands can be added here:
	// context.subscriptions.push(
	//   vscode.commands.registerCommand('vscpp.p4.diff', p4Diff)
	// );
}
