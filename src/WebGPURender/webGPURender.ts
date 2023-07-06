import { Scene } from '../Entities/scene';
import { WebGPUDescriptor } from './Utils/utils';

class WebGPURenderer {
    private device: GPUDevice | null = null;
    private context: GPUCanvasContext | null = null;
    //initialisation au départ d'une pipeline pour chaque mesh => doit se faire à l'initialisation de la mesh
    //comme ça le render s'occupe seulement de prendre la pipeline de la mesh pour faire le rendu
    //possibilité de changer la pipeline seulement à partir d'une mééthode spécial

    render(scene: Scene) {
        // le premier rendu doit permette de créer la pipeline, la au niveau de la création de l'instance car on ne connait pas
        //comment construire l'attribut buffer du vertex de la pipeline
        // traverser comme un bourrin toutes la scène pour chopper les primitives et exécuter toutes les commandes
        // creer une pipeline par défault la plus stricte et plus performante.
        // pipeline
        // prendre en compte l'index
        //ne pas oublier la profondeur map
    }

    public static createInstance(descriptor: WebGPUDescriptor): WebGPURenderer {
        const renderer = new WebGPURenderer();
        renderer.initialize(descriptor, renderer);
        return renderer;
    }

    public initialize(descriptor: WebGPUDescriptor, renderer: WebGPURenderer) {
        //set context
        renderer.context = descriptor.canvas.getContext(
            'webgpu',
        ) as GPUCanvasContext;
    }
}
