let scriptorium = {
    '對話': [
        {
            name: '換行符',
            text: '{b}',
            args: []
        },
        {
            name: '分頁符',
            text: '{p}',
            args: []
        },
        {
            name: '波浪文字',
            text: '{wavy}{/wavy}',
            args: []
        },
        {
            name: '抖動文字',
            text: '{shaky}{/shaky}',
            args: []
        },
        {
            name: '彩色文字',
            text: '{color ?}{/color}',
            args: ['color']
        },
        {
            name: '對話框位置',
            text: '{position ?}{/position}',
            args: ['dialog-position']
        },
        {
            name: '延遲',
            text: '{delay ?}',
            args: ['num']
        }
    ],
    '世界': [
        {
            name: '世界名稱',
            text: '{world-name}',
            args: []
        }
    ],
    '主角': [
        {
            name: '主角名稱',
            text: '{avatar-name}',
            args: []
        },
        {
            name: '主角x座標（橫軸）',
            text: '{avatar-x}',
            args: []
        },
        {
            name: '主角y座標（縱軸）',
            text: '{avatar-y}',
            args: []
        },
        {
            name: '移動主角',
            text: '{move-avatar ?}',
            args: ['room', 'x', 'y']
        },
        {
            name: '轉換主角外觀（精靈）',
            text: '{transform-avatar ?}',
            args: ['sprite']
        }
    ],
    '精靈': [
        {
            name: '精靈名稱',
            text: '{sprite-name}',
            args: [],
            spriteOnly: true
        },
        {
            name: '該精靈所在的房間名稱',
            text: '{sprite-room}',
            args: [],
        },
        {
            name: '精靈x座標（橫軸）',
            text: '{sprite-x}',
            args: [],
            spriteOnly: true
        },
        {
            name: '精靈y座標（縱軸）',
            text: '{sprite-y}',
            args: [],
            spriteOnly: true
        },
        {
            name: '精靈是牆嗎?',
            text: '{sprite-wall}',
            args: [],
            spriteOnly: true
        },
        {
            name: '精靈是道具嗎?',
            text: '{sprite-item}',
            args: [],
            spriteOnly: true
        },
        {
            name: '移動精靈',
            text: '{move-sprite ?}',
            args: ['room', 'x', 'y'],
            spriteOnly: true
        },
        {
            name: '放置新的精靈',
            text: '{place-sprite ?}',
            args: ['sprite', 'room', 'x', 'y']
        },
        {
            name: '轉換精靈至另一個精靈',
            text: '{transform-sprite ?}',
            args: ['sprite'],
            spriteOnly: true
        },
        {
            name: '移除精靈',
            text: '{remove-sprite}',
            args: [],
            spriteOnly: true
        },
        {
            name: '設置精靈顏色',
            text: '{set-sprite-color ?}',
            args: ['color'],
            spriteOnly: true
        },
        {
            name: '設置精靈是否為牆',
            text: '{set-sprite-wall ?}',
            args: ['bool'],
            spriteOnly: true
        },
        {
            name: '設置精靈是否為道具',
            text: '{set-sprite-item ?}',
            args: ['bool'],
            spriteOnly: true
        }
    ],
    '房間': [
        {
            name: '當前房間名稱',
            text: '{room-name}',
            args: []
        },
        {
            name: '該位置是否為空',
            text: '{empty ?}',
            args: ['x', 'y']
        },
        {
            name: '設置房間配色',
            text: '{set-palette ?}',
            args: ['room', 'palette']
        },
        {
            name: '設置房間音樂',
            text: '{set-music ?}',
            args: ['room', 'music']
        }
    ],
    '算數': [
        {
            name: '添加',
            text: '{add ?}',
            args: ['num', 'num']
        },
        {
            name: '減去',
            text: '{sub ?}',
            args: ['num', 'num']
        },
        {
            name: '相乘',
            text: '{mul ?}',
            args: ['num', 'num']
        },
        {
            name: '除以',
            text: '{div ?}',
            args: ['num', 'num']
        },
        {
            name: '餘數',
            text: '{mod ?}',
            args: ['num', 'num']
        },
        {
            name: '隨機數字',
            text: '{random ?}',
            args: ['num', 'num']
        }
    ],
    '邏輯': [
        {
            name: '如果為真，執行動作',
            text: '{if ?}{/if}',
            args: ['bool']
        },
        {
            name: '相等',
            text: '{eq ?}',
            args: ['str', 'str']
        },
        {
            name: '大於',
            text: '{gt ?}',
            args: ['num', 'num']
        },
        {
            name: '大於等於',
            text: '{gte ?}',
            args: ['num', 'num']
        },
        {
            name: '小於',
            text: '{lt ?}',
            args: ['num', 'num']
        },
        {
            name: '小於等於',
            text: '{lte ?}',
            args: ['num', 'num']
        },
        {
            name: '否（參數為假則為真）',
            text: '{not ?}',
            args: ['bool']
        },
        {
            name: '每個參數都為"真"',
            text: '{all-true ?}',
            args: ['bool', 'bool']
        },
        {
            name: '任何參數為"真"',
            text: '{any-true ?}',
            args: ['bool', 'bool']
        },
        {
            name: '所有參數不為"真"',
            text: '{none-true ?}',
            args: ['bool', 'bool']
        }
    ],
    '變量': [
        {
            name: '獲取變量值',
            text: '{var ?}',
            args: ['str']
        },
        {
            name: '設置變量值',
            text: '{set-var ?}',
            args: ['str', 'str']
        },
        {
            name: '增量變量值',
            text: '{inc-var ?}',
            args: ['str', 'num']
        },
        {
            name: '遞減變量值',
            text: '{dec-var ?}',
            args: ['str', 'num']
        }
    ],
    '道具': [
        {
            name: '獲取道具數量',
            text: '{item-count ?}',
            args: ['sprite']
        },
        {
            name: '設置道具數量',
            text: '{set-item-count ?}',
            args: ['sprite', 'num']
        },
        {
            name: '添加道具數量',
            text: '{inc-item-count ?}',
            args: ['sprite', 'num']
        },
        {
            name: '移除道具數量',
            text: '{dec-item-count ?}',
            args: ['sprite', 'num']
        }
    ],
    '選擇精靈': [
        {
            name: '選擇...',
            text: '{pick ?}{/pick}',
            args: ['sprite-expression']
        },
        {
            name: '該座標的精靈',
            text: '{sprite-at ?}',
            args: ['x', 'y']
        },
        {
            name: '當前房間的所有精靈',
            text: '{sprites-in-room}',
            args: []
        },
        {
            name: '包含該名稱的所有精靈',
            text: '{sprites-named ?}',
            args: ['sprite']
        },
        {
            name: '與當前精靈相鄰的所有精靈',
            text: '{neighbors}',
            args: []
        },
    ]
}

