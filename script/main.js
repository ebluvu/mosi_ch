let VERSION = 1.3
let FRAME_RATE = 400
let SCREEN_WIDTH = 0

class Main extends Component {
    constructor() {
        super()

        this.state = {
            currentTab: 'welcome',
            tabVisibility: { welcome: true },
            tabHistory: [],
            scriptTabType: { type: 'sprite', index: 0 },
            oneTabMode: true,
            showErrorOverlay: false,
            errorState: '',
            spritePalette: [0, 1, 2, 3],
            inventory: {},
            variables: {}
        }

        this.setCurrentTab = (tab, skipHistory) => {
            let { currentTab, tabVisibility, tabHistory, oneTabMode } = this.state

            if (oneTabMode) {
                Object.keys(tabVisibility).forEach(tab => {
                    tabVisibility[tab] = false
                })
            }

            if ((skipHistory instanceof MouseEvent || !skipHistory) && currentTab !== tab) {
                tabHistory.push(currentTab)
            }

            window.setTimeout(() => {
                let tabEl = document.getElementById(tab + 'Panel')
                if (tabEl) tabEl.scrollIntoView({ behavior: 'smooth', inline: 'center'})
            }, 1)

            tabVisibility[tab] = true
            currentTab = tab
            this.setState({ currentTab, tabVisibility, tabHistory })
        }

        this.closeTab = (tab) => {
            let { tabVisibility, tabHistory, oneTabMode } = this.state
            tabVisibility[tab] = false
            let newTab = tabHistory.pop() || 'welcome'
            if (!oneTabMode && !tabVisibility[newTab]) {
                Object.keys(tabVisibility).forEach(tab => {
                    if (tabVisibility[tab]) {
                        newTab = tab
                    }
                })
            }
            this.setCurrentTab(newTab, true)
            this.setState({ tabVisibility })
        }

        this.update = (newState) => {
            this.setState(newState)
        }

        this.openScriptTab = (type) => {
            this.setCurrentTab('script')
            this.setState({ scriptTabType: type })
        }

        this.resize = () => {
            SCREEN_WIDTH = Math.min(400, window.innerWidth) - 16
            let oneTabMode = window.innerWidth < 900
            let tabVisibility = this.state.tabVisibility
            if (oneTabMode) {
                tabVisibility = {}
                tabVisibility[this.state.currentTab] = true
                document.body.className = document.body.className.replace(' multi-tab-mode', '')
                if (!document.body.className.includes('one-tab-mode')) document.body.className += ' one-tab-mode'
            } else {
                document.body.className = document.body.className.replace(' one-tab-mode', '')
                if (!document.body.className.includes('multi-tab-mode')) document.body.className += ' multi-tab-mode'
            }
            this.setState({ oneTabMode, tabVisibility })
        }

        this.save = () => {
            try {
                window.localStorage.setItem('mosi-state', JSON.stringify(this.state))
            } catch(e) {
                console.error('無法儲存編輯器狀態', e)
            }
        }

        this.load = () => {
            try {
                let data = window.localStorage.getItem('mosi-state')
                if (data) {
                    let newState = JSON.parse(data)
                    if (newState.version !== VERSION) {
                        newState.currentTab = 'welcome'
                        newState.tabVisibility = { welcome: true }
                    }
                    let world = newState.world || newState
                    if (!world.inventory) {
                        world.inventory = {}
                        if (world.spriteList) {
                            world.spriteList.forEach(s => { if (s.isItem) world.inventory[s.name] = 0 })
                        }
                    }
                    if (!world.variables) world.variables = {}
                    world.variables = upgradeVariables(world.variables)
                    newState.inventory = { ...world.inventory }
                    newState.variables = { ...world.variables }
                    this.setState(newState)
                    World.import(this, newState)
                    return true
                }
            } catch(e) {
                console.error('無法載入編輯器狀態', e)
            }
        }

        this.updateWorld = (newWorldState) => {
            if (!newWorldState.inventory) {
                newWorldState.inventory = {}
                if (newWorldState.spriteList) {
                    newWorldState.spriteList.forEach(s => { if (s.isItem) newWorldState.inventory[s.name] = 0 })
                }
            }
            if (!newWorldState.variables) newWorldState.variables = {}
            newWorldState.variables = upgradeVariables(newWorldState.variables)
            this.setState(newWorldState)
        }

        this.updateInventory = (itemName, value) => {
            let inventory = { ...this.state.inventory }
            inventory[itemName] = value
            if (this.state.world) {
                let world = { ...this.state.world, inventory: { ...this.state.world.inventory, [itemName]: value } }
                this.setState({ inventory, world })
            } else {
                this.setState({ inventory })
            }
        }

        this.updateVariable = (varName, valueObj) => {
            let variables = { ...this.state.variables }
            // valueObj: { value, type }
            variables[varName] = valueObj
            if (this.state.world) {
                let world = { ...this.state.world, variables: { ...this.state.world.variables, [varName]: valueObj } }
                this.setState({ variables, world })
            } else {
                this.setState({ variables })
            }
        }

        this.onRenameVariable = (oldName, newName) => {
            let variables = { ...this.state.variables }
            let base = newName
            let idx = 1
            if (this.state.world) {
                let worldVars = { ...this.state.world.variables }
                while (variables.hasOwnProperty(newName) || worldVars.hasOwnProperty(newName)) {
                    newName = base + idx
                    idx++
                }
                variables[newName] = variables[oldName]
                delete variables[oldName]
                worldVars[newName] = worldVars[oldName]
                delete worldVars[oldName]
                let world = { ...this.state.world, variables: worldVars }
                this.setState({ variables, world })
            } else {
                while (variables.hasOwnProperty(newName)) {
                    newName = base + idx
                    idx++
                }
                variables[newName] = variables[oldName]
                delete variables[oldName]
                this.setState({ variables })
            }
        }

        let origReset = World.reset
        World.reset = (that) => {
            origReset(that)
            let world = that.state.world || that.state
            if (!world.variables) world.variables = {}
            world.variables = upgradeVariables(world.variables)
            that.setState({ inventory: { ...world.inventory }, variables: { ...world.variables } })
        }

        // load previous world or create a new one
        let loadedSuccessfully = this.load()
        if (!loadedSuccessfully) {
            World.reset(this)
        }

        // inventory 與精靈同步
        this.syncInventoryWithSprites = (spriteList = this.state.spriteList, inventory = this.state.inventory) => {
            let newInventory = {}
            spriteList.forEach(sprite => {
                if (sprite.isItem) {
                    // 若舊 inventory 有舊名，保留數值
                    newInventory[sprite.name] = inventory[sprite.name] || 0
                }
            })
            // 同步到 state 及 world
            let world = this.state.world ? { ...this.state.world, inventory: { ...newInventory } } : null
            this.setState(world ? { inventory: { ...newInventory }, world } : { inventory: { ...newInventory } })
        }

        // 包裝 Sprite.add/remove/rename
        const origAdd = Sprite.add
        Sprite.add = (that, sprite) => {
            origAdd(that, sprite)
            setTimeout(() => {
                if (that.syncInventoryWithSprites) that.syncInventoryWithSprites(that.state.spriteList, that.state.inventory)
            }, 0)
        }
        const origRemove = Sprite.remove
        Sprite.remove = (that, spriteIndex) => {
            origRemove(that, spriteIndex)
            setTimeout(() => {
                if (that.syncInventoryWithSprites) that.syncInventoryWithSprites(that.state.spriteList, that.state.inventory)
            }, 0)
        }
        const origRename = Sprite.rename
        Sprite.rename = (that, spriteIndex, newName) => {
            let spriteList = that.state.spriteList.slice()
            let oldName = spriteList[spriteIndex].name
            origRename(that, spriteIndex, newName)
            setTimeout(() => {
                if (that.syncInventoryWithSprites) {
                    // 將舊名稱的數值轉移到新名稱
                    let inventory = { ...that.state.inventory }
                    let sprite = that.state.spriteList[spriteIndex]
                    if (sprite.isItem && oldName !== newName) {
                        inventory[newName] = inventory[oldName] || 0
                        delete inventory[oldName]
                    }
                    that.syncInventoryWithSprites(that.state.spriteList, inventory)
                }
            }, 0)
        }

        const origSetIsItem = Sprite.setIsItem
        Sprite.setIsItem = (that, spriteIndex, newValue) => {
            origSetIsItem(that, spriteIndex, newValue)
            setTimeout(() => {
                if (that.syncInventoryWithSprites) that.syncInventoryWithSprites(that.state.spriteList, that.state.inventory)
            }, 0)
        }
    }

