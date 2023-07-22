export interface WebgpuDrawable {
    // when it will lbe a camera object, I  will pass the camera object
    draw(camera: Float32Array, renderpass: GPURenderPassEncoder): void;
}
