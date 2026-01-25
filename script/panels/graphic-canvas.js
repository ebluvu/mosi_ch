class GraphicCanvas extends Component {
    constructor() {
        super()
        this.state = {
            usingKeyboard: false,
            lastTileX: 0,
            lastTileY: 0,
            hoverX: -1,
            hoverY: -1,
            animFrame: 0
        }
        this.animTimer = null
        
        // 性能優化：離線繪製
        this.lastDrawTime = 0
        this.drawThrottle = 16 // 約 60fps
        this.pendingUpdates = []
        this.updateTimeout = null
        this.isDrawing = false
        this.offlineCanvas = null
        this.offlineContext = null
        // 新增：動畫幀快取
        this.frameCanvasList = []
        this.lastFrameList = null
        this.lastColorList = null
        this.lastIsTransparent = null
    }

    // 新增：快取所有動畫幀
    cacheFrameCanvases = () => {
        const { frameList = [], width, height, colorList = [], isTransparent } = this.props
        if (this.lastFrameList === frameList && this.lastColorList === colorList && this.lastIsTransparent === isTransparent) return
        this.frameCanvasList = frameList.map(frame => {
            let frameCanvas = document.createElement('canvas')
            frameCanvas.width = width
            frameCanvas.height = height
            let context = frameCanvas.getContext('2d')
            if (!isTransparent) {
                context.fillStyle = colorList[0] || '#fff'
                context.fillRect(0, 0, width, height)
            }
            frame.forEach((paletteIndex, i) => {
                let x = i % width
                let y = Math.floor(i / width)
                if (paletteIndex === 0 && isTransparent) return
                context.fillStyle = colorList[Math.min(paletteIndex, colorList.length - 1)] || '#000'
                context.fillRect(x, y, 1, 1)
            })
            return frameCanvas
        })
        this.lastFrameList = frameList
        this.lastColorList = colorList
        this.lastIsTransparent = isTransparent
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

        this.cacheFrameCanvases()
        this.update()
        this.startAnim()
        
        // 創建離線 canvas
        this.createOfflineCanvas()
    }

    createOfflineCanvas = () => {
        let { width, height } = this.props
        this.offlineCanvas = document.createElement('canvas')
        this.offlineCanvas.width = width
        this.offlineCanvas.height = height
        this.offlineContext = this.offlineCanvas.getContext('2d')
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
        this.stopAnim()
        
        // 清理 timeout
        if (this.updateTimeout) {
            clearTimeout(this.updateTimeout)
            this.updateTimeout = null
        }
        
        // 清理記憶體
        this.offlineCanvas = null
        this.offlineContext = null
        this.pendingUpdates = []
        this.isDrawing = false
    }

    shouldComponentUpdate(nextProps, nextState) {
        // 記憶體優化：只在必要時重新渲染
        if (nextState.animFrame !== this.state.animFrame) return true
        if (nextState.hoverX !== this.state.hoverX || nextState.hoverY !== this.state.hoverY) return true
        if (nextState.usingKeyboard !== this.state.usingKeyboard) return true
        if (nextState.lastTileX !== this.state.lastTileX || nextState.lastTileY !== this.state.lastTileY) return true
        
        // 檢查 props 變化
        if (nextProps.width !== this.props.width || nextProps.height !== this.props.height) return true
        if (nextProps.frameList !== this.props.frameList) return true
        if (nextProps.colorList !== this.props.colorList) return true
        if (nextProps.isTransparent !== this.props.isTransparent) return true
        if (nextProps.isAnimated !== this.props.isAnimated) return true
        if (nextProps.showGrid !== this.props.showGrid) return true
        if (nextProps.currentColorIndex !== this.props.currentColorIndex) return true
        
        return false
    }

    componentDidUpdate(prevProps) {
        // 檢查是否需要重新創建離線 canvas
        if (prevProps.width !== this.props.width || prevProps.height !== this.props.height) {
            this.createOfflineCanvas()
        }
        
        // 確保離線 canvas 存在並同步
        if (!this.offlineCanvas) {
            this.createOfflineCanvas()
        }
        
        // 檢查 frameList 是否改變，如果改變且不在繪圖狀態，重新同步離線 canvas
        if (prevProps.frameList !== this.props.frameList && !this.isDrawing) {
            this.syncOfflineCanvas()
        }
        
        this.cacheFrameCanvases()
        this.update()
        if (prevProps.frameList !== this.props.frameList || prevProps.isAnimated !== this.props.isAnimated) {
            this.stopAnim()
            this.startAnim()
        }
    }

    // 新增 flood fill 方法
    floodFill = (startX, startY) => {
        const { width, height, frameList, currentColorIndex = 1, drawPixel } = this.props;
        const frame = frameList[0];
        const targetColor = frame[width * startY + startX];
        const fillColor = currentColorIndex;
        
        // 如果目標顏色等於選取顏色，則消除為0（與畫筆行為一致）
        // 否則填充為選取顏色
        const newColor = (targetColor === fillColor) ? 0 : fillColor;
        
        const visited = new Array(width * height).fill(false);
        const queue = [];
        queue.push({ x: startX, y: startY });
        visited[width * startY + startX] = true;
        let newFrame = frame.slice();
        while (queue.length > 0) {
            const { x, y } = queue.shift();
            const idx = width * y + x;
            if (newFrame[idx] === targetColor) {
                newFrame[idx] = newColor;
                // 四方向擴展
                [
                    { dx: 1, dy: 0 },
                    { dx: -1, dy: 0 },
                    { dx: 0, dy: 1 },
                    { dx: 0, dy: -1 }
                ].forEach(({ dx, dy }) => {
                    const nx = x + dx, ny = y + dy;
                    if (
                        nx >= 0 && nx < width &&
                        ny >= 0 && ny < height &&
                        !visited[width * ny + nx] &&
                        newFrame[width * ny + nx] === targetColor
                    ) {
                        queue.push({ x: nx, y: ny });
                        visited[width * ny + nx] = true;
                    }
                });
            }
        }
        // 一次性批量更新
        if (typeof drawPixel === 'function') {
            drawPixel(-1, newFrame);
        }
    }

    pointerStart = (e) => {
        e.preventDefault()
        this.pointerIsDown = true
        this.isDrawing = true
        
        // 確保離線 canvas 已初始化並與當前狀態同步
        if (!this.offlineCanvas) {
            this.createOfflineCanvas()
        }
        this.syncOfflineCanvas()
        
        let pointer = e.touches ? e.touches[0] : e
        let rect = this.node.getBoundingClientRect()
        let pixelSize = rect.width / this.props.width
        let relX = pointer.clientX - rect.x
        let relY = pointer.clientY - rect.y
        let x = Math.floor(relX / pixelSize)
        let y = Math.floor(relY / pixelSize)
        
        // 先設置起始位置，但不立即繪製
        this.lastDrawX = x
        this.lastDrawY = y
        
        // 根據工具決定行為
        if (this.props.currentTool === 'bucket') {
            this.floodFill(x, y)
        } else {
            this.drawSinglePixel(x, y)
        }
    }

    pointerMove = (e) => {
        if (!this.pointerIsDown) {
            this.updateHover(e)
            return
        }
        let pointer = e.touches ? e.touches[0] : e
        let rect = this.node.getBoundingClientRect()
        let pixelSize = rect.width / this.props.width
        let relX = pointer.clientX - rect.x
        let relY = pointer.clientY - rect.y
        let x = Math.floor(relX / pixelSize)
        let y = Math.floor(relY / pixelSize)
        if (x !== this.lastDrawX || y !== this.lastDrawY) {
            this.lastDrawX = x
            this.lastDrawY = y
            this.drawPixelEvent(e, true)
        }
        this.updateHover(e)
    }

    pointerEnd = (e) => {
        if (this.pointerIsDown) {
            e.preventDefault()
            this.pointerIsDown = false
            this.isDrawing = false
            
            // 繪製結束時，立即更新所有待更新的像素
            if (this.pendingUpdates.length > 0 && typeof this.props.drawPixel === 'function') {
                this.pendingUpdates.forEach(update => {
                    this.props.drawPixel(update.pixelIndex, update.newValue)
                })
                this.pendingUpdates = []
            }
            
            // 重新同步離線 canvas 與主 canvas
            this.syncOfflineCanvas()
        }
    }

    mouseEnter = (e) => {
        this.updateHover(e)
    }

    mouseLeave = (e) => {
        this.setState({ hoverX: -1, hoverY: -1 })
    }

    updateHover = (e) => {
        if (!this.props.showGrid) return
        let pointer = e.touches ? e.touches[0] : e
        let rect = this.node.getBoundingClientRect()
        let { width, height } = this.props
        let pixelSize = rect.width / width
        let relX = pointer.clientX - rect.x
        let relY = pointer.clientY - rect.y
        if (relX < 0 || relY < 0 || relX >= rect.width || relY >= rect.height) {
            this.setState({ hoverX: -1, hoverY: -1 })
            return
        }
        let x = Math.floor(relX / pixelSize)
        let y = Math.floor(relY / pixelSize)
        if (x >= 0 && x < width && y >= 0 && y < height) {
            this.setState({ hoverX: x, hoverY: y })
        }
    }

    keyDown = (e) => {
        if (!e.key.includes('Arrow') && e.key !== ' ') return
        e.preventDefault()

        let { width, height, frameList, drawPixel } = this.props
        let frame = frameList[0]
        let x = this.state.lastTileX
        let y = this.state.lastTileY

        if (e.key === 'ArrowUp') y--
        if (e.key === 'ArrowDown') y++
        if (e.key === 'ArrowLeft') x--
        if (e.key === 'ArrowRight') x++
        if (x < 0 || y < 0 || x >= width || y >= height) {
            return
        }

        let pixelIndex = width * y + x

        if (e.key === ' ') {
            this.spaceIsDown = true
            this.pixelValue = frame[pixelIndex] ? 0 : 1
        }

        if (this.spaceIsDown) {
            drawPixel(pixelIndex, this.pixelValue)
        }

        this.setState({ usingKeyboard: true, lastTileX: x, lastTileY: y })
    }

    keyUp = (e) => {
        if (e.key === ' ') this.spaceIsDown = false
    }

    drawPixelEvent = (e, setPixelValue) => {
        // 如果是預覽模式（沒有 drawPixel 或只是動畫預覽），不執行繪圖
        if (typeof this.props.drawPixel !== 'function') return
        
        let pointer = e.touches ? e.touches[0] : e
        let rect = this.node.getBoundingClientRect()
        let pixelSize = rect.width / this.props.width
        let relX = pointer.clientX - rect.x
        let relY = pointer.clientY - rect.y
        if (relX < 0 || relY < 0 || relX >= rect.width || relY >= rect.height) {
            return
        }

        let x = Math.floor(relX / pixelSize)
        let y = Math.floor(relY / pixelSize)

        let pixelIndex = this.props.width * y + x
        let frame = this.props.frameList[0]
        let currentColorIndex = this.props.currentColorIndex || 1
        let prevValue = frame[pixelIndex]
        let newValue
        if (prevValue === currentColorIndex) {
            newValue = 0
        } else {
            newValue = currentColorIndex
        }

        // 確保離線 canvas 已初始化
        if (this.isDrawing && !this.offlineCanvas) {
            this.createOfflineCanvas()
        }

        // --- 滑鼠軌跡補點 ---
        let points = this.getLinePoints(this.lastDrawX, this.lastDrawY, x, y)
        for (let pt of points) {
            let idx = this.props.width * pt.y + pt.x
            let prev = frame[idx]
            let val = (prev === currentColorIndex) ? 0 : currentColorIndex
            if (this.isDrawing) {
                this.drawPixelOffline(pt.x, pt.y, val)
                this.pendingUpdates.push({ pixelIndex: idx, newValue: val })
            } else {
                this.props.drawPixel(idx, val)
            }
        }

        // 清除之前的 timeout
        if (this.updateTimeout) {
            clearTimeout(this.updateTimeout)
        }
        // 延遲更新 React 狀態
        if (this.isDrawing) {
            this.updateTimeout = setTimeout(() => {
                if (this.pendingUpdates.length > 0) {
                    this.pendingUpdates.forEach(update => {
                        this.props.drawPixel(update.pixelIndex, update.newValue)
                    })
                    this.pendingUpdates = []
                }
            }, 100)
        }

        this.setState({ lastTileX: x, lastTileY: y })
    }

    // 補點演算法（Bresenham）
    getLinePoints = (x0, y0, x1, y1) => {
        let points = []
        x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1)
        let dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0)
        let sx = x0 < x1 ? 1 : -1
        let sy = y0 < y1 ? 1 : -1
        let err = dx - dy
        while (true) {
            points.push({ x: x0, y: y0 })
            if (x0 === x1 && y0 === y1) break
            let e2 = 2 * err
            if (e2 > -dy) { err -= dy; x0 += sx }
            if (e2 < dx) { err += dx; y0 += sy }
        }
        return points
    }

    drawSinglePixel = (x, y) => {
        let { width, frameList, currentColorIndex = 1, drawPixel } = this.props
        let frame = frameList[0]
        let pixelIndex = width * y + x
        let prevValue = frame[pixelIndex]
        let newValue = (prevValue === currentColorIndex) ? 0 : currentColorIndex
        
        if (this.isDrawing) {
            this.drawPixelOffline(x, y, newValue)
            this.pendingUpdates.push({ pixelIndex, newValue })
        } else if (typeof drawPixel === 'function') {
            drawPixel(pixelIndex, newValue)
        }
    }

    drawPixelOffline = (x, y, colorIndex) => {
        if (!this.offlineContext) return
        
        let { colorList, isTransparent } = this.props
        let color = colorList[colorIndex] || '#000000'
        
        if (colorIndex === 0 && isTransparent) {
            // 透明像素，清除該位置
            this.offlineContext.clearRect(x, y, 1, 1)
        } else {
            // 繪製像素
            this.offlineContext.fillStyle = color
            this.offlineContext.fillRect(x, y, 1, 1)
        }
        
        // 將離線 canvas 的內容複製到主 canvas
        let mainContext = this.canvas.getContext('2d')
        mainContext.drawImage(this.offlineCanvas, 0, 0)
    }

    syncOfflineCanvas = () => {
        if (!this.offlineContext || !this.canvas) return
        
        let { width, height, frameList, colorList, isTransparent, isAnimated } = this.props
        let frame = frameList && frameList.length > 0 ?
            (isAnimated && frameList.length > 1 ? frameList[this.state.animFrame] : frameList[0]) : null
            
        if (!frame) return
        
        // 重新繪製離線 canvas
        this.offlineContext.clearRect(0, 0, width, height)
        if (!isTransparent) {
            this.offlineContext.fillStyle = colorList[0] || '#ffffff'
            this.offlineContext.fillRect(0, 0, width, height)
        }
        this.drawFrame(frame, width, height, colorList, isTransparent, this.offlineContext)
    }

    drawFrame = (frame, width, height, colorList, isTransparent, context) => {
        // 優化：使用 ImageData 進行批量繪製
        let imageData = context.createImageData(width, height)
        let data = imageData.data
        
        frame.forEach((paletteIndex, i) => {
            let x = Math.floor(i % width)
            let y = Math.floor(i / width)
            if (paletteIndex === 0 && isTransparent) return
            
            // 修正：所有超出範圍的顏色都使用最後一個顏色，而不是純黑色
            let safeIndex = Math.min(paletteIndex, colorList.length - 1)
            let color = colorList[safeIndex] || '#000000'
            let rgb = this.hexToRgb(color)
            if (!rgb) return
            
            let index = (y * width + x) * 4
            data[index] = rgb.r     // R
            data[index + 1] = rgb.g // G
            data[index + 2] = rgb.b // B
            data[index + 3] = 255   // A
        })
        
        context.putImageData(imageData, 0, 0)
    }

    hexToRgb = (hex) => {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null
    }

    update = () => {
        this.cacheFrameCanvases()
        let context = this.canvas.getContext('2d')
        let { width, height, frameList, colorList, isTransparent, isAnimated } = this.props
        // --- 使用快取 ---
        let frameCanvas = null
        if (this.frameCanvasList && this.frameCanvasList.length > 0) {
            let frameIdx = (isAnimated && this.frameCanvasList.length > 1) ? (this.state.animFrame % this.frameCanvasList.length) : 0
            frameCanvas = this.frameCanvasList[frameIdx]
        }
        if (this.isDrawing && this.offlineCanvas) {
            context.clearRect(0, 0, width, height)
            context.drawImage(this.offlineCanvas, 0, 0)
            return
        }
        if (!frameCanvas) return
        context.clearRect(0, 0, width, height)
        context.drawImage(frameCanvas, 0, 0, width, height)
        // 不再繪製格線
        if (this.offlineContext && !this.isDrawing) {
            this.offlineContext.clearRect(0, 0, width, height)
            this.offlineContext.drawImage(frameCanvas, 0, 0, width, height)
        }
    }

    startAnim() {
        if (this.props.isAnimated && this.props.frameList && this.props.frameList.length > 1) {
            // 記憶體優化：使用更長的間隔，減少更新頻率
            this.animTimer = setInterval(() => {
                this.setState(state => ({
                    animFrame: (state.animFrame + 1) % this.props.frameList.length
                }))
            }, 400) // 修正為與 sprite-panel 一致的 400ms
        } else {
            this.setState({ animFrame: 0 })
        }
    }

    stopAnim() {
        if (this.animTimer) {
            clearInterval(this.animTimer)
            this.animTimer = null
        }
    }

    render({ className, width, height, type = 'picture', spriteWidth = 8, spriteHeight = 8 }, { usingKeyboard, lastTileX, lastTileY, hoverX, hoverY }) {
        // 比照 room-grid 使用百分比寬度和 paddingTop 控制縮放
        let canvasWidth = 100
        let canvasHeight = 100 * (height / width)
        
        let highlightWidth = 100 / width
        let highlightHeight = 100 / height
        let pixelX = lastTileX * highlightWidth
        let pixelY = lastTileY * highlightHeight

        let gridHighlight = usingKeyboard ?
            div({
                className: 'grid-highlight',
                style: {
                    left: pixelX + '%',
                    top: pixelY + '%',
                    width: highlightWidth + '%',
                    height: highlightHeight + '%'
                }
            }) : null

        let hoverHighlight = hoverX !== -1 && hoverY !== -1 ?
            div({
                className: 'hover-highlight',
                style: {
                    left: hoverX * highlightWidth + '%',
                    top: hoverY * highlightHeight + '%',
                    width: highlightWidth + '%',
                    height: highlightHeight + '%'
                }
            }) : null

        // 恢復原本的 CSS 格線 <table> 結構
        let gridLinesRows = []
        if (this.props.showGrid) {
            if (type === 'face') {
                // 像素格線
                for (let y = 0; y < height; y++) {
                    let gridLinesCells = []
                    for (let x = 0; x < width; x++) {
                        gridLinesCells.push(
                            h('td', { className: 'gridlines-cell' })
                        )
                    }
                    gridLinesRows.push(
                        h('tr', { className: 'gridlines-row' }, gridLinesCells)
                    )
                }
            } else if (type === 'picture') {
                // 以 spriteWidth/spriteHeight 為單位產生格線
                let rows = Math.ceil(height / spriteHeight)
                let cols = Math.ceil(width / spriteWidth)
                for (let y = 0; y < rows; y++) {
                    let gridLinesCells = []
                    for (let x = 0; x < cols; x++) {
                        gridLinesCells.push(
                            h('td', { className: 'gridlines-cell' })
                        )
                    }
                    gridLinesRows.push(
                        h('tr', { className: 'gridlines-row' }, gridLinesCells)
                    )
                }
            }
        }
        let gridLines = this.props.showGrid && gridLinesRows.length > 0 ? div({ className: 'gridlines' }, h('table', {}, gridLinesRows)) : null

        // 背景色設定（仿照 sprite-canvas）
        let backgroundColor = this.props.isTransparent ? 'transparent' : (this.props.colorList ? this.props.colorList[0] : '#ffffff')

        return div({
            className: 'grid graphic-grid ' + className,
            style: {
                width: canvasWidth + '%',
                paddingTop: canvasHeight + '%',
                backgroundColor: backgroundColor
            },
            ref: node => { this.node = node },
            tabIndex: 0
        }, [
            canvas({
                width,
                height,
                ref: node => { this.canvas = node },
                style: {
                }
            }),
            gridLines,
            gridHighlight,
            hoverHighlight
        ])
    }
}

if (typeof module !== 'undefined') module.exports = GraphicCanvas;