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
            rainFrequency: 4500,
            trainFrequency: 2000,
            dayLength: 10000,
            dayColor: this.environment.params.backgroundCol
        }

        
        this.setNpc1()
        this.setTrain()
        this.setWeather()
        this.setDayNightCycle()
    }

    setNpc1()
    {
        
    }

    setTrain()
    {
        this.trainCounter = 1000
        this.trainActive = false
    }

    setWeather()
    {
        this.weatherCounter = 0
        this.rain = false
    }

    setDayNightCycle()
    {
        this.dayCounter = 4500
        this.day = true
    }

    update()
    {
        this.weatherCounter ++
        this.trainCounter ++
        this.dayCounter ++
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
        if(this.trainCounter >= this.params.trainFrequency)
        {
            if(this.trainActive === false)
            {
                this.interactiveObjects.triggerTrainArms()
                gsap.delayedCall(3, () =>
                {
                    this.audio.play('train')
                })
                this.trainActive = true
                this.audio.play('trainCrossing')
            }
            else if(this.trainActive === true)
            {
                this.trainActive = false
                this.audio.pause('train')
                gsap.delayedCall(3, () =>
                {
                    this.audio.pause('trainCrossing')
                    this.interactiveObjects.triggerTrainArms()
                })
            }
            this.trainCounter = 0
        }
        
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
}