import {
    BufferAttribute,
    BufferAttributeName,
    BufferGeometry,
} from './bufferGeometry';
import fragmentShader from '../Shader/basic.frag.wgsl?raw';
import vertexShader from '../Shader/basic.vert.wgsl?raw';
import { PrimitivCoreUtils } from './primitivCore';

export class Mesh {
    primitives: BufferGeometry[] = [];

    constructor(primitives: BufferGeometry[]) {
        this.primitives = primitives;
        for (const bufferGeometry of this.primitives) {
            bufferGeometry.renderPipeline = this.getPipeline(bufferGeometry);
            // constituer une nouvelle liste de vertex avec tous les attributes dans l'ordre
            //l'ordre doit être exactement le même que celui des shaderLocation
        }

        // TODO création d'un vertex buffer
    }

    private getPipeline(bufferGeometry: BufferGeometry): GPURenderPipeline {
        const device = PrimitivCoreUtils.get_gPUDevice();
        const format = PrimitivCoreUtils.get_gPUTextureFormat();

        let offset = 0;
        let offsetNumber = 0;
        let arrayStride = 0;
        let vertexSize = 0;
        const attributes: GPUVertexAttribute[] = [];

        for (const [attr, value] of Object.entries(bufferGeometry.attributes)) {
            /* eslint-disable @typescript-eslint/no-unsafe-assignment */
            if (!(value.component && value.array)) {
                continue;
            }
            const byteSize = this.getAttributeSize(
                value.array,
                value.component,
            );

            arrayStride += byteSize;
            vertexSize += value.component;

            // Creation of big buffer with all vertex attribute
            bufferGeometry.vertexArrayBuffer = new Float32Array(
                vertexSize * bufferGeometry.count,
            );
            /* eslint-enable @typescript-eslint/no-unsafe-assignment */
        }

        // déterminer mon byteSize des le départ avec une boucle for.

        for (const [attr, value] of Object.entries(bufferGeometry.attributes)) {
            /* eslint-disable @typescript-eslint/no-unsafe-assignment */

            if (!(value.component && value.array)) {
                continue;
            }
            const byteSize = this.getAttributeSize(
                value.array,
                value.component,
            );

            const format = this.getFormat(
                value.array,
                value.component,
            ) as GPUVertexFormat;

            // Todo le shader location doit être dynamique => incrémental
            const shaderLocation = this.getShaderLocation(attr);

            // build "attributes" attribut for buffer attribut.
            attributes.push({ offset, shaderLocation, format });

  console.log(attr)
            this.setAttributeToBuffer(
                value.array,
                bufferGeometry.vertexArrayBuffer,
                offsetNumber,
                value.component,
                vertexSize,
            );

            offset += byteSize;
            offsetNumber += value.component;
            /* eslint-enable @typescript-eslint/no-unsafe-assignment */
        }

        const gPUVertexBufferLayout: GPUVertexBufferLayout[] = [
            {
                arrayStride,
                attributes,
            },
        ];

        //setter le bon shader avec la bonne location dynamique
        return device.createRenderPipeline({
            vertex: {
                entryPoint: 'vs_main',
                module: device.createShaderModule({
                    code: vertexShader,
                }),
                buffers: gPUVertexBufferLayout,
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

    private getFormat(arrayBuffer: ArrayBuffer, component: number): string {
        let type;
        if (arrayBuffer instanceof Float32Array) {
            type = 'float32';
        } else if (arrayBuffer instanceof Uint32Array) {
            type = 'uint32';
        } else if (arrayBuffer instanceof Int16Array) {
            type = 'sint16';
        } else if (arrayBuffer instanceof Uint16Array) {
            type = 'uint16';
        } else if (arrayBuffer instanceof Int8Array) {
            type = 'sint8';
        } else if (arrayBuffer instanceof Uint8Array) {
            type = 'uint8';
        } else {
            throw new Error('the type of the arraybuffer is not known');
        }
        return `${type}x${component}`;
    }

    // Todo le shader location doit être dynamique
    private getShaderLocation(attr: string): number {
        if (attr === BufferAttributeName.POSITION) {
            return 0;
        }
        if (attr === BufferAttributeName.NORMAL) {
            return 2;
        }
        if (attr === BufferAttributeName.TEXCOORD) {
            return 3;
        }

        if (attr === BufferAttributeName.COLOR) {
            return 4;
        }
        if (attr === BufferAttributeName.TANGENT) {
            return 5;
        }
        throw new Error(`the attribute ${attr} is unknow`);
    }

    private setAttributeToBuffer(
        source:
            | Float32Array
            | Uint32Array
            | Int16Array
            | Uint16Array
            | Int8Array
            | Uint8Array,
        target: Float32Array,
        offset: number,
        component: number,
        vertexSize: number,
    ) {
        for (let i = 0; i < source.length / component; i++) {
            const buff = source.slice(i * component, i * component + component);
            // prendre les composants d'un point et les placer à l'offset * count
            //=> le nombre d'itération est le count
            target.set(buff, i * vertexSize + offset);
        }
        //l'offset n'est pas en byte
    }
}
