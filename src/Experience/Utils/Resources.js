import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import EventEmitter from "./EventEmitter";
import { AudioLoader } from 'three';

export default class Resources extends EventEmitter
{
    constructor(sources)
    {
        super()

        // Options
        this.sources = sources

        // Setup
        this.items = {}
        this.toLoad = this.sources.length
        this.loaded = 0

        this.setLoaders()
        this.startLoading()
    }

    setLoaders()
    {
        this.loaders = {}
        this.loaders.loadingManager = new THREE.LoadingManager()
        this.loaders.gltfLoader = new GLTFLoader(this.loaders.loadingManager)
        this.loaders.dracoLoader = new DRACOLoader(this.loaders.loadingManager)
        this.loaders.dracoLoader.setDecoderPath('draco/')
        this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader)
        this.loaders.textureLoader = new THREE.TextureLoader(this.loaders.loadingManager)
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader(this.loaders.loadingManager)
        this.loaders.fontLoader = new FontLoader(this.loaders.loadingManager)
        this.loaders.audioLoader = new THREE.AudioLoader(this.loaders.loadingManager)
    }

    startLoading()
    {
        // Loading Bar
        this.loadingBarContainer = document.querySelector('.loadingBarContainer')
        this.loadingBar = document.querySelector('.loadingBar')
        this.loadingText = document.querySelector('.loadingText')
        this.loaders.loadingManager.onProgress = (url, loaded, total) =>
        {
            this.loadingText.innerHTML = 'Loading: ' + String(Math.ceil((loaded/total) * 100)) + '%'
            this.loadingBar.style = 'width:' + String(Math.ceil((loaded/total) * 100)) + '%'
        }
        this.loaders.loadingManager.onLoad = (url, loaded, total) =>
        {
            this.loadingBarContainer.classList.add('hidden')
        }

        // Load Each Source
        for(const source of this.sources)
        {
            if(source.type === 'gltfModel')
            {
                this.loaders.gltfLoader.load(
                    source.path,
                    (file) =>
                    {
                        this.sourceLoaded(source, file)
                    }
                )
            }
            else if(source.type === 'dracoModel')
            {
                this.loaders.dracoLoader.load(
                    source.path,
                    (file) =>
                    {
                        this.sourceLoaded(source, file)
                    }
                )
            }
            else if(source.type === 'texture')
            {
                this.loaders.textureLoader.load(
                    source.path,
                    (file) =>
                    {
                        this.sourceLoaded(source, file)
                    }
                )
            }
            else if(source.type === 'cubeTexture')
            {
                this.loaders.cubeTextureLoader.load(
                    source.path,
                    (file) =>
                    {
                        this.sourceLoaded(source, file)
                    }
                )
            }
            else if(source.type === 'font')
            {
                this.loaders.fontLoader.load(
                    source.path,
                    (file) =>
                    {
                        this.sourceLoaded(source, file)
                    }
                )
            }
            else if(source.type === 'audio')
            {
                this.loaders.audioLoader.load(
                    source.path,
                    (file) =>
                    {
                        this.sourceLoaded(source, file)
                    }
                )
            }
        }
    }

    sourceLoaded(source, file)
    {
        this.items[source.name] = file

        this.loaded++

        if(this.loaded === this.toLoad)
        {
            this.trigger('ready')
        }
    }
}