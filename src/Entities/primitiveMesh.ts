import { BufferGeometry } from './bufferGeometry';
import fragmentShader from '../Shader/basic.frag.wgsl?raw';
import vertexShader from '../Shader/basic.vert.wgsl?raw';
import { PrimitivCoreUtils } from './primitivCore';
import { Material } from './Material';

export class primitiveMesh {
    primitives: BufferGeometry[] = [];
    materials:Material[]=[]

    constructor(primitives: BufferGeometry[],materials:Material[]) {

        console.log(materials[0])
        this.primitives = primitives;
        this.materials=materials
        for (let i =0;i<this.primitives.length;i++) {
            
            const bufferGeometry =  this.primitives[i]
            const material =  this.materials[i]

            this.enableBuffergeometry(bufferGeometry,material);
            this.createVertexBuffer(bufferGeometry);
            this.createIndexBuffer(bufferGeometry);
        }
        //exception si l'un plus grand que l'autre pour les tableaux
    }

    private enableBuffergeometry(bufferGeometry: BufferGeometry,material:Material) {
        const device = PrimitivCoreUtils.get_gPUDevice();
        const format = PrimitivCoreUtils.get_gPUTextureFormat();

        let offset = 0;
        let offsetNumber = 0;
        let arrayStride = 0;
        let vertexSize = 0;
        let shaderLocation = 0;

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
            /* eslint-enable @typescript-eslint/no-unsafe-assignment */
        }

        // Creation of big buffer with all vertex attribute
        bufferGeometry.vertexArrayBuffer = new Float32Array(
            vertexSize * bufferGeometry.count,
        );

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

            attributes.push({ offset, shaderLocation, format });

            // fill the array with all attribute values of each vertex
            this.setAttributeToBuffer(
                value.array,
                bufferGeometry.vertexArrayBuffer,
                offsetNumber,
                value.component,
                vertexSize,
            );

            offset += byteSize;
            offsetNumber += value.component;
            shaderLocation++;

            /* eslint-enable @typescript-eslint/no-unsafe-assignment */
        }

        const gPUVertexBufferLayout: GPUVertexBufferLayout[] = [
            {
                arrayStride,
                attributes,
            },
        ];

        
        // build renderPipeline
        material.renderPipeline = device.createRenderPipeline({
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
                format: 'depth32float',
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

    private createVertexBuffer(bufferGeometry: BufferGeometry) {
        const device = PrimitivCoreUtils.get_gPUDevice();
        bufferGeometry.vertexBuffer = device.createBuffer({
            label: 'GPUBuffer store vertex',
            size: bufferGeometry.vertexArrayBuffer.byteLength,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        });

        device.queue.writeBuffer(
            bufferGeometry.vertexBuffer,
            0,
            bufferGeometry.vertexArrayBuffer,
        );
    }

    private createIndexBuffer(bufferGeometry: BufferGeometry) {
        if (!bufferGeometry.index || !bufferGeometry.index.array) {
            return;
        }
        const device = PrimitivCoreUtils.get_gPUDevice();

        bufferGeometry.indexBuffer = device.createBuffer({
            label: 'GPUBuffer store indices',
            size: bufferGeometry.index.array?.byteLength,
            usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
        });

        device.queue.writeBuffer(
            bufferGeometry.indexBuffer,
            0,
            bufferGeometry.index.array,
        );
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
            target.set(buff, i * vertexSize + offset);
        }
    }


    //méthode render
    render(){
    // parcourir la liste de buffergeometry et de material et de draw tout ça.
    }
}
