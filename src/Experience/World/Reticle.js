import * as THREE from 'three'

export default class Reticle
{
    constructor(experience)
    {
        this.experience = experience
        this.scene = this.experience.scene
        this.camera = this.experience.camera.instance
        
        this.createReticle()
    }

    createReticle()
    {
        this.reticleGeo = new THREE.BoxGeometry(0.1,0.1,0.1)
        this.reticleMat = new THREE.MeshBasicMaterial({color: 0xffffff})
        this.reticle = new THREE.Mesh(this.reticleGeo, this.reticleMat)
        this.reticle.rotation.x = - Math.PI * 0.5
        this.scene.add(this.reticle)
    }

    update()
    {
        this.reticle.position.set(
            this.camera.position.x - Math.sin(this.camera.rotation.y),
            this.camera.position.y,
            this.camera.position.z - Math.cos(this.camera.rotation.y)
        )
    }
}