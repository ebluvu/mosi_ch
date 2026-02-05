class ErrorOverlay extends Component {
    render({ errorMessage, closeOverlay }) {
        return overlay({ closeOverlay, header: '歐不' }, [
            div({}, errorMessage),
            button({ onclick: closeOverlay, className: 'initial-focus' }, '好:(')
        ])
    }
}

class ConfirmOverlay extends Component {
    render({ confirm, closeOverlay, header }) {
        return overlay({ closeOverlay, header }, [
            row([
                button({ onclick: confirm, className: 'initial-focus fill' }, '是!'),
                button({ onclick: closeOverlay, className: 'fill' }, '不')
            ])
        ])
    }
}

class RemoveOverlay extends Component {
    render({ remove, closeOverlay, header, fileType }) {
        return overlay({ closeOverlay, header }, [
            row([
                button({ onclick: remove, className: 'initial-focus fill' }, '是!'),
                button({ onclick: closeOverlay, className: 'fill' }, '不，留著')
            ])
        ])
    }
}

class ExtrasOverlay extends Component {
    render({ header, content, buttons, closeOverlay }) {
        return overlay({ closeOverlay, header },
            div({ className: 'extras-overlay content' },
                content ? content : buttons
            )
        )
    }
}

class ImportOverlay extends Component {
    render({ onImport, closeOverlay, header, fileType, hideTextImport }) {
        let textImport = hideTextImport ? [] : [
            textarea({
                value: '',
                className: 'initial-focus',
                ref: node => { this.textarea = node },
                rows: 5
            }),
            row([
                button({
                    className: 'fill',
                    onclick: () => onImport(this.textarea.value)
                }, '從文字匯入')
            ]),
            hr()
        ]

        let fileImport = div({}, [
            div({}, '從檔案匯入:'),
            fileinput({ onUpload: onImport, fileType })
        ])

        return overlay({ closeOverlay, header },
            div({ className: 'content' }, 
                textImport.concat(fileImport)
            )
        )
    }
}

class ExportOverlay extends Component {
    constructor() {
        super()
        this.state = {
            showTextArea: false
        }
    }
    render({ data, closeOverlay, header, fileName }) {
        // 計算資料大小（以 byte 為單位）
        const sizeInBytes = typeof data === 'string' ? data.length : 0
        const sizeInMB = sizeInBytes / 1024 / 1024
        const isLarge = sizeInMB >= 5
        const { showTextArea } = this.state

        let textExport = null
        if (!isLarge || showTextArea) {
            textExport = div({ className: 'content' }, [
                textarea({
                    value: data,
                    ref: node => { this.textarea = node },
                    rows: 5
                }),
                row([
                    button({
                        className: 'initial-focus fill',
                        onclick: () => {
                            this.textarea.select()
                            document.execCommand('copy')
                        }
                    }, '複製文字'),
                ]),
                hr()
            ])
        } else if (isLarge && !showTextArea) {
            textExport = div({ className: 'content' }, [
                div({ style: 'color: #c00; margin-bottom: 8px;' },
                    `數據過大（約 ${sizeInMB.toFixed(2)} MB），預設不顯示。若直接預覽可能造成瀏覽器卡頓甚至當機。`
                ),,
                row([
                    button({
                        className: 'fill',
                        onclick: () => this.setState({ showTextArea: true })
                    }, '預覽數據'),
                ]),
                hr()
            ])
        }

        let fileExport = row([
            button({
                className: 'fill',
                onclick: () => Files.download(fileName, data)
            }, '下載檔案')
        ])

        return overlay({ closeOverlay, header }, [ textExport, fileExport ])
    }
}

class ShareOverlay extends Component {
    render({ closeOverlay, world }) {
        let downloadButton =
            button({
                className: 'fill',
                onclick: () => {
                    // 取得主體顏色
                    let mainPalette = world.paletteList[world.mainPaletteIndex]
                    let bgColor = mainPalette ? mainPalette.colorList[world.mainBgColorIndex] : '#000000'
                    let textColor = mainPalette ? mainPalette.colorList[world.mainTextColorIndex] : '#ffffff'
                    
                    let data = Files.fillTemplate(gameTemplate, {
                        'TITLE': world.worldName || 'untitled',
                        'BG_COLOR': bgColor,
                        'GAME_SCRIPT': gameScript,
                        'TEXT_SCRIPT': textScript,
                        'MUSIC_SCRIPT': musicScript,
                        'SCRIPT_SCRIPT': scriptScript,
                        'GAME_DATA': World.export(world)
                    })
                    let filename = (world.worldName || 'untitled') + '.html'
                    Files.download(filename, data)
                }
            }, '下載遊戲檔案')

        return overlay({ closeOverlay, header: '分享' }, [
            row([ downloadButton ])
        ])
    }
}

class GifOverlay extends Component {
    constructor() {
        super()
        this.state = {
            scale: 2,
            imageUri: null
        }

        this.updateGif = (scale) => {
            this.setState({ scale })
            let { createGif, colorList } = this.props
            createGif(scale, colorList, blob => {
                let imageUri = URL.createObjectURL(blob)
                this.setState({ imageUri })
            })
        }
    }

