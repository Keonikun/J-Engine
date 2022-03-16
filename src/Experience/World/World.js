import Environment from './Environment'
import Models from './Models'

export default class World
{
    constructor(experience)
    {
        this.experience = experience
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.experience.loadingFinished
        this.currentYear = this.experience.currentYear

        this.resources.on('ready', () =>
        {
            // Setup
            this.models = new Models(this.experience)
            this.environemnt = new Environment(this.experience)  
            
            
            this.experience.loadingFinished = true
        })
    }

    update()
    {  
        if(this.experience.loadingFinished === true)
        {
            // Update Model Animations Here
        }
    }
}