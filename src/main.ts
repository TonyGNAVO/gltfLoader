import { GLTF } from './GLTFLoader/Entities/gLTF';
import { GLTFLoader } from './GLTFLoader/gltfLoader';


void new GLTFLoader().load('./GLTFLoader/gLTF/test2.gltf', (gltf: GLTF) => {
    console.log(gltf);
});
