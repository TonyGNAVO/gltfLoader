import { GLTF } from "../../Entities/gLTF";
import { GLTFJson } from "./GLTFLoaderUtils";
import { GetElementFromGLTFScene } from "./getSceneFromGLTFScene";

export class getGLTTFromGLTFJson{
    async execute(gltfJson: GLTFJson,resourceURL:string):Promise<GLTF>{
        
        const gLTF = new GLTF();

        if(!(gltfJson.scenes&&gltfJson.nodes&&gltfJson.meshes&&gltfJson.accessors&&gltfJson.bufferViews&&gltfJson.buffers)){
            return gLTF;
        }
        for await(const gLTFScene of gltfJson.scenes){
           const scene = await new GetElementFromGLTFScene().execute(
            gLTFScene,
            gltfJson.nodes,
            gltfJson.meshes,
            gltfJson.accessors,
            gltfJson.bufferViews,
            gltfJson.buffers,
            resourceURL
            );

            gLTF.scenes.push(scene)
        }

        return gLTF;   
    }

}