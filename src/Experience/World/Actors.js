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
            weatherFollowsYou: true,
            rainFrequency: 4500,
            train: false,
            trainFrequency: 2000,
            dayNightCycle: false,
            dayStart: 4500,
            dayLength: 10000,
            nightLength: 10000,
            pauseTime: false,
            dayColor: this.environment.params.backgroundCol,
            // nightColor:

            // Debug variables
            triggerDay: () => {this.triggerDay()},
            triggerNight: () => {this.triggerNight()},
            triggerRain: () => {this.triggerRain()},
            triggerTrain: () => {this.triggerTrain()}
        }
        
        this.setup()
        this.setDebug()
    }

    setup()
    {
        this.trainCounter = 1000
        this.trainActive = false

        this.weatherCounter = 0
        this.rain = false

        this.dayCounter = this.params.dayStart
        this.nightCounter = 0
        this.day = true
    }

    triggerDay()
    {

    }

    triggerNight()
    {

    }

    triggerRain()
    {

    }

    triggerTrain()
    {

    }

    // NOTE: not using delta
    update()
    {
        if(this.params.dayNightCycle === true && this.params.pauseTime === false)
        {
            this.dayCounter ++

            if(this.dayCounter >= this.params.dayLength)
            {
                if(this.day === true)
                {
                    this.day = false
                    this.environment.nighttime()
                }
                else if(this.day === false)
                {
                    this.day = true
                    this.environment.daytime()
                }
                this.dayCounter = 0
            }
        }
        if(this.params.weather === true && this.params.pauseTime === false)
        {
            this.weatherCounter ++

            if(this.weatherCounter >= this.params.rainFrequency)
            {
                if(this.rain === false)
                {
                    this.rain = true
                    this.audio.play('rain')
                    this.particles.params.visible = true
                }
                else if(this.rain === true)
                {
                    this.rain = false
                    this.audio.pause('rain')
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
            this.debugFolder = this.debug.gui.addFolder('Actors')
            this.debugFolder.add( this.params, 'dayNightCycle' )
            this.debugFolder.add( this.params, 'weather' )
            this.debugFolder.add( this.params, 'triggerNight' )
            this.debugFolder.add( this.params, 'triggerDay' )
            this.debugFolder.add( this.params, 'triggerRain' )
        }
    }
}