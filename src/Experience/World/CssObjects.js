import * as THREE from 'three'
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js'

export default class CssObjects
{
    constructor(experience)
    {
        this.experience = experience
        this.scene = this.experience.scene
        this.cssScene = this.experience.cssScene
        this.camera = this.experience.camera
        this.resources = this.experience.resources
        this.sizes = this.experience.sizes

        this.position = new THREE.Vector3(0,1,10)

        this.setIframe()
    }

    setIframe()
    {
        this.container = document.querySelector('.cssContainer')
        this.iframe = document.createElement('iframe')
        this.iframe.src = 'iframe/iframe.html'
        this.iframe.style.width = this.sizes.width + 'px'
        this.iframe.style.height = this.sizes.height + 'px'
        this.iframe.style.zIndex = 1
        this.iframe.style.boxSizing = 'border-box'
        this.setCssObject()
    }

    setCssObject(element)
    {
        
        this.cssObject = new CSS3DObject(this.iframe)

        this.cssObject.position.copy(this.position)
        this.cssObject.scale.set(0.001,0.001,0.001)
        this.cssScene.add(this.cssObject)

        this.material = new THREE.MeshLambertMaterial()
        this.material.side = THREE.DoubleSide
        this.material.opacity = 0
        this.material.transparent = true
        this.material.blending = THREE.NoBlending

        this.mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(1, 1),
            this.material
        )

        this.mesh.position.copy(this.cssObject.position)
        this.mesh.scale.copy(this.cssObject.scale)

        this.scene.add(this.mesh)
    }

    updatePosition()
    {

    }
}