    componentDidMount() {
        this.updateGif(2)
    }

    render({ closeOverlay, maxScale }, { scale, imageUri }) {
        let gif = imageUri ? img({ src: imageUri }) : null

        let scaleTextbox = label({}, [
            span({}, '圖片比例'),
            numbox({
                value: scale,
                min: 1,
                max: maxScale,
                onchange: e => this.updateGif(parseInt(e.target.value))
            })
        ])

        return overlay({ closeOverlay, header: '生成gif' }, [
            div({}, gif),
            div({}, [ scaleTextbox ]),
        ])
    }
}

class MusicListOverlay extends Component {
    render({ closeOverlay }) {
        return overlay({ closeOverlay, header: '選擇音樂' }, [
            h(MusicList, this.props)
        ])
    }
}

class PaletteListOverlay extends Component {
    render({ closeOverlay }) {
        return overlay({ closeOverlay, header: '選擇配色' }, [
            h(PaletteList, this.props)
        ])
    }
}

class SpriteListOverlay extends Component {
    render({ closeOverlay }) {
        return overlay({ closeOverlay, header: '選擇精靈' }, [
            h(SpriteList, this.props)
        ])
    }
}

class RoomPickerOverlay extends Component {
    render({ closeOverlay }) {
        this.props.className = 'initial-focus'
        return overlay({ closeOverlay, header: '選擇房間' }, [
            h(WorldGrid, this.props)
        ])
    }
}

class TilePickerOverlay extends Component {
    render({ closeOverlay }) {
        this.props.className = 'initial-focus'
        this.props.showBackground = true
        this.props.isAnimated = true
        return overlay({ closeOverlay, header: '選擇牆' }, [
            h(RoomGrid, this.props)
        ])
    }
}

class FontOverlay extends Component {
    constructor() {
        super()
        this.state = {
            showImportFontOverlay: false,
            showResetFontOverlay: false,
            showErrorOverlay: false,
            errorMessage: '',
            showImportTextboxSkinOverlay: false,
            showResetTextboxSkinOverlay: false
        }
    }

