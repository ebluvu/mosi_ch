class RoomPanel extends Component {
    constructor() {
        super()
        this.state = {
            showGrid: false,
            showDialogSpriteOverlay: false
        }
    }

    render({
        closeTab,
        openScriptTab,
        
        renameRoom,
        importRoom,
        exportRoom,
        clearRoom,
        randomRoom,
        createRoomGif,

        addTile,
        clearTile,

        setMusic,
        editMusic,
        addMusic,
        importMusic,

        setPalette,
        editPalette,
        addPalette,
        importPalette,

        selectSprite,
        editSprite,
        addSprite,
        importSprite,

        room,
        roomWidth,
        roomHeight,
        spriteWidth,
        spriteHeight,
        spriteList,
        currentMusicIndex,
        currentPaletteIndex,
        currentSpriteIndex,
        musicList,
        paletteList,

        roomNorth,
        roomEast,
        roomSouth,
        roomWest,
        selectRoom,

        spritePalette
    }, {
        showClearOverlay,
        showImportOverlay,
        showExportOverlay,
        showGifOverlay,
        showMusicOverlay,
        showPaletteOverlay,
        showSpriteOverlay,
        showRandomOverlay,
        showExtrasOverlay,
        showGrid
    }) {
        let sprite = spriteList[currentSpriteIndex]
        let currentMusic = musicList[currentMusicIndex]
        let currentPalette = paletteList[currentPaletteIndex]
        let colorList = currentPalette.colorList

        let extrasButton = button({
            className: 'fill',
            onclick: () => this.setState({ showExtrasOverlay: true })
        }, room.name)

        let nameTextbox = textbox({
            placeholder: 'room name',
            value: room.name,
            onchange: e => renameRoom(e.target.value)
        })
    
        let clearButton = button({
            onclick: () => this.setState({ showExtrasOverlay: false, showClearOverlay: true })
        }, '清除房間')

        let clearOverlay = !showClearOverlay ? null :
            h(RemoveOverlay, {
                header: '清除房間?',
                closeOverlay: () => this.setState({ showClearOverlay: false }),
                remove: () => {
                    clearRoom()
                    this.setState({ showClearOverlay: false })
                }
            })

        let randomButton = button({
            onclick: () => this.setState({ showExtrasOverlay: false, showRandomOverlay: true })
        }, '隨機生成')

        let randomOverlay = !showRandomOverlay ? null :
            h(RemoveOverlay, {
                header: '隨機生成房間?',
                closeOverlay: () => this.setState({ showRandomOverlay: false }),
                remove: () => {
                    randomRoom()
                    this.setState({ showRandomOverlay: false })
                }
            })

        let importButton = button({
            onclick: () => this.setState({ showExtrasOverlay: false, showImportOverlay: true })
        }, '匯入')

        let importOverlay = !showImportOverlay ? null :
            h(ImportOverlay, {
                header: '匯入房間',
                onImport: data => {
                    importRoom(data)
                    this.setState({ showImportOverlay: false })
                },
                fileType: '.mosiroom',
                closeOverlay: () => this.setState({ showImportOverlay: false })
            })
    
        let exportButton = button({
            onclick: () => this.setState({ showExtrasOverlay: false, showExportOverlay: true })
        }, '匯出')

        let exportOverlay = !showExportOverlay ? null :
            h(ExportOverlay, {
                header: '匯出房間',
                fileName: `${room.name || 'untitled'}.mosiroom`,
                data: exportRoom(),
                closeOverlay: () => this.setState({ showExportOverlay: false })
            })
    
        let gifButton = button({
            onclick: () => this.setState({ showExtrasOverlay: false, showGifOverlay: true })
        }, '生成gif')

        let gifOverlay = !showGifOverlay ? null :
            h(GifOverlay, {
                colorList,
                createGif: createRoomGif,
                maxScale: 4,
                closeOverlay: () => this.setState({ showGifOverlay: false })
            })

        let extrasOverlay = !showExtrasOverlay ? null :
            h(ExtrasOverlay, {
                header: '房間設定',
                buttons: [
                    nameTextbox,
                    hr(),
                    gifButton,
                    hr(),
                    exportButton,
                    importButton,
                    randomButton,
                    clearButton
                ],
                closeOverlay: () => this.setState({ showExtrasOverlay: false })
            })
    
        let scriptList = Object.keys(room.scriptList).map(key => room.scriptList[key])
        let hasScripts = scriptList.find(script => !!script)
        let scriptButton = iconButton({
            title: 'script',
            className: 'simple' + (hasScripts ? ' selected' : ''),
            onclick: openScriptTab
        }, 'script')

        let currentMusicButton =
            musicButton({
                className: 'simple',
                onclick: () => this.setState({ showMusicOverlay: true }),
                music: currentMusic,
                isSmall: true
            })
            
        let musicOverlay = !showMusicOverlay ? null :
            h(MusicListOverlay, {
                closeOverlay: () => this.setState({ showMusicOverlay: false }),
                selectMusic: musicIndex => {
                    setMusic(musicIndex)
                    this.setState({ showMusicOverlay: false })
                },
                editMusic: () => {
                    editMusic()
                    this.setState({ showMusicOverlay: false })
                },
                addMusic: music => {
                    addMusic(music)
                    this.setState({ showMusicOverlay: false })
                },
                importMusic: musicData => {
                    importMusic(musicData)
                    this.setState({ showMusicOverlay: false })
                },
                currentMusicIndex,
                musicList
            })

        let currentPaletteButton =
            paletteButton({
                className: 'simple',
                onclick: () => this.setState({ showPaletteOverlay: true }),
                palette: currentPalette
            })
            
        let paletteOverlay = !showPaletteOverlay ? null :
            h(PaletteListOverlay, {
                closeOverlay: () => this.setState({ showPaletteOverlay: false }),
                selectPalette: paletteIndex => {
                    setPalette(paletteIndex)
                    this.setState({ showPaletteOverlay: false })
                },
                editPalette: () => {
                    editPalette()
                    this.setState({ showPaletteOverlay: false })
                },
                addPalette: palette => {
                    addPalette(palette)
                    this.setState({ showPaletteOverlay: false })
                },
                importPalette: paletteData => {
                    importPalette(paletteData)
                    this.setState({ showPaletteOverlay: false })
                },
                currentPaletteIndex,
                paletteList
            })

        let roomGridProps = {
            className: 'initial-focus',
            roomWidth,
            roomHeight,
            spriteWidth,
            spriteHeight,
            spriteList,
            currentSpriteName: sprite.name,
            tileList: room.tileList,
            isAnimated: true,
            spriteIsTransparent: sprite.isTransparent,
            colorList,
            showGrid: this.state.showGrid,
            showDialogSpriteOverlay: this.state.showDialogSpriteOverlay,
            dialogSpriteFilter: s => s && s.scriptList && s.scriptList['on-push'] && s.scriptList['on-push'].trim() !== '',
            onDialogSpriteSelect: spriteIndex => {
                selectSprite(spriteIndex, 'script')
                this.setCurrentTab && this.setCurrentTab('script')
                // 不要自動關閉 showDialogSpriteOverlay
            }
        }
        if (!this.state.showDialogSpriteOverlay) {
            roomGridProps.drawTile = (x, y) => addTile(x, y, currentSpriteIndex)
            roomGridProps.eraseTile = (x, y) => clearTile(x, y)
        }
        let roomGrid = h(RoomGrid, roomGridProps)

        let roomSliceNorth = h(RoomSlice, {
            sliceHorizontal: true,
            sliceIndex: roomHeight - 1,
            roomWidth,
            roomHeight,
            spriteWidth,
            spriteHeight,
            spriteList,
            colorList: roomNorth ? Palette.find(roomNorth.room.paletteName, paletteList).colorList : null,
            tileList: roomNorth ? roomNorth.room.tileList : null,
            onclick: roomNorth ? (() => selectRoom(roomNorth.roomIndex)) : null,
            arrow: roomNorth ? '▲' : ''
        })

        let roomSliceEast = h(RoomSlice, {
            sliceVertical: true,
            sliceIndex: 0,
            roomWidth,
            roomHeight,
            spriteWidth,
            spriteHeight,
            spriteList,
            colorList: roomEast ? Palette.find(roomEast.room.paletteName, paletteList).colorList : null,
            tileList: roomEast ? roomEast.room.tileList : null,
            onclick: roomEast ? (() => selectRoom(roomEast.roomIndex)) : null,
            arrow: roomEast ? '▶' : ''
        })

        let roomSliceSouth = h(RoomSlice, {
            sliceHorizontal: true,
            sliceIndex: 0,
            roomWidth,
            roomHeight,
            spriteWidth,
            spriteHeight,
            spriteList,
            colorList: roomSouth ? Palette.find(roomSouth.room.paletteName, paletteList).colorList : null,
            tileList: roomSouth ? roomSouth.room.tileList : null,
            onclick: roomSouth ? (() => selectRoom(roomSouth.roomIndex)) : null,
            arrow: roomSouth ? '▼' : ''
        })

        let roomSliceWest = h(RoomSlice, {
            sliceVertical: true,
            sliceIndex: roomWidth - 1,
            roomWidth,
            roomHeight,
            spriteWidth,
            spriteHeight,
            spriteList,
            colorList: roomWest ? Palette.find(roomWest.room.paletteName, paletteList).colorList : null,
            tileList: roomWest ? roomWest.room.tileList : null,
            onclick: roomWest ? (() => selectRoom(roomWest.roomIndex)) : null,
            arrow: roomWest ? '◀' : ''
        })

        let spritePaletteButtons = spritePalette.slice(-6).map(spriteIndex => {
            if (!spriteList[spriteIndex]) return

            return spriteButton({
                className: 'simple',
                isSelected: spriteIndex === currentSpriteIndex,
                onclick: () => {
                    if (spriteIndex === currentSpriteIndex) {
                        editSprite()
                    } else {
                        selectSprite(spriteIndex)
                    }
                },
                sprite: spriteList[spriteIndex],
                colorList
            })
        })

        let gridToggleButton = iconButton({
            title: '格線',
            className: 'simple' + (showGrid ? ' selected' : ''),
            onclick: () => this.setState(prevState => ({ showGrid: !prevState.showGrid }))
        }, 'grid')

        let dialogSpriteToggleButton = iconButton({
            title: '精靈對話',
            className: 'simple' + (this.state.showDialogSpriteOverlay ? ' selected' : ''),
            onclick: () => this.setState(prevState => ({ showDialogSpriteOverlay: !prevState.showDialogSpriteOverlay }))
        }, 'sprites')

        let addSpriteToPaletteButton = iconButton({
            onclick: () => this.setState({ showSpriteOverlay: true }),
        }, 'add')
            
        let spriteOverlay = !showSpriteOverlay ? null :
            h(SpriteListOverlay, {
                closeOverlay: () => this.setState({ showSpriteOverlay: false }),
                selectSprite: spriteIndex => {
                    selectSprite(spriteIndex)
                    this.setState({ showSpriteOverlay: false })
                },
                editSprite: () => {
                    editSprite()
                    this.setState({ showSpriteOverlay: false })
                },
                addSprite: sprite => {
                    addSprite(sprite)
                    this.setState({ showSpriteOverlay: false })
                },
                importSprite: spriteData => {
                    importSprite(spriteData)
                    this.setState({ showSpriteOverlay: false })
                },
                spriteList,
                currentSpriteIndex,
                colorList
            })

        return panel({ header: 'room', id: 'roomPanel', closeTab }, [
            row([
                extrasButton,
                scriptButton,
                currentMusicButton,
                currentPaletteButton
            ]),
            div({ class: 'grid-container room-block' }, [
                row([ roomSliceNorth ]),
                row([ roomSliceWest, roomGrid, roomSliceEast ]),
                row([ roomSliceSouth ])
            ]),
            row([
                spritePaletteButtons,
                fill(),
                gridToggleButton,
                dialogSpriteToggleButton,
                addSpriteToPaletteButton
            ]),
            helpLink('9b81d73015fc40a688f07e8f52186320'),
            extrasOverlay,
            clearOverlay,
            importOverlay,
            exportOverlay,
            gifOverlay,
            musicOverlay,
            paletteOverlay,
            spriteOverlay,
            randomOverlay
        ])
    }
}
