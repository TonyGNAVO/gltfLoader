import { primitiveMesh } from '../../Entities/primitiveMesh';
import { BufferGeometry } from '../../Entities/bufferGeometry';
import {
    GLTFAccessor,
    GLTFBuffer,
    GLTFBufferView,
    GLTFMesh,
} from './gLTFLoaderUtils';
import { GetBufferGeometry } from './getBufferGeometry';
import { Material, meshBasicMaterial } from '../../Entities/Material';

export class GetMesh {
    async execute(
        gLTFMesh: GLTFMesh,
        accessors: GLTFAccessor[],
        GLTFBufferViews: GLTFBufferView[],
        buffers: GLTFBuffer[],
        resourceURL: string,
    ): Promise<primitiveMesh> {
        const primitives: BufferGeometry[] = [];
        const material: Material[] = [];
        for await (const primitive of gLTFMesh.primitives) {
            const bufferGeometry = await new GetBufferGeometry().execute(
                primitive,
                accessors,
                GLTFBufferViews,
                buffers,
                resourceURL,
            );
            primitives.push(bufferGeometry);
            material.push(new meshBasicMaterial())
        }
        const mesh = new primitiveMesh(primitives,material);
        return mesh;
    }
}
