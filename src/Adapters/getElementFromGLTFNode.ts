import { Mesh } from "../Entities/Mesh";
import { GLTFAccessor, GLTFBuffer, GLTFBufferView, GLTFMesh, GLTFNode} from "../Utils/GLTFLoaderUtils";
import { GetMesh } from "./getMesh";

export class GetElementFromGLTFNode{
    async execute(
        gLTFNode: GLTFNode, 
        meshes:  GLTFMesh[],
        accessors:  GLTFAccessor[],
        gLTFBufferViews : GLTFBufferView[],
        buffers : GLTFBuffer[],
        resourceURL:string
        ):Promise<Mesh>{

        if(gLTFNode.mesh){
            return await new GetMesh().execute(meshes[gLTFNode.mesh],accessors,gLTFBufferViews,buffers,resourceURL);
        }else{
            return new Mesh();
        }
    }
}