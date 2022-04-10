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

        this.setInstance()

        // Uncomment below to enable Orbit Controls
        // this.setOrbitControls()

        // Debug
        this.debug = this.experience.debug

        if(this.debug.active)
        {
            this.setSpawn = {
                moveCameraToDefault: () => 
                {
                    this.instance.position.set( 0, 0, 0 )
                }
            }

            this.cameraFolder = this.debug.ui.addFolder('Camera')
            this.cameraFolder.add(this.instance.position, 'x')
            this.cameraFolder.add(this.instance.position, 'y')
            this.cameraFolder.add(this.instance.position, 'z')
            this.cameraFolder.add(this.setSpawn, 'moveCameraToDefault')

        }
    }

    setInstance()
    {
        this.instance = new THREE.PerspectiveCamera(40, this.sizes.width / this.sizes.height, 0.1, 100000)
        this.instance.position.set(0,1000,0)
        this.instance.rotation.x = Math.PI * 0.5
        this.instance.rotation.y = Math.PI * 1
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
        // Enable Orbit Controls Below
        // this.controls.update()
    }
}