class GraphicGrid extends Component {
    constructor(props) {
        super(props)
        
        // 計算初始的 graphicIndex（考慮過濾後的列表）
        let initialIndex = 0;
        if (props.graphicList && props.graphicList.length > 0) {
            let filteredList = props.graphicList.filter(graphic => {
                if (graphic.type !== props.type) return false
                return true
            });
            
            if (props.currentGraphicIndex >= 0 && props.currentGraphicIndex < props.graphicList.length) {
                let selectedGraphic = props.graphicList[props.currentGraphicIndex];
                let filteredIdx = filteredList.findIndex(g => g === selectedGraphic);
                if (filteredIdx >= 0) {
                    initialIndex = filteredIdx;
                } else if (filteredList.length > 0) {
                    initialIndex = 0;
                }
            } else if (filteredList.length > 0) {
                initialIndex = 0;
            }
        }
        
        this.state = {
            graphicIndex: initialIndex,
            hoverIndex: -1
        }
        this.pointerIsDown = false
        this.pointerPos = { x: 0, y: 0 }
        
        // 動畫狀態管理（仿照 room-grid）
        this.frameIndex = 0
        this.lastFrameTimestamp = 0
        this.animationRequest = null
        
        // 記憶體優化：重用 offscreen canvas
        this.offscreenCanvas = null
        this.offscreenContext = null
        this.lastGraphicSize = { width: 0, height: 0 }
        
        // 新增：graphic 幀快取
        this.graphicFrameCache = {}
        this.lastGraphicList = null
    }

    // 新增：快取所有 graphic 的所有幀
    cacheGraphicFrames = () => {
        const { graphicList = [], colorList = [], paletteList = [] } = this.props
        // 檢查是否需要重新快取（graphicList 或 colorList 或 paletteList 改變時）
        if (this.lastGraphicList === graphicList && 
            this.lastColorList === colorList && 
            this.lastPaletteList === paletteList) return
        this.graphicFrameCache = {}
        graphicList.forEach(graphic => {
            if (!graphic.frameList || graphic.frameList.length === 0) return
            
            // 根據類型決定使用哪個調色盤
            let graphicColorList = colorList
            if (graphic.type === 'picture' && graphic.paletteName) {
                // picture 類型：如果有指定調色盤，使用自己的調色盤
                let palette = paletteList.find(p => p.name === graphic.paletteName)
                if (palette && palette.colorList) {
                    graphicColorList = palette.colorList
                }
            }
            // face 類型：始終使用當前房間的調色盤（colorList）
            
            this.graphicFrameCache[graphic.name] = graphic.frameList.map(frame => {
                let frameCanvas = document.createElement('canvas')
                frameCanvas.width = graphic.width
                frameCanvas.height = graphic.height
                let context = frameCanvas.getContext('2d')
                // 填充背景
                if (!graphic.isTransparent) {
                    context.fillStyle = graphicColorList[0] || '#fff'
                    context.fillRect(0, 0, graphic.width, graphic.height)
                }
                // 畫像素
                frame.forEach((paletteIndex, i) => {
                    let x = i % graphic.width
                    let y = Math.floor(i / graphic.width)
                    if (paletteIndex === 0 && graphic.isTransparent) return
                    context.fillStyle = graphicColorList[paletteIndex] || '#000'
                    context.fillRect(x, y, 1, 1)
                })
                return frameCanvas
            })
        })
        this.lastGraphicList = graphicList
        this.lastColorList = colorList
        this.lastPaletteList = paletteList
    }

    getFilteredList(props = this.props) {
        // 直接使用傳入的 graphicList，不做過濾
        return props.graphicList
    }

    pointerStart = (e) => {
        e.preventDefault()
        let pointer = e.touches ? e.touches[0] : e
        this.pointerIsDown = true
        this.pointerPos = {
            x: pointer.clientX,
            y: pointer.clientY
        }
    }

    pointerMove = (e) => {
        let filteredList = this.getFilteredList();
        let { gridWidth } = this.props;
        let total = filteredList.length;
        if (total === 0) return;
        let width = Math.min(gridWidth, total);
        let height = total > 0 ? Math.ceil(total / gridWidth) : 1;
        if (this.pointerIsDown) {
            e.preventDefault();
            let pointer = e.touches ? e.touches[0] : e;
            this.pointerPos = {
                x: pointer.clientX,
                y: pointer.clientY
            };
        }
        let rect = this.node.getBoundingClientRect();
        let tileWidth = rect.width / width;
        let tileHeight = rect.height / height;
        let relX = (e.touches ? e.touches[0].clientX : e.clientX) - rect.x;
        let relY = (e.touches ? e.touches[0].clientY : e.clientY) - rect.y;
        if (relX < 0 || relY < 0 || relX >= rect.width || relY >= rect.height) {
            this.setState({ hoverIndex: -1 });
            return;
        }
        let x = Math.floor(relX / tileWidth);
        let y = Math.floor(relY / tileHeight);
        let idx = y * width + x;
        if (idx >= 0 && idx < filteredList.length) {
            this.setState({ hoverIndex: idx });
        } else {
            this.setState({ hoverIndex: -1 });
        }
    }

