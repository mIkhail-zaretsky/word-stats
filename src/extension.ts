'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { WordStats } from './TextStats';
import fs = require('fs');
//import { readFileSync, readdir } from 'fs';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "word-stats" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let calculateWordStatsCommand = vscode.commands.registerCommand('extension.calculateWordStats', () => {
        // The code you place here will be executed every time your command is executed
        if (!vscode.window.activeTextEditor)
        {
            vscode.window.showWarningMessage('No active editor. Please, open something to calculate statistics');
            return;
        }
        
        var channel = vscode.window.createOutputChannel('Word stats');
        channel.clear();

        var text = vscode.window.activeTextEditor.document.getText();
        var stats = WordStats.fromText(text).getStats();

        channel.appendLine('Text stats:');
        channel.appendLine(`Words count is ${stats.length}`);
        channel.appendLine('Word count detail:');
        stats.forEach(entry => { channel.appendLine(`'${entry[0]}': ${entry[1]}`); });
        channel.show();
    });

    let calculateFolderWordStatsCommand = vscode.commands.registerCommand('extension.calculateFolderWordStats', (uri: vscode.Uri) => {
        if (!uri) {
            vscode.window.showWarningMessage('Folder to search not found.');
            return;
        }

        var channel = vscode.window.createOutputChannel('Word stats');
        channel.clear();

        var wordStats = WordStats.Emtpy;
        try {
            let files = fs.readdirSync(uri.fsPath, );
            files.forEach(fileName => {
                let fullFilename = uri.fsPath + '\\' + fileName;
                try{
                    let content = fs.readFileSync(fullFilename, 'utf8');
                    channel.appendLine('Analyzing ' + fullFilename);
                    wordStats = wordStats.withText(content);
                }
                catch(_) {}
            });
        }
        catch(ex){
            vscode.window.showErrorMessage('Failed to read folder.');
            channel.appendLine(ex);
        }

        let stats = wordStats.getStats();
        channel.appendLine('Text stats:');
        channel.appendLine(`Words count is ${stats.length}`);
        channel.appendLine('Word count detail:');
        stats.forEach(entry => { channel.appendLine(`'${entry[0]}': ${entry[1]}`); });
        channel.show();
    });

    context.subscriptions.push(calculateWordStatsCommand);
    context.subscriptions.push(calculateFolderWordStatsCommand);
}

// this method is called when your extension is deactivated
export function deactivate() {
}