import * as THREE from 'three'

export default class Environment
{
    constructor(experience)
    {
        this.experience = experience
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        this.params = {
            backgroundAndFogCol: '#5c5c5c',
            backgroundCol: '#5c5c5c',
            ambientLightInt: 0.5,
            ambientLightCol: '#ffffff',
            dirLightInt: 0.8,
            dirLightCol: '#ffffff',
            dirLightPosX: 3.5,
            dirLightPosY: 2,
            dirLightPosZ: - 1.25,
            fogCol: '#5c5c5c',
            fogNear: 20,
            fogFar: 35,
            envMapEnabled: false,
            envMap: 'stormydays'
        }

        this.setDebug()
        this.setAmbientLight()
        this.setDirectionalLight()
        this.setFog()
        if(this.params.envMapEnabled === true)
        {
            this.setEnvironmentMap()
        }
        else
        {
            this.setSimpleBackground()
        }
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
        this.scene.fog = new THREE.Fog(this.params.fogCol, this.params.fogNear, this.params.fogFar)
    }

    setSimpleBackground()
    {
        this.scene.background = new THREE.Color( this.params.backgroundCol )
    }

    setEnvironmentMap()
    {
        this.environmentMap = {}
        this.environmentMap.intensity = 0.4
        this.environmentMap.texture = this.resources.items.stormydaysEnvMap
        this.environmentMap.texture.encoding = THREE.sRGBEncoding

        this.scene.environment = this.environmentMap.texture

        this.setEnvironmentMap.updateMaterial = () =>
        {
            this.scene.traverse((child) => 
            {
                if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
                {
                    child.material.envMap = this.environmentMap.texture
                    child.material.envMapIntensity = this.environmentMap.intensity
                    child.material.needsUpdate = true
                }
            })
        }
        this.setEnvironmentMap.updateMaterial()

        this.scene.background = this.environmentMap.texture
    }

    setDebug()
    {
        if(this.debug.active)
        {
            this.debugFolder = this.debug.gui.addFolder( 'Environment' )
            this.debugFolder.addColor( this.params, 'backgroundAndFogCol' ).onChange(() =>
            {
                if(this.params.envMapEnabled === false)
                {
                    this.scene.background.set(this.params.backgroundAndFogCol)
                    this.scene.fog.color.set(this.params.backgroundAndFogCol)
                }
                else
                {
                    console.log("Disable Environment Map Before Adjusting Background Color")
                }
            })
            this.debugFolder.addColor( this.params, 'backgroundCol' ).onChange(() =>
            {
                if(this.params.envMapEnabled === false)
                {
                    this.scene.background.set(this.params.backgroundCol)
                }
                else
                {
                    console.log("Disable Environment Map Before Adjusting Background Color")
                }
            })
            this.debugFolder.addColor( this.params, 'fogCol' ).onChange( () =>
            {
                this.scene.fog.color.set(this.params.fogCol)
            } )
            this.debugFolder.add( this.params, 'fogNear', 0, 500).onChange(() =>
            {
                this.scene.fog.near = this.params.fogNear
            })
            this.debugFolder.add( this.params, 'fogFar', 0, 500).onChange(() =>
            {
                this.scene.fog.far = this.params.fogFar
            })
            this.debugFolder.add( this.params, 'ambientLightInt', 0, 2 ).onChange(() =>
            {
                this.ambientLight.intensity = this.params.ambientLightInt
            })
            this.debugFolder.addColor( this.params, 'ambientLightCol' ).onChange(() =>
            {
                this.ambientLight.color.set(this.params.ambientLightCol)
            })
            this.debugFolder.add( this.params, 'dirLightInt', 0, 2).onChange(() =>
            {
                this.directionalLight.intensity = this.params.dirLightInt
            })
            this.debugFolder.addColor( this.params, 'dirLightCol' ).onChange(() =>
            {
                this.directionalLight.color.set(this.params.dirLightCol)
            })
            this.debugFolder.add( this.params, 'dirLightPosX', -10, 10 ).onChange(() =>
            {
                this.directionalLight.position.x = this.params.dirLightPosX
            })
            this.debugFolder.add( this.params, 'dirLightPosY', -10, 10 ).onChange(() =>
            {
                this.directionalLight.position.y = this.params.dirLightPosY
            })
            this.debugFolder.add( this.params, 'dirLightPosZ', -10, 10 ).onChange(() =>
            {
                this.directionalLight.position.z = this.params.dirLightPosZ
            })
            this.debugFolder.add( this.params, 'envMapEnabled').onChange((event) =>
            {
                if(event === true)
                {
                    this.setEnvironmentMap()
                }
                else if(event === false)
                {
                    this.setSimpleBackground()
                }
            })
            this.debugFolder.close()
        }
    }
}