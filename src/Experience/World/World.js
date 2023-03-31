import Environment from './Environment'
import Models from './Models'
import AnimatedTextures from './AnimatedTextures'
import EventEmitter from '../Utils/EventEmitter'
import Particles from './Particles'

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
        if(this.experience.loadingFinished === true)
        {
            // Animations 
            this.animatedTextures.update()
            this.particles.update()
        }
    }
}