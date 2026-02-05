class GraphicPanel extends Component {
    constructor() {
        super()
        this.state = {
            currentFrameIndex: 0,
            showGrid: false,
            currentColorIndex: 1,
            showExtrasOverlay: false,
            showExportOverlay: false,
            showRemoveOverlay: false,
            showGifOverlay: false,
            showRemoveFrameOverlay: false,
            showClearFrameOverlay: false,
            showRandomFrameOverlay: false,
            showEditOverlay: false,
            showMusicOverlay: false,
            showPaletteOverlay: false,
            currentTool: 'pen', // 新增：預設為畫筆
            refreshKey: Math.random() // 新增
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.graphic !== this.props.graphic) {
            this.setState({ currentFrameIndex: 0 })
        }
    }

    render({
        closeTab,
        openScriptTab,

        renameGraphic,
        exportGraphic,
        createGraphicGif,
        removeGraphic,
        duplicateGraphic,

        addFrame,
        removeFrame,
        updateFrame,
        setGraphicIsTransparent,
        
        graphic,
        colorList,
        paletteList = [],
        musicList = [],
        editMusic,
        addMusic,
        importMusic,
        editPalette,
        addPalette,
        importPalette
    }, {
        currentFrameIndex,
        showExtrasOverlay,
        showExportOverlay,
        showRemoveOverlay,
        showGifOverlay,
        showRemoveFrameOverlay,
        showClearFrameOverlay,
        showRandomFrameOverlay,
        showEditOverlay,
        showMusicOverlay,
        showPaletteOverlay
    }) {
        if (!graphic) return

        let { name, type, width, height, frameList, scriptList, paletteName, musicName, isTransparent } = graphic
        let currentFrame = frameList[currentFrameIndex]

        let nameButton = button({
            className: 'fill',
            onclick: () => this.setState({ showExtrasOverlay: true })
        }, name)

        let nameTextbox = textbox({
            placeholder: 'graphic name',
            value: name,
            onchange: e => renameGraphic(e.target.value)
        })

        // overlay 狀態這行移除，直接用 props 解構
        // let { showMusicOverlay, showPaletteOverlay } = this.state;

        // script 按鈕（對話）
        let scriptListArr = scriptList ? Object.keys(scriptList).map(key => scriptList[key]) : [];
        let hasScripts = scriptListArr.find(script => !!script);
        let scriptButton = type === 'picture' ? iconButton({
            title: 'script',
            className: 'simple' + (hasScripts ? ' selected' : ''),
            onclick: () => openScriptTab && openScriptTab()
        }, 'script') : null;

        // music 按鈕
        let currentMusicIndex = musicList.findIndex(m => m.name === musicName);
        // 如果找不到對應的音樂，自動切換到第一個音樂
        if (currentMusicIndex === -1 && musicList.length > 0) {
            currentMusicIndex = 0;
            // 更新當前幀的音樂名稱
            let newFrame = { ...currentFrame, musicName: musicList[0].name };
            updateFrame(currentFrameIndex, newFrame);
        }
        let currentMusic = musicList[currentMusicIndex] || musicList[0];
        let musicBtn = type === 'picture' ? musicButton({
            className: 'simple',
            onclick: () => this.setState({ showMusicOverlay: true }),
            music: currentMusic,
            isSmall: true
        }) : null;
        let musicOverlay = !showMusicOverlay ? null :
            h(MusicListOverlay, {
                closeOverlay: () => this.setState({ showMusicOverlay: false }),
                selectMusic: musicIndex => {
                    let newFrame = { ...currentFrame, musicName: musicList[musicIndex].name };
                    updateFrame(currentFrameIndex, newFrame);
                    this.setState({ showMusicOverlay: false });
                },
                editMusic: () => {
                    editMusic && editMusic();
                    this.setState({ showMusicOverlay: false });
                },
                addMusic: music => {
                    addMusic && addMusic(music);
                    this.setState({ showMusicOverlay: false });
                },
                importMusic: musicData => {
                    importMusic && importMusic(musicData);
                    this.setState({ showMusicOverlay: false });
                },
                currentMusicIndex,
                musicList
            });

        // palette 按鈕
        let currentPaletteIndex = paletteList.findIndex(p => p.name === paletteName);
        // 如果找不到對應的調色盤，自動切換到第一個調色盤
        if (currentPaletteIndex === -1 && paletteList.length > 0) {
            currentPaletteIndex = 0;
            // 更新當前幀的調色盤名稱
            let newFrame = { ...currentFrame, paletteName: paletteList[0].name };
            updateFrame(currentFrameIndex, newFrame);
        }
        let currentPalette = paletteList[currentPaletteIndex] || paletteList[0];
        let paletteBtn = type === 'picture' ? paletteButton({
            className: 'simple',
            onclick: () => this.setState({ showPaletteOverlay: true }),
            palette: currentPalette
        }) : null;
        let paletteOverlay = !showPaletteOverlay ? null :
            h(PaletteListOverlay, {
                closeOverlay: () => this.setState({ showPaletteOverlay: false }),
                selectPalette: paletteIndex => {
                    let newFrame = { ...currentFrame, paletteName: paletteList[paletteIndex].name };
                    updateFrame(currentFrameIndex, newFrame);
                    this.setState({ showPaletteOverlay: false });
                },
                editPalette: () => {
                    editPalette && editPalette();
                    this.setState({ showPaletteOverlay: false });
                },
                addPalette: palette => {
                    addPalette && addPalette(palette);
                    this.setState({ showPaletteOverlay: false });
                },
                importPalette: paletteData => {
                    importPalette && importPalette(paletteData);
                    this.setState({ showPaletteOverlay: false });
                },
                currentPaletteIndex,
                paletteList
            });

        // transparent 按鈕（只有 face 才顯示）
        let transparentButton = type === 'face' ? iconButton({
            title: 'transparent',
            className: 'simple' + (isTransparent ? ' selected' : ''),
            onclick: () => setGraphicIsTransparent && setGraphicIsTransparent(!isTransparent)
        }, 'transparent') : null;

        let exportButton = button({
            onclick: () => this.setState({ showExtrasOverlay: false, showExportOverlay: true })
        }, '匯出')

        let exportOverlay = !showExportOverlay ? null :
            h(ExportOverlay, {
                header: '匯出圖片',
                fileName: `${graphic.name || 'untitled'}.mosigraphic`,
                data: exportGraphic(),
                closeOverlay: () => this.setState({ showExportOverlay: false })
            })

        let removeButton = button({
            onclick: () => this.setState({ showExtrasOverlay: false, showRemoveOverlay: true }),
        }, '移除圖片')

        let removeOverlay = !showRemoveOverlay ? null :
            h(RemoveOverlay, {
                header: '移除圖片?',
                closeOverlay: () => this.setState({ showRemoveOverlay: false }),
                remove: () => {
                    removeGraphic()
                    this.setState({ showRemoveOverlay: false })
                }
            })

        let duplicateButton = button({
            onclick: () => {
                this.setState({ showExtrasOverlay: false })
                duplicateGraphic()
            }
        }, '複製')

        let gifButton = button({
            onclick: () => this.setState({ showExtrasOverlay: false, showGifOverlay: true })
        }, '生成gif')

        let gifOverlay = !showGifOverlay ? null :
            h(GifOverlay, {
                colorList,
                createGif: createGraphicGif,
                maxScale: 8,
                closeOverlay: () => this.setState({ showGifOverlay: false })
            })

        let extrasOverlay = !showExtrasOverlay ? null :
            h(GraphicExtrasOverlay, {
                buttons: [
                    nameTextbox,
                    hr(),
                    gifButton,
                    hr(),
                    exportButton,
                    duplicateButton,
                    removeButton,
                ],
                closeOverlay: () => this.setState({ showExtrasOverlay: false })
            })

        let frameButtonList = frameList.length === 1 ? null :
            frameList.map((frame, i) => {
                let selectedClass = i === currentFrameIndex ? ' selected' : ''
                return button({
                    className: 'simple graphic-button' + selectedClass,
                    onclick: () => this.setState({ currentFrameIndex: i })
                }, h(GraphicCanvas, {
                    key: this.state.refreshKey + '-' + i + '-' + frame.join(','), // 強制刷新
                    width,
                    height,
                    type,
                    frameList: [frame],
                    colorList,
                    isTransparent: type === 'face' ? (isTransparent || false) : false, // 只有 face 才使用 isTransparent
                    style: { width: '32px', height: '32px' },
                    spriteWidth: graphic.spriteWidth,
                    spriteHeight: graphic.spriteHeight
                }))
            })

        // 新增動畫預覽（仿照 sprite-panel）
        let graphicPreview = button({
            className: 'graphic-button',
            style: { marginRight: '8px' },
            onclick: null // 可加互動
        }, h(GraphicCanvas, {
            key: this.state.refreshKey, // 強制刷新
            width,
            height,
            type,
            frameList,
            isAnimated: true,
            colorList,
            isTransparent: type === 'face' ? (isTransparent || false) : false, // 只有 face 才使用 isTransparent
            spriteWidth: graphic.spriteWidth,
            spriteHeight: graphic.spriteHeight
        }))

        // 新增動畫幀按鈕（仿照 sprite-panel，最大 4 幀）
        let addFrameButton = (addFrame && frameList.length < 4) ? iconButton({
            title: 'add frame',
            onclick: () => {
                let newFrame = currentFrame.slice();
                addFrame(newFrame);
                this.setState({ currentFrameIndex: frameList.length });
            }
        }, frameList.length > 1 ? 'add' : 'animation') : null

        // 調色盤選擇器（僅顯示）
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

        let gridToggleButton = iconButton({
            title: '格線',
            className: 'simple' + (this.state.showGrid ? ' selected' : ''),
            onclick: () => this.setState(prev => ({ showGrid: !prev.showGrid }))
        }, 'grid')

        // drawPixel 實作（比照 sprite-panel）
        let drawPixel = (pixelIndex, newValue) => {
            let newFrameList = frameList.slice()
            newFrameList[currentFrameIndex] = newFrameList[currentFrameIndex].slice()
            if (pixelIndex === -1 && Array.isArray(newValue)) {
                // 整幀替換
                newFrameList[currentFrameIndex] = newValue.slice()
                updateFrame(currentFrameIndex, newFrameList[currentFrameIndex])
                this.setState({ refreshKey: Math.random() }) // 只在整幀時強制刷新
            } else {
                newFrameList[currentFrameIndex][pixelIndex] = newValue
                updateFrame(currentFrameIndex, newFrameList[currentFrameIndex])
                this.setState({ refreshKey: Math.random() }) // 單像素也強制刷新
            }
        }

        // 幀操作按鈕（比照 sprite-panel）
        let frameExtrasButton = iconButton({
            title: 'frame actions',
            onclick: () => this.setState({ showEditOverlay: true })
        }, 'edit')

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
                        showEditOverlay: false
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
                    let frame = new Array(width * height).fill(0)
                    updateFrame(currentFrameIndex, frame)
                    this.setState({
                        showClearFrameOverlay: false,
                        showEditOverlay: false,
                        refreshKey: Math.random() // 強制刷新
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
                    let frame = new Array(width * height).fill(0).map(() => Math.floor(Math.random() * colorList.length))
                    updateFrame(currentFrameIndex, frame)
                    this.setState({
                        showRandomFrameOverlay: false,
                        showEditOverlay: false,
                        refreshKey: Math.random() // 強制刷新
                    })
                }
            })

        let flipFrameHorizontalButton = button({
            onclick: () => {
                this.setState({ showEditOverlay: false })
                let newFrame = []
                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        newFrame.push(currentFrame[width * y + (width - 1 - x)])
                    }
                }
                updateFrame(currentFrameIndex, newFrame)
                this.setState({ refreshKey: Math.random() }) // 強制刷新
            }
        }, '水平翻轉')

        let flipFrameVerticalButton = button({
            onclick: () => {
                this.setState({ showEditOverlay: false })
                let newFrame = []
                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        newFrame.push(currentFrame[width * (height - 1 - y) + x])
                    }
                }
                updateFrame(currentFrameIndex, newFrame)
                this.setState({ refreshKey: Math.random() }) // 強制刷新
            }
        }, '垂直翻轉')

        let rotateFrameButton = button({
            onclick: () => {
                this.setState({ showEditOverlay: false })
                let newFrame = []
                for (let x = 0; x < width; x++) {
                    for (let y = height - 1; y >= 0; y--) {
                        newFrame.push(currentFrame[width * y + x])
                    }
                }
                updateFrame(currentFrameIndex, newFrame)
                this.setState({ refreshKey: Math.random() }) // 強制刷新
            }
        }, '旋轉')

        let frameExtrasOverlay = !showEditOverlay ? null :
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
                closeOverlay: () => this.setState({ showEditOverlay: false })
            })

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

        // canvas 區塊
        let canvasBlock = null
        if (type === 'picture') {
            // picture 比照 room-panel 用 grid-container room-block
            canvasBlock = div({ className: 'grid-container room-block' }, [
                h(GraphicCanvas, {
                    key: this.state.refreshKey, // 強制刷新
                    width,
                    height,
                    type,
                    frameList: [currentFrame],
                    colorList,
                    isTransparent: false, // picture 沒有 isTransparent 屬性
                    showGrid: this.state.showGrid,
                    currentColorIndex: this.state.currentColorIndex,
                    drawPixel,
                    currentTool: this.state.currentTool, // 傳遞工具
                    spriteWidth: graphic.spriteWidth,
                    spriteHeight: graphic.spriteHeight
                })
            ])
        } else if (type === 'face') {
            // face 比照 sprite-panel 用 grid-container
            canvasBlock = div({ className: 'grid-container' }, [
                h(GraphicCanvas, {
                    key: this.state.refreshKey, // 強制刷新
                    width,
                    height,
                    type,
                    frameList: [currentFrame],
                    colorList,
                    isTransparent: isTransparent || false, // 使用 graphic 的 isTransparent 屬性
                    showGrid: this.state.showGrid,
                    currentColorIndex: this.state.currentColorIndex,
                    drawPixel,
                    currentTool: this.state.currentTool, // 傳遞工具
                    spriteWidth: graphic.spriteWidth,
                    spriteHeight: graphic.spriteHeight
                })
            ])
        }

        let panelContent = [
            row([
                nameButton,
                scriptButton,
                transparentButton,
                musicBtn,
                paletteBtn
            ]),
            row([
                paletteSelector,
                fill(),
                toolBar, // 插入工具列
            ]),
            hr(),
            canvasBlock,
            row([
                graphicPreview,
                vr(),
                frameButtonList,
                addFrameButton,
                fill(),
                gridToggleButton,
                frameExtrasButton
            ]),
            helpLink('22a642e52df08000a4d9fd03ebff95d0'),
            extrasOverlay,
            frameExtrasOverlay,
            removeFrameOverlay,
            clearFrameOverlay,
            randomFrameOverlay,
            exportOverlay,
            gifOverlay,
            removeOverlay,
            musicOverlay,
            paletteOverlay
        ];
        return panel({ header: 'graphic', id: 'graphicPanel', closeTab: this.props.closeTab }, [
            div({ className: 'content' }, panelContent)
        ]);
    }
}

if (typeof module !== 'undefined') module.exports = GraphicPanel;
window.GraphicPanel = GraphicPanel;