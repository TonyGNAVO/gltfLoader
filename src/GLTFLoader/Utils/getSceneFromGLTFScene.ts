import { Scene } from '../../Entities/scene';
import {
    GLTFAccessor,
    GLTFBuffer,
    GLTFBufferView,
    GLTFMesh,
    GLTFNode,
    GLTFScene,
} from './gLTFLoaderUtils';
import { GetElementFromGLTFNode } from './getElementFromGLTFNode';

export class GetElementFromGLTFScene {
    async execute(
        gLTFScene: GLTFScene,
        gLTFNodes: GLTFNode[],
        gLTFmeshes: GLTFMesh[],
        accessors: GLTFAccessor[],
        gLTFBufferViews: GLTFBufferView[],
        buffers: GLTFBuffer[],
        resourceURL: string,
    ): Promise<Scene> {
        const scene = new Scene();
        if (!gLTFScene.nodes) {
            return scene;
        }
        for await (const nodeIndex of gLTFScene.nodes) {
            const mesh = await new GetElementFromGLTFNode().execute(
                gLTFNodes[nodeIndex],
                gLTFmeshes,
                accessors,
                gLTFBufferViews,
                buffers,
                resourceURL,
            );
            scene.children.push(mesh);
        }
        return scene;
    }
}
