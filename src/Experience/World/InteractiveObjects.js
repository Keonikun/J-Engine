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
        this.layoutControl = this.experience.layoutControl
        this.camera = this.experience.camera
        this.models = this.experience.world.models

        this.params = {
            doorSpeed: 1.5
        }

        this.experience.world.on('ready', () =>
        {
            this.firstPerson = this.experience.world.firstPerson
        })
        
        this.setup()
    }

    setup()
    {  
        this.doorSpeed = 1.5
        this.doorOpening = false
        this.readyToOpen = true
        this.dynamicObjects = this.models.dynamicObjects
        
        this.doors = [] 
        this.npcs = []


        // SET DYNAMIC OBJECTS HERE
        this.dynamicObjectsArray = []

        this.dynamicObjects.children.forEach(element => {
            if(element.name === "monitor")
            {
                this.computer = element
                this.dynamicObjectsArray.push(this.computer)
            }
        })

        // set objects to be detectable dy first person raycast
        this.dynamicObjectsArray.forEach(element => {
            element.interactive = true
        })
        
        /**
         *  DOORS
         */

        // this.door1.interactionType = "door"
        // this.door1.doorState = false
        // this.door1.doorSwing = "inwards"
        // this.door1.doorOpen = false
        // this.door1.doorActive = false
        // this.door1.rotationOrigin = this.door1.rotation.y
        // this.doors.push(this.door1)

        /**
         *  TERMINALS
         */

        this.computer.interactionType = "OS"
        this.computer.viewPosition = {
            x: -4.1,
            y: 1.45,
            z: -8.88
        }
        this.computer.lookAtPosition = {
            x: -4.83,
            y: 1.45,
            z: -8.88
        }

        /**
         *  NPC'S
         */

        // this.npc1.interactionType = "npc"
        // this.npc1.event = 3
        // this.npcs.push(this.npc1)
    }

    trigger(object)
    {
        // Speak to NPC
        if( object.interactionType === "npc" )
        {
            document.querySelector( '.experienceContainer' ).classList.remove( 'navBoxHidden' )
            document.querySelector( '.experienceContainer' ).classList.add( 'navBoxDefault' )
            this.firstPerson.pointerLockControls.unlock()
            this.textAdventure.dialogueFocused = true
            this.textAdventure.triggerEvent( object.event )
        }

        // Open/close door
        if( object.interactionType === "door" && object.doorActive === false )
        {
            object.doorState = true
            object.doorActive = true
            this.doorOpening = true
        }

        // Terminal engagement
        if( object.interactionType === "OS" )
        {
            this.firstPerson.disengaged = true
            this.firstPerson.unlockPointer()

            // store previous position values
            // this.lastPosition = {
            //     x: this.camera.instance.position.x,
            //     y: this.camera.instance.position.y,
            //     z: this.camera.instance.position.z
            // }
            // this.camera.lookAt(
            //     object.lookAtPosition.x,
            //     object.lookAtPosition.y,
            //     object.lookAtPosition.z
            // )

            // Animate
            // gsap.to( this.camera.instance.position, { 
            //     x: object.viewPosition.x, 
            //     y: object.viewPosition.y, 
            //     z: object.viewPosition.z 
            // } )
            gsap.delayedCall( 0.1, () =>
            {
                this.layoutControl.openOS()
            } )
            window.addEventListener( 'message', () =>
            {
                console.log( "Shutdown" )
                window.removeEventListener( 'message', () => {} )
                gsap.delayedCall( 1, () =>
                {
                    this.layoutControl.closeOS()
                    this.returnToLastPosition()
                })
            })
        }
    }

    // exit terminal
    returnToLastPosition()
    {
        // gsap.to( this.camera.instance.position, { 
        //     x: this.lastPosition.x, 
        //     y: this.lastPosition.y, 
        //     z: this.lastPosition.z,
        // } )
        gsap.delayedCall( 0.5, () =>
        {
            this.camera.dontLookAt()
            this.firstPerson.disengaged = false
            this.firstPerson.lockPointer()
        } )
    }

    // manual trigger of objects
    triggerThis( object )
    {
        if( eval( 'this.' + object ).interactionType === "door" &&  eval( 'this.' + object ).doorActive === false )
        {
            eval( 'this.' + object ).doorState = true
            eval( 'this.' + object ).doorActive = true
            this.doorOpening = true
            if( eval( 'this.' + object ).doorOpen === false )
            {
                this.audio.play( "doorOpen" )

            }
            if( eval( 'this.' + object ).doorOpen === true )
            {
                this.audio.play( "doorClose" )
            }
        }
    }

    update()
    {
        if( this.doorOpening === true )
        {
            this.doors.forEach( element => {
                if( element.doorState === true )
                {
                    if( element.doorOpen === false )
                    {
                        if( element.rotation.y > element.rotationOrigin - Math.PI * 0.5 )
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
                    else if( element.doorOpen === true )
                    {
                        if( element.rotation.y < element.rotationOrigin )
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
            } )
        }
    }
}