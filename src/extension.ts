'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { KeyedCollection } from './KeyedCollection';
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
        var dict = new KeyedCollection<number>();
        words.forEach(word => {
            if (!dict.ContainsKey(word)) {
                dict.Add(word, 1);
            }
            else {
                let value = dict.Item(word);
                dict.Add(word, value + 1);
            }
        });

        let pairs = dict
            .Keys()
            .map(key => {
                return {
                    word: key,
                    count: dict.Item(key)
                };
            })
            .sort((pair1, pair2) => { return pair2.count - pair1.count; });

        channel.appendLine('Text stats:');
        channel.appendLine(`Words count is ${dict.Count()}`);
        channel.appendLine('Word count detail:');
        pairs.forEach(pair => { channel.appendLine(`'${pair.word}': ${pair.count}`); });
        channel.show();
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}