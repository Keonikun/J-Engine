import EventEmitter from "./EventEmitter";

export default class Time extends EventEmitter
{
    constructor(experience)
    {
        super()

        // Setup 
        this.start = Date.now()
        this.current = this.start
        this.elapsed = 0
        this.delta = 16
        this.debug = experience.debug
        this.fpsMonitor = 0
        this.currentFps = 0
        this.secondCounter = this.current + 1000
        
        this.params = {
            fps: 30
        }

        this.fpsInterval = 1000 / this.params.fps

        if(this.debug.active)
        {
            this.debug.renderDebugFolder.add(this.params, 'fps', 10, 60).onChange(() =>
            {
                this.fpsInterval = 1000 / this.params.fps
            })
        }


        window.requestAnimationFrame(() =>
        {
            this.tick()
        })
    }

    tick()
    {
        const currentTime = Date.now()
        this.delta = currentTime - this.current
        this.current = currentTime
        this.elapsed = this.current - this.start

        window.requestAnimationFrame(() => 
        {
            this.tick()
        })
       
        if(this.elapsed > this.fpsInterval)
        {
            this.start = this.current - ( this.elapsed % this.fpsInterval )
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