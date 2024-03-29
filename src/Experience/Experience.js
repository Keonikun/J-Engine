import * as THREE from 'three'
import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import World from './World/World.js'
import Resources from './Utils/Resources'
import sources from './sources.js'
import Debug from './Utils/Debug.js'
import TextAdventure from './TextAdventure.js'
import LayoutControl from './Utils/LayoutControl.js'

export default class Experience
{
    constructor( canvas )
    {
        // Options
        this.canvas = canvas;

        // Setup
        this.debug = new Debug( this )
        this.sizes = new Sizes()
        this.time = new Time( this )
        this.scene = new THREE.Scene()
        this.cssScene = new THREE.Scene()
        this.resources = new Resources( sources )
        this.camera = new Camera( this )
        this.renderer = new Renderer( this )
        this.world = new World( this )
        this.textAdventure = new TextAdventure( this )
        this.layoutControl = new LayoutControl( this )

        this.params = {
            audio: true,
            portfolioMode: false,
            appStart: false,
        }

        this.worldLoaded = false
        this.world.on( 'ready', () =>
        {
            this.worldLoaded = true
        })

        // Detect resize
        this.sizes.on( 'resize', () =>
        {
            this.resize();
        })

        // Time tick event
        this.time.on( 'tick', () =>
        {
            this.update();
        })
    }

    resize()
    {
        this.camera.resize()
        this.renderer.resize()
    }

    update()
    {
        if( this.params.appStart === true )
        {
            this.camera.update()
            this.world.update()
            this.renderer.update()
            this.debug.update()
            this.layoutControl.update()
        }
    }
}

