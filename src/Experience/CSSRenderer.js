import * as THREE from 'three'
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer'

export default class cssRenderer
{
    constructor(experience)
    {
        this.experience = experience
        this.canvas = this.experience.canvas
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera

        this.setInstance()
    }

    setInstance()
    {
        this.instance = new CSS3DRenderer()
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.domElement.style.position = 'absolute'
        this.instance.domElement.style.top = 0
        document.querySelector('.cssViewport').appendChild(this.instance.domElement)
    }

    resize()
    {
        this.instance.setSize(this.sizes.width, this.sizes.height)
    }

    update()
    {
        this.instance.render(this.scene, this.camera.instance)
    }
}