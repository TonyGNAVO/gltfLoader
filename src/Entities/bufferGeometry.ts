export class BufferGeometry {
    attributes: BufferAttributes | null = null;
    index?: BufferAttribute;
    renderPipeline: GPURenderPipeline;
    constructor() {
        this.renderPipeline;
        //con,struction d'une pipeline
        // construire la pipeline
        // créer des veRTEXbUFFER

    }

    setAttributes(attribute: BufferAttributeName, arrayBuffer: ArrayBuffer) {
        if (
            !Object.values(BufferAttributeName).some((val) => val === attribute)
        )
            throw new Error(`${attribute} is not a geometry attribute`);

        if (!this.attributes) this.attributes = {};

        this.attributes[attribute] = { array: arrayBuffer };
    }
}

class BufferAttributes {
    position?: BufferAttribute;
    normal?: BufferAttribute;
    uv?: BufferAttribute;
    color?: BufferAttribute;
    tangent?: BufferAttribute;
}

class BufferAttribute {
    array?: ArrayBuffer;
}

export enum BufferAttributeName {
    POSITION = 'position',
    NORMAL = 'normal',
    TEXCOORD = 'uv',
    COLOR = 'color',
    TANGENT = 'tangent',
}
