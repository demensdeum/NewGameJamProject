export class SceneObject {
    public name: string;
    public threeObject: any;    

    constructor(
        name: string,
        threeObject: any
    ) {
        this.name = name;
        this.threeObject = threeObject;
    }
}