    render({
        closeOverlay,
        setFontResolution,
        setFontDirection,
        setFontData,
        setTextScale,
        fontResolution,
        fontDirection,
        fontData,
        textScale,
        textboxSkin,
        setTextboxSkin,
        dialogMaxLines,
        setDialogMaxLines
    }, {
        showImportFontOverlay,
        showResetFontOverlay,
        showImportTextboxSkinOverlay,
        showResetTextboxSkinOverlay
    }) {
        let importFontButton =
            button({
                className: 'fill',
                onclick: () => this.setState({ showImportFontOverlay: true })
            }, '匯入新字體')

        let importFontOverlay = !showImportFontOverlay ? null :
            h(ImportOverlay, {
                header: '匯入字體',
                onImport: data => {
                    let fontData = Font.parse(data)
                    setFontData(fontData)
                    this.setState({ showImportFontOverlay: false })
                },
                fileType: '.bitsyfont',
                hideTextImport: true,
                closeOverlay: () => this.setState({ showImportFontOverlay: false })
            })

        let resetFontButton =
            button({
                className: 'fill',
                onclick: () => this.setState({ showResetFontOverlay: true })
            }, '重設字體')

        let resetFontOverlay = !showResetFontOverlay ? null :
            h(RemoveOverlay, {
                header: '重設為預設字體?',
                closeOverlay: () => this.setState({ showResetFontOverlay: false }),
                remove: () => {
                    let fontData = Font.parse(BOUTIQUE_BITMAP_7X7)
                    setFontData(fontData)
                    this.setState({ showResetFontOverlay: false })
                }
            })

        let fontResolutionInput = numbox({
            value: fontResolution,
            min: 0.1,
            max: 10,
            step: 0.1,
            onchange: e => setFontResolution(parseFloat(e.target.value))
        })
    
        let fontDirectionButton = button({
            className: 'fill',
            onclick: () => setFontDirection((fontDirection === 'ltr' ? 'rtl' : 'ltr'))
        }, (fontDirection === 'ltr' ? '左至右' : '右至左'))

        let textScaleOptions = [
            { value: 1, label: 'x1' },
            { value: 2, label: 'x2' }
        ]
        
        let textScaleDropdown = dropdown({
            value: textScale,
            onchange: e => setTextScale(parseInt(e.target.value))
        }, textScaleOptions.map(option => 
            h('option', { value: option.value }, option.label)
        ))

        // 對話框最大行數設定
        let dialogMaxLinesInput = numbox({
            value: dialogMaxLines || 2,
            min: 2,
            max: 10,
            onchange: e => {
                let value = parseInt(e.target.value)
                if (value >= 2 && value <= 10) {
                    setDialogMaxLines(value)
                } else {
                    // 如果輸入無效，恢復為當前值
                    e.target.value = dialogMaxLines || 2
                }
            },
            onblur: e => {
                let value = parseInt(e.target.value)
                if (isNaN(value) || value < 2 || value > 10) {
                    e.target.value = dialogMaxLines || 2
                }
            },
            onkeydown: e => {
                // 只允許數字、退格鍵、刪除鍵、方向鍵、Tab鍵、Enter鍵
                let allowedKeys = ['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']
                let isNumber = /^\d$/.test(e.key)
                let isAllowedKey = allowedKeys.includes(e.key)
                
                if (!isNumber && !isAllowedKey) {
                    e.preventDefault()
                }
            }
        })

        // 匯入對話框皮膚按鈕
        let importTextboxSkinButton =
            button({
                className: 'fill',
                onclick: () => this.setState({ showImportTextboxSkinOverlay: true })
            }, '匯入對話框皮膚')

        let importTextboxSkinOverlay = !this.state?.showImportTextboxSkinOverlay ? null :
            h(ImportOverlay, {
                header: '匯入對話框皮膚',
                onImport: data => {
                    try {
                        let parsed = typeof data === 'string' ? JSON.parse(data) : data;
                        let result = parseTextboxSkin(parsed, fontData)
                        if (result.error) {
                            this.setState({ showErrorOverlay: true, errorMessage: '皮膚匯入失敗：' + result.error })
                        } else {
                            if (!setTextboxSkin) {
                                this.setState({ showErrorOverlay: true, errorMessage: 'setTextboxSkin 未正確傳入，無法設定 textboxSkin' });
                                return;
                            }
                            setTextboxSkin(result.skin)
                            this.setState({ showImportTextboxSkinOverlay: false })
                        }
                    } catch (err) {
                        this.setState({ showErrorOverlay: true, errorMessage: '檔案格式錯誤，無法解析。' })
                    }
                },
                fileType: '.mositextbox',
                closeOverlay: () => this.setState({ showImportTextboxSkinOverlay: false })
            })

        // 還原對話框皮膚按鈕
        let resetTextboxSkinButton =
            button({
                className: 'fill',
                onclick: () => this.setState({ showResetTextboxSkinOverlay: true })
            }, '還原對話框皮膚')

        let resetTextboxSkinOverlay = !this.state?.showResetTextboxSkinOverlay ? null :
            h(RemoveOverlay, {
                header: '還原為無皮膚狀態?',
                closeOverlay: () => this.setState({ showResetTextboxSkinOverlay: false }),
                remove: () => {
                    if (!setTextboxSkin) {
                        this.setState({ showErrorOverlay: true, errorMessage: 'setTextboxSkin 未正確傳入，無法還原 textboxSkin' });
                        return;
                    }
                    setTextboxSkin(null)
                    this.setState({ showResetTextboxSkinOverlay: false })
                }
            })

        // 防呆：確保 textboxSkin 有值
        const currentSkin = textboxSkin;

        return overlay({ closeOverlay, header: '字體設定' }, [
            row([ span({}, ['當前字體: ', strong(fontData.name)]) ]),
            row([ span({}, [
                '當前對話框皮膚: ',
                strong(currentSkin ? currentSkin.name : '無'),
                currentSkin ? (currentSkin.isTransparent ? '（透明）' : '（不透明）') : ''
            ]) ]),
            row([
                span({ className: 'label' }, '文字縮放'),
                span({}, '×'),
                fontResolutionInput
            ]),
            row([
                span({ className: 'label' }, '文字方向'),
                fontDirectionButton
            ]),
            row([
                span({ className: 'label' }, '文字比例'),
                textScaleDropdown
            ]),
            row([
                span({ className: 'label' }, '對話框最大行數'),
                dialogMaxLinesInput
            ]),
            row([ importFontButton, resetFontButton ]),
            row([importTextboxSkinButton,resetTextboxSkinButton]),
            importFontOverlay,
            resetFontOverlay,
            importTextboxSkinOverlay,
            resetTextboxSkinOverlay,
            this.state.showErrorOverlay ?
                h(ErrorOverlay, {
                    errorMessage: this.state.errorMessage,
                    closeOverlay: () => this.setState({ showErrorOverlay: false })
                }) : null
        ])
    }
}

class ResizeWorldOverlay extends Component {
    constructor({ worldWidth, worldHeight, roomWidth, roomHeight, spriteWidth, spriteHeight }) {
        super()
        this.state = {
            worldWidth, worldHeight, roomWidth, roomHeight, spriteWidth, spriteHeight
        }
    }

