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
        if( element.material.name === "Textures")
        {
            element.material.side = THREE.FrontSide
        }
        if( element.material.name === "Water" )
        {
            this.waterExists = true

            this.waterAnim = new PlainAnimator( this.waterAnimTexture, 4, 4, 16, 5 )
            this.waterAnimMap = this.waterAnim.init()
            this.waterMaterial = new THREE.MeshPhysicalMaterial({ 
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
            this.rainMaterial = new THREE.MeshStandardMaterial({ map: this.rainAnimMap, transparent: true, side: THREE.DoubleSide })
            
            element.material = this.rainMaterial
        }
        else if( element.material.name === "Static" )
        {
            this.staticExists = true

            this.staticAnim = new PlainAnimator( this.staticAnimTexture, 2, 2, 4, 10 )
            this.staticAnimMap = this.staticAnim.init()
            this.staticMaterial = new THREE.MeshStandardMaterial({ map: this.staticAnimMap, emissive: '#333333' })
            
            element.material = this.staticMaterial
        }
        else if( element.material.name === "Ripple" )
        {
            this.rippleExists = true

            this.rippleAnim = new PlainAnimator( this.rippleAnimTexture, 4, 4, 16, 20 )
            this.rippleAnimMap = this.rippleAnim.init()
            this.rippleMaterial = new THREE.MeshStandardMaterial({ map: this.rippleAnimMap, transparent: true })

            element.material = this.rippleMaterial
        }
        else if( element.material.name === "Fan" )
        {
            this.fanExists = true

            this.fanAnim = new PlainAnimator( this.fanAnimTexture, 2, 2, 4, 20 )
            this.fanAnimMap = this.fanAnim.init()
            this.fanMaterial = new THREE.MeshStandardMaterial({ map: this.fanAnimMap, transparent: true })
            
            element.material = this.fanMaterial
        }
    }

    setShaders()
    {
        this.waterMaterialUniforms = {
            uTime: { value: 0 },
            uSpeed: { value: 0.0005 },
            uFrequencyX: { value: 0.5 },
            uFrequencyZ: { value: 1.5 },
            uElevation: { value: 0.05 }
        }

        this.waterMaterial.onBeforeCompile = (shader) =>
        {
            shader.uniforms.uTime = this.waterMaterialUniforms.uTime
            shader.uniforms.uSpeed = this.waterMaterialUniforms.uSpeed
            shader.uniforms.uFrequencyX = this.waterMaterialUniforms.uFrequencyX
            shader.uniforms.uFrequencyZ = this.waterMaterialUniforms.uFrequencyZ
            shader.uniforms.uElevation = this.waterMaterialUniforms.uElevation


            shader.vertexShader = shader.vertexShader.replace(
                '#include <common>', 
                `
                    #include <common>

                    uniform float uTime;
                    uniform float uSpeed;
                    uniform float uFrequencyX;
                    uniform float uFrequencyZ;
                    uniform float uElevation;

                    varying vec2 vUv;  
                `
            )
            shader.vertexShader = shader.vertexShader.replace(
                '#include <begin_vertex>', 
                `
                    #include <begin_vertex>
                    
                    transformed.y = transformed.y - sin(transformed.x * uFrequencyX + (uTime * uSpeed)) * 
                                    sin(transformed.z * uFrequencyZ + (uTime * uSpeed)) * 
                                    uElevation;

                    vUv = uv;
                `
            )
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <clipping_planes_pars_fragment>', 
                `
                    #include <clipping_planes_pars_fragment>

                    uniform float uTime;

                    varying vec2 vUv;

                    vec4 permute(vec4 x)
                    {
                        return mod(((x*34.0)+1.0)*x, 289.0);
                    }

                    vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

                    float cnoise(vec2 P){
                    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
                    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
                    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
                    vec4 ix = Pi.xzxz;
                    vec4 iy = Pi.yyww;
                    vec4 fx = Pf.xzxz;
                    vec4 fy = Pf.yyww;
                    vec4 i = permute(permute(ix) + iy);
                    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
                    vec4 gy = abs(gx) - 0.5;
                    vec4 tx = floor(gx + 0.5);
                    gx = gx - tx;
                    vec2 g00 = vec2(gx.x,gy.x);
                    vec2 g10 = vec2(gx.y,gy.y);
                    vec2 g01 = vec2(gx.z,gy.z);
                    vec2 g11 = vec2(gx.w,gy.w);
                    vec4 norm = 1.79284291400159 - 0.85373472095314 * 
                        vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
                    g00 *= norm.x;
                    g01 *= norm.y;
                    g10 *= norm.z;
                    g11 *= norm.w;
                    float n00 = dot(g00, vec2(fx.x, fy.x));
                    float n10 = dot(g10, vec2(fx.y, fy.y));
                    float n01 = dot(g01, vec2(fx.z, fy.z));
                    float n11 = dot(g11, vec2(fx.w, fy.w));
                    vec2 fade_xy = fade(Pf.xy);
                    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
                    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
                    return 2.3 * n_xy;
                    }
                    
                `
            )
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <color_fragment>', 
                `
                    #include <color_fragment>

                    float strength = sin(cnoise(vec2(vUv.x + uTime * 0.00005, vUv.y + uTime * 0.00005) * 14.0));
                    vec4 noise = vec4(strength * 0.25,strength* 0.25,strength* 0.25,1.0);

                    float strength2 = sin(cnoise(vec2(vUv.x - uTime * 0.00005, vUv.y - uTime * 0.00005) * 7.0));
                    vec4 noise2 = vec4(strength2 * 0.25,strength2* 0.25,strength2* 0.25,1.0);

                    vec4 combinedNoise = mix(noise2, noise, 0.5);

                    vec4 waterColor1 = vec4(0.15,0.15,0.17,1.0);
                    vec4 waterColor2 = vec4(0.55,0.6,0.66,1.0);

                    vec4 waterColorWithNoise = mix(waterColor1,waterColor2, combinedNoise);
                    waterColorWithNoise.a = 0.9;

                    diffuseColor = waterColorWithNoise;
                `
            )
        }
    }

    update()
    {
        if( this.waterExists === true )
        {
            this.waterAnim.animate()
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
            this.waterDebugFolder.add(this.waterMaterialUniforms.uSpeed, 'value').min(0.00001).max(0.02).step(0.00001).name('Speed')
            this.waterDebugFolder.add(this.waterMaterialUniforms.uElevation, 'value').min(0).max(1).step(0.001).name('Elevation')
            this.waterDebugFolder.add(this.waterMaterialUniforms.uFrequencyX, 'value').min(0.0001).max(1).step(0.0001).name('X-Frequency')
            this.waterDebugFolder.add(this.waterMaterialUniforms.uFrequencyZ, 'value').min(0.0001).max(1).step(0.0001).name('Z-Frequency')

            this.debugFolder.close()
        }
    }
}