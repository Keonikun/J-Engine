import { gsap } from 'gsap'

export default class InteractiveObjects
{
    constructor(experience)
    {
        this.experience = experience
        this.resources = this.experience.resources
        this.textAdventure = this.experience.textAdventure
        this.firstPerson = this.experience.firstPerson

        this.physMesh = this.experience.world.models.physMesh

        // Setup
        this.doorSpeed = 1.5
        
        this.setup()
    }

    setup()
    {
        this.physMesh.scene.children.forEach(element => {
            if(element.name === "door1")
            {
                this.door1 = element
            }
            if(element.name === "npc")
            {
                this.npc1 = element
            }
            if(element.name === "key")
            {
                this.key1 = element
            }
        });

        this.door1.interactive = true
        this.door1.interactionType = "door"
        this.door1.doorState = false
        this.npc1.interactive = true
        this.npc1.interactionType = "npc"
        this.npc1.event = 3
        this.key1.interactive = true
        this.key1.interactionType = "item"
    }

    trigger(object)
    {
        if(object.interactionType === "npc")
        {
            document.querySelector('.experienceContainer').classList.remove('navBoxHidden')
            document.querySelector('.experienceContainer').classList.add('navBoxDefault')
            this.firstPerson.pointerLockControls.unlock()
            this.textAdventure.triggerEvent(object.event)
        }
    }
}