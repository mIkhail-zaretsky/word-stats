export class TextUtils {
    public static Spacify(text: string): string {
        var result = text.replace(/[\W\d]/g, ' ');

        return result;
    }
}

export class WordStats {
    count: number;
    positions: Array<number>;

    constructor(count: number, positions: Array<number>) {
        this.count = count;
        this.positions = positions;
    }

    static Empty: WordStats = new WordStats(0, []);

    withCount(count: number): WordStats {
        return new WordStats(count, this.positions);
    }

    withPositions(positions: Array<number>): WordStats {
        return new WordStats(this.count, positions);
    }
}

export class TextStats {
    length: number;
    wordStats: Map<string, WordStats>;

    constructor(length: number, wordCounts: Map<string, WordStats>) {
        this.length = length;
        this.wordStats = wordCounts;
    }

    static fromText(text: string): TextStats {
        text = TextUtils.Spacify(text);
        var words = text.split(' ').filter(word => word && word.length > 0);
        var map = new Map();
        words.forEach((word, index) => {
            var wordStat = map.get(word) || WordStats.Empty;
            var count = wordStat.count;
            var positions = wordStat.positions.slice();
            positions.push(index);
            map.set(word, wordStat.withCount(count + 1).withPositions(positions));
        });
        
        return new TextStats(words.length, map);
    }

    static Emtpy: TextStats = new TextStats(0, new Map());
    
    getSortedStats(): [string, WordStats][] {
        var entries: [string, WordStats][] = [];
        for (let entry of this.wordStats) {
            entries.push([entry[0], entry[1]]);
        }
        entries.sort((entry1, entry2) => { return entry2[1].count - entry1[1].count; });
        return entries;
    }

    concat(other: TextStats): TextStats {
        var result = new Map();
        for (let entry of this.wordStats) {
            result.set(entry[0], entry[1]);
        }

        for (let entry of other.wordStats) {
            var word = entry[0];
            var thisEntry = this.wordStats.get(word) || WordStats.Empty;
            
            var thisCount = (this.wordStats.get(word) || WordStats.Empty).count;
            var otherCount = (other.wordStats.get(word) || WordStats.Empty).count;
            var count = thisCount + otherCount;

            var positions = thisEntry.positions.concat(entry[1].positions.map(_ => _ + this.length));

            result.set(word, new WordStats(count, positions));
        }
        return new TextStats(this.length + other.length, result);
    }

    concatText(text: string): TextStats {
        return this.concat(TextStats.fromText(text));
    }
}