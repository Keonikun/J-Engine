import * as THREE from 'three'
import { gsap } from 'gsap'

export default class Environment
{
    constructor(experience)
    {
        this.experience = experience
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        this.params = {
            backgroundColor: '#000000',
            ambientLightInt: 0.5,
            ambientLightCol: '#ffffff',
            dirLightInt: 0.8,
            dirLightCol: '#ffffff',
            dirLightPosX: 3.5,
            dirLightPosY: 2,
            dirLightPosZ: - 1.25,
            fogNear: 30,
            fogDistance: 20,

            // Day/Night Cycle
            dayColor: '#5c5c5c',
            dayFog: 50,
            nightColor: '#000000',
            nightFog: 30,
            fadeDuration: 150,
        }
        

        this.setDebug()
        this.setAmbientLight()
        this.setDirectionalLight()
        this.setSimpleBackground()
        this.setEnvironmentMap()
        this.setFog()
    }

    setAmbientLight()
    {
        this.ambientLight = new THREE.AmbientLight( this.params.ambientLightCol, this.params.ambientLightInt )
        this.scene.add(this.ambientLight)
    }

    setDirectionalLight()
    {
        this.directionalLight = new THREE.DirectionalLight( this.params.dirLightCol, this.params.dirLightInt )
        this.directionalLight.position.set(this.params.dirLightPosX, this.params.dirLightPosY, this.params.dirLightPosZ)
        this.scene.add(this.directionalLight)
    }

    setFog()
    {
        this.scene.fog = new THREE.Fog(this.params.backgroundColor, this.params.fogNear, this.params.fogNear + this.params.fogDistance)
    }

    setSimpleBackground()
    {
        this.scene.background = new THREE.Color( this.params.backgroundColor )

    }

    setBackground(color)
    {
        this.scene.background = new THREE.Color( color )
    }

    nighttime()
    {
        this.toNight = gsap.to(this.scene.background,{r: 0.01, g: 0.01, b: 0.01, duration: this.params.fadeDuration})
        this.toNightFog = gsap.to(this.scene.fog.color,{r: 0.01, g: 0.01, b: 0.01, duration: this.params.fadeDuration})
        this.toNightFogThickness = gsap.to(this.scene.fog,{near: this.params.nightFog, far: this.params.nightFog + 15, duration: this.params.fadeDuration})
        this.toNight.play()
        this.toNightFog.play()
        this.toNightFogThickness.play()
    }

    daytime()
    {   
        this.toDay = gsap.to(this.scene.background,{r: 0.36, g: 0.36, b: 0.36, duration: this.params.fadeDuration})
        this.toDayFog = gsap.to(this.scene.fog.color,{r: 0.36, g: 0.36, b: 0.36, duration: this.params.fadeDuration})
        this.toDayFogThickness = gsap.to(this.scene.fog,{near: this.params.fogNear, far: this.params.fogFar, duration: this.params.fadeDuration})
        this.toDay.play()
        this.toDayFog.play()
        this.toDayFogThickness.play()
    }

    setEnvironmentMap()
    {
        // this.environmentMap = {}
        // this.environmentMap.intensity = 0.4
        // // this.environmentMap.texture = this.resources.items.stormydaysEnvMap
        // this.environmentMap.texture.encoding = THREE.sRGBEncoding

        // this.scene.environment = this.environmentMap.texture

        // this.setEnvironmentMap.updateMaterial = () =>
        // {
        //     this.scene.traverse((child) => 
        //     {
        //         if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
        //         {
        //             child.material.envMap = this.environmentMap.texture
        //             child.material.envMapIntensity = this.environmentMap.intensity
        //             child.material.needsUpdate = true
        //         }
        //     })
        // }
        // this.setEnvironmentMap.updateMaterial()

        // this.scene.background = this.environmentMap.texture

        this.studioHDR = this.resources.items.studioHDR
        this.studioHDR.mapping = THREE.EquirectangularReflectionMapping
        this.scene.environment = this.studioHDR
    }

    /**------------------------------------------------------------------
     *--------------------------------DEBUG------------------------------
     *-------------------------------------------------------------------
    */

    setDebug()
    {
        if(this.debug.active)
        {
            this.debugFolder = this.debug.environmentDebugFolder
            this.debugFolder.addColor( this.params, 'backgroundColor' )
            .name( 'Background Color' )
            .onChange( () =>
            {
                this.scene.fog.color.set(this.params.backgroundColor)
                this.scene.background.set(this.params.backgroundColor)
            } )
            this.debugFolder.add( this.params, 'fogNear', 0, 100 )
            .name('Fog Depth')
            .onChange(() =>
            {
                this.scene.fog.near = this.params.fogNear
                this.scene.fog.far = this.params.fogNear + this.params.fogDistance
            })
            this.debugFolder.add( this.params, 'ambientLightInt', 0, 2 )
            .name('Ambient Light Intensity')
            .onChange(() =>
            {
                this.ambientLight.intensity = this.params.ambientLightInt
            })
            this.debugFolder.addColor( this.params, 'ambientLightCol' )
            .name('Ambient Light Color')
            .onChange(() =>
            {
                this.ambientLight.color.set(this.params.ambientLightCol)
            })
            this.debugFolder.add( this.params, 'dirLightInt', 0, 2)
            .name('Directional Light Intensity')
            .onChange(() =>
            {
                this.directionalLight.intensity = this.params.dirLightInt
            })
            this.debugFolder.addColor( this.params, 'dirLightCol' )
            .name('Directional Light Color')
            .onChange(() =>
            {
                this.directionalLight.color.set(this.params.dirLightCol)
            })
            this.dirLightPosFolder = this.debugFolder.addFolder('Directional Light Position')
            this.dirLightPosFolder.close()
            this.dirLightPosFolder.add( this.params, 'dirLightPosX', -10, 10 )
            .name('X')
            .onChange(() =>
            {
                this.directionalLight.position.x = this.params.dirLightPosX
            })
            this.dirLightPosFolder.add( this.params, 'dirLightPosY', -10, 10 )
            .name('Y')
            .onChange(() =>
            {
                this.directionalLight.position.y = this.params.dirLightPosY
            })
            this.dirLightPosFolder.add( this.params, 'dirLightPosZ', -10, 10 )
            .name('Z')
            .onChange(() =>
            {
                this.directionalLight.position.z = this.params.dirLightPosZ
            })
            this.debugFolder.close()
        }
    }
}