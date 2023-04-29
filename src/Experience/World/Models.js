import { computeBoundsTree, disposeBoundsTree , acceleratedRaycast } from "three-mesh-bvh"
import { BufferGeometry } from "three"

export default class Models
{
    constructor(experience)
    {
        this.experience = experience
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time

        BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
        BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;

        // GLTF Setup
        this.gltfScene = this.resources.items.gltfScene
        this.gltfScene.scene.children.forEach(element => {
            if(element.name === "PhysMesh")
            {
                this.physMesh = element

                this.physMesh.children.forEach(element => 
                {
                    if(element.type === 'Mesh')
                    {
                        element.geometry.computeBoundsTree()
                    }
                    if(element.type === 'Group')
                    {
                        element.children.forEach(groupElement => 
                        {
                            groupElement.geometry.computeBoundsTree()
                        });
                    }
                });
            }
            if(element.name === "StaticMesh")
            {
                this.staticMesh = element
            }
        });

        this.setModels()
        this.positionModels()
    }

    setModels()
    {
        this.scene.add(this.physMesh)
        this.scene.add(this.staticMesh)
    }

    positionModels()
    {
    }
}