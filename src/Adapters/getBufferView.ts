import { GLTFAccessor, GLTFBuffer, GLTFBufferView } from "../Utils/GLTFLoaderUtils";
import { ArrayBufferConverter } from "./bufferViewsParamsToBufferViewsConverter";
import { GetBufferViewsParams } from "./getBufferViewsParams";

export class GetBufferView{
    async execute(accessor:GLTFAccessor,bufferViews : GLTFBufferView[],buffers : GLTFBuffer[], resourceURL:string) :Promise<ArrayBuffer>{
        const bufferViewParams = await new GetBufferViewsParams().execute(accessor,bufferViews,buffers,resourceURL);
        return new ArrayBufferConverter().convert(bufferViewParams);
    }   
}