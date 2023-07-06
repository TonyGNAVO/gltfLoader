export class BufferGeometry {
    attributes: BufferAttributes | undefined = undefined;
    index?: BufferAttribute;

    setAttributes(attribute: BufferAttributeName, arrayBuffer: ArrayBuffer) {
        if (
            !Object.values(BufferAttributeName).some((val) => val === attribute)
        )
            throw new Error(`${attribute} is not a geometry attribute`);

        if (!this.attributes) this.attributes = {};

        this.attributes[attribute] = { array: arrayBuffer };
    }

    // quand je set une valeur, je créer un nouvelle pipeline et je la mets à jour
    // arraystride some 4*nombre de composant looper.
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
