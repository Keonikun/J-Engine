import * as THREE from 'three'
import rainVertex from './Shaders/rainVertex.glsl'
import rainFragment from './Shaders/rainFragment.glsl'

export default class Particles
{
    constructor(experience)
    {
        this.experience = experience
        this.resources = this.experience.resources
        this.camera = this.experience.camera.instance
        this.scene = this.experience.scene
        this.debug = this.experience.debug
        this.world = this.experience.world
        this.ready = false

        this.params = {
            rainEnabled: true,
            rainDropCount: 100,
            rainDropSpeed: 0.05,
            rainDropColor: '#ffffff',
            rainDropSize: 0.2,
            rainSimDistance: 7,
            rainHeightSpawn: -0.5,
            rainHeightDeath: -10,
            windX: 0,
            windZ: 0,

            posX: 0,
            posY: 0,
            posZ: -35
        }

        this.staticPosition = false


        if(this.params.rainEnabled === true)
        {
            this.setRain()
        }

        this.world.on('ready', () =>
        {
            this.firstPerson = this.world.firstPerson
        })

        this.setDebug()
    }

    setRain()
    {
        this.rainGeo = new THREE.BufferGeometry()
        this.rainArray = new Float32Array( this.params.rainDropCount * 3 )

        for( let i=0;i<this.params.rainDropCount * 3; i+=3 )
        {
            this.rainArray[i] = Math.random() * (this.params.rainSimDistance * 2) - this.params.rainSimDistance
            this.rainArray[i + 1] = Math.random() * this.params.rainSimDistance
            this.rainArray[i + 2] = Math.random() * (this.params.rainSimDistance * 2) - this.params.rainSimDistance
        }

        this.rainGeo.setAttribute( 'position', new THREE.BufferAttribute( this.rainArray, 3 ))

        this.rainMat = new THREE.ShaderMaterial({
            depthWrite: false,
            vertexColors: true,
            transparent: true,
            vertexShader: rainVertex,
            fragmentShader: rainFragment,
            uniforms:
            {
                uTime: { value: 0 },
                map: { value: this.resources.items.rainTexture }
            }
        })

        this.rain = new THREE.Points(this.rainGeo, this.rainMat)
        this.rain.position.set(this.params.posX, this.params.posY, this.params.posZ)
        this.scene.add(this.rain)
    }

    update()
    {
        if(this.params.rainEnabled === true && this.experience.worldLoaded === true)
        {   
            if(this.staticPosition === false)
            {
                this.rain.position.y = this.camera.position.y 
                this.rain.position.x = this.camera.position.x
                this.rain.position.z = this.camera.position.z 
            }

            // Update rain shader
            this.rainMat.uniforms.uTime.value ++
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
            this.debugFolder = this.debug.environmentDebugFolder.addFolder('Rain Particle Settings')
            this.debugFolder.add(this.params, 'rainDropCount').onChange(() =>
            {
                if(this.params.rainEnabled)
                {
                    this.rain.geometry.dispose()
                    this.rain.material.dispose()
                    this.scene.remove(this.rain)
                    this.setRain()
                }
            })
            this.debugFolder.add(this.params, 'rainDropSpeed', 0.001, 0.5)
            this.debugFolder.addColor(this.params, 'rainDropColor').onChange(() =>
            {
                if(this.params.rainEnabled)
                {
                    this.rain.material.color.set(this.params.rainDropColor)
                }
            })
            this.debugFolder.add(this.params, 'rainDropSize', 0.01, 4).onChange(() =>
            {
                if(this.params.rainEnabled)
                {
                    this.rain.material.size = this.params.rainDropSize
                }
            })
            this.debugFolder.add(this.params, 'rainSimDistance', 0.1, 20).onChange(() =>
            {
                if(this.params.rainEnabled)
                {
                    this.rain.geometry.dispose()
                    this.rain.material.dispose()
                    this.scene.remove(this.rain)
                    this.setRain()
                }
            })
            this.debugFolder.close()     
        }
    }
}