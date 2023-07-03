import { Scene } from '../Entities/scene';
import { WebGPUDescriptor } from './Utils/utils';

class WebGPURenderer {
    private device: GPUDevice | null = null;
    private context: GPUCanvasContext | null = null;
    //initialisation au départ d'une pipeline pour chaque mesh => doit se faire à l'initialisation de la mesh
    //comme ça le render s'occupe seulement de prendre la pipeline de la mesh pour faire le rendu
    //possibilité de changer la pipeline seulement à partir d'une mééthode spécial

    render(scene: Scene) {
        // traverser comme un bourrin toutes la scène pour chopper les primitives et exécuter toutes les commandes
        // creer une pipeline par défault la plus stricte et plus performante.
        // pipeline
        // prendre en compte l'index
        //ne pas oublier la profondeur map
    }

    public static async createInstance(
        descriptor: WebGPUDescriptor,
    ): Promise<WebGPURenderer> {
        const renderer = new WebGPURenderer();
        await renderer.initialize(descriptor, renderer);
        return renderer;
    }

    public async initialize(
        descriptor: WebGPUDescriptor,
        renderer: WebGPURenderer,
    ) {
        if (!navigator.gpu) throw new Error('Not Support WebGPU');
        const adapter = await navigator.gpu.requestAdapter();
        if (!adapter) throw new Error('No Adapter Found');

        //set Device
        renderer.device = await adapter.requestDevice();

        //set context
        renderer.context = descriptor.canvas.getContext(
            'webgpu',
        ) as GPUCanvasContext;
    }
}
