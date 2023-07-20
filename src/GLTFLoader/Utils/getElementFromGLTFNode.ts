import { primitiveMesh } from '../../Entities/primitiveMesh';
import {
    GLTFAccessor,
    GLTFBuffer,
    GLTFBufferView,
    GLTFMesh,
    GLTFNode,
} from './gLTFLoaderUtils';
import { GetMesh } from './getMesh';

export class GetElementFromGLTFNode {
    async execute(
        gLTFNode: GLTFNode,
        meshes: GLTFMesh[],
        accessors: GLTFAccessor[],
        gLTFBufferViews: GLTFBufferView[],
        buffers: GLTFBuffer[],
        resourceURL: string,
    ): Promise<primitiveMesh> {
        if (gLTFNode.mesh != undefined) {
            return await new GetMesh().execute(
                meshes[gLTFNode.mesh],
                accessors,
                gLTFBufferViews,
                buffers,
                resourceURL,
            );
        } else {
            return new primitiveMesh();
        }
    }
}
