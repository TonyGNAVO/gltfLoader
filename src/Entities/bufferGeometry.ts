import { Device } from './primitivCore';

export class BufferGeometry {
    attributes: BufferAttributes | null = null;
    index?: BufferAttribute;
    private renderPipeline: GPURenderPipeline | null = null;
    private constructor() {
        // tjs
        // const device = Device.getInstance();
        //construction d'une pipeline
        // construire la pipeline
        // créer des veRTEXbUFFER
    }

    static async getInstance(): Promise<BufferGeometry> {
        const bufferGeometry = new BufferGeometry();
        const device = await Device.getInstance();
        if (!device) {
            return bufferGeometry;
        }
        bufferGeometry.renderPipeline = device?.createRenderPipeline({});

        // return une instance de buffergeometry
        return bufferGeometry;
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
