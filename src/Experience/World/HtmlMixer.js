import * as THREE from 'three'
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer'

export default class HtmlMixer
{
    constructor(experience)
    {
        this.experience = experience
        this.scene = this.experience.scene
        this.cssScene = this.experience.cssScene
        this.camera = this.experience.camera
        this.resources = this.experience.resources
        
        this.createHtmlMixer()
        this.createDomElement()
    }

    createHtmlMixer()
    {
        this.htmlMixerGeo = new THREE.PlaneGeometry(2,2, 10, 10)
        this.htmlMixerMat = new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true})
        this.htmlMixerMesh = new THREE.Mesh( this.htmlMixerGeo, this.htmlMixerMat )
        this.scene.add(this.htmlMixerMesh)
    }

    createDomElement()
    {
        this.element = document.createElement( 'div' )

        this.cssObject = new CSS3DObject(this.element)
        this.cssObject.element.textContent = "I am here"
        console.log(this.cssObject)
        // this.cssObject.element.position.rotation.y = Math.PI *
        this.scene.add(this.cssObject)
        this.cssObject.position.set(this.htmlMixerMesh.position)
        this.cssObject.rotation.set(this.htmlMixerMesh.position)
        this.cssObject.scale.set(0.1,0.1,0.1)
    }
}