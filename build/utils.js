export class Utils {
    static angleToRadians(angle) {
        return angle * Math.PI / 180;
    }
    static randomInt(max) {
        return Math.floor(Math.random() * max);
    }
}
