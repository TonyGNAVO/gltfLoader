class PrimitivCore {}

class Device {
    private static gpuDevice: GPUDevice | null = null;

    constructor() {}

    static async getInstance(): Promise<GPUDevice|null> {
        if (!this.gpuDevice) {
            if (!navigator.gpu) throw new Error('Not Support WebGPU');
            const adapter = await navigator.gpu.requestAdapter();
            if (!adapter) throw new Error('No Adapter Found');
            this.gpuDevice = await adapter.requestDevice();
        }
        return Device.gpuDevice;
    }
}
