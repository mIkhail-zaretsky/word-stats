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
    private static _prefix: string = 'item_';
 
    private count: number = 0;

    public ContainsKey(key: string): boolean {
        return this.items.hasOwnProperty(KeyedCollection.GetMaskedKey(key));
    }
 
    public Count(): number {
        return this.count;
    }
 
    public Add(key: string, value: T) {
        let actualKey = KeyedCollection.GetMaskedKey(key)
        if (!this.items.hasOwnProperty(actualKey)) {
             this.count++;
        }
 
        this.items[actualKey] = value;

        return true;
    }
 
    public Remove(key: string): T {
        let actualKey = KeyedCollection.GetMaskedKey(key);
        var val = this.items[actualKey];
        delete this.items[actualKey];
        this.count--;
        return val;
    }
 
    public Item(key: string): T {
        return this.items[KeyedCollection.GetMaskedKey(key)];
    }
 
    public Keys(): string[] {
        var keySet: string[] = [];
 
        for (var prop in this.items) {
            if (this.items.hasOwnProperty(prop)) {
                keySet.push(KeyedCollection.UnmaskActualKey(prop));
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

    private static GetMaskedKey(key: string): string {
        return this._prefix + key;
    }

    private static UnmaskActualKey(actualKey: string): string {
        return actualKey.substr(this._prefix.length);
    }
}