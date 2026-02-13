let gameScript = `
return class {

    constructor(world, el) {
        if (typeof window !== 'undefined') window._mosiDialogAlpha = 1;
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
                    let prevIndex = this.world.graphicList.findIndex(g => g.name === this.currentPicture && g.type === 'picture')
                    this.runScript(prevGraphic.scriptList, 'on-hide', { graphicIndex: prevIndex })
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
                    let newIndex = this.world.graphicList.findIndex(g => g.name === pictureName && g.type === 'picture')
                    this.runScript(newGraphic.scriptList, 'on-show', { graphicIndex: newIndex })
                    return // 直接 return，覆蓋主流程
                }
            } else {
                // === 新增：圖片被隱藏時自動還原房間 palette 與 music ===
                this.currentPaletteIndex = this.world.paletteList.findIndex(p => p.name === this.currentRoom.paletteName)
                this.updateMusic()
                this.updateCache && this.updateCache()
            }
        }

        // === 主循環唯一 flag ===
        this._rafId = null;
        this._isFading = false;
        
        // === 搖動效果狀態 ===
        this._isShaking = false;
        this._shakeStartTime = 0;
        this._shakeDuration = 0;
        this._shakeIntensity = 0;
        this._shakeOffsetX = 0;
        this._shakeOffsetY = 0;

        this.begin = () => {
            // 設定文字比例
            window.textScale = this.world.textScale || 2
            
            // 設定對話框最大行數
            if (this.world && typeof this.world.dialogMaxLines === 'number' && this.world.dialogMaxLines >= 2 && this.world.dialogMaxLines <= 10) {
                window.dialogMaxLines = this.world.dialogMaxLines
            } else if (typeof window.dialogMaxLines === 'undefined') {
                window.dialogMaxLines = 2
            }
            
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
            this.avatarDirection = 'front'
            
            // initialize direction sprites mapping
            this.avatarDirectionSprites = {}
            this.useDirectionSprites = false

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

            // 立即同步渲染一次，確保畫面立刻出現
            this.update(0); // 不設 flag，直接同步執行一次
            // 然後啟動主循環（用 flag 控制唯一）
            if (!this._rafId) {
                this._rafId = requestAnimationFrame(this.update);
            }

            this.followerTrail = [];
            this.followerList = [];
        }

        this.end = () => {
            // stop any music that's playing
            MusicPlayer.stopSong()

            // clean up event listeners
            this.removeEventListeners()

            // stop animation loop
            if (this._rafId) {
                cancelAnimationFrame(this._rafId);
                this._rafId = null;
            }
        }

        // === 搖動效果方法 ===
        this.shakeScreen = (duration = 500, intensity = 5) => {
            this._isShaking = true;
            this._shakeStartTime = performance.now();
            this._shakeDuration = duration;
            this._shakeIntensity = intensity;
            this._shakeOffsetX = 0;
            this._shakeOffsetY = 0;
        }

        this.updateShake = (timestamp) => {
            if (!this._isShaking) return;
            
            const elapsed = timestamp - this._shakeStartTime;
            const progress = elapsed / this._shakeDuration;
            
            if (progress >= 1) {
                // 搖動結束
                this._isShaking = false;
                this._shakeOffsetX = 0;
                this._shakeOffsetY = 0;
                return;
            }
            
            // 計算衰減的強度
            const decay = 1 - progress;
            const currentIntensity = this._shakeIntensity * decay;
            
            // 生成隨機搖動偏移
            this._shakeOffsetX = (Math.random() - 0.5) * currentIntensity;
            this._shakeOffsetY = (Math.random() - 0.5) * currentIntensity;
        }

        this.update = (timestamp) => {
            // 動畫期間只畫動畫，不執行遊戲邏輯
            if (this._isFading) {
                // 可以選擇只畫動畫層，或直接 return，視你的需求
                this._rafId = requestAnimationFrame(this.update);
                return;
            }
            // 如果 timestamp 無效，使用 performance.now()（確保時間源一致）
            if (typeof timestamp !== 'number' || isNaN(timestamp)) {
                timestamp = performance.now();
            }
            // 首次初始化時，設定基準時間
            if (this.lastTimestamp === 0) {
                this.lastTimestamp = timestamp;
                var dt = 0; // 首幀不計時
            } else {
                var dt = timestamp - this.lastTimestamp;
                // 防護：如果 dt 異常（負數或過大），重置為 0
                if (isNaN(dt) || !isFinite(dt) || dt < 0) {
                    dt = 0;
                }
                this.lastTimestamp = timestamp;
            }

            // 更新搖動效果
            this.updateShake(timestamp)

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

            // 應用搖動偏移到畫布
            if (this._isShaking) {
                this.context.save()
                this.context.translate(this._shakeOffsetX, this._shakeOffsetY)
            }

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
                    if (graphic.musicName) {
                        let musicIndex = this.world.musicList.findIndex(m => m.name === graphic.musicName);
                        if (musicIndex !== this.currentMusicIndex) {
                            this.currentMusicIndex = musicIndex;
                            this.currentPictureMusic = graphic.musicName;
                            MusicPlayer.stopSong();
                            let music = this.world.musicList[this.currentMusicIndex];
                            if (music) MusicPlayer.playSong(music);
                        }
                        // 若 musicName 相同，currentPictureMusic 也要同步
                        else {
                            this.currentPictureMusic = graphic.musicName;
                        }
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

            // 恢復畫布變換
            if (this._isShaking) {
                this.context.restore()
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
            this._rafId = requestAnimationFrame(this.update)
        }

        this.updateAvatar = () => {
            if (this._isFading) return;
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
                let oldDirection = this.avatarDirection
                if (key === 'ArrowLeft' || key === 'a') {
                    x--
                    this.avatarDirection = 'left'
                } else if (key === 'ArrowRight' || key === 'd') {
                    x++
                    this.avatarDirection = 'right'
                } else if (key === 'ArrowUp' || key === 'w') {
                    y--
                    this.avatarDirection = 'back'
                } else if (key === 'ArrowDown' || key === 's') {
                    y++
                    this.avatarDirection = 'front'
                }
                
                // 檢查方向是否改變，如果改變則切換精靈
                if (oldDirection !== this.avatarDirection && this.avatarDirectionSprites && this.avatarDirectionSprites[this.avatarDirection]) {
                    this.avatar = this.avatarDirectionSprites[this.avatarDirection]
                    this.updateCache()
                }
            } else if (this.pointerIsDown || this.oneMoreMove) {
                let dx = this.pointerEndPos.x - this.pointerStartPos.x
                let dy = this.pointerEndPos.y - this.pointerStartPos.y

                if (dx * dx + dy * dy > 20 * 20) {
                    let angle = Math.atan2(dy, dx) * 180 / Math.PI + 180
                    let oldDirection = this.avatarDirection
                    if (angle > 45 && angle <= 135) {
                        y--
                        this.avatarDirection = 'back'
                    } else if (angle > 135 && angle <= 225) {
                        x++
                        this.avatarDirection = 'right'
                    } else if (angle > 225 && angle <= 315) {
                        y++
                        this.avatarDirection = 'front'
                    } else {
                        x--
                        this.avatarDirection = 'left'
                    }
                    
                    // 檢查方向是否改變，如果改變則切換精靈
                    if (oldDirection !== this.avatarDirection && this.avatarDirectionSprites && this.avatarDirectionSprites[this.avatarDirection]) {
                        this.avatar = this.avatarDirectionSprites[this.avatarDirection]
                        this.updateCache()
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
            if (this._isFading) return;
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

            // === 主角軌跡與跟隨精靈 ===
            if (!this.followerTrail) this.followerTrail = [];
            if (!this.followerList) this.followerList = [];
            // 原本 trail push 移到下方 !stopMoving 區塊
            // if (this.followerTrail.length === 0 || this.avatarX !== this.nextX || this.avatarY !== this.nextY || this.currentRoomIndex !== this.nextRoomIndex) {
            //     this.followerTrail.push({ room: this.nextRoomIndex, x: this.nextX, y: this.nextY });
            //     let maxTrail = 1 + (this.followerList ? this.followerList.length : 0) + 2;
            //     while (this.followerTrail.length > maxTrail) this.followerTrail.shift();
            // }

            // finalize avatar movement
            if (!stopMoving) {
                // 只有主角真的移動時才 push trail
                if (
                    this.followerTrail.length === 0 ||
                    this.avatarX !== this.nextX ||
                    this.avatarY !== this.nextY ||
                    this.currentRoomIndex !== this.nextRoomIndex
                ) {
                    this.followerTrail.push({ room: this.nextRoomIndex, x: this.nextX, y: this.nextY });
                    let maxTrail = 1 + (this.followerList ? this.followerList.length : 0) + 2;
                    while (this.followerTrail.length > maxTrail) this.followerTrail.shift();
                }

                this.avatarX = this.nextX
                this.avatarY = this.nextY
                this.moveRooms(this.nextRoomIndex)

                // === 跟隨精靈移動 ===
                if (this.followerList && this.followerList.length > 0) {
                    for (let i = 0; i < this.followerList.length; i++) {
                        let followerName = this.followerList[i];
                        let follower = this.world.spriteList.find(s => s.name === followerName);
                        if (!follower) continue;
                        // 計算目標軌跡點（主角後 i+1 格）
                        let targetIdx = this.followerTrail.length - (i + 2);
                        if (targetIdx >= 0) {
                            let pos = this.followerTrail[targetIdx];
                            // 只在同一房間才移動
                            if (pos && pos.room === this.currentRoomIndex) {
                                // 找到該精靈在房間的 tile
                                let room = this.world.roomList[this.currentRoomIndex];
                                let tile = room.tileList.find(t => t.spriteName === follower.name);
                                if (tile) {
                                    tile.x = pos.x;
                                    tile.y = pos.y;
                                }
                            }
                        }
                    }
                }
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
                    if (tile._pauseLoopWalk) {
                        tile._pauseLoopWalk();
                        this._lastPausedLoopTile = tile;
                    }
                    this.runScript(sprite.scriptList, 'on-push', { sprite, tile, roomIndex });
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

        this.startDialog = (dialogNodes, append = false) => {
            if (append && this.dialogNodes && this.dialogNodes.length > 0) {
                // 追加模式：將新對話框追加到現有對話框序列
                this.dialogNodes = this.dialogNodes.concat(dialogNodes)
            } else {
                // 覆蓋模式：替換現有對話框
                this.dialogNodes = dialogNodes
                this.pageStartTimestamp = null
                this.pageIsComplete = false
                window.textPosition = null
            }
            if (this.onDialogChange) this.onDialogChange(this.dialogNodes)
        }

        this.progressDialog = () => {
            if (window._mosiLockInput) return;
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
                    // === loop-walk-sprite: 對話結束時恢復循環 ===
                    if (this._lastPausedLoopTile && this._lastPausedLoopTile._resumeLoopWalk) {
                        this._lastPausedLoopTile._resumeLoopWalk();
                        this._lastPausedLoopTile = null;
                    }
                }
            } else {
                this.pageIsComplete = true
                if (this.onDialogChange) this.onDialogChange(this.dialogNodes)
            }
        }

        this.updateDialog = (timestamp) => {
            // 優先判斷整體透明度
            let overallAlpha = 1;
            if (typeof window !== 'undefined' && typeof window._mosiDialogAlpha !== 'undefined') {
                overallAlpha = window._mosiDialogAlpha;
            }
            this.textContext.globalAlpha = overallAlpha;
            
            if (this.dialogNodes.length === 0) return

            let canvas = this.textCanvas
            let context = this.textContext
            let { fontData, fontDirection } = this.world

            context.clearRect(0, 0, canvas.width, canvas.height)

            // 取得主體顏色
            let mainPalette = this.world.paletteList[this.world.mainPaletteIndex]
            let bgColor = mainPalette ? mainPalette.colorList[this.world.mainBgColorIndex] : '#000000'
            let textColor = mainPalette ? mainPalette.colorList[this.world.mainTextColorIndex] : '#ffffff'

            // ====== PATCH: 動態決定 palette 傳給 text.js ======
            let skinPalette = null
            if (this.world.textboxSkin) {
                // 皮膚分支：優先插圖 palette > 房間 palette > mainPalette
                if (this.currentPicture) {
                    let pictureGraphic = this.world.graphicList.find(g => g.name === this.currentPicture && g.type === 'picture')
                    if (pictureGraphic && pictureGraphic.paletteName) {
                        skinPalette = this.world.paletteList.find(p => p.name === pictureGraphic.paletteName)
                    }
                }
                if (!skinPalette) {
                    skinPalette = this.world.paletteList.find(p => p.name === this.currentRoom.paletteName)
                }
                if (!skinPalette) {
                    skinPalette = mainPalette
                }
            }
            // =================================================

            // 取得背景透明度（只有在整體 alpha 為 1 時才作用）
            let bgAlpha = 1;
            if (overallAlpha === 1 && typeof window !== 'undefined' && typeof window._mosiDialogBgAlpha !== 'undefined') {
                bgAlpha = window._mosiDialogBgAlpha;
            }

            // calculate number of characters to draw
            if (!this.pageStartTimestamp) this.pageStartTimestamp = timestamp
            let dt = timestamp - this.pageStartTimestamp
            let maxChars = this.pageIsComplete ? -1 : Math.floor(dt / this.dialogRate)

            // draw background
            if (!window.textPosition) window.textPosition = 'none'
            
            // 從世界數據中讀取 dialogMaxLines，如果沒有則使用預設值 2
            let linesPerPage = 2
            if (this.world && typeof this.world.dialogMaxLines === 'number' && this.world.dialogMaxLines >= 2 && this.world.dialogMaxLines <= 10) {
                linesPerPage = this.world.dialogMaxLines
            } else if (typeof window.dialogMaxLines === 'number' && window.dialogMaxLines >= 2 && window.dialogMaxLines <= 10) {
                linesPerPage = window.dialogMaxLines
            }
            
            // 計算實際文字行數
            let tempBgWidth = canvas.width - (fontData.width * 2)
            let actualLines = null
            
            // 計算當前頁面的實際行數
            if (this.dialogNodes.length > 0) {
                // 創建一個深拷貝，避免修改原始節點
                let nodesCopy = JSON.parse(JSON.stringify(this.dialogNodes))
                // 過濾掉 completed-action 節點
                let currentPageNodes = nodesCopy.filter(node => node.type !== 'completed-action')
                
                // 找到第一個 page-break 的位置
                let pageBreakIndex = currentPageNodes.findIndex(node => node.type === 'page-break')
                if (pageBreakIndex !== -1) {
                    // 只計算到 page-break 之前的節點
                    currentPageNodes = currentPageNodes.slice(0, pageBreakIndex)
                }
                
                actualLines = Text.calculateActualLines(currentPageNodes, fontData, tempBgWidth, window.textScale || 2)
            }
            
            let { bgX, bgY, bgWidth, bgHeight } = Text.drawBackground(
                context,
                fontData,
                window.textPosition,
                linesPerPage,
                bgColor,
                this.world,
                this.world.textboxSkin ? skinPalette : mainPalette, // PATCH: 皮膚分支用動態 palette，原生用 mainPalette
                actualLines,
                bgAlpha // 新增：傳遞背景透明度
            )

            // draw continue indicator
            if (this.pageIsComplete) {
                if (window.textPosition === 'none') {
                    // skip end-of-page delay if no text
                    this.nextPageTimer = this.nextPageDelay
                } else {
                    // otherwise show next-page indicator and progress the delay timer
                    this.nextPageTimer += Math.floor(dt / this.dialogRate)
                    if (this.nextPageTimer >= this.nextPageDelay) {
                        if (!window._mosiChoiceActive) {
                            Text.drawContinueIndicator(
                                context, fontData, bgX, bgY, bgWidth, bgHeight,
                                textColor, this.world,
                                this.world.textboxSkin ? skinPalette : mainPalette
                            );
                        }
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
                    // 臉部圖片始終使用2行的高度計算，不受對話框最大行數影響
                    let bgHeightMultiplier = textScale === 1 ? (2 * 2 + 0.5) : (2 * 2 + 3)
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

            let world = this.world;
            // 優先使用當前房間的動態調色盤，否則使用主調色盤
            let palette = null;
            if (world && world.paletteList) {
                let currentRoom = this.currentRoom || world.roomList[this.currentRoomIndex];
                if (currentRoom && currentRoom.paletteName) {
                    palette = world.paletteList.find(p => p.name === currentRoom.paletteName);
                }
                if (!palette && typeof world.mainPaletteIndex === 'number') {
                    palette = world.paletteList[world.mainPaletteIndex];
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
                bgWidth: textWidth,
                world,
                palette,
                linesPerPage
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

        this.drawRoomToContext = (room, ctx, colorList, roomIndex, avatarRoomIndex, avatarX, avatarY, avatarSprite) => {
            let tileList = room.tileList
            let w = this.world.spriteWidth * this.world.roomWidth
            let h = this.world.spriteHeight * this.world.roomHeight
            ctx.fillStyle = colorList[0]
            ctx.fillRect(0, 0, w, h)
            tileList.forEach(tile => {
                let { spriteName, x, y } = tile
                let sprite = this.world.spriteList.find(sprite => sprite.name === spriteName)
                if (sprite && !sprite.isAvatar) {
                    let xOffset = x * sprite.width
                    let yOffset = y * sprite.height
                    let frameList = sprite.frameList
                    let frameData = frameList[0]
                    let tempCanvas = document.createElement('canvas')
                    tempCanvas.width = sprite.width
                    tempCanvas.height = sprite.height
                    let tempCtx = tempCanvas.getContext('2d')
                    this.drawFrame(frameData, sprite.width, tempCtx, colorList, sprite.isTransparent, sprite.colorIndex)
                    ctx.drawImage(tempCanvas, xOffset, yOffset)
                }
            })
            // 畫主角（只在 avatarRoomIndex === roomIndex 時畫）
            if (avatarRoomIndex === roomIndex && avatarSprite) {
                let sprite = avatarSprite
                let xOffset = avatarX * sprite.width
                let yOffset = avatarY * sprite.height
                let frameList = sprite.frameList
                let frameData = frameList[0]
                let tempCanvas = document.createElement('canvas')
                tempCanvas.width = sprite.width
                tempCanvas.height = sprite.height
                let tempCtx = tempCanvas.getContext('2d')
                this.drawFrame(frameData, sprite.width, tempCtx, colorList, sprite.isTransparent, sprite.colorIndex)
                ctx.drawImage(tempCanvas, xOffset, yOffset)
            }
        }

        this.moveRooms = (roomIndex, startOfGame) => {
            if (this._isFading) return;
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
            
            // 保存舊房間索引和房間物件，用於執行 on-exit
            let oldRoomIndex = this.currentRoomIndex
            let oldRoom = this.currentRoom
            let oldRoomScript = oldRoom && oldRoom.scriptList && oldRoom.scriptList['on-exit']
            
            // 先切換房間（房間外觀改變）
            if (!startOfGame && oldRoom) {
                let script = oldRoomScript
                // 先判斷 move
                let matchMove = script && script.match(/\{set-effect move\}/)
                if (matchMove) {
                    this._isFading = true
                    this.slideTransition(oldRoomIndex, roomIndex, undefined, () => {
                        this._isFading = false
                        // 房間切換完成後，執行上一個房間的 on-exit，然後執行新房間的 on-enter
                        this._moveRoomsAfterFade(roomIndex, startOfGame, { 
                            oldRoomIndex: oldRoomIndex,
                            oldRoomScript: oldRoomScript
                        })
                    }, 400)
                    return
                }
                // 再判斷 fade
                let matchFade = script && script.match(/\{set-effect fade(?: ([0-9]+))?\}/)
                if (matchFade && this.fade) {
                    let colorIndex = matchFade[1] ? parseInt(matchFade[1]) : 0
                    let palette = this.world.paletteList[this.currentPaletteIndex]
                    let colorList = palette ? palette.colorList : ['#000']
                    let color = colorList[colorIndex] || '#000'
                    this._isFading = true
                    this.fade(color, 400, 'out').then(() => {
                        this._isFading = false
                        // 房間切換完成後，執行上一個房間的 on-exit，然後執行新房間的 on-enter
                        this._moveRoomsAfterFade(roomIndex, startOfGame, { 
                            fadeIn: { color, duration: 400 },
                            oldRoomIndex: oldRoomIndex,
                            oldRoomScript: oldRoomScript
                        })
                    })
                    return
                }
            }
            // 沒有 set-effect，直接切換房間（即使沒有 oldRoom 也要傳遞 oldRoomIndex）
            this._moveRoomsAfterFade(roomIndex, startOfGame, { 
                oldRoomIndex: oldRoomIndex,
                oldRoomScript: oldRoomScript
            })
        }


        this._waitForDialogThenMoveRooms = (roomIndex, startOfGame, opts) => {
            // 先檢查對話框是否已經完成（可能 on-exit 沒有創建對話框，或者對話框立即完成）
            if (!this.dialogNodes || this.dialogNodes.length === 0) {
                // 對話框已完成或不存在，直接執行房間切換
                this._moveRoomsAfterFade(roomIndex, startOfGame, opts)
                return
            }
            
            // 保存原始的回調函數
            let originalOnDialogChange = this.onDialogChange
            let hasMoved = false // 防止重複執行
            
            // 設置一個臨時回調，監聽對話框完成
            this.onDialogChange = (dialogNodes, scriptInfo) => {
                // 調用原始回調
                if (originalOnDialogChange) {
                    originalOnDialogChange(dialogNodes, scriptInfo)
                }
                // 如果對話框已完成（dialogNodes 為空或 null），執行房間切換
                if (!hasMoved && (!dialogNodes || dialogNodes.length === 0)) {
                    hasMoved = true
                    // 恢復原始回調
                    this.onDialogChange = originalOnDialogChange
                    // 執行房間切換
                    this._moveRoomsAfterFade(roomIndex, startOfGame, opts)
                }
            }
        }

        this._moveRoomsAfterFade = (roomIndex, startOfGame, opts) => {
            // update room references
            this.currentRoomIndex = roomIndex
            this.currentRoom = this.world.roomList[this.currentRoomIndex]
            
            // === 跟隨精靈搬移到新房間 ===
            if (this.followerList && this.followerList.length > 0) {
                for (let i = 0; i < this.followerList.length; i++) {
                    let followerName = this.followerList[i];
                    let follower = this.world.spriteList.find(s => s.name === followerName);
                    if (!follower) continue;
                    // 先從所有房間移除該精靈的 tile
                    for (let r of this.world.roomList) {
                        r.tileList = r.tileList.filter(t => t.spriteName !== follower.name);
                    }
                    // 在主角新房間新增 tile，座標與主角相同
                    this.currentRoom.tileList.push({
                        spriteName: follower.name,
                        x: this.avatarX,
                        y: this.avatarY
                    });
                }
            }
            if (!this.currentRoom) { console.warn('currentRoom 不存在'); return }
            this.currentPaletteIndex = this.world.paletteList.findIndex(p => p.name === this.currentRoom.paletteName)

            // play new music
            this.updateMusic()

            // cache new sprites
            this.updateCache()

            // 如果有 fadeIn 參數，這裡淡入
            if (opts && opts.fadeIn && this.fade) {
                this.fade(opts.fadeIn.color, opts.fadeIn.duration, 'in')
            }

            // 執行上一個房間的 on-exit（房間已經切換，但執行舊房間的腳本）
            if (!startOfGame && opts && opts.oldRoomIndex !== undefined && opts.oldRoomIndex !== roomIndex) {
                let oldRoom = this.world.roomList[opts.oldRoomIndex]
                // 檢查 oldRoom 是否存在並嘗試執行 on-exit
                if (oldRoom && oldRoom.scriptList) {
                    // 記錄執行前的對話框狀態
                    let dialogNodesBefore = this.dialogNodes ? this.dialogNodes.length : 0
                    // 執行 on-exit 腳本（傳遞 oldRoomIndex 以便正確顯示房間名稱）
                    let hadDialog = this.runScript(oldRoom.scriptList, 'on-exit', { roomIndex: opts.oldRoomIndex })
                    // 檢查對話框是否有變化（即使 runScript 返回 false，也可能創建了新對話）
                    let dialogNodesAfter = this.dialogNodes ? this.dialogNodes.length : 0
                    let dialogChanged = dialogNodesAfter !== dialogNodesBefore || (this.lastDialogScriptInfo && this.lastDialogScriptInfo.eventName === 'on-exit')
                    // 如果有對話框變化，等待完成後再執行 on-enter
                    if (dialogChanged && dialogNodesAfter > 0) {
                        this._waitForDialogThenRunOnEnter(roomIndex, startOfGame)
                        return
                    }
                    // 如果沒有對話框，繼續執行 on-enter（不 return）
                }
            }

            // run enter script for new room
            if (!startOfGame) {
                this.runScript(this.currentRoom.scriptList, 'on-enter', { roomIndex: this.currentRoomIndex })
            }
            // 不再呼叫主循環，由 moveRooms 呼叫
        }

        this._waitForDialogThenRunOnEnter = (roomIndex, startOfGame) => {
            // 先檢查對話框是否已經完成
            if (!this.dialogNodes || this.dialogNodes.length === 0) {
                // 對話框已完成或不存在，直接執行 on-enter
                this.runScript(this.currentRoom.scriptList, 'on-enter', { roomIndex: this.currentRoomIndex })
                return
            }
            
            // 保存原始的回調函數
            let originalOnDialogChange = this.onDialogChange
            let hasRun = false // 防止重複執行
            
            // 設置一個臨時回調，監聽對話框完成
            this.onDialogChange = (dialogNodes, scriptInfo) => {
                // 調用原始回調
                if (originalOnDialogChange) {
                    originalOnDialogChange(dialogNodes, scriptInfo)
                }
                // 如果對話框已完成（dialogNodes 為空或 null），執行 on-enter
                if (!hasRun && (!dialogNodes || dialogNodes.length === 0)) {
                    hasRun = true
                    // 恢復原始回調
                    this.onDialogChange = originalOnDialogChange
                    // 執行 on-enter
                    this.runScript(this.currentRoom.scriptList, 'on-enter', { roomIndex: this.currentRoomIndex })
                }
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

        this.runScript = (scriptList, scriptName, context, appendDialog = false) => {
            // ignore non-existent scripts
            if (!scriptList || !scriptList[scriptName]) return false

            // get script
            let script = scriptList[scriptName]

            // 記錄本次觸發的script原文與來源
            this.lastDialogScriptInfo = {
                script,
                sourceType: (context && context.sprite) ? 'sprite' : (context && context.roomIndex !== undefined) ? 'room' : 'world',
                eventName: scriptName,
                context: context
            }

            // 記錄執行前的對話框狀態
            let hadDialogBefore = this.dialogNodes && this.dialogNodes.length > 0

            // 如果使用追加模式，在 context 中標記
            if (appendDialog && context) {
                context._appendDialog = true
            }

            // run script
            Script.run(script, this, context)

            // 檢查是否創建了新對話框
            let hasDialogAfter = this.dialogNodes && this.dialogNodes.length > 0
            return hasDialogAfter && (!hadDialogBefore || appendDialog)
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
                    ? (pixel === 1 ? colorList[Math.min(colorIndex, colorList.length - 1)] : colorList[0])
                    : (colorList[Math.min(pixel, colorList.length - 1)] || '#000');
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
            if (this._isFading) return;
            let { spriteWidth, spriteHeight } = this.world
            let name = this.avatar.name
            
            // 只有在沒有使用方向精靈時才進行自動翻轉
            if (!this.useDirectionSprites && this.avatarDirection === 'left') {
                name += '__flipped'
            }

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
            // 只有在非對話狀態下才鎖定玩家操作
            if (window._mosiLockInput && (!this.dialogNodes || this.dialogNodes.length === 0)) return;
            if (e.key.startsWith('Arrow') || ['w', 'a', 's', 'd'].includes(e.key)) e.preventDefault() // prevent arrow keys from scrolling page
            if (e.repeat) return // ignore key repeats
            if (e.key === 'm') {
                window.muteMusic = !window.muteMusic
            }
            else if (this.dialogNodes.length > 0) {
                if (window._mosiChoiceActive) return;
                if (window._mosiChoiceJustEnded) {
                    window._mosiChoiceJustEnded = false;
                    this.progressDialog();
                    return;
                }
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
            if (window._mosiLockInput && (!this.dialogNodes || this.dialogNodes.length === 0)) return;
            this.keyCodes = this.keyCodes.filter(keyCode => keyCode !== e.key)
            if (this.keyCodes.length === 0) this.keyActive = false
        }

        this.pointerStart = (e) => {
            if (window._mosiLockInput && (!this.dialogNodes || this.dialogNodes.length === 0)) return;
            if (window._mosiChoiceActive) return;
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
            if (window._mosiChoiceActive) return;
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
            if (window._mosiLockInput && (!this.dialogNodes || this.dialogNodes.length === 0)) return;
            if (window._mosiChoiceActive) return;
            if (this.pointerIsDown) {
                e.preventDefault();
                this.pointerIsDown = false;
                if (this.dialogNodes.length > 0) {
                    if (window._mosiChoiceJustEnded) {
                        window._mosiChoiceJustEnded = false;
                        this.progressDialog();
                        return;
                    }
                    this.progressDialog();
                } else {
                    if (this.movesSinceLastTouch === 0) {
                        this.oneMoreMove = true;
                        this.timeToNextInput = 0;
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

        // === 新增：淡入淡出 overlay ===
        this.fadeOverlay = document.createElement('div')
        this.fadeOverlay.style.position = 'absolute'
        this.fadeOverlay.style.top = '0'
        this.fadeOverlay.style.left = '0'
        this.fadeOverlay.style.width = '100%'
        this.fadeOverlay.style.height = '100%'
        this.fadeOverlay.style.pointerEvents = 'none'
        this.fadeOverlay.style.opacity = '0'
        this.fadeOverlay.style.transition = ''
        this.fadeOverlay.style.zIndex = '99'
        this.wrapper.appendChild(this.fadeOverlay)

        // === 新增：淡入淡出動畫函式 ===
        // === 動畫防重複 flag ===
        this._fadeTicking = false;
        this._slidePicTicking = false;
        this._slideTicking = false;
        this.fade = (color, duration = 400, direction = 'out') => {
            return new Promise(resolve => {
                if (this._fadeTicking) return;
                this._fadeTicking = true;
                this.fadeOverlay.style.background = color
                this.fadeOverlay.style.transition = ''
                // 幀數變多，動畫更細膩
                let steps = Math.max(2, Math.round(duration / (this.frameRate / 3)))
                let current = (direction === 'out') ? 0 : 1
                let target = (direction === 'out') ? 1 : 0
                let step = (target - current) / steps
                let frame = 0
                this.fadeOverlay.style.opacity = current
                let tick = () => {
                    frame++
                    current += step
                    this.fadeOverlay.style.opacity = Math.max(0, Math.min(1, current))
                    if (frame < steps) {
                        setTimeout(tick, duration / steps)
                    } else {
                        this.fadeOverlay.style.opacity = target
                        if (direction === 'in') {
                            this.fadeOverlay.style.background = ''
                        }
                        this._fadeTicking = false;
                        resolve()
                    }
                }
                tick()
            })
        }

        // === 新增：插圖滑動切換動畫 ===
        this.slidePictureTransition = (fromPicName, toPicName, duration = 400, callback, direction) => {
            if (this._slidePicTicking) return;
            this._slidePicTicking = true;
            let fromPic = this.world.graphicList.find(g => g.name === fromPicName && g.type === 'picture')
            let toPic = this.world.graphicList.find(g => g.name === toPicName && g.type === 'picture')
            if (!fromPic || !toPic) { this._slidePicTicking = false; callback && callback(); return }
            let w = this.canvas.width
            let h = this.canvas.height
            let fromCanvas = document.createElement('canvas')
            fromCanvas.width = w; fromCanvas.height = h
            let fromCtx = fromCanvas.getContext('2d')
            // 畫 fromPic
            this.drawPictureToContext(fromPic, fromCtx, w, h)
            let toCanvas = document.createElement('canvas')
            toCanvas.width = w; toCanvas.height = h
            let toCtx = toCanvas.getContext('2d')
            // 畫 toPic
            this.drawPictureToContext(toPic, toCtx, w, h)
            let start = null
            let animate = (timestamp) => {
                if (!start) start = timestamp
                let t = Math.min(1, (timestamp - start) / duration)
                let offsetX = 0, offsetY = 0
                if (direction === 'right') {
                    offsetX = -t * w
                } else if (direction === 'left') {
                    offsetX = t * w
                } else if (direction === 'down') {
                    offsetY = -t * h
                } else if (direction === 'up') {
                    offsetY = t * h
                }
                this.context.clearRect(0, 0, w, h)
                this.context.drawImage(fromCanvas, offsetX, offsetY)
                if (direction === 'right') {
                    this.context.drawImage(toCanvas, offsetX + w, offsetY)
                } else if (direction === 'left') {
                    this.context.drawImage(toCanvas, offsetX - w, offsetY)
                } else if (direction === 'down') {
                    this.context.drawImage(toCanvas, offsetX, offsetY + h)
                } else if (direction === 'up') {
                    this.context.drawImage(toCanvas, offsetX, offsetY - h)
                }
                if (t < 1) {
                    requestAnimationFrame(animate)
                } else {
                    this._slidePicTicking = false;
                    callback && callback()
                }
            }
            requestAnimationFrame(animate)
        }
        // 輔助：畫插圖到 context
        this.drawPictureToContext = (graphic, ctx, cWidth, cHeight) => {
            if (!graphic || !graphic.frameList || !graphic.frameList.length) return
            let frame = graphic.frameList[0]
            let gWidth = graphic.width
            let gHeight = graphic.height
            let scale = Math.min(cWidth / gWidth, cHeight / gHeight)
            let drawW = gWidth * scale
            let drawH = gHeight * scale
            let offsetX = (cWidth - drawW) / 2
            let offsetY = (cHeight - drawH) / 2
            let tempCanvas = document.createElement('canvas')
            tempCanvas.width = gWidth
            tempCanvas.height = gHeight
            let tempCtx = tempCanvas.getContext('2d')
            let palette = this.world.paletteList.find(p => p.name === graphic.paletteName) || this.world.paletteList[this.currentPaletteIndex]
            let colorList = palette ? palette.colorList : ['#000']
            this.drawFrame(frame, gWidth, tempCtx, colorList, graphic.isTransparent, graphic.colorIndex)
            ctx.drawImage(tempCanvas, offsetX, offsetY, drawW, drawH)
        }

        // === cross-fade 插圖動畫（逐幀 steps 控制） ===
        this.crossFadePicture = (fromPicName, toPicName, duration = 400, callback) => {
            if (this._fadeTicking) return;
            this._fadeTicking = true;
            let w = this.canvas.width, h = this.canvas.height;
            let fromPic = fromPicName ? this.world.graphicList.find(g => g.name === fromPicName && g.type === 'picture') : null;
            let toPic = toPicName ? this.world.graphicList.find(g => g.name === toPicName && g.type === 'picture') : null;
            let fromCanvas = document.createElement('canvas');
            fromCanvas.width = w; fromCanvas.height = h;
            let fromCtx = fromCanvas.getContext('2d');
            fromCtx.clearRect(0, 0, w, h);
            if (fromPic) this.drawPictureToContext(fromPic, fromCtx, w, h);
            let toCanvas = document.createElement('canvas');
            toCanvas.width = w; toCanvas.height = h;
            let toCtx = toCanvas.getContext('2d');
            toCtx.clearRect(0, 0, w, h);
            if (toPic) this.drawPictureToContext(toPic, toCtx, w, h);
            let steps = Math.max(2, Math.round(duration / (this.frameRate / 3)));
            let current = 0, step = 1 / steps, frame = 0;
            let tick = () => {
                frame++;
                this.context.clearRect(0, 0, w, h);
                if (fromPic) {
                    this.context.globalAlpha = 1 - current;
                    this.context.drawImage(fromCanvas, 0, 0);
                }
                if (toPic) {
                    this.context.globalAlpha = current;
                    this.context.drawImage(toCanvas, 0, 0);
                }
                this.context.globalAlpha = 1;
                current += step;
                if (frame < steps) setTimeout(tick, duration / steps);
                else { this._fadeTicking = false; callback && callback(); }
            };
            tick();
        };

        // === cross-fade 房間動畫（逐幀 steps 控制） ===
        this.crossFadeRooms = (fromRoomIndex, toRoomIndex, duration = 400, callback) => {
            if (this._fadeTicking) return;
            this._fadeTicking = true;
            let w = this.canvas.width, h = this.canvas.height;
            let fromRoom = this.world.roomList[fromRoomIndex];
            let toRoom = this.world.roomList[toRoomIndex];
            let paletteFrom = this.world.paletteList.find(p => p.name === fromRoom.paletteName) || this.world.paletteList[this.currentPaletteIndex];
            let paletteTo = this.world.paletteList.find(p => p.name === toRoom.paletteName) || this.world.paletteList[this.currentPaletteIndex];
            let colorFrom = paletteFrom ? paletteFrom.colorList[0] : '#000';
            let colorTo = paletteTo ? paletteTo.colorList[0] : '#000';
            let fromCanvas = document.createElement('canvas');
            fromCanvas.width = w; fromCanvas.height = h;
            let fromCtx = fromCanvas.getContext('2d');
            fromCtx.fillStyle = colorFrom;
            fromCtx.fillRect(0, 0, w, h);
            this.drawRoomToContext(fromRoom, fromCtx, paletteFrom.colorList, fromRoomIndex, fromRoomIndex, this.avatarX, this.avatarY, this.avatar);
            let toCanvas = document.createElement('canvas');
            toCanvas.width = w; toCanvas.height = h;
            let toCtx = toCanvas.getContext('2d');
            toCtx.fillStyle = colorTo;
            toCtx.fillRect(0, 0, w, h);
            this.drawRoomToContext(toRoom, toCtx, paletteTo.colorList, toRoomIndex, toRoomIndex, this.nextX, this.nextY, this.avatar);
            let steps = Math.max(2, Math.round(duration / (this.frameRate / 3)));
            let current = 0, step = 1 / steps, frame = 0;
            let tick = () => {
                frame++;
                this.context.fillStyle = colorFrom;
                this.context.fillRect(0, 0, w, h);
                this.context.globalAlpha = 1 - current;
                this.context.drawImage(fromCanvas, 0, 0);
                this.context.globalAlpha = current;
                this.context.drawImage(toCanvas, 0, 0);
                this.context.globalAlpha = 1;
                current += step;
                if (frame < steps) setTimeout(tick, duration / steps);
                else { this._fadeTicking = false; callback && callback(); }
            };
            tick();
        };

        // === 儲存/載入遊戲進度 ===
        this.exportState = () => {
            // 只導出進度與變動資料，不含靜態素材
            return JSON.stringify({
                avatarX: this.avatarX,
                avatarY: this.avatarY,
                avatarDirection: this.avatarDirection,
                currentRoomIndex: this.currentRoomIndex,
                inventory: this.inventory,
                variables: this.variables,
                followerList: this.followerList,
                followerTrail: this.followerTrail,
                // 房間內 tileList 只存有變動的（如道具被撿走、門被打開等）
                roomStates: this.world.roomList.map(room => ({
                    tileList: room.tileList.map(tile => ({...tile})),
                    paletteName: room.paletteName,
                    musicName: room.musicName
                })),
                // 存儲插圖的動態調色盤和音樂
                graphicStates: this.world.graphicList
                    .filter(g => g.type === 'picture')
                    .map(g => ({
                        name: g.name,
                        paletteName: g.paletteName,
                        musicName: g.musicName
                    })),
                // 當前插圖狀態
                currentPicture: this.currentPicture,
                currentPicturePalette: this.currentPicturePalette,
                currentPictureMusic: this.currentPictureMusic
            });
        }

        this.importState = (json) => {
            try {
                const data = typeof json === 'string' ? JSON.parse(json) : json;
                // 先保存目標房間索引和位置（不要立即設定 currentRoomIndex）
                const targetRoomIndex = data.currentRoomIndex;
                const targetX = data.avatarX;
                const targetY = data.avatarY;
                
                // 還原其他狀態
                this.avatarDirection = data.avatarDirection || 'front';
                this.inventory = data.inventory || {};
                this.variables = data.variables || {};
                this.followerList = data.followerList || [];
                this.followerTrail = data.followerTrail || [];
                
                // 還原房間 tileList 和動態調色盤/音樂
                if (Array.isArray(data.roomStates)) {
                    data.roomStates.forEach((roomState, i) => {
                        if (this.world.roomList[i] && roomState && Array.isArray(roomState.tileList)) {
                            this.world.roomList[i].tileList = roomState.tileList.map(tile => ({...tile}));
                            // 還原房間的動態調色盤和音樂
                            if (roomState.paletteName !== undefined) {
                                this.world.roomList[i].paletteName = roomState.paletteName;
                            }
                            if (roomState.musicName !== undefined) {
                                this.world.roomList[i].musicName = roomState.musicName;
                            }
                        }
                    });
                }
                
                // 還原插圖的動態調色盤和音樂
                if (Array.isArray(data.graphicStates)) {
                    data.graphicStates.forEach(graphicState => {
                        let graphic = this.world.graphicList.find(g => g.name === graphicState.name && g.type === 'picture');
                        if (graphic) {
                            if (graphicState.paletteName !== undefined) {
                                graphic.paletteName = graphicState.paletteName;
                            }
                            if (graphicState.musicName !== undefined) {
                                graphic.musicName = graphicState.musicName;
                            }
                        }
                    });
                }
                
                // 還原當前插圖狀態
                if (data.currentPicture !== undefined) {
                    this.currentPicture = data.currentPicture;
                }
                if (data.currentPicturePalette !== undefined) {
                    this.currentPicturePalette = data.currentPicturePalette;
                }
                if (data.currentPictureMusic !== undefined) {
                    this.currentPictureMusic = data.currentPictureMusic;
                }
                
                // 如果目標房間與當前房間不同，先切換房間（此時 currentRoomIndex 還是舊值）
                if (targetRoomIndex !== this.currentRoomIndex) {
                    this.moveRooms(targetRoomIndex, true);
                }
                
                // 設定玩家位置（確保在房間切換後設定）
                this.avatarX = targetX;
                this.avatarY = targetY;
                this.nextX = targetX;
                this.nextY = targetY;
                this.nextRoomIndex = targetRoomIndex;
                
                // 強制更新緩存和渲染
                this.updateCache();
                // 使用 requestAnimationFrame 確保畫面更新
                if (this.update) {
                    requestAnimationFrame((timestamp) => {
                        this.update(timestamp);
                    });
                }
                
                // 觸發變量更新回調，讓面板同步更新
                if (this.onVariablesChange) {
                    this.onVariablesChange(this.variables);
                }
                // 觸發物品欄更新回調
                if (this.onInventoryChange) {
                    this.onInventoryChange(this.inventory);
                }
            } catch (e) {
                console.error('載入存檔失敗', e);
            }
        }

        // === 全域滑動動畫 API ===
        this.slideTransition = (fromRoomIndex, toRoomIndex, direction, callback, duration = 400) => {
            if (this._slideTicking) return;
            this._slideTicking = true;
            // direction 可選，若未指定則自動判斷
            let fromRoom = this.world.roomList[fromRoomIndex]
            let toRoom = this.world.roomList[toRoomIndex]
            let paletteFrom = this.world.paletteList[this.world.roomList[fromRoomIndex].paletteName ? this.world.paletteList.findIndex(p => p.name === this.world.roomList[fromRoomIndex].paletteName) : this.currentPaletteIndex]
            let paletteTo = this.world.paletteList[this.world.roomList[toRoomIndex].paletteName ? this.world.paletteList.findIndex(p => p.name === this.world.roomList[toRoomIndex].paletteName) : this.currentPaletteIndex]
            let colorListFrom = paletteFrom ? paletteFrom.colorList : ['#000']
            let colorListTo = paletteTo ? paletteTo.colorList : ['#000']
            let w = this.canvas.width
            let h = this.canvas.height
            let fromCanvas = document.createElement('canvas')
            fromCanvas.width = w; fromCanvas.height = h
            let fromCtx = fromCanvas.getContext('2d')
            this.drawRoomToContext(fromRoom, fromCtx, colorListFrom, fromRoomIndex, fromRoomIndex, this.avatarX, this.avatarY, this.avatar)
            let toCanvas = document.createElement('canvas')
            toCanvas.width = w; toCanvas.height = h
            let toCtx = toCanvas.getContext('2d')
            this.drawRoomToContext(toRoom, toCtx, colorListTo, toRoomIndex, toRoomIndex, this.nextX, this.nextY, this.avatar)
            let worldW = this.world.worldWidth
            let dx = (toRoomIndex % worldW) - (fromRoomIndex % worldW)
            let dy = Math.floor(toRoomIndex / worldW) - Math.floor(fromRoomIndex / worldW)
            let dir = direction
            if (!dir) {
                if (Math.abs(dx) > Math.abs(dy)) {
                    dir = dx > 0 ? 'right' : 'left'
                } else {
                    dir = dy > 0 ? 'down' : 'up'
                }
            }
            let animDuration = duration || 400;
            let start = null
            let animate = (timestamp) => {
                if (!start) start = timestamp
                let t = Math.min(1, (timestamp - start) / animDuration)
                let offsetX = 0, offsetY = 0
                if (dir === 'right') {
                    offsetX = -t * w
                } else if (dir === 'left') {
                    offsetX = t * w
                } else if (dir === 'down') {
                    offsetY = -t * h
                } else if (dir === 'up') {
                    offsetY = t * h
                }
                this.context.clearRect(0, 0, w, h)
                this.context.drawImage(fromCanvas, offsetX, offsetY)
                if (dir === 'right') {
                    this.context.drawImage(toCanvas, offsetX + w, offsetY)
                } else if (dir === 'left') {
                    this.context.drawImage(toCanvas, offsetX - w, offsetY)
                } else if (dir === 'down') {
                    this.context.drawImage(toCanvas, offsetX, offsetY + h)
                } else if (dir === 'up') {
                    this.context.drawImage(toCanvas, offsetX, offsetY - h)
                }
                if (t < 1) {
                    requestAnimationFrame(animate)
                } else {
                    this._slideTicking = false;
                    if (typeof callback === 'function') callback()
                }
            }
            requestAnimationFrame(animate)
        }
    }

}
`

let generateGameScript = new Function(gameScript)
let Game = generateGameScript()
