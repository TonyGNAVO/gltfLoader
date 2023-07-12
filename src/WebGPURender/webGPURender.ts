import { Mesh } from '../Entities/Mesh';
import { BufferGeometry } from '../Entities/bufferGeometry';
import { PrimitivCoreUtils } from '../Entities/primitivCore';
import { Scene } from '../Entities/scene';
import { WebGPUDescriptor } from './Utils/utils';

class WebGPURenderer {
    private gPUDevice = PrimitivCoreUtils.get_gPUDevice();
    private format = PrimitivCoreUtils.get_gPUTextureFormat();
    private commandEncoder = this.gPUDevice.createCommandEncoder();
    private gPUCanvasContext: GPUCanvasContext;
    private depthView: GPUTextureView;
    private gPURenderPassDescriptor: GPURenderPassDescriptor;
    private renderPass: GPURenderPassEncoder|null=null;
    constructor(descriptor: WebGPUDescriptor) {
        const context = descriptor.canvas.getContext('webgpu');
        if (!context) throw new Error();

        this.gPUCanvasContext = context;

        //____ création de la texture
        const texture: GPUTexture = this.gPUDevice.createTexture({
            format: this.format,
            label: 'depth texture',
            size: {
                width: 1024,
                height: 1024,
            },
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
            //sampleCount : see the doc. It's about aliasing
        });

        //____ création de la view
        this.depthView = texture.createView();

        this.gPURenderPassDescriptor = {
            colorAttachments: [
                {
                    view: this.gPUCanvasContext
                        .getCurrentTexture()
                        .createView(),
                    clearValue: { r: 0, g: 0, b: 0, a: 1.0 },
                    loadOp: 'clear',
                    storeOp: 'store',
                },
            ],
            depthStencilAttachment: {
                view: this.depthView,
                depthClearValue: 1.0,
                depthLoadOp: 'clear',
                depthStoreOp: 'store',
            },
        };
    }

    render(scene: Scene) {

        scene.children.forEach((mesh) => {
            mesh.primitives.forEach((geometry) => {
                this.draw(geometry, mesh);
            });
        });
        PrimitivCoreUtils.get_gPUDevice().queue.submit([this.commandEncoder.finish()])
    }

    draw(geometry: BufferGeometry, mesh: Mesh) {
        if (!geometry.renderPipeline   ) {
            return;
        }
        if(!this.renderPass){
            this.renderPass = this.commandEncoder.beginRenderPass(
                this.gPURenderPassDescriptor,
            );
        }


        this.renderPass.setPipeline(geometry.renderPipeline);
        this.renderPass.setVertexBuffer(0,geometry.vertexBuffer)

        if(geometry.index && geometry.indexBuffer && geometry.index.array){
            //ToDo, change format according to eh arrayType and take carte the case when we have no index.
            this.renderPass.setIndexBuffer(geometry.indexBuffer, 'uint16')
            const arr = geometry.index.array as Uint16Array;
            this.renderPass.drawIndexed(arr.length);
            this.renderPass.end()
        }else{
            throw new Error("Implemente when we have no index")
        }

    }
}