    render({
        closeOverlay,
        resize
    }, {
        worldWidth,
        worldHeight,
        roomWidth,
        roomHeight,
        spriteWidth,
        spriteHeight,
        showConfirmResizeOverlay
    }) {
        let worldResized = worldWidth !== this.props.worldWidth || worldHeight !== this.props.worldHeight
        let roomResized = roomWidth !== this.props.roomWidth || roomHeight !== this.props.roomHeight
        let spriteResized = spriteWidth !== this.props.spriteWidth || spriteHeight !== this.props.spriteHeight
        let resizedString = ''
        if (worldResized && roomResized && spriteResized) resizedString = 'world, rooms, and sprites'
        else if (worldResized && roomResized) resizedString = 'world and rooms'
        else if (worldResized && spriteResized) resizedString = 'world and sprites'
        else if (roomResized && spriteResized) resizedString = 'room and sprites'
        else if (worldResized)  resizedString = 'world'
        else if (roomResized)  resizedString = 'rooms'
        else if (spriteResized)  resizedString = 'sprites'
        
        let resizeButton =
            button({
                className: 'fill',
                disabled: !resizedString,
                onclick: () => this.setState({ showConfirmResizeOverlay: true })
            }, '調整尺寸')

        let confirmResizeOverlay = !showConfirmResizeOverlay ? null :
            h(RemoveOverlay, {
                header: `您確定要調整${resizedString}的大小嗎？`,
                closeOverlay: () => this.setState({ showConfirmResizeOverlay: false }),
                remove: () => {
                    resize(this.state)
                    this.setState({ showConfirmResizeOverlay: false })
                }
            })

        return overlay({ closeOverlay, header: '調整世界尺寸' }, [
            row([
                span({ className: 'label' }, '世界尺寸'),
                numbox({
                    value: worldWidth,
                    min: 1,
                    max: 24,
                    onchange: e => this.setState({ worldWidth: parseInt(e.target.value) })
                }),
                span({}, '×'),
                numbox({
                    value: worldHeight,
                    min: 1,
                    max: 24,
                    onchange: e => this.setState({ worldHeight: parseInt(e.target.value) })
                })
            ]),
            row([
                span({ className: 'label' }, '房間尺寸'),
                numbox({
                    value: roomWidth,
                    min: 1,
                    max: 24,
                    onchange: e => this.setState({ roomWidth: parseInt(e.target.value) })
                }),
                span({}, '×'),
                numbox({
                    value: roomHeight,
                    min: 1,
                    max: 24,
                    onchange: e => this.setState({ roomHeight: parseInt(e.target.value) })
                })
            ]),
            row([
                span({ className: 'label' }, '精靈尺寸'),
                numbox({
                    value: spriteWidth,
                    min: 1,
                    max: 24,
                    onchange: e => this.setState({ spriteWidth: parseInt(e.target.value) }) }),
                span({}, '×'),
                numbox({
                    value: spriteHeight,
                    min: 1,
                    max: 24,
                    onchange: e => this.setState({ spriteHeight: parseInt(e.target.value) }) })
            ]),
            row([ resizeButton ]),
            confirmResizeOverlay
        ])
    }
}

class ScriptoriumOverlay extends Component {
    render({ closeOverlay, insertText, spriteOnly }, { currentSection }) {
        let scriptSections = Object.keys(scriptorium).map(sectionName => {
            let isOpen = currentSection === sectionName

            let scriptItems = scriptorium[sectionName].map(scriptItem => {
                if (scriptItem.spriteOnly && !spriteOnly) return null
                let argText = scriptItem.args.map(a => '[' + a + ']').join(' ')
                let scriptText = scriptItem.text.replace('?', argText)
                return div({},
                    link({ onclick: e => {
                        e.preventDefault()
                        insertText(scriptText)
                    }}, scriptItem.name)
                )
            })

            return div({ className: 'script-section ' + (isOpen || !currentSection ? 'open' : 'closed') }, [
                row([
                    button({
                        className: 'fill',
                        onclick: () => {
                            this.setState({ currentSection: (isOpen ? null : sectionName) })
                        }
                    }, row([
                        span({}, sectionName),
                        fill(),
                        span({}, (isOpen ? '▲' : '▼'))
                    ]))
                ]),
                div({ className: 'script-item-list ' + (isOpen ? 'open' : 'closed') },
                    scriptItems
                )
            ])

        })

        let moreInfoLink = currentSection ? null :
            div({ className: 'welcome-links' }, [
                link({ href: 'https://ebluvu.notion.site/38be035e72f0497ab2069e5eabd3aa3e' }, '更多關於指令的資訊')
            ])

        return overlay({ closeOverlay, header: '插入指令' }, [
            scriptSections,
            moreInfoLink
        ])
    }
}

class ModsOverlay extends Component {
    render({ closeOverlay, modList = [], addMod, renameMod, changeModType, updateModCode, removeMod }, { currentModIndex = 0, showRemoveModOverlay }) {
        if (modList.length === 0) {
            return overlay({ closeOverlay, header: '自訂指令' }, [
                row([
                    button({
                        class: 'fill',
                        onclick: () => addMod()
                    }, '新增指令')
                ])
            ])
        }

        let currentMod = modList[currentModIndex]

        let modDropdown = dropdown({
            class: 'fill',
            value: currentModIndex,
            onchange: e => this.setState({ currentModIndex: e.target.value })
        },
            modList.map((mod, modIndex) => {
                return option({ value: modIndex }, mod.name)
            })
        )

        let addButton = iconButton({
            onclick: () => addMod()
        }, 'add')

        let nameTextbox = textbox({
            placeholder: 'script name',
            value: currentMod.name,
            onchange: e => renameMod(currentModIndex, e.target.value)
        })

        let typeButton = button({
            class: 'fill',
            onclick: () => {
                let newType = ''
                if (currentMod.type === 'function') {
                    newType = 'expression'
                } else {
                    newType = 'function'
                }
                changeModType(currentModIndex, newType)
            }
        }, currentMod.type)

        let removeButton = iconButton({
            title: 'remove script',
            onclick: () => this.setState({ showRemoveModOverlay: true }),
        }, 'delete')

        let removeModOverlay = !showRemoveModOverlay ? null :
            h(RemoveOverlay, {
                header: '移除指令?',
                closeOverlay: () => this.setState({ showRemoveModOverlay: false }),
                remove: () => {
                    removeMod(currentModIndex)
                    this.setState({ currentModIndex: 0, showRemoveModOverlay: false })
                }
            })

        let codeTextarea = textarea({
            value: currentMod.code,
            onchange: e => updateModCode(currentModIndex, e.target.value),
            rows: 10
        })

        return overlay({ closeOverlay, header: '自訂指令' }, [
            row([ modDropdown, addButton ]),
            hr(),
            div({}, [
                row([ nameTextbox, typeButton, removeButton ]),
                codeTextarea
            ]),
            removeModOverlay
        ])
    }
}

