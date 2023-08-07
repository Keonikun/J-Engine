import * as THREE from 'three'
import EventEmitter from './Utils/EventEmitter.js'
import basicVertex from './World/Shaders/basicVertex.glsl'
import VHSFragment from './World/Shaders/VHSFragment.glsl'
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js'
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js'
import {ShaderPass} from 'three/examples/jsm/postprocessing/ShaderPass.js'
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import {GammaCorrectionShader} from 'three/examples/jsm/shaders/GammaCorrectionShader.js'

/**
 * TO DO:
 * - Add debug options for fps, fov, and render distance
 * - Change Postprocessing options on the fly?
 */

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

            // RENDER OPTIONS
            resolution: 0.5,
            renderDistance: 100,
            fps: 30,
            fov: 50,

            // ANIMATE THE FOV
            startFov: 60,
            fovAnimationTime: 1,

            // POSTPROCESSING
            postprocessing: true,

            // BLOOM
            bloom: true,
            bloomResolution: 1,
            bloomPower: 0.2,
            bloomRadius: 0.05,
            bloomThreshold: 0.01,

            // VHS
            VHS: true,

            // DEBUGGING
            logStats: false,
        }

        this.setInstance()
        this.setDebug()
    }
    
    setInstance()
    {
        // Base Renderer
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

        if( this.params.postprocessing === true )
        {
            // Post Processing Renderer
            this.composer = new EffectComposer( this.instance )
            this.composer.addPass( new RenderPass( this.scene, this.camera.instance ))
            this.composer.powerPreference = "low-power"

            // Post Processing Passes
            if( this.params.bloom === true && this.params.postprocessing === true )
            {
                this.composer.addPass( new UnrealBloomPass(
                    { x: this.params.bloomResolution, y: this.params.bloomResolution }, 
                    this.params.bloomPower, this.params.bloomRadius, this.params.bloomThreshold 
                ))
            }
            // CUSTOM VHS SHADER
            this.VHSShader = {
                uniforms: {
                    tDiffuse: { value: null },
                    uTime: { value: 0 },
                },
                vertexShader: basicVertex, 
                fragmentShader: VHSFragment
            }
            this.VHSShaderPass = new ShaderPass(this.VHSShader)
            this.composer.addPass(this.VHSShaderPass)
        }
   
        this.time.fpsInterval = 1000 / this.params.fps
        this.camera.instance.fov = this.params.startFov
        this.camera.instance.far = this.params.renderDistance
        this.camera.fovVariable.fov = this.params.startFov
        this.camera.fovAnimationTime = this.params.fovAnimationTime
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
            if( this.params.VHS === true )
            {
                this.VHSShaderPass.uniforms.uTime.value = this.time.elapsedTime / 1000
            }
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