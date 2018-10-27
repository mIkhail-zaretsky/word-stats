export class TextStats {
    public static Spacify(text: string): string {
        var result = text.replace(/[\W\d]/g, ' ');

        return result;
    }
}

export class WordStats {
    words: Map<string, number>;

    constructor(words: Map<string, number>) {
        this.words = words;
    }

    static fromText(text: string): WordStats {
        text = TextStats.Spacify(text);
        var words = text.split(' ').filter(word => word && word.length > 0);
        var map = new Map();
        words.forEach(word => {
            var count = map.get(word) | 0;
            map.set(word, count + 1);
        });
        
        return new WordStats(map);
    }

    static Emtpy: WordStats = new WordStats(new Map());
    
    getStats(): [string, number][] {
        var entries: [string, number][] = [];
        for (let entry of this.words) {
            entries.push(entry);
        }
        entries.sort((entry1, entry2) => { return entry2[1] - entry1[1]; });
        return entries;
    }

    with(other: WordStats): WordStats {
        var result = new Map();
        for (let entry of this.words) {
            result.set(entry[0], entry[1]);
        }

        for (let entry of other.words) {
            var word = entry[0];
            var thisCount = this.words.get(word) || 0;
            var otherCount = other.words.get(word) || 0;
            var count = thisCount + otherCount;
            result.set(word, count);
        }
        return new WordStats(result);
    }

    withText(text: string): WordStats {
        return this.with(WordStats.fromText(text));
    }
}