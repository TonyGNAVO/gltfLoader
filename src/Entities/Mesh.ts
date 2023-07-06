import { BufferGeometry } from './bufferGeometry';
import fragmentShader from '../Shader/basic.frag.wgsl?raw';
import vertexShader from '../Shader/basic.vert.wgsl?raw';
import { PrimitivCoreUtils } from './primitivCore';

export class Mesh {
    primitives: BufferGeometry[] = [];
    private renderPipeline: GPURenderPipeline | null = null;
    constructor(primitives: BufferGeometry[]) {
        this.primitives = primitives;

        const device = PrimitivCoreUtils.get_gPUDevice();
        const format = PrimitivCoreUtils.get_gPUTextureFormat();

        // const bufferLayout : GPUVertexBufferLayout =[{arrayStride}]
        //création de la description d'un buffer
        // ça dépendra des paramètres présents
        //compter shaderLocation, compteur offset.
        this.renderPipeline = device.createRenderPipeline({
            vertex: {
                entryPoint: 'vs_main',
                module: device.createShaderModule({
                    code: vertexShader,
                }),
            },
            layout: 'auto',
            label: 'BufferGeometryPipeline',
            fragment: {
                entryPoint: 'fs_main',
                module: device.createShaderModule({
                    code: fragmentShader,
                }),
                targets: [{ format }],
            },
            depthStencil: {
                depthCompare: 'less',
                depthWriteEnabled: true,
                format: 'depth24plus',
            },
            primitive: { cullMode: 'back' },
        });
    }
}
