export default class Layout
{
    constructor(experience)
    {
        this.experience = experience
        this.debug = this.experience.debug

        this.params = {
            windowMode: 'fullscreen',
            navBoxSetting: 'default',
            colorProfile: 'grey'
        }

        // To do: Color profiles

        this.setDomElements()
        this.setExperienceContainer()
        this.setNavBox()
        this.setDebug()
    }

    setDomElements()
    {
        this.experienceContainer = document.querySelector('.experienceContainer')
        this.navBox = document.querySelector('.navBox')
        this.textBox = document.querySelector('.textBox')
        this.arrowControls = document.querySelector('.arrowControls')
    }

    setExperienceContainer()
    {
        if(this.params.windowMode === 'fullscreen')
        {
            this.experienceContainer.classList.remove('fullSquare')
            this.experienceContainer.classList.remove('square')
        }
        else if(this.params.windowMode === 'fullSquare')
        {
            this.experienceContainer.classList.add('fullSquare')
            this.experienceContainer.classList.remove('square')
        }
        else if(this.params.windowMode === 'square')
        {
            this.experienceContainer.classList.add('square')
            this.experienceContainer.classList.remove('fullSquare')
        }
    }

    setNavBox()
    {
        if(this.params.navBoxSetting === 'default')
        {
            this.experienceContainer.classList.add('navBoxDefault')
            this.experienceContainer.classList.remove('navBoxFull')
        }
        if(this.params.navBoxSetting === 'hidden')
        {
            this.experienceContainer.classList.remove('navBoxDefault')
            this.experienceContainer.classList.remove('navBoxFull')
        }
        if(this.params.navBoxSetting === 'fullscreen')
        {
            this.experienceContainer.classList.remove('navBoxDefault')
            this.experienceContainer.classList.add('navBoxFull')
        }
    }

    setDebug()
    {
        if(this.debug.active)
        {
            this.debugFolder = this.debug.gui.addFolder('Layout')
            this.debugFolder.add(this.params, 'windowMode', [ 'fullscreen', 'fullSquare', 'square']).onChange(() =>
            {
                this.setExperienceContainer(this.params.windowMode)
            })
            this.debugFolder.add(this.params, 'navBoxSetting', [ 'default', 'hidden', 'fullscreen']).onChange(() =>
            {
                this.setNavBox(this.params.navBoxSetting)
            })
            this.debugFolder.close()
        }
    }
}