import * as THREE from 'three'
import { gsap } from 'gsap'

export default class Camera{
    constructor(experience)
    {
        this.experience = experience
        this.world = this.experience.world
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.cssScene = this.experience.cssScene
        this.canvas = this.experience.canvas
        this.debug = this.experience.debug

        this.params = {

            posX: 0,
            posY: 0,
            posZ: 0,
            startFov: 50,
            fov: 50,
            fovAnimationTime: 1,
            thirdPerson: false,
            lookAt: false,
            clip: 50,
        }
        
        this.setDebug()
        this.setInstance()
        this.setThirdPerson()
        // Uncomment below to enable Orbit Controls
        // this.setOrbitControls()
    }

    setInstance()
    {
        this.instance = new THREE.PerspectiveCamera(this.params.startFov, this.sizes.width / this.sizes.height, 0.1, this.params.clip)
        this.instance.position.set(this.params.posX,this.params.posY,this.params.posZ)
        this.scene.add(this.instance)

        this.fovTransitioning = false
        this.fovVariable = 
        {
            fov: this.params.startFov
        }

        this.lookAtVec3 = new THREE.Vector3(0,0,0)
    }

    animateFovTo(fov)
    {
        this.fovTransitioning = true
        this.fovAnimation = gsap.to(this.fovVariable, {fov: this.params.fov , duration: this.params.fovAnimationTime, onComplete: () => { this.fovTransitioning = false } })
        this.fovAnimation.play()
    }

    setRenderDistance(far)
    {
            this.instance.far = far
    }

    setThirdPerson()
    {
        if(this.params.thirdPerson === true)
        {
            this.thirdPersonInstance = new THREE.PerspectiveCamera(this.params.fov, this.sizes.width / this.sizes.height, 0.1, this.params.clip)
            this.thirdPersonInstance.position.set(this.instance.position.x,this.instance.position.y,this.instance.position.z)
            this.thirdPersonInstance.rotation.x = Math.PI * 1.5
            this.scene.add(this.thirdPersonInstance)
        }
    }

    setOrbitControls()
    {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.target.set(0.35,2,-0.6)
        this.controls.enablePan = false
        this.controls.enableDamping = true
    }

    resize()
    {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    lookAt(x,y,z)
    {
        this.lookAtVec3.set(x,y,z)
        this.params.lookAt = true
    }

    dontLookAt()
    {
        this.params.lookAt = false
    }

    update()
    {
        if(this.params.thirdPerson === true)
        {
            this.thirdPersonInstance.position.set(this.instance.position.x, this.instance.position.y + 10.0, this.instance.position.z)
        }
        if(this.params.lookAt === true)
        {
            this.instance.lookAt(this.lookAtVec3)
        }
        if( this.fovTransitioning === true )
        {
            this.instance.fov = this.fovVariable.fov
            this.instance.updateProjectionMatrix()
        }
    }

    /**------------------------------------------------------------------
     *--------------------------------DEBUG------------------------------
     *-------------------------------------------------------------------
    */

    setDebug()
    {
        if(this.debug.active)
        {
            this.debugFolder = this.debug.playerDebugFolder
            this.positionFolder = this.debugFolder.addFolder('Position')
            this.positionFolder.close()
            this.positionFolder.add(this.params, 'posX', -100, 100)
            .name('Position X')
            .onChange(() =>
            {
                this.instance.position.x = this.params.posX
            })
            this.positionFolder.add(this.params, 'posY', -100, 100)
            .name('Position Y')
            .onChange(() =>
            {
                this.instance.position.y = this.params.posY
            })
            this.positionFolder.add(this.params, 'posZ', -100, 100)
            .name('Position Z')
            .onChange(() =>
            {
                this.instance.position.z = this.params.posZ
            })
            this.debug.renderDebugFolder.add(this.params, 'fov', 10, 100)
            .name('FOV')
            .onChange(() =>
            {
                this.instance.fov = this.params.fov
                this.instance.updateProjectionMatrix()
            })
            this.debug.renderDebugFolder.add(this.params, 'clip', 10, 100)
            .name('Render Distance')
            .onChange(() =>
            {
                this.instance.far = this.params.clip
                this.instance.updateProjectionMatrix()
            })
            this.debugFolder.close()
        }
    }
}