import { primitiveMesh } from '../../Entities/primitiveMesh';
import { BufferGeometry } from '../../Entities/bufferGeometry';
import {
    GLTFAccessor,
    GLTFBuffer,
    GLTFBufferView,
    GLTFMesh,
} from './gLTFLoaderUtils';
import { GetBufferGeometry } from './getBufferGeometry';

export class GetMesh {
    async execute(
        gLTFMesh: GLTFMesh,
        accessors: GLTFAccessor[],
        GLTFBufferViews: GLTFBufferView[],
        buffers: GLTFBuffer[],
        resourceURL: string,
    ): Promise<primitiveMesh> {
        const primitives: BufferGeometry[] = [];
        for await (const primitive of gLTFMesh.primitives) {
            const bufferGeometry = await new GetBufferGeometry().execute(
                primitive,
                accessors,
                GLTFBufferViews,
                buffers,
                resourceURL,
            );
            primitives.push(bufferGeometry);
        }
        const mesh = new primitiveMesh(primitives);
        return mesh;
    }
}
