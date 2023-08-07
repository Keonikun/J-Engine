import * as THREE from 'three'
import { gsap } from 'gsap'

export default class Camera{
    constructor(experience)
    {
        this.experience = experience
        this.world = this.experience.world
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.cssScene = this.experience.cssScene
        this.canvas = this.experience.canvas
        this.debug = this.experience.debug
        
        this.setInstance()
    }

    setInstance()
    {
        this.instance = new THREE.PerspectiveCamera( 50, this.sizes.width / this.sizes.height, 0.1, 100 )
        this.scene.add(this.instance)

        this.fovAnimationTime = 1

        this.fovTransitioning = false
        this.fovVariable = 
        {
            fov: 50
        }
    }

    animateFovTo( fov )
    {
        this.fovTransitioning = true
        this.fovAnimation = gsap.to(this.fovVariable, { fov: fov , duration: this.fovAnimationTime, onComplete: () => { this.fovTransitioning = false } })
        this.fovAnimation.play()
    }

    resize()
    {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update()
    {
        if( this.fovTransitioning === true )
        {
            this.instance.fov = this.fovVariable.fov
            this.instance.updateProjectionMatrix()
        }
    }
}