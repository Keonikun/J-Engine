import Environment from './Environment.js'
import Models from './Models.js'
import AnimatedTextures from './AnimatedTextures.js'
import EventEmitter from '../Utils/EventEmitter.js'
import Particles from './Particles.js'
import Audio from './Audio.js'
import InteractiveObjects from './InteractiveObjects.js'

export default class World extends EventEmitter
{
    constructor(experience)
    {
        super()

        this.experience = experience
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        //Control Options
        this.FPControls= false
        this.FPCollisions = false
        this.FPArrows = false

        this.resources.on('ready', () =>
        {
            // Setup
            this.models = new Models(this.experience)
            this.animatedTextures = new AnimatedTextures(this.experience)
            this.interactiveObjects = new InteractiveObjects(this.experience)
            this.audio = new Audio(this.experience)
            this.environemnt = new Environment(this.experience)  
            this.particles = new Particles(this.experience)

            // Enable desired controls
            this.FPCollisions = true
            this.FPControls = true
            this.FPArrows = true
            this.trigger('ready')
        })
    }

    update()
    {  
        if(this.experience.worldLoaded === true)
        {
            // Animations 
            this.animatedTextures.update()
            this.particles.update()
        }
    }
}