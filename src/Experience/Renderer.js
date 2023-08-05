import * as THREE from 'three'
import EventEmitter from './Utils/EventEmitter.js'
import basicVertex from './World/Shaders/basicVertex.glsl'
import VHSFragment from './World/Shaders/VHSFragment.glsl'
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js'
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js'
import {ShaderPass} from 'three/examples/jsm/postprocessing/ShaderPass.js'
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import {GammaCorrectionShader} from 'three/examples/jsm/shaders/GammaCorrectionShader.js'

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
        this.time = this.experience.time

        this.params = { 

            resolution: 0.5,
            renderDistance: 100,

            postprocessing: true,

            // BLOOM
            bloom: true,
            bloomResolution: 16,
            bloomPower: 0.2,
            bloomRadius: 0.05,
            bloomThreshold: 0.5,

            // Custom Grain Shader
            grain: true,
            grainIntensity: 0.1,
            chromaticAberration: 0.1,
            sharpen: 1.0,

            // Vignette
            vignette: false,
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
        this.instance.outputColorSpace = THREE.SRGBColorSpace
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
        if( this.params.vignette === true && this.params.postprocessing === true )
        {
            VignetteShader.uniforms.darkness.value = this.params.vignetteIntensity
            this.composer.addPass(new ShaderPass( VignetteShader ))
        }
        if( this.params.grain === true && this.params.postprocessing === true )
        {
             // CUSTOM VHS SHADER
            this.VHSShader = {
                uniforms: {
                    tDiffuse: { value: null },
                    uTime: { value: 0 },
                    uGrainIntensity: { value: this.params.grainIntensity },
                    uChromaticAberration: { value: this.params.chromaticAberration },
                    uSharpen: { value: this.params.sharpen },
                },
                vertexShader: basicVertex, 
                fragmentShader: VHSFragment
            }
            this.VHSShaderPass = new ShaderPass(this.VHSShader)
            this.composer.addPass(this.VHSShaderPass)
        }
        if( this.params.gammaCorrection === true && this.params.postprocessing === true )
        {
            this.composer.addPass( new ShaderPass( GammaCorrectionShader ))
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

            // UPDATE VHS SHADER
            this.VHSShaderPass.uniforms.uTime.value = this.time.elapsedTime / 1000
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

            this.debugFolder = this.debug.renderDebugFolder
            this.debugFolder.add( this.params, 'postprocessing' ).name('Postprocessing Enabled?')

            // this.debugFolder.add( this.params, 'bloom' ).name('Bloom')
            // this.debugFolder.add( this.params, 'bloomPower' ).name('Bloom Amount')
            // this.debugFolder.add( this.params, 'filmic' ).name('Film Effect')
            // this.debugFolder.add( this.params, 'scanlineCount' ).name('Scanline Count')
            // this.debugFolder.add( this.params, 'scanlineIntensity' ).name('Scanline Intensity')
            // this.debugFolder.add( this.params, 'grayscale' ).name('Greyscale')
            // this.debugFolder.add( this.params, 'noiseIntensity' ).name('Noise Intensity')
            // this.debugFolder.add( this.params, 'gammaCorrection' ).name('Gamma Correction')
            // this.debugFolder.add( this.params, 'scanlineCount' ).name('Scanline Count')
        }
    }
}