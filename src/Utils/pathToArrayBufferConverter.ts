const paths = new Map<string, ArrayBuffer>();
export class pathToArrayBufferConverter{
    async convert(path:string){
        if(paths.has(path)){
            const arrayBuffer =paths.get(path)
            if(arrayBuffer==undefined){
                throw Error("Stop")
            }
            return arrayBuffer
        }else{
            const bin : Response= await fetch(path)
            const arrayBuffer = await bin.arrayBuffer();
            paths.set(path,arrayBuffer)
            return arrayBuffer;
        }
    }
}