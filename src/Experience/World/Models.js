export default class Models
{
    constructor(experience)
    {
        this.experience = experience
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
    
        // GLTF Setup
        this.physMesh = this.resources.items.physMesh
        this.staticMesh = this.resources.items.staticMesh

        this.setModels()
        this.positionModels()
    }

    setModels()
    {
        this.scene.add(this.physMesh.scene)
        this.scene.add(this.staticMesh.scene)
    }

    positionModels()
    {
    }
}