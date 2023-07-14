import { GLTF } from './Entities/gLTF';
import { PrimitivCoreUtils } from './Entities/primitivCore';
import { Scene } from './Entities/scene';
import { GLTFLoader } from './GLTFLoader/gltfLoader';
import { WebGPURenderer } from './WebGPURender/webGPURender';

let renderer: WebGPURenderer;
let scene: Scene;

PrimitivCoreUtils.init()
    .then(() => {
        void new GLTFLoader().load(
            './GLTFLoader/gLTF/test2.gltf',
            (gltf: GLTF) => {
                const canvas = document.querySelector(
                    '.webgpu',
                ) as HTMLCanvasElement;
                renderer = new WebGPURenderer({
                    canvas,
                });
                scene = gltf.scenes[0];
                tick()
            },
        );
    })
    .catch(() => {});

const tick = () => {

    renderer.render(scene);
    requestAnimationFrame(tick);
};
