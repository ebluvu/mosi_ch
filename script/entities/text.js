let textScript = `
return {

    drawNode: ({ nodes, nodeIndex = 0, canvas, context, fontData, fontDirection, timestamp, bgX = 0, bgY = 0, charsSoFar = 0, maxChars, spacingSoFar = 0, currentLine = 0, linesPerPage = 2, defaultTextColor = 'white', bgWidth }) => {
        if (nodeIndex >= nodes.length) {
            return nodeIndex
        }

        let node = nodes[nodeIndex]

        if (node.type === 'text') {
            let nodeIsComplete = true

            // 設定位置
            window.textPosition = node.position

            // 找出起始位置
            let textScale = window.textScale || 2
            let leftPadding = fontData.width * textScale
            let rightPadding = fontData.width * textScale
            let x = bgX + leftPadding
            // 行距：x1=1.5, x2=2，使用 Math.floor 避免模糊化
            let lineSpacing = textScale === 1 ? 1.5 : 2
            let y = Math.floor(currentLine * fontData.height * lineSpacing) + bgY + (fontData.height * textScale) // 文字比例：x1=1, x2=2

            // 尋找頁面寬度和單一空格
            let pageWidth = (bgWidth !== undefined ? bgWidth : (canvas.width - (fontData.width * 6))) - leftPadding - rightPadding
            let spaceWidth = fontData.width

            // 確定節點中的第一個單字前面是否應該有一個空格
            let startWithSpace = node.text.startsWith(' ')
            let previousTextNodes = nodes.slice(0, nodeIndex).filter(n => n.type === 'text')
            if (previousTextNodes.length > 0) {
                let previousTextNode = previousTextNodes[previousTextNodes.length - 1]
                let previousText = previousTextNode.text
                if (previousText.endsWith(' ')) startWithSpace = true
            }

            // 將文字分成單字
            let words = node.text.split(/\\s+/)

            // 在螢幕上繪製每個單字
            for (let i = 0; i < words.length; i++) {
                let word = words[i]

                // 忽略空話
                if (!word) continue

                // 如果不是行或節點中的第一個單詞，則新增前導空格
                if ((i > 0 || startWithSpace) && spacingSoFar > 0) word = ' ' + word

                // 尋找剩餘的字元數
                let charsLeft = maxChars - charsSoFar
                if (maxChars >= 0 && charsLeft <= 0) {
                    return -1
                }

                // 尋找剩餘空間（像素）
                let spaceLeftOnLine = pageWidth - spacingSoFar

                // 如果需要，截斷單字
                let wordWidth = Text.textWidth(fontData, word)
                let displayWord = maxChars >= 0 ? word.substring(0, charsLeft) : word
                if (displayWord.length < word.length) {
                    nodeIsComplete = false
                }

                if (wordWidth <= spaceLeftOnLine || spacingSoFar === 0) {

                    // 畫字
                    let seqWidth = Text.drawSeq(
                        context,
                        fontData,
                        fontDirection,
                        displayWord,
                        node.color || defaultTextColor,
                        node.style,
                        x + spacingSoFar,
                        y,
                        timestamp
                    )
                    spacingSoFar += seqWidth
                    charsSoFar += displayWord.length

                } else {

                    // 將剩餘文字放入新節點
                    let remainingText = words.slice(i).join(' ')
                    if (remainingText.trim().length === 0) break
                    nodes.splice(nodeIndex + 1, 0, {
                        type: 'text',
                        text: remainingText,
                        color: node.color || defaultTextColor,
                        position: node.position,
                        style: node.style
                    })

                    // 開始新行
                    nodes.splice(nodeIndex + 1, 0, { type: 'line-break' })

                    // 縮短此節點
                    node.text = words.slice(0, i).join(' ')

                    break

                }
            }

            if (!nodeIsComplete) {
                return -1
            }
        }

        if (node.type === 'line-break') {
            currentLine += 1
            spacingSoFar = 0
            if (currentLine >= linesPerPage) {
                node.type = 'page-break'
            }
        }

        if (node.type === 'page-break') {
            currentLine = 0
            spacingSoFar = 0
            charsSoFar = 0
            return nodeIndex + 1
        }
        
        if (node.type === 'action') {
            // 初始化本地節點列表
            let localNodes = []
            let addNode = (node) => {
                localNodes.push(node)
            }

            // 運行操作
            node.actionFunc(addNode)

            // 將操作產生的任何節點插入節點清單中
            localNodes.forEach((node, i) => {
                nodes.splice(nodeIndex + 1 + i, 0, node)
            })

            // 將操作標記為已完成，這樣它就不會再次運行
            node.type = 'completed-action'
        }

        // 繪製下一個節點
        return Text.drawNode({
            nodeIndex: nodeIndex + 1,
            nodes,
            canvas, context,
            fontData, fontDirection,
            timestamp,
            bgX, bgY,
            charsSoFar, maxChars,
            spacingSoFar, currentLine, linesPerPage,
            defaultTextColor
        })
    },

    drawBackground: (context, fontData, position, linesPerPage = 2, bgColor = 'black') => {
        let bgWidth = context.canvas.width - (fontData.width * 2)
        let textScale = window.textScale || 2
        // 對話背景高度：x1 = linesPerPage * 2 + 0.5, x2 = linesPerPage * 2 + 3
        let bgHeightMultiplier = textScale === 1 ? (linesPerPage * 2 + 0.5) : (linesPerPage * 2 + 3)
        let bgHeight = Math.floor(fontData.height * bgHeightMultiplier)
        let bgX = fontData.width
        let bgY
        if (position === 'top') {
            bgY = fontData.width
        } else if (position === 'bottom') {
            bgY = context.canvas.height - bgHeight - fontData.width
        } else {
            bgY = Math.floor(context.canvas.height / 2 - bgHeight / 2)
        }

        if (position === 'none') {
            // 不要畫背景
        } else if (position === 'fullscreen') {
            context.fillStyle = bgColor
            context.fillRect(0, 0, context.canvas.width, context.canvas.height)
        } else {
            context.fillStyle = bgColor
            context.fillRect(bgX, bgY, bgWidth, bgHeight)
        }

        return { bgX, bgY, bgWidth, bgHeight }
    },

    drawContinueIndicator: (context, fontData, bgX, bgY, bgWidth, bgHeight, indicatorColor = 'white') => {
        let textScale = window.textScale || 2
        // 對話箭頭大小：x1 = 0.5, x2 = 1
        let indicatorMultiplier = textScale === 1 ? 0.5 : 1
        let indicatorWidth = Math.floor(fontData.width * indicatorMultiplier)
        let indicatorHeight = Math.floor(fontData.width * indicatorMultiplier)
        
        // 對話箭頭位置：x1 更偏右下一點，x2 原始位置
        let positionOffset = textScale === 1 ? Math.floor(fontData.width * 0.5) : 0
        let indicatorX = bgX + bgWidth - fontData.width - indicatorWidth + positionOffset
        let indicatorY = bgY + bgHeight - fontData.height - indicatorHeight + positionOffset
        
        context.fillStyle = indicatorColor
        context.fillRect(indicatorX, indicatorY, indicatorWidth, indicatorHeight)
    },

    textWidth: (fontData, text) => {
        let { width, characterList } = fontData
        let textWidth = 0
        for (let i = 0; i < text.length; i++) {
            let charCode = text.charCodeAt(i)
            let charData = characterList[charCode]
            if (!charData) continue
            let charWidth = !isNaN(charData.width) ? charData.width : width
            textWidth += charWidth
        }
        return textWidth
    },

    drawSeq: (context, fontData, fontDirection, text, color, style, x, y, timestamp, i = 0) => {
        // RAINBOW: 預設彩虹色序列
        const rainbowColors = [
            '#FF5252', // 紅
            '#FFB142', // 橙
            '#FFE162', // 黃
            '#3ae374', // 綠
            '#17c0eb', // 藍
            '#7158e2', // 靛
            '#B33771'  // 紫
        ];
        let numChars = text.length
        let spacingSoFar = 0
        for (let j = 0; j < numChars; j++) {
            let charCode = text.charCodeAt(j)
            let xOffset = (fontDirection === 'rtl') ? x - spacingSoFar : x + spacingSoFar
            let useColor = color
            // 檢查是否包含 rainbow 特效
            if (style && style.includes('rainbow')) {
                // 動態彩虹色，隨時間與字元位置變化
                let rainbowIndex = Math.floor((j + Math.floor(timestamp / 120)) % rainbowColors.length)
                useColor = rainbowColors[rainbowIndex]
            }
            let newSpacing = Text.drawChar(context, fontData, charCode, xOffset, y, style, timestamp, i + j, useColor)
            spacingSoFar += newSpacing
        }
        return spacingSoFar
    },

    drawChar: (context, fontData, charCode, x, y, style, timestamp, i, overrideColor) => {
        let { width, height, characterList } = fontData
        let charData = characterList[charCode]
        if (!charData) return 0
        if (!isNaN(charData.width)) width = charData.width
        if (!isNaN(charData.height)) height = charData.height
        let offsetX = 0
        let offsetY = 0
        if (!isNaN(charData.offsetX)) offsetX = charData.offsetX
        if (!isNaN(charData.offsetY)) offsetY = charData.offsetY
        let spacing = width
        if (!isNaN(charData.spacing)) spacing = charData.spacing
        let styleX = 0
        let styleY = 0
        
        // 支援多種特效組合
        if (style) {
            let styles = style.split(' ')
            styles.forEach(s => {
                if (s === 'wavy') {
                    styleY = Math.floor(Math.sin(timestamp / (300) + (i / 2)) * (height / 3))
                }
                else if (s === 'shaky') {
                    styleX = Math.floor(Math.cos(timestamp / (20) + i) * (width / 10))
                    styleY = Math.floor(Math.sin(timestamp / (10) + i) * (height / 10))
                }
                else if (s === 'glitch') {
                    // 隨機偏移 + 偶爾亂碼
                    styleX += Math.floor((Math.random() - 0.5) * width / 10)
                    styleY += Math.floor((Math.random() - 0.5) * height / 10)
                    // 50% 機率亂碼
                    if (Math.random() < 0.5) {
                        // 隨機選擇不同類型的亂碼字符
                        let glitchType = Math.random()
                        if (glitchType < 0.3) {
                            // 30% 機率：日文片假名
                            charCode = 0x30A0 + Math.floor(Math.random() * 96)
                        } else if (glitchType < 0.6) {
                            // 30% 機率：特殊符號
                            charCode = 0x21 + Math.floor(Math.random() * 15) // !"#$%&'()*+,-./
                        } else if (glitchType < 0.8) {
                            // 20% 機率：數字
                            charCode = 0x30 + Math.floor(Math.random() * 10) // 0-9
                        } else {
                            // 20% 機率：其他符號
                            charCode = 0x3A + Math.floor(Math.random() * 7) // :;<=>?@
                        }
                        charData = characterList[charCode] || charData
                    }
                }
            })
        }
        
        // RAINBOW: 設定彩虹色
        if (style && style.includes('rainbow') && overrideColor) {
            context.fillStyle = overrideColor
        } else {
            context.fillStyle = overrideColor || context.fillStyle
        }
        
        for (let cx = 0; cx < width; cx++) {
            for (let cy = 0; cy < height; cy++) {
                let pixel = charData.data[cy * width + cx]
                if (pixel) {
                    context.fillRect(x + cx + offsetX + styleX, y + cy + offsetY + styleY, 1, 1)
                }
            }
        }
        return spacing
    }

}
`

let generateTextScript = new Function(textScript)
let Text = generateTextScript()