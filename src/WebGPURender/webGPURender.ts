import { Scene } from "../Entities/scene";
import { WebGPUDescriptor } from "./Utils/utils";


class WebGPURenderer{
    
    private device : GPUDevice|null =null;
    private context : GPUCanvasContext|null =null

    render(scene:Scene){
     // traverser comme un bourrin toutes la scène pour chopper les primitives et exécuter toutes les commandes
    

    }

    public static async createInstance(descriptor: WebGPUDescriptor):Promise<WebGPURenderer>{
        const renderer = new WebGPURenderer();
        await renderer.initialize(descriptor);
        return renderer;
    }

    public async initialize(descriptor: WebGPUDescriptor){
        if (!navigator.gpu)
            throw new Error('Not Support WebGPU')
        const adapter = await navigator.gpu.requestAdapter()
        if (!adapter)
            throw new Error('No Adapter Found')

        //set Device
        this.device = await adapter.requestDevice()

        //set context
        this.context = descriptor.canvas.getContext('webgpu') as GPUCanvasContext
    }
}