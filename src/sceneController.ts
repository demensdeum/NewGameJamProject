import { Context } from "./context.js"
import { Utils } from './utils.js'

export class SceneController {

    private scene: any;
    private camera: any;
    private renderer: any;
    private textureLoader: any;

    private context: Context;
    private objects: [any];

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
    this.camera.name = "camera";
    this.objects = [this.camera];    
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
        box.name = name;
        box.position.x = x;
        box.position.y = y;
        box.position.z = z;
        this.scene.add(box);
        this.objects.push(box);
    }

    public addPlaneAt(
        name: string,
        x: number,
        y: number,
        z: number,
        width: number,
        height: number
    ): void {
        this.context.debugPrint("addPlaneAt");
        // @ts-ignore
        const planeGeometry = new THREE.PlaneGeometry(width, height);

        const texture = this.loadTexture("./data/roadSegmentTexture.png");

        // @ts-ignore
        const planeMaterial = new THREE.MeshBasicMaterial({ 
            map: texture,
            // @ts-ignore
            side: THREE.DoubleSide
        });
        // @ts-ignore
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.name = name;
        plane.position.x = x;
        plane.position.y = y;
        plane.position.z = z;
        this.scene.add(plane);
        this.objects.push(plane);
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
            4,
            4
        ) 
        this.rotateObject(
            name,
            Utils.angleToRadians(-90),
            0,
            0
          );        
    }

    private objectWithName(
        name: string
    ): any
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
            return this.objectWithName(name);
        }
        return object;
    }

    public moveObjectTo(
        name: string,
        x: number,
        y: number,
        z: number
    ): void {
        const object = this.objectWithName(name);
        object.position.x = x;
        object.position.y = y;
        object.position.z = z;
    }

    public rotateObject(
        name: string,
        x: number,
        y: number,
        z: number
    ): void
    {
        const object = this.objectWithName(name);
        object.rotation.x = x;
        object.rotation.y = y;
        object.rotation.z = z;
    }
}