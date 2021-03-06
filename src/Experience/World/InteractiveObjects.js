import { gsap } from 'gsap'

export default class InteractiveObjects
{
    constructor(experience)
    {
        this.experience = experience
        this.resources = this.experience.resources
        this.firstPersonControls = this.experience.world.firstPersonControls

        // Setup
        this.doorSpeed = 1.5

        // Model Setup

        this.interactionTrigger()
    }

    interactionTrigger()
    {
        this.firstPersonControls.on('interaction', () =>
        {
            this.interactionElement = this.firstPersonControls.camRayIntersect[0]
            this.interactionType = this.interactionElement.object.name.substring(0,4)
            this.interactionID = this.interactionElement.object.name.substring(4,10)

            // Door Interaction Trigger
            if(this.interactionType === 'door')
            {
                this.doorInteraction()
            }
        })
        
    }

    doorInteraction()
    {
        this.currentDoor = eval("this." + this.interactionType + this.interactionID)
        if(this.currentDoor.isOpen === false && this.currentDoor.isMoving === false)
        {
            // Set open state to true
            this.currentDoor.isOpen = true
            // Disallow interaction while active
            this.currentDoor.isMoving = true
            // Set rotation target and rotate
            this.rotationTarget = this.currentDoor.scene.rotation.y + Math.PI * 0.5
            gsap.to(this.currentDoor.scene.rotation, 
            {y: this.rotationTarget, duration: this.doorSpeed, onComplete: () => 
                {
                    this.currentDoor.isMoving = false
                }
            }) 
        }
        else if(this.currentDoor.isOpen === true && this.currentDoor.isMoving === false)
        {
            // Set open state to false
            this.currentDoor.isOpen = false
            // Disallow interaction while active
            this.currentDoor.isMoving = true
            // Set rotation target and rotate
            this.rotationTarget = this.currentDoor.scene.rotation.y - Math.PI * 0.5
            gsap.to(this.currentDoor.scene.rotation, 
            {y: this.rotationTarget, duration: this.doorSpeed, onComplete: () => 
                {
                    this.currentDoor.isMoving = false
                }
            }) 
        }
    }
}