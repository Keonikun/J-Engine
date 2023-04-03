import * as THREE from 'three'
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js'
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js'
import {ShaderPass} from 'three/examples/jsm/postprocessing/ShaderPass.js'
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import {FilmPass} from 'three/examples/jsm/postprocessing/FilmPass.js'
import {GammaCorrectionShader} from 'three/examples/jsm/shaders/GammaCorrectionShader.js'
import {VignetteShader} from 'three/examples/jsm/shaders/VignetteShader'

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
            pixelRatio: 0.3,
            postprocessing: true,
            bloom: true,
            gammaCorrection: true,
            filmic: true,
            vignette: true
        }

        this.setInstance()
        this.setComposer()
        this.setDebug()
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

    setComposer()
    {
        this.composer = new EffectComposer(this.instance)
        this.composer.addPass(new RenderPass(this.scene, this.camera.instance))

        if(this.params.bloom === true && this.params.postprocessing === true)
        {
            this.composer.addPass(new UnrealBloomPass({ x: 256, y: 256 }, 1.0, -1, 0.7 ))
        }
        if(this.params.filmic === true && this.params.postprocessing === true)
        {
            this.composer.addPass(new FilmPass( 0.2, 1, 648, false ))
        }
        if(this.params.gammaCorrection === true && this.params.postprocessing === true)
        {
            this.composer.addPass(new ShaderPass( GammaCorrectionShader ))
        }
        if(this.params.vignette === true && this.params.postprocessing === true)
        {
            VignetteShader.uniforms.darkness.value = 1.2
            this.composer.addPass(new ShaderPass( VignetteShader ))
            console.log(this.composer)
        }
    }

    resize()
    {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio * this.params.pixelRatio)
    }

    update()
    {
        if(this.params.postprocessing === false)
        {
            this.instance.render(this.scene, this.camera.instance)
        }
        else if(this.params.postprocessing === true)
        {
            this.composer.render()
        }
    }

    setDebug()
    {
        if(this.debug.active)
        {

            this.debugFolder = this.debug.gui.addFolder( 'Renderer' )
            this.debugFolder.add( this.params, 'pixelRatio', 0.05, 1 ).onChange(() =>
            {
                this.instance.setPixelRatio(this.params.pixelRatio)
            })
            this.debugFolder.add( this.params, 'postprocessing')

            this.debugFolder.close()
        }
    }
}