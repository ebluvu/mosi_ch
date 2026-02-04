let Sprite = {

    create: ({ name, isAvatar, isWall, isItem, isTransparent, spriteWidth, spriteHeight, onPush, onMessage, randomStart }) => {
        let newSprite = {
            name: name || '',
            isAvatar: isAvatar || false,
            isWall: isWall || false,
            isItem: isItem || false,
            isTransparent: isTransparent || false,
            colorIndex: 1,
            width: spriteWidth,
            height: spriteHeight,
            frameList: [Array(spriteWidth * spriteHeight).fill(0)],
            scriptList: {
                'on-push': onPush || '',
                'on-message': onMessage || ''
            }
        }
        if (randomStart) {
            newSprite.frameList = [
                Sprite.randomFrame(spriteWidth, spriteHeight)
            ]
        }
        return newSprite
    },

    select: (that, spriteIndex, nextTab) => {
        let currentSpriteIndex = spriteIndex

        let scriptTabType = 'sprite'
        if (nextTab) that.setCurrentTab(nextTab)

        let spritePalette = that.state.spritePalette.filter(i => that.state.spriteList[i])
        if (!spritePalette.includes(spriteIndex)) spritePalette.push(spriteIndex)
        let maxSpritesInPalette = Math.floor((SCREEN_WIDTH / 40) - 2)
        if (spritePalette.length > maxSpritesInPalette) {
            spritePalette = spritePalette.slice(spritePalette.length - maxSpritesInPalette)
        }

        that.setState({ currentSpriteIndex, scriptTabType, spritePalette })
    },

    add: (that, sprite) => {
        let { spriteWidth, spriteHeight } = that.state
        let spriteList = that.state.spriteList.slice()
        sprite = !(sprite instanceof MouseEvent) ? deepClone(sprite) :
            Sprite.create({
                name: 'sprite-1',
                spriteWidth,
                spriteHeight
            })
        sprite.isAvatar = false

        // get a unique name
        let baseName = sprite.name
        let number = parseInt(baseName.split('-').slice(-1)[0])
        if (isInt(number)) {
            let numberLength = (number).toString().length + 1
            baseName = baseName.slice(0, -numberLength)
        } else {
            number = 2
        }
        while (spriteList.find(s => s.name === sprite.name)) {
            sprite.name = baseName + '-' + number
            number++
        }

        spriteList.push(sprite)
        let currentSpriteIndex = spriteList.length - 1
        that.setCurrentTab('sprite')

        let spritePalette = that.state.spritePalette.filter(i => that.state.spriteList[i])
        if (!spritePalette.includes(currentSpriteIndex)) spritePalette.push(currentSpriteIndex)
        let maxSpritesInPalette = Math.floor((SCREEN_WIDTH / 40) - 2)
        if (spritePalette.length > maxSpritesInPalette) {
            spritePalette = spritePalette.slice(spritePalette.length - maxSpritesInPalette)
        }

        that.setState({ spriteList, currentSpriteIndex, spritePalette })
    },

    import: (that, spriteData) => {
        try {
            let sprite = JSON.parse(spriteData)

            // check sprite size
            if (sprite.width !== that.state.spriteWidth || sprite.height !== that.state.spriteHeight) {
                throw('這個精靈的大小不適合你的世界！')
            }

            // colorIndex 兼容：若有 colorIndex，將 frameList 中所有 1 轉為 colorIndex
            if (typeof sprite.colorIndex === 'number' && sprite.frameList && Array.isArray(sprite.frameList)) {
                sprite.frameList = sprite.frameList.map(frame =>
                    frame.map(v => v === 1 ? sprite.colorIndex : v)
                )
                delete sprite.colorIndex
            }
            // 舊格式 0/1 也自動轉 1->1
            else if (sprite.frameList && Array.isArray(sprite.frameList)) {
                sprite.frameList = sprite.frameList.map(frame => {
                    // 如果 frame 裡只有 0/1
                    if (frame.every(v => v === 0 || v === 1)) {
                        // 保持 0，1 代表預設色 index 1
                        return frame.map(v => v ? 1 : 0)
                    } else {
                        // 已經是 palette index，直接用
                        return frame
                    }
                })
            }

            Sprite.add(that, sprite)
        }
        catch (e) {
            console.error('無法導入精靈！', e)
            that.setState({ showErrorOverlay: true, errorMessage: '無法導入精靈！' })
        }
    },

    export: (that, spriteIndex) => {
        let sprite = deepClone(that.state.spriteList[spriteIndex])
        // 單色自動補 colorIndex 相容
        if (sprite.frameList && Array.isArray(sprite.frameList)) {
            let allIndices = new Set();
            sprite.frameList.forEach(frame => {
                frame.forEach(v => allIndices.add(v));
            });
            allIndices.delete(0);
            if (allIndices.size === 1) {
                // 單色
                let colorIndex = [...allIndices][0];
                sprite.colorIndex = colorIndex;
                sprite.frameList = sprite.frameList.map(frame =>
                    frame.map(v => v === colorIndex ? 1 : 0)
                );
            } else {
                // 多色
                delete sprite.colorIndex;
            }
        }
        let spriteData = JSON.stringify(sprite)
        return spriteData
    },

    setIsWall: (that, spriteIndex, newValue) => {
        let spriteList = that.state.spriteList.slice()
        spriteList[spriteIndex].isWall = newValue
        that.setState({ spriteList })
    },

    setIsItem: (that, spriteIndex, newValue) => {
        let spriteList = that.state.spriteList.slice()
        spriteList[spriteIndex].isItem = newValue
        that.setState({ spriteList })
    },

    setIsTransparent: (that, spriteIndex, newValue) => {
        let spriteList = that.state.spriteList.slice()
        spriteList[spriteIndex].isTransparent = newValue
        that.setState({ spriteList })
    },

    setColorIndex: (that, spriteIndex, newValue) => {
        let spriteList = that.state.spriteList.slice()
        spriteList[spriteIndex].colorIndex = newValue
        that.setState({ spriteList })
    },

    rename: (that, spriteIndex, newName) => {
        let spriteList = that.state.spriteList.slice()
        let roomList = that.state.roomList.slice()
        let sprite = spriteList[spriteIndex]
        let oldName = sprite.name
        
        if (newName === '') {
            that.setState({
                showErrorOverlay: true,
                errorMessage: `精靈名稱不能為空!`
            })
        } else if (spriteList.find(s => s.name === newName)) {
            that.setState({
                showErrorOverlay: true,
                errorMessage: `其他精靈已經命名為 "${newName}"!`
            })
        } else {

            // rename room references
            roomList.forEach(room => {
                room.tileList.forEach(tile => {
                    if (tile.spriteName === oldName) {
                        tile.spriteName = newName
                    }
                })
            })

            sprite.name = newName
            that.setState({ spriteList, roomList })
        }
    },

    remove: (that, spriteIndex) => {
        let { currentSpriteIndex, oneTabMode } = that.state
        let roomList = that.state.roomList.slice()
        let spriteList = that.state.spriteList.slice()
        let sprite = spriteList[spriteIndex]

        // remove sprite from rooms
        roomList.forEach(room =>
            room.tileList = room.tileList.filter(tile =>
                tile.spriteName !== sprite.name
            )
        )

        // update current sprite index
        if (currentSpriteIndex >= spriteIndex && currentSpriteIndex > 0) {
            currentSpriteIndex--
        }

        // remove sprite from list
        spriteList.splice(spriteIndex, 1)

        if (oneTabMode) that.closeTab('sprite')

        that.setState({ spriteList, roomList, currentSpriteIndex })
    },

    convertToAvatar: (that, spriteIndex) => {
        let roomList = that.state.roomList.slice()
        let spriteList = that.state.spriteList.slice()
        let sprite = spriteList[spriteIndex]
        let oldAvatar = spriteList.find(sprite => sprite.isAvatar)

        let spriteCount = 0
        roomList.forEach((room, i) => {
            room.tileList.forEach(tile => {
                if (tile.spriteName === sprite.name) {
                    spriteCount++
                }
            })
        })

        if (spriteCount > 1) {
            that.setState({ showErrorOverlay: true, errorMessage: '無法轉換為主角-這個世界裡只能有一個主角' })
        } else {
            oldAvatar.isAvatar = false
            sprite.isAvatar = true
            that.setState({ spriteList })
        }
    },

    addFrame: (that, spriteIndex, newFrame) => {
        let spriteList = that.state.spriteList.slice()
        let sprite = spriteList[spriteIndex]
        sprite.frameList = sprite.frameList.slice()
        sprite.frameList.push(newFrame)
        that.setState({ spriteList })
    },

    removeFrame: (that, spriteIndex, frameIndex) => {
        let spriteList = that.state.spriteList.slice()
        let sprite = spriteList[spriteIndex]
        sprite.frameList = sprite.frameList.slice()
        sprite.frameList.splice(frameIndex, 1)
        that.setState({ spriteList })
    },

    updateFrame: (that, spriteIndex, frameIndex, newFrame) => {
        let spriteList = that.state.spriteList.slice()
        let sprite = spriteList[spriteIndex]
        sprite.frameList = sprite.frameList.slice()
        sprite.frameList[frameIndex] = newFrame
        that.setState({ spriteList })
    },

    clearFrame: (width, height) => {
        return Array(width * height).fill(0)
    },

    flipFrame: (width, height, frame, horizontal) => {
        let rows = []
        for (let i = 0; i < height; i++) {
            rows.push(
                frame.slice(i * width, i * width + width)
            )
        }

        if (horizontal) rows.forEach(row => row.reverse())
        else rows.reverse()

        let newFrame = rows.reduce((prev, curr) => prev.concat(curr), [])
        return newFrame
    },

    rotateFrame: (width, height, frame) => {
        if (width !== height) return frame

        let newFrame = Array(width * height).fill(0)
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                newFrame[y * width + x] = frame[(width - x - 1) * height + y]
            }
        }
        return newFrame
    },

    randomFrame: (width, height) => {
        let newFrame = Array(width * height).fill(0)
        let randomPixels = Array(width * height).fill(0)
            .map(() => Math.floor(Math.random() * 2))

        let styles = ['left-right', 'top-bottom', 'corners']
        let style = styles[Math.floor(Math.random() * styles.length)]

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                let xA = x
                let yA = y
                if (style === 'left-right' || style === 'corners') {
                    if (x >= width / 2) xA = (width - x - 1)
                }
                if (style === 'top-bottom' || style === 'corners') {
                    if (y >= height / 2) yA = (height - y - 1)
                }
                newFrame[y * width + x] = randomPixels[yA * width + xA]
            }
        }
    
        return newFrame
    },

    createGif: (that, spriteIndex, scale, colorList, onComplete) => {
        let { spriteList, spriteWidth, spriteHeight } = that.state
        let sprite = deepClone(spriteList[spriteIndex]) // 深拷貝，避免污染原資料

        // --- 單色判斷與 frameList 轉換（與匯出一致）---
        if (sprite.frameList && Array.isArray(sprite.frameList)) {
            let allIndices = new Set();
            sprite.frameList.forEach(frame => {
                frame.forEach(v => allIndices.add(v));
            });
            allIndices.delete(0);
            if (allIndices.size === 1) {
                // 單色
                let colorIndex = [...allIndices][0];
                sprite.colorIndex = colorIndex;
                sprite.frameList = sprite.frameList.map(frame =>
                    frame.map(v => v === colorIndex ? 1 : 0)
                );
            } else {
                // 多色
                delete sprite.colorIndex;
            }
        }

        let width = sprite.width * scale
        let height = sprite.height * scale

        let frameCount = 12
        let frames = Array(frameCount).fill(0).map(() =>
            Array(width * height).fill(0)
        )

        frames.forEach((frame, i) => {
            let frameIndex = i % sprite.frameList.length
            let spriteFrame = sprite.frameList[frameIndex]

            // 判斷是否多色
            let isMulticolor = spriteFrame.some(p => p > 1)
            let colorIndex = sprite.colorIndex
            while (colorIndex > 0 && !colorList[colorIndex]) colorIndex--

            spriteFrame.forEach((pixel, j) => {
                if (!pixel) return
                let pxOffset = Math.floor(j % sprite.width) * scale
                let pyOffset = Math.floor(j / sprite.width) * scale
                for (let x = 0; x < scale; x++) {
                    for (let y = 0; y < scale; y++) {
                        let pixelIndex = x + pxOffset + ((y + pyOffset) * width)
                        if (isMulticolor) {
                            frame[pixelIndex] = pixel // 多色：直接 palette index
                        } else {
                            frame[pixelIndex] = colorIndex // 單色：主色
                        }
                    }
                }
            })
        })

        GIF.encode(width, height, frames, FRAME_RATE, colorList, onComplete, !!sprite.isTransparent)
    },

    updateScript: (that, spriteIndex, event, script) => {
        let spriteList = that.state.spriteList.slice()
        let scriptList = spriteList[spriteIndex].scriptList
        scriptList[event] = script
        that.setState({ spriteList })
    },

    resize: (sprite, newWidth, newHeight) => {
        let oldWidth = sprite.width
        let oldHeight = sprite.height

        sprite.frameList = sprite.frameList.map(frame => {
            let newFrame = Array(newWidth * newHeight).fill(0)
            for (let x = 0; x < oldWidth; x++) {
                for (let y = 0; y < oldHeight; y++) {
                    let oldIndex = y * oldWidth + x
                    let oldPixelData = frame[oldIndex]
                    let newIndex = y * newWidth + x
                    newFrame[newIndex] = oldPixelData
                }
            }
            return newFrame
        })

        sprite.width = newWidth
        sprite.height = newHeight
    }

}
