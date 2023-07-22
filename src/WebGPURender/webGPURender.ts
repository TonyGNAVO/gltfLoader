import { PrimitivCoreUtils } from '../Entities/primitivCore';
import { Scene } from '../Entities/scene';
import { Size, WebGPUDescriptor } from './Utils/utils';
import { mat4, vec3 } from 'gl-matrix';

export class WebGPURenderer {
    private canvas: HTMLCanvasElement;
    private gPUDevice = PrimitivCoreUtils.get_gPUDevice();
    private gPUFormat = PrimitivCoreUtils.get_gPUTextureFormat();
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
        // context
        const context = descriptor.canvas.getContext('webgpu');
        if (!context) throw new Error();
        this.gPUCanvasContext = context;
        context.configure({
            device: this.gPUDevice,
            format: this.gPUFormat,
            alphaMode: 'opaque',
        });

        // canvas
        this.canvas = descriptor.canvas;
        this.enableCanvas();
        this.canvas.width = this.size.width * this.pixelRatio;
        this.canvas.height = this.size.height * this.pixelRatio;

        // texture
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
        this.depthView = this.depthTexture.createView({ label: 'Depth view' });
        this.renderTexture = this.gPUCanvasContext.getCurrentTexture();
        this.renderView = this.renderTexture.createView();

        // renderpass
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

        //put the right size
        this.setSize(window.innerWidth, window.innerHeight);
        this.updateRenderTextureSize();
    }

    render(scene: Scene) {
        this.updateTechnicalAttribute();
        this.drawScene(scene);
        this.executePassCommand();
    }

    private executePassCommand() {
        this.renderPass.end();
        this.gPUDevice.queue.submit([this.commandEncoder.finish()]);
    }

    private drawScene(scene: Scene) {
        scene.children.forEach((mesh) => {
            mesh.draw(this.getProjectionMatrix(), this.renderPass);
        });
    }

    private getProjectionMatrix(
        aspect: number = this.size.width / this.size.height,
        fov: number = (60 / 180) * Math.PI,
        near: number = 0.1,
        far: number = 100.0,
        position = { x: 3, y: 1, z: 7 },
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

    private updateTechnicalAttribute() {
        this.renderTexture = this.gPUCanvasContext.getCurrentTexture();
        this.renderView = this.renderTexture.createView();
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
        this.commandEncoder = this.gPUDevice.createCommandEncoder();

        this.renderPass = this.commandEncoder.beginRenderPass(
            this.gPURenderPassDescriptor,
        );
    }

    private enableCanvas() {
        window.addEventListener('resize', (e) => {
            this.setSize(window.innerWidth, window.innerHeight);
            this.updateRenderTextureSize();
        });
    }

    private updateRenderTextureSize() {
        let textureSizeWidth = window.innerWidth * this.pixelRatio;
        let textureSizeheight = window.innerHeight * this.pixelRatio;
        this.canvas.width = textureSizeWidth;
        this.canvas.height = textureSizeheight;
        this.depthTexture = this.gPUDevice.createTexture({
            format: 'depth32float',
            label: 'depth texture',
            size: {
                width: textureSizeWidth,
                height: textureSizeheight,
            },
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        });
        this.depthView = this.depthTexture.createView();
    }
}
