import * as THREE from 'three'
import EventEmitter from './Utils/EventEmitter.js'
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js'
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js'
import {ShaderPass} from 'three/examples/jsm/postprocessing/ShaderPass.js'
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import {FilmPass} from 'three/examples/jsm/postprocessing/FilmPass.js'
import {GammaCorrectionShader} from 'three/examples/jsm/shaders/GammaCorrectionShader.js'
import {VignetteShader} from 'three/examples/jsm/shaders/VignetteShader.js'

export default class Renderer extends EventEmitter
{
    constructor( experience )
    {
        super()

        this.experience = experience
        this.canvas = this.experience.canvas
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.cssScene = this.experience.cssScene
        this.camera = this.experience.camera
        this.debug = this.experience.debug
        this.world = this.experience.world

        this.params = { 

            resolution: 0.3,
            renderDistance: 50,

            postprocessing: true,

            // BLOOM
            bloom: true,
            bloomResolution: 64,
            bloomPower: 0.5,
            bloomRadius: 0,
            bloomThreshold: 0.5,

            // Film Shader
            filmic: true,
            noiseIntensity: 0.15,
            scanlineIntensity: 0.5,
            scanlineCount: 1000,
            grayscale: false,

            // Vignette
            vignette: true,
            vignetteIntensity: 1.2,

            gammaCorrection: true,

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
            precision: "lowp",
            alpha: "true"
        })
        this.instance.outputEncoding = THREE.sRGBEncoding
        this.instance.physicallyCorrectLights = true
        this.instance.setClearColor( '#ffffff' )
        this.instance.setSize( this.sizes.width, this.sizes.height )
        this.instance.setPixelRatio( this.sizes.pixelRatio * this.params.resolution )

        this.camera.setRenderDistance(this.params.renderDistance)
    }

    setComposer()
    {
        this.composer = new EffectComposer( this.instance )
        this.composer.addPass( new RenderPass( this.scene, this.camera.instance ))
        this.composer.powerPreference = "low-power"

        if( this.params.bloom === true && this.params.postprocessing === true )
        {
            this.composer.addPass( new UnrealBloomPass(
                { x: this.params.bloomResolution, y: this.params.bloomResolution }, 
                this.params.bloomPower, this.params.bloomRadius, this.params.bloomThreshold 
            ))
        }
        if( this.params.filmic === true && this.params.postprocessing === true )
        {
            this.composer.addPass( new FilmPass( this.params.noiseIntensity, this.params.scanlineIntensity, this.params.scanlineCount, this.params.grayscale ))
        }
        if( this.params.gammaCorrection === true && this.params.postprocessing === true )
        {
            this.composer.addPass( new ShaderPass( GammaCorrectionShader ))
        }
        if( this.params.vignette === true && this.params.postprocessing === true )
        {
            VignetteShader.uniforms.darkness.value = this.params.vignetteIntensity
            this.composer.addPass(new ShaderPass( VignetteShader ))
        }
    }

    resize()
    {
        this.instance.setSize( this.sizes.width, this.sizes.height )
        this.instance.setPixelRatio( this.sizes.pixelRatio * this.params.resolution )
        this.composer.setSize( this.sizes.width, this.sizes.height )
        this.composer.setPixelRatio( this.sizes.pixelRatio * this.params.resolution )
    }

    update()
    {
        if( this.params.postprocessing === false )
        {
            this.instance.render( this.scene, this.camera.instance )
        }
        else if( this.params.postprocessing === true )
        {
            this.composer.render()
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
            this.debug.renderDebugFolder.add( this.params, 'resolution', 0.05, 1 )
            .name('Resolution')
            .onChange(() =>
            {
                this.instance.setPixelRatio( this.params.resolution )
                this.composer.setPixelRatio( this.params.resolution )
            })

            this.debugFolder = this.debug.renderDebugFolder.addFolder('Postprocessing')
            this.debugFolder.close()
            this.debugFolder.add( this.params, 'postprocessing' ).name('Postprocessing Enabled?')

            this.debugFolder.add( this.params, 'bloom' ).name('Bloom')
            this.debugFolder.add( this.params, 'bloomPower' ).name('Bloom Amount')
            this.debugFolder.add( this.params, 'filmic' ).name('Film Effect')
            this.debugFolder.add( this.params, 'scanlineCount' ).name('Scanline Count')
            this.debugFolder.add( this.params, 'scanlineIntensity' ).name('Scanline Intensity')
            this.debugFolder.add( this.params, 'grayscale' ).name('Greyscale')
            this.debugFolder.add( this.params, 'noiseIntensity' ).name('Noise Intensity')
            this.debugFolder.add( this.params, 'gammaCorrection' ).name('Gamma Correction')
            this.debugFolder.add( this.params, 'scanlineCount' ).name('Scanline Count')
        }
    }
}