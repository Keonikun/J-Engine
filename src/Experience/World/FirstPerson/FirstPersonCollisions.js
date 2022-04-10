import * as THREE from 'three'
import EventEmitter from '../../Utils/EventEmitter'
import { gsap } from 'gsap'

export default class FirstPersonCollisions extends EventEmitter
{
    constructor(experience)
    {
        super()

        this.experience = experience
        this.scene = this.experience.scene
        this.camera = this.experience.camera.instance
        this.resources = this.experience.resources
        this.models = null

        // Options
        this.player = {
            collisionsEnabled: false,
            collisionDistance: 0.2,
            playerStepHeight: 1.5,
            gravityEnabled: false,
            gravity: 0.1,
            stepHeight: 1.3,
            maxDistance: 1000,
            height: 1.6
        }

        // Setup
        this.collisionMin = new THREE.Vector3(-1*(this.player.maxDistance),-1*(this.player.maxDistance),-1*(this.player.maxDistance))
        this.collisionMax = new THREE.Vector3(this.player.maxDistance,this.player.maxDistance,this.player.maxDistance)
        this.stepHeightVector = new THREE.Vector3()

        // Debug
        this.debug = this.experience.debug

        // Debug
        if(this.debug.active)
        {
            this.firstPersonFolder = this.debug.ui.addFolder('Collisions')    
            this.firstPersonFolder.add(this.player, 'stepHeight')
        }

        this.resources.on('ready', () =>
        {    
            gsap.delayedCall(0.1, () =>
            {
                this.models = this.experience.world.models
            })
        })

        this.setRayCaster()
    }

    setRayCaster()
    {
        this.detectFloor = new THREE.Raycaster()
        this.detectNorth = new THREE.Raycaster()
        this.detectEast = new THREE.Raycaster()
        this.detectSouth = new THREE.Raycaster()
        this.detectWest = new THREE.Raycaster()
    }

    collisionDetection()
    {
        this.stepHeightVector.set(this.camera.position.x, this.camera.position.y - this.playerStepHeight, this.camera.position.z)
        
        this.floorDirection = new THREE.Vector3( this.camera.getWorldPosition.x, -1, this.camera.getWorldPosition.z )
        this.northDirection = new THREE.Vector3( this.stepHeightVector.x, this.stepHeightVector.y, 1 )
        this.eastDirection = new THREE.Vector3( 1, this.stepHeightVector.y, this.stepHeightVector.z )
        this.southDirection = new THREE.Vector3( this.stepHeightVector.x, this.stepHeightVector.y, -1)
        this.westDirection = new THREE.Vector3( -1, this.stepHeightVector.y, this.stepHeightVector.z )  
        
        this.detectFloor.set(this.camera.position, this.floorDirection)
        this.detectNorth.set(this.stepHeightVector, this.northDirection)
        this.detectEast.set(this.stepHeightVector, this.eastDirection)
        this.detectSouth.set(this.stepHeightVector, this.southDirection)
        this.detectWest.set(this.stepHeightVector, this.westDirection)

        this.floorDetection = this.detectFloor.intersectObjects(this.models.physMesh.scene.children, true)
        this.northDetection = this.detectNorth.intersectObjects(this.models.physMesh.scene.children, true)
        this.eastDetection = this.detectEast.intersectObjects(this.models.physMesh.scene.children, true)
        this.southDetection = this.detectSouth.intersectObjects(this.models.physMesh.scene.children, true)
        this.westDetection = this.detectWest.intersectObjects(this.models.physMesh.scene.children, true)
    }

    raycastFromCamera()
    {
        this.camRay = new THREE.Raycaster()
        this.camRayCoords = new THREE.Vector2(0,0)
        this.camRay.setFromCamera(this.camRayCoords, this.camera)
        this.camRayIntersect = this.camRay.intersectObjects(this.scene.children, true)
        if(this.camRayIntersect[0] != null)
        {
            this.trigger('interaction')
        }   
    }

    update()
    {
        if(this.experience.loadingFinished === true && this.player.collisionsEnabled === true)
        {
            this.collisionDetection()
            
            /////////////////////////////// GRAVITY //////////////////////////////////////
            if(this.floorDetection[0] != null)
            {
                if(this.floorDetection[0].distance <= this.player.height + 0.1)
                {
                    this.camera.position.y = this.floorDetection[0].point.y + this.player.height
                }
                else if(this.floorDetection[0].distance > this.player.height + 0.1 && this.player.gravityEnabled === true)
                {
                    this.camera.position.y -= this.player.gravity
                }
            }
            /////////////////////////////// NORTH //////////////////////////////////////
            if(this.northDetection[0] != null)
            {
                if(this.northDetection[0].distance <= this.player.collisionDistance)
                {
                    console.log("detected North")
                    this.collisionMax.z = this.northDetection[0].point.z - this.player.collisionDistance 
                }
                else
                {
                    this.collisionMax.z = this.player.maxDistance
                }
            }
            else
            {
                this.collisionMax.z = this.player.maxDistance
            }
            /////////////////////////////// EAST //////////////////////////////////////
            if(this.eastDetection[0] != null)
            {
                if(this.eastDetection[0].distance <= this.player.collisionDistance)
                {
                    this.collisionMax.x = this.eastDetection[0].point.x - this.player.collisionDistance
                }
                else
                {
                    this.collisionMax.x = this.player.maxDistance
                }
            }
            else
            {
                this.collisionMax.x = this.player.maxDistance
            }
            /////////////////////////////// SOUTH //////////////////////////////////////
            if(this.southDetection[0] != null)
            {
                if(this.southDetection[0].distance <= this.player.collisionDistance)
                {
                    this.collisionMin.z = this.southDetection[0].point.z + this.player.collisionDistance 
                }
                else
                {
                    this.collisionMin.z = -1 * this.player.maxDistance
                }
            }
            else
            {
                this.collisionMin.z = -1 * this.player.maxDistance
            }
            /////////////////////////////// WEST //////////////////////////////////////
            if(this.westDetection[0] != null)
            {
                if(this.westDetection[0].distance <= this.player.collisionDistance)
                {
                    this.collisionMin.x = this.westDetection[0].point.x + this.player.collisionDistance
                }
                else
                {
                    this.collisionMin.x = -1 * this.player.maxDistance
                }
            }
            else
            {
                this.collisionMin.x = -1 * this.player.maxDistance
            }

            console.log("n", this.northDetection, "e", this.southDetection, "s", this.southDetection, "w", this.westDetection)

            // Clamp camera position in case of collision
            this.camera.position.clamp(this.collisionMin, this.collisionMax)
        }
    }
}