class SpritePanel extends Component {
    constructor() {
        super()
        this.state = {
            currentFrameIndex: 0,
            showGrid: false,
            currentColorIndex: 1,
            currentTool: 'pen' // 新增：預設為畫筆
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.sprite !== this.props.sprite) {
            this.setState({ currentFrameIndex: 0 })
        }
    }

    render({
        closeTab,
        openScriptTab,

        renameSprite,
        exportSprite,
        createSpriteGif,
        setSpriteIsWall,
        setSpriteIsItem,
        setSpriteIsTransparent,
        setColorIndex,
        removeSprite,
        convertSprite,
        duplicateSprite,

        addFrame,
        removeFrame,
        updateFrame,
        
        sprite,
        colorList
    }, {
        currentFrameIndex,
        showConvertSpriteOverlay,
        showRemoveSpriteOverlay,
        showExportOverlay,
        showGifOverlay,
        showRemoveFrameOverlay,
        showClearFrameOverlay,
        showRandomFrameOverlay,
        showExtrasOverlay,
        showFrameExtrasOverlay
    }) {
        if (!sprite) return

        let { name, width, height, isAvatar, isWall, isItem, isTransparent, frameList, colorIndex } = sprite
        let currentFrame = frameList[currentFrameIndex]

        while (colorIndex > 0 && !colorList[colorIndex]) colorIndex--
        let color = colorList[colorIndex]
        let backgroundColor = colorList[0]

        let nameButton = button({
            className: 'fill',
            onclick: () => this.setState({ showExtrasOverlay: true })
        }, name)

        let nameTextbox = textbox({
            placeholder: 'sprite name',
            value: name,
            onchange: e => renameSprite(e.target.value)
        })

        let spritePreview = button({
            className: 'sprite-button',
            onclick: () => {
                let newColorIndex = colorIndex
                newColorIndex++
                if (newColorIndex >= colorList.length) newColorIndex = 1
                setColorIndex(newColorIndex)
            }
        }, h(SpriteCanvas, {
            width,
            height,
            frameList,
            isAnimated: true,
            colorList,
            isTransparent
        }))
    
        let wallButton = isAvatar ? null :
            iconButton({
                title: 'wall',
                className: 'simple' + (isWall ? ' selected' : ''),
                onclick: () => setSpriteIsWall(!isWall)
            }, 'wall')
    
        let itemButton = isAvatar ? null :
            iconButton({
                title: 'item',
                className: 'simple' + (isItem ? ' selected' : ''),
                onclick: () => setSpriteIsItem(!isItem)
            }, 'item')
    
        let transparentButton = iconButton({
            title: 'transparent',
            className: 'simple' + (isTransparent ? ' selected' : ''),
            onclick: () => setSpriteIsTransparent(!isTransparent)
        }, 'transparent')
    
        let scriptList = Object.keys(sprite.scriptList).map(key => sprite.scriptList[key])
        let hasScripts = scriptList.find(script => !!script)
        let scriptButton = isAvatar ? null :
            iconButton({
                title: 'script',
                className: 'simple' + (hasScripts ? ' selected' : ''),
                onclick: openScriptTab
            }, 'script')
    
        let exportButton = button({
            onclick: () => this.setState({ showExtrasOverlay: false, showExportOverlay: true })
        }, '匯出')

        let exportOverlay = !showExportOverlay ? null :
            h(ExportOverlay, {
                header: '匯出精靈',
                fileName: `${sprite.name || 'untitled'}.mosisprite`,
                data: exportSprite(),
                closeOverlay: () => this.setState({ showExportOverlay: false })
            })
        let convertButton = isAvatar ? null : button({
            onclick: () => this.setState({ showExtrasOverlay: false, showConvertSpriteOverlay: true })
        }, '轉換為主角')

        let convertSpriteOverlay = !showConvertSpriteOverlay ? null :
            h(ConfirmOverlay, {
                header: '將精靈轉換為主角?(原來的主角會變成一般的精靈)',
                closeOverlay: () => this.setState({ showConvertSpriteOverlay: false }),
                confirm: () => {
                    convertSprite()
                    this.setState({ showConvertSpriteOverlay: false })
                }
            })
    
        let removeButton = isAvatar ? null :
            button({
                onclick: () => this.setState({ showExtrasOverlay: false, showRemoveSpriteOverlay: true }),
            }, '移除精靈')

        let removeSpriteOverlay = !showRemoveSpriteOverlay ? null :
            h(RemoveOverlay, {
                header: '移除精靈?',
                closeOverlay: () => this.setState({ showRemoveSpriteOverlay: false }),
                remove: () => {
                    removeSprite()
                    this.setState({ showRemoveSpriteOverlay: false })
                }
            })

        let duplicateButton = button({
            onclick: () => {
                this.setState({ showExtrasOverlay: false })
                duplicateSprite()
            }
        }, '複製')

        let gifButton = button({
            onclick: () => this.setState({ showExtrasOverlay: false, showGifOverlay: true })
        }, '生成gif')

        let gifOverlay = !showGifOverlay ? null :
            h(GifOverlay, {
                colorList,
                createGif: createSpriteGif,
                maxScale: 8,
                closeOverlay: () => this.setState({ showGifOverlay: false })
            })

        let extrasOverlay = !showExtrasOverlay ? null :
            h(ExtrasOverlay, {
                header: '精靈設定',
                buttons: [
                    nameTextbox,
                    hr(),
                    gifButton,
                    hr(),
                    exportButton,
                    duplicateButton,
                    convertButton,
                    removeButton,
                ],
                closeOverlay: () => this.setState({ showExtrasOverlay: false })
            })
    
        let frameButtonList = frameList.length === 1 ? null :
            frameList.map((frame, i) => {
                let selectedClass = i === currentFrameIndex ? ' selected' : ''
                return button({
                    className: 'simple sprite-button' + selectedClass,
                    onclick: () => this.setState({ currentFrameIndex: i })
                }, h(SpriteCanvas, {
                    width,
                    height,
                    frameList: [frame],
                    colorList,
                    isTransparent,
                    frameIndex: 0
                }))
            })
    
        let addFrameButton = frameList.length >= 4 ? null :
            iconButton({
                title: 'add frame',
                onclick: () => {
                    let newFrame = currentFrame.slice()
                    addFrame(newFrame)
                    this.setState({ currentFrameIndex: frameList.length - 1 })
                }
            }, frameList.length > 1 ? 'add' : 'animation')
    
        let removeFrameButton = frameList.length <= 1 ? null :
            button({
                onclick: () => this.setState({ showRemoveFrameOverlay: true })
            }, '移除動畫幀')

        let removeFrameOverlay = !showRemoveFrameOverlay ? null :
            h(RemoveOverlay, {
                header: '移除動畫幀?',
                closeOverlay: () => this.setState({ showRemoveFrameOverlay: false }),
                remove: () => {
                    removeFrame(currentFrameIndex)
                    this.setState({
                        currentFrameIndex: Math.max(0, currentFrameIndex - 1),
                        showRemoveFrameOverlay: false,
                        showFrameExtrasOverlay: false
                    })
                }
            })
    
        let clearFrameButton = button({
            onclick: () => this.setState({ showClearFrameOverlay: true })
        }, '清除')

        let clearFrameOverlay = !showClearFrameOverlay ? null :
            h(RemoveOverlay, {
                header: '清除動畫幀?',
                closeOverlay: () => this.setState({ showClearFrameOverlay: false }),
                remove: () => {
                    let frame = Sprite.clearFrame(width, height)
                    updateFrame(currentFrameIndex, frame)
                    this.setState({
                        showClearFrameOverlay: false,
                        showFrameExtrasOverlay: false
                    })
                }
            })

        let randomFrameButton = button({
            onclick: () => this.setState({ showRandomFrameOverlay: true })
        }, '隨機生成')

        let randomFrameOverlay = !showRandomFrameOverlay ? null :
            h(RemoveOverlay, {
                header: '隨機生成動畫幀?',
                closeOverlay: () => this.setState({ showRandomFrameOverlay: false }),
                remove: () => {
                    let frame = Sprite.randomFrame(width, height)
                    updateFrame(currentFrameIndex, frame)
                    this.setState({
                        showRandomFrameOverlay: false,
                        showFrameExtrasOverlay: false
                    })
                }
            })

        let flipFrameHorizontalButton = button({
            onclick: () => {
                this.setState({ showFrameExtrasOverlay: false })
                updateFrame(currentFrameIndex, Sprite.flipFrame(width, height, currentFrame, true))
            }
        }, '水平翻轉')

        let flipFrameVerticalButton = button({
            onclick: () => {
                this.setState({ showFrameExtrasOverlay: false })
                updateFrame(currentFrameIndex, Sprite.flipFrame(width, height, currentFrame, false))
            }
        }, '垂直翻轉')

        let rotateFrameButton = button({
            onclick: () => {
                this.setState({ showFrameExtrasOverlay: false })
                updateFrame(currentFrameIndex, Sprite.rotateFrame(width, height, currentFrame))
            }
        }, '旋轉')

        let frameExtrasButton = iconButton({
            title: 'frame actions',
            onclick: () => this.setState({ showFrameExtrasOverlay: true })
        }, 'edit')

        let frameExtrasOverlay = !showFrameExtrasOverlay ? null :
            h(ExtrasOverlay, {
                header: '動畫幀設定',
                buttons: [
                    flipFrameHorizontalButton,
                    flipFrameVerticalButton,
                    rotateFrameButton,
                    hr(),
                    randomFrameButton,
                    clearFrameButton,
                    removeFrameButton
                ],
                closeOverlay: () => this.setState({ showFrameExtrasOverlay: false })
            })
    
        let prevFrame
        if (frameList.length > 1) {
            if (currentFrameIndex > 0) {
                prevFrame = frameList[currentFrameIndex - 1]
            } else {
                prevFrame = frameList[frameList.length - 1]
            }
        }

        let paletteSelector = div({ className: 'row' },
            colorList.slice(1).map((color, idx) => {
                const i = idx + 1;
                return colorButton({
                    className: 'simple' + (i === this.state.currentColorIndex ? ' initial-focus' : ''),
                    isSelected: (i === this.state.currentColorIndex),
                    onclick: () => this.setState({ currentColorIndex: i }),
                    color
                })
            })
        )

        // 工具列（畫筆/油漆桶）
        let toolBar = row([
            iconButton({
                title: '畫筆',
                className: 'simple' + (this.state.currentTool === 'pen' ? ' selected' : ''),
                onclick: () => this.setState({ currentTool: 'pen' })
            }, 'pen'),
            iconButton({
                title: '油漆桶',
                className: 'simple' + (this.state.currentTool === 'bucket' ? ' selected' : ''),
                onclick: () => this.setState({ currentTool: 'bucket' })
            }, 'bucket')
        ])

        let spriteGrid = h(SpriteGrid, {
            width,
            height,
            frame: currentFrame,
            prevFrame, // 傳遞前一幀，支援 onion skin
            colorList,
            isTransparent,
            showGrid: this.state.showGrid,
            currentColorIndex: this.state.currentColorIndex,
            currentTool: this.state.currentTool, // 傳遞工具
            drawPixel: (pixelIndex, newValue) => {
                let frame = currentFrame.slice()
                if (pixelIndex === -1 && Array.isArray(newValue)) {
                    // 整幀替換（用於油漆桶）
                    updateFrame(currentFrameIndex, newValue.slice())
                } else {
                    frame[pixelIndex] = newValue
                    updateFrame(currentFrameIndex, frame)
                }
            }
        })
    
        let gridToggleButton = iconButton({
            title: '格線',
            className: 'simple' + (this.state.showGrid ? ' selected' : ''),
            onclick: () => this.setState(prev => ({ showGrid: !prev.showGrid }))
        }, 'grid')
    
        return panel({ header: 'sprite', id: 'spritePanel', closeTab }, [
            row([
                nameButton,
                scriptButton,
                transparentButton,
                itemButton,
                wallButton
            ]),
            row([
                paletteSelector,
                fill(),
                toolBar, // 插入工具列
            ]),
            hr(),
            div({ className: 'grid-container' }, [
                spriteGrid,
            ]),
            row([
                spritePreview,
                vr(),
                frameButtonList,
                addFrameButton,
                fill(),
                gridToggleButton,
                frameExtrasButton
            ]),
            helpLink('21c642e52df080f9903afca799b0e98a'),
            extrasOverlay,
            frameExtrasOverlay,
            exportOverlay,
            gifOverlay,
            convertSpriteOverlay,
            removeSpriteOverlay,
            removeFrameOverlay,
            clearFrameOverlay,
            randomFrameOverlay
        ])
    }
}