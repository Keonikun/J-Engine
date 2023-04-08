import * as THREE from 'three'
import { PointerLockControls } from './Utils/PointerLockControls.js'
import { MeshBVH, acceleratedRaycast } from 'three-mesh-bvh'
import gsap from 'gsap'

export default class FirstPerson
{
    constructor(experience)
    {
        this.experience = experience
        this.scene = this.experience.scene
        this.camera = this.experience.camera.instance
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.models = null
        this.renderer = this.experience.renderer
        this.textAdventure = this.experience.textAdventure
        this.layoutControl = this.experience.layoutControl
        this.debug = this.experience.debug

        // use optimized raycaster
        THREE.Mesh.prototype.raycast = acceleratedRaycast

        this.params = { 
            playerHeight: 1.6, 
            playerSpeed: 0.04, 
            sprintFactor: 1.5, 
            gravity: 0.08,
            walking: false, 
            sprintingEnabled: true,
            collisionDistance: 0.5,
            locationHelper: false,
            interactionDistance: 3.3
        }


        this.resources.on('ready', () =>
        {    
            this.models = this.experience.world.models
            this.models.physMesh.scene.children[0].children.forEach(element => {
                element.geometry.boundsTree = new MeshBVH( element.geometry, { maxDepth: 10, maxLeafTris: 10  } )
            });
            this.interactiveObjects = this.experience.world.interactiveObjects
        })

        this.setup()
        this.setCollisionRayCaster()
        this.setKeyListener()
        this.setPointerLockControls()
        this.setDebug()
    }

    setup()
    {
        this.velocity = 0
        this.fpsGravity = 0
        this.playerWalkingCount = 0
        this.playerControlsEnabled = false

        this.camRay = new THREE.Raycaster()
        this.camRay.firstHitOnly = true
        this.camRayCoords = new THREE.Vector2()

        this.locationHelperGeo = new THREE.BoxGeometry(0.1,0.1,0.1)
        this.locationHelperMat = new THREE.MeshBasicMaterial({color: '#ff0000'})
        this.locationHelper = new THREE.Mesh(this.locationHelperGeo,this.locationHelperMat)
        this.locationHelper.position.set(0,0,0)

        if(this.params.locationHelper === true)
        {
            this.scene.add(this.locationHelper)
        }

        this.cameraDirection = new THREE.Vector3()
        this.collisionMin = new THREE.Vector3(-1000,-1000,-1000)
        this.collisionMax = new THREE.Vector3(1000,1000,1000)

        this.forwardArrow = false
        this.backwardArrow = false
        this.leftArrow = false
        this.rightArrow = false

        // arrow controls html listeners
        this.forwardButton = document.querySelector('.forwardControl')
        this.backwardButton = document.querySelector('.backwardControl')
        this.leftButton = document.querySelector('.leftControl')
        this.rightButton = document.querySelector('.rightControl')
    }

    setCollisionRayCaster()
    {
        this.detectFloor = new THREE.Raycaster()
        this.detectFloor.firstHitOnly = true
        this.floorDirection = new THREE.Vector3( this.camera.getWorldPosition.x, -1, this.camera.getWorldPosition.z )
        this.detectNorth = new THREE.Raycaster()
        this.detectNorth.firstHitOnly = true
        this.northDirection = new THREE.Vector3(this.camera.getWorldPosition.x,this.camera.getWorldPosition.y,1)
        this.detectEast = new THREE.Raycaster()
        this.detectEast.firstHitOnly = true
        this.eastDirection = new THREE.Vector3(1,this.camera.getWorldPosition.y,this.camera.getWorldPosition.z)
        this.detectSouth = new THREE.Raycaster()
        this.detectSouth.firstHitOnly = true
        this.southDirection = new THREE.Vector3(this.camera.getWorldPosition.x,this.camera.getWorldPosition.y,-1)
        this.detectWest = new THREE.Raycaster()
        this.detectWest.firstHitOnly = true
        this.westDirection = new THREE.Vector3(-1,this.camera.getWorldPosition.y,this.camera.getWorldPosition.z)  
    }

