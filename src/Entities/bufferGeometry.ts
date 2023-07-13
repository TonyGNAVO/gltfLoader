export class BufferGeometry {
    attributes: BufferAttributes = {};
    vertexArrayBuffer: Float32Array = new Float32Array();
    index?: BufferAttribute;
    renderPipeline: GPURenderPipeline | null = null;
    count: number = 0;
    vertexBuffer: GPUBuffer | null = null;
    indexBuffer: GPUBuffer | null = null;

    setAttributes(
        attribute: BufferAttributeName,
        arrayBuffer: ArrayBuffer,
        component: number,
    ) {
        if (
            !Object.values(BufferAttributeName).some((val) => val === attribute)
        )
            throw new Error(`${attribute} is not a geometry attribute`);

        this.attributes[attribute] = { array: arrayBuffer, component };
    }
}

class BufferAttributes {
    position?: BufferAttribute;
    normal?: BufferAttribute;
    uv?: BufferAttribute;
    color?: BufferAttribute;
    tangent?: BufferAttribute;
}

interface ArrayLikeObject {
    length: number;
}

export class BufferAttribute {
    array?: ArrayBuffer;
    component?: number;
}

export enum BufferAttributeName {
    POSITION = 'position',
    NORMAL = 'normal',
    TEXCOORD = 'uv',
    COLOR = 'color',
    TANGENT = 'tangent',
}
