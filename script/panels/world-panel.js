class WorldPanel extends Component {
    constructor() {
        super()
        this.state = {}
    }

    render({
        closeTab,
        openScriptTab,

        renameWorld,
        importWorld,
        exportWorld,
        randomWorld,
        resizeWorld,
        clearWorld,
        resetWorld,
        setWrapHorizontal,
        setWrapVertical,
        setMainPaletteIndex,
        setMainBgColorIndex,
        setMainTextColorIndex,

        selectRoom,
        startRoomIndex,
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

        setFontResolution,
        setFontDirection,
        setFontData,
        setTextScale,
        fontResolution,
        fontDirection,
        fontData,
        textScale,
        
        modList,
        addMod,
        renameMod,
        changeModType,
        updateModCode,
        removeMod,

        // 主體顏色設定
        mainPaletteIndex,
        mainBgColorIndex,
        mainTextColorIndex,
        textboxSkin
    }, {
        showImportOverlay,
        showExportOverlay,
        showRandomOverlay,
        showClearOverlay,
        showResetOverlay,
        showExtrasOverlay,
        showFontOverlay,
        showResizeOverlay,
        showModsOverlay,
        showMainColorOverlay
    }) {

        let nameButton = button({
            className: 'fill',
            onclick: () => this.setState({ showExtrasOverlay: true })
        }, worldName)

        let nameTextbox = textbox({
            placeholder: 'name of world',
            value: worldName,
            onchange: e => renameWorld(e.target.value)
        })

        let importButton = button({
            onclick: () => this.setState({ showExtrasOverlay: false, showImportOverlay: true })
        }, '匯入')

        let importOverlay = !showImportOverlay ? null :
            h(ImportOverlay, {
                header: '匯入世界',
                onImport: data => {
                    importWorld(data)
                    this.setState({ showImportOverlay: false })
                },
                fileType: '.mosi',
                closeOverlay: () => this.setState({ showImportOverlay: false })
            })

        let exportButton = button({
            onclick: () => this.setState({ showExtrasOverlay: false, showExportOverlay: true })
        }, '匯出')

        let exportOverlay = !showExportOverlay ? null :
            h(ExportOverlay, {
                header: '匯出世界',
                fileName: `${worldName || 'untitled'}.mosi`,
                data: exportWorld(),
                closeOverlay: () => this.setState({ showExportOverlay: false })
            })
    
        let resetButton = button({
                onclick: () => this.setState({ showExtrasOverlay: false, showResetOverlay: true }),
            }, '全部重置')

        let resetOverlay = !showResetOverlay ? null :
            h(RemoveOverlay, {
                header: '重置世界?',
                closeOverlay: () => this.setState({ showResetOverlay: false }),
                remove: () => {
                    resetWorld()
                    this.setState({ showResetOverlay: false })
                }
            })

        let randomButton = button({
            onclick: () => this.setState({ showExtrasOverlay: false, showRandomOverlay: true })
        }, '隨機生成')

        let randomOverlay = !showRandomOverlay ? null :
            h(RemoveOverlay, {
                header: '在世界裡隨機生成所有房間?',
                closeOverlay: () => this.setState({ showRandomOverlay: false }),
                remove: () => {
                    randomWorld()
                    this.setState({ showRandomOverlay: false })
                }
            })

        let clearButton = button({
            onclick: () => this.setState({ showExtrasOverlay: false, showClearOverlay: true })
        }, '清除')

        let clearOverlay = !showClearOverlay ? null :
            h(RemoveOverlay, {
                header: '清除世界裡的所有房間?',
                closeOverlay: () => this.setState({ showClearOverlay: false }),
                remove: () => {
                    clearWorld()
                    this.setState({ showClearOverlay: false })
                }
            })

        let modsButton = button({
            onclick: () => this.setState({ showExtrasOverlay: false, showModsOverlay: true })
        }, '自訂指令')

        let modsOverlay = !showModsOverlay ? null :
            h(ModsOverlay, {
                closeOverlay: () => this.setState({ showModsOverlay: false }),
                modList,
                addMod,
                renameMod,
                changeModType,
                updateModCode,
                removeMod
            })

        let resizeButton = button({
            onclick: () => this.setState({ showExtrasOverlay: false, showResizeOverlay: true })
        }, '調整尺寸')

        let resizeOverlay = !showResizeOverlay ? null :
            h(ResizeWorldOverlay, {
                worldWidth,
                worldHeight,
                roomWidth,
                roomHeight,
                spriteWidth,
                spriteHeight,
                resize: (props) => {
                    resizeWorld(props)
                    this.setState({ showResizeOverlay: false })
                },
                closeOverlay: () => this.setState({ showResizeOverlay: false })
            })

        let fontButton = button({
            onclick: () => this.setState({ showExtrasOverlay: false, showFontOverlay: true })
        }, '字體設定')

        let setTextboxSkin = this.props.setTextboxSkin;
        let fontOverlay = !showFontOverlay ? null :
            h(FontOverlay, {
                setTextboxSkin: setTextboxSkin,
                textboxSkin: textboxSkin,
                fontResolution,
                fontDirection,
                fontData,
                textScale,
                closeOverlay: () => this.setState({ showFontOverlay: false }),
                setFontResolution,
                setFontDirection,
                setFontData,
                setTextScale
            })

        let mainColorButton = button({
            onclick: () => this.setState({ showExtrasOverlay: false, showMainColorOverlay: true })
        }, '主體顏色')

        let mainColorOverlay = !showMainColorOverlay ? null :
            h(MainColorOverlay, {
                paletteList,
                mainPaletteIndex,
                mainBgColorIndex,
                mainTextColorIndex,
                setMainPaletteIndex,
                setMainBgColorIndex,
                setMainTextColorIndex,
                closeOverlay: () => this.setState({ showMainColorOverlay: false })
            })

        let extrasOverlay = !showExtrasOverlay ? null :
            h(ExtrasOverlay, {
                header: '世界設定',
                buttons: [
                    nameTextbox,
                    hr(),
                    resizeButton,
                    fontButton,
                    mainColorButton,
                    modsButton,
                    hr(),
                    exportButton,
                    importButton,
                    randomButton,
                    clearButton,
                    resetButton
                ],
                closeOverlay: () => this.setState({ showExtrasOverlay: false })
            })
    
        let scriptList = Object.keys(worldScriptList).map(key => worldScriptList[key])
        let hasScripts = scriptList.find(script => !!script)
        let scriptButton = iconButton({
            title: 'script',
            className: 'simple' + (hasScripts ? ' selected' : ''),
            onclick: openScriptTab
        }, 'script')

        let wrapHorizontalButton = iconButton({
            title: 'wrap horizontal',
            className: 'simple' + (worldWrapHorizontal ? ' selected' : ''),
            onclick: () => setWrapHorizontal(!worldWrapHorizontal)
        }, 'wrap-h')

        let wrapVerticalButton = iconButton({
            title: 'wrap vertical',
            className: 'simple' + (worldWrapVertical ? ' selected' : ''),
            onclick: () => setWrapVertical(!worldWrapVertical)
        }, 'wrap-v')

        let worldGrid = h(WorldGrid, {
            className: 'initial-focus',
            selectRoom,
            startRoomIndex,
            currentRoomIndex,
            roomList,
            roomWidth,
            roomHeight,
            worldWidth,
            worldHeight,
            spriteList,
            paletteList
        })

        return panel({ header: 'world', id: 'worldPanel', closeTab }, [
            row([
                nameButton,
                scriptButton,
                wrapHorizontalButton,
                wrapVerticalButton
            ]),
            div({ className: 'grid-container' }, [
                worldGrid,
            ]),
            helpLink('world'),
            extrasOverlay,
            importOverlay,
            exportOverlay,
            randomOverlay,
            clearOverlay,
            resetOverlay,
            resizeOverlay,
            fontOverlay,
            mainColorOverlay,
            modsOverlay
        ])
    }
}