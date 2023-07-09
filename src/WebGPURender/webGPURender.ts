import { Mesh } from '../Entities/Mesh';
import { BufferGeometry } from '../Entities/bufferGeometry';
import { PrimitivCoreUtils } from '../Entities/primitivCore';
import { Scene } from '../Entities/scene';
import { WebGPUDescriptor } from './Utils/utils';

class WebGPURenderer {
    private gPUDevice = PrimitivCoreUtils.get_gPUDevice();
    private commandEncoder = this.gPUDevice.createCommandEncoder();
    private passEncoder;
    private gPUCanvasContext: GPUCanvasContext;
    constructor(descriptor: WebGPUDescriptor) {

        const context = descriptor.canvas.getContext('webgpu');
        if (!context) throw new Error();

        this.gPUCanvasContext = context;

        this.passEncoder = this.commandEncoder.beginRenderPass({
            colorAttachments: [
                {
                    view: this.gPUCanvasContext.getCurrentTexture().createView(),
                    clearValue: { r: 0, g: 0, b: 0, a: 1.0 },
                    loadOp: 'clear',
                    storeOp: 'store',
                },
            ],
            depthStencilAttachment: {
                //rajouter la texture de profondeur=>création d'une pipeline seulement pour la profondeur
                // paramètre à mettre dans le constructeur pour savoir si on fait un test de profondeur.
                view: pipelineObj.depthView,
                depthClearValue: 1.0,
                depthLoadOp: 'clear',
                depthStoreOp: 'store',
            },
        });
    }

    render(scene: Scene) {
        scene.children.forEach((mesh) => {
            mesh.primitives.forEach((geometry) => {
                this.draw(geometry, mesh);
            });
        });
        // set buffer pour avec tout les attributes
        // draw indexed si présence d'index
    }

    draw(geometry: BufferGeometry, mesh: Mesh) {
        //pas oublié l'index s'il y en a un
    }
}
