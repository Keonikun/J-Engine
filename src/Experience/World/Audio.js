import * as THREE from 'three'

export default class Audio
{
    constructor(experience)
    {
        this.experience = experience
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.camera = this.experience.camera.instance

        // Setup
        this.listener = new THREE.AudioListener()
        this.scene.add(this.listener)

        this.setPositionalAudio()
        this.setSpeakers() 
    }

    setPositionalAudio()
    {
        this.galaxy = new THREE.PositionalAudio(this.listener)

        this.galaxyAudio = this.resources.items.galaxy
        this.galaxy.setBuffer(this.galaxyAudio)
        this.galaxy.setRefDistance(0.05)
        this.galaxy.setLoop(true)
    }

    setSpeakers()
    {
        this.speakerGeo = new THREE.BoxGeometry(0.2,0.2,0.2)
        this.speakerMat = new THREE.MeshBasicMaterial({color: 0x000000, visible: true})

        this.galaxySpeaker = new THREE.Mesh(this.speakerGeo, this.speakerMat)
        this.galaxySpeaker.position.set(-13.89,2.7,-4.48)
        this.galaxySpeaker.add(this.galaxy)
        this.scene.add(this.galaxySpeaker)
    }

    playAudio()
    {
        this.galaxy.play()
    }

    update()
    {
        this.listener.position.set(this.camera.position.x, this.camera.position.y, this.camera.position.z)
        this.listener.rotation.set(this.camera.rotation.x, this.camera.rotation.y, this.camera.rotation.z)
    }

}