import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'


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
            posY: 1.6,
            posZ: 0,
            fov: 50,
            clipNear: 0.1,
            clipFar: 35,
            resetPosition: () => {
                this.instance.position.set(0, 1.6, 0)
            }
        }

        if(this.debug.active)
        {
            this.debugFolder = this.debug.FPDebugFolder
            this.debugFolder.add(this.params, 'resetPosition')
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
            this.debugFolder.add(this.params, 'fov', 10, 100).onChange(() =>
            {
                this.instance.fov = this.params.fov
                this.instance.updateProjectionMatrix()
            })
            this.debugFolder.add(this.params, 'clipNear', 0.01, 10).onChange(() =>
            {
                this.instance.near = this.params.clipNear
                this.instance.updateProjectionMatrix()
            })
            this.debugFolder.add(this.params, 'clipFar', 10, 1000).onChange(() =>
            {
                this.instance.far = this.params.clipFar
                this.instance.updateProjectionMatrix()
            })
            this.debugFolder.close()
        }

        this.setInstance()
        // Uncomment below to enable Orbit Controls
        // this.setOrbitControls()
    }

    setInstance()
    {
        this.instance = new THREE.PerspectiveCamera(this.params.fov, this.sizes.width / this.sizes.height, this.params.clipNear, this.params.clipFar)
        this.instance.position.set(this.params.posX,this.params.posY,this.params.posZ)
        this.instance.rotation.y = Math.PI
        this.scene.add(this.instance)
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

    update()
    {
        // Enable Orbit Controls
        // this.controls.update()
    }
}