import * as THREE from 'three'
import { PointerLockControls } from '../Utils/PointerLockControls.js'
import { acceleratedRaycast } from 'three-mesh-bvh'
import gsap from 'gsap'

/**
 * TO DO:
 * - Fix footsteps bug
 * - Fix location helper
 * - Fix Reticle
 * - Add reticle options
 */

export default class FirstPerson
{
    constructor( experience )
    {
        this.experience = experience
        this.scene = this.experience.scene
        this.camera = this.experience.camera.instance
        this.models = this.experience.world.models
        this.interactiveObjects = this.experience.world.interactiveObjects
        this.world = this.experience.world
        this.time = this.experience.time
        this.audio = this.experience.world.audio
        this.renderer = this.experience.renderer
        this.textAdventure = this.experience.textAdventure
        this.layoutControl = this.experience.layoutControl
        this.debug = this.experience.debug

        this.params = { 
            playerHeight: 1.6, 
            playerSpeed: 0.04, 
            sprintFactor: 1.5, 
            gravity: 0.08,
            reticle: false,
            sprintingEnabled: true,
            collisionDistance: 0.5,
            locationHelper: false,
            interactionDistance: 2.5,
            spawnpointOverride: false,
            locations: 'spawn',
            resetPosition: () =>
            {
                this.resetPosition()
            },
            footstepFrequency: 30,
            rotationSpeed: 0.02
        }

        this.setup()
        this.setDebug()
    }

    setup()
    {
        // Use Mesh BVH raycaster to improve performance
        THREE.Mesh.prototype.raycast = acceleratedRaycast

        this.disengaged = false

        this.arrowControlsEnabled = true

        this.camera.rotation.x = Math.PI * 0.05

        this.velocity = 0
        this.fpsGravity = 0
        this.playerWalkingCount = 0
        this.playerControlsEnabled = false
        this.firstTimeInteraction = true

        this.camRay = new THREE.Raycaster()
        this.camRay.firstHitOnly = true
        this.camRayCoords = new THREE.Vector2()

        this.walking = false

        this.locationHelperGeo = new THREE.BoxGeometry( 0.1, 0.1, 0.1 )
        this.locationHelperMat = new THREE.MeshBasicMaterial({ color: '#ff0000' })
        this.locationHelper = new THREE.Mesh( this.locationHelperGeo, this.locationHelperMat )
        this.locationHelper.position.set( 0, 0, 0 )

        if( this.params.locationHelper === true )
        {
            this.scene.add( this.locationHelper )
        }

        this.cameraDirection = new THREE.Vector3()
        this.collisionMin = new THREE.Vector3( -1000, -1000, -1000 )
        this.collisionMax = new THREE.Vector3( 1000, 1000, 1000 )

        if( this.models.spawnpoint === true && this.params.spawnpointOverride === false )
        {
            this.setPosition(
                this.models.spawn.x,
                this.models.spawn.y,
                this.models.spawn.z,
                this.models.spawnRotationY
            )
        }
        else
        {
            this.setPosition( 0, 0, 0 )
        }
        
        this.setCollisionRayCaster()
        this.setKeyListener()
        this.setPointerLockControls()
        
        if(this.params.reticle === true)
        {
            // set reticle
            this.overlayGeometry = new THREE.PlaneGeometry( 0.015, 0.015, 1, 1 )
            this.overlayMaterial = new THREE.ShaderMaterial({
                side: THREE.DoubleSide,
                vertexShader: `
                    varying vec2 vUv;

                    void main()
                    {
                        gl_Position = vec4(position, 1.0);

                        vUv = uv;
                    }
                `,
                fragmentShader: `
                    varying vec2 vUv;

                    void main()
                    {
                        float strength = step(0.35, max(abs(vUv.x - 0.1), abs(vUv.y - 0.5)));

                        gl_FragColor = vec4(strength, strength, strength, 1.0);
                    }
                `
            })
            this.overlay = new THREE.Mesh( this.overlayGeometry, this.overlayMaterial )
            this.overlay.frustumCulled = false
            this.scene.add( this.overlay )
        } 
    }

    setPosition( x, y, z, r )
    {
        this.camera.position.set( x, y + this.params.playerHeight, z )
        if( r )
        {
            this.camera.rotation.copy( r )
        }
    }

