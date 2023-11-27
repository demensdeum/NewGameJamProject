export class Translator {
    constructor(locale) {
        this.locale = "ru";
        this.dictionary = {
            "en": {
                "Score": "Score",
                "Speed": "Speed",
                "Message": "Message",
                "Music cube!": "Music cube!",
                "Speed boost!": "Speed boost!",
                "Time": "Time",
                "Game Started!": "Game Started!"
            },
            "ru": {
                "Score": "Очки",
                "Speed": "Скорость",
                "Message": "Сообщение",
                "Music cube!": "Музыкальный куб!",
                "Speed boost!": "Ускорение!",
                "Time": "Время",
                "Game Started!": "Игра началась!"
            }
        };
        this.locale = locale;
    }
    translatedStringForKey(key) {
        const output = this.dictionary[this.locale][key];
        return output;
    }
}
