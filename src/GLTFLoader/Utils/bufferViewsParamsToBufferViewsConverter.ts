import BufferViewParams from '../DTO/bufferViewParams';

export class ArrayBufferConverter {
    // TODO, set buffer only one time on mesh or on geometry.
    convert(bufferViewParams: BufferViewParams): ArrayBuffer {
        switch (bufferViewParams.componentType) {
            case 5120:
                return new Int8Array(
                    bufferViewParams.buffer,
                    bufferViewParams.byteOffset,
                    bufferViewParams.byteLength,
                );
            case 5121:
                return new Uint8Array(
                    bufferViewParams.buffer,
                    bufferViewParams.byteOffset,
                    bufferViewParams.byteLength,
                );
            case 5122:
                return new Int16Array(
                    bufferViewParams.buffer,
                    bufferViewParams.byteOffset,
                    bufferViewParams.byteLength / 2,
                );
            case 5123:
                return new Uint16Array(
                    bufferViewParams.buffer,
                    bufferViewParams.byteOffset,
                    bufferViewParams.byteLength / 2,
                );
            case 5125:
                return new Uint32Array(
                    bufferViewParams.buffer,
                    bufferViewParams.byteOffset,
                    bufferViewParams.byteLength / 4,
                );
            case 5126:
                return new Float32Array(
                    bufferViewParams.buffer,
                    bufferViewParams.byteOffset,
                    bufferViewParams.byteLength / 4,
                );
            default:
                return bufferViewParams.buffer;
        }
    }
}
