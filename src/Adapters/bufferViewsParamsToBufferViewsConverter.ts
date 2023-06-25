import BufferViewParams from "../DTO/bufferViewParams";

export class ArrayBufferConverter {

    convert(bufferViewParams: BufferViewParams): ArrayBuffer {
        switch(bufferViewParams.componentType){
            case  5120:
                return new Int8Array(
                    bufferViewParams.buffer,
                    bufferViewParams.byteOffset,
                    bufferViewParams.byteLength
                )
            case 5121:
                return new Uint8Array(
                    bufferViewParams.buffer,
                    bufferViewParams.byteOffset,
                    bufferViewParams.byteLength
                )
            case 5122 : 
                return new Int16Array(
                    bufferViewParams.buffer,
                    bufferViewParams.byteOffset,
                    bufferViewParams.byteLength
                )
            case 5123 : 
                return new Uint16Array(
                    bufferViewParams.buffer,
                    bufferViewParams.byteOffset,
                    bufferViewParams.byteLength
                )
            case 5126 : 
                return new Float32Array(
                    bufferViewParams.buffer,
                    bufferViewParams.byteOffset,
                    bufferViewParams.byteLength
                )
            default :
            return bufferViewParams.buffer
        }        
    }
}