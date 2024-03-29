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
        this.dynamicObjects = null
        this.spawn = {}

        this.staticScene = false
        this.dynamicScene = false
        this.spawnpoint = false
        
        // GLTF Setup
        this.gltfScene = this.resources.items.gltfScene

        this.gltfScene.scene.children.forEach( element => {

            // Setup for collider environment
            if( element.name === "PhysMesh" )
            {
                this.physMesh = element
            }
            // Setup for dynamic objects
            if( element.name === "DynamicObjects" )
            {
                this.dynamicObjects = element
                this.dynamicScene = true


                if( element.name === "door 1" )
                {
                }
                if( element.name === "OS" )
                {
                    this.door1
                }
            }
            // Setup for visual environment
            if(element.name === "StaticMesh")
            {
                this.staticMesh = element
                this.staticScene = true
            }
            if(element.name === "frogSpeaker")
            {
                this.frogSpeaker = element
            }
            if(element.name === "waterSpeaker1")
            {
                this.waterSpeaker1 = element
            }
            if(element.name === "waterSpeaker2")
            {
                this.waterSpeaker2 = element
            }
            if(element.name === "bellSpeaker")
            {
                this.bellSpeaker = element
            }
            if(element.name === "fireSpeaker")
            {
                this.fireSpeaker = element
            }
            if(element.name === "cricketsSpeaker")
            {
                this.cricketsSpeaker = element
            }
            if(element.name === "roomwSpeaker")
            {
                this.roomwSpeaker = element
            }
            if(element.name === "Spawnpoint")
            {
                this.spawnpoint = true
                this.spawn.x = element.position.x
                this.spawn.y = element.position.y
                this.spawn.z = element.position.z
                this.spawnRotationY = element.rotation
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