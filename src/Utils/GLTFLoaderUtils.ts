export type GLTFAccessor = {
    bufferView? : number
    componentType : number
}

export type GLTFBufferView = {
    buffer : number
    byteOffset? : number
    byteLength :number
}

export type GLTFBuffer = {
    uri? : string
}

export type GLTFPrimitive = {
    attributes : GLTFAttributes
}

 type GLTFAttributes = {
    POSITION : number,
    NORMAL? : number,
    TEXCOORD_0?:number,
    COLOR_0?:number
    TANGANT?:number
}