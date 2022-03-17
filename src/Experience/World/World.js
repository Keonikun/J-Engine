import Environment from './Environment'
import Models from './Models'

import InteractiveObjects from './InteractiveObjects'
import AnimatedPlains from './AnimatedPlains'

export default class World
{
    constructor(experience)
    {
        this.experience = experience
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.experience.loadingFinished

        this.resources.on('ready', () =>
        {
            // Setup
            this.models = new Models(this.experience)
            this.interactiveObjects = new InteractiveObjects(this.experience)
            this.animatedPlains = new AnimatedPlains(this.experience)
            this.environemnt = new Environment(this.experience)  
            
            
            this.experience.loadingFinished = true
        })
    }

    update()
    {  
        if(this.experience.loadingFinished === true)
        {
            // Animations 
            this.animatedPlains.update()
        }
    }
}