    collisionDetection()
    {
        this.detectFloor.set(this.camera.position, this.floorDirection)
        this.detectNorth.set(this.camera.position, this.northDirection)
        this.detectEast.set(this.camera.position, this.eastDirection)
        this.detectSouth.set(this.camera.position, this.southDirection)
        this.detectWest.set(this.camera.position, this.westDirection)

        this.floorDetection = this.detectFloor.intersectObject(this.models.physMesh.scene)
        this.northDetection = this.detectNorth.intersectObject(this.models.physMesh.scene)
        this.eastDetection = this.detectEast.intersectObject(this.models.physMesh.scene)
        this.southDetection = this.detectSouth.intersectObject(this.models.physMesh.scene)
        this.westDetection = this.detectWest.intersectObject(this.models.physMesh.scene)
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
        this.pointerLockControls = new PointerLockControls(this.camera, this.renderer.instance.domElement, this.experience)
        this.pointerMessageActive = false
        document.querySelector('canvas.webgl').addEventListener('click', () =>
        {
            if(this.experience.world.FPControls === true)
            {
                if(this.pointerLockControls.isLocked === false && this.textAdventure.dialogueFocused === false)
                {
                    this.pointerLockControls.lock()
                    this.playerControlsEnabled = true

                    // Tell user how to exit pointer lock
                    if(this.pointerMessageActive === false)
                    {
                        this.pointerMessageActive = true
                        this.pointerLockNotification = document.createElement("div")
                        this.pointerLockNotification.innerHTML = "Press Q to Release Cursor"
                        this.pointerLockNotification.classList.add('pointerLockNotification', 'hidden')
                        document.querySelector('.experienceContainer').appendChild(this.pointerLockNotification)
                        this.pointerLockNotification.classList.remove("hidden")
                    }
                    
                    // Hide textbox when webgl is focused
                    this.layoutControl.setNavBox('hidden')
                    
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
                // If the player is already using first person controls and clicks,
                // trigger a raycast from the camera to check if the object the
                // player has clicked on is an interactable element.
                else if(this.pointerLockControls.isLocked === true)
                {
                    this.interaction()
                }
            }
        }, false)
    }

    lockPointer()
    {
        this.pointerLockControls.lock()
    }

    unlockPointer()
    {
        this.pointerLockControls.unlock()
    }

    // Constant Raycost from camera
    raycastFromCamera()
    {
        this.camRay.setFromCamera(this.camRayCoords, this.camera)
        this.camRayIntersect = this.camRay.intersectObject(this.models.physMesh.scene)
    
        if(this.camRayIntersect[0] != null)
        {
            if(this.camRayIntersect[0].object.interactive === true && this.camRayIntersect[0].distance < this.params.interactionDistance)
            {
                this.renderer.outline(this.camRayIntersect[0].object)
            }
            else
            {
                this.renderer.clearOutline()
            }
        }
    }

    interaction()
    {
        if(this.camRayIntersect[0] != null)
        {
            if(this.params.locationHelper === true)
            {
                this.locationHelper.position.set(this.camRayIntersect[0].point.x, this.camRayIntersect[0].point.y, this.camRayIntersect[0].point.z)
                this.locationHelperMessage = "<p>X: " + String(this.camRayIntersect[0].point.x) + ",<br>Y: " + String(this.camRayIntersect[0].point.y) + ",<br> Z: " + String(this.camRayIntersect[0].point.z) + "</p>"
                this.textAdventure.printString(this.locationHelperMessage)
            }
            if(this.camRayIntersect[0].distance < 4)
            {
                if(this.camRayIntersect[0].object.interactive === true)
                {
                    this.interactiveObjects.trigger(this.camRayIntersect[0].object)
                    console.log("hello")
                }
                else if(this.camRayIntersect[0].object.parent.interactive === true)
                {
                    this.interactiveObjects.trigger(this.camRayIntersect[0].object.parent)
                }
            }
        }
    }

    update()
    {
        if(this.playerControlsEnabled === true && this.textAdventure.dialogueFocused === false)
        {
            this.raycastFromCamera()
            // update velocity and gravity
            this.fpsVelocity = this.velocity / this.time.currentFps * 60
            this.fpsGravity = this.params.gravity / this.time.currentFps * 60
            //WASD Controls 
            //Assumes you have a mouse as well
            if(this.experience.world.FPControls === true)
            {
                this.vector = this.camera.getWorldDirection(this.cameraDirection)
                this.yAngle = Math.atan2(this.vector.x, this.vector.z)
                //Forward
                if(this.keyboard[87])
                {
                    this.camera.position.x -= -Math.sin(this.yAngle) * this.fpsVelocity
                    this.camera.position.z += Math.cos(this.yAngle) * this.fpsVelocity
                }
                //Backward
                if(this.keyboard[83])
                {
                    this.camera.position.x += -Math.sin(this.yAngle) * this.fpsVelocity
                    this.camera.position.z -= Math.cos(this.yAngle) * this.fpsVelocity
                }
                //Left
                if(this.keyboard[65])
                {
                    this.camera.position.x -= Math.sin(this.yAngle - Math.PI/2) * this.fpsVelocity
                    this.camera.position.z -= Math.cos(this.yAngle - Math.PI/2) * this.fpsVelocity
                }
                //Right
                if(this.keyboard[68])
                {
                    this.camera.position.x -= -Math.sin(this.yAngle - Math.PI/2) * this.fpsVelocity
                    this.camera.position.z += Math.cos(this.yAngle - Math.PI/2) * this.fpsVelocity
                }
                //Run
                if(this.keyboard[16])
                {
                    if(this.params.sprintingEnabled === true)
                    {
                        this.velocity = this.params.playerSpeed * this.params.sprintFactor
                    }
                }
                else
                {
                    this.velocity = this.params.playerSpeed
                }
                if(this.keyboard[87] || this.keyboard[83] || this.keyboard[65] || this.keyboard[68])
                {
                    this.params.walking = true
                }
                else
                {
                    this.params.walking = false
                }
            }

            if(this.keyboard[81])
            {
                this.playerControlsEnabled = false
                this.pointerLockControls.unlock()
                this.layoutControl.setNavBox('default')
            }

            //Arrow Key Controls
            if(this.experience.world.FPArrows === true)
            {
                this.vector = this.camera.getWorldDirection(this.cameraDirection)
                this.yAngle = Math.atan2(this.vector.x, this.vector.z)
                //Forward
                if(this.keyboard[38] || this.forwardArrow)
                {   
                    this.camera.position.x -= -Math.sin(this.yAngle) * this.velocity
                    this.camera.position.z += Math.cos(this.yAngle) * this.velocity
                    // this.forwardButton.classList.add('active')
                }
                else
                {
                    // this.forwardButton.classList.remove('active')
                }
                //Backward
                if(this.keyboard[40] || this.backwardArrow)
                {
                    this.camera.position.x += -Math.sin(this.yAngle) * this.velocity
                    this.camera.position.z -= Math.cos(this.yAngle) * this.velocity
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
                    // this.velocity = this.params.playerSprintSpeed
                }
                else
                {
                    this.velocity = this.params.playerSpeed
                }
                if(this.keyboard[38] || this.keyboard[40] || this.keyboard[37] || this.keyboard[39])
                {
                    this.params.walking = true
                }
                else
                {
                    this.params.walking = false
                }
            }

            if(this.experience.world.FPCollisions === true)
            {
                // Raycast in five directions: North, west, south, east, and below the player
                this.collisionDetection()
                
                // Keep the player on the ground / primitive gravity
                if(this.floorDetection[0] != null)
                {
                    if(this.floorDetection[0].distance <= (this.params.playerHeight + 0.1))
                    {
                        this.camera.position.y = this.floorDetection[0].point.y + this.params.playerHeight
                    }
                    else if(this.floorDetection[0].distance > (this.params.playerHeight + 0.1))
                    {
                        this.camera.position.y -= (this.params.gravity / this.time.currentFps * 60)
                    }
                }
                
                // cardinal direction collisions
                // How this works: There is a bounding box which is set to a high value.
                // This box gets constrained if a raycaster in this.collisionDetection 
                // detects a geometry at a certain distance.
                if(this.northDetection[0] != null)
                {
                    if(this.northDetection[0].distance <= this.params.collisionDistance)
                    {
                        this.collisionMax.z = this.northDetection[0].point.z - this.params.collisionDistance 
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
                    if(this.eastDetection[0].distance <= this.params.collisionDistance)
                    {
                        this.collisionMax.x = this.eastDetection[0].point.x - this.params.collisionDistance
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
                    if(this.southDetection[0].distance <= this.params.collisionDistance)
                    {
                        this.collisionMin.z = this.southDetection[0].point.z + this.params.collisionDistance 
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
                    if(this.westDetection[0].distance <= this.params.collisionDistance)
                    {
                        this.collisionMin.x = this.westDetection[0].point.x + this.params.collisionDistance
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

    setDebug()
    {
        if(this.debug.active)
        {
            this.debugFolder = this.debug.playerDebugFolder
            this.debugFolder.add(this.params, 'playerSpeed', 0.001, 0.1)
            this.debugFolder.add(this.params, 'playerHeight', 0.1, 4)
            this.debugFolder.add(this.params, 'sprintingEnabled')
            this.debugFolder.add(this.params, 'sprintFactor', 1, 5)
            this.debug.debugFolder.add(this.params, 'locationHelper').onChange(() =>
            {
                if(this.params.locationHelper === true)
                {
                    this.scene.add(this.locationHelper)
                }
                else
                {
                    this.scene.remove(this.locationHelper)
                }
            })
            this.debugFolder.close()
        }
    }
}