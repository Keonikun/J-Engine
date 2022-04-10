import * as THREE from 'three'

export default class Environment
{
    constructor(experience)
    {
        this.experience = experience
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        this.setAmbientLight()
        this.setDirectionalLight()
        // this.setPointLights()
        this.setFog()
        this.setBackground()
        this.setEnvironmentMap()

        if(this.debug.active)
        {
            this.fogFolder = this.debug.ui.addFolder('Fog')
            this.fogFolder.add(this.scene.fog, 'near')
            this.fogFolder.add(this.scene.fog, 'far')
                
        }
    }

    setAmbientLight()
    {
        this.ambientLight = new THREE.AmbientLight( '#ffffff', 0.5 )
        this.scene.add(this.ambientLight)
    }

    setDirectionalLight()
    {
        this.directionalLight = new THREE.DirectionalLight( '#ffffff', 0.8 )
        this.directionalLight.position.set(3.5, 2, - 1.25)
        this.scene.add(this.directionalLight)
    }

    setPointLights()
    {
        this.pointLight1 = new THREE.PointLight( '#ff0000', 0.1 )
        this.pointLight1.position.set(3.5, 3.64322, -14.4504)
        this.scene.add(this.pointLight1)
    }

    setFog()
    {
        this.scene.fog = new THREE.Fog('#adadad', 30, 300000)
    }

    setBackground()
    {
        this.scene.background = new THREE.Color( '#adadad' )
    }

    setEnvironmentMap()
    {
        this.environmentMap = {}
        this.environmentMap.intensity = 0.5
        this.environmentMap.texture = this.resources.items.environmentMapTexture
        this.environmentMap.texture.encoding = THREE.sRGBEncoding

        console.log(this.environmentMap)
        this.scene.environment = this.environmentMap.texture

        this.setEnvironmentMap.updateMaterials = () =>
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

        this.setEnvironmentMap.updateMaterials()
    }
}