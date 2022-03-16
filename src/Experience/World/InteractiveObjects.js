import { gsap } from 'gsap'

export default class InteractiveObjects
{
    constructor(experience)
    {
        this.experience = experience
        this.resources = this.experience.resources
        this.firstPersonControls = this.experience.firstPersonControls

        // Setup
        this.door = this.experience.world.models.door
        this.door.scene.children.forEach(element =>
        {
            element.children.forEach(element =>
                {
                    // IMPORTANT: first 4 elements determine object type,
                    // while numbers after determine object ID
                    element.name = 'door1'
                })
        })

        this.interactionTrigger()
    }

    interactionTrigger()
    {
        this.firstPersonControls.on('interaction', () =>
        {
            this.firstPersonControls.camRayIntersect.forEach(element =>
            {
                this.interactionType = element.object.name.substring(0,4)
                this.interactionID = element.object.name.substring(4,10)

                // Triggrer Door Interaction
                if(this.interactionType === 'door')
                {
                    this.doorInteraction()
                }
            })
        })
        
    }

    doorInteraction()
    {

    }
}