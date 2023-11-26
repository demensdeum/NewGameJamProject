export class Utils {
    static angleToRadians(angle) {
        return angle * Math.PI / 180;
    }
    static randomInt(max) {
        return Math.floor(Math.random() * max);
    }
    static randomBool() {
        const randomBool = () => Math.random() < 0.5;
        return randomBool;
    }
    static shuffle(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]
            ];
        }
        return array;
    }
    ;
}
