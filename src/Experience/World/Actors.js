import * as THREE from 'three'
import { gsap } from 'gsap'
import { TweenLite } from 'gsap/gsap-core'

export default class Actors
{
    constructor(experience)
    {
        this.experience = experience
        this.resources = this.experience.resources
        this.debug = this.experience.debug
        this.audio = this.experience.world.audio
        this.particles = this.experience.world.particles
        this.environment = this.experience.world.environment
        this.interactiveObjects = this.experience.world.interactiveObjects
        this.scene = this.experience.scene

        this.params = {
            weather: false,
            indefiniteRain: false,
            weatherFollowsYou: false,
            rainFrequency: 1000,
            weatherClearFrequency: 100,
            silentWeather: false,

            dayNightCycle: false,
            dayStart: 4500,
            dayLength: 10000,
            nightLength: 10000,
            pauseTime: false,
        }
        
        this.setup()
        this.setDebug()
    }

    setup()
    {
        this.weatherCounter = 0
        this.rain = false
        if(this.params.indefiniteRain === true)
        {
            this.rain = true
            this.audio.play('rain')
            this.particles.params.visible = true
        }
        if(this.params.weatherFollowsYou === false)
        {
            this.particles.staticPosition = true
        }

        this.dayCounter = this.params.dayStart
        this.nightCounter = 0
        this.day = true
    }

    // NOTE: not using delta
    update()
    {
        // Day night cycle counter
        // if(this.params.dayNightCycle === true && this.params.pauseTime === false)
        // {
        //     this.dayCounter ++

        //     if(this.dayCounter >= this.params.dayLength)
        //     {
        //         if(this.day === true)
        //         {
        //             this.day = false
        //             this.environment.nighttime()
        //         }
        //         else if(this.day === false)
        //         {
        //             this.day = true
        //             this.environment.daytime()
        //         }
        //         this.dayCounter = 0
        //     }
        // }

        // Weather Counter
        if( this.params.weather === true && this.params.pauseTime === false && this.params.indefiniteRain === false )
        {
            this.weatherCounter ++

            if(this.weatherCounter >= this.params.rainFrequency)
            {
                if(this.rain === false)
                {
                    this.rain = true
                    if(this.params.silentWeather === false)
                    {
                        console.log("hello")
                        this.audio.play('rain')
                    }
                    this.particles.params.visible = true
                }
                else if(this.rain === true)
                {
                    this.rain = false
                    if(this.params.silentWeather === false)
                    {
                        this.audio.pause('rain')
                    }
                    this.particles.params.visible = false
                }
                this.weatherCounter = 0
                
            }
        }
    }

    setDebug()
    {
        if( this.debug.active )
        {
            this.debugFolder = this.debug.environmentDebugFolder.addFolder('Weather')
            this.debugFolder.close()
            this.debugFolder.add( this.params, 'weather' ).name('Weather')
            this.debugFolder.add( this.params, 'rainFrequency' ).name('Rain Frequency')
            this.debugFolder.add( this.params, 'indefiniteRain' ).name('Toggle Rain')
            .onChange( () =>
            {
                if( this.params.indefiniteRain === false )
                {
                    this.params.indefiniteRain = false
                    this.audio.pause('rain')
                    this.particles.params.visible = false
                }
                else if( this.params.indefiniteRain === true )
                {
                    this.params.indefiniteRain = true
                    this.audio.play('rain')
                    this.particles.params.visible = true
                }
            })
            this.debugFolder.add( this.params, 'weatherFollowsYou' ).name('Weather Follows You?')
            .onChange( () =>
            {
                if( this.params.weatherFollowsYou === true )
                {
                    this.particles.staticPosition = false
                }
                else if( this.params.weatherFollowsYou === false )
                {
                    this.particles.staticPosition = true
                }
            })
            this.weatherPosDebugFolder = this.debugFolder.addFolder('Weather Position')
            this.weatherPosDebugFolder.close()
            this.weatherPosDebugFolder.add( this.particles.params, 'posX' )
            .name('X')
            .onChange( () =>
            {
                this.particles.rain.position.x = this.particles.params.posX
            })
            this.weatherPosDebugFolder.add( this.particles.params, 'posY' )
            .name('Y')
            .onChange( () =>
            {
                this.particles.rain.position.y = this.particles.params.posY
            })
            this.weatherPosDebugFolder.add( this.particles.params, 'posZ' )
            .name('Z')
            .onChange( () =>
            {
                this.particles.rain.position.z = this.particles.params.posZ
            })
        }
    }
}