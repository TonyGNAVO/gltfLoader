class GLTFLoader {

    constructor(){

    }

    load =async(path:string,callback:()=>void)=>{

        // mettre un try catch
        const gltfResponse : Response  = await fetch(path);
        const gltfText  = await gltfResponse.text();
        const gltfJSON  = <JSON>JSON.parse(gltfText);
        
        // 1 scene + 1 noeuds

        
    
        // retourner une liste une liste de mesh
    }
}