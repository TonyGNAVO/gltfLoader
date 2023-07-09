import BufferViewParams from '../DTO/bufferViewParams';
import { GLTFAccessor, GLTFBuffer, GLTFBufferView } from './gLTFLoaderUtils';
import { pathToArrayBufferConverter } from './pathToArrayBufferConverter';

export class GetBufferViewsParams {
    async execute(
        accessor: GLTFAccessor,
        bufferViews: GLTFBufferView[],
        buffers: GLTFBuffer[],
        resourceURL: string,
    ): Promise<BufferViewParams> {
        if (accessor.bufferView == undefined)
            throw new Error(
                'The GLTF accessor does not point to any bufferView.',
            );

        const bufferView = bufferViews[accessor.bufferView];
        const byteLength = bufferView.byteLength;
        const buffer = buffers[bufferView.buffer];

        if (!buffer.uri)
            throw new Error('The GLTF buffer does not have a URI.');

        const bufferURI = resourceURL.replace(/gltf$/, 'bin');
        const converter = new pathToArrayBufferConverter();
        const arrayBuffer = await converter.convert(bufferURI);
        let byteOffset = bufferView.byteOffset;

        if (!byteOffset) byteOffset = 0;
        return {
            count: accessor.count,
            byteOffset,
            buffer: arrayBuffer,
            componentType: accessor.componentType,
            byteLength,
        };
    }
}
