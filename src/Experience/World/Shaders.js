import * as THREE from 'three'
import { PlainAnimator } from 'three-plain-animator/lib/plain-animator'


export default class Shaders
{
    constructor( experience )
    {
        this.experience = experience
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug
  
        this.params = {
            
        }

        this.setup()
        this.setAnimatedMaterials()
        this.setShaders()
        this.setDebug()
    }

    setup()
    {
        this.staticMesh = this.experience.world.models.staticMesh
        this.waterAnimTexture = this.resources.items.waterAnim
    }

    setAnimatedMaterials()
    {
        this.waterAnim = new PlainAnimator( this.waterAnimTexture, 8, 4, 32, 10 )
        this.waterAnimMap = this.waterAnim.init()
        this.waterMaterial = new THREE.MeshBasicMaterial({ map: this.waterAnimMap })
        this.applyAnimatedMaterials()
    }

    applyAnimatedMaterials()
    {
        this.staticMesh.children.forEach( element => {
            if( element.material.name === "Water" )
            {
                element.material = this.waterMaterial
            }
        }); 
    }

    setShaders()
    {
        /**
         *  Test Shaders
         */
        // this.testShader = new THREE.ShaderMaterial({
        //     uniforms: {
        //         uTime: { value: 0 }
        //     },
        //     vertexShader: 
        //         `
        //             uniform float uTime;

        //             void main()
        //             {
        //                 vec4 modelPosition = modelMatrix * vec4(position, 1.0);

        //                 modelPosition.y = modelPosition.y + sin(modelPosition.x + (uTime * 0.01)) + 1.0;

        //                 vec4 viewPosition = viewMatrix * modelPosition;
        //                 vec4 projectedPosition = projectionMatrix * viewPosition;

        //                 gl_Position = projectedPosition;
        //             }
        //         `,
        //     fragmentShader:
        //         `
        //             void main()
        //             {
        //                 gl_FragColor = vec4( 0.0, 0.0, 0.5, 1.0 );
        //             }
        //         `
        // })

        // this.testMesh = new THREE.Mesh(new THREE.PlaneGeometry(1,1,10), this.testShader)
        // this.testMesh.position.set(61, 2.5, -23)
        // this.testMesh.rotation.x = Math.PI * 1.5
        // this.scene.add(this.testMesh)

        /**
         *  WATER SHADER
         */
        this.customWaterUniforms = {
            uTime: { value: 0 },
            uSpeed: { value: 0.002 },
            uFrequencyX: { value: 0.5 },
            uFrequencyZ: { value: 0.2 },
            uElevation: { value: 0.1 },
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
        this.customWaterUniforms.uTime.value = this.time.elapsedTime
    }

    setDebug()
    {
        if(this.debug.active)
        {
            this.debugFolder = this.debug.gui.addFolder('Shaders')

            this.waterDebugFolder = this.debugFolder.addFolder('Water')
            this.waterDebugFolder.add(this.customWaterUniforms.uSpeed, 'value').min(0.00001).max(0.02).step(0.00001).name('Speed')
            this.waterDebugFolder.add(this.customWaterUniforms.uElevation, 'value').min(0).max(1).step(0.001).name('Elevation')
            this.waterDebugFolder.add(this.customWaterUniforms.uFrequencyX, 'value').min(0.0001).max(1).step(0.0001).name('X-Frequency')
            this.waterDebugFolder.add(this.customWaterUniforms.uFrequencyZ, 'value').min(0.0001).max(1).step(0.0001).name('Z-Frequency')

            this.debugFolder.close()
        }
    }
}