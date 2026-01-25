class SpriteCanvas extends Component {
    constructor() {
        super()

        this.frameIndex = 0
        this.frameDataList = []

        this.drawFrame = (frame, width, colorList, isTransparent, context) => {
            colorList = Array.isArray(colorList) ? colorList : ['#000000']
            frame.forEach((paletteIndex, i) => {
                let x = Math.floor(i % width)
                let y = Math.floor(i / width)
                if (paletteIndex === 0 && isTransparent) return
                // 修正：所有超出範圍的顏色都使用最後一個顏色，而不是純黑色
                let safeIndex = Math.min(paletteIndex, colorList.length - 1)
                context.fillStyle = colorList[safeIndex] || '#000000'
                context.fillRect(x, y, 1, 1)
            })
        }

        this.cacheFrames = () => {
            let { width, height, frameList, colorList, isTransparent } = this.props
            colorList = Array.isArray(colorList) ? colorList : ['#000000']
            this.frameDataList = frameList.map(frame => {
                let frameCanvas = document.createElement('canvas')
                frameCanvas.width = width
                frameCanvas.height = height
                let context = frameCanvas.getContext('2d')
                this.drawFrame(frame, width, colorList, isTransparent, context)
                let frameData = context.getImageData(0, 0, width, height)
                return frameData
            })
        }

        this.update = (timestamp) => {
            let { frameIndex, isAnimated } = this.props

            if (!this.lastFrameTimestamp) this.lastFrameTimestamp = timestamp
            let dt = timestamp - this.lastFrameTimestamp
            if (dt >= FRAME_RATE) {
                this.frameIndex++
                this.lastFrameTimestamp = timestamp
            }

            if (!isAnimated) this.frameIndex = frameIndex || 0
            if (this.frameIndex >= this.frameDataList.length) {
                this.frameIndex = 0
            }
            
            let context = this.canvas.getContext('2d')
            let frameData = this.frameDataList[this.frameIndex]
            context.putImageData(frameData, 0, 0)

            if (isAnimated) {
                this.animationRequest = window.requestAnimationFrame(this.update)
            }
        }
    }

    componentDidMount() {
        this.cacheFrames()
        this.update()
    }

    componentWillUnmount() {
        window.cancelAnimationFrame(this.animationRequest)
    }

    shouldComponentUpdate(nextProps) {
        return checkForUpdates(nextProps, this.props)
    }

    componentDidUpdate() {
        this.cacheFrames()
        if (!this.props.isAnimated) this.update()
    }

    render({ width, height, backgroundColor }) {
        return canvas({
            style: {
                borderColor: backgroundColor,
                backgroundColor
            },
            width,
            height,
            ref: node => { this.canvas = node }
        })
    }
}