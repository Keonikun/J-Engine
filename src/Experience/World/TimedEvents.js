import gsap from 'gsap'

export default class TimedEvents
{
    constructor(experience)
    {
        this.experience = experience
        this.scene = this.experience.scene

        // Setup
        this.eventTimerStart = false
        this.eventTimer = 0
        this.currentEvent = null

        // Event Array
        this.events = [
            0, // Init Event
            1000, // First Event
            2000, // Second Event
            3000, // Third Event
        ]

        this.createEvents()
    }

    createEvents()
    {
        this.event0 = () =>
        {
            console.log("Event Timer Started")
        }

        this.event1000 = () =>
        {
            console.log("First Event Triggered")
        }

        this.event2000 = () =>
        {
            console.log("Second Event Triggered")

        }

        this.event3000 = () =>
        {
            console.log("Third Event Triggered")
        }
    }

    eventActive()
    {
        eval("this.event" + this.currentEvent + "()")
    }

    update()
    {
        if(this.eventTimerStart === true)
        {
            this.events.forEach(element  =>
            {
                if(element === this.eventTimer)
                {
                    this.currentEvent = element
                    this.eventActive()
                }
            })
            this.eventTimer += 1
        }
    }
}