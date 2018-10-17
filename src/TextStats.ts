export class TextStats {
    public static Spacify(text: string): string {
        var result = text.replace(/[\W\d]/g, ' ');

        return result;
    }
}