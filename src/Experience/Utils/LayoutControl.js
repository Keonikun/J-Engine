import { gsap } from "gsap"

export default class Layout
{
    constructor(experience)
    {
        this.experience = experience
        this.textAdventure = this.experience.textAdventure
        this.camera = this.experience.camera
        this.renderer = this.experience.renderer
        this.debug = this.experience.debug
        this.waitingToCloseNav = false
        this.audio = this.experience.world.audio

        // IMPORTANT: of the 3 different window modes, only fullscreen works right now :/

        this.params = {
            windowMode: 'fullscreen',
            navBoxSetting: 'fullscreen',
            colorProfile: 'grey',
            OSOnOpen: false,
            portfolioMode: true,
            OSOpened: false,
        }

        this.fullscreenEnabled = false

        window.mobileCheck = function() {
            let check = false;
            (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
            return check
        }
        
        if(window.mobileCheck())
        {
            console.log("mobile controls activated")
            this.arrowControls = document.querySelector('.arrowControls')
            this.arrowControls.classList.remove('hidden')
            this.mobile = true
        }

        // Load new game
        this.experience.world.on('ready', () =>
        { 
            console.log("Loading Finished")
            this.firstPerson = this.experience.world.firstPerson
            if(this.mobile === true)
            {
                this.firstPerson.setArrowControls()
            }
            this.audio = this.experience.world.audio
            document.querySelector('.loadingText').classList.add('hidden')
            document.querySelector('.startGame').classList.remove('hidden')

            document.querySelector('.startGame').addEventListener('click', () =>
            {
                this.audio.beginAudio()
                document.querySelector('.titleScreen').classList.add('hidden')
                this.experience.params.appStart = true
                gsap.delayedCall(0.5, () =>
                {
                    this.setNavBox('default')
                    document.querySelector('.titleScreen').remove()
                    this.textAdventure.progressToNextEvent(1)
                })
            })   
        })

        
        this.setDomElements()
        this.setExperienceContainer()
        this.setNavBox()
        this.pinScrollToBottom()
        this.setDebug()

        if(this.params.OSOnOpen)
        {
            this.openOS()
        }
    }

    setDomElements()
    {
        this.experienceContainer = document.querySelector('.experienceContainer')
        this.navBox = document.querySelector('.navBox')
        this.textBox = document.querySelector('.textBox')
        this.arrowControls = document.querySelector('.arrowControls')
        this.folderTabs = document.querySelector('.folderTabs')
        this.fullscreen = document.querySelector('.fullscreen')
        this.visuals = document.querySelector('.visuals')
        this.visuals.style.visibility = 'hidden'

        this.folderTabs.addEventListener('click', () =>
        {
            if(this.params.navBoxSetting === 'hidden')
            {
                this.setNavBox('default')
            }
        })

        this.fullscreen.addEventListener('click', () =>
        {
            if(this.fullscreenEnabled === false)
            {
                this.fullscreenEnabled = true

                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen();
                } else if (document.documentElement.webkitRequestFullscreen) { /* Safari */
                    document.documentElement.webkitRequestFullscreen();
                } else if (document.documentElement.msRequestFullscreen) { /* IE11 */
                    document.documentElement.msRequestFullscreen();
                }
            }
            else if(this.fullscreenEnabled === true)
            {
                this.fullscreenEnabled = false

                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) { /* Safari */
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) { /* IE11 */
                    document.msExitFullscreen();
                }
            }
        })

        this.focusedTab = 'tab1'

        this.textBoxButton = document.querySelector('.tab1')    
        this.settingsButton = document.querySelector('.tab2')       
        // this.settingsButton.addEventListener('click', () =>
        // {
        //     if(this.focusedTab === 'tab1')
        //     {
        //         this.textBoxButton.classList.remove('selected')
        //         this.settingsButton.classList.add('selected')
        //         this.focusedTab = 'tab2'
        //         this.experience.params.appStart = false
        //         this.textBox.classList.add('settings')

        //         this.settingsContainer = document.createElement('div')
        //         this.settingsContainer.classList.add('settingsContainer')
        //         this.navBox.appendChild(this.settingsContainer)

        //         this.graphicsSettingContainer = document.createElement('div')
        //         this.settingsContainer.appendChild(this.graphicsSettingContainer)
        //         this.graphicsSetting = document.createElement('select')
        //         this.graphicsSetting.innerHTML = 'Graphics Setting'

        //         this.lowGraphics = document.createElement('option')
        //         this.lowGraphics.innerHTML = 'Low'
        //         this.medGraphics = document.createElement('option')
        //         this.medGraphics.innerHTML = 'Medium'
        //         this.highGraphics = document.createElement('option')
        //         this.highGraphics.innerHTML = 'High'

        //         this.graphicsSetting.appendChild(this.highGraphics)
        //         this.graphicsSetting.appendChild(this.medGraphics)
        //         this.graphicsSetting.appendChild(this.lowGraphics)
        //     }
        // })

