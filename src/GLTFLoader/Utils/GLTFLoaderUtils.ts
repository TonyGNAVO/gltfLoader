export type GLTFAccessor = {
    componentType: number;
    count: number;
    bufferView?: number;
};

export type GLTFBufferView = {
    buffer: number;
    byteOffset?: number;
    byteLength: number;
};

export type GLTFBuffer = {
    uri?: string;
};

export type GLTFPrimitive = {
    attributes: GLTFAttributes;
    indices?: number;
};

type GLTFAttributes = {
    POSITION: number;
    NORMAL?: number;
    TEXCOORD_0?: number;
    COLOR_0?: number;
    TANGANT?: number;
};

export type GLTFMesh = {
    primitives: GLTFPrimitive[];
};

export type GLTFNode = {
    mesh?: number;
};

export type GLTFScene = {
    nodes?: number[];
};

export type GLTFJson = {
    scenes?: GLTFScene[];
    nodes?: GLTFNode[];
    meshes?: GLTFMesh[];
    accessors?: GLTFAccessor[];
    bufferViews?: GLTFBufferView[];
    buffers?: GLTFBuffer[];
};
