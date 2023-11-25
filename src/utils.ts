export class Utils {
    public static angleToRadians(angle: number) {
        return angle * Math.PI / 180;
    }
    public static randomInt(max: number) {
        return Math.floor(Math.random() * max);
    }
}