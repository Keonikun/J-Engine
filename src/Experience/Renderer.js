import * as THREE from 'three'
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js'
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js'
import {ShaderPass} from 'three/examples/jsm/postprocessing/ShaderPass.js'
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import {FilmPass} from 'three/examples/jsm/postprocessing/FilmPass.js'
import {OutlinePass} from 'three/examples/jsm/postprocessing/OutlinePass.js'
import {GammaCorrectionShader} from 'three/examples/jsm/shaders/GammaCorrectionShader.js'
import {VignetteShader} from 'three/examples/jsm/shaders/VignetteShader.js'

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
            pixelRatio: 0.2,
            postprocessing: true,
            bloom: true,
            outline: true,
            gammaCorrection: true,
            filmic: true,
            vignette: true
        }

        this.highlightedObject = null
        this.objectsToOutline = []

        this.setInstance()
        this.setComposer()
        this.setDebug()
    }
    
    setInstance()
    {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: false,
            powerPreference: "low-power",
            precision: "lowp"
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
        this.composer.powerPreference = "low-power"

        if(this.params.bloom === true && this.params.postprocessing === true)
        {
            this.composer.addPass(new UnrealBloomPass({ x: 64, y: 64 }, 1.0, -1, 0.7 ))
        }
        if(this.params.filmic === true && this.params.postprocessing === true)
        {
            this.composer.addPass(new FilmPass( 0.3, 0.2, 648, false ))
        }
        if(this.params.outline === true && this.params.postprocessing === true)
        {
            this.outlinePass = new OutlinePass(new THREE.Vector2( this.sizes.width, this.sizes.height ), this.scene, this.camera.instance )
            this.outlinePass.visibleEdgeColor.set('#ffffff')
            this.outlinePass.hiddenEdgeColor.set('#190a05')
            this.outlinePass.edgeThickness = 0.01
            this.outlinePass.edgeStrength = 1.5
            this.composer.addPass(this.outlinePass)
        }
        if(this.params.gammaCorrection === true && this.params.postprocessing === true)
        {
            this.composer.addPass(new ShaderPass( GammaCorrectionShader ))
        }
        if(this.params.vignette === true && this.params.postprocessing === true)
        {
            VignetteShader.uniforms.darkness.value = 1.2
            this.composer.addPass(new ShaderPass( VignetteShader ))
        }
    }

    outline(object)
    {
        if(object != this.highlightedObject)
        {
            this.objectsToOutline = []
            this.highlightedObject = object
            this.objectsToOutline.push(object)
            this.outlinePass.selectedObjects = this.objectsToOutline
        }
    }

    clearOutline()
    {
        this.outlinePass.selectedObjects = []
        this.highlightedObject = null
    }

    resize()
    {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio * this.params.pixelRatio)
        this.composer.setSize(this.sizes.width, this.sizes.height)
        this.composer.setPixelRatio(this.sizes.pixelRatio * this.params.pixelRatio)
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
            this.debug.renderDebugFolder.add( this.params, 'pixelRatio', 0.05, 1 ).onChange(() =>
            {
                this.instance.setPixelRatio(this.params.pixelRatio)
                this.composer.setPixelRatio(this.params.pixelRatio)
            })
            this.debug.renderDebugFolder.add( this.params, 'postprocessing')
        }
    }
}