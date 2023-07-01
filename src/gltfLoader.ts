import { getGLTTFromGLTFJson } from "./Adapters/getGLTTFromGLTFJson";
import { GLTF } from "./Entities/gLTF";
import { GLTFJson } from "./Utils/GLTFLoaderUtils";

export class GLTFLoader {

    load =async(resourceURL:string,callback:(gltf:GLTF)=>void)=>{

        try{
            const gltfResponse : Response  = await fetch(resourceURL);
            const gltfText  = await gltfResponse.text();
            const gltfJSON  = <GLTFJson>JSON.parse(gltfText);
            const gltf = await new  getGLTTFromGLTFJson().execute(gltfJSON,resourceURL);
            callback(gltf)
        }catch(error){
            console.log(error)
        }
    }
}