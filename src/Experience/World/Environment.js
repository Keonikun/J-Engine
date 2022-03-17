import * as THREE from 'three'

export default class Environment
{
    constructor(experience)
    {
        this.experience = experience
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.setAmbientLight()
        this.setDirectionalLight()
        this.setFog()
        this.setBackground()
    }

    setAmbientLight()
    {
        this.ambientLight = new THREE.AmbientLight( '#ffffff', 1 )
        this.scene.add(this.ambientLight)
    }

    setDirectionalLight()
    {
        this.directionalLight = new THREE.DirectionalLight( '#ffffff', 0.8 )
        this.directionalLight.position.set(3.5, 2, - 1.25)
        this.scene.add(this.directionalLight)
    }

    setFog()
    {
        this.scene.fog = new THREE.Fog('#adadad', 40, 80)
    }

    setBackground()
    {
        this.scene.background = new THREE.Color( '#ccffff' )
    }
}