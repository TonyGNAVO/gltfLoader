class PrimitivCore {}

export class Device {
    private static gPUDevice: GPUDevice | null = null;

    private constructor() {}

    static async getInstance(): Promise<GPUDevice | null> {
        if (!this.gPUDevice) {
            if (!navigator.gpu) throw new Error('Not Support WebGPU');
            const adapter = await navigator.gpu.requestAdapter();
            if (!adapter) throw new Error('No Adapter Found');
            this.gPUDevice = await adapter.requestDevice();
        }
        return Device.gPUDevice;
    }
}
