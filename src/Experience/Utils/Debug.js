import GUI from 'lil-gui'
import Stats from 'stats.js'

export default class Debug
{
    constructor()
    {
        this.active = window.location.hash === '#debug'

        this.params = {
            fpsMonitor: true
        }

        // Create Debug Menu
        if(this.active)
        {
            this.stats = new Stats()
            if(this.params.fpsMonitor === true)
            {
                this.stats.setMode(0)
            }
            else
            {
                this.stats.setMode()
            }
            document.body.appendChild(this.stats.dom)
            this.gui = new GUI()

            this.debugFolder = this.gui.addFolder('debug')
            this.debugFolder.add(this.params, 'fpsMonitor').onChange(() =>
            {
                if(this.params.fpsMonitor === true)
                {
                    this.stats.setMode(0)
                }
                else
                {
                    this.stats.setMode()
                }
            })
            this.debugFolder.close()
        }
    }

    update()
    {
        if(this.active)
        {
            this.stats.begin()

            this.stats.end()
        } 
    }
}