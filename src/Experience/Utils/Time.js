import { Clock } from 'three/src/core/Clock.js'
import EventEmitter from "./EventEmitter";

export default class Time extends EventEmitter
{
    constructor(experience)
    {
        super()

        // Setup 
        this.experience = experience
        this.clock = new Clock()
        this.start = Date.now()
        this.fpsTime = null
        this.currentTime = null
        this.current = this.start
        this.elapsed = 0
        this.elapsedTime = 0
        this.delta = 16
        this.debug = experience.debug
        this.fpsMonitor = 0
        this.currentFps = 0
        this.secondCounter = this.current + 1000

        this.fpsInterval = 1000

        this.tick()
    }

    tick()
    {
        this.currentTime = Date.now()

        this.delta = this.currentTime - this.current
        this.current = this.currentTime
        this.elapsed = this.current - this.fpsTime
        this.elapsedTime = this.current - this.start
       
        window.requestAnimationFrame(() => 
        {
            this.tick()
        })

        // Trigger the next tick depending on the FPS interval
        if(this.elapsed > this.fpsInterval)
        {
            this.fpsTime = this.current - ( this.elapsed % this.fpsInterval )
            this.fpsMonitor ++
            this.trigger('tick')
        }

        if(this.current > this.secondCounter)
        {
            this.secondCounter = this.current + 1000
            this.currentFps = this.fpsMonitor
            this.fpsMonitor = 0
        }
    }
}