import * as THREE from 'three'
import { PlainAnimator } from 'three-plain-animator/lib/plain-animator.js'
import { WaterRefractionShader } from 'three/examples/jsm/shaders/WaterRefractionShader.js'

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
        this.applyMaterials()
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
            this.dynamicObjects = this.experience.world.models.dynamicObjects
        }

        this.waterExists = false
        this.staticExists = false
        this.windowRainExists = false
        this.rippleExists = false
        this.fanExists = false

        this.waterAnimTexture = this.resources.items.waterAnim
        this.rainAnimTexture = this.resources.items.rainAnim
        this.staticAnimTexture = this.resources.items.staticAnim
        this.rippleAnimTexture = this.resources.items.rippleAnim
        this.fanAnimTexture = this.resources.items.fanAnim
    }

    applyMaterials()
    {
        this.physMesh.children.forEach( element => {
            this.replaceMaterials(element)

            if( element.material.name === "Textures")
            {
                element.material.side = THREE.FrontSide
                element.material.precision = 'lowp'
                element.material = new THREE.MeshStandardMaterial().copy( element.material )
            }
            if( element.material.name === "TexturesDoubleSide")
            {
                element.material.side = THREE.DoubleSide
                element.material.precision = 'lowp'
                element.material = new THREE.MeshStandardMaterial().copy( element.material )
            }
        }) 
        if(this.models.staticScene === true)
        {
            this.staticMesh.children.forEach( element => {
                this.replaceMaterials(element)
            }) 
        }
        if(this.models.dynamicScene === true)
        {
            this.dynamicObjects.children.forEach( element => {
                this.replaceMaterials(element)
            }) 
        }
    }

    replaceMaterials(element)
    {
        if( element.material.name === "Water" )
        {
            this.waterExists = true

            this.waterMaterial = new THREE.MeshPhysicalMaterial({ 
                precision: 'lowp',
                roughness: 0, 
                transmission: 0.5,
                metalness: 0,
                side: THREE.FrontSide 
            })

            element.material = this.waterMaterial
        }
        else if( element.material.name === "WindowRain" )
        {
            this.windowRainExists = true

            this.rainAnim = new PlainAnimator( this.rainAnimTexture, 8, 8, 60, 10 )
            this.rainAnimMap = this.rainAnim.init()
            this.rainMaterial = new THREE.MeshStandardMaterial({ 
                precision: 'lowp',
                map: this.rainAnimMap, 
                transparent: true, 
                side: THREE.DoubleSide 
            })
            
            element.material = this.rainMaterial
        }
        else if( element.material.name === "Static" )
        {
            this.staticExists = true

            this.staticAnim = new PlainAnimator( this.staticAnimTexture, 2, 2, 4, 10 )
            this.staticAnimMap = this.staticAnim.init()
            this.staticMaterial = new THREE.MeshStandardMaterial({ 
                precision: 'lowp',
                map: this.staticAnimMap, 
                emissive: '#333333' 
            })
            
            element.material = this.staticMaterial
        }
        else if( element.material.name === "Ripple" )
        {
            this.rippleExists = true

            this.rippleAnim = new PlainAnimator( this.rippleAnimTexture, 4, 4, 16, 20 )
            this.rippleAnimMap = this.rippleAnim.init()
            this.rippleMaterial = new THREE.MeshStandardMaterial({ 
                precision: 'lowp',
                map: this.rippleAnimMap, 
                transparent: true 
            })

            element.material = this.rippleMaterial
        }
        else if( element.material.name === "Fan" )
        {
            this.fanExists = true

            this.fanAnim = new PlainAnimator( this.fanAnimTexture, 2, 2, 4, 20 )
            this.fanAnimMap = this.fanAnim.init()
            this.fanMaterial = new THREE.MeshStandardMaterial({ 
                precision: 'lowp',
                map: this.fanAnimMap, 
                transparent: true 
            })
            
            element.material = this.fanMaterial
        }
    }

    setShaders()
    {
        this.waterMaterialUniforms = {
            uTime: { value: 0 },
        }

        // CREATE WATER SHADER
        this.waterMaterial.onBeforeCompile = (shader) =>
        {
            shader.uniforms.uTime = this.waterMaterialUniforms.uTime

            shader.vertexShader = shader.vertexShader.replace(
                '#include <common>', 
                `
                    #include <common>

                    // SHADER SETTINGS
                    #define frequencyX 0.5
                    #define frequencyZ 1.5
                    #define speed 0.0005
                    #define elevation 0.05

                    uniform float uTime;

                    varying vec2 vUv;  
                `
            )
            shader.vertexShader = shader.vertexShader.replace(
                '#include <begin_vertex>', 
                `
                    #include <begin_vertex>
                    
                    // Position
                    transformed.y = transformed.y - sin(transformed.x * frequencyX + (uTime * speed)) * 
                                    sin(transformed.z * frequencyZ + (uTime * speed)) * 
                                    elevation;

                    vUv = uv;
                `
            )
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <clipping_planes_pars_fragment>', 
                `
                    #include <clipping_planes_pars_fragment>

                    uniform float uTime;

                    varying vec2 vUv;

                    // Simplex 2D noise
                    //
                    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

                    float snoise(vec2 v){
                        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                                -0.577350269189626, 0.024390243902439);
                        vec2 i  = floor(v + dot(v, C.yy) );
                        vec2 x0 = v -   i + dot(i, C.xx);
                        vec2 i1;
                        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
                        vec4 x12 = x0.xyxy + C.xxzz;
                        x12.xy -= i1;
                        i = mod(i, 289.0);
                        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
                        + i.x + vec3(0.0, i1.x, 1.0 ));
                        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                            dot(x12.zw,x12.zw)), 0.0);
                        m = m*m ;
                        m = m*m ;
                        vec3 x = 2.0 * fract(p * C.www) - 1.0;
                        vec3 h = abs(x) - 0.5;
                        vec3 ox = floor(x + 0.5);
                        vec3 a0 = x - ox;
                        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
                        vec3 g;
                        g.x  = a0.x  * x0.x  + h.x  * x0.y;
                        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
                        return 130.0 * dot(m, g);
                    }
                    
                `
            )
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <color_fragment>', 
                `
                    #include <color_fragment>

                    float strength = sin(snoise(vec2(vUv.x + uTime * 0.00005, vUv.y + uTime * 0.00005) * 10.0));
                    vec3 noise = vec3(strength * 0.25,strength* 0.25,strength* 0.25);

                    float strength2 = sin(snoise(vec2(vUv.x - uTime * 0.00005, vUv.y - uTime * 0.00005) * 6.0));
                    vec3 noise2 = vec3(strength2 * 0.25,strength2* 0.25,strength2* 0.25);

                    vec3 combinedNoise = mix(noise2, noise, 0.5);

                    vec3 waterColor1 = vec3(0.15,0.15,0.17);
                    vec3 waterColor2 = vec3(0.55,0.6,0.66);

                    vec3 mixedWaterColor = mix(waterColor1,waterColor2, combinedNoise);
                    vec4 finalWaterColor = vec4(mixedWaterColor, 0.9);

                    diffuseColor = finalWaterColor;
                `
            )
        }
    }

    update()
    {
        if( this.waterExists === true )
        {
            this.waterMaterialUniforms.uTime.value = this.time.elapsedTime
        }
        if( this.windowRainExists === true )
        {
            this.rainAnim.animate()
        }
        if( this.staticExists === true )
        {
            this.staticAnim.animate()
        }
        if( this.rippleExists === true )
        {
            this.rippleAnim.animate()
        }
        if( this.fanExists === true )
        {
            this.fanAnim.animate()
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
            this.debugFolder = this.debug.environmentDebugFolder.addFolder('Shaders')

            this.waterDebugFolder = this.debugFolder.addFolder('Water')

            this.debugFolder.close()
        }
    }
}