    resetPosition()
    {
        this.camera.position.set(
            this.params.spawnpoint.x,
            this.params.spawnpoint.y + 1.6,
            this.params.spawnpoint.z
        )
    }

    setCollisionRayCaster()
    {
        // floor raycast
        this.detectFloor = new THREE.Raycaster()
        this.detectFloor.firstHitOnly = true
        this.floorDirection = new THREE.Vector3( 
            this.camera.getWorldPosition.x, 
            -1, 
            this.camera.getWorldPosition.z 
        )

        // cardinal direction raycast
        this.detectNorth = new THREE.Raycaster()
        this.detectNorth.firstHitOnly = true
        this.northDirection = new THREE.Vector3( 0, 0, 1 )
        this.detectEast = new THREE.Raycaster()
        this.detectEast.firstHitOnly = true
        this.eastDirection = new THREE.Vector3( 1, 0, 0 )
        this.detectSouth = new THREE.Raycaster()
        this.detectSouth.firstHitOnly = true
        this.southDirection = new THREE.Vector3( 0, 0 , -1 )
        this.detectWest = new THREE.Raycaster()
        this.detectWest.firstHitOnly = true
        this.westDirection = new THREE.Vector3( -1, 0, 0 )

        if( this.models.dynamicScene === true )
        {
            this.collisionMap = [ this.models.physMesh, this.models.dynamicObjects ]
        }
        else
        {
            this.collisionMap = [ this.models.physMesh ]
        }

        this.adjustedHeight = new THREE.Vector3()
    }

    floorCollision()
    {
        this.detectFloor.set( this.camera.position, this.floorDirection )
        this.floorDetection = this.detectFloor.intersectObjects( this.collisionMap )
    }

    cardinalCollision()
    {
        this.adjustedHeight.set( this.camera.position.x, this.camera.position.y - 1.0, this.camera.position.z )

        this.detectNorth.set( this.adjustedHeight, this.northDirection )
        this.detectEast.set( this.adjustedHeight, this.eastDirection )
        this.detectSouth.set( this.adjustedHeight, this.southDirection )
        this.detectWest.set( this.adjustedHeight, this.westDirection )
        
        this.northDetection = this.detectNorth.intersectObjects( this.collisionMap )
        this.eastDetection = this.detectEast.intersectObjects( this.collisionMap )
        this.southDetection = this.detectSouth.intersectObjects( this.collisionMap )
        this.westDetection = this.detectWest.intersectObjects( this.collisionMap )
    }