class MainColorOverlay extends Component {
    constructor() {
        super()
        this.state = {
            currentPaletteIndex: 0
        }
    }

    componentWillReceiveProps(nextProps) {
        // 確保狀態與 props 同步
        if (this.props.mainPaletteIndex !== nextProps.mainPaletteIndex) {
            this.setState({ currentPaletteIndex: nextProps.mainPaletteIndex })
        }
        // 如果調色盤列表發生變化，也需要更新狀態
        if (this.props.paletteList !== nextProps.paletteList) {
            this.setState({ currentPaletteIndex: nextProps.mainPaletteIndex })
        }
    }

    componentDidMount() {
        this.setState({ currentPaletteIndex: this.props.mainPaletteIndex })
    }

    render({
        closeOverlay,
        paletteList,
        mainPaletteIndex,
        mainBgColorIndex,
        mainTextColorIndex,
        setMainPaletteIndex,
        setMainBgColorIndex,
        setMainTextColorIndex
    }, {
        currentPaletteIndex
    }) {
        let currentPalette = paletteList[currentPaletteIndex]
        if (!currentPalette) return null

        let safeBgColorIndex = Math.min(mainBgColorIndex, currentPalette.colorList.length - 1)
        let safeTextColorIndex = Math.min(mainTextColorIndex, currentPalette.colorList.length - 1)

        let paletteButtonList = paletteList.map((palette, i) => {
            return paletteButton({
                className: i === currentPaletteIndex ? 'initial-focus' : '',
                onclick: () => {
                    this.setState({ currentPaletteIndex: i })
                    setMainPaletteIndex(i)
                    let newBgIndex = Math.min(1, palette.colorList.length - 1)
                    let newTextIndex = Math.min(0, palette.colorList.length - 1)
                    setMainBgColorIndex(newBgIndex)
                    setMainTextColorIndex(newTextIndex)
                },
                palette,
                isSelected: (i === currentPaletteIndex)
            })
        })

        let nextBgColorIndex = (safeBgColorIndex + 1) % currentPalette.colorList.length
        let nextTextColorIndex = (safeTextColorIndex + 1) % currentPalette.colorList.length

        let bgColorButton = colorButton({
            color: currentPalette.colorList[safeBgColorIndex],
            title: '背景顏色',
            onclick: () => setMainBgColorIndex(nextBgColorIndex)
        })

        let textColorButton = colorButton({
            color: currentPalette.colorList[safeTextColorIndex],
            title: '文字顏色',
            onclick: () => setMainTextColorIndex(nextTextColorIndex)
        })

        let bgColorRow = row([
            span({}, '背景顏色'),
            fill(),
            bgColorButton,
        ])

        let textColorRow = row([
            span({}, '文字顏色'),
            fill(),
            textColorButton,
        ])

        return overlay({ closeOverlay, header: '主體顏色設定' }, [
            div({ className: 'content' }, [
                div({ className: 'palette-list' }, paletteButtonList),
                hr(),
                bgColorRow,
                textColorRow
            ])
        ])
    }
}

