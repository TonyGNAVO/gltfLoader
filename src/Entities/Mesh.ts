import { BufferAttribute, BufferGeometry } from './bufferGeometry';
import fragmentShader from '../Shader/basic.frag.wgsl?raw';
import vertexShader from '../Shader/basic.vert.wgsl?raw';
import { PrimitivCoreUtils } from './primitivCore';

export class Mesh {
    primitives: BufferGeometry[] = [];

    constructor(primitives: BufferGeometry[]) {
        this.primitives = primitives;
        for (const bufferGeometry of this.primitives) {
            bufferGeometry.renderPipeline = this.getPipeline(bufferGeometry);
        }
    }

    private computegPUBufferLayout() {
        // const arrayStride = 0; // à chaque itération, on incrémente la valeur
        // const offset = 0;
        // const attributes: GPUVertexAttribute[] = [];
        // console.log(this.primitives[0].attributes);
        // qu'est ce qu'on récupère?
    }

    private getPipeline(bufferGeometry: BufferGeometry): GPURenderPipeline {
        const device = PrimitivCoreUtils.get_gPUDevice();
        const format = PrimitivCoreUtils.get_gPUTextureFormat();

        let offset = 0;
        let arraystride = 0;
        const attributes: GPUVertexAttribute[] = [];

        for (const [attr, value] of Object.entries(bufferGeometry.attributes)) {
            if (!(value instanceof BufferAttribute)) {
                continue;
            }
            if (!(value.component && value.array)) {
                continue;
            }
            const byteSize = this.getAttributeSize(
                value.array,
                value.component,
            );
            arraystride += byteSize;

            // setter le bon shader location en fonction de l'attribut et le fomat en fonction du component et du type de buffer
            attributes.push({ offset });

            offset += byteSize;
        }

        //construire un objet de type tableau de GPUVertexBufferLayout
        //setter cette objet dans la pipeline
        //construire un shader capable d'accueillir les attributs présents dans la papeline: convertir un shaderlocation en attribut disponible
        return device.createRenderPipeline({
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

    private getAttributeSize(
        arrayBuffer: ArrayBuffer,
        component: number,
    ): number {
        if (
            arrayBuffer instanceof Float32Array ||
            arrayBuffer instanceof Uint32Array
        ) {
            return component * 4;
        }
        if (
            arrayBuffer instanceof Int16Array ||
            arrayBuffer instanceof Uint16Array
        ) {
            return component * 2;
        }
        return component;
    }
}
