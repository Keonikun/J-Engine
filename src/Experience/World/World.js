import Environment from './Environment'
import Models from './Models'
import { gsap } from 'gsap'
import InteractiveObjects from './InteractiveObjects'
import AnimatedPlains from './AnimatedPlains'
import Reticle from './Reticle'
import Particles from './Particles'
import Audio from './Audio'
import TimedEvents from './TimedEvents'
import Path from './Path'
import FirstPersonCollisions from './FirstPerson/FirstPersonCollisions'
import FirstPersonControls from './FirstPerson/FirstPersonControls'


export default class World
{
    constructor(experience)
    {
        this.experience = experience
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.experience.loadingFinished
        this.camera = this.experience.camera.instance
        this.firstPersonCollisions = new FirstPersonCollisions(this.experience)
        this.firstPersonControls = new FirstPersonControls(this.experience)

      
        this.timedEvents = new TimedEvents(this.experience)
        this.path = new Path(this.experience)
        // this.reticle = new Reticle(this.experience)

        this.resources.on('ready', () =>
        {
            // Setup
            this.models = new Models(this.experience)
            this.interactiveObjects = new InteractiveObjects(this.experience)
            this.animatedPlains = new AnimatedPlains(this.experience)
            this.environemnt = new Environment(this.experience)  
            this.audio = new Audio(this.experience)
            this.particles = new Particles(this.experience)

            // Loading Sequence
            this.experience.loadingFinished = true
            this.experience.birdsEyeEnabled = false

            this.camera.position.set( 4.1, 1.7, -5 )
            this.camera.rotation.x = 0
            this.camera.rotation.y = Math.PI * 2
            document.querySelector(".enterButton").classList.remove("hide")
            document.querySelector(".whiteScreen").classList.add("hide")
            
            // Begin Animations
            this.models.playAnimation("drawerAnimation")

            gsap.delayedCall(0.5, () =>
            {
                
                this.firstPersonCollisions.player.collisionsEnabled = true
                this.firstPersonControls.player.controlsEnabled = true
                this.firstPersonCollisions.player.gravityEnabled = true
                
                document.querySelector(".loading").classList.add("hide")
            })
        })
    }

    update()
    {  
        if(this.experience.loadingFinished === true)
        {
            this.animatedPlains.update()
            this.audio.update()
            this.timedEvents.update()
            this.models.update()
            this.particles.update()
            this.firstPersonCollisions.update()
            this.firstPersonControls.update()
            this.path.updatePathPosition()
            // this.reticle.update()
        }
    }
}