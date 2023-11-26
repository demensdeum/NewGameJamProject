export class Translator {

    private locale: string = "ru"

    private readonly dictionary: { [key: string]: { [key: string]: string } } = {
        "en" : {
            "Score" : "Score",
            "Speed" : "Speed"
        },
        "ru" : {
            "Score" : "Очки",
            "Speed" : "Скорость"
        }
    };

    constructor(locale: string) {
        this.locale = locale;
    }

    public translatedStringForKey(key: string): string {
        const output = this.dictionary[this.locale][key];
        return output;
    }
}