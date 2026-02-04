class SpriteGrid extends Component {
    constructor() {
        super()

        this.state = {
            usingKeyboard: false,
            lastTileX: 0,
            lastTileY: 0,
            hoverX: -1,
            hoverY: -1
        }

        this.pointerStart = (e) => {
            e.preventDefault()
            this.pointerIsDown = true
            let pointer = e.touches ? e.touches[0] : e
            let rect = this.node.getBoundingClientRect()
            let pixelSize = rect.width / this.props.width
            let relX = pointer.clientX - rect.x
            let relY = pointer.clientY - rect.y
            let x = Math.floor(relX / pixelSize)
            let y = Math.floor(relY / pixelSize)
            this.lastDrawX = x
            this.lastDrawY = y
            this.drawPixelEvent(e, true)
        }

        this.pointerMove = (e) => {
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

        this.keyDown = (e) => {
            if (!e.key.includes('Arrow') && e.key !== ' ') return
            e.preventDefault()

            let { width, height, frame, drawPixel } = this.props
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

        this.keyUp = (e) => {
            if (e.key === ' ') this.spaceIsDown = false
        }

        this.drawPixelEvent = (e, setPixelValue) => {
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
            let frame = this.props.frame
            let currentColorIndex = this.props.currentColorIndex || 1
            let prevValue = frame[pixelIndex]
            let newValue
            if (prevValue === currentColorIndex) {
                newValue = 0
            } else {
                newValue = currentColorIndex
            }
            this.props.drawPixel(pixelIndex, newValue)

            this.setState({ lastTileX: x, lastTileY: y })
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

        this.update = () => {
            let context = this.canvas.getContext('2d')
            let { width, height, frame, prevFrame, colorList, isTransparent } = this.props

            context.clearRect(0, 0, width, height)
            if (!isTransparent) {
                context.fillStyle = colorList[0] || '#ffffff'
            context.fillRect(0, 0, width, height)
            }

            if (prevFrame) {
                context.globalAlpha = 0.1
                this.drawFrame(prevFrame, width, colorList, isTransparent, context)
                context.globalAlpha = 1
            }

            this.drawFrame(frame, width, colorList, isTransparent, context)
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
    }

    shouldComponentUpdate(nextProps, nextState) {
        return checkForUpdates(nextProps, this.props) || checkForUpdates(nextState, this.state)
    }

    componentDidUpdate() {
        this.update()
    }

    render({ className, width, height }, { usingKeyboard, lastTileX, lastTileY, hoverX, hoverY }) {
        let canvasWidth = 100
        let canvasHeight = 100 * (width / height)

        let tileWidth = canvasWidth / width
        let tileHeight = canvasHeight / height

        let tileX = lastTileX * tileWidth
        let tileY = lastTileY * tileHeight

        let gridLinesRows = []
        for (let y = 0; y < height; y++) {
            let gridLinesCells = []
            for (let x = 0; x < width; x++) {
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
        let gridLines = this.props.showGrid ? div({ className: 'gridlines' }, h('table', {}, gridLinesRows)) : null;

        let gridHighlight = !usingKeyboard ? null :
            div({
                className: 'grid-highlight',
                style: {
                    left: tileX + '%',
                    top: tileY + '%',
                    width: tileWidth + '%',
                    height: tileHeight + '%'
                }
            })

        let hoverHighlight = hoverX !== -1 && hoverY !== -1 ?
            div({
                className: 'hover-highlight',
                style: {
                    left: hoverX * tileWidth + '%',
                    top: hoverY * tileHeight + '%',
                    width: tileWidth + '%',
                    height: tileHeight + '%'
                }
            }) : null

        return div({
            className: 'grid sprite-grid ' + className,
            style: {
                width: canvasWidth + '%',
                paddingTop: canvasHeight + '%'
            },
            ref: node => { this.node = node },
            tabindex: 0
        }, [
            canvas({
                width,
                height,
                ref: node => { this.canvas = node }
            }),
            gridLines,
            gridHighlight,
            hoverHighlight
        ])
    }
}