import * as THREE from 'three'

export default class FirstPersonCollisions
{
    constructor(experience)
    {
        this.experience = experience
        this.scene = this.experience.scene
        this.camera = this.experience.camera.instance
        this.resources = this.experience.resources
        this.models = null

        // Options
        this.collisionDistance = 0.5

        this.collisionMin = new THREE.Vector3(-1000,-1000,-1000)
        this.collisionMax = new THREE.Vector3(1000,1000,1000)

        this.resources.on('ready', () =>
        {
            this.models = this.experience.world.models
        })

        this.setRayCaster()
    }

    setRayCaster()
    {
        this.detectFloor = new THREE.Raycaster()
        this.floorDirection = new THREE.Vector3( this.camera.getWorldPosition.x, -1, this.camera.getWorldPosition.z )
        this.detectNorth = new THREE.Raycaster()
        this.northDirection = new THREE.Vector3(this.camera.getWorldPosition.x,this.camera.getWorldPosition.y,1)
        this.detectEast = new THREE.Raycaster()
        this.eastDirection = new THREE.Vector3(1,this.camera.getWorldPosition.y,this.camera.getWorldPosition.z)
        this.detectSouth = new THREE.Raycaster()
        this.southDirection = new THREE.Vector3(this.camera.getWorldPosition.x,this.camera.getWorldPosition.y,-1)
        this.detectWest = new THREE.Raycaster()
        this.westDirection = new THREE.Vector3(-1,this.camera.getWorldPosition.y,this.camera.getWorldPosition.z)  
    }

    collisionDetection()
    {
        this.cameraPositionMod = this.camera.position
        this.cameraPositionMod.y - 0.6
        this.northDirectionMod = this.northDirection
        this.northDirectionMod.y - 0.6
        this.eastDirectionMod = this.eastDirection
        this.eastDirectionMod.y - 0.6
        this.southDirectionMod = this.southDirection
        this.southDirectionMod.y - 0.6
        this.westDirectionMod = this.westDirection
        this.westDirectionMod.y - 0.6

        this.detectFloor.set(this.cameraPositionMod, this.floorDirection)
        this.detectNorth.set(this.cameraPositionMod, this.northDirectionMod)
        this.detectEast.set(this.cameraPositionMod, this.eastDirectionMod)
        this.detectSouth.set(this.cameraPositionMod, this.southDirectionMod)
        this.detectWest.set(this.cameraPositionMod, this.westDirectionMod)

        this.floorDetection = this.detectFloor.intersectObjects(this.models.physMesh.scene.children, true)
        this.northDetection = this.detectNorth.intersectObjects(this.models.physMesh.scene.children, true)
        this.eastDetection = this.detectEast.intersectObjects(this.models.physMesh.scene.children, true)
        this.southDetection = this.detectSouth.intersectObjects(this.models.physMesh.scene.children, true)
        this.westDetection = this.detectWest.intersectObjects(this.models.physMesh.scene.children, true)
    }

    update()
    {
        if(this.experience.loadingFinished === true)
        {
            this.collisionDetection()
            
            if(this.floorDetection[0] != null)
            {
                if(this.floorDetection[0].distance <= 1.7)
                {
                    this.camera.position.y = this.floorDetection[0].point.y + 1.6
                }
                else if(this.floorDetection[0].distance > 1.7)
                {
                    this.camera.position.y -= 0.1
                }
            }
            
            if(this.northDetection[0] != null)
            {
                if(this.northDetection[0].distance <= this.collisionDistance)
                {
                    this.collisionMax.z = this.northDetection[0].point.z - this.collisionDistance 
                }
                else
                {
                    this.collisionMax.z = 1000
                }
            }
            else
            {
                this.collisionMax.z = 1000
            }

            if(this.eastDetection[0] != null)
            {
                if(this.eastDetection[0].distance <= this.collisionDistance)
                {
                    this.collisionMax.x = this.eastDetection[0].point.x - this.collisionDistance
                }
                else
                {
                    this.collisionMax.x = 1000
                }
            }
            else
            {
                this.collisionMax.x = 1000
            }

            if(this.southDetection[0] != null)
            {
                if(this.southDetection[0].distance <= this.collisionDistance)
                {
                    this.collisionMin.z = this.southDetection[0].point.z + this.collisionDistance 
                }
                else
                {
                    this.collisionMin.z = -1000
                }
            }
            else
            {
                this.collisionMin.z = -1000
            }
            
            if(this.westDetection[0] != null)
            {
                if(this.westDetection[0].distance <= this.collisionDistance)
                {
                    this.collisionMin.x = this.westDetection[0].point.x + this.collisionDistance
                }
                else
                {
                    this.collisionMin.x = -1000
                }
            }
            else
            {
                this.collisionMin.x = -1000
            }
            
            this.camera.position.clamp(this.collisionMin, this.collisionMax)
        }
    }
}