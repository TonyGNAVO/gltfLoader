import {
    BufferAttributeName,
    BufferGeometry,
} from '../../Entities/bufferGeometry';
import {
    GLTFAccessor,
    GLTFBuffer,
    GLTFBufferView,
    GLTFPrimitive,
    GLTFType,
} from './gLTFLoaderUtils';
import { GetBufferView } from './getBufferView';

export class GetBufferGeometry {
    async execute(
        primitive: GLTFPrimitive,
        accessors: GLTFAccessor[],
        GLTFBufferViews: GLTFBufferView[],
        buffers: GLTFBuffer[],
        resourceURL: string,
    ): Promise<BufferGeometry> {
        const bufferGeometry = new BufferGeometry();

        for await (const [key, value] of Object.entries(primitive.attributes)) {
            if (key === 'POSITION') {
                const accessor = accessors[value];
                const component = this.convertTypeToNumber(accessor);
                const bufferViews = await new GetBufferView().execute(
                    accessor,
                    GLTFBufferViews,
                    buffers,
                    resourceURL,
                );
                bufferGeometry.setAttributes(
                    BufferAttributeName.POSITION,
                    bufferViews,
                    component,
                );
                continue;
            }
            if (key === 'NORMAL') {
                const accessor = accessors[value];
                const component = this.convertTypeToNumber(accessor);
                const bufferViews = await new GetBufferView().execute(
                    accessor,
                    GLTFBufferViews,
                    buffers,
                    resourceURL,
                );

                bufferGeometry.setAttributes(
                    BufferAttributeName.NORMAL,
                    bufferViews,
                    component,
                );
                continue;
            }
            if (key === 'TEXCOORD_0') {
                const accessor = accessors[value];
                const component = this.convertTypeToNumber(accessor);
                const bufferViews = await new GetBufferView().execute(
                    accessor,
                    GLTFBufferViews,
                    buffers,
                    resourceURL,
                );
                bufferGeometry.setAttributes(
                    BufferAttributeName.TEXCOORD,
                    bufferViews,
                    component,
                );
                continue;
            }
            if (key === 'COLOR_0') {
                const accessor = accessors[value];
                const component = this.convertTypeToNumber(accessor);
                const bufferViews = await new GetBufferView().execute(
                    accessor,
                    GLTFBufferViews,
                    buffers,
                    resourceURL,
                );
                bufferGeometry.setAttributes(
                    BufferAttributeName.COLOR,
                    bufferViews,
                    component,
                );
                continue;
            }
            if (key === 'TANGANT') {
                const accessor = accessors[value];
                const component = this.convertTypeToNumber(accessor);
                const bufferViews = await new GetBufferView().execute(
                    accessor,
                    GLTFBufferViews,
                    buffers,
                    resourceURL,
                );
                bufferGeometry.setAttributes(
                    BufferAttributeName.TANGENT,
                    bufferViews,
                    component,
                );
                continue;
            }
        }

        if (primitive.indices) {
            const accessor = accessors[primitive.indices];
            const component = this.convertTypeToNumber(accessor);
            const bufferViews = await new GetBufferView().execute(
                accessor,
                GLTFBufferViews,
                buffers,
                resourceURL,
            );
            bufferGeometry.index = { array: bufferViews, component };
        }

        return bufferGeometry;
    }

    private convertTypeToNumber(accessor: GLTFAccessor): number {
        if (accessor.type === GLTFType.SCALAR) {
            return 1;
        }
        if (accessor.type === GLTFType.VEC2) {
            return 2;
        }
        if (accessor.type === GLTFType.VEC3) {
            return 3;
        }
        if (accessor.type === GLTFType.VEC4) {
            return 4;
        } else {
            throw new Error(
                'this type of accessor is not known. It is therefore impossible to deduce the number of components per vertex',
            );
        }
    }
}
