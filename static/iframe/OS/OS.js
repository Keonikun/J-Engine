/**
 *  GENERAL SETUP
 */

var params = {
    bootProcess: true
}

var desktop = document.querySelector('.desktop')
var icon = document.querySelector('.icon')
var folder1 = document.querySelector('.folder1')
var txt1 = document.querySelector('.txt1')
var network = document.querySelector('.network')
var bottomBar = document.querySelector('.bottomBar')
var startButton = document.querySelector('.startButton')
var startMenu = document.querySelector('.startMenu')
var shutDown = document.querySelector('.shutDown')
var dateDom = document.querySelector('.date')
var timeDom = document.querySelector('.time')

let apps = []

let startOpen = false

let draggedElement = null
let draggedOption = null

var iconWidth = icon.clientWidth

/**
 *  OS FUNCTIONS
 */

// OPEN START MENU
startButton.addEventListener('click', () =>
{
    if(startOpen === false)
    {
        startOpen = true
        startMenu.classList.add("open")
    }
    else if(startOpen === true)
    {
        startOpen = false
        startMenu.classList.remove("open")
    }
})

// SHUT DOWN / EXIT OS
shutDown.addEventListener('click', () =>
{
    // close apps
    apps.forEach(element =>
    {
        exitApp(element)
    })
    shutDown.removeEventListener('click', () => {})
    startButton.removeEventListener('click', () => {})
    window.parent.postMessage("*", "*")
})

/**
 *  FOLDERS APP
 */

let foldersApp = {
    label: "myFolder",
    open: false,
}

const openFolder = () =>
{
    createApp(foldersApp)
}

/**
 *  TXT APP
 */

let txtApp = {
    label: "randomThing.txt",
    open: false,
}

const openTxt = () =>
{
    createApp(txtApp)
}

/**
 *  NETWORK APP
 */

let networkApp = {
    label: "NETConnect",
    open: false,
}

const openNetwork = () =>
{
    createApp(networkApp)
}

/**
 *  BASIC APP FUNCTIONS
 */

const createApp = (appObject, appType) =>
{
    if(appObject.open === false)
    {
        appObject.open = true
        appObject.appMaximized = false
        appObject.appMinimized = false
        appObject.appFocused = false
        appObject.dragType = "window"

        // Create the main window
        appObject.window = document.createElement('div')
        appObject.window.classList.add('windowApp')
        appObject.window.setAttribute('draggable', false)

        // Focus the window if clicked
        appObject.window.addEventListener('click', () =>
        {
            if(appObject.appFocused === false)
            {
                focusApp(appObject)
            }
        })

        // Set the top bar and enable draggability
        appObject.topBar = document.createElement('div')
        appObject.topBar.classList.add('windowTopBar')
        appObject.topBar.setAttribute('draggable', true)
        appObject.topBar.addEventListener("dragstart", () =>
        {
            dragStart(appObject.dragType, appObject)
            appObject.window.style.width = String(appObject.savedWidth) + "px"
            appObject.window.style.height = String(appObject.savedHeight) + "px"
            appObject.appMaximized = false
            resize()
        })
        appObject.window.appendChild(appObject.topBar)

        // Set all of the elements within the topbar:
        // label, exit, minimize, and maximize buttons.
        appObject.topBarLabel = document.createElement('p')
        appObject.topBarLabel.innerHTML = appObject.label
        appObject.topBarLabel.classList.add('windowTopBarLabel')
        appObject.topBarButtons = document.createElement('div')
        appObject.topBarButtons.classList.add('windowTopBarButtons')
        appObject.exit = document.createElement('img')
        appObject.exit.src = '/textures/static/exitIcon.png'
        appObject.maximize = document.createElement('img')
        appObject.maximize.src = '/textures/static/maximizeIcon.png'
        appObject.minimize = document.createElement('img')
        appObject.minimize.src = '/textures/static/minimizeIcon.png'

        // Event listeners to trigger corresponding functions
        // for exit, maximize, and minimize
        appObject.exit.addEventListener('click', () =>
        {
            exitApp(appObject)
        })

        appObject.maximize.addEventListener('click', () =>
        {
            if(appObject.appMaximized === false)
            {
                appObject.appMaximized = true
                maximizeWindow(appObject.window)
            }
            else if(appObject.appMaximized === true)
            {
                appObject.appMaximized = false
                unmaximizeWindow(appObject.window, appObject.savedWidth, appObject.savedHeight)
            }
        })

        appObject.minimize.addEventListener('click', () =>
        {
            minimizeWindow(appObject)
        })

        // Add elements to topbar
        appObject.topBarButtons.appendChild(appObject.exit)
        appObject.topBarButtons.appendChild(appObject.maximize)
        appObject.topBarButtons.appendChild(appObject.minimize)
        appObject.topBar.appendChild(appObject.topBarLabel)
        appObject.topBar.appendChild(appObject.topBarButtons)

        // set minimize element on the os bottom bar
        appObject.minimizedElement = document.createElement('div')
        appObject.minimizedElement.classList.add('minimizedElement')
        var minimizedElementText = document.createElement('p')
        minimizedElementText.innerHTML = appObject.label
        appObject.minimizedElement.appendChild(minimizedElementText)
        bottomBar.appendChild(appObject.minimizedElement)

        appObject.minimizedElement.addEventListener('click', () =>
        {
            minimizeWindow(appObject)
        })

        // ADD FINISHED APP TO DOCUMENT
        desktop.appendChild(appObject.window)

        // Update variables
        appObject.height = appObject.window.clientHeight
        appObject.width = appObject.window.clientWidth
        appObject.savedWidth = appObject.window.clientWidth
        appObject.savedHeight = appObject.window.clientHeight

        apps.push(appObject)

        if(appType === "folder")
        {
            appObject.folderSidePanel = document.createElement('div')
            appObject.folderSidePanel.classList.add('folderSidePanel')

        }
    }
}

