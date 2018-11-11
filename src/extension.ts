'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { TextStats, WordStats } from './TextStats';
import fs = require('fs');

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
        var textStats = TextStats.fromText(text);
        var stats = textStats.getSortedStats();

        renderResults(channel, stats, textStats.length);
    });

    let calculateFolderWordStatsCommand = vscode.commands.registerCommand('extension.calculateFolderWordStats', (uri: vscode.Uri) => {
        if (!uri) {
            vscode.window.showWarningMessage('Folder to search not found.');
            return;
        }

        var channel = vscode.window.createOutputChannel('Word stats');
        channel.clear();

        var textStats = TextStats.Emtpy;
        try {
            let files = fs.readdirSync(uri.fsPath, );
            files.forEach(fileName => {
                let fullFilename = uri.fsPath + '\\' + fileName;
                try{
                    let content = fs.readFileSync(fullFilename, 'utf8');
                    channel.appendLine('Analyzing ' + fullFilename);
                    textStats = textStats.concatText(content);
                }
                catch(_) {}
            });
        }
        catch(ex){
            vscode.window.showErrorMessage('Failed to read folder.');
            channel.appendLine(ex);
        }

        let stats = textStats.getSortedStats();
        renderResults(channel, stats, textStats.length);
    });

    context.subscriptions.push(calculateWordStatsCommand);
    context.subscriptions.push(calculateFolderWordStatsCommand);
}

function renderResults(channel: vscode.OutputChannel, stats: [string, WordStats][], textLength: number) {
    channel.appendLine('Text stats:');
    channel.appendLine(`Words count is ${stats.length}`);
    channel.appendLine('Word count detail:');
    stats.forEach(entry => {
        var countInfo = `'${entry[0]}': ${entry[1].count}`;
        var padEnd = Math.max(50 - countInfo.length, 0);
        var pad = Array(padEnd).fill(' ').join('');
        channel.appendLine(countInfo + pad + getVisualMap(entry[1].positions, textLength));
    });
    channel.show();
}

function getVisualMap(positions: Array<number>, length: number) {
    var viewLength = 50;
    var viewHits = Array(viewLength + 1).fill(0);
    positions.forEach(position => {
        var viewX = Math.round((position * viewLength) / length);
        viewHits[viewX] = viewHits[viewX] + 1;
    });
    
    var max = Math.max(...viewHits);
    var symbols = ['░', '▒', '▓'];

    var spread = viewHits.map(hit => (hit * 9) / max).map(weight => {
        if (weight > 0) {
            var oneOfThree = Math.ceil(weight / 3);
            return symbols[oneOfThree - 1];
        } else {
            return '·';
        }
    }).join('');

    return '[' + spread + ']';
}

// this method is called when your extension is deactivated
export function deactivate() {
}