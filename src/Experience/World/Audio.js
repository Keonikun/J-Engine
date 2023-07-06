import * as THREE from 'three'

export default class Audio
{
    constructor( experience )
    {
        this.experience = experience
        this.camera = this.experience.camera.instance
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        this.params = {
            audioEnabled: true,
            masterVolume: 0.5,
            speakersVisible: true,
            audioHelper: true,
        }

        this.setup()
        this.setFPAudio()
        this.setDebug()
    }

    setup()
    {
        this.speakerGeo = new THREE.BoxGeometry( 0.4,0.4,0.4 )
        this.speakerMat = new THREE.MeshBasicMaterial({color:'#ffffff', visible: this.params.speakersVisible})
    }

    // set first person audio
    setFPAudio()
    {
        this.listener = new THREE.AudioListener()
        this.listener.getMasterVolume()
        this.listener.setMasterVolume(this.params.masterVolume)

        // Add new audio here using createAudio() function
        // this.createAudio( "rain", "this.resources.items.rain", "1", "1.5", "true", "0.7" )
        // this.createAudio( "footstep", "this.resources.items.footstep", "1", "1.5", "false", "0.8" )
        // this.createAudio( "bootUp", "this.resources.items.bootUp", "1", "1.5", "false", "0.07" )
        
        this.camera.add( 
            this.listener, 
            this.rain, 
            this.footstep, 
            this.bootUp 
        )
    }

    createAudio( name, buffer, refDistance, rolloffFactor, loop, volume )
    {
        eval("this." + name   + "= new THREE.PositionalAudio( this.listener )")
        eval("this." + name   + ".setBuffer(" + buffer + ")")
        eval("this." + name   + ".setRefDistance(" + refDistance + ")")
        eval("this." + name   + ".setRolloffFactor(" + rolloffFactor + ")")
        eval("this." + name   + ".setLoop(" + loop + ")")
        eval("this." + name   + ".setVolume(" + volume + ")")
    }

    play(sound)
    {
        eval("this." + sound + ".play()")
    }

    pause(sound)
    {
        eval("this." + sound + ".stop()")
    }

    /**------------------------------------------------------------------
     *--------------------------------DEBUG------------------------------
     *-------------------------------------------------------------------
    */

    setDebug()
    {
        if(this.debug.active)
        {
            this.debugFolder = this.debug.gui.addFolder('Audio')
            this.debugFolder.add(this.params, 'masterVolume', 0, 1).onChange(() =>
            {
                this.listener.setMasterVolume(this.params.masterVolume)
            })
            this.debugFolder.close()
        }
    }
}