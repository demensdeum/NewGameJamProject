import { Context } from "./context.js"
import { Utils } from './utils.js'
import { SceneObject } from "./sceneObject.js";
import { Identifiers } from "./names.js";
// @ts-ignore
import * as dat from '/libs/dat.gui.module.js';
import { GameData } from "./gameData.js";
import { SceneObjectIdentifier } from "./sceneObjectIdentifier.js";

const gui = new dat.GUI();

export class SceneController {

    private canvas: HTMLCanvasElement;

    public static readonly carSize: number = 1;
    public static readonly roadSegmentSize: number = 2;
    public static readonly skyboxPositionDiffX: number = 0.5;

    private scene: any;
    private camera: any;
    private renderer: any;
    private textureLoader: any;

    private context: Context;
    private objects: [SceneObject];

    constructor(
        context: Context,
        canvas: HTMLCanvasElement
    ) {
        this.context = context;
        this.canvas = canvas;
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
      this.renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        antialias: true
    });
    
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(this.renderer.domElement);      
      
      const camera = this.camera;
      const renderer = this.renderer;

      function onWindowResize() {
        // @ts-ignore
        camera.aspect = window.innerWidth / window.innerHeight;
        // @ts-ignore
        camera.updateProjectionMatrix();
      
        // @ts-ignore
        renderer.setSize(window.innerWidth, window.innerHeight);
      }      

      window.addEventListener('resize', onWindowResize, false);
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

    private escapeUnicode(str: string) {
        return [...str].map(c => /^[\x00-\x7F]$/.test(c) ? c : c.split("").map(a => "\\u" + a.charCodeAt(0).toString(16).padStart(4, "0")).join("")).join("");
    }
      

    public addUI(gameData: GameData): void {
        const scoreView = gui
            .add(gameData, 'score')
            .name("\u041E\u0447\u043A\u0438");
        gui.add(gameData, 'speed')
            .name("Speed")
            .step(0.01);
        scoreView.domElement.style.pointerEvents = "none"
    }

    public updateUI(): void {
        for (const i in gui.__controllers) {
            gui.__controllers[i].updateDisplay();
        }
    }

    public addSkybox(): void {
        this.addPlaneAt(
            Identifiers.skyboxFront,
            0,
            0,
            -SceneController.skyboxPositionDiffX,
            1,
            1,
            "data/background.png",
            0x0000FF,
            true
        )

        this.addPlaneAt(
            Identifiers.skyboxLeft,
            0,
            0,
            -SceneController.skyboxPositionDiffX,
            1,
            1,
            "data/background.png",
            0x00FFFF,
            true
        )
        this.rotateObject(
            Identifiers.skyboxLeft,
            0,
            Utils.angleToRadians(90),
            0
        )   
        this.moveObjectTo(
            Identifiers.skyboxLeft,
            -SceneController.skyboxPositionDiffX,
            0,
            0
        )

        this.addPlaneAt(
            Identifiers.skyboxRight,
            0,
            0,
            SceneController.skyboxPositionDiffX,
            1,
            1,
            "data/background.png",
            0xFF00FF,
            true
        )
        this.rotateObject(
            Identifiers.skyboxRight,
            0,
            Utils.angleToRadians(90),
            0
        )   
        this.moveObjectTo(
            Identifiers.skyboxRight,
            SceneController.skyboxPositionDiffX,
            0,
            0
        )        
    }

    public addBoxAt(
        name: string,
        x: number,
        y: number,
        z: number,
        texturePath: string,        
        color: number = 0x00FFFF
    ): void {
        this.context.debugPrint("addCubeAt");
        const texture = this.loadTexture(texturePath);
        const carSize = SceneController.carSize;
        // @ts-ignore
        const boxGeometry = new THREE.BoxGeometry(
            carSize, 
            carSize, 
            carSize
        );
        // @ts-ignore
        const boxMaterial = new THREE.MeshBasicMaterial({
             color: color,
             map: texture
        });
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
            "./data/carTexture.png"
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

    public addItemAt(
        name: SceneObjectIdentifier,
        x: number,
        y: number,
        z: number
    ): void
    {
        const item = this.addBoxAt(
            name,
            x,
            y,
            z,
            "./data/itemTexture.png",
            0x00FFFF
        )
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
                "./data/failbackTexture.png"
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