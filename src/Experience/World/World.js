import { gsap } from 'gsap'
import Environment from './Environment.js'
import Models from './Models.js'
import AnimatedTextures from './AnimatedTextures.js'
import EventEmitter from '../Utils/EventEmitter.js'
import Particles from './Particles.js'
import Audio from './Audio.js'
import InteractiveObjects from './InteractiveObjects.js'
import FirstPerson from './FirstPerson.js'
import Characters from './Characters.js'
import CssObjects from './CssObjects.js'

export default class World extends EventEmitter
{
    constructor(experience)
    {
        super()

        this.experience = experience
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        // this.cssObjects = new CssObjects(this.experience)

        //Control Options
        this.FPControls= false
        this.FPCollisions = false
        this.FPArrows = false

        this.resources.on('ready', () =>
        {
            // Setup
            this.models = new Models(this.experience)
            this.animatedTextures = new AnimatedTextures(this.experience)
            this.audio = new Audio(this.experience)
            this.environment = new Environment(this.experience)  
            this.particles = new Particles(this.experience)
            
            gsap.delayedCall(1,() =>
            {
                this.interactiveObjects = new InteractiveObjects(this.experience)
                this.characters = new Characters(this.experience)
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
            this.animatedTextures.update()
            this.particles.update()
            this.interactiveObjects.update()
            this.firstPerson.update()
            this.characters.update()
        }
    }
}