const exitApp = (appObject) =>
{
    appObject.window.remove()
    appObject.topBar.removeEventListener("dragStart", () => {})
    appObject.exit.removeEventListener("click", () => {})
    appObject.maximize.removeEventListener("click", () => {})
    appObject.minimize.removeEventListener("click", () => {})
    appObject.open = false
    appObject.minimizedElement.removeEventListener("click", () => {})
    appObject.minimizedElement.remove()
}

// TO DO : combine these functions into one
const maximizeWindow = (window, type) =>
{
    window.style.left = "50%"
    window.style.top = "50%"
    window.style.width = "100%"
    window.style.height = "100%"
    resize()
}

const unmaximizeWindow = (window, width, height) =>
{
    window.style.left = "50%"
    window.style.top = "50%"
    window.style.width = String(width) + "px"
    window.style.height = String(height) + "px"
}

const minimizeWindow = (appObject) =>
{
    // MINIMIZE WINDOW
    if(appObject.appMinimized === false)
    {
        appObject.appMinimized = true
        appObject.window.style.height = "0"
        appObject.window.style.width = "0"
        appObject.window.style.top = "100%"
        appObject.window.style.left = "50%"

    }
    // UNMAXIMIZE WINDOW
    else if(appObject.appMinimized === true)
    {
        focusApp(appObject)
        appObject.appMinimized = false
        if(appObject.appMaximized === true)
        {
            appObject.window.style.height = "100%"
            appObject.window.style.width = "100%"
        }
        else
        {
            appObject.window.style.height = String(appObject.savedHeight) + "px"
            appObject.window.style.width = String(appObject.savedWidth) + "px"
        }
        appObject.window.style.top = "50%"
        appObject.window.style.left = "50%"
    }
}

const focusApp = (appObject) =>
{
    appObject.appFocused = true
    appObject.window.style.zIndex = "2"

    apps.forEach(element =>
    {
        if(appObject !== element)
        {
            unfocus(element)
        }
    })
}

const unfocus = (appObject) =>
{
    appObject.appFocused = false
    appObject.window.style.zIndex = "1"
}

const resize = () =>
{
    iconWidth = icon.clientWidth
    // if(foldersOpen === true)
    // {
    //     foldersAppHeight = foldersApp.clientHeight
    //     foldersAppWidth = foldersApp.clientWidth
    // }
}

/**
 *  ICON HIGHLIGHT
 */

const unhighlight = () =>
{
    folder1.classList.remove('highlighted')
    txt1.classList.remove('highlighted')
}

