import * as THREE from 'three'
import Sizes from "./Utils/Sizes"
import Time from "./Utils/Time"
import Camera from "./Camera.js"
import Renderer from './Renderer.js'
import World from './World/World.js'
import Resources from './Utils/Resources'
import sources from './sources.js'
import Debug from './Utils/Debug'

export default class Experience
{
    constructor(canvas)
    {
        // Uncomment below for global access in console
        // window.experience = this

        // Options
        this.canvas = canvas

        // Debug
        this.debug = new Debug(this)

        // Setup
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.resources = new Resources(sources)
        this.camera = new Camera(this)
        this.renderer = new Renderer(this)
        this.world = new World(this)

        // Loading
        this.loadingFinished = false

        // Detect resize
        this.sizes.on('resize', () =>
        {
            this.resize()
        })

        // Time tick event
        this.time.on('tick', () =>
        {
            this.update()
        })
    }

    resize()
    {
        this.camera.resize()
        this.renderer.resize()
    }

    update()
    {
        this.camera.update()
        this.world.update()
        this.renderer.update()
    }
}

