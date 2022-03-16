import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'

export default class Text
{
    constructor(experience)
    {
        this.experience = experience
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // Setup
        this.selnaRegular = this.resources.items.selnaRegular
        this.helvetiker = this.resources.items.helvetiker
        
        this.createTestText()
    }

    createTestText(file)
    {
        this.testTextGeometry = new TextGeometry(
            'Animated Material',
            {
                font: this.helvetiker,
                size: 0.15,
                height: 0,
                curveSegments: 5,
            }
        )

        this.testTextGeometry.center()

        this.testTextMaterial = new THREE.MeshBasicMaterial({color: 0x000000})
        this.testTextMesh = new THREE.Mesh(this.testTextGeometry, this.testTextMaterial)
        this.testTextMesh.position.set(7.3,-1.3,3.8)
        this.scene.add(this.testTextMesh)
    }
}