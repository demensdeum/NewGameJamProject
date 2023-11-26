export class Translator {
    constructor(locale) {
        this.locale = "ru";
        this.dictionary = {
            "en": {
                "Score": "Score",
                "Speed": "Speed"
            },
            "ru": {
                "Score": "Очки",
                "Speed": "Скорость"
            }
        };
        this.locale = locale;
    }
    translatedStringForKey(key) {
        const output = this.dictionary[this.locale][key];
        return output;
    }
}
