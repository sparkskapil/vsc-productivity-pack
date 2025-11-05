import * as vscode from 'vscode';

// Import all command handlers
import { p4Annotate } from './annotate';

/**
 * Register all commands for the VSC Productivity Pack extension
 */
export function registerCommands(context: vscode.ExtensionContext) {
	// Perforce commands
	context.subscriptions.push(
		vscode.commands.registerCommand('vscpp.p4.annotate', p4Annotate)
	);

	// Future commands can be added here:
	// context.subscriptions.push(
	//   vscode.commands.registerCommand('vscpp.p4.diff', p4Diff)
	// );
}