    pointerEnd = (e) => {
        if (this.pointerIsDown) {
            e.preventDefault()
            this.pointerIsDown = false
            this.pointerSelect()
        }
    }

    pointerSelect = () => {
        let filteredList = this.getFilteredList();
        let { gridWidth, onSelect } = this.props;
        let total = filteredList.length;
        if (total === 0) return;
        let width = Math.min(gridWidth, total);
        let height = total > 0 ? Math.ceil(total / gridWidth) : 1;
        let rect = this.node.getBoundingClientRect();
        let tileWidth = rect.width / width;
        let tileHeight = rect.height / height;
        let relX = this.pointerPos.x - rect.x;
        let relY = this.pointerPos.y - rect.y;
        if (relX < 0 || relY < 0 || relX >= rect.width || relY >= rect.height) {
            return;
        }
        let x = Math.floor(relX / tileWidth);
        let y = Math.floor(relY / tileHeight);
        let idx = y * width + x;
        if (idx >= 0 && idx < filteredList.length) {
            onSelect && onSelect(idx);
            this.setState({ graphicIndex: idx });
        }
    }

    componentDidMount() {
        if (!this.node) {
            return;
        }
        
        this.node.addEventListener('mousedown', this.pointerStart)
        document.addEventListener('mousemove', this.pointerMove)
        document.addEventListener('mouseup', this.pointerEnd)
    
        this.node.addEventListener('touchstart', this.pointerStart, { passive: false })
        document.addEventListener('touchend', this.pointerEnd, { passive: false })
        document.addEventListener('touchcancel', this.pointerEnd, { passive: false })
        document.addEventListener('touchmove', this.pointerMove, { passive: false })
 
        // 確保在 DOM 準備好後自動 focus
        if (this.node.classList.contains('initial-focus')) {
            setTimeout(() => {
                if (this.node && document.activeElement !== this.node) {
                    this.node.focus()
                }
            }, 0)
        }
        
        // 啟動動畫
        this.cacheGraphicFrames()
        this.update()
    }

    componentWillUnmount() {
        if (!this.node) return;
        this.node.removeEventListener('mousedown', this.pointerStart)
        document.removeEventListener('mousemove', this.pointerMove)
        document.removeEventListener('mouseup', this.pointerEnd)
    
        this.node.removeEventListener('touchstart', this.pointerStart)
        document.removeEventListener('touchend', this.pointerEnd)
        document.removeEventListener('touchcancel', this.pointerEnd)
        document.removeEventListener('touchmove', this.pointerMove)
        

        
        // 停止動畫
        window.cancelAnimationFrame(this.animationRequest)
        
        // 清理記憶體
        this.offscreenCanvas = null
        this.offscreenContext = null
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.currentGraphicIndex !== this.props.currentGraphicIndex || 
            nextProps.graphicList !== this.props.graphicList ||
            nextProps.type !== this.props.type) {
            
            // 取得過濾後的列表
            let filteredList = nextProps.graphicList.filter(graphic => {
                if (graphic.type !== nextProps.type) return false
                return true
            });
            
            // 計算在過濾後列表中的索引
            let newIndex = 0;
            if (nextProps.currentGraphicIndex >= 0 && nextProps.currentGraphicIndex < nextProps.graphicList.length) {
                let selectedGraphic = nextProps.graphicList[nextProps.currentGraphicIndex];
                let filteredIdx = filteredList.findIndex(g => g === selectedGraphic);
                if (filteredIdx >= 0) {
                    newIndex = filteredIdx;
                } else if (filteredList.length > 0) {
                    // 如果當前選中的圖片不在過濾後的列表中，選擇第一個
                    newIndex = 0;
                }
            } else if (filteredList.length > 0) {
                newIndex = 0;
            }
            
            this.setState({ graphicIndex: newIndex })
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        // 記憶體優化：只在必要時重新渲染
        if (nextState.graphicIndex !== this.state.graphicIndex) return true
        if (nextState.hoverIndex !== this.state.hoverIndex) return true
        
        // 檢查關鍵 props 變化
        if (nextProps.graphicList !== this.props.graphicList) return true
        if (nextProps.currentGraphicIndex !== this.props.currentGraphicIndex) return true
        if (nextProps.colorList !== this.props.colorList) return true
        if (nextProps.paletteList !== this.props.paletteList) return true
        if (nextProps.type !== this.props.type) return true
        if (nextProps.gridWidth !== this.props.gridWidth) return true
        if (nextProps.isAnimated !== this.props.isAnimated) return true
        
        return false
    }