        // this.textBoxButton.addEventListener('click', () =>
        // {
        //     if(this.focusedTab === 'tab2')
        //     {
        //         this.settingsButton.classList.remove('selected')
        //         this.textBoxButton.classList.add('selected')
        //         this.focusedTab = 'tab1'
        //         this.experience.params.appStart = true
        //         this.textBox.classList.remove('settings')
        //         this.settingsContainer.remove()
        //     }
        // })
        
    }

    openOS()
    {
        this.audio.play("bootUp")

        this.OSIframe = document.createElement('iframe')
        this.OSIframe.src = './iframe/OS/OS.html'
        this.OSIframe.style.transform = 'translate(-50%,-50%)'
        this.OSIframe.style.left = '50%'
        this.OSIframe.style.top = '50%'
        this.OSIframe.style.position = 'absolute'
        this.OSIframe.style.height = '73vh'
        this.OSIframe.style.width = '73vh'
        this.OSIframe.style.border = 'none'
        this.OSIframe.style.border = '20px solid #676764'


        this.monitorOverlay = document.createElement('img')
        this.monitorOverlay.src = './textures/static/monitor.png'
        this.monitorOverlay.style.height = '100%'
        this.monitorOverlay.style.zIndex = 21
        this.monitorOverlay.style.position = 'absolute'
        this.monitorOverlay.style.left = '50%'
        this.monitorOverlay.style.transform = 'translate(-50%)'
        this.monitorOverlay.style.pointerEvents = 'none'


        this.visuals.style.zIndex = "20"
        this.visuals.appendChild(this.OSIframe)
        this.visuals.appendChild(this.monitorOverlay)

        gsap.delayedCall(0.1, () =>
        {
            this.visuals.style.visibility = 'visible'

        })
    }

    closeOS()
    {
        this.visuals.style.zIndex = "-1"
        this.OSIframe.remove()
    }

    setExperienceContainer(parameter)
    {
        if(parameter)
        {
            this.params.windowMode = parameter
        }
        if(this.params.windowMode === 'fullscreen')
        {
            this.experienceContainer.classList.remove('fullSquare')
            this.experienceContainer.classList.remove('square')
            this.camera.resize()
            this.renderer.resize()
        }
        else if(this.params.windowMode === 'fullSquare')
        {
            this.experienceContainer.classList.add('fullSquare')
            this.experienceContainer.classList.remove('square')
            this.camera.resize()
            this.renderer.resize()
        }
        else if(this.params.windowMode === 'square')
        {
            this.experienceContainer.classList.add('square')
            this.experienceContainer.classList.remove('fullSquare')
            this.camera.resize()
            this.renderer.resize()
        }
    }

    setNavBox(parameter)
    {
        if(parameter)
        {
            this.params.navBoxSetting = parameter
        }
        if(this.params.navBoxSetting === 'default')
        {
            this.experienceContainer.classList.add('navBoxDefault')
            this.experienceContainer.classList.remove('navBoxFull')
        }
        if(this.params.navBoxSetting === 'hidden')
        {
            if(this.textAdventure.typewriterWorking === true)
            {
                this.waitToCloseNav()
            }
            else
            {
                this.experienceContainer.classList.remove('navBoxDefault')
                this.experienceContainer.classList.remove('navBoxFull')
            }
        }
        if(this.params.navBoxSetting === 'fullscreen')
        {
            this.experienceContainer.classList.remove('navBoxDefault')
            this.experienceContainer.classList.add('navBoxFull')
        }
    }

    waitToCloseNav()
    {
        if(this.waitingToCloseNav === false)
        {
            this.waitingToCloseNav = true
            this.params.navBoxSetting = 'hidden'
            this.waitToCloseNavInterval = setInterval(() =>
            {
                if(this.textAdventure.typewriterWorking === false)
                {
                    clearInterval(this.waitToCloseNavInterval)
                    gsap.delayedCall(3,() =>
                    {
                        if(this.firstPerson.pointerLockControls.isLocked === false && this.firstPerson.disengaged === false)
                        {
                            this.waitingToCloseNav = false
                        }
                        else if(this.params.navBoxSetting === 'hidden' && this.textAdventure.typewriterWorking === false)
                        {
                            this.experienceContainer.classList.remove('navBoxDefault')
                            this.experienceContainer.classList.remove('navBoxFull')
                            this.waitingToCloseNav = false
                        }
                        else
                        {
                            this.waitingToCloseNav = false
                            this.waitToCloseNav()
                        }
                    })  
                }
            }, 100)
        }
    }

    openNavIfClose()
    {
        if(this.params.navBoxSetting === 'hidden')
        {
            this.setNavBox('default')
            this.waitToCloseNav()
        }
    }

    pinScrollToBottom()
    {
        this.textBoxHeight = 0
        setInterval(() =>
        {
            if(this.textBoxHeight != this.textBox.scrollHeight)
            {
                this.textBox.scrollTo(0,this.textBox.scrollHeight)
            }
            this.textBoxHeight = this.textBox.scrollHeight
            
        }, 50)
    }

    /**------------------------------------------------------------------
     *--------------------------------DEBUG------------------------------
     *-------------------------------------------------------------------
    */

    setDebug()
    {
        if(this.debug.active)
        {
            this.debugFolder = this.debug.osDebugFolder
            this.debugFolder.add(this.params, 'OSOpened').onChange(() =>
            {
                if(this.params.OSOpened === true)
                {
                    this.openOS()
                }
                else if(this.params.OSOpened === false)
                {
                    this.closeOS()
                }
            })
        //     this.debugFolder.add(this.params, 'windowMode', [ 'fullscreen', 'fullSquare', 'square']).onChange(() =>
        //     {
        //         this.setExperienceContainer(this.params.windowMode)
        //     })
        //     this.debugFolder.add(this.params, 'navBoxSetting', [ 'default', 'hidden', 'fullscreen']).onChange(() =>
        //     {
        //         this.setNavBox(this.params.navBoxSetting)
        //     })
        //     this.debugFolder.close()
            
        }
    }
}