var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.angleToRadians = function (angle) {
        return angle * Math.PI / 180;
    };
    Utils.randomInt = function (max) {
        return Math.floor(Math.random() * max);
    };
    return Utils;
}());
export { Utils };
