export class pathToArrayBufferConverter{
async convert(path:string){
    const bin : Response= await fetch(path)
    const arrayBuffer = await bin.arrayBuffer();
    return arrayBuffer;
}
}