import { GLTF } from './Entities/gLTF';
import { PrimitivCoreUtils } from './Entities/primitivCore';
import { GLTFLoader } from './GLTFLoader/gltfLoader';

PrimitivCoreUtils.init()
    .then(() => {
        void new GLTFLoader().load(
            './GLTFLoader/gLTF/test2.gltf',
            (gltf: GLTF) => {
                console.log(gltf.scenes[0]);
            },
        );
    })
    .catch(() => {});