class VariableSettingOverlay extends Component {
    constructor() {
        super()
        this.state = {
            name: '',
            type: 'number',
            error: ''
        }
    }
    componentWillMount() {
        const { varName, variable } = this.props
        // 如果 type 是 "boolean" 或 value 是 "true"/"false"，視為布林值變量（但實際保存時 type 應該是 "string"）
        let varType = variable.type
        if (varType === 'boolean' || (varType === 'string' && (variable.value === 'true' || variable.value === 'false'))) {
            varType = 'boolean' // UI 顯示用，但保存時會轉為 "string"
        } else {
            varType = varType || (typeof variable.value === 'boolean' ? 'boolean' : 'number')
        }
        this.setState({
            name: varName,
            type: varType
        })
    }
    onNameChange(e) {
        this.setState({ name: e.target.value })
    }
    onNameBlurOrEnter(e) {
        let name = e.target.value.trim()
        if (!name) {
            this.setState({ error: '變量名稱不能為空!' })
            return
        }
        if (name !== this.props.varName && this.props.variables[name]) {
            this.setState({ error: `其他變量已經命名為 "${name}"!` })
            return
        }
        this.setState({ error: '', name })
        this.props.onSave && this.props.onSave(this.props.varName, name, this.state.type, undefined, false)
    }
    onTypeToggle() {
        let newType = this.state.type === 'number' ? 'boolean' : 'number'
        // 布林值應該保存為字串 "true" 或 "false"，這樣 {var} 表達式才能正確返回，{if} 才能正確判斷
        let newValue = newType === 'number' ? 0 : 'true'
        this.setState({ type: newType }, () => {
            this.props.onSave && this.props.onSave(this.props.varName, this.state.name, newType, newValue, false)
        })
    }
    onDuplicate() {
        this.props.onDuplicate && this.props.onDuplicate(this.state.name, this.state.type)
        this.props.closeOverlay && this.props.closeOverlay()
    }
    onRemove() {
        this.props.onRemove && this.props.onRemove(this.props.varName)
        this.props.closeOverlay && this.props.closeOverlay()
    }
    render() {
        const { closeOverlay } = this.props
        const { name, type, error } = this.state
        return overlay({ closeOverlay, header: '變量設定' }, [
            row([textbox({
                style: { width: '100%' },
                value: name,
                placeholder: '變量名稱',
                oninput: e => this.onNameChange(e),
                onblur: e => this.onNameBlurOrEnter(e),
                onkeydown: e => { if (e.key === 'Enter') this.onNameBlurOrEnter(e) }
            })]),
            hr(),
            row([
                button({ className: 'fill', onclick: () => this.onTypeToggle() }, type === 'number' ? '數值' : '布林值')
            ]),
            row([
                button({ className: 'fill', onclick: () => this.onDuplicate() }, '複製')
            ]),
            row([
                button({ className: 'fill', onclick: () => this.onRemove() }, '移除變量')
            ]),
            error ? h(ErrorOverlay, { errorMessage: error, closeOverlay: () => this.setState({ error: '' }) }) : null
        ])
    }
}

// === Custom Sprite Group Overlays ===

class CustomGroupOverlay extends Component {
    constructor() {
        super()
        this.state = {
            groupName: '',
            showImportOverlay: false
        }
    }

    render({
        closeOverlay,
        customSpriteGroups,
        addGroup,
        removeGroup,
        selectGroup,
        configureGroup
    }, {
        groupName,
        showImportOverlay
    }) {
        const onAddGroup = () => {
            addGroup(groupName)
            this.setState({ groupName: '' })
        }

        const groupList = customSpriteGroups.map(group => {
            return row([
                iconButton({ onclick: () => configureGroup(group), title: '設定' }, 'settings'),
                button({ onclick: () => selectGroup(group.name), className: 'fill' }, group.name),
                iconButton({ onclick: () => removeGroup(group.name), title: '刪除' }, 'delete'),
            ])
        })

        let importOverlay = !showImportOverlay ? null :
            h(ImportOverlay, {
                header: '匯入自訂群組',
                onImport: data => {
                    try {
                        let imported = JSON.parse(data)
                        if (!Array.isArray(imported)) throw new Error('格式錯誤')
                        this.props.onImportGroups(imported)
                        this.setState({ showImportOverlay: false })
                    } catch (e) {
                        if (this.props.showError) this.props.showError('匯入失敗：格式錯誤')
                        this.setState({ showImportOverlay: false })
                    }
                },
                fileType: '.mosicustomgroup',
                closeOverlay: () => this.setState({ showImportOverlay: false })
            })

        return overlay({ header: '自訂群組', closeOverlay }, [
            div({ className: 'content extras-overlay' }, [
                row([
                    iconButton({ title: '匯入', onclick: () => this.setState({ showImportOverlay: true }) }, 'import'),
                    textbox({
                        placeholder: '群組名稱',
                        value: groupName,
                        onchange: e => this.setState({ groupName: e.target.value }),
                        onkeydown: e => e.key === 'Enter' && onAddGroup()
                    }),
                    iconButton({ title: '新增群組', onclick: onAddGroup }, 'add'),
                ]),
                hr(),
                div({ className: 'custom-group-list' }, groupList),
                importOverlay
            ])
        ])
    }
}

class ConfigureGroupOverlay extends Component {
    constructor(props) {
        super(props)
        this.state = {
            filter: '',
            category: 'all',
            selectedSpriteNames: props.groupToConfigure?.spriteNames || []
        }
    }

    componentWillReceiveProps(nextProps) {
        if (
            nextProps.groupToConfigure &&
            nextProps.groupToConfigure.spriteNames !== this.props.groupToConfigure?.spriteNames
        ) {
            this.setState({
                selectedSpriteNames: nextProps.groupToConfigure.spriteNames || []
            })
        }
    }

