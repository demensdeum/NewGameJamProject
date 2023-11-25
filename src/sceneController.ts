import { Context } from "./context.js"
import { Utils } from './utils.js'
import { SceneObject } from "./sceneObject.js";

export class SceneController {

    public static readonly roadSegmentSize: number = 4;

    private scene: any;
    private camera: any;
    private renderer: any;
    private textureLoader: any;

    private context: Context;
    private objects: [SceneObject];

    constructor(context: Context) {
        this.context = context;
// @ts-ignore
        this.textureLoader = new THREE.TextureLoader();
// @ts-ignore
    this.scene = new THREE.Scene();
// @ts-ignore      
    this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    const cameraSceneObject = new SceneObject(
        "camera",
        this.camera
    );

    this.objects = [cameraSceneObject];    
// @ts-ignore      
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(this.renderer.domElement);        
    }

    public step() {
        this.renderer.render(this.scene, this.camera);
    }

    public loadTexture(path: string): any {
        const texture = this.textureLoader.load(path);
        if (texture == null || texture == undefined) {
            this.context.debugPrint("Can't load texture: {path}!!!!!!!");
        }
        return this.textureLoader.load("./data/failbackTexture.png")
    }

    private addSceneObject(object: SceneObject): void {
        // @ts-ignore
        const alreadyAddedObject = this.objects.find(obj => obj.name === object.name);

        if (alreadyAddedObject) {
            this.context.raiseCriticalError("Duplicate name for object!!!:" + object.name);
            return;
        }

        this.objects.push(object);
        this.scene.add(object.threeObject);
    }

    public addBackground(): void {
        this.addPlaneAt(
            "background",
            0,
            0,
            -0.5,
            1,
            1,
            "data/background.png",
            0x0000FF,
            true
        )
    }

    public addBoxAt(
        name: string,
        x: number,
        y: number,
        z: number,
        color: number
    ): void {
        this.context.debugPrint("addCubeAt");
        // @ts-ignore
        const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
        // @ts-ignore
        const boxMaterial = new THREE.MeshBasicMaterial({ color: color });
        // @ts-ignore
        const box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.position.x = x;
        box.position.y = y;
        box.position.z = z;

        const sceneObject = new SceneObject(
            name,
            box
        );
        this.addSceneObject(sceneObject);
    }

    public addPlaneAt(
        name: string,
        x: number,
        y: number,
        z: number,
        width: number,
        height: number,
        texturePath: string,
        color: number = 0xFFFFFF,
        resetDepthBuffer: boolean = false
    ): void {
        this.context.debugPrint("addPlaneAt");
        // @ts-ignore
        const planeGeometry = new THREE.PlaneGeometry(width, height);

        const texture = this.loadTexture(texturePath);

        // @ts-ignore
        const planeMaterial = new THREE.MeshBasicMaterial({
            // @ts-ignore
            color: color,
            depthWrite: !resetDepthBuffer,        
            map: texture,
            // @ts-ignore
            side: THREE.DoubleSide,
        });
        // @ts-ignore
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.position.x = x;
        plane.position.y = y;
        plane.position.z = z;

        const sceneObject = new SceneObject(
            name,
            plane
        );
        this.addSceneObject(sceneObject);
    }    

    public addCarAt(
        name: string,
        x: number,
        y: number,
        z: number
    ): void {
        this.context.debugPrint("addCarAt");
        this.addBoxAt(
            name,
            x,
            y,
            z,
            0x00FF00
        )
    }

    public addRoadSegmentAt(
        name: string,
        x: number,
        y: number,
        z: number
    ): void {
        this.context.debugPrint("addRoadSegmentAt");
        this.addPlaneAt(
            name,
            x,
            y,
            z,
            SceneController.roadSegmentSize,
            SceneController.roadSegmentSize,
            "data/roadSegmentTexture.png"
        ); 
        this.rotateObject(
            name,
            Utils.angleToRadians(-90),
            0,
            0
          );        
    }

    public sceneObjectPosition(
        name: string
    ): any
    {
        const outputObject = this.sceneObject(name);
        const outputPosition = outputObject.threeObject.position;
        return outputPosition;
    }

    private sceneObject(
        name: string
    ): SceneObject
    {
        // @ts-ignore
        var object = this.objects.find(obj => obj.name === name);
        if (!object || object == undefined) {
            this.context.debugPrint("Can't find object with name: {"+ name +"}!!!!!");
            this.addBoxAt(
                name, 
                0, 
                0, 
                0,
                0x0000FF
            );
            return this.sceneObject(name);
        }
        return object;
    }

    public moveObjectTo(
        name: string,
        x: number,
        y: number,
        z: number
    ): void {
        const sceneObject = this.sceneObject(name);
        sceneObject.threeObject.position.x = x;
        sceneObject.threeObject.position.y = y;
        sceneObject.threeObject.position.z = z;
    }

    public rotateObject(
        name: string,
        x: number,
        y: number,
        z: number
    ): void
    {
        const sceneObject = this.sceneObject(name);
        sceneObject.threeObject.rotation.x = x;
        sceneObject.threeObject.rotation.y = y;
        sceneObject.threeObject.rotation.z = z;
    }
}