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
            doorSpeed: 1.5,
            elevatorDoorSpeed: 2,
            elevatorTravelSpeed: 6
        }

        this.experience.world.on('ready', () =>
        {
            this.firstPerson = this.experience.world.firstPerson
            this.playerHeight = this.firstPerson.params.playerHeight
        })
        
        this.setup()
    }

    setup()
    {  
        this.doorSpeed = 1.5
        this.doorOpening = false
        this.readyToOpen = true
        this.dynamicObjects = this.models.dynamicObjects
        this.doorSpeaker = this.audio.doorSpeaker

        this.elevatorReposition = false
        
        this.doors = [] 
        this.npcs = []


        // SET DYNAMIC OBJECTS HERE
        this.dynamicObjectsArray = []
        this.dynamicObjects.children.forEach(element => {
            /**
             *  TERMINALS
             */
            if(element.name === "terminal")
            {
                this.computer = element
                this.dynamicObjectsArray.push(this.computer)
                this.computer.interactionType = "OS"
            }
            /**
             *  DOORS
             */
            if(element.name === "door")
            {
                this.door = element
                this.dynamicObjectsArray.push(this.door)
                this.door.interactionType = "door"
                this.door.doorState = false
                this.door.doorSwing = "inwards"
                this.door.doorOpen = false
                this.door.doorActive = false
                this.door.rotationOrigin = this.door.rotation.y
                this.doors.push(this.door)
            }
            /**
             *  BOOKS
             */
            if(element.name === "book")
            {
                this.book = element
                this.dynamicObjectsArray.push(this.book)
                this.book.interactionType = "book"
            }
            /**
             *  Elevator
             */
            if(element.name === "elevatorOpenDown")
            {
                this.elevatorOpenDown = element
                this.dynamicObjectsArray.push(this.elevatorOpenDown)
                this.elevatorOpenDown.interactionType = "elevatorOpenDown"
            }
            if(element.name === "elevatorOpenUp")
            {
                this.elevatorOpenUp = element
                this.dynamicObjectsArray.push(this.elevatorOpenUp)
                this.elevatorOpenUp.interactionType = "elevatorOpenUp"
            }
            if(element.name === "elevator")
            {
                this.elevator = element
                this.elevator.interactionType = "elevator"
                this.elevator.doorsOpen = false
                this.elevator.doorsMoving = false
                this.elevator.moving = false
                this.elevator.state = 'down'
                this.elevator.moveAmount = 10

                this.elevator.children.forEach(element => {
                    if(element.name === "elevatorDoorR")
                    {
                        this.elevatorDoorR = element
                    }
                    if(element.name === "elevatorDoorL")
                    {
                        this.elevatorDoorL = element
                    }
                    if(element.name === "elevatorButton")
                    {
                        this.elevatorButton = element
                        this.dynamicObjectsArray.push(this.elevatorButton)
                        this.elevatorButton.interactionType = "elevatorButton"
                    }
                })
            }
        })

        // set objects to be detectable dy first person raycast
        this.dynamicObjectsArray.forEach(element => {
            element.interactive = true
        })
    }

    speakerToElevator()
    {
        // set position of door speaker to elevator position
        let x = this.elevator.position.x + this.elevator.parent.position.x
        let y = this.elevator.position.y + this.elevator.parent.position.y
        let z = this.elevator.position.z + this.elevator.parent.position.z
        this.doorSpeaker.position.set(x,y,z)
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
            // set position of door speaker
            let x = object.position.x + object.parent.position.x
            let y = object.position.y + object.parent.position.y
            let z = object.position.z + object.parent.position.z
            this.doorSpeaker.position.set(x,y,z)
            
            object.doorState = true
            object.doorActive = true
            this.doorOpening = true

            if(object.doorOpen === true)
            {
                let i = Math.floor(Math.random() * 3 + 1)
                let sound = "doorClose" + String(i)
                this.audio.play(sound)
            }
            else
            {
                let i = Math.floor(Math.random() * 4 + 1)
                let sound = "doorOpen" + String(i)
                this.audio.play(sound)
            }
        }

        // Terminal engagement
        if( object.interactionType === "OS" )
        {
            this.firstPerson.disengaged = true
            this.firstPerson.unlockPointer()

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

        // Book Engagement
        if( object.interactionType === "book" )
        {
            this.firstPerson.disengaged = true
            this.firstPerson.unlockPointer()

            gsap.delayedCall( 0.1, () =>
            {
                this.layoutControl.openBook()
            } )
            window.addEventListener( 'message', () =>
            {
                console.log( "Closing Book" )
                window.removeEventListener( 'message', () => {} )
                gsap.delayedCall( 1, () =>
                {
                    this.layoutControl.closeBook()
                    this.returnToLastPosition()
                })
            })
        }

        // Elevator Engagement
        if( object.interactionType === "elevatorOpenDown" && this.elevator.doorsMoving === false && this.elevator.moving === false)
        {
            // Open doors to elevator if on same floor as button
            this.speakerToElevator()

            if(this.elevator.state === 'down')
            {
                this.elevator.doorsMoving = true

                if(this.elevator.doorsOpen === false)
                {
                    this.elevator.doorsOpen = true
                    let rightDoorPos = this.elevatorDoorR.position.x + 0.51
                    let leftDoorPos = this.elevatorDoorL.position.x - 0.51
        
                    gsap.delayedCall(0.5, () =>
                    {
                        this.audio.play('elevatorOpen')

                        gsap.to(this.elevatorDoorR.position, {x: rightDoorPos, duration: this.params.elevatorDoorSpeed})
                        gsap.to(this.elevatorDoorL.position, {x: leftDoorPos, duration: this.params.elevatorDoorSpeed, onComplete: () => {this.elevator.doorsMoving = false}})
                    })
                }
                else if(this.elevator.doorsOpen === true)
                {
                    this.elevator.doorsOpen = false

                    let rightDoorPos = this.elevatorDoorR.position.x - 0.51
                    let leftDoorPos = this.elevatorDoorL.position.x + 0.51
                    
                    gsap.delayedCall(0.4, () =>
                    {
                        this.audio.play('elevatorClose')

                        gsap.to(this.elevatorDoorR.position, {x: rightDoorPos, duration: this.params.elevatorDoorSpeed})
                        gsap.to(this.elevatorDoorL.position, {x: leftDoorPos, duration: this.params.elevatorDoorSpeed, onComplete: () => {this.elevator.doorsMoving = false}})
                    })
                }
            }
            // Call the elevator if it is on a different floor
            else if( this.elevator.state === 'up' )
            {
                this.elevator.moving = true
                this.elevator.state = 'down'
                let elevatorPosition = this.elevator.position.y - this.elevator.moveAmount
                gsap.to(this.elevator.position, {y: elevatorPosition, duration: 5, ease: "power1.inOut", 
                onComplete: () =>
                {
                    let rightDoorPos = this.elevatorDoorR.position.x + 0.51
                    let leftDoorPos = this.elevatorDoorL.position.x - 0.51
                    this.elevatorReposition = false
                    gsap.delayedCall(this.params.elevatorDoorSpeed, () =>
                    {
                        this.audio.play('elevatorOpen')

                        gsap.to(this.elevatorDoorR.position, {x: rightDoorPos, duration: this.params.elevatorDoorSpeed})
                        gsap.to(this.elevatorDoorL.position, {x: leftDoorPos, duration: this.params.elevatorDoorSpeed, onComplete: () =>
                        {
                            this.elevator.moving = false
                        }})
                    })
                }})
            }
        }
        if( object.interactionType === "elevatorOpenUp" && this.elevator.doorsMoving === false && this.elevator.moving === false)
        {
            // Open doors to elevator if on same floor as button
            this.speakerToElevator()
            
            if(this.elevator.state === 'up')
            {
                this.elevator.doorsMoving = true

                if(this.elevator.doorsOpen === false)
                {
                    this.elevator.doorsOpen = true
                    let rightDoorPos = this.elevatorDoorR.position.x + 0.51
                    let leftDoorPos = this.elevatorDoorL.position.x - 0.51
        
                    gsap.delayedCall(0.5, () =>
                    {
                        this.audio.play('elevatorOpen')
                        gsap.to(this.elevatorDoorR.position, {x: rightDoorPos, duration: this.params.elevatorDoorSpeed})
                        gsap.to(this.elevatorDoorL.position, {x: leftDoorPos, duration: this.params.elevatorDoorSpeed, onComplete: () => {this.elevator.doorsMoving = false}})
                    })
                }
                else if(this.elevator.doorsOpen === true)
                {
                    this.elevator.doorsOpen = false

                    let rightDoorPos = this.elevatorDoorR.position.x - 0.51
                    let leftDoorPos = this.elevatorDoorL.position.x + 0.51
                    
                    gsap.delayedCall(0.4, () =>
                    {
                        this.audio.play('elevatorClose')

                        gsap.to(this.elevatorDoorR.position, {x: rightDoorPos, duration: this.params.elevatorDoorSpeed})
                        gsap.to(this.elevatorDoorL.position, {x: leftDoorPos, duration: this.params.elevatorDoorSpeed, onComplete: () => {this.elevator.doorsMoving = false}})
                    })
                }
            }
            // Call the elevator if it is on a different floor
            else if( this.elevator.state === 'down' )
            {
                this.elevator.moving = true
                this.elevator.state = 'up'
                let elevatorPosition = this.elevator.position.y + this.elevator.moveAmount
                gsap.to(this.elevator.position, {y: elevatorPosition, duration: this.params.elevatorTravelSpeed, ease: "power1.inOut", 
                onComplete: () =>
                {
                    let rightDoorPos = this.elevatorDoorR.position.x + 0.51
                    let leftDoorPos = this.elevatorDoorL.position.x - 0.51
                    this.elevatorReposition = false
                    gsap.delayedCall(0.4, () =>
                    {
                        gsap.to(this.elevatorDoorR.position, {x: rightDoorPos, duration: this.params.elevatorDoorSpeed})
                        gsap.to(this.elevatorDoorL.position, {x: leftDoorPos, duration: this.params.elevatorDoorSpeed, onComplete: () =>
                        {
                            this.audio.play('elevatorOpen')

                            this.elevator.moving = false
                        }})
                    })
                }})
            }
        }
        if( object.interactionType === "elevatorButton" && this.elevator.doorsMoving === false && this.elevator.moving === false )
        {
            this.elevator.doorsOpen = false
            this.elevatorReposition = true
            this.elevator.moving = true

            let rightDoorPos = this.elevatorDoorR.position.x - 0.51
            let leftDoorPos = this.elevatorDoorL.position.x + 0.51

            gsap.delayedCall(0.4, () =>
            {
                this.audio.play('elevatorClose')

                gsap.to(this.elevatorDoorR.position, {x: rightDoorPos, duration: this.params.elevatorDoorSpeed})
                gsap.to(this.elevatorDoorL.position, {x: leftDoorPos, duration: this.params.elevatorDoorSpeed})
                gsap.delayedCall(this.params.elevatorDoorSpeed, () =>
                {
                    let elevatorPosition = null
                    if(this.elevator.state === 'down')
                    {
                        elevatorPosition = this.elevator.position.y + this.elevator.moveAmount
                        this.elevator.state = 'up'
                    }
                    else if(this.elevator.state === 'up')
                    {
                        elevatorPosition = this.elevator.position.y - this.elevator.moveAmount
                        this.elevator.state = 'down'
                    }
                    this.audio.play('elevatorMoving')

                    gsap.to(this.elevator.position, {y: elevatorPosition, duration: 7, ease: "power1.inOut", 
                    onComplete: () =>
                    {
                        let rightDoorPos = this.elevatorDoorR.position.x + 0.51
                        let leftDoorPos = this.elevatorDoorL.position.x - 0.51
                        this.elevatorReposition = false
                        gsap.delayedCall(0.4, () =>
                        {
                            this.audio.play('elevatorOpen')

                            gsap.to(this.elevatorDoorR.position, {x: rightDoorPos, duration: this.params.elevatorDoorSpeed})
                            gsap.to(this.elevatorDoorL.position, {x: leftDoorPos, duration: this.params.elevatorDoorSpeed, onComplete: () =>
                            {
                                this.elevator.moving = false
                                this.elevator.doorsOpen = true
                            }})
                        })
                    }})
                })
            }) 
        }
    }

    // exit terminal
    returnToLastPosition()
    {
        gsap.delayedCall( 0.5, () =>
        {
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
                this.audio.play( "doorOpen1" )

            }
            if( eval( 'this.' + object ).doorOpen === true )
            {
                this.audio.play( "doorClose1" )
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

        if(this.elevatorReposition === true)
        {
            this.camera.instance.position.y = this.elevator.position.y + this.dynamicObjects.position.y + this.playerHeight + 0.15
            let x = this.elevator.position.x + this.elevator.parent.position.x
            let y = this.elevator.position.y + this.elevator.parent.position.y
            let z = this.elevator.position.z + this.elevator.parent.position.z
            this.doorSpeaker.position.set(x,y,z)
        }
    }
}