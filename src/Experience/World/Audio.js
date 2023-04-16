import * as THREE from 'three'

export default class Audio
{
    constructor(experience)
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

        this.setFPListener()
        this.setAudioSources()
        this.setFPAudio()
        this.setDebug()

        document.querySelector('.startGame').addEventListener('click', () =>
        {
            this.playAll()
        })
    }

    // add an audio listener to the camera
    setFPListener()
    {
        this.listener = new THREE.AudioListener()
        this.camera.add( this.listener )
        this.listener.getMasterVolume()
        this.listener.setMasterVolume(this.params.masterVolume)
    }

    setAudioSources()
    {
        this.speakerGeo = new THREE.BoxGeometry( 0.4,0.4,0.4 )
        this.speakerMat = new THREE.MeshBasicMaterial({color:'#ffffff', visible: this.params.speakersVisible})

        this.windowRain = new THREE.PositionalAudio( this.listener )
        this.windowRain.setBuffer( this.resources.items.windowRain )
        this.windowRain.setRefDistance( 1 )
        this.windowRain.setRolloffFactor( 2 )
        this.windowRain.setLoop( true )
        this.windowRain.setVolume( 1 )
        this.speaker1 = new THREE.Mesh( this.speakerGeo, this.speakerMat )
        this.speaker1.position.set(20,5.5,5)
        this.speaker1.add( this.windowRain )
        this.scene.add( this.speaker1 )

        this.train = new THREE.PositionalAudio( this.listener )
        this.train.setBuffer( this.resources.items.train )
        this.train.setRefDistance( 1 )
        this.train.setRolloffFactor( 1.7 )
        this.train.setLoop( true )
        this.train.setVolume( 4.5 )
        this.speaker2 = new THREE.Mesh( this.speakerGeo, this.speakerMat )
        this.speaker2.position.set(-10,5,15)
        this.speaker2.add( this.train )
        this.scene.add( this.speaker2 )

        this.sewerAudio = new THREE.PositionalAudio( this.listener )
        this.sewerAudio.setBuffer( this.resources.items.sewer )
        this.sewerAudio.setRefDistance( 1 )
        this.sewerAudio.setRolloffFactor( 1 )
        this.sewerAudio.setLoop( true )
        this.sewerAudio.setVolume( 1 )

        this.sewerSpeaker1 = new THREE.Mesh( this.speakerGeo, this.speakerMat )
        this.sewerSpeaker2 = new THREE.Mesh( this.speakerGeo, this.speakerMat )
        this.sewerSpeaker1.position.set(42.3,-4.4,57.7)
        this.sewerSpeaker2.position.set(42.8,-4, 8)
        this.sewerSpeaker1.add(this.sewerAudio)
        this.sewerSpeaker2.add(this.sewerAudio)
        this.scene.add(this.sewerSpeaker1)
        this.scene.add(this.sewerSpeaker2)

        this.windAudio = new THREE.PositionalAudio( this.listener )
        this.windAudio.setBuffer( this.resources.items.wind )
        this.windAudio.setRefDistance( 1 )
        this.windAudio.setRolloffFactor( 1.5 )
        this.windAudio.setLoop( true )
        this.windAudio.setVolume( 2 )

        this.cliffSpeaker1 = new THREE.Mesh( this.speakerGeo, this.speakerMat )
        this.cliffSpeaker2 = new THREE.Mesh( this.speakerGeo, this.speakerMat )
        this.cliffSpeaker1.position.set(90.2,19,53.6)
        this.cliffSpeaker2.position.set(74.4,8,84.9)
        this.cliffSpeaker1.add(this.windAudio)
        this.cliffSpeaker2.add(this.windAudio)
        this.scene.add(this.cliffSpeaker1)
        this.scene.add(this.cliffSpeaker2)

        this.waterAudio = new THREE.PositionalAudio( this.listener )
        this.waterAudio.setBuffer( this.resources.items.water )
        this.waterAudio.setRefDistance( 1 )
        this.waterAudio.setRolloffFactor( 1 )
        this.waterAudio.setLoop( true )
        this.waterAudio.setVolume( 2 )
        
        this.waterSpeaker1 = new THREE.Mesh( this.speakerGeo, this.speakerMat )
        this.waterSpeaker2 = new THREE.Mesh( this.speakerGeo, this.speakerMat )
        this.waterSpeaker3 = new THREE.Mesh( this.speakerGeo, this.speakerMat )
        this.waterSpeaker4 = new THREE.Mesh( this.speakerGeo, this.speakerMat )
        this.waterSpeaker5 = new THREE.Mesh( this.speakerGeo, this.speakerMat )
        this.waterSpeaker6 = new THREE.Mesh( this.speakerGeo, this.speakerMat )
        this.waterSpeaker7 = new THREE.Mesh( this.speakerGeo, this.speakerMat )
        this.waterSpeaker8 = new THREE.Mesh( this.speakerGeo, this.speakerMat )
        this.waterSpeaker1.position.set(22,-0.6,3.7)
        this.waterSpeaker2.position.set(40,-4.4,4)
        this.waterSpeaker3.position.set(-74,-8.9,29.3)
        this.waterSpeaker4.position.set(-34,-10,6.9)
        this.waterSpeaker5.position.set(35.2,-1.8,41)
        this.waterSpeaker6.position.set(57.5,-6.5,65.7)
        this.waterSpeaker7.position.set(82,11.8,22.8)
        this.waterSpeaker8.position.set(-57,-8.4,17)
        this.waterSpeaker1.add(this.waterAudio)
        this.waterSpeaker2.add(this.waterAudio)
        this.waterSpeaker3.add(this.waterAudio)
        this.waterSpeaker4.add(this.waterAudio)
        this.waterSpeaker5.add(this.waterAudio)
        this.waterSpeaker6.add(this.waterAudio)
        this.waterSpeaker7.add(this.waterAudio)
        this.waterSpeaker8.add(this.waterAudio)
        this.scene.add(this.waterSpeaker1)
        this.scene.add(this.waterSpeaker2)
        this.scene.add(this.waterSpeaker3)
        this.scene.add(this.waterSpeaker4)
        this.scene.add(this.waterSpeaker5)
        this.scene.add(this.waterSpeaker6)
        this.scene.add(this.waterSpeaker7)
        this.scene.add(this.waterSpeaker8)

        this.inhabittedAudio = new THREE.PositionalAudio( this.listener )
        this.inhabittedAudio.setBuffer( this.resources.items.inhabitted )
        this.inhabittedAudio.setRefDistance( 1 )
        this.inhabittedAudio.setRolloffFactor( 0.2 )
        this.inhabittedAudio.setLoop( true )
        this.inhabittedAudio.setVolume( 2.5 )

        this.insideSpeaker1 = new THREE.Mesh( this.speakerGeo, this.speakerMat )
        this.insideSpeaker1.position.set(50.1,-7,78)
        this.insideSpeaker1.add(this.inhabittedAudio)
        this.scene.add(this.insideSpeaker1)

        this.trainCrossing = new THREE.PositionalAudio( this.listener )
        this.trainCrossing.setBuffer( this.resources.items.trainCrossing )
        this.trainCrossing.setRefDistance( 1 )
        this.windowRain.setRolloffFactor( 1.7 )
        this.trainCrossing.setLoop( true )
        this.trainCrossing.setVolume( 1 )
        this.speaker2 = new THREE.Mesh( this.speakerGeo, this.speakerMat )
        this.speaker2.position.set(-10,5,15)
        this.speaker2.add( this.trainCrossing )
        this.scene.add( this.speaker2 )

        this.doorOpen = new THREE.PositionalAudio( this.listener )
        this.doorOpen.setBuffer( this.resources.items.doorOpen )
        this.doorOpen.setRefDistance( 1 )
        this.doorOpen.setRolloffFactor( 1.5 )
        this.doorOpen.setLoop( false )
        this.doorOpen.setVolume( 1 )
        this.doorClose = new THREE.PositionalAudio( this.listener )
        this.doorClose.setBuffer( this.resources.items.doorClose )
        this.doorClose.setRefDistance( 1 )
        this.doorClose.setRolloffFactor( 1.5 )
        this.doorClose.setLoop( false )
        this.doorClose.setVolume( 1 )
    }

    setFPAudio()
    {
        this.rain = new THREE.PositionalAudio( this.listener )
        this.rain.setBuffer( this.resources.items.rain )
        this.rain.setRefDistance( 1 )
        this.rain.setRolloffFactor( 1.5 )
        this.rain.setLoop( true )
        this.rain.setVolume( 0.7 )
        this.footstep = new THREE.PositionalAudio( this.listener )
        this.footstep.setBuffer( this.resources.items.footstep )
        this.footstep.setRefDistance( 1 )
        this.footstep.setRolloffFactor( 1.5 )
        this.footstep.setLoop( false )
        this.footstep.setVolume( 0.8 )
        this.camera.add( this.rain, this.doorClose, this.doorOpen, this.footstep )
    }


    play(sound)
    {
        eval("this." + sound + ".play()")
    }

    pause(sound)
    {
        eval("this." + sound + ".stop()")
    }

    playAll()
    {
        this.windowRain.play()
        // this.trainCrossing.play()
        // this.train.play()
        // this.rain.play()
        this.windAudio.play()
        this.waterAudio.play()
        this.sewerAudio.play()
        this.inhabittedAudio.play()
    }

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