    render({
        closeOverlay,
        spriteList,
        updateGroup,
        groupToConfigure,
        colorList
    }, {
        filter,
        category,
        selectedSpriteNames
    }) {
        const setCategory = newCategory => this.setState({ category: newCategory })

        const toggleSpriteSelection = spriteName => {
            const newSelection = selectedSpriteNames.includes(spriteName)
                ? selectedSpriteNames.filter(name => name !== spriteName)
                : [...selectedSpriteNames, spriteName]
            this.setState({ selectedSpriteNames: newSelection })
        }

        const onSave = () => {
            updateGroup({ ...groupToConfigure, spriteNames: selectedSpriteNames })
        }

        const visibleSprites = spriteList
            .filter(({ name, isAvatar, isItem, isWall }) => {
                if (filter && !name.includes(filter)) return false
                switch (category) {
                    case 'all': return true
                    case 'avatar': return isAvatar
                    case 'sprite': return !isAvatar && !isItem && !isWall
                    case 'item': return isItem
                    case 'wall': return isWall
                    default: return true
                }
            })
            // 按名稱排序，主角始終在第一位
            .sort((s1, s2) => {
                // 主角始終在第一位
                if (s1.isAvatar && !s2.isAvatar) return -1
                if (!s1.isAvatar && s2.isAvatar) return 1
                // 其他精靈按名稱排序
                let name1 = s1.name.toUpperCase()
                let name2 = s2.name.toUpperCase()
                if (name1 < name2) return -1
                if (name1 > name2) return 1
                else return 0
            })

        const toggleSelectAll = () => {
            const visibleSpriteNames = visibleSprites.map(s => s.name)
            const allSelected = visibleSpriteNames.every(name => selectedSpriteNames.includes(name))

            if (allSelected) {
                // 如果已全選，則取消全選
                const newSelection = selectedSpriteNames.filter(name => !visibleSpriteNames.includes(name))
                this.setState({ selectedSpriteNames: newSelection })
            } else {
                // 如果未全選，則全選
                const newSelection = [...new Set([...selectedSpriteNames, ...visibleSpriteNames])]
                this.setState({ selectedSpriteNames: newSelection })
            }
        }

        const spriteElements = visibleSprites
            .map(sprite => {
                const isSelected = selectedSpriteNames.includes(sprite.name)
                return spriteButton({
                    className: isSelected ? 'selected' : '',
                    onclick: () => toggleSpriteSelection(sprite.name),
                    sprite,
                    colorList,
                    isSelected
                })
            })

        return overlay({ header: `設定群組: ${groupToConfigure?.name || ''}`, closeOverlay }, [
            div({ className: 'content' }, [
                row([
                    textbox({
                        placeholder: '搜尋精靈',
                        value: filter,
                        onchange: e => this.setState({ filter: e.target.value })
                    }),
                    iconButton({ title: '全選/取消全選', onclick: toggleSelectAll }, 'select-all'),
                    iconButton({ title: '儲存', onclick: onSave }, 'add')
                ]),
                div({ className: 'row', style: { 'justify-content': 'center', 'margin-top': '8px' } }, [
                    iconButton({ title: '全部', className: category === 'all' ? 'selected' : '', onclick: () => setCategory('all') }, 'world'),
                    iconButton({ title: '精靈', className: category === 'sprite' ? 'selected' : '', onclick: () => setCategory('sprite') }, 'sprites'),
                    iconButton({ title: '對話', className: category === 'dialog' ? 'selected' : '', onclick: () => setCategory('dialog') }, 'script'),
                    iconButton({ title: '道具', className: category === 'item' ? 'selected' : '', onclick: () => setCategory('item') }, 'item'),
                    iconButton({ title: '牆', className: category === 'wall' ? 'selected' : '', onclick: () => setCategory('wall') }, 'wall'),
                ]),
                hr(),
                div({ className: 'spritelist' }, spriteElements)
            ])
        ])
    }
}

class EditSpritesOverlay extends Component {
    constructor(props) {
        super(props)
        this.state = {
            filter: '',
            category: 'all',
            selectedSpriteNames: [],
            showRemoveOverlay: false
        }
    }

