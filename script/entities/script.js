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
            args: ['顏色']
        },
        {
            name: '彩虹文字',
            text: '{rainbow}{/rainbow}',
            args: []
        },
        {
            name: '故障文字',
            text: '{glitch}{/glitch}',
            args: []
        },
        {
            name: '對話框位置',
            text: '{position ?}{/position}',
            args: ['對話框位置']
        },
        {
            name: '顯示對話框',
            text: '{show-dialog}',
            args: []
        },
        {
            name: '隱藏對話框',
            text: '{hide-dialog}',
            args: []
        },
        {
            name: '延遲',
            text: '{delay ?}',
            args: ['數字']
        },
        {
            name: '跳過',
            text: '{skip}',
            args: []
        },
        {
            name: '選項',
            text: '{choice ?}',
            args: ['選項名稱']
        },
        {
            name: '顯示選項',
            text: '{set-choice ?}',
            args: ['選項名稱', '選項名稱']
        },
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
            args: ['房間名稱', 'x', 'y', 'fade', '顏色']
        },
        {
            name: '轉換主角外觀（精靈）',
            text: '{transform-avatar ?}',
            args: ['精靈名稱']
        },
        {
            name: '設定主角方向精靈',
            text: '{direction-avatar ?}',
            args: ['精靈名稱', '方向']
        },
        {
            name: '重置主角方向精靈',
            text: '{direction-avatar reset}',
            args: []
        },
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
            args: ['房間名稱', 'x', 'y'],
            spriteOnly: true
        },
        {
            name: '連續移動精靈',
            text: '{walk-sprite ?}',
            args: ['幀數', '方向'],
            spriteOnly: true
        },
        {
            name: '放置新的精靈',
            text: '{place-sprite ?}',
            args: ['精靈名稱', '房間名稱', 'x', 'y']
        },
        {
            name: '轉換精靈至另一個精靈',
            text: '{transform-sprite ?}',
            args: ['精靈名稱'],
            spriteOnly: true
        },
        {
            name: '移除精靈',
            text: '{remove-sprite}',
            args: [],
            spriteOnly: true
        },
        {
            name: '跟隨主角',
            text: '{follow-avatar ?}',
            args: ['on/off'],
            spriteOnly: true
        },
        {
            name: '設定精靈顏色',
            text: '{set-sprite-color ?}',
            args: ['顏色'],
            spriteOnly: true
        },
        {
            name: '設定精靈是否為牆',
            text: '{set-sprite-wall ?}',
            args: ['布林值'],
            spriteOnly: true
        },
        {
            name: '設定精靈是否為道具',
            text: '{set-sprite-item ?}',
            args: ['布林值'],
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
            name: '設定房間配色',
            text: '{set-palette ?}',
            args: ['房間名稱', '調色盤名稱']
        },
        {
            name: '設定房間音樂',
            text: '{set-music ?}',
            args: ['房間名稱', '音樂名稱']
        }
    ],
    '算數': [
        {
            name: '添加',
            text: '{add ?}',
            args: ['參數', '參數']
        },
        {
            name: '減去',
            text: '{sub ?}',
            args: ['參數', '參數']
        },
        {
            name: '相乘',
            text: '{mul ?}',
            args: ['參數', '參數']
        },
        {
            name: '除以',
            text: '{div ?}',
            args: ['參數', '參數']
        },
        {
            name: '餘數',
            text: '{mod ?}',
            args: ['參數', '參數']
        },
        {
            name: '隨機數字',
            text: '{random ?}',
            args: ['參數', '參數']
        }
    ],
    '邏輯': [
        {
            name: '如果為真，執行動作',
            text: '{if ?}{/if}',
            args: ['參數']
        },
        {
            name: '相等',
            text: '{eq ?}',
            args: ['參數', '參數']
        },
        {
            name: '大於',
            text: '{gt ?}',
            args: ['參數', '參數']
        },
        {
            name: '大於等於',
            text: '{gte ?}',
            args: ['參數', '參數']
        },
        {
            name: '小於',
            text: '{lt ?}',
            args: ['參數', '參數']
        },
        {
            name: '小於等於',
            text: '{lte ?}',
            args: ['參數', '參數']
        },
        {
            name: '否（參數為假則為真）',
            text: '{not ?}',
            args: ['參數']
        },
        {
            name: '每個參數都為"真"',
            text: '{all-true ?}',
            args: ['參數', '參數']
        },
        {
            name: '任何參數為"真"',
            text: '{any-true ?}',
            args: ['參數', '參數']
        },
        {
            name: '所有參數不為"真"',
            text: '{none-true ?}',
            args: ['參數', '參數']
        }
    ],
    '變量': [
        {
            name: '獲取變量值',
            text: '{var ?}',
            args: ['變量名稱']
        },
        {
            name: '設定變量值',
            text: '{set-var ?}',
            args: ['變量名稱', '值']
        },
        {
            name: '增量變量值',
            text: '{inc-var ?}',
            args: ['變量名稱', '數字']
        },
        {
            name: '遞減變量值',
            text: '{dec-var ?}',
            args: ['變量名稱', '數字']
        }
    ],
    '道具': [
        {
            name: '獲取道具數量',
            text: '{item-count ?}',
            args: ['精靈名稱']
        },
        {
            name: '設定道具數量',
            text: '{set-item-count ?}',
            args: ['精靈名稱', '數字']
        },
        {
            name: '添加道具數量',
            text: '{inc-item-count ?}',
            args: ['精靈名稱', '數字']
        },
        {
            name: '移除道具數量',
            text: '{dec-item-count ?}',
            args: ['精靈名稱', '數字']
        }
    ],
    '選擇精靈': [
        {
            name: '選擇...',
            text: '{pick ?}{/pick}',
            args: ['精靈表達式']
        },
        {
            name: '該座標的精靈',
            text: '{sprite-at ?}',
            args: ['房間名稱', 'x', 'y']
        },
        {
            name: '當前房間的所有精靈',
            text: '{sprites-in-room ?}',
            args: ['房間名稱/world']
        },
        {
            name: '包含該名稱的所有精靈',
            text: '{sprites-named ?}',
            args: ['精靈名稱', '房間名稱/world']
        },
        {
            name: '與當前精靈相鄰的所有精靈',
            text: '{neighbors}',
            args: []
        },
    ],
    '圖片': [
        {
            name: '顯示插圖',
            text: '{show-picture ?}',
            args: ['插圖名稱', 'fade', '顏色']
        },
        {
            name: '顯示臉部',
            text: '{show-face ?}',
            args: ['臉部名稱']
        },
        {
            name: '隱藏插圖',
            text: '{hide-picture ?}',
            args: ['fade', '顏色']
        },
        {
            name: '隱藏臉部',
            text: '{hide-face}',
            args: []
        },
        {
            name: '轉換插圖',
            text: '{transform-picture ?}',
            args: ['插圖名稱', 'fade', '顏色']
        },
        {
            name: '轉換臉部',
            text: '{transform-face ?}',
            args: ['臉部名稱']
        },
        {
            name: '插圖名稱',
            text: '{picture-name}',
            args: []
        },
        {
            name: '臉部名稱',
            text: '{face-name}',
            args: []
        },
        {
            name: '設定插圖調色盤',
            text: '{set-palette ?}',
            args: ['插圖名稱', '調色盤']
        },
        {
            name: '設定插圖音樂',
            text: '{set-music ?}',
            args: ['插圖名稱', '音樂']
        },
    ],
    '全域': [
        {
            name: '儲存遊戲進度',
            text: '{save-game}',
            args: []
        },
        {
            name: '載入遊戲進度',
            text: '{load-game}',
            args: []
        },
        {
            name: '獲取全域變量',
            text: '{meta-var ?}',
            args: ['變量名稱']
        },
        {
            name: '設定全域變量',
            text: '{set-meta-var ?}',
            args: ['變量名稱', '值']
        },
        {
            name: '增量全域變量',
            text: '{inc-meta-var ?}',
            args: ['變量名稱', '數字']
        },
        {
            name: '遞減全域變量',
            text: '{dec-meta-var ?}',
            args: ['變量名稱', '數字']
        }
    ]
}

