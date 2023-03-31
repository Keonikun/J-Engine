import * as THREE from 'three'
import Sizes from './Utils/Sizes'
import Time from './Utils/Time'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import World from './World/World.js'
import Resources from './Utils/Resources'
import sources from './sources.js'
import FirstPerson from './FirstPerson.js'
import Debug from './Utils/Debug'
import TextAdventure from './TextAdventure.js'

export default class Experience
{
    constructor(canvas)
    {
        // Options
        this.canvas = canvas

        // Setup
        this.debug = new Debug(this)
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.resources = new Resources(sources)
        this.camera = new Camera(this)
        this.renderer = new Renderer(this)
        this.world = new World(this)
        this.firstPerson = new FirstPerson(this)
        this.textAdventure = new TextAdventure(this)

        // Loading
        this.loadingFinished = false

        this.world.on('ready', () =>
        {
            this.loadingFinished = true
        })

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
        this.firstPerson.update()
        this.debug.update()
    }
}

