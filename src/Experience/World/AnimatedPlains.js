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
        this.doorSpriteSheet = this.resources.items.doorSpriteSheet

        this.setAnimatedPlanes()

        this.positionPlanes()
    }

    setAnimatedPlanes()
    {
        this.doorAnimPlane = new PlainAnimator( this.doorSpriteSheet, 3, 1, 3, 10 )
        this.doorAnimPlaneGeo = new THREE.PlaneGeometry(1.3, 1)
        this.doorAnimPlaneMap = this.doorAnimPlane.init()
        this.doorAnimPlaneMat = new THREE.MeshBasicMaterial({map: this.doorAnimPlaneMap})
        this.doorAnimPlaneMesh = new THREE.Mesh(this.doorAnimPlaneGeo, this.doorAnimPlaneMat)
        this.scene.add(this.doorAnimPlaneMesh)
    }


    positionPlanes()
    {
        this.doorAnimPlaneMesh.position.set(7.10413,1.69006,-3.54885)
        this.doorAnimPlaneMesh.rotation.y = Math.PI * 1.5
    }

    update()
    {
        this.doorAnimPlane.animate()
    }
}