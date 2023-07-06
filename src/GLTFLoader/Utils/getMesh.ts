import { Mesh } from '../../Entities/Mesh';
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
    ): Promise<Mesh> {
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
        const mesh = new Mesh(primitives);
        return mesh;
    }
}
