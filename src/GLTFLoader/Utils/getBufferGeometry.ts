import { BufferAttributeName, BufferGeometry } from "../Entities/bufferGeometry";
import { GLTFAccessor, GLTFBuffer, GLTFBufferView, GLTFPrimitive } from "./GLTFLoaderUtils";
import { GetBufferView } from "./getBufferView";

export class GetBufferGeometry{

   async execute(primitive: GLTFPrimitive, accessors:GLTFAccessor[],GLTFBufferViews : GLTFBufferView[],buffers : GLTFBuffer[],resourceURL:string):Promise<BufferGeometry>{
        
        const bufferGeometry = new BufferGeometry();

        for await (const [key, value] of Object.entries(primitive.attributes)) {
            if (key === "POSITION"){
                const accessor = accessors[value]
                const  bufferViews =  await new GetBufferView().execute(accessor,GLTFBufferViews,buffers,resourceURL)
                bufferGeometry.setAttributes(BufferAttributeName.POSITION,bufferViews)
                continue; 
            }
            if (key === "NORMAL"){
                const accessor = accessors[value]
                const  bufferViews =  await new GetBufferView().execute(accessor,GLTFBufferViews,buffers,resourceURL)
                bufferGeometry.setAttributes(BufferAttributeName.NORMAL,bufferViews)
                continue;
            }
            if (key === "TEXCOORD_0"){
                const accessor = accessors[value]
                const  bufferViews =  await new GetBufferView().execute(accessor,GLTFBufferViews,buffers,resourceURL)
                bufferGeometry.setAttributes(BufferAttributeName.TEXCOORD,bufferViews)
                continue;
            }
            if (key === "COLOR_0"){
                const accessor = accessors[value]
                const  bufferViews =  await new GetBufferView().execute(accessor,GLTFBufferViews,buffers,resourceURL)
                bufferGeometry.setAttributes(BufferAttributeName.COLOR,bufferViews)
                continue;
            }
            if (key === "TANGANT"){
                const accessor = accessors[value]
                const  bufferViews =  await new GetBufferView().execute(accessor,GLTFBufferViews,buffers,resourceURL)
                bufferGeometry.setAttributes(BufferAttributeName.TANGENT,bufferViews)
                continue;
            }
        }
        if (primitive.indices){
            const accessor = accessors[primitive.indices]
            const  bufferViews =  await new GetBufferView().execute(accessor,GLTFBufferViews,buffers,resourceURL)
            bufferGeometry.index={array:bufferViews}
        }

        return bufferGeometry;
    }

}