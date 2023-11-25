import { Context } from "./context.js"

export class SceneController {

    private scene: any;
    private camera: any;
    private renderer: any;

    private context: Context;

    constructor(context: Context) {
        this.context = context;
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
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(this.renderer.domElement);        
    }

    public step() {
        this.renderer.render(this.scene, this.camera);
    }

    public addCubeAt(
        x: number,
        y: number,
        z: number
    ): void {
        this.context.debugPrint("addCubeAt");
        // @ts-ignore
        const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
        // @ts-ignore
        const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        // @ts-ignore
        const box = new THREE.Mesh(boxGeometry, boxMaterial);
        this.scene.add(box);
    }

    public moveCameraTo(
        x: number,
        y: number,
        z: number
    ): void
    {
        this.camera.position.x = x;
        this.camera.position.y = y;
        this.camera.position.z = z;
    }
}