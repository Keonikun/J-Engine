import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { PointerLockControls } from '../Utils/PointerLockControls.js'
import { MeshBVH, acceleratedRaycast } from 'three-mesh-bvh'

import gsap from 'gsap'

export default class FirstPerson
{
    constructor( experience )
    {
        this.experience = experience
        this.scene = this.experience.scene
        this.camera = this.experience.camera.instance
        this.models = this.experience.world.models
        this.world = this.experience.world
        this.time = this.experience.time
        this.audio = this.experience.world.audio
        this.renderer = this.experience.renderer
        this.textAdventure = this.experience.textAdventure
        this.layoutControl = this.experience.layoutControl
        this.debug = this.experience.debug
        this.collider = this.models.collider
        this.dynamicCollider = this.models.dynamicCollider
        this.interactiveMesh = this.models.interactiveMesh
        this.interactiveObjects = this.experience.world.interactiveObjects

        this.params = { 
            playerHeight: 2, 
            playerSpeed: 0.005, 
            sprintFactor: 1.5, 
            gravity: - 0.00015,
            sprintingEnabled: true,
            collisionDistance: 0.5,
            locationHelper: false,
            interactionDistance: 3.3,
            spawnPoint: {x: 0, y: 0, z: 0, r: 2   },
            footstepFrequency: 30,
            locations: 'spawn',
            resetPosition: () =>
            {
                this.resetPosition()
            },
        }

        this.setup()
        this.setDebug()
    }

    setup()
    {
        // Setup variables
        this.playerVelocity = new THREE.Vector3()
        this.upVector = new THREE.Vector3( 0, 1, 0 )
        this.tempVector = new THREE.Vector3()
        this.tempVector2 = new THREE.Vector3()
        this.tempBox = new THREE.Box3()
        this.tempMat = new THREE.Matrix4()
        this.tempSegment = new THREE.Line3()
        this.playerIsOnGround = false
        this.controls = null
        this.walking = false
        this.disengaged = false
        this.playerControlsEnabled = false
        this.playerWalkingCount = 0
        this.speedMultiplier = 1

        // Create the player geometry
        this.player = new THREE.Mesh(
            new RoundedBoxGeometry( 0.05, this.params.playerHeight, 0.05, 8, 0.2 ),
            new THREE.MeshBasicMaterial()
        )
        this.player.geometry.translate( 0, -0.4, 0 )
        this.player.capsuleInfo = {
            radius: 0.4,
            segment: new THREE.Line3( new THREE.Vector3(), new THREE.Vector3( 0, - 1.0, 0.0 ) )
        }
        this.scene.add( this.player )
        this.resetPlayer()

        // Use Mesh BVH raycaster
        THREE.Mesh.prototype.raycast = acceleratedRaycast

        // Raycaster for player interactions with world
        this.camRay = new THREE.Raycaster()
        this.camRay.firstHitOnly = true
        this.camRayCoords = new THREE.Vector2()

        this.locationHelperGeo = new THREE.BoxGeometry( 0.1, 0.1, 0.1 )
        this.locationHelperMat = new THREE.MeshBasicMaterial({ color: '#ff0000' })
        this.locationHelper = new THREE.Mesh( this.locationHelperGeo, this.locationHelperMat )
        this.locationHelper.position.set(0,0,0)

        if( this.params.locationHelper === true )
        {
            this.scene.add( this.locationHelper )
        }

        this.cameraDirection = new THREE.Vector3()
        this.collisionMin = new THREE.Vector3( -1000, -1000, -1000 )
        this.collisionMax = new THREE.Vector3( 1000, 1000, 1000 )

        this.setPosition(
            this.params.spawnPoint.x,
            this.params.spawnPoint.y, 
            this.params.spawnPoint.z,
            this.params.spawnPoint.r,
        )
        
        this.setKeyListener()
        this.setPointerLockControls()
    }

    resetPlayer()
    {
        this.playerVelocity.set( 0, 0, 0 )
        this.player.position.set( 0, 1.6, 0 )
        // this.camera.position.sub( this.controls.target )
        // this.controls.target.copy( this.player.position )
        this.camera.position.copy( this.player.position )
        // this.controls.update()
    }

    setPosition( x, y, z, r )
    {

        this.player.position.set( x, y + 1.7, z )
        if(r)
        {
            this.player.rotation.y = Math.PI * r
            this.camera.rotation.y = Math.PI * r
        }
    }

