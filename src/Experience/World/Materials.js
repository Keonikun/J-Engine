import * as THREE from 'three'
import { PlainAnimator } from 'three-plain-animator/lib/plain-animator'


export default class Materials
{
    constructor( experience )
    {
        this.experience = experience
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.models = this.experience.world.models
  
        this.params = {
            
        }

        this.setup()
        this.setAnimatedMaterials()
        this.setShaders()
        this.setDebug()
    }

    setup()
    {
        this.physMesh = this.experience.world.models.physMesh
        if(this.models.staticScene === true)
        {
            this.staticMesh = this.experience.world.models.staticMesh
        }
        if(this.models.dynamicScene === true)
        {
            this.dynamicMesh = this.experience.world.models.dynamicMesh
        }
        this.waterAnimTexture = this.resources.items.waterAnim
        this.rainAnimTexture = this.resources.items.rainAnim
    }

    setAnimatedMaterials()
    {
        this.waterAnim = new PlainAnimator( this.waterAnimTexture, 4, 4, 16, 5 )
        this.waterAnimMap = this.waterAnim.init()
        this.waterMaterial = new THREE.MeshStandardMaterial({ map: this.waterAnimMap, transparent: true, metalness: 0.5 })
       
        this.rainAnim = new PlainAnimator( this.rainAnimTexture, 8, 8, 60, 10 )
        this.rainAnimMap = this.rainAnim.init()
        this.rainMaterial = new THREE.MeshStandardMaterial({ map: this.rainAnimMap, transparent: true })

        this.applyAnimatedMaterials()
    }

    applyAnimatedMaterials()
    {
        this.physMesh.children.forEach( element => {
            if( element.material.name === "Water" )
            {
                element.material = this.waterMaterial
            }
        }) 
        this.physMesh.children.forEach( element => {
            if( element.material.name === "WindowRain" )
            {
                element.material = this.rainMaterial
            }
        })
        if(this.models.staticScene === true)
        {
            this.staticMesh.children.forEach( element => {
                if( element.material.name === "Water" )
                {
                    element.material = this.waterMaterial
                }
            }) 
            this.staticMesh.children.forEach( element => {
                if( element.material.name === "WindowRain" )
                {
                    element.material = this.rainMaterial
                }
            })
        }
        // if(this.models.dynamicScene === true)
        // {
        //     this.dynamicMesh.children.forEach( element => {
        //         if( element.material.name === "Water" )
        //         {
        //             element.material = this.waterMaterial
        //         }
        //     }) 
        //     this.dynamicMesh.children.forEach( element => {
        //         if( element.material.name === "WindowRain" )
        //         {
        //             element.material = this.rainMaterial
        //         }
        //     })
        // }
    }

    setShaders()
    {
        /**
         *  WATER SHADER
         */
        this.customWaterUniforms = {
            uTime: { value: 0 },
            uSpeed: { value: 0.002 },
            uFrequencyX: { value: 0.5 },
            uFrequencyZ: { value: 0.2 },
            uElevation: { value: 0.005 },
        }

        this.waterMaterial.onBeforeCompile = ( shader ) =>
        {
            shader.uniforms.uTime = this.customWaterUniforms.uTime
            shader.uniforms.uSpeed = this.customWaterUniforms.uSpeed
            shader.uniforms.uFrequencyX = this.customWaterUniforms.uFrequencyX
            shader.uniforms.uFrequencyZ = this.customWaterUniforms.uFrequencyZ
            shader.uniforms.uElevation = this.customWaterUniforms.uElevation

            shader.vertexShader = shader.vertexShader.replace(
                '#include <common>',
                `
                    #include <common>

                    uniform float uTime;
                    uniform float uSpeed;
                    uniform float uFrequencyX;
                    uniform float uFrequencyZ;
                    uniform float uElevation;
                `
            )
            shader.vertexShader = shader.vertexShader.replace(
                '#include <begin_vertex>',
                `
                    #include <begin_vertex>
                    
                    transformed.y = transformed.y - ( sin(transformed.x * uFrequencyX + (uTime * uSpeed)) * sin(transformed.z * uFrequencyZ + (uTime * uSpeed)) * uElevation);
                `
            )
        }
    }

    update()
    {
        this.waterAnim.animate()
        this.rainAnim.animate()
        this.customWaterUniforms.uTime.value = this.time.elapsedTime
    }

    /**------------------------------------------------------------------
     *--------------------------------DEBUG------------------------------
     *-------------------------------------------------------------------
    */

    setDebug()
    {
        if(this.debug.active)
        {
            this.debugFolder = this.debug.shadersDebugFolder

            this.waterDebugFolder = this.debugFolder.addFolder('Water')
            this.waterDebugFolder.add(this.customWaterUniforms.uSpeed, 'value').min(0.00001).max(0.02).step(0.00001).name('Speed')
            this.waterDebugFolder.add(this.customWaterUniforms.uElevation, 'value').min(0).max(1).step(0.001).name('Elevation')
            this.waterDebugFolder.add(this.customWaterUniforms.uFrequencyX, 'value').min(0.0001).max(1).step(0.0001).name('X-Frequency')
            this.waterDebugFolder.add(this.customWaterUniforms.uFrequencyZ, 'value').min(0.0001).max(1).step(0.0001).name('Z-Frequency')

            this.debugFolder.close()
        }
    }
}