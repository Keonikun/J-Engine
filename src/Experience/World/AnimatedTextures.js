import * as THREE from 'three'
import { PlainAnimator } from 'three-plain-animator/lib/plain-animator'

export default class AnimatedPlains
{
    constructor(experience)
    {
        this.experience = experience
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        //Setup
        this.staticMesh = this.resources.items.staticMesh
        this.waterAnimTexture = this.resources.items.waterAnim

        this.setAnimatedMaterials()
    }

    setAnimatedMaterials()
    {
        this.waterAnim = new PlainAnimator(this.waterAnimTexture, 8, 4, 32, 10)
        this.waterAnimMap = this.waterAnim.init()
        this.waterAnimMaterial = new THREE.MeshBasicMaterial({map: this.waterAnimMap, transparrent: true})
        this.applyAnimatedMaterisl()
    }

    applyAnimatedMaterisl()
    {
        console.log(this.staticMesh)
        this.staticMesh.scene.children[0].children[2].material = this.waterAnimMaterial
    }

    update()
    {
        this.waterAnim.animate()
    }
}