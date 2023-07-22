export abstract class Material {
    renderPipeline?: GPURenderPipeline | null = null;
    constructor() {}
}

export class meshBasicMaterial extends Material {
    constructor(params?: meshBasicMaterialParameters) {
        super();
    }
}

type meshBasicMaterialParameters = {};
