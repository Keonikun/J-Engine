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
        this.door1 = this.resources.items.door1

        this.setModels()
        this.positionModels()
    }

    setModels()
    {
        this.scene.add(this.physMesh.scene)
        this.scene.add(this.door1.scene)
    }

    positionModels()
    {
        this.door1.scene.position.set(-5.95,0.9,-15.2)
    }
}