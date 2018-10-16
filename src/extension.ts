'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

export interface IKeyedCollection<T> {
    Add(key: string, value: T): boolean;
    ContainsKey(key: string): boolean;
    Count(): number;
    Item(key: string): T;
    Keys(): string[];
    Remove(key: string): T;
    Values(): T[];
}

export class KeyedCollection<T> implements IKeyedCollection<T> {
    private items: { [index: string]: T } = {};
 
    private count: number = 0;
 
    public ContainsKey(key: string): boolean {
        return this.items.hasOwnProperty(key);
    }
 
    public Count(): number {
        return this.count;
    }
 
    public Add(key: string, value: T) {
        if (!this.items.hasOwnProperty(key)) {
             this.count++;
        }
 
        this.items[key] = value;

        return true;
    }
 
    public Remove(key: string): T {
        var val = this.items[key];
        delete this.items[key];
        this.count--;
        return val;
    }
 
    public Item(key: string): T {
        return this.items[key];
    }
 
    public Keys(): string[] {
        var keySet: string[] = [];
 
        for (var prop in this.items) {
            if (this.items.hasOwnProperty(prop)) {
                keySet.push(prop);
            }
        }
 
        return keySet;
    }
 
    public Values(): T[] {
        var values: T[] = [];
 
        for (var prop in this.items) {
            if (this.items.hasOwnProperty(prop)) {
                values.push(this.items[prop]);
            }
        }
 
        return values;
    }
}

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
        
        var channel = vscode.window.createOutputChannel('Word statistic results');

        var text = vscode.window.activeTextEditor.document.getText();
        var words = text.split(' ');
        var dict = new KeyedCollection<Number>();
        words.forEach(word => {
            if (!dict.ContainsKey(word)) {
                dict.Add(word, 1);
            }
            else {
                let value = dict.Item(word);
                dict.Remove(word);
                dict.Add(word, value.valueOf() + 1);
            }
        });

        dict.Keys().forEach(key => {
            channel.appendLine(`'${key}': ${dict.Item(key)}`);
        });
        
        channel.show();
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}