let scriptScript = `
return {
    run: (script, game, context) => {
        let parsedScript = Script.parse(script)

        let dialogNodes = []

        // default text settings
        let defaultTextPosition = game.avatarY < game.world.roomHeight / 2 ? 'bottom' : 'top'
        
        // 取得主體文字顏色
        let mainPalette = game.world.paletteList[game.world.mainPaletteIndex]
        let mainTextColorIndex = game.world.mainTextColorIndex || 0
        let defaultTextColor = mainPalette ? mainPalette.colorList[mainTextColorIndex] : 'white'
        
        let defaultTextSettings = {
            color: defaultTextColor,
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

            'picture-name': (game) => {
                return game.currentPicture || ''
            },

            'face-name': (game) => {
                return game.currentFace || ''
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
                // 支援：x y（當前房間）、房間名稱 x y、房間index x y
                let room = game.currentRoom;
                let x, y;
                if (args.length === 2) {
                    x = args[0];
                    y = args[1];
                } else if (args.length === 3) {
                    if (typeof args[0] === 'string') {
                        room = game.world.roomList.find(r => r.name === args[0]) || game.currentRoom;
                    } else if (typeof args[0] === 'number') {
                        room = game.world.roomList[args[0]] || game.currentRoom;
                    }
                    x = args[1];
                    y = args[2];
                }
                if (!room) return [];
                let currentTile = context ? context.tile : null;
                return room.tileList.filter(t => t.x === x && t.y === y && t !== currentTile);
            },

            'sprites-in-room': (game, context, args) => {
                // 支援：無參數=當前房間，有參數=指定房間或 world
                let room = null;
                if (args && args.length > 0) {
                    if (args[0] === 'world') {
                        // 全世界所有精靈
                        let allTiles = [];
                        game.world.roomList.forEach(r => {
                            allTiles = allTiles.concat(r.tileList);
                        });
                        let currentTile = context ? context.tile : null;
                        return allTiles.filter(t => t !== currentTile);
                    } else if (typeof args[0] === 'string') {
                        room = game.world.roomList.find(r => r.name === args[0]);
                    } else if (typeof args[0] === 'number') {
                        room = game.world.roomList[args[0]];
                    }
                } else {
                    room = game.currentRoom;
                }
                if (!room) return [];
                let currentTile = context ? context.tile : null;
                return room.tileList.filter(t => t !== currentTile);
            },

            'sprites-named': (game, context, args) => {
                if (!args || args.length === 0) return [];
                let spriteName = args[0];
                if (args.length === 2) {
                    if (args[1] === 'world') {
                        // 全世界
                        let allTiles = [];
                        game.world.roomList.forEach(r => {
                            allTiles = allTiles.concat(r.tileList.filter(t => t.spriteName === spriteName));
                        });
                        let currentTile = context ? context.tile : null;
                        return allTiles.filter(t => t !== currentTile);
                    } else if (typeof args[1] === 'string') {
                        let room = game.world.roomList.find(r => r.name === args[1]);
                        if (!room) return [];
                        let currentTile = context ? context.tile : null;
                        return room.tileList.filter(t => t.spriteName === spriteName && t !== currentTile);
                    } else if (typeof args[1] === 'number') {
                        let room = game.world.roomList[args[1]];
                        if (!room) return [];
                        let currentTile = context ? context.tile : null;
                        return room.tileList.filter(t => t.spriteName === spriteName && t !== currentTile);
                    }
                }
                // 預設：當前房間
                let tilesInRoom = game.currentRoom.tileList;
                let currentTile = context ? context.tile : null;
                return tilesInRoom.filter(t => t.spriteName === spriteName && t !== currentTile);
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
            },

            'choice': (game, context, args) => {
                // 語法糖，直接回傳 var 變數
                if (args.length > 0 && typeof args[0] === 'string') {
                    let val = game.variables[args[0]]?.value === true;
                    return val;
                }
                return false;
            },

            // === 全域（meta）變量表達式 ===
            'meta-var': (game, context, args) => {
                if (typeof args[0] === 'string') {
                    let key = 'meta_' + args[0];
                    let value = localStorage.getItem(key);
                    try {
                        return value ? JSON.parse(value) : 0;
                    } catch {
                        return value;
                    }
                }
                return 0;
            },
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
                let newStyle = textSettings.style === 'normal' ? 'wavy' : textSettings.style + ' wavy'
                runNodes(args[0], context, { ...textSettings, style: newStyle }, addNode)
            },

            'shaky': (game, context, args, textSettings, addNode, runNodes) => {
                let newStyle = textSettings.style === 'normal' ? 'shaky' : textSettings.style + ' shaky'
                runNodes(args[0], context, { ...textSettings, style: newStyle }, addNode)
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
                // 檢查是否有 fade 參數
                let fadeIndex = args.findIndex(arg => arg === 'fade')
                let colorIndex = 0
                // 先解析房間/x/y參數
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
                if (fadeIndex !== -1) {
                    // 有 fade，檢查是否有顏色參數
                    if (args.length > fadeIndex + 1 && typeof args[fadeIndex + 1] === 'number') {
                        colorIndex = args[fadeIndex + 1]
                    }
                    let palette = game.world.paletteList[game.currentPaletteIndex]
                    let colorList = palette ? palette.colorList : ['#000']
                    let color = colorList[colorIndex] || '#000'
                    game.fade(color, 400, 'out').then(() => {
                        // 執行原本切換
                        if (roomIndex >= 0) {
                            x = Math.max(Math.min(x, game.world.roomWidth - 1), 0)
                            y = Math.max(Math.min(y, game.world.roomHeight - 1), 0)
                            game.moveAvatar(roomIndex, x, y)
                        }
                        setTimeout(() => {
                            game.fade(color, 400, 'in')
                        }, 0)
                    })
                    return
                }
                // 原本邏輯
                if (roomIndex >= 0) {
                    x = Math.max(Math.min(x, game.world.roomWidth - 1), 0)
                    y = Math.max(Math.min(y, game.world.roomHeight - 1), 0)
                    game.moveAvatar(roomIndex, x, y)
                }
                return
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

            'direction-avatar': (game, context, args) => {
                // 處理 reset 指令
                if (args.length === 1 && args[0].toLowerCase() === 'reset') {
                    // 清除所有方向精靈設定
                    game.avatarDirectionSprites = {}
                    game.useDirectionSprites = false
                    
                    // 還原為預設主角精靈
                    let defaultAvatar = game.world.spriteList.find(sprite => sprite.isAvatar)
                    if (defaultAvatar) {
                        game.avatar = defaultAvatar
                        game.updateCache()
                    }
                    return
                }
                
                // 處理一般的方向精靈設定
                if (args.length >= 2) {
                    let spriteName = args[0]
                    let direction = args[1].toLowerCase()
                    let newSprite = game.world.spriteList.find(s => s.name === spriteName)
                    
                    if (newSprite) {
                        // 初始化方向精靈映射（如果不存在）
                        if (!game.avatarDirectionSprites) {
                            game.avatarDirectionSprites = {}
                        }
                        
                        // 設定對應方向的精靈
                        game.avatarDirectionSprites[direction] = newSprite
                        
                        // 啟用方向精靈模式（禁用自動翻轉）
                        game.useDirectionSprites = true
                        
                        // 如果當前方向匹配，立即切換
                        if (game.avatarDirection === direction) {
                            game.avatar = newSprite
                            game.updateCache()
                        }
                    }
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
                let color, sprite
                if (args.length === 1 && isInt(args[0]) && args[0] > 0) {
                    color = parseInt(args[0])
                    sprite = context.sprite
                } else if (args.length === 2 && isStr(args[0]) && isInt(args[1]) && args[1] > 0) {
                    color = parseInt(args[1])
                    sprite = game.world.spriteList.find(s => s.name === args[0])
                }
                if (!sprite) return

                // 嚴格判斷單色精靈：有 colorIndex，且 frameList 只包含 0/1
                let isMono = false
                if (
                    'colorIndex' in sprite &&
                    sprite.frameList &&
                    sprite.frameList.length > 0 &&
                    sprite.frameList.every(frame => frame.every(v => v === 0 || v === 1))
                ) {
                    isMono = true
                }

                if (isMono) {
                    // 單色精靈：只改 colorIndex
                    sprite.colorIndex = color
                } else {
                    // 多色精靈：直接改 frameList
                    sprite.frameList = sprite.frameList.map(frame =>
                        frame.map(v => v === 0 ? 0 : color)
                    )
                }
                game.updateCache()
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
                // 支援多個精靈表達式，依序遍歷所有 tiles（允許重複）
                if (args.length >= 2) {
                    let nodes = args[args.length - 1];
                    let tileLists = args.slice(0, -1).filter(isArr);
                    tileLists.forEach(list => {
                        list.forEach(t => {
                            let tileSprite = game.world.spriteList.find(s => s.name === t.spriteName);
                            if (tileSprite) {
                                let localContext = {
                                    tile: t,
                                    sprite: tileSprite,
                                    roomIndex: game.currentRoomIndex
                                };
                                runNodes(nodes, localContext, textSettings, addNode);
                            }
                        });
                    });
                }
            },

            'delay': (game, context, args, textSettings, addNode, runNodes) => {
                if (isInt(args[0])) {
                    window.delayTimer = args[0]
                }
            },

            'rainbow': (game, context, args, textSettings, addNode, runNodes) => {
                let newStyle = textSettings.style === 'normal' ? 'rainbow' : textSettings.style + ' rainbow'
                runNodes(args[0], context, { ...textSettings, style: newStyle }, addNode)
            },

            'glitch': (game, context, args, textSettings, addNode, runNodes) => {
                runNodes(args[0], context, { ...textSettings, style: (textSettings.style + ' glitch').trim() }, addNode);
            },

            'skip': (game, context, args, textSettings, addNode) => {
                addNode({ type: 'skip' });
            },

            'walk-sprite': (game, context, args, textSettings, addNode, runNodes) => {
                // 只支援在 pick/for-each-sprite context 下用
                if (!context || !context.tile) return;
                let tile = context.tile;
                let interval = 400; // 預設每步 400ms
                let directions = args.map(arg => arg.toString());
                // 判斷第一個參數是否為數字
                if (directions.length > 1 && !isNaN(parseInt(directions[0]))) {
                    interval = parseInt(directions[0]);
                    directions = directions.slice(1);
                }
                let step = 0;
                let moveStep = () => {
                    if (step >= directions.length) {
                        return;
                    }
                    let dir = directions[step];
                    let dx = 0, dy = 0;
                    if (dir === 'up') dy = -1;
                    if (dir === 'down') dy = 1;
                    if (dir === 'left') dx = -1;
                    if (dir === 'right') dx = 1;
                    let newX = tile.x + dx;
                    let newY = tile.y + dy;
                    // 檢查邊界
                    newX = Math.max(0, Math.min(game.world.roomWidth - 1, newX));
                    newY = Math.max(0, Math.min(game.world.roomHeight - 1, newY));
                    tile.x = newX;
                    tile.y = newY;
                    game.updateCache();
                    step++;
                    setTimeout(moveStep, interval);
                };
                moveStep();
            },
            // === 圖片相關指令 ===
            'show-picture': (game, context, args) => {
                // 檢查是否有 fade 參數
                let fadeIndex = args.findIndex(arg => arg === 'fade')
                let colorIndex = 0
                if (fadeIndex !== -1) {
                    // 有 fade，檢查是否有顏色參數
                    if (args.length > fadeIndex + 1 && typeof args[fadeIndex + 1] === 'number') {
                        colorIndex = args[fadeIndex + 1]
                    }
                    let palette = game.world.paletteList[game.currentPaletteIndex]
                    let colorList = palette ? palette.colorList : ['#000']
                    let color = colorList[colorIndex] || '#000'
                    game.fade(color, 400, 'out').then(() => {
                        // 執行原本切換
                        game.setPicture(args[0])
                        game.currentPictureFrameIndex = 0
                        game.pictureFrameTimer = 0
                        game._pictureScriptBreak = true
                        setTimeout(() => {
                            game.fade(color, 400, 'in')
                        }, 0)
                    })
                    return
                }
                // 原本邏輯
                game.setPicture(args[0])
                game.currentPictureFrameIndex = 0
                game.pictureFrameTimer = 0
                game._pictureScriptBreak = true
                return
            },
            'show-face': (game, context, args) => {
                game.currentFace = args[0]
                game.currentFaceFrameIndex = 0
                game.faceFrameTimer = 0
            },
            'hide-picture': (game, context, args) => {
                // 檢查是否有 fade 參數
                let fadeIndex = args.findIndex(arg => arg === 'fade')
                let colorIndex = 0
                if (fadeIndex !== -1) {
                    // 有 fade，檢查是否有顏色參數
                    if (args.length > fadeIndex + 1 && typeof args[fadeIndex + 1] === 'number') {
                        colorIndex = args[fadeIndex + 1]
                    }
                    let palette = game.world.paletteList[game.currentPaletteIndex]
                    let colorList = palette ? palette.colorList : ['#000']
                    let color = colorList[colorIndex] || '#000'
                    game.fade(color, 400, 'out').then(() => {
                        // 執行原本隱藏
                        game.setPicture(null)
                        game.currentPicturePalette = null
                        game.currentPictureMusic = null
                        // 恢復房間的音樂
                        game.updateMusic && game.updateMusic()
                        setTimeout(() => {
                            game.fade(color, 400, 'in')
                        }, 0)
                    })
                    return
                }
                // 原本邏輯
                game.setPicture(null)
                game.currentPicturePalette = null
                game.currentPictureMusic = null
                // 恢復房間的音樂
                game.updateMusic && game.updateMusic()
                return
            },
            'hide-face': (game, context, args) => {
                game.currentFace = null
                game.currentFaceFrameIndex = 0
                game.faceFrameTimer = 0
            },
            'transform-picture': (game, context, args) => {
                // 檢查是否有 fade 參數
                let fadeIndex = args.findIndex(arg => arg === 'fade')
                let colorIndex = 0
                if (fadeIndex !== -1) {
                    // 有 fade，檢查是否有顏色參數
                    if (args.length > fadeIndex + 1 && typeof args[fadeIndex + 1] === 'number') {
                        colorIndex = args[fadeIndex + 1]
                    }
                    let palette = game.world.paletteList[game.currentPaletteIndex]
                    let colorList = palette ? palette.colorList : ['#000']
                    let color = colorList[colorIndex] || '#000'
                    game.fade(color, 400, 'out').then(() => {
                        // 執行原本切換
                        game.setPicture(args[0])
                        game.currentPictureFrameIndex = 0
                        game.pictureFrameTimer = 0
                        setTimeout(() => {
                            game.fade(color, 400, 'in')
                        }, 0)
                    })
                    return
                }
                // 原本邏輯
                game.setPicture(args[0])
                game.currentPictureFrameIndex = 0
                game.pictureFrameTimer = 0
                return
            },
            'transform-face': (game, context, args) => {
                game.currentFace = args[0]
                game.currentFaceFrameIndex = 0
                game.faceFrameTimer = 0
            },

            'set-music': (game, context, args) => {
                if (args.length === 2) {
                    // picture 指定
                    let pic = game.world.graphicList.find(g => g.name === args[0] && g.type === 'picture')
                    if (pic) {
                        pic.musicName = args[1]
                        return
                    }
                    // 房間指定
                    let room = game.world.roomList.find(r => r.name === args[0])
                    let music = game.world.musicList.find(m => m.name === args[1])
                    if (room && music) {
                        room.musicName = music.name
                        if (game.currentRoom && game.currentRoom.name === room.name) {
                            game.currentRoom.musicName = music.name
                        }
                        game.updateMusic && game.updateMusic()
                        return
                    }
                }
                if (game.currentPicture) {
                    // 單參數時，若有 picture，直接改 picture
                    let pic = game.world.graphicList.find(g => g.name === game.currentPicture && g.type === 'picture')
                    if (pic) {
                        pic.musicName = args[0]
                        return
                    }
                }
                // 單參數時，改目前房間
                let room = game.currentRoom
                let music = game.world.musicList.find(m => m.name === args[0])
                if (room && music) {
                    room.musicName = music.name
                    game.currentRoom.musicName = music.name
                    game.updateMusic && game.updateMusic()
                }
            },
            'set-palette': (game, context, args) => {
                if (args.length === 2) {
                    // picture 指定
                    let pic = game.world.graphicList.find(g => g.name === args[0] && g.type === 'picture')
                    if (pic) {
                        pic.paletteName = args[1]
                        return
                    }
                    // 房間指定
                    let room = game.world.roomList.find(r => r.name === args[0])
                    let palette = game.world.paletteList.find(p => p.name === args[1])
                    if (room && palette) {
                        room.paletteName = palette.name
                        if (game.currentRoom && game.currentRoom.name === room.name) {
                            game.currentRoom.paletteName = palette.name
                        }
                        game.updateCache && game.updateCache()
                        return
                    }
                }
                if (game.currentPicture) {
                    // 單參數時，若有 picture，直接改 picture
                    let pic = game.world.graphicList.find(g => g.name === game.currentPicture && g.type === 'picture')
                    if (pic) {
                        pic.paletteName = args[0]
                        return
                    }
                }
                // 單參數時，改目前房間
                let room = game.currentRoom
                let palette = game.world.paletteList.find(p => p.name === args[0])
                if (room && palette) {
                    room.paletteName = palette.name
                    game.currentRoom.paletteName = palette.name
                    game.updateCache && game.updateCache()
                }
            },
            'set-choice': (game, context, args, textSettings, addNode, runNodes) => {
                // 1. 先將所有選項變數設為 false
                args.forEach(opt => {
                    game.variables[opt] = { value: false, type: 'boolean' };
                });
                // 2. 記錄選項
                let choiceList = args.map(opt => opt.toString());
                // 3. 顯示選單，等待玩家輸入
                window._mosiChoiceActive = true;
                window._mosiChoiceList = choiceList;
                window._mosiChoiceIndex = 0;
                window._mosiChoiceCallback = function(selectedIndex) {
                    // 4. 設定選到的變數為 true
                    choiceList.forEach(function(opt, idx) {
                        game.variables[opt] = { value: idx === selectedIndex, type: 'boolean' };
                    });
                    window._mosiChoiceActive = false;
                };
                // 5. 插入一個特殊節點，讓 text.js 處理渲染與輸入
                addNode({
                    type: 'choice',
                    choiceList: choiceList,
                    getCurrent: function() { return window._mosiChoiceIndex; },
                    setCurrent: function(idx) { window._mosiChoiceIndex = idx; },
                    onSelect: function(idx) {
                        if (window._mosiChoiceCallback) window._mosiChoiceCallback(idx);
                    }
                });
            },
            'follow-avatar': (game, context, args) => {
                if (!context || !context.sprite) {
                    return;
                }
                let sprite = context.sprite;
                let mode = (args[0] || '').toLowerCase();
                if (!game.followerList) game.followerList = [];
                if (!game.followerTrail) game.followerTrail = [];
                if (mode === 'on') {
                    if (!game.followerList.includes(sprite.name)) {
                        game.followerList.push(sprite.name);
                        // trail 補滿，讓新加入的跟隨精靈一開始就會正確落後主角一格
                        let needLength = 1 + game.followerList.length + 2;
                        while (game.followerTrail.length < needLength) {
                            game.followerTrail.push({
                                room: game.currentRoomIndex,
                                x: game.avatarX,
                                y: game.avatarY
                            });
                        }
                    } else {
                        // 已經在列表中，排序不變
                    }
                } else if (mode === 'off') {
                    let idx = game.followerList.indexOf(sprite.name);
                    if (idx !== -1) {
                        game.followerList.splice(idx, 1);
                    } else {
                    }
                } else {
                }
            },
            'hide-dialog': (game, context, args, textSettings, addNode, runNodes) => {
                window._mosiDialogAlpha = 0;
            },
            'show-dialog': (game, context, args, textSettings, addNode, runNodes) => {
                window._mosiDialogAlpha = 1;
            },
            // === 儲存／載入遊戲進度 ===
            'save-game': (game, context, args) => {
                try {
                    if (typeof game.exportState === 'function') {
                        localStorage.setItem('mosi_save', game.exportState());
                    }
                } catch (e) {
                    console.error('存檔失敗', e);
                }
            },
            'load-game': (game, context, args) => {
                try {
                    if (typeof game.importState === 'function') {
                        let save = localStorage.getItem('mosi_save');
                        if (save) game.importState(save);
                    }
                } catch (e) {
                    console.error('讀檔失敗', e);
                }
            },
            // === 全域（meta）變量 ===
            'set-meta-var': (game, context, args) => {
                if (typeof args[0] === 'string') {
                    let key = 'meta_' + args[0];
                    let value = args[1];
                    try {
                        localStorage.setItem(key, JSON.stringify(value));
                    } catch (e) {
                        console.error('set-meta-var 失敗', e);
                    }
                }
            },
            'inc-meta-var': (game, context, args) => {
                if (typeof args[0] === 'string') {
                    let key = 'meta_' + args[0];
                    let value = 0;
                    try {
                        let raw = localStorage.getItem(key);
                        value = raw ? JSON.parse(raw) : 0;
                    } catch {}
                    let inc = (typeof args[1] === 'number') ? args[1] : 1;
                    value = (typeof value === 'number') ? value + inc : inc;
                    try {
                        localStorage.setItem(key, JSON.stringify(value));
                    } catch (e) {
                        console.error('inc-meta-var 失敗', e);
                    }
                }
            },
            'dec-meta-var': (game, context, args) => {
                if (typeof args[0] === 'string') {
                    let key = 'meta_' + args[0];
                    let value = 0;
                    try {
                        let raw = localStorage.getItem(key);
                        value = raw ? JSON.parse(raw) : 0;
                    } catch {}
                    let dec = (typeof args[1] === 'number') ? args[1] : 1;
                    value = (typeof value === 'number') ? value - dec : -dec;
                    try {
                        localStorage.setItem(key, JSON.stringify(value));
                    } catch (e) {
                        console.error('dec-meta-var 失敗', e);
                    }
                }
            },
        }

        let stringToTextNode = (text = '', { color, style, position }) => {
            text = text.toString().replace(/^\\n+/g, '').replace(/\\n+$/g, '')
            if (!text) return
            
            // 使用主體文字顏色，除非明確指定了其他顏色
            let mainPalette = game.world.paletteList[game.world.mainPaletteIndex]
            let mainTextColorIndex = game.world.mainTextColorIndex || 0
            let defaultColor = mainPalette ? mainPalette.colorList[mainTextColorIndex] : 'white'
            
            // 如果 color 是數字，則使用調色盤顏色；否則使用主體顏色
            let colorCode = (typeof color === 'number' && color >= 0) 
                ? (game.world.paletteList[game.currentPaletteIndex]?.colorList[color] || defaultColor)
                : defaultColor
                
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

            } else if (node.func === 'skip') {
                addNode({ type: 'skip' });
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
                        } else if (funcName === 'rainbow') {
                            funcArgs.push(parseTextNode('/rainbow'))
                        } else if (funcName === 'glitch') {
                            funcArgs.push(parseTextNode('/glitch'))
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