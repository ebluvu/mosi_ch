let gameScript = `
return class {

    constructor(world, el) {
        this.world = world

        this.wrapper = document.createElement('div')
        this.wrapper.style.position = 'relative'
        this.wrapper.style.paddingTop = '100%'
        this.wrapper.style.margin = '0 auto'
        el.appendChild(this.wrapper)

        this.canvas = document.createElement('canvas')
        this.canvas.tabIndex = "1"
        this.canvas.width = world.roomWidth * world.spriteWidth
        this.canvas.height = world.roomHeight * world.spriteHeight
        this.canvas.style.position = 'absolute'
        this.canvas.style.display = 'block'
        this.canvas.style.top = '0'
        this.canvas.style.left = '0'
        this.canvas.style.width = '100%'
        this.wrapper.appendChild(this.canvas)
        this.context = this.canvas.getContext('2d')

        this.textCanvas = document.createElement('canvas')
        this.textCanvas.width = world.roomWidth * world.spriteWidth * world.fontResolution
        this.textCanvas.height = world.roomHeight * world.spriteHeight * world.fontResolution
        this.textCanvas.style.position = 'absolute'
        this.textCanvas.style.display = 'block'
        this.textCanvas.style.top = '0'
        this.textCanvas.style.left = '0'
        this.textCanvas.style.width = '100%'
        this.textCanvas.style.height = '100%'
        this.wrapper.appendChild(this.textCanvas)
        this.textContext = this.textCanvas.getContext('2d')

        this.frameRate = 400
        this.dialogRate = 50
        this.nextPageDelay = 200

        this.onInventoryChange = null
        this.onVariablesChange = null
        this.onDialogChange = null

        // === 圖片系統狀態 ===
        this.currentPicture = null
        this.currentPictureFrameIndex = 0
        this.currentPicturePalette = null
        this.currentPictureMusic = null
        this.currentFace = null
        this.currentFaceFrameIndex = 0
        this.pictureFrameTimer = 0
        this.faceFrameTimer = 0
        this.pictureFrameRate = 400 // ms
        this.faceFrameRate = 400 // ms
        this.pictureOnExitScript = null

        // --- 新增：自動觸發 on-show/on-hide ---
        this.setPicture = (pictureName) => {
            // on-hide for previous picture
            if (this.currentPicture && this.currentPicture !== pictureName) {
                let prevGraphic = this.world.graphicList && this.world.graphicList.find(g => g.name === this.currentPicture && g.type === 'picture')
                if (prevGraphic && prevGraphic.scriptList && prevGraphic.scriptList['on-hide']) {
                    this.runScript(prevGraphic.scriptList, 'on-hide')
                }
            }
            // set new value
            this.currentPicture = pictureName
            this.currentPictureFrameIndex = 0
            this.pictureFrameTimer = 0
            this.currentPicturePalette = null
            this.currentPictureMusic = null
            // on-show for new picture
            if (pictureName) {
                let newGraphic = this.world.graphicList && this.world.graphicList.find(g => g.name === pictureName && g.type === 'picture')
                if (newGraphic && newGraphic.scriptList && newGraphic.scriptList['on-show']) {
                    this.runScript(newGraphic.scriptList, 'on-show')
                    return // 直接 return，覆蓋主流程
                }
            } else {
                // === 新增：圖片被隱藏時自動還原房間 palette 與 music ===
                this.currentPaletteIndex = this.world.paletteList.findIndex(p => p.name === this.currentRoom.paletteName)
                this.updateMusic()
                this.updateCache && this.updateCache()
            }
        }

        this.begin = () => {
            // 設定文字比例
            window.textScale = this.world.textScale || 2
            
            // set up avatar
            this.avatar =
                this.world.spriteList.find(sprite => sprite.isAvatar)
                || this.world.spriteList[0]
            this.avatarX = 0
            this.avatarY = 0
            this.nextX = 0
            this.nextY = 0
            this.inventory = deepClone(world.inventory || {})
            this.variables = deepClone(world.variables || {})

            // initialize animations variables
            this.lastTimestamp = 0
            this.timeToNextFrame = 0
            this.timeToNextInput = 0
            this.frameIndex = 0
            this.spriteFrameList = {}
            this.avatarDirection = 'right'

            // initialize dialog variables
            this.dialogNodes = []
            this.pageIsComplete = false
            this.nextPageTimer = 0

            // get starting room
            this.moveRooms(this.startingRoom(), true)
            this.nextRoomIndex = this.currentRoomIndex

            // run game start script
            this.runScript(this.world.worldScriptList, 'on-start')

            // initialize event handling
            this.keyActive = false
            this.keyCodes = []
            this.addEventListeners()

            // kick off update loop
            this.update(0)
        }

        this.end = () => {
            // stop any music that's playing
            MusicPlayer.stopSong()

            // clean up event listeners
            this.removeEventListeners()

            // stop animation loop
            window.cancelAnimationFrame(this.animationRequest)
        }

        this.update = (timestamp) => {
            let dt = timestamp - this.lastTimestamp
            this.lastTimestamp = timestamp

            // progress frames
            this.timeToNextFrame -= dt
            if (this.timeToNextFrame <= 0) {
                this.frameIndex++
                if (this.frameIndex >= 12) this.frameIndex = 0
                this.timeToNextFrame = this.frameRate
            }

            // update avatar
            this.timeToNextInput -= dt
            if (this.timeToNextInput <= 0) {
                this.updateAvatar()
                this.timeToNextInput = 200
            }

            // get current tiles and colors
            let tileList = this.currentRoom.tileList
            let palette = this.world.paletteList[this.currentPaletteIndex]
            let colorList = palette.colorList

            // draw background
            let canvasWidth = this.world.spriteWidth * this.world.roomWidth
            let canvasHeight = this.world.spriteHeight * this.world.roomHeight
            this.context.fillStyle = colorList[0]
            this.context.fillRect(0, 0, canvasWidth, canvasHeight)

            // draw sprites
            tileList.forEach(tile => {
                let { spriteName, x, y } = tile
                let sprite = this.world.spriteList.find(sprite => sprite.name === spriteName)
                if (sprite && !sprite.isAvatar) {
                    let xOffset = x * sprite.width
                    let yOffset = y * sprite.height
                    let frameList = this.spriteFrameList[sprite.name]
                    let frameIndex = this.frameIndex % frameList.length
                    let frameData = frameList[frameIndex]
                    this.context.drawImage(frameData, xOffset, yOffset)
                }
            })

            // draw player avatar
            this.drawAvatar()

            // === 插圖動畫幀自動循環 ===
            if (this.currentPicture) {
                let graphic = this.world.graphicList && this.world.graphicList.find(g => g.name === this.currentPicture && g.type === 'picture')
                if (graphic && graphic.frameList && graphic.frameList.length > 0) {
                    this.pictureFrameTimer += dt
                    if (this.pictureFrameTimer >= this.pictureFrameRate) {
                        this.currentPictureFrameIndex = (this.currentPictureFrameIndex + 1) % graphic.frameList.length
                        this.pictureFrameTimer = 0
                    }
                    // palette/music切換
                    if (graphic.paletteName && this.currentPicturePalette !== graphic.paletteName) {
                        this.currentPaletteIndex = this.world.paletteList.findIndex(p => p.name === graphic.paletteName)
                        this.currentPicturePalette = graphic.paletteName
                    }
                    if (graphic.musicName && this.currentPictureMusic !== graphic.musicName) {
                        this.currentMusicIndex = this.world.musicList.findIndex(m => m.name === graphic.musicName)
                        this.currentPictureMusic = graphic.musicName
                        // 直接切換到 picture 的音樂
                        MusicPlayer.stopSong()
                        let music = this.world.musicList[this.currentMusicIndex]
                        if (music) MusicPlayer.playSong(music)
                    }
                    // 繪製插圖
                    let frame = graphic.frameList[this.currentPictureFrameIndex]
                    let gWidth = graphic.width
                    let gHeight = graphic.height
                    let cWidth = this.canvas.width
                    let cHeight = this.canvas.height
                    let scale = Math.min(cWidth / gWidth, cHeight / gHeight)
                    let drawW = gWidth * scale
                    let drawH = gHeight * scale
                    let offsetX = (cWidth - drawW) / 2
                    let offsetY = (cHeight - drawH) / 2
                    let tempCanvas = document.createElement('canvas')
                    tempCanvas.width = gWidth
                    tempCanvas.height = gHeight
                    let tempCtx = tempCanvas.getContext('2d')
                    // 使用 picture 自己的調色盤，如果沒有的話才使用當前房間的調色盤
                    let pictureColorList = colorList
                    if (graphic.paletteName) {
                        let picturePalette = this.world.paletteList.find(p => p.name === graphic.paletteName)
                        if (picturePalette) {
                            pictureColorList = picturePalette.colorList
                        }
                    }
                    this.drawFrame(frame, gWidth, tempCtx, pictureColorList, false)
                    this.context.drawImage(tempCanvas, offsetX, offsetY, drawW, drawH)
                }
            }

            // draw dialog
            this.updateDialog(timestamp)

            // 插圖互動：無對話時任何操作自動退出
            // === 插圖顯示且無對話時，完全阻斷遊戲邏輯 ===
            if (this.currentPicture && (!this.dialogNodes || this.dialogNodes.length === 0)) {
                // 插圖互動：無對話時任何操作自動退出
                if (!this._pictureExitHandler) {
                    this._pictureExitHandler = (e) => {
                        let graphic = this.world.graphicList && this.world.graphicList.find(g => g.name === this.currentPicture && g.type === 'picture')
                        if (graphic && graphic.scriptList && graphic.scriptList['on-hide']) {
                            this.runScript(graphic.scriptList, 'on-hide')
                        }
                        this.currentPicture = null
                        this.currentPictureFrameIndex = 0
                        this.currentPicturePalette = null
                        this.currentPictureMusic = null
                        // 新增：清空玩家輸入狀態，避免殘留移動
                        this.keyActive = false
                        this.keyCodes = []
                        // 恢復房間的音樂
                        this.updateMusic()
                        this.updateCache()
                        window.removeEventListener('keydown', this._pictureExitHandler)
                        window.removeEventListener('mousedown', this._pictureExitHandler)
                        window.removeEventListener('touchstart', this._pictureExitHandler)
                        this._pictureExitHandler = null
                    }
                    window.addEventListener('keydown', this._pictureExitHandler)
                    window.addEventListener('mousedown', this._pictureExitHandler)
                    window.addEventListener('touchstart', this._pictureExitHandler)
                }
                // 不再 return，讓動畫循環繼續
            } else if (this._pictureExitHandler) {
                window.removeEventListener('keydown', this._pictureExitHandler)
                window.removeEventListener('mousedown', this._pictureExitHandler)
                window.removeEventListener('touchstart', this._pictureExitHandler)
                this._pictureExitHandler = null
            }

            // see you next frame!
            this.animationRequest = window.requestAnimationFrame(this.update)
        }

        this.updateAvatar = () => {
            // 若插圖顯示且無對話，阻止移動等遊戲邏輯
            if (this.currentPicture && (!this.dialogNodes || this.dialogNodes.length === 0)) {
                return
            }
            let {
                worldWidth,
                worldHeight,
                worldWrapHorizontal,
                worldWrapVertical,
                roomWidth,
                roomHeight
            } = this.world

            let x = this.avatarX
            let y = this.avatarY
            let roomX = Math.floor(this.currentRoomIndex % worldWidth)
            let roomY = Math.floor(this.currentRoomIndex / worldWidth)
            let stopMoving = false

            // check input
            if (this.dialogNodes.length > 0) {
                // do nothing if there's dialog up
            } else if (this.keyActive) {
                let key = this.keyCodes[this.keyCodes.length - 1]
                if (key === 'ArrowLeft' || key === 'a') {
                    x--
                    this.avatarDirection = 'left'
                } else if (key === 'ArrowRight' || key === 'd') {
                    x++
                    this.avatarDirection = 'right'
                } else if (key === 'ArrowUp' || key === 'w') {
                    y--
                } else if (key === 'ArrowDown' || key === 's') {
                    y++
                }
            } else if (this.pointerIsDown || this.oneMoreMove) {
                let dx = this.pointerEndPos.x - this.pointerStartPos.x
                let dy = this.pointerEndPos.y - this.pointerStartPos.y

                if (dx * dx + dy * dy > 20 * 20) {
                    let angle = Math.atan2(dy, dx) * 180 / Math.PI + 180
                    if (angle > 45 && angle <= 135) {
                        y--
                    } else if (angle > 135 && angle <= 225) {
                        x++
                        this.avatarDirection = 'right'
                    } else if (angle > 225 && angle <= 315) {
                        y++
                    } else {
                        x--
                        this.avatarDirection = 'left'
                    }
                    this.movesSinceLastTouch++
                    this.oneMoreMove = false
                }
            }

            // check if avatar is going outside of room bounds
            if (x < 0) {
                x = roomWidth - 1
                roomX--
            }
            if (x >= roomWidth) {
                x = 0
                roomX++
            }
            if (y < 0) {
                y = roomHeight - 1
                roomY--
            }
            if (y >= roomHeight) {
                y = 0
                roomY++
            }

            // check if avatar is going outside of world bounds
            if (roomX < 0) {
                if (worldWrapHorizontal) roomX = worldWidth - 1
                else stopMoving = true
            }
            if (roomX >= worldWidth) {
                if (worldWrapHorizontal) roomX = 0
                else stopMoving = true
            }
            if (roomY < 0) {
                if (worldWrapVertical) roomY = worldHeight - 1
                else stopMoving = true
            }
            if (roomY >= worldHeight) {
                if (worldWrapVertical) roomY = 0
                else stopMoving = true
            }
            if (stopMoving) return

            // move avatar
            let roomIndex = (roomY * worldWidth) + roomX
            this.moveAvatar(roomIndex, x, y)
        }

        this.moveAvatar = (roomIndex, x, y) => {
            let stopMoving = false

            // reset next positions
            this.nextRoomIndex = roomIndex
            this.nextX = x
            this.nextY = y

            // check for tile interactions
            let tileIsClear = this.checkTileForAvatar(this.nextRoomIndex, this.nextX, this.nextY)
            if (!tileIsClear) stopMoving = true

            // remove any tiles marked for death
            this.world.roomList.forEach(r => {
                r.tileList = r.tileList.filter(tile => !tile.removeMe)
            })

            // finalize avatar movement
            if (!stopMoving) {
                this.avatarX = this.nextX
                this.avatarY = this.nextY
                this.moveRooms(this.nextRoomIndex)
            }
        }

        this.checkTileForAvatar = (roomIndex, x, y) => {
            let room = this.world.roomList[roomIndex]
            let tileIsClear = true

            // look at each tile in the room
            room.tileList.forEach(tile => {
                // ignore tiles that player is not going to be standing on
                if (tile.x !== x || tile.y !== y) return

                // get sprite data for the current tile
                let sprite = this.world.spriteList.find(s => s.name === tile.spriteName)

                // ignore sprite if it's the avatar or if it doesn't exist
                if (!sprite || sprite.isAvatar) return

                // it's a wall - block the way!
                if (sprite.isWall) {
                    tileIsClear = false
                }

                // it's an item - pick it up!
                if (sprite.isItem) {
                    this.addToInventory(sprite.name, 1)
                    tile.removeMe = true
                }

                // run the sprite's script (if player's not already on this tile)
                if (this.avatarX !== x || this.avatarY !== y) {
                    this.runScript(sprite.scriptList, 'on-push', { sprite, tile, roomIndex })
                }
            })

            // return whether tile is blocking player movement
            return tileIsClear
        }

        this.checkTileForSprite = (roomIndex, x, y) => {
            let room = this.world.roomList[roomIndex]
            let tileIsClear = true

            // look at each tile in the room
            room.tileList.forEach(tile => {
                // ignore tiles that player is not going to be standing on
                if (tile.x !== x || tile.y !== y) return

                // get sprite data for the current tile
                let sprite = this.world.spriteList.find(s => s.name === tile.spriteName)

                // it's a wall - block the way!
                if (sprite.isWall) tileIsClear = false
            })

            // return whether tile is blocking player movement
            return tileIsClear
        }

        this.startDialog = (dialogNodes) => {
            this.dialogNodes = dialogNodes
            this.pageStartTimestamp = null
            this.pageIsComplete = false
            window.textPosition = null
            if (this.onDialogChange) this.onDialogChange(this.dialogNodes)
        }

        this.progressDialog = () => {
            if (this.pageIsComplete && this.nextPageTimer >= this.nextPageDelay) {
                this.pageStartTimestamp = null
                this.pageIsComplete = false
                this.nextPageTimer = 0
                this.dialogNodes = this.dialogNodes.slice(this.nextPageNodeIndex)
                if (this.onDialogChange) this.onDialogChange(this.dialogNodes)
                if (this.dialogNodes.length === 0) {
                    // clear text canvas when dialog is complete
                    this.textContext.clearRect(0, 0, this.textCanvas.width, this.textCanvas.height)
                    // 清除scriptInfo
                    this.lastDialogScriptInfo = null
                    if (this.onDialogChange) this.onDialogChange([], null)
                }
            } else {
                this.pageIsComplete = true
                if (this.onDialogChange) this.onDialogChange(this.dialogNodes)
            }
        }

        this.updateDialog = (timestamp) => {
            if (this.dialogNodes.length === 0) return

            let canvas = this.textCanvas
            let context = this.textContext
            let { fontData, fontDirection } = this.world

            context.clearRect(0, 0, canvas.width, canvas.height)

            // 取得主體顏色
            let mainPalette = this.world.paletteList[this.world.mainPaletteIndex]
            let bgColor = mainPalette ? mainPalette.colorList[this.world.mainBgColorIndex] : '#000000'
            let textColor = mainPalette ? mainPalette.colorList[this.world.mainTextColorIndex] : '#ffffff'

            // calculate number of characters to draw
            if (!this.pageStartTimestamp) this.pageStartTimestamp = timestamp
            let dt = timestamp - this.pageStartTimestamp
            let maxChars = this.pageIsComplete ? -1 : Math.floor(dt / this.dialogRate)

            // draw background
            if (!window.textPosition) window.textPosition = 'none'
            let { bgX, bgY, bgWidth, bgHeight } = Text.drawBackground(context, fontData, window.textPosition, 2, bgColor)

            // draw continue indicator
            if (this.pageIsComplete) {
                if (window.textPosition === 'none') {
                    // skip end-of-page delay if no text
                    this.nextPageTimer = this.nextPageDelay
                } else {
                    // otherwise show next-page indicator and progress the delay timer
                    this.nextPageTimer += Math.floor(dt / this.dialogRate)
                    if (this.nextPageTimer >= this.nextPageDelay) {
                        Text.drawContinueIndicator(context, fontData, bgX, bgY, bgWidth, bgHeight, textColor)
                    }
                }
            }

            // draw text
            let textStartX = bgX;
            let textWidth = bgWidth;
            // 只有在有對話框背景時才繪製 face
            if (this.currentFace && window.textPosition !== 'none') {
                let graphic = this.world.graphicList && this.world.graphicList.find(g => g.name === this.currentFace && g.type === 'face')
                if (graphic && graphic.frameList && graphic.frameList.length > 0) {
                    this.faceFrameTimer += (timestamp - (this._lastFaceFrameTimestamp || timestamp))
                    this._lastFaceFrameTimestamp = timestamp
                    if (this.faceFrameTimer >= this.faceFrameRate) {
                        this.currentFaceFrameIndex = (this.currentFaceFrameIndex + 1) % graphic.frameList.length
                        this.faceFrameTimer = 0
                    }
                    // 根據 textScale 計算臉部圖片尺寸，跟 text.js 邏輯一致
                    let textScale = window.textScale || 2
                    // 臉部圖片用整數倍數放大，保持像素完美
                    let bgHeightMultiplier = textScale === 1 ? (2 * 2 + 0.5) : (2 * 2 + 3) // linesPerPage = 2
                    let maxFaceH = Math.floor(fontData.height * bgHeightMultiplier * 0.8);
                    // 計算整數倍數，不超過最大高度
                    let scale = Math.floor(maxFaceH / graphic.height);
                    if (scale < 1) scale = 1; // 最小 1 倍
                    let drawW = graphic.width * scale;
                    let drawH = graphic.height * scale;
                    // 根據文字縮放調整臉部圖片的左側間距
                    // 使用更平衡的間距計算
                    let baseMargin = fontData.width;
                    let marginMultiplier = textScale === 1 ? 0.7 : 1.2; // 調整到更平衡的比例
                    let offsetX = bgX + (baseMargin * marginMultiplier);
                    let offsetY = bgY + (bgHeight - drawH) / 2;
                    let tempCanvas = document.createElement('canvas')
                    tempCanvas.width = graphic.width
                    tempCanvas.height = graphic.height
                    let tempCtx = tempCanvas.getContext('2d')
                    let frame = graphic.frameList[this.currentFaceFrameIndex]
                    // 根據是否有 picture 顯示來決定使用哪個調色盤
                    let colorList
                    if (this.currentPicture) {
                        // 如果有 picture 顯示，使用 picture 的調色盤
                        let pictureGraphic = this.world.graphicList.find(g => g.name === this.currentPicture && g.type === 'picture')
                        if (pictureGraphic && pictureGraphic.paletteName) {
                            let picturePalette = this.world.paletteList.find(p => p.name === pictureGraphic.paletteName)
                            colorList = picturePalette ? picturePalette.colorList : []
                        } else {
                            // picture 沒有指定調色盤，使用當前房間的調色盤
                            let palette = this.world.paletteList.find(p => p.name === this.currentRoom.paletteName)
                            colorList = palette ? palette.colorList : []
                        }
                    } else {
                        // 沒有 picture 顯示，使用當前房間的調色盤
                        let palette = this.world.paletteList.find(p => p.name === this.currentRoom.paletteName)
                        colorList = palette ? palette.colorList : []
                    }
                    this.drawFrame(frame, graphic.width, tempCtx, colorList, graphic.isTransparent, graphic.colorIndex)
                    context.imageSmoothingEnabled = false;
                    if (context.mozImageSmoothingEnabled !== undefined) context.mozImageSmoothingEnabled = false;
                    if (context.webkitImageSmoothingEnabled !== undefined) context.webkitImageSmoothingEnabled = false;
                    context.drawImage(tempCanvas, offsetX, offsetY, drawW, drawH)
                    // 讓文字區塊往右移動
                    textStartX = bgX + drawW + (8 * textScale);
                    textWidth = bgWidth - (drawW + (8 * textScale));
                }
            }

            let nextPageNodeIndex = Text.drawNode({
                nodes: this.dialogNodes,
                canvas,
                context,
                fontData,
                fontDirection,
                timestamp,
                maxChars,
                bgX: textStartX,
                bgY,
                defaultTextColor: textColor,
                bgWidth: textWidth // 傳給bgWidth
            })



            if (nextPageNodeIndex >= 0) {
                let textNodeCount = this.dialogNodes.filter((node, i) =>
                        (node.type === 'text' && i < nextPageNodeIndex)
                    ).length

                this.pageIsComplete = true
                this.nextPageNodeIndex = nextPageNodeIndex

                // [PATCH] skip 流程級控制（移除 delay-action 相關）
                let nextNode = this.dialogNodes[this.nextPageNodeIndex];
                // 先跳過所有空字串 node
                while (nextNode && typeof nextNode === 'string' && !nextNode.trim()) {
                    this.nextPageNodeIndex++;
                    nextNode = this.dialogNodes[this.nextPageNodeIndex];
                }
                // 只要遇到 skip 就 while 迴圈跳過所有 skip node
                while (nextNode && nextNode.type === 'skip') {
                    this.nextPageNodeIndex++;
                    setTimeout(() => this.progressDialog(), 0);
                    return;
                }

                if (textNodeCount === 0) this.progressDialog()
            }
        }

        this.addToInventory = (item, quantity) => {
            if (!this.inventory[item]) this.inventory[item] = 0
            this.inventory[item] += quantity
            if (this.inventory[item] < 0) this.inventory[item] = 0
            if (this.onInventoryChange) this.onInventoryChange(deepClone(this.inventory))
        }

        this.startingRoom = () => {
            // find the room that the player starts in
            let roomIndex = 0
            this.world.roomList.forEach((room, i) => {
                room.tileList.forEach(tile => {
                    if (tile.spriteName === this.avatar.name) {
                        roomIndex = i
                        this.avatarX = tile.x
                        this.avatarY = tile.y
                    }
                })
            })
            return roomIndex
        }

        this.moveRooms = (roomIndex, startOfGame) => {
            // 防護檢查：確保 world.roomList 存在且有效
            if (!this.world || !this.world.roomList || !Array.isArray(this.world.roomList) || this.world.roomList.length === 0) {
                console.warn('world.roomList 不存在或無效')
                return
            }
            
            // 防護檢查：確保 roomIndex 有效
            if (typeof roomIndex !== 'number' || roomIndex < 0 || roomIndex >= this.world.roomList.length) {
                console.warn('roomIndex 無效:', roomIndex)
                return
            }
            
            // ignore if player is already in this room
            if (this.currentRoomIndex === roomIndex) return

            // run exit script for old room
            if (!startOfGame && this.currentRoom) {
                this.runScript(this.currentRoom.scriptList, 'on-exit')
            }

            // update room references
            this.currentRoomIndex = roomIndex
            this.currentRoom = this.world.roomList[this.currentRoomIndex]
            
            // 防護檢查：確保 currentRoom 存在
            if (!this.currentRoom) {
                console.warn('currentRoom 不存在')
                return
            }

            // update color palette
            this.currentPaletteIndex = this.world.paletteList.findIndex(p => p.name === this.currentRoom.paletteName)

            // play new music
            this.updateMusic()

            // cache new sprites
            this.updateCache()

            // run enter script for new room
            if (!startOfGame) {
                this.runScript(this.currentRoom.scriptList, 'on-enter')
            }
        }

        this.updateMusic = () => {
            // 防護檢查：確保 currentRoom 存在
            if (!this.currentRoom) {
                console.warn('updateMusic: currentRoom 不存在')
                return
            }
            
            // find music for current room
            let musicIndex = this.world.musicList.findIndex(m => m.name === this.currentRoom.musicName)

            // stop previous music and play new music, if changed
            if (musicIndex !== this.currentMusicIndex) {
                this.currentMusicIndex = musicIndex
                MusicPlayer.stopSong()
                let music = this.world.musicList[musicIndex]
                if (music) MusicPlayer.playSong(music)
            }
        }

        this.runScript = (scriptList, scriptName, context) => {
            // ignore non-existent scripts
            if (!scriptList || !scriptList[scriptName]) return

            // get script
            let script = scriptList[scriptName]

            // 記錄本次觸發的script原文與來源
            this.lastDialogScriptInfo = {
                script,
                sourceType: (context && context.sprite) ? 'sprite' : (context && context.roomIndex !== undefined) ? 'room' : 'world',
                eventName: scriptName,
                context: context
            }

            // run script
            Script.run(script, this, context)
        }

        this.nextFrames = () => {
            Object.keys(this.spriteFrameIndexList).forEach(key => {
                let frameIndex = this.spriteFrameIndexList[key]

                this.frameIndex = frameIndex || 0
                if (this.frameIndex >= this.frameCanvasList.length) {
                    this.frameIndex = 0
                }
            })
        }

        this.drawFrame = (frame, width, context, colorList, isTransparent, colorIndex) => {
            let isMono = typeof colorIndex === 'number' && frame.every(v => v === 0 || v === 1)
            frame.forEach((pixel, i) => {
                let x = Math.floor(i % width)
                let y = Math.floor(i / width)
                if (pixel === 0 && isTransparent) return
                let color = isMono
                    ? (pixel === 1 ? colorList[colorIndex] : colorList[0])
                    : (colorList[pixel] || '#000')
                context.fillStyle = color
                context.fillRect(x, y, 1, 1)
            })
        }

        this.getFrameData = (frame, colorList, flipped, bgColor, isTransparent, colorIndex) => {
            let { spriteWidth, spriteHeight } = this.world
            let frameCanvas = document.createElement('canvas')
            frameCanvas.width = spriteWidth
            frameCanvas.height = spriteHeight
            let context = frameCanvas.getContext('2d')
            if (flipped) {
                context.translate(spriteWidth, 0)
                context.scale(-1, 1)
            }
            if (bgColor) {
                context.fillStyle = bgColor
                context.fillRect(0, 0, spriteWidth, spriteHeight)
            }
            this.drawFrame(frame, spriteWidth, context, colorList, isTransparent, colorIndex)
            return frameCanvas
        }

        this.cacheSprite = (sprite, colorList, flipped) => {
            let name = sprite.name + (flipped ? '__flipped' : '')
            if (sprite && !this.spriteFrameList[name]) {
                this.spriteFrameList[name] = sprite.frameList.map(frame => {
                    return this.getFrameData(
                        frame,
                        colorList,
                        flipped,
                        sprite.isTransparent ? null : colorList[0],
                        sprite.isTransparent,
                        sprite.colorIndex
                    )
                })
            }
        }

        this.updateCache = () => {
            // 防護檢查：確保 currentRoom 存在
            if (!this.currentRoom) {
                console.warn('updateCache: currentRoom 不存在')
                return
            }
            
            let tileList = this.currentRoom.tileList
            this.currentPaletteIndex = this.world.paletteList.findIndex(p => p.name === this.currentRoom.paletteName)
            let palette = this.world.paletteList[this.currentPaletteIndex]
            let colorList = palette.colorList

            this.spriteFrameList = {}

            tileList.forEach(tile => {
                let { spriteName } = tile
                let sprite = this.world.spriteList.find(s => s.name === spriteName)
                this.cacheSprite(sprite, colorList)
            })

            this.cacheSprite(this.avatar, colorList)
            this.cacheSprite(this.avatar, colorList, true)
        }

        this.drawAvatar = () => {
            let { spriteWidth, spriteHeight } = this.world
            let name = this.avatar.name
            if (this.avatarDirection === 'left') name += '__flipped'

            let frameList = this.spriteFrameList[name]
            let frameIndex = this.frameIndex % frameList.length
            let frameData = frameList[frameIndex]
            this.context.drawImage(frameData, this.avatarX * spriteWidth, this.avatarY * spriteHeight)
        }

        this.addEventListeners = () => {
            document.addEventListener('keydown', this.keyDown)
            document.addEventListener('keyup', this.keyUp)

            this.wrapper.addEventListener('mousedown', this.pointerStart)
            document.addEventListener('mouseup', this.pointerEnd)
            document.addEventListener('mousemove', this.pointerMove)

            this.wrapper.addEventListener('touchstart', this.pointerStart, { passive: false })
            document.addEventListener('touchend', this.pointerEnd, { passive: false })
            document.addEventListener('touchcancel', this.pointerEnd, { passive: false })
            document.addEventListener('touchmove', this.pointerMove, { passive: false })

            window.addEventListener('resize', this.resize)
            this.resize()
        }

        this.removeEventListeners = () => {
            document.removeEventListener('keydown', this.keyDown)
            document.removeEventListener('keyup', this.keyUp)

            this.wrapper.removeEventListener('mousedown', this.pointerDown)
            document.removeEventListener('mouseup', this.pointerEnd)
            document.removeEventListener('mousemove', this.pointerMove)

            this.wrapper.removeEventListener('touchstart', this.pointerDown)
            document.removeEventListener('touchend', this.pointerEnd)
            document.removeEventListener('touchcancel', this.pointerEnd)
            document.removeEventListener('touchmove', this.pointerMove)

            window.removeEventListener('resize', this.resize)
        }

        this.keyDown = (e) => {
            if (e.key.startsWith('Arrow') || ['w', 'a', 's', 'd'].includes(e.key)) e.preventDefault() // prevent arrow keys from scrolling page
            if (e.repeat) return // ignore key repeats
            if (e.key === 'm') {
                window.muteMusic = !window.muteMusic
            }
            else if (this.dialogNodes.length > 0) {
                if (e.key.startsWith('Arrow') || ['w', 'a', 's', 'd'].includes(e.key)) {
                    this.progressDialog()
                }
            } else {
                this.keyActive = true
                this.keyCodes.push(event.key)
                this.timeToNextInput = 0
            }
        }

        this.keyUp = (e) => {
            this.keyCodes = this.keyCodes.filter(keyCode => keyCode !== e.key)
            if (this.keyCodes.length === 0) this.keyActive = false
        }

        this.pointerStart = (e) => {
            e.preventDefault()
            this.canvas.focus()
            let pointer = e.touches ? e.touches[0] : e
            this.pointerIsDown = true
            this.movesSinceLastTouch = 0
            this.pointerStartPos = {
                x: pointer.clientX,
                y: pointer.clientY
            }
            this.pointerEndPos = {
                x: pointer.clientX,
                y: pointer.clientY
            }
            this.timeToNextInput = 0
        }

        this.pointerMove = (e) => {
            if (this.pointerIsDown) {
                e.preventDefault()
                let pointer = e.touches ? e.touches[0] : e
                this.pointerEndPos = {
                    x: pointer.clientX,
                    y: pointer.clientY
                }
            }
        }

        this.pointerEnd = (e) => {
            if (this.pointerIsDown) {
                e.preventDefault()
                this.pointerIsDown = false
                if (this.dialogNodes.length > 0) {
                    this.progressDialog()
                } else {
                    if (this.movesSinceLastTouch === 0) {
                        this.oneMoreMove = true
                        this.timeToNextInput = 0
                    }
                }
            }
        }

        this.resize = () => {
            this.canvas.focus()
            let width = this.canvas.width
            let height = this.canvas.height
            let widthRatio = width > height ? 1 : width / height
            let heightRatio = width > height ? height / width : 1
            this.wrapper.style.width = widthRatio * 100 + '%',
            this.wrapper.style.paddingTop = heightRatio * 100 + '%'
        }

        this.setInventoryChangeCallback = cb => { this.onInventoryChange = cb }
        this.setVariablesChangeCallback = cb => { this.onVariablesChange = cb }
        this.setDialogChangeCallback = cb => {
            this.onDialogChange = (dialogNodes) => {
                cb(dialogNodes, this.lastDialogScriptInfo)
            }
        }
    }

}
`

let generateGameScript = new Function(gameScript)
let Game = generateGameScript()