    render({
        closeOverlay,
        spriteList,
        removeSprites,
        duplicateSprites,
        colorList
    }, {
        filter,
        category,
        selectedSpriteNames,
        showRemoveOverlay
    }) {
        const setCategory = newCategory => this.setState({ category: newCategory })

        const toggleSpriteSelection = spriteName => {
            const newSelection = selectedSpriteNames.includes(spriteName)
                ? selectedSpriteNames.filter(name => name !== spriteName)
                : [...selectedSpriteNames, spriteName]
            this.setState({ selectedSpriteNames: newSelection })
        }

        const toggleSelectAll = () => {
            const visibleSprites = spriteList.filter(({ name, isAvatar, isItem, isWall, scriptList }) => {
                if (filter && !name.includes(filter)) return false
                switch (category) {
                    case 'all': return true
                    case 'dialog':
                        if (!scriptList) return false
                        return (scriptList['on-push'] && scriptList['on-push'].trim()) || (scriptList['on-message'] && scriptList['on-message'].trim())
                    case 'sprite': return !isAvatar && !isItem && !isWall
                    case 'item': return isItem
                    case 'wall': return isWall
                    default: return true
                }
            })
            // 按名稱排序，主角始終在第一位
            .sort((s1, s2) => {
                // 主角始終在第一位
                if (s1.isAvatar && !s2.isAvatar) return -1
                if (!s1.isAvatar && s2.isAvatar) return 1
                // 其他精靈按名稱排序
                let name1 = s1.name.toUpperCase()
                let name2 = s2.name.toUpperCase()
                if (name1 < name2) return -1
                if (name1 > name2) return 1
                else return 0
            })
            const visibleSpriteNames = visibleSprites.map(s => s.name)
            const allSelected = visibleSpriteNames.every(name => selectedSpriteNames.includes(name))
            if (allSelected) {
                // 如果已全選，則取消全選
                const newSelection = selectedSpriteNames.filter(name => !visibleSpriteNames.includes(name))
                this.setState({ selectedSpriteNames: newSelection })
            } else {
                // 如果未全選，則全選
                const newSelection = [...new Set([...selectedSpriteNames, ...visibleSpriteNames])]
                this.setState({ selectedSpriteNames: newSelection })
            }
        }

        const onRemove = () => {
            if (selectedSpriteNames.length > 0) {
                this.setState({ showRemoveOverlay: true })
            }
        }

        const onRemoveConfirm = () => {
            if (removeSprites) removeSprites(selectedSpriteNames)
            this.setState({ selectedSpriteNames: [], showRemoveOverlay: false })
        }

        const onRemoveCancel = () => {
            this.setState({ showRemoveOverlay: false })
        }

        const onDuplicate = () => {
            if (selectedSpriteNames.length > 0 && duplicateSprites) {
                duplicateSprites(selectedSpriteNames)
                this.setState({ selectedSpriteNames: [] })
            }
        }

        const visibleSprites = spriteList.filter(({ name, isAvatar, isItem, isWall, scriptList }) => {
            if (filter && !name.includes(filter)) return false
            switch (category) {
                case 'all': return true
                case 'dialog':
                    if (!scriptList) return false
                    return (scriptList['on-push'] && scriptList['on-push'].trim()) || (scriptList['on-message'] && scriptList['on-message'].trim())
                case 'sprite': return !isAvatar && !isItem && !isWall
                case 'item': return isItem
                case 'wall': return isWall
                default: return true
            }
        })
        // 按名稱排序，主角始終在第一位
        .sort((s1, s2) => {
            // 主角始終在第一位
            if (s1.isAvatar && !s2.isAvatar) return -1
            if (!s1.isAvatar && s2.isAvatar) return 1
            // 其他精靈按名稱排序
            let name1 = s1.name.toUpperCase()
            let name2 = s2.name.toUpperCase()
            if (name1 < name2) return -1
            if (name1 > name2) return 1
            else return 0
        })

        const spriteElements = visibleSprites.map(sprite => {
            const isSelected = selectedSpriteNames.includes(sprite.name)
            return spriteButton({
                className: isSelected ? 'selected' : '',
                onclick: () => toggleSpriteSelection(sprite.name),
                sprite,
                colorList,
                isSelected
            })
        })

        let removeOverlay = !showRemoveOverlay ? null :
            h(RemoveOverlay, {
                header: `確定要刪除選取的精靈嗎？`,
                closeOverlay: onRemoveCancel,
                remove: onRemoveConfirm
            })

        return overlay({ header: '批量編輯精靈', closeOverlay }, [
            div({ className: 'content' }, [
                row([
                    textbox({
                        placeholder: '搜尋精靈',
                        value: filter,
                        onchange: e => this.setState({ filter: e.target.value })
                    }),
                    iconButton({ title: '全選/取消全選', onclick: toggleSelectAll }, 'select-all'),
                    iconButton({ title: '複製', onclick: onDuplicate }, 'duplicate'),
                    iconButton({ title: '刪除', onclick: onRemove }, 'clear')
                ]),
                div({ className: 'row', style: { 'justify-content': 'center', 'margin-top': '8px' } }, [
                    iconButton({ title: '全部', className: category === 'all' ? 'selected' : '', onclick: () => setCategory('all') }, 'world'),
                    iconButton({ title: '精靈', className: category === 'sprite' ? 'selected' : '', onclick: () => setCategory('sprite') }, 'sprites'),
                    iconButton({ title: '對話', className: category === 'dialog' ? 'selected' : '', onclick: () => setCategory('dialog') }, 'script'),
                    iconButton({ title: '道具', className: category === 'item' ? 'selected' : '', onclick: () => setCategory('item') }, 'item'),
                    iconButton({ title: '牆', className: category === 'wall' ? 'selected' : '', onclick: () => setCategory('wall') }, 'wall'),
                ]),
                hr(),
                div({ className: 'spritelist' }, spriteElements),
                removeOverlay
            ])
        ])
    }
}

// === Graphic 專用 Overlays ===

class GraphicImportOverlay extends Component {
    render({ closeOverlay, onImport }) {
        return overlay({ closeOverlay, header: '匯入圖片' }, [
            h(ImportOverlay, {
                onImport,
                closeOverlay,
                header: '匯入圖片',
                fileType: '.mosigraphic'
            })
        ])
    }
}

class GraphicExtrasOverlay extends Component {
    render({ closeOverlay, content, buttons }) {
        return overlay({ closeOverlay, header: '圖片設定' }, [
            div({ className: 'extras-overlay content' }, content ? content : buttons)
        ])
    }
}

class GraphicFrameExtrasOverlay extends Component {
    render({ closeOverlay, content, buttons }) {
        return overlay({ closeOverlay, header: '動畫幀設定' }, [
            div({ className: 'extras-overlay content' }, content ? content : buttons)
        ])
    }
}