    componentDidMount() {
        window.addEventListener('resize', this.resize, true)
        this.resize()
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize)
    }

    componentDidUpdate() {
        this.save()
    }

    render({}, {
        currentTab,
        tabVisibility,
        scriptTabType,
        oneTabMode,

        showErrorOverlay,
        errorMessage,

        currentSpriteIndex,
        spriteList,
        spriteWidth,
        spriteHeight,

        currentRoomIndex,
        roomList,
        roomWidth,
        roomHeight,

        worldWidth,
        worldHeight,
        worldName,
        worldWrapHorizontal,
        worldWrapVertical,
        worldScriptList,

        currentPaletteIndex,
        paletteList = [],

        currentMusicIndex,
        musicList = [],

        fontResolution,
        fontDirection,
        fontData,

        modList,
        spritePalette,

        inventory = {},
        variables = {}
    }) {
        let currentRoom = roomList[currentRoomIndex]

        let roomPaletteName = currentRoom.paletteName
        let roomPaletteIndex = paletteList.findIndex(p => p.name === roomPaletteName)
        let roomPalette = paletteList[roomPaletteIndex]

        let roomMusicName = currentRoom.musicName
        let roomMusicIndex = musicList.findIndex(p => p.name === roomMusicName)

        let currentSprite = spriteList[currentSpriteIndex]

        let backButton = !oneTabMode ? null :
            iconButton({
                title: 'back',
                className: 'simple',
                onclick: this.closeTab.bind(this, currentTab)
            }, 'back')

        let playTab = !tabVisibility.play ? null :
            h(PlayPanel, {
                closeTab: this.closeTab.bind(this, 'play'),
                world: this.state
            })

        let welcomeTab = !tabVisibility.welcome ? null :
            h(WelcomePanel, {
                closeTab: this.closeTab.bind(this, 'welcome'),
                getStarted: () => {
                    this.closeTab('welcome')
                    this.setCurrentTab('room')
                }
            })

        let worldTab = !tabVisibility.world ? null :
            h(WorldPanel, {
                closeTab: this.closeTab.bind(this, 'world'),
                openScriptTab: this.openScriptTab.bind(this, 'world'),

                renameWorld: World.rename.bind(this, this),
                importWorld: World.import.bind(this, this),
                exportWorld: World.export.bind(this, this.state),
                randomWorld: World.random.bind(this, this, this.state),
                resizeWorld: World.resize.bind(this, this, this.state),
                clearWorld: World.clear.bind(this, this, this.state),
                resetWorld: World.reset.bind(this, this, this.state),
                setWrapHorizontal: World.setWrapHorizontal.bind(this, this),
                setWrapVertical: World.setWrapVertical.bind(this, this),
                selectRoom: Room.select.bind(this, this),
                startRoomIndex: Room.roomWithAvatar(this),
                setFontResolution: fontResolution => this.setState({ fontResolution }),
                setFontDirection: fontDirection => this.setState({ fontDirection }),
                setFontData: fontData => this.setState({ fontData }),
                addMod: Mod.add.bind(this, this),
                renameMod: Mod.rename.bind(this, this),
                changeModType: Mod.changeType.bind(this, this),
                updateModCode: Mod.updateCode.bind(this, this),
                removeMod: Mod.remove.bind(this, this),

                fontResolution,
                fontDirection,
                fontData,
                currentRoomIndex,
                roomList,
                roomWidth,
                roomHeight,
                worldWidth,
                worldHeight,
                worldName,
                worldWrapHorizontal,
                worldWrapVertical,
                worldScriptList,
                spriteList,
                spriteWidth,
                spriteHeight,
                paletteList,
                modList
            })

        let roomTab = !tabVisibility.room ? null :
            h(RoomPanel, {
                closeTab: this.closeTab.bind(this, 'room'),
                openScriptTab: this.openScriptTab.bind(this, 'room'),

                renameRoom: Room.rename.bind(this, this, currentRoomIndex),
                importRoom: Room.import.bind(this, this, currentRoomIndex),
                exportRoom: Room.export.bind(this, this, currentRoomIndex),
                clearRoom: Room.clear.bind(this, this, currentRoomIndex),
                randomRoom: Room.random.bind(this, this, currentRoomIndex),
                createRoomGif: Room.createGif.bind(this, this, currentRoomIndex),
                addTile: Room.addTile.bind(this, this, currentRoomIndex),
                clearTile: Room.clearTile.bind(this, this, currentRoomIndex),

                setMusic: Room.setMusic.bind(this, this, currentRoomIndex),
                editMusic: Music.select.bind(this, this, roomMusicIndex, 'music'),
                addMusic: Music.add.bind(this, this),
                importMusic: Music.import.bind(this, this),

                setPalette: Room.setPalette.bind(this, this, currentRoomIndex),
                editPalette: Palette.select.bind(this, this, roomPaletteIndex, 'palette'),
                addPalette: Palette.add.bind(this, this),
                importPalette: Palette.import.bind(this, this),

                selectSprite: Sprite.select.bind(this, this),
                editSprite: Sprite.select.bind(this, this, currentSpriteIndex, 'sprite'),
                addSprite: Sprite.add.bind(this, this),
                importSprite: Sprite.import.bind(this, this),

                room: currentRoom,
                roomWidth,
                roomHeight,
                spriteWidth,
                spriteHeight,
                spriteList,
                currentMusicIndex: roomMusicIndex,
                currentPaletteIndex: roomPaletteIndex,
                currentSpriteIndex,
                musicList,
                paletteList,

                roomNorth: Room.getNeighbor(this, currentRoomIndex, 'north'),
                roomEast: Room.getNeighbor(this, currentRoomIndex, 'east'),
                roomSouth: Room.getNeighbor(this, currentRoomIndex, 'south'),
                roomWest: Room.getNeighbor(this, currentRoomIndex, 'west'),
                selectRoom: Room.select.bind(this, this),

                spritePalette
            })

        let spriteListTab = !tabVisibility.spriteList ? null :
            h(SpriteListPanel, {
                closeTab: this.closeTab.bind(this, 'spriteList'),
                selectSprite: Sprite.select.bind(this, this),
                addSprite: Sprite.add.bind(this, this),
                importSprite: Sprite.import.bind(this, this),
                spriteList,
                currentSpriteIndex,
                colorList: roomPalette.colorList
            })

        let spriteTab = !tabVisibility.sprite ? null :
            h(SpritePanel, {
                closeTab: this.closeTab.bind(this, 'sprite'),
                openScriptTab: this.openScriptTab.bind(this, 'sprite'),

                renameSprite: Sprite.rename.bind(this, this, currentSpriteIndex),
                setSpriteIsWall: Sprite.setIsWall.bind(this, this, currentSpriteIndex),
                setSpriteIsItem: Sprite.setIsItem.bind(this, this, currentSpriteIndex),
                setSpriteIsTransparent: Sprite.setIsTransparent.bind(this, this, currentSpriteIndex),
                setColorIndex: Sprite.setColorIndex.bind(this, this, currentSpriteIndex),
                exportSprite: Sprite.export.bind(this, this, currentSpriteIndex),
                convertSprite: Sprite.convertToAvatar.bind(this, this, currentSpriteIndex),
                removeSprite: Sprite.remove.bind(this, this, currentSpriteIndex),
                createSpriteGif: Sprite.createGif.bind(this, this, currentSpriteIndex),
                duplicateSprite: Sprite.add.bind(this, this, currentSprite),
                addFrame: Sprite.addFrame.bind(this, this, currentSpriteIndex),
                removeFrame: Sprite.removeFrame.bind(this, this, currentSpriteIndex),
                updateFrame: Sprite.updateFrame.bind(this, this, currentSpriteIndex),
                sprite: currentSprite,
                colorList: roomPalette.colorList
            })

        let scriptClass
        if (scriptTabType === 'world') scriptClass = World
        if (scriptTabType === 'room') scriptClass = Room
        if (scriptTabType === 'sprite') scriptClass = Sprite

        let scriptList
        if (scriptTabType === 'world') scriptList = worldScriptList
        if (scriptTabType === 'room') scriptList = currentRoom.scriptList
        if (scriptTabType === 'sprite') scriptList = currentSprite.scriptList

        let scriptIndex = 0
        if (scriptTabType === 'room') scriptIndex = currentRoomIndex
        if (scriptTabType === 'sprite') scriptIndex = currentSpriteIndex

        let scriptTab = !tabVisibility.script ? null :
            h(ScriptPanel, {
                closeTab: this.closeTab.bind(this, 'script'),
                updateScript: scriptClass ? scriptClass.updateScript.bind(this, this, scriptIndex) : null,
                scriptList
            })

        let paletteListTab = !tabVisibility.paletteList ? null :
            h(PaletteListPanel, {
                closeTab: this.closeTab.bind(this, 'paletteList'),
                selectPalette: Palette.select.bind(this, this),
                addPalette: Palette.add.bind(this, this),
                importPalette: Palette.import.bind(this, this),
                currentPaletteIndex: roomPaletteIndex,
                paletteList
            })

        let paletteTab = !tabVisibility.palette ? null :
            h(PalettePanel, {
                closeTab: this.closeTab.bind(this, 'palette'),
                renamePalette: Palette.rename.bind(this, this, currentPaletteIndex),
                removePalette: Palette.remove.bind(this, this, currentPaletteIndex),
                randomPalette: Palette.random.bind(this, this, currentPaletteIndex),
                exportPalette: Palette.export.bind(this, this, currentPaletteIndex),
                duplicatePalette: Palette.add.bind(this, this, paletteList[currentPaletteIndex]),
                addColor: Palette.addColor.bind(this, this, currentPaletteIndex),
                updateColor: Palette.updateColor.bind(this, this, currentPaletteIndex),
                removeColor: Palette.removeColor.bind(this, this, currentPaletteIndex),
                currentPaletteIndex,
                paletteList,
                palette: paletteList[currentPaletteIndex],
            })

        let musicListTab = !tabVisibility.musicList ? null :
            h(MusicListPanel, {
                closeTab: this.closeTab.bind(this, 'musicList'),
                editMusic: Music.select.bind(this, this),
                selectMusic: Music.select.bind(this, this),
                addMusic: Music.add.bind(this, this),
                importMusic: Music.import.bind(this, this),
                currentMusicIndex: roomMusicIndex,
                musicList
            })

        let musicTab = !tabVisibility.music ? null :
            h(MusicPanel, {
                closeTab: this.closeTab.bind(this, 'music'),
                renameMusic: Music.rename.bind(this, this, currentMusicIndex),
                removeMusic: Music.remove.bind(this, this, currentMusicIndex),
                randomMusic: Music.random.bind(this, this, currentMusicIndex),
                clearMusic: Music.clear.bind(this, this, currentMusicIndex),
                exportMusic: Music.export.bind(this, this, currentMusicIndex),
                duplicateMusic: Music.add.bind(this, this, musicList[currentMusicIndex]),
                setNote: Music.setNote.bind(this, this, currentMusicIndex),
                setBeat: Music.setBeat.bind(this, this, currentMusicIndex),
                currentMusicIndex,
                musicList,
                music: musicList[currentMusicIndex],
            })

        let inventoryTab = !tabVisibility.inventory ? null :
            h(InventoryPanel, {
                closeTab: this.closeTab.bind(this, 'inventory'),
                spriteList,
                inventory,
                variables,
                readOnly: false,
                updateInventory: this.updateInventory,
                updateVariable: this.updateVariable,
                onRenameVariable: this.onRenameVariable,
                onRemoveVariable: varName => {
                    let variables = { ...this.state.variables }
                    delete variables[varName]
                    let world = this.state.world ? { ...this.state.world, variables: { ...this.state.world.variables } } : null
                    if (world) delete world.variables[varName]
                    this.setState(world ? { variables, world } : { variables })
                }
            })

        let errorOverlay = !showErrorOverlay ? null :
            h(ErrorOverlay, {
                errorMessage,
                closeOverlay: () => this.setState({ showErrorOverlay: false })
            })

        let introButtonSelected = tabVisibility.welcome
        let worldButtonSelected = tabVisibility.world || tabVisibility.room || (tabVisibility.script && scriptTabType !== 'sprite')
        let spriteButtonSelected = tabVisibility.sprite || tabVisibility.spriteList || (tabVisibility.script && scriptTabType === 'sprite')
        let paletteButtonSelected = tabVisibility.palette || tabVisibility.paletteList
        let musicButtonSelected = tabVisibility.music || tabVisibility.musicList

        let header = tabVisibility.play ? null :
            div({ className: 'editor-header row' }, [
                backButton,
                fill(),
                iconButton({
                    title: 'world',
                    className: 'simple' + (worldButtonSelected ? ' selected' : ''),
                    onclick: () => {
                        if (tabVisibility.room) {
                            this.setCurrentTab('world')
                        } else {
                            this.setCurrentTab('room')
                        }
                    }
                }, 'world'),
                iconButton({
                    title: 'sprites',
                    className: 'simple' + (spriteButtonSelected ? ' selected' : ''),
                    onclick: () => {
                        if (tabVisibility.sprite) {
                            this.setCurrentTab('spriteList')
                        } else {
                            this.setCurrentTab('sprite')
                        }
                    }
                }, 'sprites'),
                iconButton({
                    title: 'inventory',
                    className: 'simple' + (tabVisibility.inventory ? ' selected' : ''),
                    onclick: () => this.setCurrentTab('inventory')
                }, 'item'),
                iconButton({
                    title: 'colors',
                    className: 'simple' + (paletteButtonSelected ? ' selected' : ''),
                    onclick: () => {
                        if (tabVisibility.palette) {
                            this.setCurrentTab('paletteList')
                        } else {
                            this.setCurrentTab('palette')
                        }
                    }
                }, 'palettes'),
                iconButton({
                    title: 'music',
                    className: 'simple' + (musicButtonSelected ? ' selected' : ''),
                    onclick: () => {
                        if (tabVisibility.music) {
                            this.setCurrentTab('musicList')
                        } else {
                            this.setCurrentTab('music')
                        }
                    }
                }, 'music'),
                fill(),
                iconButton({
                    title: 'play',
                    className: 'simple',
                    onclick: () => this.setCurrentTab('play')
                }, 'play-game')
            ])

        if (tabVisibility.play) {
            return playTab
        }

        // main
        return div({ className: 'main' }, [
            header,
            div({ id: 'tabs', className: 'tabs' }, [
                welcomeTab,
                worldTab,
                roomTab,
                spriteListTab,
                spriteTab,
                scriptTab,
                paletteListTab,
                paletteTab,
                musicListTab,
                musicTab,
                inventoryTab
            ]),
            errorOverlay
        ])
    }
}

window.onload = () => {
    MusicPlayer.init()

    render(h(Main), document.body)
}

function upgradeVariables(vars) {
    let upgraded = {}
    for (let k in vars) {
        let v = vars[k]
        if (typeof v === 'object' && v !== null && 'value' in v && 'type' in v) {
            upgraded[k] = v
        } else {
            upgraded[k] = { value: v, type: typeof v === 'boolean' ? 'boolean' : 'number' }
        }
    }
    return upgraded
}