let scriptScript = `
return {
    run: (script, game, context) => {
        let parsedScript = Script.parse(script)

        let dialogNodes = []

        // default text settings
        let defaultTextPosition = game.avatarY < game.world.roomHeight / 2 ? 'bottom' : 'top'
        let defaultTextSettings = {
            color: 'white',
            style: 'normal',
            position: defaultTextPosition
        }

        // some helper functions
        let isStr = x => typeof x === 'string'
        let isInt = x => !isNaN(x) && parseInt(x) === parseFloat(x)
        let isArr = x => Array.isArray(x)

        // define expressions
        let expressions = {

            'world-name': (game) => game.world.worldName,

            'room-name': (game) => game.currentRoom.name,

            'avatar-room': (game) => game.currentRoom.name,

            'avatar-x': (game) => game.avatarX,

            'avatar-y': (game) => game.avatarY,

            'avatar-name': (game) => game.avatar.name,

            'sprite-room': (game, context) => {
                if (!context) return
                let room = game.world.roomList[context.roomIndex]
                return room.name
            },

            'sprite-x': (game, context) => {
                if (!context) return
                return context.tile.x
            },

            'sprite-y': (game, context) => {
                if (!context) return
                return context.tile.y
            },

            'sprite-name': (game, context) => {
                if (!context) return
                return context.sprite.name
            },

            'sprite-wall': (game, context) => {
                if (!context) return
                return context.sprite.isWall
            },

            'sprite-item': (game, context) => {
                if (!context) return
                return context.sprite.isItem
            },

            'add': (game, context, args) => {
                if (args.length < 2) return 0
                return args.reduce((prev, curr) => {
                    if (isInt(curr)) return prev + curr
                    else return prev
                }, 0)
            },

            'sub': (game, context, args) => {
                if (args.length < 2) return 0
                if (!isInt(args[0])) return 0
                return args.slice(1).reduce((prev, curr) => {
                    if (isInt(curr)) return prev - curr
                    else return prev
                }, args[0])
            },

            'mul': (game, context, args) => {
                if (args.length < 2) return 0
                return args.reduce((prev, curr) => {
                    if (isInt(curr)) return prev * curr
                    else return prev
                }, 1)
            },

            'div': (game, context, args) => {
                if (args.length < 2) return 0
                let result = Math.floor(args[0] / args[1])
                if (!isInt(result)) return 0
                return result
            },

            'mod': (game, context, args) => {
                if (args.length < 2) return 0
                let result = args[0] % args[1]
                if (!isInt(result)) return 0
                return result
            },

            'random': (game, context, args) => {
                let min = isInt(args[0]) ? args[0] : 0
                let max = isInt(args[1]) ? args[1] : 1
                if (min > max) max = min
                return Math.floor(Math.random() * (max - min + 1)) + min
            },

            'eq': (game, context, args) => {
                if (args.length < 2) return false
                return args[0] === args[1]
            },

            'gt': (game, context, args) => {
                if (args.length < 2 || !isInt(args[0]) || !isInt(args[1])) return false
                return args[0] > args[1]
            },

            'gte': (game, context, args) => {
                if (args.length < 2 || !isInt(args[0]) || !isInt(args[1])) return false
                return args[0] >= args[1]
            },

            'lt': (game, context, args) => {
                if (args.length < 2 || !isInt(args[0]) || !isInt(args[1])) return false
                return args[0] < args[1]
            },

            'lte': (game, context, args) => {
                if (args.length < 2 || !isInt(args[0]) || !isInt(args[1])) return false
                return args[0] <= args[1]
            },

            'not': (game, context, args) => {
                if (args.length < 1) return false
                return args[0].toString() !== 'true'
            },

            'all-true': (game, context, args) => {
                let result = true
                args.forEach(arg => {
                    if (arg.toString() !== 'true') result = false
                })
                return result
            },

            'any-true': (game, context, args) => {
                let result = false
                args.forEach(arg => {
                    if (arg.toString() === 'true') result = true
                })
                return result
            },

            'none-true': (game, context, args) => {
                let result = true
                args.forEach(arg => {
                    if (arg.toString() === 'true') result = false
                })
                return result
            },

            'var': (game, context, args) => {
                if (args.length > 0 && isStr(args[0])) {
                    let varValue = game.variables[args[0]]?.value
                    if (isStr(varValue) || isInt(varValue)) {
                        return varValue
                    } else {
                        return ''
                    }
                } else {
                    return ''
                }
            },

            'item-count': (game, context, args) => {
                if (args.length > 0 && isStr(args[0])) {
                    let itemCount = game.inventory[args[0]] || 0
                    return itemCount
                } else {
                    return 0
                }
            },

            'empty': (game, context, args) => {
                if (args.length >= 2 && isInt(args[0]) && isInt(args[1])) {
                    let x = args[0] || 0
                    let y = args[1] || 0
                    let tilesInRoom = game.currentRoom.tileList
                    let tilesAtLocation = tilesInRoom.filter(t =>
                            t.x === x && t.y === y
                        )
                    return (tilesAtLocation.length === 0)
                }
            },

            'sprite-at': (game, context, args) => {
                if (args.length >= 2 && isInt(args[0]) && isInt(args[1])) {
                    let x = args[0] || 0
                    let y = args[1] || 0
                    let tilesInRoom = game.currentRoom.tileList
                    let tilesAtLocation = tilesInRoom.filter(t =>
                            t.x === x && t.y === y
                        )
                    return tilesAtLocation
                }
            },

            'sprites-in-room': (game, context) => {
                let currentTile = context ? context.tile : null
                let tilesInRoom = game.currentRoom.tileList
                let tilesExceptMe = tilesInRoom.filter(t => t !== currentTile)
                return tilesExceptMe
            },

            'sprites-named': (game, context, args) => {
                if (args.length > 0 && isStr(args[0])) {
                    let spriteName = args[0]
                    let currentTile = context ? context.tile : null
                    let tilesInRoom = game.currentRoom.tileList
                    let tilesWithName = tilesInRoom.filter(t =>
                            t.spriteName === spriteName && t !== currentTile
                        )
                    return tilesWithName
                }
            },

            'neighbors': (game, context) => {
                if (context && context.tile) {
                    let x = context.tile.x
                    let y = context.tile.y
                    let tilesInRoom = game.currentRoom.tileList
                    let adjacentTiles = tilesInRoom.filter(t =>
                            Math.abs(t.x - x) <= 1 && Math.abs(t.y - y) <= 1 && t !== context.tile
                        )
                    return adjacentTiles
                }
            }

        }

        // define functions
        let funcs = {
            'b': (game, context, args, textSettings, addNode) => {
                addNode({ type: 'line-break' })
            },

            'p': (game, context, args, textSettings, addNode) => {
                addNode({ type: 'page-break' })
            },

            'wavy': (game, context, args, textSettings, addNode, runNodes) => {
                runNodes(args[0], context, { ...textSettings, style: 'wavy' }, addNode)
            },

            'shaky': (game, context, args, textSettings, addNode, runNodes) => {
                runNodes(args[0], context, { ...textSettings, style: 'shaky' }, addNode)
            },

            'color': (game, context, args, textSettings, addNode, runNodes) => {
                let color = args[0]
                if (!isInt(color)) color = textSettings.color
                runNodes(args[1], context, { ...textSettings, color }, addNode)
            },

            'position': (game, context, args, textSettings, addNode, runNodes) => {
                let position = args[0]
                let positionList = ['top', 'center', 'bottom', 'fullscreen']
                if (!positionList.includes(position)) position = textSettings.position
                runNodes(args[1], context, { ...textSettings, position }, addNode)
            },

            'move-avatar': (game, context, args) => {
                let roomIndex = -1, x = 0, y = 0
                if (isInt(args[0]) && isInt(args[1])) {
                    roomIndex = game.currentRoomIndex
                    x = args[0] || 0
                    y = args[1] || 0
                }
                else if (isStr(args[0]) && isInt(args[1]) && isInt(args[2])) {
                    roomIndex = game.world.roomList.findIndex(r => r.name === args[0])
                    x = args[1] || 0
                    y = args[2] || 0
                }
                if (roomIndex >= 0) {
                    x = Math.max(Math.min(x, game.world.roomWidth - 1), 0)
                    y = Math.max(Math.min(y, game.world.roomHeight - 1), 0)
                    game.moveAvatar(roomIndex, x, y)
                }
            },

            'move-sprite': (game, context, args) => {
                if (!context) return
                let roomIndex = -1, x = 0, y = 0
                if (isInt(args[0]) && isInt(args[1])) {
                    roomIndex = game.currentRoomIndex
                    x = args[0] || 0
                    y = args[1] || 0
                }
                else if (isStr(args[0]) && isInt(args[1]) && isInt(args[2])) {
                    roomIndex = game.world.roomList.findIndex(r => r.name === args[0])
                    x = args[1] || 0
                    y = args[2] || 0
                }
                if (roomIndex >= 0) {
                    x = Math.max(Math.min(x, game.world.roomWidth - 1), 0)
                    y = Math.max(Math.min(y, game.world.roomHeight - 1), 0)
                    if (game.checkTileForSprite(roomIndex, x, y)) {
                        let room = game.world.roomList[roomIndex]
                        room.tileList.push({ spriteName: context.sprite.name, x, y })
                        context.tile.removeMe = true
                    }
                }
            },

            'place-sprite': (game, context, args) => {
                let roomIndex = -1, x = 0, y = 0
                let sprite = game.world.spriteList.find(s => s.name === args[0])
                if (isStr(args[0]) && isInt(args[1]) && isInt(args[2])) {
                    roomIndex = game.currentRoomIndex
                    x = args[1] || 0
                    y = args[2] || 0
                }
                else if (isStr(args[0]) && isStr(args[1]) && isInt(args[2]) && isInt(args[3])) {
                    roomIndex = game.world.roomList.findIndex(r => r.name === args[1])
                    x = args[2] || 0
                    y = args[3] || 0
                }
                if (sprite && roomIndex >= 0) {
                    x = Math.max(Math.min(x, game.world.roomWidth - 1), 0)
                    y = Math.max(Math.min(y, game.world.roomHeight - 1), 0)
                    if (game.checkTileForSprite(roomIndex, x, y)) {
                        let room = game.world.roomList[roomIndex]
                        room.tileList.push({ spriteName: sprite.name, x, y })
                        game.updateCache()
                    }
                }
            },

            'transform-avatar': (game, context, args) => {
                let newSprite = game.world.spriteList.find(s => s.name === args[0])
                if (newSprite) {
                    game.avatar = newSprite
                    game.updateCache()
                }
            },

            'transform-sprite': (game, context, args) => {
                if (!context) return
                let newSprite = game.world.spriteList.find(s => s.name === args[0])
                if (newSprite) {
                    context.tile.spriteName = newSprite.name
                    game.updateCache()
                }
            },

            'remove-sprite': (game, context) => {
                if (!context) return
                context.tile.removeMe = true
            },

            'set-sprite-color': (game, context, args) => {
                if (!context) return
                if (isInt(args[0]) && args[0] > 0) {
                    context.sprite.colorIndex = args[0]
                    game.updateCache()
                }
                else if (isInt(args[1]) && args[1] > 0) {
                    let sprite = game.world.spriteList.find(s => s.name === args[0])
                    if (sprite) {
                        sprite.colorIndex = args[1]
                        game.updateCache()
                    }
                }
            },

            'set-sprite-wall': (game, context, args) => {
                if (!context) return
                if (args.length === 1) {
                    context.sprite.isWall = args[0] === 'true'
                }
                else if (args.length === 2) {
                    let sprite = game.world.spriteList.find(s => s.name === args[0])
                    if (sprite) sprite.isWall = args[1] === 'true'
                }
            },

            'set-sprite-item': (game, context, args) => {
                if (!context) return
                if (args.length === 1) {
                    context.sprite.isItem = args[0] === 'true'
                }
                else if (args.length === 2) {
                    let sprite = game.world.spriteList.find(s => s.name === args[0])
                    if (sprite) sprite.isItem = args[1] === 'true'
                }
            },

            'set-var': (game, context, args) => {
                if (isStr(args[0]) && (isInt(args[1]) || isStr(args[1]))) {
                    game.variables[args[0]] = { value: args[1], type: typeof args[1] }
                    if (game.onVariablesChange) game.onVariablesChange(deepClone(game.variables))
                }
            },

            'inc-var': (game, context, args) => {
                if (isStr(args[0])) {
                    let varValue = game.variables[args[0]]?.value || 0
                    if (isInt(varValue)) {
                        let incValue = isInt(args[1]) ? args[1] : 1
                        game.variables[args[0]] = { value: varValue + incValue, type: 'number' }
                        if (game.onVariablesChange) game.onVariablesChange(deepClone(game.variables))
                    }
                }
            },

            'dec-var': (game, context, args) => {
                if (isStr(args[0])) {
                    let varValue = game.variables[args[0]]?.value || 0
                    if (isInt(varValue)) {
                        let decValue = isInt(args[1]) ? args[1] : 1
                        game.variables[args[0]] = { value: varValue - decValue, type: 'number' }
                        if (game.onVariablesChange) game.onVariablesChange(deepClone(game.variables))
                    }
                }
            },

            'set-item-count': (game, context, args) => {
                if (isStr(args[0]) && isInt(args[1])) {
                    let itemCount = Math.max(0, args[1])
                    game.inventory[args[0]] = itemCount
                }
            },

            'inc-item-count': (game, context, args) => {
                if (isStr(args[0])) {
                    let itemCount = game.inventory[args[0]] || 0
                    let incValue = isInt(args[1]) ? args[1] : 1
                    game.inventory[args[0]] = itemCount + incValue
                }
            },

            'dec-item-count': (game, context, args) => {
                if (isStr(args[0])) {
                    let itemCount = game.inventory[args[0]] || 0
                    let incValue = isInt(args[1]) ? args[1] : 1
                    game.inventory[args[0]] = Math.max(0, itemCount - incValue)
                }
            },

            'set-palette': (game, context, args) => {
                let room, palette
                if (isStr(args[0]) && isStr(args[1])) {
                    room = game.world.roomList.find(r => r.name === args[0])
                    palette = game.world.paletteList.find(p => p.name === args[1])
                }
                else if (isStr(args[0])) {
                    room = game.currentRoom
                    palette = game.world.paletteList.find(p => p.name === args[0])
                }
                if (room && palette) {
                    room.paletteName = palette.name
                    game.updateCache()
                }
            },

            'set-music': (game, context, args) => {
                let room, music
                if (isStr(args[0]) && isStr(args[1])) {
                    room = game.world.roomList.find(r => r.name === args[0])
                    music = game.world.musicList.find(m => m.name === args[1])
                }
                else if (isStr(args[0])) {
                    room = game.currentRoom
                    music = game.world.musicList.find(m => m.name === args[0])
                }
                if (room && music) {
                    room.musicName = music.name
                    game.updateMusic()
                }
            },

            'if': (game, context, args, textSettings, addNode, runNodes) => {
                if (args.length >= 2) {
                    let result = (args[0].toString() === 'true')
                    if (result && isArr(args[1])) {
                        runNodes(args[1], context, textSettings, addNode)
                    }
                    else if (!result && isArr(args[2])) {
                        runNodes(args[2], context, textSettings, addNode)
                    }
                }
            },

            'pick': (game, context, args, textSettings, addNode, runNodes) => {
                if (args.length >= 2 && isArr(args[0])) {
                    let tiles = args[0]
                    let nodes = args[1]
                    tiles.forEach(t => {
                        let tileSprite = game.world.spriteList.find(s => s.name === t.spriteName)
                        if (tileSprite) {
                            let localContext = {
                                tile: t,
                                sprite: tileSprite,
                                roomIndex: game.currentRoomIndex
                            }
                            runNodes(nodes, localContext, textSettings, addNode)
                        }
                    })
                }
            },

            'delay': (game, context, args, textSettings, addNode, runNodes) => {
                if (isInt(args[0])) {
                    window.delayTimer = args[0]
                }
            }

        }

        let stringToTextNode = (text = '', { color, style, position }) => {
            text = text.toString().replace(/^\\n+/g, '').replace(/\\n+$/g, '')
            if (!text) return
            let currentPalette = game.world.paletteList[game.currentPaletteIndex]
            let colorCode = currentPalette.colorList[color] || 'white'
            return {
                type: 'text',
                color: colorCode,
                text, style, position
            }
        }

        let addActionNode = (name, action) => {
            dialogNodes.push({
                type: 'action',
                actionName: name,
                actionFunc: action
            })
        }
        
        // add custom functions and expressions
        if (game.world.modList) {
            game.world.modList.forEach(mod => {
                if (mod.type === 'expression') {
                    expressions[mod.name] = new Function('game', 'context', 'args', mod.code)
                }
                else if (mod.type === 'function') {
                    expressions[mod.name] = new Function('game', 'context', 'args', 'textSettings', 'addNode', 'runNodes', mod.code)
                }
            })
        }

        // calculate the value of an expression
        let calcExpression = (node, context) => {
            if (node.func) {
                let { func, args = [] } = node

                args = args.map(arg => calcExpression(arg, context))

                if (expressions[func]) {
                    let result = expressions[func](game, context, args)
                    if (typeof result !== 'undefined') {
                        return result
                    } else {
                        return ''
                    }
                } else {
                    return ''
                }

            } else {
                return node
            }
        }

        // run a bit of script
        let runNode = (node, context, textSettings, addNode) => {

            if (isStr(node)) {

                let textNode = stringToTextNode(node, textSettings)
                if (textNode) addNode(textNode)

            } else if (node.func) {

                let { func, args = [] } = node

                let actionFunc = () => {}
                if (funcs[func]) {
                    actionFunc = (addNodeInner) => {
                        args = args.map(arg => calcExpression(arg, context))
                        funcs[func](game, context, args, textSettings, addNodeInner, runNodes)
                    }
                } else {
                    actionFunc = (addNodeInner) => {
                        args = args.map(arg => calcExpression(arg, context))
                        let expression = calcExpression(node, context)
                        let expressionNode = stringToTextNode(expression, textSettings)
                        if (expressionNode) addNodeInner(expressionNode)
                    }
                }

                addNode({
                    type: 'action',
                    actionName: func,
                    actionFunc: actionFunc
                })

            }
        }

        // run a list of scripts
        let runNodes = (nodes = [], context, textSettings, addNode) => {
            nodes.forEach(node => {
                runNode(node, context, textSettings, addNode)
            })
        }

        // run the actual script already
        let addNode = (node) => {
            dialogNodes.push(node)
        }
        runNodes(parsedScript, context, defaultTextSettings, addNode)

        // display any dialog created from the script
        if (dialogNodes.length > 0) game.startDialog(dialogNodes)
    },

    parse: (text) => {
        let i = 0

        let parseTextNode = (closingFunc) => {
            let nodes = []
            let textSoFar = ''

            let finalizeNode = () => {
                if (textSoFar) nodes.push(textSoFar)
                textSoFar = ''
            }

            while (i < text.length) {
                let char = text.charAt(i)
                i++
                if (char === '{') {
                    finalizeNode()
                    let funcNode = parseFuncNode(text)
                    if (closingFunc && funcNode.func === closingFunc) {
                        return nodes
                    }
                    nodes.push(funcNode)
                } else {
                    textSoFar += char
                }
            }

            finalizeNode()
            return nodes
        }

        let parseFuncNode = () => {
            let funcName = ''
            while (i < text.length) {
                let char = text.charAt(i)
                if (char === ' ' || char === '\\n' || char === '\\t') {
                    i++
                    break
                } else if (char === '{' || char === '}') {
                    break
                } else {
                    funcName += char
                }
                i++
            }
            funcName = funcName.trim()

            let funcArgs = []
            let nextArg = ''

            let addArg = () => {
                nextArg = nextArg.trim()
                if (!nextArg) return
                if (parseInt(nextArg) === parseFloat(nextArg) && !isNaN(parseInt(nextArg))) {
                    nextArg = parseInt(nextArg)
                }
                funcArgs.push(nextArg)
                nextArg = ''
            }

            let finalizeNode = () => {
                return {
                    func: funcName,
                    args: funcArgs
                }
            }

            let insideQuote = false
            while (i < text.length) {
                let char = text.charAt(i)
                i++
                if (insideQuote) {
                    if (char === '"') {
                        insideQuote = false
                        addArg()
                    } else if (char === '\\\\' && text.charAt(i) === '"') {
                        i++
                        nextArg += '"'
                    } else {
                        nextArg += char
                    }
                } else {
                    if (char === '"') {
                        insideQuote = true
                    } else if (char === ' ' || char === '\\n' || char === '\\t') {
                        addArg()
                    } else if (char === '{') {
                        addArg()
                        funcArgs.push(parseFuncNode(text))
                    } else if (char === '}') {
                        addArg()
                        if (funcName === 'if') {
                            let ifNodes = parseTextNode('/if')
                            let elseNodes = []
                            let elseIndex = ifNodes.findIndex(n => n.func === 'else')
                            if (elseIndex > -1) {
                                elseNodes = ifNodes.slice(elseIndex + 1)
                                ifNodes = ifNodes.slice(0, elseIndex)
                            }
                            funcArgs.push(ifNodes)
                            if (elseNodes.length) funcArgs.push(elseNodes)
                        } else if (funcName === 'pick') {
                            funcArgs.push(parseTextNode('/pick'))
                        } else if (funcName === 'color') {
                            funcArgs.push(parseTextNode('/color'))
                        } else if (funcName === 'wavy') {
                            funcArgs.push(parseTextNode('/wavy'))
                        } else if (funcName === 'shaky') {
                            funcArgs.push(parseTextNode('/shaky'))
                        } else if (funcName === 'position') {
                            funcArgs.push(parseTextNode('/position'))
                        }
                        return finalizeNode()
                    } else {
                        nextArg += char
                    }
                }
            }

            return finalizeNode()
        }

        return parseTextNode()
    }
}
`

let generateScriptScript = new Function(scriptScript)
let Script = generateScriptScript()