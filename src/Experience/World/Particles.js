import * as THREE from 'three'

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
            rainDropCount: 50,
            rainDropSpeed: 0.1,
            rainDropColor: '#ffffff',
            rainDropSize: 0.2,
            rainSimDistance: 0.1,
            rainHeightSpawn: 40,
            rainHeightDeath: -20,
            windX: 0,
            windZ: 0,
            visible: false,

            posX: -4,
            posY: -0,
            posZ: -4.2
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
            this.rainArray[i + 1] = Math.random() * this.params.rainHeightSpawn
            this.rainArray[i + 2] = Math.random() * (this.params.rainSimDistance * 2) - this.params.rainSimDistance
        }

        this.rainGeo.setAttribute( 'position', new THREE.BufferAttribute( this.rainArray, 3 ))

        this.rainMat = new THREE.PointsMaterial({
            map: this.resources.items.rainTexture,
            color: this.params.rainDropColor,
            size: this.params.rainDropSize,
            sizeAttenuation: true,
            transparent: true,
            
        })

        this.rain = new THREE.Points(this.rainGeo, this.rainMat)
        this.rain.position.set(this.params.posX, this.params.posY, this.params.posZ)
        this.scene.add(this.rain)
    }

    update()
    {
        if(this.params.visible === true)
        {
            if(this.params.rainEnabled === true && this.experience.worldLoaded === true)
            {
                this.rainAnimPositions = this.rain.geometry.attributes.position.array
                for( let i = 0; i < this.params.rainDropCount * 3; i+=3 )
                {
                    // Rain fall speed
                    this.rainAnimPositions[i+1] -= this.params.rainDropSpeed + Math.random() * 0.1
                    if( this.rainAnimPositions[i+1] < (this.params.rainHeightDeath * Math.random()))
                    {
                        this.rainAnimPositions[i+1] = this.params.rainHeightSpawn
                    }
                    this.rain.geometry.attributes.position.needsUpdate = true
                }

                // Update particle size when looking up -- prevent spaghetti rain
                if(this.experience.worldLoaded === true)
                {
                    this.camX = this.experience.world.firstPerson.pointerLockControls.eulerX
                    if(this.camX > 0 && this.camX < Math.PI * 0.5)
                    {
                        this.rain.material.size = this.params.rainDropSize - (this.params.rainDropSize * ( this.camX / (Math.PI * 0.7)))
                    }
                }
                
                if(this.staticPosition === false)
                {
                    this.rain.position.y = this.camera.position.y 
                    this.rain.position.x = this.camera.position.x
                    this.rain.position.z = this.camera.position.z 
                }
            }
        }
        else if(this.params.visible === false)
        {
            this.rain.position.y = 1000
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