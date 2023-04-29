import * as THREE from 'three'

export default class Camera{
    constructor(experience)
    {
        this.experience = experience
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.cssScene = this.experience.cssScene
        this.canvas = this.experience.canvas
        this.debug = this.experience.debug

        this.params = {
            posX: 0,
            posY: 0,
            posZ: 0,
            fov: 40,
            clipNear: 0.1,
            clipFar: 35,
            thirdPerson: false,
            lookAt: false,
        }

        this.setDebug()
        this.setInstance()
        this.setThirdPerson()
        // Uncomment below to enable Orbit Controls
        // this.setOrbitControls()
    }

    setInstance()
    {
        this.instance = new THREE.PerspectiveCamera(this.params.fov, this.sizes.width / this.sizes.height, this.params.clipNear, this.params.clipFar)
        this.instance.position.set(this.params.posX,this.params.posY,this.params.posZ)
        this.instance.rotation.y = Math.PI * 0.5
        this.scene.add(this.instance)

        this.lookAtVec3 = new THREE.Vector3(0,0,0)
    }

    setThirdPerson()
    {
        if(this.params.thirdPerson === true)
        {
            this.thirdPersonInstance = new THREE.PerspectiveCamera(this.params.fov, this.sizes.width / this.sizes.height, this.params.clipNear, this.params.clipFar)
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
            this.debugFolder.add(this.params, 'posX').onChange(() =>
            {
                this.instance.position.x = this.params.posX
            })
            this.debugFolder.add(this.params, 'posY').onChange(() =>
            {
                this.instance.position.y = this.params.posY
            })
            this.debugFolder.add(this.params, 'posZ').onChange(() =>
            {
                this.instance.position.z = this.params.posZ
            })
            this.debug.renderDebugFolder.add(this.params, 'fov', 10, 100).onChange(() =>
            {
                this.instance.fov = this.params.fov
                this.instance.updateProjectionMatrix()
            })
            this.debug.renderDebugFolder.add(this.params, 'clipNear', 0.01, 10).onChange(() =>
            {
                this.instance.near = this.params.clipNear
                this.instance.updateProjectionMatrix()
            })
            this.debug.renderDebugFolder.add(this.params, 'clipFar', 10, 1000).onChange(() =>
            {
                this.instance.far = this.params.clipFar
                this.instance.updateProjectionMatrix()
            })
            this.debugFolder.close()
        }
    }
}