    setArrowControls()
    {
        this.forwardArrowPressed = false
        this.backwardArrowPressed = false
        this.leftArrowPressed = false
        this.rightArrowPressed = false
        this.lookLeftArrowPressed = false
        this.lookRightArrowPressed = false

        this.forwardButton = document.querySelector( '.forwardControl' )
        this.backwardButton = document.querySelector( '.backwardControl' )
        this.leftButton = document.querySelector( '.leftControl' )
        this.rightButton = document.querySelector( '.rightControl' )
        this.lookLeftButton = document.querySelector( '.lookLeftControl' )
        this.lookRightButton = document.querySelector( '.lookRightControl' )

        // FOR DESKTOP

        // this.forwardButton.addEventListener( 'mousedown', () =>
        // {
        //     this.forwardArrowPressed = true
        //     this.walking = true
        // })
        // this.forwardButton.addEventListener( 'mouseup', () =>
        // {
        //     this.forwardArrowPressed = false
        // })
        // this.backwardButton.addEventListener( 'mousedown', () =>
        // {
        //     this.backwardArrowPressed = true
        //     this.walking = true
        // })
        // this.backwardButton.addEventListener( 'mouseup', () =>
        // {
        //     this.backwardArrowPressed = false
        // })
        // this.leftButton.addEventListener( 'mousedown', () =>
        // {
        //     this.leftArrowPressed = true
        //     this.walking = true
        // })
        // this.leftButton.addEventListener( 'mouseup', () =>
        // {
        //     this.leftArrowPressed = false
        // })
        // this.rightButton.addEventListener( 'mousedown', () =>
        // {
        //     this.rightArrowPressed = true
        //     this.walking = true
        // })
        // this.rightButton.addEventListener( 'mouseup', () =>
        // {
        //     this.rightArrowPressed = false
        // })
        // this.lookLeftButton.addEventListener( 'mousedown', () =>
        // {
        //     this.lookLeftArrowPressed = true
        //     this.walking = true
        // })
        // this.lookLeftButton.addEventListener( 'mouseup', () =>
        // {
        //     this.lookLeftArrowPressed = false
        // })
        // this.lookRightButton.addEventListener( 'mousedown', () =>
        // {
        //     this.lookRightArrowPressed = true
        //     this.walking = true
        // })
        // this.lookRightButton.addEventListener( 'mouseup', () =>
        // {
        //     this.lookRightArrowPressed = false
        // })

        // FOR MOBILE

        this.forwardButton.addEventListener('touchstart', () =>
        {
            this.forwardArrowPressed = true
            this.walking = true
        })
        this.forwardButton.addEventListener('touchend', () =>
        {
            this.forwardArrowPressed = false
        })
        this.backwardButton.addEventListener('touchstart', () =>
        {
            this.backwardArrowPressed = true
            this.walking = true
        })
        this.backwardButton.addEventListener('touchend', () =>
        {
            this.backwardArrowPressed = false
        })
        this.leftButton.addEventListener('touchstart', () =>
        {
            this.leftArrowPressed = true
            this.walking = true
        })
        this.leftButton.addEventListener('touchend', () =>
        {
            this.leftArrowPressed = false
        })
        this.rightButton.addEventListener('touchstart', () =>
        {
            this.rightArrowPressed = true
            this.walking = true
        })
        this.rightButton.addEventListener('touchend', () =>
        {
            this.rightArrowPressed = false
        })
        this.lookLeftButton.addEventListener('touchstart', () =>
        {
            this.lookLeftArrowPressed = true
            this.walking = true
        })
        this.lookLeftButton.addEventListener('touchend', () =>
        {
            this.lookLeftArrowPressed = false
        })
        this.lookRightButton.addEventListener('touchstart', () =>
        {
            this.lookRightArrowPressed = true
            this.walking = true
        })
        this.lookRightButton.addEventListener('touchend', () =>
        {
            this.lookRightArrowPressed = false
        })
        if( this.rightArrowPressed === false && this.leftArrowPressed === false && this.forwardArrowPressed === false && this.backwardArrowPressed === false && this.lookLeftArrowPressed === false && this.lookRightArrowPressed === false )
        {
            this.walking = false
        }
    }

    setKeyListener()
    {
        this.keyboard = {}

        this.keyDown = ( event ) =>
        {
            this.keyboard[ event.keyCode ] = true
        }

        this.keyUp = ( event ) =>
        {
            this.keyboard[ event.keyCode ] = false
        }

        window.addEventListener( 'keydown', this.keyDown )
        window.addEventListener( 'keyup', this.keyUp )
    }

    /**
     *  Mouse and Trackpad Controls
     */
    setPointerLockControls()
    {
        this.pointerMessageActive = false

        this.pointerLockControls = new PointerLockControls( 
            this.camera, 
            this.renderer.instance.domElement, 
            this.experience
        )
        document.querySelector( 'canvas.webgl' ).addEventListener( 'click', () =>
        {
            if( this.experience.world.FPControls === true && 
                this.experience.params.appStart === true && 
                this.disengaged === false )
            {
                if( this.pointerLockControls.isLocked === false && this.textAdventure.dialogueFocused === false )
                {
                    if(this.firstTimeInteraction === true)
                    {
                        this.experience.camera.animateFovTo(this.experience.renderer.params.fov)
                        this.firstTimeInteraction = false
                        document.querySelector('.navBox').classList.add('default')
                        document.querySelector('.boxShadow').classList.add('default')
                        document.querySelector('.folderTabs').classList.add('default')
                    }
                    this.pointerLockControls.lock()
                    this.playerControlsEnabled = true

                    // Tell user how to exit pointer lock
                    // BAD METHOD (redo in layout control)
                    if( this.pointerMessageActive === false )
                    {
                        this.pointerMessageActive = true
                        this.pointerLockNotification = document.createElement( 'div' )
                        this.pointerLockNotification.innerHTML = 'Press Q to Release Cursor'
                        this.pointerLockNotification.classList.add( 'pointerLockNotification', 'hidden' )
                        document.querySelector('.experienceContainer').appendChild( this.pointerLockNotification )
                        this.pointerLockNotification.classList.remove( 'hidden' )
                    }
                    
                    // Hide textbox when webgl is focused
                    this.layoutControl.setNavBox( 'hidden' )
                    
                    gsap.delayedCall( 1, () =>
                    {
                        this.pointerLockNotification.classList.add( 'hidden' )
                        gsap.delayedCall( 1, () =>
                        {
                            this.pointerLockNotification.remove()
                            this.pointerMessageActive = false
                        })
                    })
                }
                // If the player is already using first person controls and clicks,
                // trigger a raycast from the camera to check if the object the
                // player has clicked on is an interactable element.
                else if( this.pointerLockControls.isLocked === true )
                {
                    this.raycastFromCamera()
                    this.interaction()
                }
            }
        }, false )
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
        this.camRay.setFromCamera( this.camRayCoords, this.camera )
        this.camRayIntersect = this.camRay.intersectObject( this.models.dynamicObjects )
    }

