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
        this.setModelAnimations()
        this.positionModels()
    }

    setModels()
    {
        this.scene.add(this.physMesh.scene)
    }
    
    setModelAnimations()
    {
        this.doorMixer = new THREE.AnimationMixer( this.physMesh.scene )
        this.doorAnimation = this.doorMixer.clipAction(this.physMesh.animations[0])
        this.doorAnimation.setLoop( THREE.LoopOnce )
        this.doorAnimation.clampWhenFinished = true

        this.drawerMixer = new THREE.AnimationMixer( this.physMesh.scene )
        this.drawerAnimation = this.drawerMixer.clipAction(this.physMesh.animations[1])
        this.drawerAnimation.clampWhenFinished = false
    }

    positionModels()
    {
        
    }

    playAnimation(animation)
    {
        eval("this." + animation + ".play()")
    }

    update()
    {
        if(this.experience.loadingFinished === true)
        {
            this.doorMixer.update(this.time.delta * 0.001)
            this.drawerMixer.update(this.time.delta * 0.001)
        }
    }
}