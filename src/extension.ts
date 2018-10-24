'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { TextStats } from './TextStats';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "word-stats" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.calculateWordStats', () => {
        // The code you place here will be executed every time your command is executed
        if (!vscode.window.activeTextEditor)
        {
            vscode.window.showWarningMessage('No active editor. Please, open something to calculate statistics');
            return;
        }
        
        var channel = vscode.window.createOutputChannel('Word stats');
        channel.clear();

        var text = vscode.window.activeTextEditor.document.getText();
        text = TextStats.Spacify(text);
        var words = text.split(' ').filter(word => word && word.length > 0);
        var map = new Map();
        words.forEach(word => {
            var count = map.get(word) | 0;
            map.set(word, count + 1);
        });

        var entries: [string, number][] = [];
        for(let entry of map) {
            entries.push(entry);
        }

        entries.sort((entry1, entry2) => { return entry2[1] - entry1[1]; });

        channel.appendLine('Text stats:');
        channel.appendLine(`Words count is ${entries.length}`);
        channel.appendLine('Word count detail:');
        entries.forEach(entry => { channel.appendLine(`'${entry[0]}': ${entry[1]}`); });
        channel.show();
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}