folder1.addEventListener('click', () =>
{
    unhighlight()
    folder1.classList.add('highlighted')
})

txt1.addEventListener('click', () =>
{
    unhighlight()
    txt1.classList.add('highlighted')
})

folder1.addEventListener('dblclick', () =>
{
    openFolder()
})

txt1.addEventListener('dblclick', () =>
{
    openTxt()
})

network.addEventListener('dblclick', () =>
{
    openNetwork()
})

desktop.addEventListener('click', () =>
{
    unhighlight()
})

/**
 *  DRAG AND DROP
 */

const drop = (event) =>
{
    event.preventDefault()
    if(draggedElement !== null)
    {
        if(draggedOption !== "window")
        {
            draggedElement.style.left = String(event.clientX - iconWidth / 2) + "px"
            draggedElement.style.top = String(event.clientY - iconWidth / 2) + "px"
        }
        else if(draggedOption === "window")
        {
            draggedElement.window.style.left = String(event.clientX) + "px"
            draggedElement.window.style.top = String(event.clientY + draggedElement.height / 2) + "px"
        }
        draggedElement = null
        draggedOption = null
    } 
}

const dragStart = (event, window) =>
{
    draggedElement = event.srcElement
    if(event === "window")
    {
        draggedOption = "window"
        draggedElement = window
    }
    unhighlight()
}

const dragOver = (event) =>
{
    event.preventDefault()
}

// Boot process

var bootScreen = document.querySelector('.bootScreen')
var bootLoad = document.querySelector('.bootLoad')

let booting = true
let bootInterval = 1
let bootNextInterval = bootInterval

const bootAnimation = (interval) =>
{
    if(params.bootProcess === false)
    {
        bootScreen.remove()
        booting = false
    }
    if(interval === 2)
    {
        bootLoad.innerHTML = "booting up"
    }
    if(interval === 3)
    {
        bootLoad.innerHTML = "booting up."
    }
    if(interval === 4)
    {
        bootLoad.innerHTML = "booting up.."
    }
    if(interval === 5)
    {
        bootLoad.innerHTML = "booting up..."
    }
    if(interval === 6)
    {
        bootLoad.innerHTML = "booting up."
    }
    if(interval === 7)
    {
        bootLoad.innerHTML = "booting up.."
    }
    if(interval === 8)
    {
        bootLoad.innerHTML = "booting up..."
    }
    if(interval === 9)
    {
        bootLoad.innerHTML = "booting up...<br>Logged in as user418."
        document.addEventListener("click", () =>
        {
            document.removeEventListener("keypress", () => {})
            bootLoad.remove()
            bootScreen.remove()
        })
    }
    if(interval === 11)
    {
        bootLoad.innerHTML = "booting up...<br>Logged in as user418. <br> (Click To Continue)"
        booting = false
    }
}

/**
 *  ANIMATIONS & CLOCK
 */

let time = 0

let realTime = new Date()
let hours = null
let minutes = null
let date = null
let month = null
let year = null

let timeUpdate = 60
let nextTimeUpdate = 0

const update = () =>
{
    // Set date, month, year, and time
    if(time === nextTimeUpdate)
    {
        date = realTime.getDate()
        month = realTime.getMonth()
        year = realTime.getFullYear()
        hours = realTime.getHours()
        minutes = realTime.getMinutes()
        nextTimeUpdate += timeUpdate

        let midday = null
        // set dom elements
        if(hours >= 12)
        {
            midday = " PM"
        }
        else
        {
            midday = " AM"
        }
        if(hours > 12)
        {
            hours -= 12
        }
        timeDom.innerHTML = String(hours) + ":" + String(minutes) + midday
        dateDom.innerHTML = String(month + 1) + "/" + String(date) + "/" + String(year)
    }

    // Animation boot process
    if(time === bootNextInterval && booting === true)
    {
        bootNextInterval += bootInterval
        let bootFrame = bootNextInterval / bootInterval
        bootAnimation(bootFrame)
    }

    // Incriment time
    time ++

    // Limit animation frame rate for performance
    setTimeout(() =>
    {
        window.requestAnimationFrame(update)
    }, 500)
}

update()