import { gsap } from 'gsap'

export default class InteractiveObjects
{
    constructor(experience)
    {
        this.experience = experience
        this.resources = this.experience.resources
        this.textAdventure = this.experience.textAdventure
        this.audio = this.experience.world.audio
        this.time = this.experience.time

        this.physMesh = this.experience.world.models.physMesh

        // Setup
        this.doorSpeed = 1.5

        this.experience.world.on('ready', () =>
        {
            this.firstPerson = this.experience.world.firstPerson
        })
        
        this.setup()
    }

    setup()
    {
        this.doorOpening = false
        this.readyToOpen = true
        this.physMesh.children.forEach(element => {
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
            if(element.name === "apartmentDoor1")
            {
                this.apartmentDoor1 = element
            }
            if(element.name === "apartmentDoor2")
            {
                this.apartmentDoor2 = element
            }
            if(element.name === "apartmentDoor3")
            {
                this.apartmentDoor3 = element
            }
            if(element.name === "apartmentDoor4")
            {
                this.apartmentDoor4 = element
            }
            if(element.name === "apartmentDoor6")
            {
                this.apartmentDoor6 = element
            }
            if(element.name === "churchDoor")
            {
                this.chuchDoor = element
            }
            if(element.name === "door5")
            {
                this.door5 = element
            }
            if(element.name === "undergroundDoor2")
            {
                this.undergroundDoor2 = element
            }
            if(element.name === "undergroundDoor3")
            {
                this.undergroundDoor3 = element
            }
            if(element.name === "undergroundDoor1")
            {
                this.undergroundDoor1 = element
            }
            if(element.name === "doorSewer1")
            {
                this.doorSewer1 = element
            }
            if(element.name === "doorSewer2")
            {
                this.doorSewer2 = element
            }
            if(element.name === "doorSewer3")
            {
                this.doorSewer3 = element
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
            if(element.name === "gardenGate")
            {
                this.gardenGate = element
            }
            if(element.name === "npc")
            {
                this.npc1 = element
            }
            if(element.name === "well")
            {
                this.well = element
            }
            if(element.name === "corner")
            {
                this.corner = element
            }
            if(element.name === "Intercom")
            {
                this.intercom = element
            }
            if(element.name === "crackFigure")
            {
                this.crackFigure = element
            }
            if(element.name === "crackFigure")
            {
                this.crackFigure = element
            }
            if(element.name === "crossWall1")
            {
                this.crossWall1 = element
            }
            if(element.name === "crossWall2")
            {
                this.crossWall2 = element
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

        this.door2.interactive = true
        this.door2.interactionType = "door"
        this.door2.doorState = false
        this.door2.doorSwing = "inwards"
        this.door2.doorOpen = false
        this.door2.doorActive = false
        this.door2.rotationOrigin = this.door2.rotation.y
        this.doors.push(this.door2)

        this.door3.interactive = true
        this.door3.interactionType = "door"
        this.door3.doorState = false
        this.door3.doorSwing = "inwards"
        this.door3.doorOpen = false
        this.door3.doorActive = false
        this.door3.rotationOrigin = this.door3.rotation.y
        this.doors.push(this.door3)

        this.door4.interactive = true
        this.door4.interactionType = "door"
        this.door4.doorState = false
        this.door4.doorSwing = "inwards"
        this.door4.doorOpen = false
        this.door4.doorActive = false
        this.door4.rotationOrigin = this.door4.rotation.y
        this.doors.push(this.door4)

        this.door5.interactive = true
        this.door5.interactionType = "door"
        this.door5.doorState = false
        this.door5.doorSwing = "inwards"
        this.door5.doorOpen = false
        this.door5.doorActive = false
        this.door5.rotationOrigin = this.door5.rotation.y
        this.doors.push(this.door5)

        this.undergroundDoor2.interactive = true
        this.undergroundDoor2.interactionType = "door"
        this.undergroundDoor2.doorState = false
        this.undergroundDoor2.doorSwing = "inwards"
        this.undergroundDoor2.doorOpen = false
        this.undergroundDoor2.doorActive = false
        this.undergroundDoor2.rotationOrigin = this.undergroundDoor2.rotation.y
        this.doors.push(this.undergroundDoor2)

        this.undergroundDoor3.interactive = true
        this.undergroundDoor3.interactionType = "door"
        this.undergroundDoor3.doorState = false
        this.undergroundDoor3.doorSwing = "inwards"
        this.undergroundDoor3.doorOpen = false
        this.undergroundDoor3.doorActive = false
        this.undergroundDoor3.rotationOrigin = this.undergroundDoor3.rotation.y
        this.doors.push(this.undergroundDoor3)

        this.chuchDoor.interactive = true
        this.chuchDoor.interactionType = "door"
        this.chuchDoor.doorState = false
        this.chuchDoor.doorSwing = "inwards"
        this.chuchDoor.doorOpen = false
        this.chuchDoor.doorActive = false
        this.chuchDoor.rotationOrigin = this.chuchDoor.rotation.y
        this.doors.push(this.chuchDoor)

        /**
         * APARTMENT BUILDING
         */

        this.apartmentDoor1.interactive = true
        this.apartmentDoor1.interactionType = "door"
        this.apartmentDoor1.doorState = false
        this.apartmentDoor1.doorSwing = "inwards"
        this.apartmentDoor1.doorOpen = false
        this.apartmentDoor1.doorActive = false
        this.apartmentDoor1.rotationOrigin = this.apartmentDoor1.rotation.y
        this.doors.push(this.apartmentDoor1)

        this.apartmentDoor2.interactive = true
        this.apartmentDoor2.interactionType = "door"
        this.apartmentDoor2.doorState = false
        this.apartmentDoor2.doorSwing = "inwards"
        this.apartmentDoor2.doorOpen = false
        this.apartmentDoor2.doorActive = false
        this.apartmentDoor2.rotationOrigin = this.apartmentDoor2.rotation.y
        this.doors.push(this.apartmentDoor2)

        this.apartmentDoor3.interactive = true
        this.apartmentDoor3.interactionType = "door"
        this.apartmentDoor3.doorState = false
        this.apartmentDoor3.doorSwing = "inwards"
        this.apartmentDoor3.doorOpen = false
        this.apartmentDoor3.doorActive = false
        this.apartmentDoor3.rotationOrigin = this.apartmentDoor3.rotation.y
        this.doors.push(this.apartmentDoor3)

        this.apartmentDoor4.interactive = true
        this.apartmentDoor4.interactionType = "door"
        this.apartmentDoor4.doorState = false
        this.apartmentDoor4.doorSwing = "inwards"
        this.apartmentDoor4.doorOpen = false
        this.apartmentDoor4.doorActive = false
        this.apartmentDoor4.rotationOrigin = this.apartmentDoor4.rotation.y
        this.doors.push(this.apartmentDoor4)

        this.apartmentDoor6.interactive = true
        this.apartmentDoor6.interactionType = "door"
        this.apartmentDoor6.doorState = false
        this.apartmentDoor6.doorSwing = "inwards"
        this.apartmentDoor6.doorOpen = false
        this.apartmentDoor6.doorActive = false
        this.apartmentDoor6.rotationOrigin = this.apartmentDoor6.rotation.y
        this.doors.push(this.apartmentDoor6)

        /**
         * Train Crossing Arms
         */

        this.crossWall1.interactionType = "trainArm"
        this.crossWall1.doorState = false
        this.crossWall1.doorSwing = "inwards"
        this.crossWall1.doorOpen = false
        this.crossWall1.doorActive = false
        this.crossWall1.rotationOrigin = this.crossWall1.rotation.x

        this.crossWall2.interactionType = "trainArm"
        this.crossWall2.doorState = false
        this.crossWall2.doorSwing = "inwards"
        this.crossWall2.doorOpen = false
        this.crossWall2.doorActive = false
        this.crossWall2.rotationOrigin = this.crossWall2.rotation.x

        this.trainCrossing = false

        /**
         *  SEWERS
         */

        this.doorSewer1.interactive = true
        this.doorSewer1.interactionType = "door"
        this.doorSewer1.doorState = false
        this.doorSewer1.doorSwing = "inwards"
        this.doorSewer1.doorOpen = false
        this.doorSewer1.doorActive = false
        this.doorSewer1.rotationOrigin = this.doorSewer1.rotation.y
        this.doors.push(this.doorSewer1)

        this.doorSewer2.interactive = true
        this.doorSewer2.interactionType = "door"
        this.doorSewer2.doorState = false
        this.doorSewer2.doorSwing = "inwards"
        this.doorSewer2.doorOpen = false
        this.doorSewer2.doorActive = false
        this.doorSewer2.rotationOrigin = this.doorSewer2.rotation.y
        this.doors.push(this.doorSewer2)

        this.doorSewer3.interactive = true
        this.doorSewer3.interactionType = "door"
        this.doorSewer3.doorState = false
        this.doorSewer3.doorSwing = "inwards"
        this.doorSewer3.doorOpen = false
        this.doorSewer3.doorActive = false
        this.doorSewer3.rotationOrigin = this.doorSewer3.rotation.y
        this.doors.push(this.doorSewer3)

        this.undergroundDoor1.interactive = true
        this.undergroundDoor1.interactionType = "door"
        this.undergroundDoor1.doorState = false
        this.undergroundDoor1.doorSwing = "inwards"
        this.undergroundDoor1.doorOpen = false
        this.undergroundDoor1.doorActive = false
        this.undergroundDoor1.rotationOrigin = this.undergroundDoor1.rotation.y
        this.doors.push(this.undergroundDoor1)

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

        this.gate1.interactive = false
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

        this.gardenGate.interactive = true
        this.gardenGate.interactionType = "door"
        this.gardenGate.doorState = false
        this.gardenGate.doorSwing = "inwards"
        this.gardenGate.doorOpen = false
        this.gardenGate.doorActive = false
        this.gardenGate.rotationOrigin = this.gardenGate.rotation.y
        this.doors.push(this.gardenGate)

        this.npcs = []

        this.npc1.interactive = true
        this.npc1.interactionType = "npc"
        this.npc1.event = 3
        this.npcs.push(this.npc1)

        this.intercom.interactive = true
        this.intercom.interactionType = "npc"
        this.intercom.event = 6
        this.npcs.push(this.intercom)

        this.objects = []

        // this.key1.interactive = true
        // this.key1.interactionType = "item"
        // this.objects.push(this.key1)
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
            this.doorOpening = true
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

    triggerThis(object)
    {
        if( eval('this.' + object).interactionType === "door" &&  eval('this.' + object).doorActive === false)
        {
            eval('this.' + object).doorState = true
            eval('this.' + object).doorActive = true
            this.doorOpening = true
            if(eval('this.' + object).doorOpen === false)
            {
                this.audio.play("doorOpen")
            }
            if(eval('this.' + object).doorOpen === true)
            {
                this.audio.play("doorClose")
            }
        }
    }

    triggerTrainArms()
    {
        this.trainCrossing = true
    }

    update()
    {
        if(this.doorOpening === true)
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
                            this.doorOpening = false
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
                            this.doorOpening = false
                        }
                    }
                }
            })
        }

        if(this.trainCrossing === true)
        {
            if(this.crossWall1.doorOpen === true)
            {
                
                if(this.crossWall1.rotation.x > this.crossWall1.rotationOrigin)
                {
                    this.crossWall1.rotation.x -= ( 0.02 / this.time.currentFps * 60  )
                    this.crossWall2.rotation.x += ( 0.02 / this.time.currentFps * 60  )
                }
                else
                {
                    this.trainCrossing = false
                    this.crossWall1.doorOpen = false
                }
            }
            
            else if(this.crossWall1.doorOpen === false)
            {
                if(this.crossWall1.rotation.x < this.crossWall1.rotationOrigin + Math.PI * 0.5)
                {
                    this.crossWall1.rotation.x += ( 0.02 / this.time.currentFps * 60  )
                    this.crossWall2.rotation.x -= ( 0.02 / this.time.currentFps * 60  )
                }
                else
                {
                    this.trainCrossing = false
                    this.crossWall1.doorOpen = true
                }
            }

        }
    }
}