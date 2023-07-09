export class PrimitivCoreUtils {
    private static gPUDevice: GPUDevice;
    private static gPUTextureFormat: GPUTextureFormat =
        navigator.gpu.getPreferredCanvasFormat();

    static async init() {
        if (!navigator.gpu) throw new Error('Not Support WebGPU');
        const adapter = await navigator.gpu.requestAdapter({});
        if (!adapter) throw new Error('No Adapter Found');
        this.gPUDevice = await adapter.requestDevice();
    }

    static get_gPUDevice(): GPUDevice {
        if (!this.gPUDevice) {
            throw Error(
                'you must initialize the library with the init function',
            );
        }
        return this.gPUDevice;
    }

    static get_gPUTextureFormat(): GPUTextureFormat {
        if (!this.gPUTextureFormat) {
            throw Error(
                'you must initialize the library with the init function',
            );
        }
        return this.gPUTextureFormat;
    }

    static get_gPUContext(): GPUTextureFormat {
        if (!this.gPUTextureFormat) {
            throw Error(
                'you must initialize the library with the init function',
            );
        }
        return this.gPUTextureFormat;
    }
}
