import { MeshBVH, MeshBVHVisualizer, StaticGeometryGenerator } from "three-mesh-bvh"
import * as THREE from 'three'
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils'

export default class Models
{
    constructor( experience )
    {
        this.experience = experience
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time

        this.loadColliderEnvironment()
        this.setModels()
    }

    loadColliderEnvironment()
    {
        this.physMesh = null
        this.staticMesh = null
        this.dynamicMesh = null

        this.staticScene = false
        this.dynamicScene = false
        
        // GLTF Setup
        this.gltfScene = this.resources.items.gltfScene

        this.gltfScene.scene.children.forEach( element => {

            // Setup for collider environment
            if( element.name === "PhysMesh" )
            {
                this.physMesh = element
            }
            // Setup for dynamic collider environment
            if( element.name === "DynamicObjects" )
            {
                this.dynamicObjects = element
                this.dynamicScene = true
            }
            // Setup for visual environment
            if(element.name === "StaticMesh")
            {
                this.staticMesh = element
                this.staticScene = true
            }
            if(element.name === "ArchSpeaker")
            {
                this.archSpeaker = element
            }
            if(element.name === "BrichSpeaker")
            {
                this.birchSpeaker= element
            }
            if(element.name === "CherrySpeaker")
            {
                this.cherrySpeaker = element
            }
            if(element.name === "FountainSpeaker")
            {
                this.fountainSpeaker = element
            }
            if(element.name === "WindowSpeaker")
            {
                this.windowSpeaker = element
            }
        })
    }

    setModels()
    {
        this.scene.add(this.physMesh)
        if(this.dynamicScene === true)
        {
            this.scene.add(this.dynamicObjects)
        }
        if(this.staticScene === true)
        {
            this.scene.add(this.staticMesh)
        }
    }
}