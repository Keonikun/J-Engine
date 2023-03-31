import * as THREE from 'three'
import { PointerLockControls } from './Utils/PointerLockControls.js'
import gsap from 'gsap'

export default class FirstPerson
{
    constructor(experience)
    {
        this.experience = experience
        this.scene = this.experience.scene
        this.camera = this.experience.camera.instance
        this.resources = this.experience.resources
        this.models = null
        this.renderer = this.experience.renderer.instance
        this.debug = this.experience.debug

        // arrow controls html listeners
        this.forwardButton = document.querySelector('.forwardControl')
        this.backwardButton = document.querySelector('.backwardControl')
        this.leftButton = document.querySelector('.leftControl')
        this.rightButton = document.querySelector('.rightControl')

        this.forwardArrow = false
        this.backwardArrow = false
        this.leftArrow = false
        this.rightArrow = false

        // speed is a placeholder, actual speed is controlled by playerSpeed and playerSprintSpeed
        this.player = { speed: 0, playerHeight: 1.6, playerSpeed: 0.02, sprintFactor: 1.5, walking: false, sprintingEnabled: true }
        this.playerWalkingCount = 0

        if(this.debug.active)
        {
            this.debugFolder = this.debug.gui.addFolder( 'Player Controls' )
            this.debugFolder.add(this.player, 'playerSpeed', 0.001, 0.1)
            this.debugFolder.add(this.player, 'playerHeight', 0.1, 4)
            this.debugFolder.add(this.player, 'sprintingEnabled')
            this.debugFolder.add(this.player, 'sprintFactor', 1, 5)
            this.debugFolder.close()
        }
        
        this.cameraDirection = new THREE.Vector3()

        this.collisionDistance = 0.5

        this.collisionMin = new THREE.Vector3(-1000,-1000,-1000)
        this.collisionMax = new THREE.Vector3(1000,1000,1000)

        this.resources.on('ready', () =>
        {    
            this.models = this.experience.world.models
        })

        this.setRayCaster()
        this.setKeyListener()
        this.setPointerLockControls()
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

    setKeyListener()
    {
        this.keyboard = {}

        this.keyDown = (event) =>
        {
            this.keyboard[event.keyCode] = true
        }

        this.keyUp = (event) =>
        {
            this.keyboard[event.keyCode] = false
        }

        window.addEventListener('keydown', this.keyDown)
        window.addEventListener('keyup', this.keyUp)

        //arrow key specific listeners
        // this.forwardButton.addEventListener('mousedown', () => { this.forwardArrow = true })
        // this.forwardButton.addEventListener('mouseup', () => { this.forwardArrow = false })
        // this.forwardButton.addEventListener('mouseleave', () => { this.forwardArrow = false })
        // this.backwardButton.addEventListener('mousedown', () => { this.backwardArrow = true })
        // this.backwardButton.addEventListener('mouseup', () => { this.backwardArrow = false })
        // this.backwardButton.addEventListener('mouseleave', () => { this.backwardArrow = false })
        // this.leftButton.addEventListener('mousedown', () => { this.leftArrow = true })
        // this.leftButton.addEventListener('mouseup', () => { this.leftArrow = false })
        // this.leftButton.addEventListener('mouseleave', () => { this.leftArrow = false })
        // this.rightButton.addEventListener('mousedown', () => { this.rightArrow = true })
        // this.rightButton.addEventListener('mouseup', () => { this.rightArrow = false })
        // this.rightButton.addEventListener('mouseleave', () => { this.rightArrow = false })
    }

    setPointerLockControls()
    {    
        this.pointerLockControls = new PointerLockControls(this.camera, this.renderer.domElement, this.experience)
        this.pointerMessageActive = false
        document.querySelector('canvas.webgl').addEventListener('click', () =>
        {
            if(this.experience.world.FPControls === true)
            {
                if(this.pointerLockControls.isLocked === false)
                {
                    this.pointerLockControls.lock()
                    if(this.pointerMessageActive === false)
                    {
                        this.pointerMessageActive = true
                        this.pointerLockNotification = document.createElement("div")
                        this.pointerLockNotification.innerHTML = "Press Q to Release Cursor"
                        this.pointerLockNotification.classList.add('pointerLockNotification', 'hidden')
                        document.querySelector('.experienceContainer').appendChild(this.pointerLockNotification)
                        this.pointerLockNotification.classList.remove("hidden")
                    }
                    gsap.delayedCall(1, () =>
                    {
                        this.pointerLockNotification.classList.add("hidden")
                        gsap.delayedCall(1, () =>
                        {
                            this.pointerLockNotification.remove()
                            this.pointerMessageActive = false
                        })
                    })
                }
                else if(this.pointerLockControls.isLocked === true)
                {
                    this.raycastFromCamera()
                }
            }
        }, false)
    }

    // Interact with objects IN PROGRESS
    raycastFromCamera()
    {
        this.camRay = new THREE.Raycaster()
        this.camRayCoords = new THREE.Vector2(0,0)
        this.camRay.setFromCamera(this.camRayCoords, this.camera)
        this.camRayIntersect = this.camRay.intersectObjects(this.scene.children, true)
        // if(this.camRayIntersect[0] != null)
        // {
        //     this.trigger('interaction')
        // }   
    }

    update()
    {
        //WASD Controls 
        //Assumes you have a mouse as well
        if(this.experience.world.FPControls === true)
        {
            this.vector = this.camera.getWorldDirection(this.cameraDirection)
            this.yAngle = Math.atan2(this.vector.x, this.vector.z)
            //Forward
            if(this.keyboard[87])
            {
                this.camera.position.x -= -Math.sin(this.yAngle) * this.player.speed
                this.camera.position.z += Math.cos(this.yAngle) * this.player.speed
            }
            //Backward
            if(this.keyboard[83])
            {
                this.camera.position.x += -Math.sin(this.yAngle) * this.player.speed
                this.camera.position.z -= Math.cos(this.yAngle) * this.player.speed
            }
            //Left
            if(this.keyboard[65])
            {
                this.camera.position.x -= Math.sin(this.yAngle - Math.PI/2) * this.player.speed
                this.camera.position.z -= Math.cos(this.yAngle - Math.PI/2) * this.player.speed
            }
            //Right
            if(this.keyboard[68])
            {
                this.camera.position.x -= -Math.sin(this.yAngle - Math.PI/2) * this.player.speed
                this.camera.position.z += Math.cos(this.yAngle - Math.PI/2) * this.player.speed
            }
            //Run
            if(this.keyboard[16])
            {
                if(this.player.sprintingEnabled === true)
                {
                    this.player.speed = this.player.playerSpeed * this.player.sprintFactor
                }
            }
            else
            {
                this.player.speed = this.player.playerSpeed
            }
            if(this.keyboard[87] || this.keyboard[83] || this.keyboard[65] || this.keyboard[68])
            {
                this.player.walking = true
            }
            else
            {
                this.player.walking = false
            }
        }

        if(this.keyboard[81])
        {
            this.pointerLockControls.unlock()
        }

        //Arrow Key Controls
        if(this.experience.world.FPArrows === true)
        {
            this.vector = this.camera.getWorldDirection(this.cameraDirection)
            this.yAngle = Math.atan2(this.vector.x, this.vector.z)
            //Forward
            if(this.keyboard[38] || this.forwardArrow)
            {   
                this.camera.position.x -= -Math.sin(this.yAngle) * this.player.speed
                this.camera.position.z += Math.cos(this.yAngle) * this.player.speed
                // this.forwardButton.classList.add('active')
            }
            else
            {
                // this.forwardButton.classList.remove('active')
            }
            //Backward
            if(this.keyboard[40] || this.backwardArrow)
            {
                this.camera.position.x += -Math.sin(this.yAngle) * this.player.speed
                this.camera.position.z -= Math.cos(this.yAngle) * this.player.speed
                // this.backwardButton.classList.add('active')
            }
            else
            {
                // this.backwardButton.classList.remove('active')
            }
            //Left
            if(this.keyboard[37] || this.leftArrow)
            {
                this.camera.rotation.x = 0
                this.camera.rotation.z = 0
                this.camera.rotation.y += 0.01
                // this.leftButton.classList.add('active')

            }
            else
            {
                // this.leftButton.classList.remove('active')
            }
            //Right
            if(this.keyboard[39] || this.rightArrow)
            {
                this.camera.rotation.x = 0
                this.camera.rotation.z = 0
                this.camera.rotation.y -= 0.01
                // this.rightButton.classList.add('active')

            }
            else
            {
                // this.rightButton.classList.remove('active')
            }
            //Run
            if(this.keyboard[16])
            {
                // this.player.speed = this.player.playerSprintSpeed
            }
            else
            {
                this.player.speed = this.player.playerSpeed
            }
            if(this.keyboard[38] || this.keyboard[40] || this.keyboard[37] || this.keyboard[39])
            {
                this.player.walking = true
            }
            else
            {
                this.player.walking = false
            }
        }

        if(this.experience.world.FPCollisions === true)
        {
            // Raycast in five directions: North, west, south, east, and below the player
            this.collisionDetection()
            
            // Keep the player on the ground / primitive gravity
            if(this.floorDetection[0] != null)
            {
                if(this.floorDetection[0].distance <= (this.player.playerHeight + 0.1))
                {
                    this.camera.position.y = this.floorDetection[0].point.y + this.player.playerHeight
                }
                else if(this.floorDetection[0].distance > (this.player.playerHeight + 0.1))
                {
                    this.camera.position.y -= 0.1
                }
            }
            
            // cardinal direction collisions
            // How this works: There is a bounding box which is set to a high value.
            // This box gets constrained if a raycaster in this.collisionDetection 
            // detects a geometry at a certain distance.
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
            
            // clamping prevents the camera from moving outside of bounding box
            this.camera.position.clamp(this.collisionMin, this.collisionMax)
        }
    }
}