    componentDidUpdate() {
        this.cacheGraphicFrames()
        this.update()
    }

    update = (timestamp) => {
        this.cacheGraphicFrames()
        let filteredList = this.getFilteredList();
        let { gridWidth, isAnimated } = this.props;
        let canvas = this.canvas;
        if (!canvas) return;
        let total = filteredList.length;
        if (total === 0) return;
        let width = Math.min(gridWidth, total);
        let height = total > 0 ? Math.ceil(total / gridWidth) : 1;
        let context = canvas.getContext('2d');
        
        // 動畫幀控制
        if (!this.lastFrameTimestamp) this.lastFrameTimestamp = timestamp
        let dt = timestamp - this.lastFrameTimestamp
        if (dt >= 500) {
            if (isAnimated) this.frameIndex++
            if (this.frameIndex >= 12) this.frameIndex = 0
            this.lastFrameTimestamp = timestamp
        }
        
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // 背景始終保持透明，不繪製任何背景色
        
        // 繪製每個格子
        let cellSize = 64;
        for (let i = 0; i < filteredList.length; i++) {
            let x = i % width;
            let y = Math.floor(i / width);
            let graphic = filteredList[i];
            let cellWidth = graphic.width;
            let cellHeight = graphic.height;
            if (graphic.type === 'picture' || graphic.type === 'face') {
                let minSize = Math.max(cellSize, Math.max(graphic.width, graphic.height));
                let scale = minSize / Math.max(graphic.width, graphic.height);
                cellWidth = Math.round(graphic.width * scale);
                cellHeight = Math.round(graphic.height * scale);
            }
            // 計算格子位置
            let offsetX = 0;
            for (let j = 0; j < x; j++) {
                let prevGraphic = filteredList[y * width + j];
                if (prevGraphic) {
                    let prevCellWidth = prevGraphic.width;
                    if (prevGraphic.type === 'picture' || prevGraphic.type === 'face') {
                        let prevMinSize = Math.max(cellSize, Math.max(prevGraphic.width, prevGraphic.height));
                        let prevScale = prevMinSize / Math.max(prevGraphic.width, prevGraphic.height);
                        prevCellWidth = Math.round(prevGraphic.width * prevScale);
                    }
                    offsetX += prevCellWidth;
                }
            }
            let offsetY = 0;
            for (let j = 0; j < y; j++) {
                let prevGraphic = filteredList[j * width + x];
                if (prevGraphic) {
                    let prevCellHeight = prevGraphic.height;
                    if (prevGraphic.type === 'picture' || prevGraphic.type === 'face') {
                        let prevMinSize = Math.max(cellSize, Math.max(prevGraphic.width, prevGraphic.height));
                        let prevScale = prevMinSize / Math.max(prevGraphic.height, prevGraphic.width);
                        prevCellHeight = Math.round(prevGraphic.height * prevScale);
                    }
                    offsetY += prevCellHeight;
                }
            }
            // --- 使用快取 ---
            let frameList = this.graphicFrameCache[graphic.name]
            if (frameList && frameList.length > 0) {
                let frameIdx = (isAnimated && frameList.length > 1) ? (this.frameIndex % frameList.length) : 0
                let frameCanvas = frameList[frameIdx]
                context.imageSmoothingEnabled = false
                context.drawImage(frameCanvas, 0, 0, graphic.width, graphic.height, offsetX, offsetY, cellWidth, cellHeight)
            }
        }
        
        // 動畫時才持續 requestAnimationFrame
        if (isAnimated && filteredList.some(g => g.frameList && g.frameList.length > 1)) {
            this.animationRequest = window.requestAnimationFrame(this.update)
        }
    }

