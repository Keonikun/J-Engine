import * as THREE from 'three'

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

        this.setModels()
    }

    setModels()
    {
        this.scene.add(this.physMesh.scene)
    }
}