    interaction()
    {
        if( this.camRayIntersect[0] != null )
        {
            // Position the location helper if enabled
            if( this.params.locationHelper === true )
            {
                this.locationHelper.position.set(
                    this.camRayIntersect[0].point.x, 
                    this.camRayIntersect[0].point.y, 
                    this.camRayIntersect[0].point.z
                )
                this.locationHelperMessage = 
                    "<p>X: " + String( this.camRayIntersect[0].point.x ) + 
                    ",<br>Y: " + String( this.camRayIntersect[0].point.y ) + 
                    ",<br> Z: " + String( this.camRayIntersect[0].point.z ) + 
                    ",<br> Player Rotation: " + String( this.camera.rotation.y ) +
                    "</p>" 

                this.textAdventure.printString( this.locationHelperMessage )
            }
            // Object interactions
            if( this.camRayIntersect[0].distance < this.params.interactionDistance )
            {
                if( this.camRayIntersect[0].object.interactive === true )
                {
                    this.interactiveObjects.trigger( this.camRayIntersect[0].object )
                }
                else if( this.camRayIntersect[0].object.parent.interactive === true )
                {
                    this.interactiveObjects.trigger( this.camRayIntersect[0].object.parent )
                }
            }
        }
    }

    update()
    {
        if( this.playerControlsEnabled === true && this.textAdventure.dialogueFocused === false || this.arrowControlsEnabled === true)
        {           
            // Update Velocity and Gravity based on FPS
            this.fpsVelocity = this.velocity / this.time.currentFps * 60
            this.fpsGravity = this.params.gravity / this.time.currentFps * 60
            
            /**
             *  WASD Controls
             */
            if( this.experience.world.FPControls === true && this.disengaged === false)
            {
                this.vector = this.camera.getWorldDirection( this.cameraDirection )
                this.yAngle = Math.atan2( this.vector.x, this.vector.z )
                // Forward ('W')
                if( this.keyboard[87] || this.forwardArrowPressed === true )
                {
                    this.camera.position.x -= -Math.sin( this.yAngle ) * this.fpsVelocity
                    this.camera.position.z += Math.cos( this.yAngle ) * this.fpsVelocity
                }
                // Left ('A')
                if( this.keyboard[65] || this.leftArrowPressed )
                {
                    this.camera.position.x -= Math.sin( this.yAngle - Math.PI/2 ) * this.fpsVelocity
                    this.camera.position.z -= Math.cos( this.yAngle - Math.PI/2 ) * this.fpsVelocity
                }
                // Backward ('S')
                if( this.keyboard[83] || this.backwardArrowPressed )
                {
                    this.camera.position.x += -Math.sin( this.yAngle ) * this.fpsVelocity
                    this.camera.position.z -= Math.cos( this.yAngle ) * this.fpsVelocity
                }
                // Right ('D')
                if( this.keyboard[68] || this.rightArrowPressed )
                {
                    this.camera.position.x -= -Math.sin( this.yAngle - Math.PI/2 ) * this.fpsVelocity
                    this.camera.position.z += Math.cos( this.yAngle - Math.PI/2 ) * this.fpsVelocity
                }
                // Sprint ('Shift')
                if( this.keyboard[16] )
                {
                    if( this.params.sprintingEnabled === true )
                    {
                        this.velocity = this.params.playerSpeed * this.params.sprintFactor

                        // Incriment the walking count so that footsteps play faster
                        this.playerWalkingCount += 0.5
                    }
                }
                else
                {
                    this.velocity = this.params.playerSpeed
                }
                // Mobile controls
                if( this.lookLeftArrowPressed )
                {
                    this.camera.rotation.y += this.params.rotationSpeed
                }
                if( this.lookRightArrowPressed )
                {
                    this.camera.rotation.y -= this.params.rotationSpeed
                }
                if(this.keyboard[87] || this.keyboard[83] || this.keyboard[65] || this.keyboard[68] || this.backwardArrowPressed || this.forwardArrowPressed || this.leftArrowPressed || this.rightArrowPressed )
                {
                    this.playerWalkingCount ++
                    this.walking = true
                }
                else
                {
                    this.walking = false
                }

                // Footsteps
                if(this.playerWalkingCount >= this.params.footstepFrequency)
                {
                    let stepVariation = Math.floor(Math.random(1)*4 + 1)

                    if( stepVariation === 1 )
                    {
                        this.audio.play('footstep1')
                    } 
                    else if( stepVariation === 2 ) 
                    {
                        this.audio.play('footstep2')
                    }
                    else if( stepVariation === 3 ) 
                    {
                        this.audio.play('footstep3')
                    }
                    else if( stepVariation === 4 ) 
                    {
                        this.audio.play('footstep4')
                    }

                    
                    this.playerWalkingCount = 0
                }
            }

            // Exit pointer lock controls ('Q')
            if(this.keyboard[81])
            {
                this.playerControlsEnabled = false
                this.pointerLockControls.unlock()
                this.layoutControl.setNavBox('default')
            }

            //Arrow Key Values
 
                // Forward arrow
                // this.keyboard[38]
                // Backward arrow
                // this.keyboard[40]
                // Left Arrow
                // this.keyboard[37]
                // Right Arrow
                // this.keyboard[39]

            /**
             *  Collision Detection
             */
            if( this.experience.world.FPCollisions === true && this.disengaged === false || this.experience.world.FPCollisions === true && this.arrowControlsEnabled === true)
            {       
                // Always raycast the floor so that the player cannot stop midair
                this.floorCollision()
                
                // Keep the player on the ground / primitive gravity
                if( this.floorDetection[0] != null )
                {
                    if( this.floorDetection[0].distance <= ( this.params.playerHeight + 0.1 ) )
                    {
                        this.camera.position.y = this.floorDetection[0].point.y + this.params.playerHeight
                    }
                    else if( this.floorDetection[0].distance > ( this.params.playerHeight + 0.1 ) )
                    {
                        this.camera.position.y -= this.params.gravity / this.time.currentFps * 60
                    }
                }

                // Directional collisions
                // How this works: There is a bounding box which is set to a high value.
                // This box gets clamped if a raycaster in this.collisionDetection 
                // detects a geometry at a certain distance. Thus preventing the player from
                // moving forward.
                if(this.walking === true)
                {
                    // Only raycast cardinal directions when moving to optimize performance
                    this.cardinalCollision()
                    if( this.northDetection[0] != null )
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
                }
                
                // clamping prevents the camera from moving outside of bounding box
                this.camera.position.clamp( this.collisionMin, this.collisionMax )
            }
        }
    }

