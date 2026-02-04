class RoomGrid extends Component {
    constructor(props) {
        super()

        this.state = {
            usingKeyboard: false,
            lastTileX: props.selectedX || 0,
            lastTileY: props.selectedY || 0,
            hoverX: -1,
            hoverY: -1
        }

        this.frameIndex = 0
        this.spriteFrameList = {}
        this.isDrawing = true

        this.pointerStart = (e) => {
            e.preventDefault()
            this.pointerIsDown = true
            let startOfDraw = true
            this.pointerDraw(e, startOfDraw)
        }

        this.pointerMove = (e) => {
            if (this.pointerIsDown) {
                e.preventDefault()
                this.pointerDraw(e)
            }
            this.updateHover(e)
        }

        this.pointerEnd = (e) => {
            if (this.pointerIsDown) {
                e.preventDefault()
                this.pointerIsDown = false
            }
        }

        this.mouseEnter = (e) => {
            this.updateHover(e)
        }

        this.mouseLeave = (e) => {
            this.setState({ hoverX: -1, hoverY: -1 })
        }

        this.updateHover = (e) => {
            if (!this.props.showGrid) return
            
            let pointer = e.touches ? e.touches[0] : e
            let { roomWidth, roomHeight } = this.props
            let rect = this.node.getBoundingClientRect()
            let tileWidth = rect.width / roomWidth
            let tileHeight = rect.height / roomHeight
            let relX = pointer.clientX - rect.x
            let relY = pointer.clientY - rect.y
            
            if (relX < 0 || relY < 0 || relX >= rect.width || relY >= rect.height) {
                this.setState({ hoverX: -1, hoverY: -1 })
                return
            }

            let x = Math.floor(relX / tileWidth)
            let y = Math.floor(relY / tileHeight)
            
            if (x >= 0 && x < roomWidth && y >= 0 && y < roomHeight) {
                this.setState({ hoverX: x, hoverY: y })
            }
        }

        this.keyDown = (e) => {
            if (!e.key.includes('Arrow') && e.key !== ' ') return
            e.preventDefault()

            let { roomWidth, roomHeight } = this.props
            let x = this.state.lastTileX
            let y = this.state.lastTileY

            if (e.key === 'ArrowUp') y--
            if (e.key === 'ArrowDown') y++
            if (e.key === 'ArrowLeft') x--
            if (e.key === 'ArrowRight') x++
            if (x < 0 || y < 0 || x >= roomWidth || y >= roomHeight) {
                return
            }

            let startOfDraw = false
            if (e.key === ' ') {
                startOfDraw = true
                this.spaceIsDown = true
            }

            if (this.spaceIsDown) {
                this.drawTile(x, y, startOfDraw)
            }

            this.setState({ usingKeyboard: true, lastTileX: x, lastTileY: y })
        }

        this.keyUp = (e) => {
            if (e.key === ' ') this.spaceIsDown = false
        }

        this.pointerDraw = (e, startOfDraw) => {
            let pointer = e.touches ? e.touches[0] : e
            let { roomWidth, roomHeight } = this.props
            let rect = this.node.getBoundingClientRect()
            let tileWidth = rect.width / roomWidth
            let tileHeight = rect.height / roomHeight
            let relX = pointer.clientX - rect.x
            let relY = pointer.clientY - rect.y
            if (relX < 0 || relY < 0 || relX >= rect.width || relY >= rect.height) {
                return
            }

            let x = Math.floor(relX / tileWidth)
            let y = Math.floor(relY / tileHeight)

            this.drawTile(x, y, startOfDraw)

            this.setState({ lastTileX: x, lastTileY: y })
        }

        this.drawTile = (x, y, startOfDraw) => {
            let { tileList, selectTile, drawTile, eraseTile, currentSpriteName, spriteIsTransparent } = this.props

            // when selecting tiles
            if (selectTile) {
                selectTile(x, y)
            }

            // when drawing/erasing tiles
            if (drawTile && eraseTile) {
                let spritesAtLocation = tileList.filter(l => l.x === x && l.y === y)
                let locationIsEmpty = spritesAtLocation.length === 0
                let spriteAlreadyAtLocation = spritesAtLocation.find(l => l.spriteName === currentSpriteName)
                let canDrawOnTile = spriteIsTransparent ? !spriteAlreadyAtLocation : locationIsEmpty

                if (startOfDraw) {
                    this.isDrawing = canDrawOnTile
                }

                if (this.isDrawing && canDrawOnTile) {
                    drawTile(x, y)
                }
                else if (!this.isDrawing) {
                    eraseTile(x, y)
                }
            }
        }

        this.nextFrames = () => {
            Object.keys(this.spriteFrameIndexList).forEach(key => {
                let frameIndex = this.spriteFrameIndexList[key]

                if (!isAnimated) this.frameIndex = frameIndex || 0
                if (this.frameIndex >= this.frameCanvasList.length) {
                    this.frameIndex = 0
                }
            })
        }

        this.drawFrame = (frame, width, colorList, isTransparent, context) => {
            frame.forEach((paletteIndex, i) => {
                let x = Math.floor(i % width)
                let y = Math.floor(i / width)
                if (paletteIndex === 0 && isTransparent) return
                context.fillStyle = colorList[paletteIndex] || '#000000'
                context.fillRect(x, y, 1, 1)
            })
        }

        this.cacheSprites = () => {
            let { spriteList, tileList, colorList } = this.props

            this.spriteFrameList = {}

            tileList.forEach(tile => {
                let { spriteName } = tile
                let sprite = spriteList.find(sprite => sprite.name === spriteName)
                let bgColor = colorList[0]
                
                if (sprite && !this.spriteFrameList[sprite.name]) {
                    this.spriteFrameList[sprite.name] = sprite.frameList.map(frame => {
                        let frameCanvas = document.createElement('canvas')
                        frameCanvas.width = sprite.width
                        frameCanvas.height = sprite.height

                        let context = frameCanvas.getContext('2d')

                        if (!sprite.isTransparent) {
                            context.fillStyle = bgColor
                            context.fillRect(0, 0, sprite.width, sprite.height)
                        }
                        this.drawFrame(frame, sprite.width, colorList, sprite.isTransparent, context)
                        return frameCanvas
                    })
                }
            })
        }

        this.update = (timestamp) => {
            let {
                roomWidth,
                roomHeight,
                spriteWidth,
                spriteHeight,
                spriteList,
                tileList,
                colorList,
                isAnimated,
                showBackground
            } = this.props

            if (!this.lastFrameTimestamp) this.lastFrameTimestamp = timestamp
            let dt = timestamp - this.lastFrameTimestamp
            if (dt >= FRAME_RATE) {
                if (isAnimated) this.frameIndex++
                if (this.frameIndex >= 12) this.frameIndex = 0
                this.lastFrameTimestamp = timestamp
            }
            
            let width = spriteWidth * roomWidth
            let height = spriteHeight * roomHeight
            
            let context = this.canvas.getContext('2d')

            if (showBackground) {
                context.fillStyle = colorList[0]
                context.fillRect(0, 0, width, height)
            } else {
                context.clearRect(0, 0, width, height)
            }

            tileList.forEach(tile => {
                let { spriteName, x, y } = tile
                let sprite = spriteList.find(sprite => sprite.name === spriteName)
                if (sprite) {
                    let xOffset = x * sprite.width
                    let yOffset = y * sprite.height
                    let frameList = this.spriteFrameList[sprite.name]
                    let frameIndex = this.frameIndex % frameList.length
                    let frameData = frameList[frameIndex]
                    context.drawImage(frameData, xOffset, yOffset)
                } else {
                    console.error('sprite "' + spriteName + '" not found')
                }
            })

            if (isAnimated) {
                this.animationRequest = window.requestAnimationFrame(this.update)
            }
        }
    }

    componentDidMount() {
        this.node.addEventListener('mousedown', this.pointerStart)
        document.addEventListener('mousemove', this.pointerMove)
        document.addEventListener('mouseup', this.pointerEnd)
    
        this.node.addEventListener('touchstart', this.pointerStart, { passive: false })
        document.addEventListener('touchend', this.pointerEnd, { passive: false })
        document.addEventListener('touchcancel', this.pointerEnd, { passive: false })
        document.addEventListener('touchmove', this.pointerMove, { passive: false })

        this.node.addEventListener('keydown', this.keyDown)
        this.node.addEventListener('keyup', this.keyUp)

        this.node.addEventListener('mouseenter', this.mouseEnter)
        this.node.addEventListener('mouseleave', this.mouseLeave)

        this.cacheSprites()
        this.update()
    }

    componentWillUnmount() {
        this.node.removeEventListener('mousedown', this.pointerStart)
        document.removeEventListener('mousemove', this.pointerMove)
        document.removeEventListener('mouseup', this.pointerEnd)
    
        this.node.removeEventListener('touchstart', this.pointerStart)
        document.removeEventListener('touchend', this.pointerEnd)
        document.removeEventListener('touchcancel', this.pointerEnd)
        document.removeEventListener('touchmove', this.pointerMove)

        this.node.removeEventListener('keydown', this.keyDown)
        this.node.removeEventListener('keyup', this.keyUp)

        this.node.removeEventListener('mouseenter', this.mouseEnter)
        this.node.removeEventListener('mouseleave', this.mouseLeave)

        window.cancelAnimationFrame(this.animationRequest)
    }

    shouldComponentUpdate(nextProps, nextState) {
        return checkForUpdates(nextProps, this.props) || checkForUpdates(nextState, this.state)
    }

    componentDidUpdate() {
        this.cacheSprites()
        if (!this.props.isAnimated) this.update()
    }

    render({ className, spriteWidth, spriteHeight, roomWidth, roomHeight, colorList, showGrid, showDialogSpriteOverlay, dialogSpriteFilter, spriteList, tileList, isAnimated, ...restProps }, { usingKeyboard, lastTileX, lastTileY, hoverX, hoverY }) {
        let tileWidth = 100 / (roomWidth + 2)
        let tileHeight = tileWidth * (spriteWidth / spriteHeight)
        
        let canvasWidth = tileWidth * roomWidth
        let canvasHeight = tileHeight * roomHeight

        let highlightWidth = 100 / roomWidth
        let highlightHeight = 100 / roomHeight
        let tileX = lastTileX * highlightWidth
        let tileY = lastTileY * highlightHeight

        let gridHighlight = showGrid && usingKeyboard ?
            div({
                className: 'grid-highlight',
                style: {
                    left: tileX + '%',
                    top: tileY + '%',
                    width: highlightWidth + '%',
                    height: highlightHeight + '%'
                }
            }) : null

        let hoverHighlight = showGrid && hoverX !== -1 && hoverY !== -1 ?
            div({
                className: 'hover-highlight',
                style: {
                    left: hoverX * highlightWidth + '%',
                    top: hoverY * highlightHeight + '%',
                    width: highlightWidth + '%',
                    height: highlightHeight + '%'
                }
            }) : null

        let gridLinesRows = []
        for (let y = 0; y < roomHeight; y++) {
            let gridLinesCells = []
            for (let x = 0; x < roomWidth; x++) {
                gridLinesCells.push(
                    h('td', {
                        className: 'gridlines-cell'
                    })
                )
            }
            gridLinesRows.push(
                h('tr', {
                    className: 'gridlines-row'
                }, gridLinesCells)
            )
        }
        let gridLines = showGrid ? div({ className: 'gridlines' }, h('table', {}, gridLinesRows)) : null

        // 覆蓋層
        let dialogOverlay = null
        if (showDialogSpriteOverlay) {
            // 每格找 tileList 上所有精靈，從最上層往下找第一個有 on-push 的精靈
            let overlayCells = []
            for (let y = 0; y < roomHeight; y++) {
                let rowCells = []
                for (let x = 0; x < roomWidth; x++) {
                    // 找出這格所有精靈（tileList 順序，最後一個是最上層）
                    let tilesAtPos = tileList.filter(tile => tile.x === x && tile.y === y)
                    let dialogSpriteIndex = -1
                    let hasDialog = false
                    // 從最上層往下找第一個有 on-push 的精靈
                    for (let i = tilesAtPos.length - 1; i >= 0; i--) {
                        let spriteIndex = spriteList.findIndex(s => s && s.name === tilesAtPos[i].spriteName)
                        let sprite = spriteList[spriteIndex]
                        if (sprite && dialogSpriteFilter && dialogSpriteFilter(sprite)) {
                            dialogSpriteIndex = spriteIndex
                            hasDialog = true
                            break
                        }
                    }
                    rowCells.push(
                        div({
                            className: 'dialog-sprite-overlay-cell',
                            style: {
                                position: 'absolute',
                                left: (x * 100 / roomWidth) + '%',
                                top: (y * 100 / roomHeight) + '%',
                                width: (100 / roomWidth) + '%',
                                height: (100 / roomHeight) + '%',
                                background: hasDialog ? 'none' : 'rgba(238,238,238,0.66)',
                                cursor: hasDialog ? 'pointer' : 'default',
                                zIndex: 10
                            },
                            onclick: hasDialog && typeof restProps.onDialogSpriteSelect === 'function' ? () => restProps.onDialogSpriteSelect(dialogSpriteIndex) : undefined
                        })
                    )
                }
                overlayCells.push(rowCells)
            }
            dialogOverlay = div({
                className: 'dialog-sprite-overlay',
                style: {
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'auto',
                    zIndex: 1
                }
            }, overlayCells.flat())
        }

        return div({
            className: 'grid room-grid ' + className,
            style: {
                width: canvasWidth + '%',
                paddingTop: canvasHeight + '%',
                backgroundColor: colorList[0],
                position: 'relative'
            },
            ref: node => { this.node = node },
            tabindex: 0
        }, [
            canvas({
                width: spriteWidth * roomWidth,
                height: spriteHeight * roomHeight,
                ref: node => { this.canvas = node }
            }),
            gridLines,
            gridHighlight,
            hoverHighlight,
            dialogOverlay
        ])
    }
}