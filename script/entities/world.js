let World = {

    create: ({ worldWidth, worldHeight, roomWidth, roomHeight, spriteWidth, spriteHeight, randomStart }) => {
        let world = {
            version: VERSION,
            
            currentSpriteIndex: 0,
            spriteList: [],
            spriteWidth,
            spriteHeight,

            currentRoomIndex: 0,
            roomList: [],
            roomWidth,
            roomHeight,

            worldWidth,
            worldHeight,
            worldName: '新的世界',
            worldWrapHorizontal: false,
            worldWrapVertical: false,
            worldScriptList: {
                'on-start': '{position fullscreen}{world-name}{/position}'
            },

            currentPaletteIndex: 0,
            paletteList: [],

            currentMusicIndex: 0,
            musicList: [],

            fontResolution: 1,
            fontDirection: 'ltr',
            fontData: Font.parse(BOUTIQUE_BITMAP_7X7),
            textScale: 2, // 文字比例設定，預設為x2

            modList: [],

            inventory: {},
            variables: {},

            // 主體顏色設定
            mainPaletteIndex: 0,
            mainBgColorIndex: 1,
            mainTextColorIndex: 0
        }

        // create avatar
        world.spriteList.push(World.createAvatar(spriteWidth, spriteHeight))

        // create initial palette
        world.paletteList.push(Palette.create({}))

        // create initial music
        world.musicList.push(Music.create({ randomStart: true }))
 
        // initialize room list
        let defaultPaletteName = world.paletteList[0].name
        let defaultMusicName = world.musicList[0].name
        world.roomList = Array(worldWidth * worldHeight).fill(0).map((_, i) => {
            let x = Math.floor(i % worldWidth)
            let y = Math.floor(i / worldWidth)
            return Room.create(x, y, defaultPaletteName, defaultMusicName)
        })

        // place random tiles throughout world
        if (randomStart) {
            world.spriteList.push(Sprite.create({
                name: 'floor',
                spriteWidth,
                spriteHeight,
                randomStart: true
            }))
            world.spriteList.push(Sprite.create({
                name: 'wall',
                isWall: true,
                spriteWidth,
                spriteHeight,
                randomStart: true
            }))
            world.spriteList.push(Sprite.create({
                name: 'item',
                isItem: true,
                spriteWidth,
                spriteHeight,
                onPush: '你撿起了{item-count {sprite-name}}個{sprite-name}！',
                randomStart: true
            }))
            world.roomList.forEach(room => {
                room.tileList = Room.randomTileList(roomWidth, roomHeight, world.spriteList)
            })
        }

        // place avatar
        world.roomList[0].tileList.push({
            spriteName: 'avatar',
            x: 0,
            y: 0
        })

        world.variables = upgradeVariables(world.variables)

        return world
    },

    createAvatar: (spriteWidth, spriteHeight) => {
        let avatar = Sprite.create({
            name: 'avatar',
            isAvatar: true,
            spriteWidth,
            spriteHeight,
            randomStart: true
        })

        if (spriteWidth === 8 && spriteHeight === 8) {
            avatar.frameList = [
                [0,0,0,0,1,0,0,1,0,1,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,0,1,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,0,0,0,0,1,0,0,1,0,0],
                [0,0,0,0,1,0,0,1,1,0,0,0,1,1,1,1,0,1,0,0,1,1,1,1,0,1,0,0,1,1,1,1,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,1,0,1,0,0,1,0]
            ]
        }

        return avatar
    },

    random: (that, world) => {
        let { roomWidth, roomHeight, spriteList, paletteList } = world
        let roomList = world.roomList.slice()
        roomList.forEach(room => {
            room.tileList = Room.randomTileList(roomWidth, roomHeight, spriteList)
            let paletteIndex = Math.floor(Math.random() * paletteList.length)
            let paletteName = paletteList[paletteIndex].name
            room.paletteName = paletteName
        })
        that.setState({ roomList: roomList })
    },

    clear: (that, world, passthrough) => {
        let { worldWidth, worldHeight, paletteList, musicList } = world
        let defaultPaletteName = paletteList[0].name
        let defaultMusicName = musicList[0].name
        let roomList = Array(worldWidth * worldHeight).fill(0).map((_, i) => {
            let x = Math.floor(i % worldWidth) + 1
            let y = Math.floor(i / worldWidth) + 1
            return Room.create(x, y, defaultPaletteName, defaultMusicName)
        })
        
        if (passthrough) return roomList

        that.setState({ roomList: roomList})
    },

    reset: (that) => {
        let newWorld = World.create({
            worldWidth: 3,
            worldHeight: 3,
            roomWidth: 12,
            roomHeight: 12,
            spriteWidth: 8,
            spriteHeight: 8,
            randomStart: true
        })
        that.setState(newWorld)
        newWorld.variables = upgradeVariables(newWorld.variables)
    },
    
    rename: (that, newName) => {
        that.setState({ worldName: newName })
    },

    resize: (that, world, props) => {
        let { roomList, spriteList, paletteList, musicList } = world
        let { worldWidth, worldHeight, roomWidth, roomHeight, spriteWidth, spriteHeight } = props

        let worldResized = world.worldWidth !== worldWidth || world.worldHeight !== worldHeight
        let roomResized = world.roomWidth !== roomWidth || world.roomHeight !== roomHeight
        let spriteResized = world.spriteWidth !== spriteWidth || world.spriteHeight !== spriteHeight

        if (worldResized) {
            let oldWidth = world.worldWidth
            let oldHeight = world.worldHeight
            let newRoomList = Array(worldWidth * worldHeight).fill(0).map((_, i) => {
                let x = Math.floor(i % worldWidth)
                let y = Math.floor(i / worldWidth)
                if (x < oldWidth && y < oldHeight) {
                    return roomList[y * oldWidth + x]
                } else {
                    return Room.create(x, y, paletteList[0].name, musicList[0].name)
                }
            })
            roomList = newRoomList
        }

        if (roomResized) {
            roomList = roomList.slice()
            roomList.forEach(room => Room.resize(room, roomWidth, roomHeight))
        }

        if (spriteResized) {
            spriteList = spriteList.slice()
            spriteList.forEach(sprite => Sprite.resize(sprite, spriteWidth, spriteHeight))
        }

        let currentRoomIndex = 0

        that.setState({
            roomList,
            spriteList,
            worldWidth, worldHeight,
            roomWidth, roomHeight,
            spriteWidth, spriteHeight,
            currentRoomIndex
        })
    },

    import: (that, worldData) => {
        try {
            // extract data from html
            if (typeof worldData === 'string' && worldData.indexOf('<!DOCTYPE html>') >= 0) {
                worldData = worldData.substring(worldData.indexOf('window.GAME_DATA = ')).replace('window.GAME_DATA = ', '')
                worldData = worldData.substring(0, worldData.indexOf('</script>'))
            }

            // parse data
            let world = typeof worldData === 'string' ? JSON.parse(worldData) : worldData

            // remove UI overlay state if present
            delete world.showIconListOverlay
            delete world.showEditSpritesOverlay
            delete world.showCustomGroupOverlay
            delete world.showConfigureGroupOverlay
            delete world.groupToConfigure
            delete world.spriteListCategory
            delete world.selectedCustomGroupSpriteNames
            // 刪除 avatar/選擇/座標等暫存欄位
            delete world.selectedSpriteName
            delete world.avatarX
            delete world.avatarY
            delete world.avatarDirection

            // create at least one sprite
            if (!world.spriteList || world.spriteList.length < 1) {
                world.spriteList = []
                world.spriteList.push(World.createAvatar(spriteWidth, spriteHeight))
            }

            // create at least one palette
            if (!world.paletteList || world.paletteList.length < 1) {
                world.paletteList = []
                world.paletteList.push(Palette.create({}))
            }

            // create at least one music
            if (!world.musicList || world.musicList.length < 1) {
                world.musicList = []
                world.musicList.push(Music.create({ randomStart: true }))
            }

            // init world scripts
            if (!world.worldScriptList) {
                world.worldScriptList = {
                    'on-start': ''
                }
            }

            // init room scripts and regularize room names
            world.roomList.forEach(room => {
                if (!room.scriptList) {
                    room.scriptList = {
                        'on-enter': '',
                        'on-exit': ''
                    }
                }
            })

            // init sprite scripts and regularize sprite names
            world.spriteList.forEach(sprite => {
                if (!sprite.scriptList) {
                    sprite.scriptList = {
                        'on-push': '',
                        'on-message': ''
                    }
                }
                // 舊版相容：將 frameList 中的 1 轉為 colorIndex，然後移除 colorIndex
                if (typeof sprite.colorIndex === 'number' && sprite.frameList && Array.isArray(sprite.frameList)) {
                    sprite.frameList = sprite.frameList.map(frame =>
                        frame.map(v => v === 1 ? sprite.colorIndex : v)
                    )
                    delete sprite.colorIndex
                }
            })

            // init fonts
            if (!world.fontResolution) world.fontResolution = 4
            if (!world.fontDirection) world.fontDirection = 'ltr'
            if (!world.fontData) world.fontData = Font.parse(BOUTIQUE_BITMAP_7X7)
            if (!world.textScale) world.textScale = 2 // 初始化文字比例設定

            // 初始化主體顏色設定
            if (typeof world.mainPaletteIndex === 'undefined') world.mainPaletteIndex = 0
            if (typeof world.mainBgColorIndex === 'undefined') world.mainBgColorIndex = 1
            if (typeof world.mainTextColorIndex === 'undefined') world.mainTextColorIndex = 0

            // 過濾舊版數據結構
            delete world.themeTextColor
            delete world.themeBackgroundColor

            // set version
            world.version = VERSION

            // 補齊 inventory/variables
            if (!world.inventory) {
                world.inventory = {}
                if (world.spriteList) {
                    world.spriteList.forEach(s => { if (s.isItem) world.inventory[s.name] = 0 })
                }
            }
            if (!world.variables) world.variables = {}

            world.variables = upgradeVariables(world.variables)

            that.updateWorld(world)
            return world
        }
        catch (e) {
            console.error('無法導入世界！', e)
            that.setState({ showErrorOverlay: true, errorMessage: '無法導入世界！' })
            return null
        }
    },

    export: (world) => {
        world = deepClone(world)
        // 處理所有精靈：單色自動補 colorIndex，相容舊格式
        if (Array.isArray(world.spriteList)) {
            world.spriteList.forEach(sprite => {
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
            })
        }
        // remove editor state
        delete world.currentTab
        delete world.tabVisibility
        delete world.tabHistory
        delete world.scriptTabType
        delete world.oneTabMode
        delete world.showErrorOverlay
        delete world.errorMessage
        // remove UI overlay state
        delete world.showIconListOverlay
        delete world.showEditSpritesOverlay
        delete world.showCustomGroupOverlay
        delete world.showConfigureGroupOverlay
        delete world.groupToConfigure
        delete world.spriteListCategory
        delete world.selectedCustomGroupSpriteNames

        // 過濾舊版數據結構
        delete world.themeTextColor
        delete world.themeBackgroundColor
        // 刪除 3D/顯示相關不必要欄位
        delete world.threeDSettings
        delete world.dialogBoxAtTop
        delete world.camera
        delete world.game
        // 刪除 avatar/選擇/座標等暫存欄位
        delete world.selectedSpriteName
        delete world.avatarX
        delete world.avatarY
        delete world.avatarDirection

        let worldData = JSON.stringify(world)
        return worldData
    },

    setWrapHorizontal: (that, newValue) => {
        that.setState({ worldWrapHorizontal: newValue })
    },

    setWrapVertical: (that, newValue) => {
        that.setState({ worldWrapVertical: newValue })
    },

    setMainPaletteIndex: (that, newValue) => {
        that.setState({ mainPaletteIndex: newValue })
    },

    setMainBgColorIndex: (that, newValue) => {
        that.setState({ mainBgColorIndex: newValue })
    },

    setMainTextColorIndex: (that, newValue) => {
        that.setState({ mainTextColorIndex: newValue })
    },

    updateScript: (that, _, event, script) => {
        if (!event) return
        let worldScriptList = that.state.worldScriptList
        worldScriptList[event] = script
        that.setState({ worldScriptList })
    }

}

function upgradeVariables(vars) {
    let upgraded = {}
    for (let k in vars) {
        let v = vars[k]
        if (typeof v === 'object' && v !== null && 'value' in v && 'type' in v) {
            upgraded[k] = v
        } else {
            upgraded[k] = { value: v, type: typeof v === 'boolean' ? 'boolean' : 'number' }
        }
    }
    return upgraded
}