    /**------------------------------------------------------------------
     *--------------------------------DEBUG------------------------------
     *-------------------------------------------------------------------
    */

    setDebug()
    {
        if( this.debug.active )
        {
            this.debugFolder = this.debug.playerDebugFolder
            this.debugFolder.add( this.params, 'resetPosition' )
            // this.locationsFolder = this.debug.locationsFolder
            // this.locationsFolder.add( this.params, 'locations', [
            //     'spawn'
            // ]).onChange(() =>
            // {
            //     if( this.params.locations === 'spawn' )
            //     {
            //         this.resetPosition()
            //     }   
            // })
            this.debugFolder.add( this.params, 'playerSpeed', 0.001, 1 )
            this.debugFolder.add( this.params, 'gravity', 0, 1 )
            this.debugFolder.add( this.params, 'playerHeight', 0.1, 4 )
            this.debugFolder.add( this.params, 'sprintingEnabled' )
            this.debugFolder.add( this.params, 'sprintFactor', 1, 5 )
            this.debug.debugFolder.add( this.params, 'locationHelper' ).onChange(() =>
            {
                if( this.params.locationHelper === true )
                {
                    this.scene.add( this.locationHelper )
                }
                else
                {
                    this.scene.remove( this.locationHelper )
                }
            })
            this.debugFolder.close()
        }
    }
}