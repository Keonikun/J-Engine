import * as THREE from 'three'
import EventEmitter from '../../Utils/EventEmitter'
import gsap from 'gsap'
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

        this.player = { walkSpeed: 0.1, sprintSpeed: 0.2, speed: 0.1 , strafeLimiter: 0.5, controlsEnabled: false}

        this.cameraDirection = new THREE.Vector3()

        // Debug
        this.debug = this.experience.debug
        
        if(this.debug.active)
        {
            this.firstPersonControls = this.debug.ui.addFolder('Controls')
            this.firstPersonControls.add(this.player, 'walkSpeed')
            this.firstPersonControls.add(this.player, 'sprintSpeed')
            this.firstPersonControls.add(this.player, 'walkSpeed')
            this.firstPersonControls.add(this.player, 'strafeLimiter')
            

        }

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

        document.querySelector('canvas.webgl').addEventListener('click', () =>
        {
            if(this.pointerLockControls.isLocked === false && this.player.controlsEnabled === true)
            {
                this.pointerLockControls.lock()
            }
            else if(this.pointerLockControls.isLocked === true && this.player.controlsEnabled === true)
            {
                // call raycast from collisions here
                console.log("raycast from camera")
            }
        })
        document.querySelector('.enterButton').addEventListener('click', () =>
        {
            if(this.pointerLockControls.isLocked === false && this.player.controlsEnabled === true)
            {
                this.experience.world.audio.playAudio()
                this.pointerLockControls.lock()
                this.player.controlsEnabled = true
                document.querySelector('.enter').classList.add('animation')
                gsap.delayedCall(0.2, () =>
                {
                    document.querySelector('.enter').classList.add('hide')
                })
            }
        })
    }

    

    update()
    {
        if(this.player.controlsEnabled === true)
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
                this.camera.position.x -= Math.sin(this.yAngle - Math.PI/2) * (this.player.speed * this.player.strafeLimiter)
                this.camera.position.z -= Math.cos(this.yAngle - Math.PI/2) * (this.player.speed * this.player.strafeLimiter)
            }
            if(this.keyboard[68])
            {
                this.camera.position.x -= -Math.sin(this.yAngle - Math.PI/2) * (this.player.speed * this.player.strafeLimiter)
                this.camera.position.z += Math.cos(this.yAngle - Math.PI/2) * (this.player.speed * this.player.strafeLimiter)
            }
            if(this.keyboard[16])
            {
                this.player.speed = this.player.sprintSpeed
            }
            else
            {
                this.player.speed = this.player.walkSpeed
            }
        }
    }
}