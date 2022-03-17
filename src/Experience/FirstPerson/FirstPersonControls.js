import * as THREE from 'three'
import EventEmitter from '../Utils/EventEmitter'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'

export default class FirstPersonControls extends EventEmitter
{
    constructor(experience)
    {
        super()

        this.experience = experience
        this.scene = this.experience.scene
        this.camera = this.experience.camera.instance
        this.renderer = this.experience.renderer.instance

        this.player = {speed: 0.001,height: 1.6}

        this.cameraDirection = new THREE.Vector3()
        this.controlsEnabled = false

        this.setKeyListener()
        this.setPointerLockControls()
        
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
    }

    setPointerLockControls()
    {    
        this.pointerLockControls = new PointerLockControls(this.camera, this.renderer.domElement)
        this.pointerLockControls.pointerSpeed = 0.001

        document.querySelector('canvas.webgl').addEventListener('click', () =>
        {
            if(this.pointerLockControls.isLocked === false)
            {
                this.pointerLockControls.lock()
                this.controlsEnabled = true
            }
            else if(this.pointerLockControls.isLocked === true)
            {
                this.raycastFromCamera()
            }
        })
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
        if(this.controlsEnabled === true)
        {
            this.vector = this.camera.getWorldDirection(this.cameraDirection)
            this.yAngle = Math.atan2(this.vector.x, this.vector.z)
            
            if(this.keyboard[87])
            {
                this.camera.position.x -= -Math.sin(this.yAngle) * this.player.speed
                this.camera.position.z += Math.cos(this.yAngle) * this.player.speed
            }
            if(this.keyboard[83])
            {
                this.camera.position.x += -Math.sin(this.yAngle) * this.player.speed
                this.camera.position.z -= Math.cos(this.yAngle) * this.player.speed
            }
            if(this.keyboard[65])
            {
                this.camera.position.x -= Math.sin(this.yAngle - Math.PI/2) * this.player.speed
                this.camera.position.z -= Math.cos(this.yAngle - Math.PI/2) * this.player.speed
            }
            if(this.keyboard[68])
            {
                this.camera.position.x -= -Math.sin(this.yAngle - Math.PI/2) * this.player.speed
                this.camera.position.z += Math.cos(this.yAngle - Math.PI/2) * this.player.speed
            }
            if(this.keyboard[16])
            {
                this.player.speed = 0.1
            }
            else
            {
                this.player.speed = 0.05
            }
        }
    }
}