    resetPosition()
    {
        this.playerVelocity.set(0,0,0)
        this.player.position.set(
            this.params.spawnPoint.x,
            this.params.spawnPoint.y + 1.6,
            this.params.spawnPoint.z
        )
    }

    setKeyListener()
    {
        // Listen to all keyboard events and add them to the keyboard object
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

    raycastFromCamera()
    {
        this.camRay.setFromCamera( this.camRayCoords, this.camera )
        this.camRayIntersect = this.camRay.intersectObject( this.models.interactiveMesh )
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
                    "</p>"

                this.textAdventure.printString( this.locationHelperMessage )
            }
            // Object interactions
            if( this.camRayIntersect[0].distance < 4 )
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

    /**
     * UPDATE PLAYER
     */

    update( delta )
    {
        if( this.playerControlsEnabled === true && this.textAdventure.dialogueFocused === false )
        {   
            /**
             *  GRAVITY
             */  
            if( this.playerIsOnGround )
            {
                this.playerVelocity.y = delta * this.params.gravity
            } else {
                this.playerVelocity.y += delta * this.params.gravity
            }
            this.player.position.addScaledVector( this.playerVelocity , delta )      
           
            if( this.experience.world.FPControls === true && this.disengaged === false )
            {
                // get camera angle
                this.vector = this.camera.getWorldDirection( this.cameraDirection )
                this.yAngle = Math.atan2( this.vector.x, this.vector.z )
                 /**
                 *  WASD Controls
                 */
                
                // Forward ('W')
                if( this.keyboard[ 87 ] )
                {
                    this.tempVector.set( 0, 0, 1 ).applyAxisAngle( this.upVector, this.yAngle )
                    this.player.position.addScaledVector( this.tempVector, this.params.playerSpeed * delta )
                }
                // Left ('A')
                if( this.keyboard[ 65 ] )
                {
                    this.tempVector.set( 1, 0, 0 ).applyAxisAngle( this.upVector, this.yAngle )
                    this.player.position.addScaledVector( this.tempVector, this.params.playerSpeed * delta )
                }
                // Backward ('S')
                if( this.keyboard[ 83 ] )
                {
                    this.tempVector.set( 0, 0, -1 ).applyAxisAngle( this.upVector, this.yAngle )
                    this.player.position.addScaledVector( this.tempVector, this.params.playerSpeed * delta )
                }
                // Right ('D')
                if( this.keyboard[ 68 ] )
                {
                    this.tempVector.set( -1, 0, 0 ).applyAxisAngle( this.upVector, this.yAngle )
                    this.player.position.addScaledVector( this.tempVector, this.params.playerSpeed * delta )
                }

                this.player.updateMatrixWorld()

                // Apply collisions
                const capsuleInfo = this.player.capsuleInfo
                this.tempBox.makeEmpty()
                this.tempMat.copy( this.collider.matrixWorld ).invert()
                this.tempSegment.copy( capsuleInfo.segment )

                // get position of capsule in local space of collider
                this.tempSegment.start.applyMatrix4( this.player.matrixWorld ).applyMatrix4( this.tempMat )
                this.tempSegment.end.applyMatrix4( this.player.matrixWorld ).applyMatrix4( this.tempMat )

                // get axis aligned to bounding box of capsule
                this.tempBox.expandByPoint( this.tempSegment.start )
                this.tempBox.expandByPoint( this.tempSegment.end )

                this.tempBox.min.addScalar( - capsuleInfo.radius )
                this.tempBox.max.addScalar( capsuleInfo.radius )

                /**
                 *  STATIC COLLISION DETECTION
                 */
                this.collider.geometry.boundsTree.shapecast( {
                    intersectsBounds: box => box.intersectsBox( this.tempBox ),
                    intersectsTriangle: tri => {
                        // check if triangle is intersecting the capsule and adjust if so
                        const triPoint = this.tempVector
                        const capsulePoint = this.tempVector2

                        const distance = tri.closestPointToSegment( this.tempSegment, triPoint, capsulePoint )
                        if( distance < capsuleInfo.radius )
                        {
                            const depth = capsuleInfo.radius - distance
                            const direction = capsulePoint.sub( triPoint ).normalize()

                            this.tempSegment.start.addScaledVector( direction, depth )
                            this.tempSegment.end.addScaledVector( direction, depth )
                        }
                    }
                } )
                /**
                 *  DYNAMIC COLLISION DETECTION
                 */
                this.dynamicCollider.children.forEach( mesh => 
                {
                    mesh.boundsTree.shapecast( {
                        intersectsBounds: box => box.intersectsBox( this.tempBox ),
                        intersectsTriangle: tri => {
                            // check if triangle is intersecting the capsule and adjust if so
                            const triPoint = this.tempVector
                            const capsulePoint = this.tempVector2

                            const distance = tri.closestPointToSegment( this.tempSegment, triPoint, capsulePoint )
                            if( distance < capsuleInfo.radius )
                            {
                                const depth = capsuleInfo.radius - distance
                                const direction = capsulePoint.sub( triPoint ).normalize()

                                this.tempSegment.start.addScaledVector( direction, depth )
                                this.tempSegment.end.addScaledVector( direction, depth )
                            }
                        }
                    } )
                } )

                const newPosition = this.tempVector
                newPosition.copy( this.tempSegment.start ).applyMatrix4( this.collider.matrixWorld )

                /**
                 *  PREVENT 'SLIDING'
                 */
                if( Math.abs( newPosition.x - this.player.position.x ) > 0 && 
                    Math.abs( newPosition.x -this.player.position.x ) < 0.015 
                ){
                    newPosition.x = this.player.position.x
                }
                if( Math.abs( newPosition.z - this.player.position.z ) > 0 && 
                    Math.abs( newPosition.z -this.player.position.z ) < 0.015 
                ){
                    newPosition.z = this.player.position.z
                }

                const deltaVector = this.tempVector2
                deltaVector.subVectors( newPosition, this.player.position )

                // check if player is on ground
                this.playerIsOnGround = deltaVector.y > Math.abs( delta * this.playerVelocity.y * 0.25 )

                const offset = Math.max( 0.0, deltaVector.length() - 1e-5 )
                deltaVector.normalize().multiplyScalar( offset )

                this.player.position.add( deltaVector )

                if( ! this.playerIsOnGround )
                {
                    deltaVector.normalize()
                    this.playerVelocity.addScaledVector( deltaVector, - deltaVector.dot( this.playerVelocity ) )
                } else {
                    this.playerVelocity.set( 0, 0, 0 )
                }

                /**
                 *  CAMERA ADJUSTMENT
                 */
                this.camera.position.set( this.player.position.x, this.player.position.y + 0.3, this.player.position.z )

                if( this.player.position.y < - 25 )
                {
                    this.resetPlayer()
                }

                // Sprint ('Shift')
                if( this.keyboard[16] )
                {
                    if( this.params.sprintingEnabled === true )
                    {
                        this.params.playerSpeed * this.params.sprintFactor

                        // Incriment the walking count so that footsteps play faster
                        this.playerWalkingCount += 0.5
                    }
                }
                else
                {
                    this.params.playerSpeed
                }
                if(this.keyboard[87] || this.keyboard[83] || this.keyboard[65] || this.keyboard[68])
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
                    // this.audio.play('footstep')
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
            this.locationsFolder = this.debug.locationsFolder
            this.locationsFolder.add( this.params, 'locations', [
                'spawn', 
                'sewers', 
                'park', 
                'outlook', 
                'theatre', 
                'apartment1',
                'sanctuary',
                'garage',
                'basement',
                'trainCrossing'
            ]).onChange(() =>
            {
                if( this.params.locations === 'spawn' )
                {
                    this.resetPosition()
                }
                if( this.params.locations === 'sewers' )
                {
                    this.setPosition( 27.5, -7.4, 6.7 )
                }
                if( this.params.locations === 'outlook' )
                {
                    this.setPosition( 19, 9.3, -20 )
                }
                if( this.params.locations === 'theatre' )
                {
                    this.setPosition( 56, 0.5, 40 )
                }
                if( this.params.locations === 'park' )
                {
                    this.setPosition( -43, -8, 42 )
                }
                if( this.params.locations === 'apartment1' )
                {
                    this.setPosition( 78, 11, 25 )
                }
                if( this.params.locations === 'sanctuary' )
                {
                    this.setPosition( 50, -6.5, 76.6 )
                }
                if( this.params.locations === 'garage' )
                {
                    this.setPosition( -7, -3, 61 )
                }
                if( this.params.locations === 'basement' )
                {
                    this.setPosition( 24, -11, 5.3 )
                }
                if( this.params.locations === 'trainCrossing' )
                {
                    this.setPosition( 0, 0, 15 )
                }
                
            })
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