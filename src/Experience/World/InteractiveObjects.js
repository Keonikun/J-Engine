import { gsap } from 'gsap'

export default class InteractiveObjects
{
    constructor(experience)
    {
        this.experience = experience
        this.resources = this.experience.resources
        this.textAdventure = this.experience.textAdventure
        this.firstPerson = this.experience.firstPerson
        this.audio = this.experience.world.audio
        this.time = this.experience.time

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
            if(element.name === "door2")
            {
                this.door2 = element
            }
            if(element.name === "door3")
            {
                this.door3 = element
            }
            if(element.name === "door4")
            {
                this.door4 = element
            }
            if(element.name === "doorSewer1")
            {
                this.doorSewer1 = element
            }
            if(element.name === "doorSewer2")
            {
                this.doorSewer2 = element
            }
            if(element.name === "doorChain1")
            {
                this.doorChain1 = element
            }
            if(element.name === "doorChain2")
            {
                this.doorChain2 = element
            }
            if(element.name === "gate1")
            {
                this.gate1 = element
            }
            if(element.name === "gate2")
            {
                this.gate2 = element
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

        this.doors = [] 

        this.door1.interactive = true
        this.door1.interactionType = "door"
        this.door1.doorState = false
        this.door1.doorSwing = "inwards"
        this.door1.doorOpen = false
        this.door1.doorActive = false
        this.door1.rotationOrigin = this.door1.rotation.y
        this.doors.push(this.door1)

        this.door2.name = 'door2'
        this.door2.interactive = true
        this.door2.interactionType = "door"
        this.door2.doorState = false
        this.door2.doorSwing = "inwards"
        this.door2.doorOpen = false
        this.door2.doorActive = false
        this.door2.rotationOrigin = this.door2.rotation.y
        this.doors.push(this.door2)

        this.door3.name = 'door3'
        this.door3.interactive = true
        this.door3.interactionType = "door"
        this.door3.doorState = false
        this.door3.doorSwing = "inwards"
        this.door3.doorOpen = false
        this.door3.doorActive = false
        this.door3.rotationOrigin = this.door3.rotation.y
        this.doors.push(this.door3)

        this.door4.name = 'door4'
        this.door4.interactive = true
        this.door4.interactionType = "door"
        this.door4.doorState = false
        this.door4.doorSwing = "inwards"
        this.door4.doorOpen = false
        this.door4.doorActive = false
        this.door4.rotationOrigin = this.door4.rotation.y
        this.doors.push(this.door4)

        this.doorSewer1.name = 'doorSewer1'
        this.doorSewer1.interactive = true
        this.doorSewer1.interactionType = "door"
        this.doorSewer1.doorState = false
        this.doorSewer1.doorSwing = "inwards"
        this.doorSewer1.doorOpen = false
        this.doorSewer1.doorActive = false
        this.doorSewer1.rotationOrigin = this.doorSewer1.rotation.y
        this.doors.push(this.doorSewer1)

        this.doorSewer2.name = 'doorSewer2'
        this.doorSewer2.interactive = true
        this.doorSewer2.interactionType = "door"
        this.doorSewer2.doorState = false
        this.doorSewer2.doorSwing = "inwards"
        this.doorSewer2.doorOpen = false
        this.doorSewer2.doorActive = false
        this.doorSewer2.rotationOrigin = this.doorSewer2.rotation.y
        this.doors.push(this.doorSewer2)

        this.doorChain1.interactive = true
        this.doorChain1.interactionType = "door"
        this.doorChain1.doorState = false
        this.doorChain1.doorSwing = "inwards"
        this.doorChain1.doorOpen = false
        this.doorChain1.doorActive = false
        this.doorChain1.rotationOrigin = this.doorChain1.rotation.y
        this.doors.push(this.doorChain1)

        this.doorChain2.interactive = true
        this.doorChain2.interactionType = "door"
        this.doorChain2.doorState = false
        this.doorChain2.doorSwing = "inwards"
        this.doorChain2.doorOpen = false
        this.doorChain2.doorActive = false
        this.doorChain2.rotationOrigin = this.doorChain2.rotation.y
        this.doors.push(this.doorChain2)

        this.gate1.interactive = true
        this.gate1.interactionType = "door"
        this.gate1.doorState = false
        this.gate1.doorSwing = "inwards"
        this.gate1.doorOpen = false
        this.gate1.doorActive = false
        this.gate1.rotationOrigin = this.gate1.rotation.y
        this.doors.push(this.gate1)

        this.gate2.interactive = true
        this.gate2.interactionType = "door"
        this.gate2.doorState = false
        this.gate2.doorSwing = "inwards"
        this.gate2.doorOpen = false
        this.gate2.doorActive = false
        this.gate2.rotationOrigin = this.gate2.rotation.y
        this.doors.push(this.gate2)

        this.npcs = []

        this.npc1.interactive = true
        this.npc1.interactionType = "npc"
        this.npc1.event = 3
        this.npcs.push(this.npc1)

        this.objects = []

        this.key1.interactive = true
        this.key1.interactionType = "item"
        this.objects.push(this.key1)
    }

    trigger(object)
    {
        if(object.interactionType === "npc")
        {
            document.querySelector('.experienceContainer').classList.remove('navBoxHidden')
            document.querySelector('.experienceContainer').classList.add('navBoxDefault')
            this.firstPerson.pointerLockControls.unlock()
            this.textAdventure.dialogueFocused = true
            this.textAdventure.triggerEvent(object.event)
        }
        if(object.interactionType === "door" && object.doorActive === false)
        {
            object.doorState = true
            object.doorActive = true
            if(object.doorOpen === false)
            {
                this.audio.play("doorOpen")
            }
            if(object.doorOpen === true)
            {
                this.audio.play("doorClose")
            }
        }
    }

    update()
    {
        this.doors.forEach(element => {
            if(element.doorState === true)
            {
                if(element.doorOpen === false)
                {
                    if(element.rotation.y > element.rotationOrigin - Math.PI * 0.5)
                    {
                        element.rotation.y -= ( 0.04 / this.time.currentFps * 60  )
                    }
                    else
                    {
                        element.doorState = false
                        element.doorActive = false
                        element.doorOpen = true
                    }
                }
                else if(element.doorOpen === true)
                {
                    if(element.rotation.y < element.rotationOrigin)
                    {
                        element.rotation.y += ( 0.04 / this.time.currentFps * 60  )
                    }
                    else
                    {
                        element.doorState = false
                        element.doorActive = false
                        element.doorOpen = false
                    }
                }
            }
        })
    }
}