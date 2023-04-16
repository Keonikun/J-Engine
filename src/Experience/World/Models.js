export default class Models
{
    constructor(experience)
    {
        this.experience = experience
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
    
        // GLTF Setup
        this.gltfScene = this.resources.items.gltfScene
        this.gltfScene.scene.children.forEach(element => {
            if(element.name === "PhysMesh")
            {
                this.physMesh = element
            }
            if(element.name === "StaticMesh")
            {
                this.staticMesh = element
            }
        });

        this.setModels()
        this.positionModels()
    }

    setModels()
    {
        this.scene.add(this.physMesh)
        this.scene.add(this.staticMesh)
    }

    positionModels()
    {
    }
}