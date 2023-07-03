import { getGLTTFromGLTFJson } from './Utils/getGLTTFromGLTFJson';
import { GLTF } from '../Entities/gLTF';
import { GLTFJson } from './Utils/gLTFLoaderUtils';

export class GLTFLoader {
    load = async (resourceURL: string, callback: (gltf: GLTF) => void) => {
        const gltfResponse: Response = await fetch(resourceURL);
        const gltfText = await gltfResponse.text();
        const gltfJSON = <GLTFJson>JSON.parse(gltfText);
        const gltf = await new getGLTTFromGLTFJson().execute(
            gltfJSON,
            resourceURL,
        );
        callback(gltf);
    };
}
