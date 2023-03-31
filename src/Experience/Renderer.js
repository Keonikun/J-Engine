import * as THREE from 'three'
import Experience from "./Experience";

export default class Renderer
{
    constructor(experience)
    {
        this.experience = experience
        this.canvas = this.experience.canvas
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        this.debug = this.experience.debug

        this.params = { 
            antialias: false,
            pixelRatio: 0.3
        }

        this.setInstance()

        if(this.debug.active)
        {
            this.debugFolder = this.debug.gui.addFolder( 'Renderer' )
            this.debugFolder.add( this.params, 'pixelRatio', 0.05, 1 ).onChange(() =>
            {
                this.instance.setPixelRatio(this.params.pixelRatio)
            })
            this.debugFolder.close()
        }
    }
    
    setInstance()
    {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: this.params.antialias,
            // powerPreference: "default"
        })
        this.instance.outputEncoding = THREE.sRGBEncoding
        this.instance.physicallyCorrectLights = true
        this.instance.setClearColor('#ffffff')
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio * this.params.pixelRatio)
    }

    resize()
    {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio * this.params.pixelRatio)
    }

    update()
    {
        this.instance.render(this.scene, this.camera.instance)
    }
}