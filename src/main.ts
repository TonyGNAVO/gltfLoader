import { GLTF } from './Entities/gLTF';
import { PrimitivCoreUtils } from './Entities/primitivCore';
import { GLTFLoader } from './GLTFLoader/gltfLoader';
import { WebGPURenderer } from './WebGPURender/webGPURender';

PrimitivCoreUtils.init()
    .then(() => {
        void new GLTFLoader().load(
            './GLTFLoader/gLTF/test2.gltf',
            (gltf: GLTF) => {
                const canvas = document.querySelector(
                    '.webgpu',
                ) as HTMLCanvasElement;
                const renderer = new WebGPURenderer({
                    canvas,
                });
                    renderer.render(gltf.scenes[0])
            },
        );
    })
    .catch(() => {});
