import { gsap } from 'gsap'
import Environment from './Environment.js'
import Models from './Models.js'
import Shaders from './Shaders.js'
import EventEmitter from '../Utils/EventEmitter.js'
import Particles from './Particles.js'
import Audio from './Audio.js'
import InteractiveObjects from './InteractiveObjects.js'
import FirstPerson from './FirstPerson.js'
import Actors from './Actors.js'

export default class World extends EventEmitter
{
    constructor(experience)
    {
        super()

        this.experience = experience
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.renderer = this.experience.renderer

        //Control Options
        this.FPControls= false
        this.FPCollisions = false
        this.FPArrows = false

        this.resources.on('ready', () =>
        {
            // Setup
            this.models = new Models(this.experience)
            this.shaders = new Shaders(this.experience)
            this.audio = new Audio(this.experience)
            this.environment = new Environment(this.experience)  
            this.particles = new Particles(this.experience)
            
            gsap.delayedCall(1,() =>
            {
                this.interactiveObjects = new InteractiveObjects(this.experience)
                this.actors = new Actors(this.experience)
                this.firstPerson = new FirstPerson(this.experience)

                // Enable desired controls
                this.FPCollisions = true
                this.FPControls = true
                this.trigger('ready')
            })
        })
    }

    update()
    {  
        if(this.experience.worldLoaded === true)
        {
            // Animations 
            this.shaders.update()
            this.particles.update()
            this.interactiveObjects.update()
            this.firstPerson.update()
            this.actors.update()
        }
    }
}