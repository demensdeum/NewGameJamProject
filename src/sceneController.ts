import { Context } from "./context.js"
import { Utils } from './utils.js'
import { SceneObject } from "./sceneObject.js";
// @ts-ignore
import * as dat from '/libs/dat.gui.module.js';
import { GameData } from "./gameData.js";
import { SceneObjectIdentifier } from "./sceneObjectIdentifier.js";
import { Names } from "./names.js"

const gui = new dat.GUI();

export class SceneController {

    private canvas: HTMLCanvasElement;

    public static readonly itemSize: number = 1;
    public static readonly carSize: number = 1;
    public static readonly roadSegmentSize: number = 2;
    public static readonly skyboxPositionDiffX: number = 0.5;

    // @ts-ignore
    private scene: any;
    private camera: any;
    private renderer: any;
    private texturesToLoad: any[] = [];
    // @ts-ignore
    private textureLoader: any = new THREE.TextureLoader();

    private context: Context;
    private objects: [SceneObject];

    private failbackTexture: any;
    private loadingTexture: any;

    constructor(
        context: Context,
        canvas: HTMLCanvasElement
    ) {
        this.context = context;
        this.canvas = canvas;
// @ts-ignore
        this.failbackTexture = this.textureLoader.load(
            "./assets/failbackTexture.png",
            ()=>{
                console.log("UHHHHHHHHH");
            }
        );

        this.loadingTexture = this.textureLoader.load(
            "./assets/loadingTexture.png"
        )
// @ts-ignore
    this.scene = new THREE.Scene();
// @ts-ignore      
    this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    // @ts-ignore
    const colliderBox = new THREE.Box3().setFromObject(this.camera);

    const cameraSceneObject = new SceneObject(
        Names.camera,
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

    public loadTexture(
        path: string,
        material: any
    ): any {
        const context = this.context;
        this.textureLoader.load(
            path,
            // @ts-ignore
            function (texture) {
                console.log("aaaa");
                material.texture = texture;
                material.needsUpdate = true;
            },
            // @ts-ignore
            function (error) {
                console.log("error");
                context.debugPrint("CANNOT LOAD TEXTURE: " + path);             
            }
        )
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
      
    public addUI(gameData: GameData): void {
        const scoreView = gui
            .add(gameData, 'score')
            .name(_t("Score"));
        gui.add(gameData, 'speed')
            .name(_t("Speed"))
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
            Names.skyboxFront,
            0,
            0,
            -SceneController.skyboxPositionDiffX,
            1,
            1,
            "./assets/skyboxFrontTexture.png",
            0xFFFFFF,
            true
        )

        this.addPlaneAt(
            Names.skyboxLeft,
            0,
            0,
            -SceneController.skyboxPositionDiffX,
            1,
            1,
            "./assets/skyboxLeftTexture.png",
            0xFFFFFF,
            true
        )
        this.rotateObject(
            Names.skyboxLeft,
            0,
            Utils.angleToRadians(90),
            0
        )   
        this.moveObjectTo(
            Names.skyboxLeft,
            -SceneController.skyboxPositionDiffX,
            0,
            0
        )

        this.addPlaneAt(
            Names.skyboxRight,
            0,
            0,
            SceneController.skyboxPositionDiffX,
            1,
            1,
            "./assets/skyboxRightTexture.png",
            0xFFFFFF,
            true
        )
        this.rotateObject(
            Names.skyboxRight,
            0,
            Utils.angleToRadians(90),
            0
        )   
        this.moveObjectTo(
            Names.skyboxRight,
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
        size: number,            
        color: number = 0x00FFFF
    ): void {
        this.context.debugPrint("addCubeAt");
        // @ts-ignore
        const boxGeometry = new THREE.BoxGeometry(
            size, 
            size, 
            size
        );
        // @ts-ignore
        const material = new THREE.MeshBasicMaterial({
             color: color,
             map: this.loadingTexture
        });

        const newMaterial = new THREE.MeshBasicMaterial({
            color: color,
            map: this.textureLoader.load(
                texturePath,
                (texture)=>{
                    material.map = texture;
                    material.needsUpdate;
                },
                (error)=>{
                    console.log("WUT!!!!");
                }
            )
       });        
       this.texturesToLoad.push(newMaterial);

        // @ts-ignore
        const box = new THREE.Mesh(boxGeometry, material);
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

        // @ts-ignore
        const material = new THREE.MeshBasicMaterial({
            color: color,
            map: this.loadingTexture,
            // @ts-ignore
            depthWrite: !resetDepthBuffer,
            // @ts-ignore
            side: THREE.DoubleSide,
        });

        // @ts-ignore
        const newMaterial = new THREE.MeshBasicMaterial({
            color: color,
            map: this.textureLoader.load(
                texturePath,
                // @ts-ignore
                (texture)=>{
                    material.map = texture;
                    material.needsUpdate = true;
                },
                // @ts-ignore
                (error)=>{
                    console.log("WUT!");
                }),
                // @ts-ignore
            depthWrite: !resetDepthBuffer,
            // @ts-ignore
            side: THREE.DoubleSide,
        });
        this.texturesToLoad.push(newMaterial);        

        // @ts-ignore
        const plane = new THREE.Mesh(planeGeometry, material);
        plane.position.x = x;
        plane.position.y = y;
        plane.position.z = z;

        // this.loadTexture(
        //     texturePath, 
        //     material
        // );        

        // @ts-ignore
        const box = new THREE.Box3().setFromObject(plane);

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
            "./assets/carTexture.png",
            SceneController.carSize
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
            "./assets/roadSegmentTexture.png"
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

    public objectCollidesWithObject(
        alisaName: string,
        bobName: string
    ): boolean
    {
        const alisa = this.sceneObject(alisaName);
        const bob = this.sceneObject(bobName);
        // @ts-ignore
        const alisaColliderBox = new THREE.Box3().setFromObject(alisa.threeObject);
        // @ts-ignore
        const bobCollider = new THREE.Box3().setFromObject(bob.threeObject);
        const output = alisaColliderBox.intersectsBox(bobCollider);
        //this.context.debugPrint("alisa object:" + alisa.name + "; bob: "+ bob.name +"; collide result: " + output);
        return output;
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
            "./assets/itemTexture.png",
            SceneController.itemSize,
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
                "./assets/failbackTexture.png",
                SceneController.itemSize
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