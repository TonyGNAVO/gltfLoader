import { Mesh } from '../Entities/Mesh';
import { BufferGeometry } from '../Entities/bufferGeometry';
import { PrimitivCoreUtils } from '../Entities/primitivCore';
import { Scene } from '../Entities/scene';
import { Size, WebGPUDescriptor } from './Utils/utils';
import { mat4, vec3 } from 'gl-matrix';

export class WebGPURenderer {
    private canvas: HTMLCanvasElement;
    private gPUDevice = PrimitivCoreUtils.get_gPUDevice();
    private commandEncoder = this.gPUDevice.createCommandEncoder();
    private gPUCanvasContext: GPUCanvasContext;
    private depthTexture: GPUTexture;
    private depthView: GPUTextureView;
    private renderTexture: GPUTexture;
    private renderView: GPUTextureView;
    private gPURenderPassDescriptor: GPURenderPassDescriptor;
    private renderPass: GPURenderPassEncoder;
    private size: Size = { width: 1920, height: 1080 };
    private pixelRatio = 2;

    constructor(descriptor: WebGPUDescriptor) {

        const context = descriptor.canvas.getContext('webgpu');
        if (!context) throw new Error();
        this.gPUCanvasContext = context
        context.configure({
            device: PrimitivCoreUtils.get_gPUDevice(),
            format: PrimitivCoreUtils.get_gPUTextureFormat(),
            alphaMode: 'opaque',
        });

        this.canvas = descriptor.canvas;
        this.enableCanvas();

        this.canvas.width = this.size.width * this.pixelRatio;
        this.canvas.height = this.size.height * this.pixelRatio;

        //____ création de la texture de rendu
        this.depthTexture = this.gPUDevice.createTexture({
            format: 'depth32float',
            label: 'depth texture',
            size: {
                width: this.size.width * this.pixelRatio,
                height: this.size.height * this.pixelRatio,
            },
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
            //sampleCount : see the doc. It's about aliasing
        });
        this.depthView = this.depthTexture.createView({label:"Depth view"});

        //____ création de la texture de profondeur
       this.renderTexture = this.gPUCanvasContext.getCurrentTexture();
       this.renderView=this.renderTexture.createView()


        // Attachements
        this.gPURenderPassDescriptor = {
            colorAttachments: [
                {
                    view: this.renderView,
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

        this.renderPass = this.commandEncoder.beginRenderPass(
            this.gPURenderPassDescriptor,
        );
    }

    render(scene: Scene) {

        this.updateAttachement()
        this.commandEncoder = this.gPUDevice.createCommandEncoder();

        this.renderPass = this.commandEncoder.beginRenderPass(
            this.gPURenderPassDescriptor,
        );

        scene.children.forEach((mesh) => {
            mesh.primitives.forEach((geometry) => {
                this.draw(geometry, mesh);
            });
        });

        this.renderPass.end();

        PrimitivCoreUtils.get_gPUDevice().queue.submit([
            this.commandEncoder.finish(),
        ]);
    }

    private draw(geometry: BufferGeometry, mesh: Mesh) {
        if (!geometry.renderPipeline) {
            return;
        }

        // Camera
        const cameraProjectionBuffer =
            PrimitivCoreUtils.get_gPUDevice().createBuffer({
                label: 'GPUBuffer for camera projection',
                size: 4 * 4 * 4,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            });

        PrimitivCoreUtils.get_gPUDevice().queue.writeBuffer(
            cameraProjectionBuffer,
            0,
            this.getProjectionMatrix(),
        );

        const bGroup = PrimitivCoreUtils.get_gPUDevice().createBindGroup({
            label: 'Group for renderPass',
            layout: geometry.renderPipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: cameraProjectionBuffer,
                    },
                },
            ],
        });

        this.renderPass.setPipeline(geometry.renderPipeline);
        this.renderPass.setBindGroup(0, bGroup);
        this.renderPass.setVertexBuffer(0, geometry.vertexBuffer);

        if (geometry.index && geometry.indexBuffer && geometry.index.array) {
            //ToDo, change format according to eh arrayType and take carte the case when we have no index.
            this.renderPass.setIndexBuffer(geometry.indexBuffer, 'uint16');
            const arr = geometry.index.array as Uint16Array;
            this.renderPass.drawIndexed(arr.length);
            // this.renderPass.end();
        } else {
            throw new Error('Implemente when we have no index');
        }
    }

    private getProjectionMatrix(
        aspect: number = this.size.width / this.size.height,
        fov: number = (60 / 180) * Math.PI,
        near: number = 0.1,
        far: number = 100.0,
        position = { x: 1, y: 3, z: 7 },
    ) {
        const center = vec3.fromValues(0, 0, 0);
        const up = vec3.fromValues(0, 1, 0);

        // create cameraview
        const cameraView = mat4.create();
        const eye = vec3.fromValues(position.x, position.y, position.z);
        mat4.translate(cameraView, cameraView, eye);
        mat4.lookAt(cameraView, eye, center, up);
        // get a perspective Matrix
        const projectionMatrix = mat4.create();
        mat4.perspective(projectionMatrix, fov, aspect, near, far);
        mat4.multiply(projectionMatrix, projectionMatrix, cameraView);
        // return matrix as Float32Array
        return projectionMatrix as Float32Array;
    }
    setSize(width: number, height: number) {
        this.size.width = width;
        this.size.height = height;
    }
    setPixelRatio(pixelRatio: number) {
        this.pixelRatio = pixelRatio;
    }

    private updateAttachement(){
        this.renderTexture = this.gPUCanvasContext.getCurrentTexture();
        this.renderView=this.renderTexture.createView()
        this.gPURenderPassDescriptor = {
            colorAttachments: [
                {
                    view: this.renderView,
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
    private enableCanvas() {
        window.addEventListener('resize', (e) => {
            this.size.width = window.innerWidth;
            this.size.height = window.innerHeight;

            // mise à jour du canvas
            this.canvas.width = window.innerWidth *  this.pixelRatio;
            this.canvas.height = window.innerHeight * this.pixelRatio;

            // mise à jour de la depth texture
            this.depthTexture = this.gPUDevice.createTexture({
                format: 'depth32float',
                label: 'depth texture',
                size: {
                    width: this.size.width * this.pixelRatio,
                    height: this.size.height * this.pixelRatio,
                },
                usage: GPUTextureUsage.RENDER_ATTACHMENT,
                //sampleCount : see the doc. It's about aliasing
            });

            //____ création de la depth view
            this.depthView = this.depthTexture.createView();
        });
    }
    private buildRenderPass(){

    }
}