    drawGraphic = (graphic, colorList, context, xOffset, yOffset, cellW, cellH) => {
        let { width, height, frameList, type, paletteName, isTransparent } = graphic;
        
        // 動畫幀選擇（仿照 room-grid）
        let frame = frameList && frameList.length > 0 ? 
            frameList[this.frameIndex % frameList.length] : [];
        
        // 每個 graphic 使用自己的 palette
        let graphicColorList = colorList;
        if (type === 'picture' && paletteName) {
            let paletteList = this.props.paletteList || [];
            let palette = paletteList.find(p => p.name === paletteName);
            if (palette && palette.colorList) {
                graphicColorList = palette.colorList;
            }
        }
        // 計算像素大小（統一使用 1:1 像素比例）
        let pixelW = 1;
        let pixelH = 1;
        
        // 不再居中，face 也從左上角開始畫
        let offsetX = xOffset;
        let offsetY = yOffset;
        if (type === 'face') {
            // face: 每個像素都放大填滿格子
            let scaleX = cellW / width;
            let scaleY = cellH / height;
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    let idx = y * width + x;
                    let paletteIndex = frame[idx];
                    if (paletteIndex === 0 && isTransparent) continue;
                    context.fillStyle = graphicColorList[paletteIndex] || '#000';
                    context.fillRect(
                        xOffset + x * scaleX,
                        yOffset + y * scaleY,
                        scaleX,
                        scaleY
                    );
                }
            }
        } else {
            // picture: 維持 1:1 畫像素
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    let idx = y * width + x;
                    let paletteIndex = frame[idx];
                    context.fillStyle = graphicColorList[paletteIndex] || '#000';
                    context.fillRect(
                        xOffset + x,
                        yOffset + y,
                        1,
                        1
                    );
                }
            }
        }
    }

    render({
        className = '',
        graphicList = [],
        currentGraphicIndex = 0,
        onSelect = () => {},
        type = 'picture',
        colorList = [],
        gridWidth = 4,
        gridHeight = 2,
        paletteList = []
    }, { graphicIndex, hoverIndex }) {
        let filteredList = this.getFilteredList();
        let total = filteredList.length;
        let width = Math.min(gridWidth, total > 0 ? total : 1);
        let height = total > 0 ? Math.ceil(total / gridWidth) : 1;
        let tileWidth = 100 / width;
        let tileHeight = 100 / height;
        // 計算選中格子在 filteredList 中的索引
        let selectedIdx = -1;
        if (graphicIndex >= 0 && graphicIndex < filteredList.length) {
            selectedIdx = graphicIndex;
        } else if (filteredList.length > 0) {
            selectedIdx = 0;
        }
        let highlightX = selectedIdx % width;
        let highlightY = Math.floor(selectedIdx / width);
        let hoverX = hoverIndex !== -1 ? hoverIndex % width : -1;
        let hoverY = hoverIndex !== -1 ? Math.floor(hoverIndex / width) : -1;



        // 產生格線，只產生有圖片的格子
        let gridLinesRows = [];
        for (let y = 0; y < height; y++) {
            let gridLinesCells = [];
            for (let x = 0; x < width; x++) {
                let idx = y * width + x;
                if (idx < total) {
                    gridLinesCells.push(
                        h('td', { className: 'gridlines-cell' })
                    );
                }
            }
            gridLinesRows.push(
                h('tr', { className: 'gridlines-row' }, gridLinesCells)
            );
        }
        let gridLines = div({ className: 'gridlines' }, h('table', {}, gridLinesRows));

        // 背景始終保持透明
        let backgroundColor = 'transparent';

        // 沒有圖片時顯示隱藏的空容器，保持 DOM 節點存在
        if (total === 0) {
            return div({
                className: 'grid graphic-grid ' + className,
                style: {
                    width: '100%',
                    height: '0px',
                    overflow: 'hidden',
                    visibility: 'hidden',
                    position: 'absolute',
                    top: '-9999px',
                    left: '-9999px'
                },
                ref: node => { this.node = node },
                tabindex: 0
            });
        }

        // 計算 canvas 的實際尺寸（容納所有長方形格子）
        let cellSize = 64; // 基礎格子大小
        let canvasWidth = 0;
        let canvasHeight = 0;
        
        // 計算每行的最大寬度和每列的最大高度
        for (let y = 0; y < height; y++) {
            let rowHeight = 0;
            for (let x = 0; x < width; x++) {
                let idx = y * width + x;
                if (idx < filteredList.length) {
                    let graphic = filteredList[idx];
                    let cellWidth = graphic.width;
                    let cellHeight = graphic.height;
                    if (graphic.type === 'picture' || graphic.type === 'face') {
                        let minSize = Math.max(cellSize, Math.max(graphic.width, graphic.height));
                        let scale = minSize / Math.max(graphic.width, graphic.height);
                        cellWidth = Math.round(graphic.width * scale);
                        cellHeight = Math.round(graphic.height * scale);
                    }
                    rowHeight = Math.max(rowHeight, cellHeight);
                }
            }
            canvasHeight += rowHeight;
        }
        
        // 計算每列的最大寬度
        for (let x = 0; x < width; x++) {
            let colWidth = 0;
            for (let y = 0; y < height; y++) {
                let idx = y * width + x;
                if (idx < filteredList.length) {
                    let graphic = filteredList[idx];
                    let cellWidth = graphic.width;
                    if (graphic.type === 'picture' || graphic.type === 'face') {
                        let minSize = Math.max(cellSize, Math.max(graphic.width, graphic.height));
                        let scale = minSize / Math.max(graphic.width, graphic.height);
                        cellWidth = Math.round(graphic.width * scale);
                    }
                    colWidth = Math.max(colWidth, cellWidth);
                }
            }
            canvasWidth += colWidth;
        }
        
        // 計算容器的實際比例（基於 canvas 尺寸）
        let widthRatio = canvasWidth > canvasHeight ? 1 : canvasWidth / canvasHeight;
        let heightRatio = canvasWidth > canvasHeight ? canvasHeight / canvasWidth : 1;
        
        // 計算選中格子的實際位置和大小
        let gridHighlight = null;
        if (selectedIdx !== -1) {
            let selectedGraphic = filteredList[selectedIdx];
            if (selectedGraphic) {
                let cellSize = 64;
                let cellWidth = selectedGraphic.width;
                let cellHeight = selectedGraphic.height;
                if (selectedGraphic.type === 'picture' || selectedGraphic.type === 'face') {
                    let minSize = Math.max(cellSize, Math.max(selectedGraphic.width, selectedGraphic.height));
                    let scale = minSize / Math.max(selectedGraphic.width, selectedGraphic.height);
                    cellWidth = Math.round(selectedGraphic.width * scale);
                    cellHeight = Math.round(selectedGraphic.height * scale);
                }
                
                // 計算選中格子在 canvas 中的實際位置
                let offsetX = 0;
                for (let j = 0; j < highlightX; j++) {
                    let prevGraphic = filteredList[highlightY * width + j];
                    if (prevGraphic) {
                        let prevCellWidth = prevGraphic.width;
                        if (prevGraphic.type === 'picture' || prevGraphic.type === 'face') {
                            let prevMinSize = Math.max(cellSize, Math.max(prevGraphic.width, prevGraphic.height));
                            let prevScale = prevMinSize / Math.max(prevGraphic.width, prevGraphic.height);
                            prevCellWidth = Math.round(prevGraphic.width * prevScale);
                        }
                        offsetX += prevCellWidth;
                    }
                }
                
                let offsetY = 0;
                for (let j = 0; j < highlightY; j++) {
                    let prevGraphic = filteredList[j * width + highlightX];
                    if (prevGraphic) {
                        let prevCellHeight = prevGraphic.height;
                        if (prevGraphic.type === 'picture' || prevGraphic.type === 'face') {
                            let prevMinSize = Math.max(cellSize, Math.max(prevGraphic.width, prevGraphic.height));
                            let prevScale = prevMinSize / Math.max(prevGraphic.width, prevGraphic.height);
                            prevCellHeight = Math.round(prevGraphic.height * prevScale);
                        }
                        offsetY += prevCellHeight;
                    }
                }
                
                // 轉換為百分比位置
                let leftPercent = (offsetX / canvasWidth) * 100;
                let topPercent = (offsetY / canvasHeight) * 100;
                let widthPercent = (cellWidth / canvasWidth) * 100;
                let heightPercent = (cellHeight / canvasHeight) * 100;
                
                gridHighlight = div({
                    className: 'grid-highlight',
                    style: {
                        left: leftPercent + '%',
                        top: topPercent + '%',
                        width: widthPercent + '%',
                        height: heightPercent + '%'
                    }
                });
            }
        }
        
        return div({
            className: 'grid graphic-grid ' + className,
            style: {
                width: widthRatio * 100 + '%',
                paddingTop: heightRatio * 100 + '%',
                background: backgroundColor
            },
            ref: node => { this.node = node },
            tabindex: 0
        }, [
            canvas({
                width: canvasWidth,
                height: canvasHeight,
                ref: node => { this.canvas = node }
            }),
            gridLines,
            gridHighlight
        ]);
    }
}

if (typeof module !== 'undefined') module.exports = GraphicGrid;
window.GraphicGrid = GraphicGrid;