import * as THREE from 'three'
import { PlainAnimator } from 'three-plain-animator/lib/plain-animator'

export default class AnimatedPlains
{
    constructor(experience)
    {
        this.experience = experience
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // Setup


        // this.setWinterAnimationModel()
    }

    setWinterAnimationModel()
    {
        this.winterAnimation = new PlainAnimator(this.winterAnimationTexture, 6, 6, 10, 10)
        this.winterAnimationGeo = new THREE.PlaneGeometry(2, 2)
        this.winterAnimationMap = this.winterAnimation.init()
        this.winterAnimationMat = new THREE.MeshBasicMaterial({map: this.winterAnimationMap, transparrent: true})
        this.winterAnimationMesh = new THREE.Mesh(this.winterAnimationGeo, this.winterAnimationMat)
        this.winterAnimationMesh.position.set(7.3,-1,3.5)
        this.scene.add(this.winterAnimationMesh)
    }

    update()
    {
    }
}