import { GLTF } from './Entities/gLTF';
import { GLTFLoader } from './gltfLoader';

void new GLTFLoader().load('gLTF/test2.gltf', (gltf: GLTF) => {
    console.log(gltf);
});
