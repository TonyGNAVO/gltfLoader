import { Mesh } from "../Entities/Mesh";
import { GLTFAccessor, GLTFBuffer, GLTFBufferView, GLTFMesh} from "../Utils/GLTFLoaderUtils";
import { GetBufferGeometry } from "./getBufferGeometry";

export class GetMesh {
    async execute(gLTFMesh: GLTFMesh, accessors:GLTFAccessor[],GLTFBufferViews : GLTFBufferView[],buffers : GLTFBuffer[],resourceURL:string):Promise<Mesh>{
        const mesh =new Mesh();
        for await(const primitive of gLTFMesh.primitives ){
            const bufferGeometry = await new GetBufferGeometry().execute(primitive,accessors,GLTFBufferViews,buffers,resourceURL)
            mesh.primitives.push(bufferGeometry)
        }
        return mesh;
    }

}