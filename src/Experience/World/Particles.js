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

        this.params = {
            rainEnabled: false,
            rainDropCount: 2000,
            rainDropSpeed: 0.16,
            rainDropColor: '#3a3489',
            rainDropSize: 0.8,
            rainSimDistance: 20,
            rainHeightSpawn: 40,
            rainHeightDeath: -20,
            windX: 0,
            windZ: 0
        }

        if(this.params.rainEnabled === true)
        {
            this.setRain()
        }

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
        this.scene.add(this.rain)
    }

    update()
    {
        if(this.params.rainEnabled === true && this.experience.worldLoaded === true)
        {
            this.rainAnimPositions = this.rain.geometry.attributes.position.array
            for( let i = 0; i < this.params.rainDropCount * 3; i+=3 )
            {
                // Wind direction
                this.rainAnimPositions[i] -= this.params.windX
                this.rainAnimPositions[i+2] -= this.params.windZ

                // Rain fall speed
                this.rainAnimPositions[i+1] -= this.params.rainDropSpeed + Math.random() * 0.1
                if( this.rainAnimPositions[i+1] < (this.params.rainHeightDeath * Math.random()))
                {
                    this.rainAnimPositions[i+1] = this.params.rainHeightSpawn
                }

                // reset particles affected by wind
                if(this.rainAnimPositions[i] > this.params.rainSimDistance || this.rainAnimPositions[i] < (-1 * this.params.rainSimDistance) || this.rainAnimPositions[i+2] > this.params.rainSimDistance || this.rainAnimPositions[i+2] < (-1 * this.params.rainSimDistance))
                {
                    this.rainAnimPositions[i] = Math.random() * (this.params.rainSimDistance * 2) - this.params.rainSimDistance
                    this.rainAnimPositions[i+1] = this.params.rainHeightSpawn
                    this.rainAnimPositions[i+2] = Math.random() * (this.params.rainSimDistance * 2) - this.params.rainSimDistance
                }
                this.rain.geometry.attributes.position.needsUpdate = true
            }

            // Update particle size when looking up
            this.camX = this.experience.firstPerson.pointerLockControls.eulerX
            if(this.camX > 0 && this.camX < Math.PI * 0.5)
            {
                this.rain.material.size = this.params.rainDropSize - (this.params.rainDropSize * ( this.camX / (Math.PI * 0.7)))
            }

            this.rain.position.x = this.camera.position.x - Math.pow(this.params.windX, 2) * 2
            this.rain.position.z = this.camera.position.z - Math.pow(this.params.windZ, 2) * 2
        }
    }

    setDebug()
    {
        if(this.debug.active)
        {
            this.debugFolder = this.debug.gui.addFolder('Particles')
            this.debugFolder.add(this.params, 'rainEnabled').onChange(() =>
            {
                if(this.params.rainEnabled === true)
                {
                    this.setRain()
                }
                else
                {
                    this.rain.geometry.dispose()
                    this.rain.material.dispose()
                    this.scene.remove(this.rain)
                }
            })
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
            this.debugFolder.add(this.params, 'rainSimDistance').onChange(() =>
            {
                if(this.params.rainEnabled)
                {
                    this.rain.geometry.dispose()
                    this.rain.material.dispose()
                    this.scene.remove(this.rain)
                    this.setRain()
                }
            })
            this.debugFolder.add(this.params, 'rainHeightSpawn', 0, 100)
            this.debugFolder.add(this.params, 'rainHeightDeath', -100, 0)
            this.debugFolder.add(this.params, 'windX', -0.2, 0.2)
            this.debugFolder.add(this.params, 'windZ', -0.2, 0.2)
            this.debugFolder.close()     
        }
    }
}