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
            name: '顯示對話框背景',
            text: '{show-dialog-bg}',
            args: []
        },
        {
            name: '隱藏對話框背景',
            text: '{hide-dialog-bg}',
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
            name: '獲取選項值',
            text: '{choice ?}',
            args: ['選項名稱']
        },
        {
            name: '顯示選項',
            text: '{set-choice ?}',
            args: ['選項名稱', '選項名稱']
        },
        {
            name: '搖動畫面',
            text: '{shake-screen ?}',
            args: ['持續時間', '強度']
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
            args: ['房間名稱', 'x', 'y', '動畫名稱', '動畫參數']
        },
        {
            name: '轉換主角外觀（精靈）',
            text: '{transform-avatar ?}',
            args: ['精靈名稱']
        },
        {
            name: '設定主角方向（精靈）',
            text: '{direction-avatar ?}',
            args: ['精靈名稱', '方向']
        },
        {
            name: '重置主角方向（精靈）',
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
            name: '精靈是否在座標上?',
            text: '{sprite-here ?}',
            args: ['x', 'y', '房間名稱'],
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
            name: '精靈是否循環移動?',
            text: '{sprite-loop-walk}',
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
            name: '循環移動精靈',
            text: '{loop-walk-sprite ?}',
            args: ['幀數', '方向'],
            spriteOnly: true
        },
        {
            name: '停止循環移動精靈',
            text: '{loop-walk-sprite stop}',
            args: [],
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
        },
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
        },
        {
            name: '設定房間動畫',
            text: '{set-effect ?}',
            args: ['動畫名稱', '動畫參數']
        },
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
            args: ['變量名稱', '參數']
        },
        {
            name: '增量變量值',
            text: '{inc-var ?}',
            args: ['變量名稱', '參數']
        },
        {
            name: '遞減變量值',
            text: '{dec-var ?}',
            args: ['變量名稱', '參數']
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
            args: ['精靈名稱', '參數']
        },
        {
            name: '添加道具數量',
            text: '{inc-item-count ?}',
            args: ['精靈名稱', '參數']
        },
        {
            name: '移除道具數量',
            text: '{dec-item-count ?}',
            args: ['精靈名稱', '參數']
        }
    ],
    '選擇精靈': [
        {
            name: '選擇...',
            text: '{pick ?}{/pick}',
            args: ['精靈表達式', '精靈表達式']
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
            name: '顯示插圖',
            text: '{show-picture ?}',
            args: ['插圖名稱', '動畫名稱', '動畫參數']
        },
        {
            name: '顯示臉部',
            text: '{show-face ?}',
            args: ['臉部名稱']
        },
        {
            name: '隱藏插圖',
            text: '{hide-picture ?}',
            args: ['動畫名稱', '動畫參數']
        },
        {
            name: '隱藏臉部',
            text: '{hide-face}',
            args: []
        },
        {
            name: '轉換插圖',
            text: '{transform-picture ?}',
            args: ['插圖名稱', '動畫名稱', '動畫參數']
        },
        {
            name: '轉換臉部',
            text: '{transform-face ?}',
            args: ['臉部名稱']
        },
        {
            name: '設定插圖調色盤',
            text: '{set-palette ?}',
            args: ['插圖名稱', '調色盤名稱']
        },
        {
            name: '設定插圖音樂',
            text: '{set-music ?}',
            args: ['插圖名稱', '音樂名稱']
        },
    ],
    '全域': [
        {
            name: '獲取當前時間',
            text: '{time-now ?}',
            args: ['格式']
        },
        {
            name: '獲取遊戲進度',
            text: '{save-file ?}',
            args: ['槽位編號']
        },
        {
            name: '獲取全域變量',
            text: '{meta-var ?}',
            args: ['變量名稱']
        },
        {
            name: '獲取確認結果',
            text: '{confirm}',
            args: []
        },
        {
            name: '儲存遊戲進度',
            text: '{save-game ?}',
            args: ['槽位編號']
        },
        {
            name: '載入遊戲進度',
            text: '{load-game ?}',
            args: ['槽位編號']
        },
        {
            name: '刪除遊戲進度',
            text: '{delete-game ?}',
            args: ['槽位編號']
        },
        {
            name: '設定全域變量',
            text: '{set-meta-var ?}',
            args: ['變量名稱', '參數']
        },
        {
            name: '增量全域變量',
            text: '{inc-meta-var ?}',
            args: ['變量名稱', '參數']
        },
        {
            name: '遞減全域變量',
            text: '{dec-meta-var ?}',
            args: ['變量名稱', '參數']
        },
        {
            name: '彈出訊息',
            text: '{alert ?}',
            args: ['訊息內容']
        },
        {
            name: '確認視窗',
            text: '{set-confirm ?}',
            args: ['確認訊息']
        },
        {
            name: '輸入文字',
            text: '{set-input ?}',
            args: ['變數名稱', '提示訊息', '預設值']
        },
        {
            name: '獲取輸入值',
            text: '{input ?}',
            args: ['變數名稱']
        },
        {
            name: '檢查輸入是否存在',
            text: '{has-input ?}',
            args: ['變數名稱']
        },
        {
            name: '開啟網頁',
            text: '{pop-page ?}',
            args: ['網址']
        },
        {
            name: '下載文字檔案',
            text: '{download-text ?}',
            args: ['檔名', '內容']
        },
        {
            name: '下載圖片檔案',
            text: '{download-img ?}',
            args: ['檔名', 'base64資料']
        },
        {
            name: '重新整理網頁',
            text: '{reload-page}',
            args: []
        },
        {
            name: '全螢幕',
            text: '{fullscreen ?}',
            args: ['on/off/switch']
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
        
        // 生成包含世界名稱的存檔鍵
        let getSaveKey = (game, slot) => {
            let worldName = game.world && game.world.worldName ? game.world.worldName : 'default'
            // 將世界名稱編碼為安全的鍵名（替換特殊字符為下劃線）
            let safeWorldName = worldName.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_')
            return 'mosi-save-' + safeWorldName + '-' + slot
        }

        // define expressions
        let expressions = {

            'world-name': (game) => game.world.worldName,

            'room-name': (game) => game.currentRoom.name,

            'avatar-room': (game) => game.currentRoom.name,

            'avatar-x': (game) => game.avatarX,

            'avatar-y': (game) => game.avatarY,

            'avatar-name': (game) => game.avatar.name,

            'choice': (game, context, args) => {
                // 語法糖，直接回傳 var 變數
                if (args.length > 0 && typeof args[0] === 'string') {
                    let val = game.variables[args[0]]?.value === true;
                    return val;
                }
                return false;
            },

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

            'sprite-here': (game, context, args) => {
                if (!context || !context.tile) return false;
                if (args.length < 2 || !isInt(args[0]) || !isInt(args[1])) return false;

                let x = args[0];
                let y = args[1];
                let roomName = args[2];

                // 取得自己所在的房間物件
                let myRoom = null;
                if (typeof context.roomIndex === 'number') {
                    myRoom = game.world.roomList[context.roomIndex];
                } else if (context.tile && typeof context.tile.roomIndex === 'number') {
                    myRoom = game.world.roomList[context.tile.roomIndex];
                } else {
                    myRoom = game.currentRoom;
                }

                // 如果有指定房間，且不是自己所在房間，直接 false
                if (roomName && typeof roomName === 'string') {
                    if (!myRoom || myRoom.name !== roomName) return false;
                }

                // 只比對自己
                return context.tile.x === x && context.tile.y === y;
            },

            'sprite-wall': (game, context) => {
                if (!context) return
                return context.sprite.isWall
            },

            'sprite-item': (game, context) => {
                if (!context) return
                return context.sprite.isItem
            },

            'sprite-loop-walk': (game, context, args) => {
                if (!context || !context.tile) return false;
                let tile = context.tile;
                return !!(tile._loopWalkTimer);
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
                if (typeof spriteName !== 'string' || !spriteName) return [];

                if (args.length === 2) {
                    if (args[1] === 'world') {
                        // 全世界
                        let allTiles = [];
                        game.world.roomList.forEach(r => {
                            allTiles = allTiles.concat(r.tileList.filter(t => t.spriteName && t.spriteName.includes(spriteName)));
                        });
                        let currentTile = context ? context.tile : null;
                        return allTiles.filter(t => t !== currentTile);
                    } else if (typeof args[1] === 'string') {
                        let room = game.world.roomList.find(r => r.name === args[1]);
                        if (!room) return [];
                        let currentTile = context ? context.tile : null;
                        return room.tileList.filter(t => t.spriteName && t.spriteName.includes(spriteName) && t !== currentTile);
                    } else if (typeof args[1] === 'number') {
                        let room = game.world.roomList[args[1]];
                        if (!room) return [];
                        let currentTile = context ? context.tile : null;
                        return room.tileList.filter(t => t.spriteName && t.spriteName.includes(spriteName) && t !== currentTile);
                    }
                }
                // 預設：當前房間
                let tilesInRoom = game.currentRoom.tileList;
                let currentTile = context ? context.tile : null;
                return tilesInRoom.filter(t => t.spriteName && t.spriteName.includes(spriteName) && t !== currentTile);
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

            'picture-name': (game) => {
                return game.currentPicture || ''
            },

            'face-name': (game) => {
                return game.currentFace || ''
            },

            // === 全域（meta）變量表達式 ===
            'meta-var': (game, context, args) => {
                if (typeof args[0] === 'string') {
                    let key = 'meta-' + args[0];
                    let value = localStorage.getItem(key);
                    try {
                        return value ? JSON.parse(value) : 0;
                    } catch {
                        return value;
                    }
                }
                return 0;
            },

            // === 存檔槽位檢查表達式 ===
            'save-file': (game, context, args) => {
                try {
                    // 取得槽位編號，預設為1
                    let slot = 1;
                    if (args && args.length > 0 && typeof args[0] === 'number') {
                        slot = args[0];
                    }
                    let saveKey = getSaveKey(game, slot);
                    let save = localStorage.getItem(saveKey);
                    return save !== null;
                } catch (e) {
                    console.error('檢查存檔失敗', e);
                    return false;
                }
            },
            // === 確認結果檢查表達式 ===
            'confirm': (game, context, args) => {
                if (typeof game.variables === 'object' && game.variables['confirm']) {
                    return game.variables['confirm'].value === true;
                }
                return false;
            },
            // === 獲取輸入值表達式 ===
            'input': (game, context, args) => {
                if (args.length > 0 && typeof args[0] === 'string') {
                    let varValue = game.variables[args[0]]?.value;
                    if (typeof varValue === 'string' || typeof varValue === 'number') {
                        return varValue;
                    } else {
                        return '';
                    }
                }
                return '';
            },
            // === 檢查輸入是否存在表達式 ===
            'has-input': (game, context, args) => {
                if (args.length > 0 && typeof args[0] === 'string') {
                    let varValue = game.variables[args[0]]?.value;
                    // 如果變量存在且值不為空，返回 'true'，否則返回 'false'
                    if (varValue !== undefined && varValue !== null && varValue !== '') {
                        return 'true';
                    } else {
                        return 'false';
                    }
                }
                return 'false';
            },
            // === 取得現在時間 ===
            'time-now': (game, context, args) => {
                let now = new Date();
                let format = args[0]; // 預設格式
                
                // 取得12小時制的小時
                let getHour12 = () => {
                    let hour = now.getHours() % 12;
                    return hour === 0 ? 12 : hour;
                };
                
                // 取得24小時制的小時
                let getHour24 = () => {
                    return now.getHours();
                };
                
                // 取得AM/PM
                let getAMPM = (isChinese = false) => {
                    if (isChinese) {
                        return now.getHours() >= 12 ? '下午' : '上午';
                    } else {
                        return now.getHours() >= 12 ? 'PM' : 'AM';
                    }
                };
                
                switch(format) {
                    case 'hour':
                        // 檢查是否有第二個參數指定12小時制
                        let hourHourFormat = args[1];
                        return hourHourFormat === 12 ? getHour12() : getHour24();
                    case 'minute':
                        return now.getMinutes();
                    case 'second':
                        return now.getSeconds();
                    case 'year':
                        return now.getFullYear();
                    case 'month':
                        return now.getMonth() + 1; // 0-11 轉為 1-12
                    case 'date':
                        return now.getDate();
                    case 'day':
                        let dayNamesEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                        return dayNamesEn[now.getDay()];
                    case '星期':
                        let dayNames = ['日', '一', '二', '三', '四', '五', '六'];
                        return dayNames[now.getDay()];
                    case 'time':
                        // 檢查是否有第二個參數指定12小時制
                        let timeHourFormat = args[1];
                        if (timeHourFormat === 12) {
                            return getHour12() + ':' + String(now.getMinutes()).padStart(2, '0') + ' ' + getAMPM();
                        } else {
                            return String(getHour24()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
                        }
                    case '時間':
                        // 檢查是否有第二個參數指定12小時制
                        let timeHourFormat2 = args[1];
                        if (timeHourFormat2 === 12) {
                            return getHour12() + ':' + String(now.getMinutes()).padStart(2, '0') + ' ' + getAMPM(true);
                        } else {
                            return String(getHour24()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
                        }

                    case 'date-only':
                        return now.getFullYear() + '/' + String(now.getMonth() + 1).padStart(2, '0') + '/' + String(now.getDate()).padStart(2, '0');
                    case 12:
                        // 12 小時制的完整時間格式
                        let timeStr12 = getHour12() + ':' + String(now.getMinutes()).padStart(2, '0') + ':' + String(now.getSeconds()).padStart(2, '0') + ' ' + getAMPM();
                        return now.getFullYear() + '/' + String(now.getMonth() + 1).padStart(2, '0') + '/' + String(now.getDate()).padStart(2, '0') + ' ' + timeStr12;

                    default:
                        // 預設回傳完整時間格式
                        let timeStr;
                        if (args[1] === 12) {
                            timeStr = getHour12() + ':' + String(now.getMinutes()).padStart(2, '0') + ':' + String(now.getSeconds()).padStart(2, '0') + ' ' + getAMPM();
                        } else {
                            timeStr = String(getHour24()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0') + ':' + String(now.getSeconds()).padStart(2, '0');
                        }
                        return now.getFullYear() + '/' + String(now.getMonth() + 1).padStart(2, '0') + '/' + String(now.getDate()).padStart(2, '0') + ' ' + timeStr;
                }
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
                // 參數解析
                let moveIndex = args.findIndex(arg => arg === 'move')
                let direction = null
                if (moveIndex !== -1 && args[moveIndex + 1]) {
                    direction = args[moveIndex + 1]
                }
                if (direction && ['right','left','up','down'].includes(direction)) {
                    let fromRoomIndex = game.currentRoomIndex
                    let toRoomIndex = args[0]
                    let mx = args[1], my = args[2]
                    if (typeof toRoomIndex === 'string') {
                        toRoomIndex = game.world.roomList.findIndex(r => r.name === toRoomIndex)
                    }
                    if (typeof toRoomIndex !== 'number' || toRoomIndex < 0) return
                    game._isFading = true
                    game.nextX = mx
                    game.nextY = my
                    game.nextRoomIndex = toRoomIndex
                    game.slideTransition(fromRoomIndex, toRoomIndex, direction, () => {
                        game._isFading = false
                        game.moveAvatar(toRoomIndex, mx, my)
                    })
                    return
                }
                // === 原始邏輯 ===
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
                        let palette = game.world.paletteList[game.currentPaletteIndex]
                        let colorList = palette ? palette.colorList : ['#000']
                        let color = colorList[colorIndex] || '#000'
                        game.fade(color, 400, 'out').then(() => {
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
                    } else {
                        // 無顏色參數，cross-fade
                        if (roomIndex >= 0) {
                            let fromRoom = game.currentRoomIndex
                            let toRoom = roomIndex
                            x = Math.max(Math.min(x, game.world.roomWidth - 1), 0)
                            y = Math.max(Math.min(y, game.world.roomHeight - 1), 0)
                            game._isFading = true
                            game.crossFadeRooms(fromRoom, toRoom, 400, () => {
                                game._isFading = false
                                game.moveAvatar(toRoom, x, y)
                            })
                            return
                        }
                    }
                }
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
                // The parser now creates a flat list of conditions and blocks
                // [cond1, block1, cond2, block2, ..., elseBlock?]
                // All condition arguments are pre-evaluated by calcExpression.
                for (let i = 0; i < args.length; i += 2) {
                    // Check for a final 'else' block which has no condition.
                    if (i + 1 >= args.length) {
                        let elseBlock = args[i];
                        if (isArr(elseBlock)) {
                            runNodes(elseBlock, context, textSettings, addNode);
                        }
                        return; // End of the if-chain.
                    }

                    let conditionResult = args[i];
                    let block = args[i + 1];

                    if (conditionResult.toString() === 'true') {
                        if (isArr(block)) {
                            runNodes(block, context, textSettings, addNode);
                        }
                        return; // A condition was met, so we execute its block and exit the chain.
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
                if (window._mosiWalkSpriteBusy) return;
                window._mosiWalkSpriteBusy = true;
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
                // 預先計算完整 path
                let path = [];
                let curX = tile.x, curY = tile.y;
                for (let i = 0; i < directions.length; i++) {
                    let dir = directions[i];
                    let dx = 0, dy = 0;
                    if (dir === 'up') dy = -1;
                    if (dir === 'down') dy = 1;
                    if (dir === 'left') dx = -1;
                    if (dir === 'right') dx = 1;
                    let newX = Math.max(0, Math.min(game.world.roomWidth - 1, curX + dx));
                    let newY = Math.max(0, Math.min(game.world.roomHeight - 1, curY + dy));
                    path.push([newX, newY]);
                    curX = newX;
                    curY = newY;
                }
                let step = 0;
                window._mosiLockInput = true;
                let moveStep = () => {
                    while (step < path.length) {
                        let [newX, newY] = path[step];
                        // 跳過主角
                        if (newX === game.avatarX && newY === game.avatarY) {
                            step++;
                            continue;
                        }
                        // 跳過 isWall 牆精靈
                        let room = game.world.roomList[game.currentRoomIndex];
                        let hasWall = room.tileList.some(t => t.x === newX && t.y === newY && game.world.spriteList.find(s => s.name === t.spriteName && s.isWall));
                        if (hasWall) {
                            step++;
                            continue;
                        }
                        tile.x = newX;
                        tile.y = newY;
                        game.updateCache();
                        step++;
                        setTimeout(moveStep, interval);
                        return;
                    }
                    // 全部都跳過了，結束
                    window._mosiLockInput = false;
                    window._mosiWalkSpriteBusy = false;
                    if (typeof runNodes === 'function') runNodes([], context, textSettings, addNode);
                };
                moveStep();
            },
            'loop-walk-sprite': (game, context, args, textSettings, addNode, runNodes) => {
                // 支援 {loop-walk-sprite stop} 來停止循環
                if (!context || !context.tile) return;
                let tile = context.tile;
                if (args[0] && args[0].toString().toLowerCase() === 'stop') {
                    // 只有正在循環時才執行停止
                    if (tile._loopWalkTimer) {
                        clearTimeout(tile._loopWalkTimer);
                        tile._loopWalkTimer = null;
                        tile._loopWalkPaused = false;
                        tile._loopWalkDirections = null;
                        tile._loopWalkInterval = null;
                    }
                    return;
                }
                let interval = 400;
                let directions = args.map(arg => arg.toString());
                if (directions.length > 1 && !isNaN(parseInt(directions[0]))) {
                    interval = parseInt(directions[0]);
                    directions = directions.slice(1);
                }
                // 記錄循環狀態
                tile._loopWalkDirections = directions;
                tile._loopWalkInterval = interval;
                tile._loopWalkStep = tile._loopWalkStep || 0;
                tile._loopWalkPaused = false;
                // 循環移動函式
                function loopStep() {
                    if (tile._loopWalkPaused) return;
                    if (!tile._loopWalkDirections || tile._loopWalkDirections.length === 0) return;
                    let dir = tile._loopWalkDirections[tile._loopWalkStep % tile._loopWalkDirections.length];
                    let dx = 0, dy = 0;
                    if (dir === 'up') dy = -1;
                    if (dir === 'down') dy = 1;
                    if (dir === 'left') dx = -1;
                    if (dir === 'right') dx = 1;
                    let newX = tile.x + dx;
                    let newY = tile.y + dy;
                    // 跳過主角
                    if (newX === game.avatarX && newY === game.avatarY) {
                        // 主角擋住，這回合不移動也不前進路線
                        tile._loopWalkTimer = setTimeout(loopStep, tile._loopWalkInterval);
                        return;
                    }
                    // 跳過 isWall 牆精靈
                    let room = game.world.roomList[game.currentRoomIndex];
                    let hasWall = room.tileList.some(t => t.x === newX && t.y === newY && game.world.spriteList.find(s => s.name === t.spriteName && s.isWall));
                    if (hasWall) {
                        tile._loopWalkStep = (tile._loopWalkStep + 1) % tile._loopWalkDirections.length;
                        tile._loopWalkTimer = setTimeout(loopStep, tile._loopWalkInterval);
                        return;
                    }
                    newX = Math.max(0, Math.min(game.world.roomWidth - 1, newX));
                    newY = Math.max(0, Math.min(game.world.roomHeight - 1, newY));
                    tile.x = newX;
                    tile.y = newY;
                    game.updateCache();
                    tile._loopWalkStep = (tile._loopWalkStep + 1) % tile._loopWalkDirections.length;
                    tile._loopWalkTimer = setTimeout(loopStep, tile._loopWalkInterval);
                }
                // 支援 on-push 事件暫停循環
                tile._pauseLoopWalk = function() {
                    tile._loopWalkPaused = true;
                };
                tile._resumeLoopWalk = function() {
                    if (!tile._loopWalkPaused) return;
                    if (!tile._loopWalkDirections || !Array.isArray(tile._loopWalkDirections) || tile._loopWalkDirections.length === 0) return;
                    tile._loopWalkPaused = false;
                    loopStep();
                };
                if (tile._loopWalkTimer) clearTimeout(tile._loopWalkTimer);
                loopStep();
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
                let moveIndex = args.findIndex(arg => arg === 'move')
                let direction = null
                if (moveIndex !== -1 && args[moveIndex + 1]) {
                    direction = args[moveIndex + 1]
                }
                if (direction && ['right','left','up','down'].includes(direction)) {
                    let fromPic = game.currentPicture
                    let toPic = args[0]
                    if (!fromPic || !toPic) return
                    game._isFading = true
                    if (typeof game.slidePictureTransition === 'function') {
                        game.slidePictureTransition(fromPic, toPic, 400, () => {
                            game._isFading = false
                            game.setPicture(toPic)
                            window.requestAnimationFrame(game.update)
                        }, direction)
                    } else {
                        // fallback: 直接切換
                        game.setPicture(toPic)
                        game._isFading = false
                        window.requestAnimationFrame(game.update)
                    }
                    return
                }
                // === 原始邏輯 ===
                let fadeIndex = args.findIndex(arg => arg === 'fade')
                let colorIndex = 0
                if (fadeIndex !== -1) {
                    // 有 fade，檢查是否有顏色參數
                    if (args.length > fadeIndex + 1 && typeof args[fadeIndex + 1] === 'number') {
                        colorIndex = args[fadeIndex + 1]
                        let palette = game.world.paletteList[game.currentPaletteIndex]
                        let colorList = palette ? palette.colorList : ['#000']
                        let color = colorList[colorIndex] || '#000'
                        game.fade(color, 400, 'out').then(() => {
                            game.setPicture(args[0])
                            game.currentPictureFrameIndex = 0
                            game.pictureFrameTimer = 0
                            setTimeout(() => {
                                game.fade(color, 400, 'in')
                            }, 0)
                        })
                        return
                    } else {
                        // 無顏色參數，cross-fade
                        let fromPic = game.currentPicture
                        let toPic = args[0]
                        game._isFading = true
                        game.crossFadePicture(fromPic, toPic, 400, () => {
                            game._isFading = false
                            game.setPicture(toPic)
                            game.currentPictureFrameIndex = 0
                            game.pictureFrameTimer = 0
                        })
                        return
                    }
                }
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
                // 2. 記錄選項（保留原始文字，用於變數名稱）
                let choiceList = args.map(opt => opt.toString());
                // 2.5. 解析選項文字中的特效標籤，將選項文字轉換為文字節點
                let choiceTextNodes = [];
                // 解析每個選項文字，應用當前的 textSettings
                choiceList.forEach(optText => {
                    // 將選項文字解析為文字節點
                    let parsedNodes = Script.parse(optText);
                    let localNodes = [];
                    let addLocalNode = (node) => {
                        localNodes.push(node);
                    };
                    // 使用 runNodes 解析選項文字中的特效標籤
                    runNodes(parsedNodes, context, textSettings, addLocalNode);
                    // 將解析後的文字節點合併為單一文字字串（保留特效資訊）
                    let finalText = '';
                    let finalColor = textSettings.color;
                    let finalStyle = textSettings.style;
                    localNodes.forEach(node => {
                        if (node.type === 'text') {
                            finalText += node.text;
                            // 如果節點有指定顏色或樣式，使用節點的設定
                            if (node.color) finalColor = node.color;
                            if (node.style) finalStyle = node.style;
                        }
                    });
                    // 將解析後的選項文字和特效資訊儲存
                    choiceTextNodes.push({
                        text: finalText || optText, // 如果解析失敗，使用原始文字
                        color: finalColor,
                        style: finalStyle
                    });
                });
                // 3. 顯示選單，等待玩家輸入
                window._mosiChoiceActive = true;
                window._mosiChoiceList = choiceList;
                window._mosiChoiceIndex = 0;
                window._mosiChoiceCallback = function(selectedIndex) {
                    // 4. 設定選到的變數為 true
                    choiceList.forEach(function(opt, idx) {
                        game.variables[opt] = { value: idx === selectedIndex, type: 'boolean' };
                    });
                    // 觸發變量變化通知
                    if (game.onVariablesChange) game.onVariablesChange(deepClone(game.variables));
                    window._mosiChoiceActive = false;
                };
                // 5. 插入一個特殊節點，讓 text.js 處理渲染與輸入
                addNode({
                    type: 'choice',
                    choiceList: choiceList,
                    choiceTextNodes: choiceTextNodes, // 新增：儲存解析後的文字節點資訊
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
            'hide-dialog-bg': (game, context, args, textSettings, addNode, runNodes) => {
                window._mosiDialogBgAlpha = 0;
            },
            'show-dialog-bg': (game, context, args, textSettings, addNode, runNodes) => {
                window._mosiDialogBgAlpha = 1;
            },
            // === 儲存／載入遊戲進度 ===
            'save-game': (game, context, args) => {
                try {
                    if (typeof game.exportState === 'function') {
                        // 取得槽位編號，預設為1
                        let slot = 1;
                        if (args && args.length > 0 && typeof args[0] === 'number') {
                            slot = args[0];
                        }
                        let saveKey = getSaveKey(game, slot);
                        localStorage.setItem(saveKey, game.exportState());
                    }
                } catch (e) {
                    console.error('存檔失敗', e);
                }
            },
            'load-game': (game, context, args) => {
                try {
                    if (typeof game.importState === 'function') {
                        // 取得槽位編號，預設為1
                        let slot = 1;
                        if (args && args.length > 0 && typeof args[0] === 'number') {
                            slot = args[0];
                        }
                        let saveKey = getSaveKey(game, slot);
                        let save = localStorage.getItem(saveKey);
                        if (save) {
                            game.importState(save);
                        } else {
                            // 如果沒有存檔，顯示瀏覽器彈出視窗
                            alert('該槽位沒有存檔！');
                        }
                    }
                } catch (e) {
                    console.error('讀檔失敗', e);
                }
            },
            'delete-game': (game, context, args) => {
                try {
                    // 取得槽位編號，預設為1
                    let slot = 1;
                    if (args && args.length > 0 && typeof args[0] === 'number') {
                        slot = args[0];
                    }
                    let saveKey = getSaveKey(game, slot);
                    let save = localStorage.getItem(saveKey);
                    if (save) {
                        localStorage.removeItem(saveKey);
                    } else {
                        // 如果沒有存檔，顯示瀏覽器彈出視窗
                        alert('該槽位沒有存檔！');
                    }
                } catch (e) {
                    console.error('刪除存檔失敗', e);
                }
            },
            // === 全域（meta）變量 ===
            'set-meta-var': (game, context, args) => {
                if (typeof args[0] === 'string') {
                    let key = 'meta-' + args[0];
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
                    let key = 'meta-' + args[0];
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
                    let key = 'meta-' + args[0];
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
            'set-effect': (game, context, args) => {
                // 不執行任何動畫，只作為腳本標記
            },
            'shake-screen': (game, context, args) => {
                // 支援可選參數，如果沒有參數則使用預設值
                let duration = 500;  // 預設持續時間
                let intensity = 5;   // 預設強度
                
                if (args && args.length >= 1) {
                    duration = parseInt(args[0]) || 500;
                }
                if (args && args.length >= 2) {
                    intensity = parseInt(args[1]) || 5;
                }
                
                if (game.shakeScreen) {
                    game.shakeScreen(duration, intensity);
                }
            },
            'alert': (game, context, args) => {
                if (args && args.length > 0) {
                    alert(args[0]);
                }
                // 清除 keyCodes，避免移動操作重複執行
                if (game.keyCodes) {
                    game.keyCodes = [];
                    game.keyActive = false;
                }
                // 清除 pointer 狀態，避免觸控操作重複執行
                if (game.pointerIsDown !== undefined) {
                    game.pointerIsDown = false;
                }
                if (game.oneMoreMove !== undefined) {
                    game.oneMoreMove = false;
                }
            },
            'set-confirm': (game, context, args) => {
                if (args && args.length > 0) {
                    let result = confirm(args[0]);
                    // 將結果儲存到全域變數中，供後續使用
                    if (typeof game.variables === 'object') {
                        game.variables['confirm'] = { value: result };
                        // 觸發變量變化通知
                        if (game.onVariablesChange) game.onVariablesChange(deepClone(game.variables));
                    }
                }
                // 清除 keyCodes，避免移動操作重複執行
                if (game.keyCodes) {
                    game.keyCodes = [];
                    game.keyActive = false;
                }
                // 清除 pointer 狀態，避免觸控操作重複執行
                if (game.pointerIsDown !== undefined) {
                    game.pointerIsDown = false;
                }
                if (game.oneMoreMove !== undefined) {
                    game.oneMoreMove = false;
                }
            },
            'set-input': (game, context, args) => {
                if (args && args.length > 0 && typeof args[0] === 'string') {
                    let varName = args[0];
                    let promptMessage = args.length > 1 ? args[1] : '請輸入：';
                    let defaultValue = args.length > 2 ? args[2] : '';
                    
                    let result = prompt(promptMessage, defaultValue);
                    
                    // 處理結果
                    if (typeof game.variables === 'object') {
                        if (result === null) {
                            // 使用者點擊取消，刪除變量（如果存在）
                            if (game.variables[varName]) {
                                delete game.variables[varName];
                            }
                        } else if (result === '') {
                            // 使用者點擊確定但輸入為空，刪除變量（如果存在）
                            if (game.variables[varName]) {
                                delete game.variables[varName];
                            }
                        } else {
                            // 使用者輸入有效內容，正常儲存
                            game.variables[varName] = { 
                                value: result, 
                                type: 'string'
                            };
                        }
                        // 觸發變量變化通知
                        if (game.onVariablesChange) game.onVariablesChange(deepClone(game.variables));
                    }
                }
                // 清除 keyCodes，避免移動操作重複執行
                if (game.keyCodes) {
                    game.keyCodes = [];
                    game.keyActive = false;
                }
                // 清除 pointer 狀態，避免觸控操作重複執行
                if (game.pointerIsDown !== undefined) {
                    game.pointerIsDown = false;
                }
                if (game.oneMoreMove !== undefined) {
                    game.oneMoreMove = false;
                }
            },
            'pop-page': (game, context, args) => {
                if (args && args.length > 0) {
                    let url = args[0];
                    // 檢查 URL 格式，如果沒有協議則加上 https://
                    if (!url.startsWith('http://') && !url.startsWith('https://')) {
                        url = 'https://' + url;
                    }
                    
                    // 嘗試在新分頁開啟網址
                    let newWindow = window.open(url, '_blank');
                    
                    // 如果 window.open 失敗（被阻擋），嘗試其他方法
                    if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
                        // 方法1：建立一個可見的連結讓使用者點擊
                        let linkContainer = document.createElement('div');
                        linkContainer.style.cssText = 
                            'position: fixed; ' +
                            'top: 50%; ' +
                            'left: 50%; ' +
                            'transform: translate(-50%, -50%); ' +
                            'background: white; ' +
                            'border: 2px solid #333; ' +
                            'border-radius: 10px; ' +
                            'padding: 20px; ' +
                            'z-index: 10000; ' +
                            'box-shadow: 0 4px 20px rgba(0,0,0,0.3); ' +
                            'text-align: center; ' +
                            'max-width: 80%; ' +
                            'word-break: break-all;';
                        
                        linkContainer.innerHTML = 
                            '<div style="margin-bottom: 15px; font-weight: bold; color: #333;">' +
                            '點擊下方連結開啟網頁' +
                            '</div>' +
                            '<a href="' + url + '" target="_blank" rel="noopener noreferrer" ' +
                            'style="display: inline-block; padding: 10px 20px; ' +
                            'background: #007bff; color: white; text-decoration: none; ' +
                            'border-radius: 5px; margin: 10px;">' +
                            '開啟連結' +
                            '</a>' +
                            '<br>' +
                            '<button onclick="this.parentElement.remove()" ' +
                            'style="padding: 8px 16px; background: #6c757d; color: white; ' +
                            'border: none; border-radius: 5px; cursor: pointer;">' +
                            '關閉' +
                            '</button>';
                        
                        document.body.appendChild(linkContainer);
                        
                        // 5秒後自動移除提示框
                        setTimeout(() => {
                            if (linkContainer.parentElement) {
                                linkContainer.remove();
                            }
                        }, 5000);
                    }
                }
                // 清除 keyCodes，避免移動操作重複執行
                if (game.keyCodes) {
                    game.keyCodes = [];
                    game.keyActive = false;
                }
                // 清除 pointer 狀態，避免觸控操作重複執行
                if (game.pointerIsDown !== undefined) {
                    game.pointerIsDown = false;
                }
                if (game.oneMoreMove !== undefined) {
                    game.oneMoreMove = false;
                }
            },
            'download-text': (game, context, args) => {
                if (args && args.length >= 1) {
                    let filename, content;
                    
                    if (args.length === 2) {
                        // 兩個參數：{download-text 檔名 內容}
                        filename = args[0];
                        content = args[1];
                    } else {
                        // 一個參數：{download-text 內容} - 使用預設檔名
                        content = args[0];
                        let now = new Date();
                        let timestamp = now.getFullYear() + 
                                      String(now.getMonth() + 1).padStart(2, '0') + 
                                      String(now.getDate()).padStart(2, '0') + '_' +
                                      String(now.getHours()).padStart(2, '0') + 
                                      String(now.getMinutes()).padStart(2, '0') + 
                                      String(now.getSeconds()).padStart(2, '0');
                        filename = 'text_' + timestamp + '.txt';
                    }
                    
                    // 檢查內容是否為空
                    if (!content || content.toString().trim() === '') {
                        alert('下載文字檔案失敗：內容不能為空');
                        return;
                    }
                    
                    // 檢查檔名是否為空
                    if (!filename || filename.toString().trim() === '') {
                        alert('下載文字檔案失敗：檔名不能為空');
                        return;
                    }
                    
                    // 檢查檔名是否有副檔名
                    if (!filename.includes('.')) {
                        alert('下載文字檔案失敗：檔名必須包含副檔名（如 .txt、.log）');
                        return;
                    }
                    
                    // 將 \\n 轉換為真正的換行符
                    let processedContent = content.replace(/\\\\n/g, '\\n');
                    let blob = new Blob([processedContent], { type: 'text/plain;charset=utf-8' });
                    
                    // 建立下載連結
                    let url = URL.createObjectURL(blob);
                    let a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    
                    // 釋放 URL 物件
                    URL.revokeObjectURL(url);
                } else {
                    alert('下載文字檔案失敗：缺少必要參數');
                }
                // 清除 keyCodes，避免移動操作重複執行
                if (game.keyCodes) {
                    game.keyCodes = [];
                    game.keyActive = false;
                }
                // 清除 pointer 狀態，避免觸控操作重複執行
                if (game.pointerIsDown !== undefined) {
                    game.pointerIsDown = false;
                }
                if (game.oneMoreMove !== undefined) {
                    game.oneMoreMove = false;
                }
            },
            'download-img': (game, context, args) => {
                if (args && args.length >= 1) {
                    let filename, base64Data;
                    
                    if (args.length === 2) {
                        // 兩個參數：{download-img 檔名 base64資料}
                        filename = args[0];
                        base64Data = args[1];
                    } else {
                        // 一個參數：{download-img base64資料} - 使用預設檔名
                        base64Data = args[0];
                        let now = new Date();
                        let timestamp = now.getFullYear() + 
                                      String(now.getMonth() + 1).padStart(2, '0') + 
                                      String(now.getDate()).padStart(2, '0') + '_' +
                                      String(now.getHours()).padStart(2, '0') + 
                                      String(now.getMinutes()).padStart(2, '0') + 
                                      String(now.getSeconds()).padStart(2, '0');
                        filename = 'image_' + timestamp + '.png';
                    }
                    
                    // 檢查 base64 資料是否為空
                    if (!base64Data || base64Data.toString().trim() === '') {
                        alert('下載圖片檔案失敗：base64資料不能為空');
                        return;
                    }
                    
                    // 檢查檔名是否為空
                    if (!filename || filename.toString().trim() === '') {
                        alert('下載圖片檔案失敗：檔名不能為空');
                        return;
                    }
                    
                    // 檢查檔名是否有副檔名
                    if (!filename.includes('.')) {
                        alert('下載圖片檔案失敗：檔名必須包含副檔名（如 .png、.jpg）');
                        return;
                    }
                    
                    // 檢查 base64 格式
                    if (base64Data.startsWith('data:image/')) {
                        // 直接使用 base64 資料
                        let a = document.createElement('a');
                        a.href = base64Data;
                        a.download = filename;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                    } else {
                        // 檢查是否為有效的 base64 編碼
                        try {
                            // 嘗試解碼 base64
                            atob(base64Data);
                            
                            // 根據檔名副檔名決定圖片格式
                            let imageType = 'image/png'; // 預設
                            if (filename.toLowerCase().endsWith('.jpg') || filename.toLowerCase().endsWith('.jpeg')) {
                                imageType = 'image/jpeg';
                            } else if (filename.toLowerCase().endsWith('.gif')) {
                                imageType = 'image/gif';
                            } else if (filename.toLowerCase().endsWith('.webp')) {
                                imageType = 'image/webp';
                            } else if (filename.toLowerCase().endsWith('.bmp')) {
                                imageType = 'image/bmp';
                            }
                            
                            // 加上正確的 data URL 前綴
                            let dataUrl = 'data:' + imageType + ';base64,' + base64Data;
                            let a = document.createElement('a');
                            a.href = dataUrl;
                            a.download = filename;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                        } catch (e) {
                            alert('下載圖片檔案失敗：base64資料格式不正確');
                            return;
                        }
                    }
                } else {
                    alert('下載圖片檔案失敗：缺少必要參數');
                }
                // 清除 keyCodes，避免移動操作重複執行
                if (game.keyCodes) {
                    game.keyCodes = [];
                    game.keyActive = false;
                }
                // 清除 pointer 狀態，避免觸控操作重複執行
                if (game.pointerIsDown !== undefined) {
                    game.pointerIsDown = false;
                }
                if (game.oneMoreMove !== undefined) {
                    game.oneMoreMove = false;
                }
            },
            'reload-page': (game, context, args) => {
                // 重新整理網頁
                location.reload();
            },
            'fullscreen': (game, context, args) => {
                // 處理全螢幕功能
                let action = args && args.length > 0 ? args[0].toLowerCase() : 'switch';
                
                // 檢查是否在全螢幕狀態
                let isFullscreen = !!(
                    document.fullscreenElement ||
                    document.webkitFullscreenElement ||
                    document.msFullscreenElement ||
                    document.mozFullScreenElement
                );
                
                // 進入全螢幕
                let enterFullscreen = () => {
                    const element = document.documentElement;
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else if (element.webkitRequestFullscreen) {
                        element.webkitRequestFullscreen();
                    } else if (element.msRequestFullscreen) {
                        element.msRequestFullscreen();
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                    } else {
                        alert('您的瀏覽器或設備不支援全螢幕功能');
                    }
                };
                
                // 退出全螢幕
                let exitFullscreen = () => {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    }
                };
                
                // 根據動作執行
                if (action === 'on') {
                    if (!isFullscreen) {
                        enterFullscreen();
                    }
                } else if (action === 'off') {
                    if (isFullscreen) {
                        exitFullscreen();
                    }
                } else if (action === 'switch') {
                    if (isFullscreen) {
                        exitFullscreen();
                    } else {
                        enterFullscreen();
                    }
                }
                
                // 清除 keyCodes，避免移動操作重複執行
                if (game.keyCodes) {
                    game.keyCodes = [];
                    game.keyActive = false;
                }
                // 清除 pointer 狀態，避免觸控操作重複執行
                if (game.pointerIsDown !== undefined) {
                    game.pointerIsDown = false;
                }
                if (game.oneMoreMove !== undefined) {
                    game.oneMoreMove = false;
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
        if (dialogNodes.length > 0) {
            // 檢查是否有 appendDialog 參數（從 runScript 傳遞）
            let appendDialog = context && context._appendDialog === true
            game.startDialog(dialogNodes, appendDialog)
        }
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
                            // New parser logic to handle {else-if} and {else}
                            let allNodes = parseTextNode('/if');
                            let currentBlock = [];

                            // funcArgs already contains the first condition
                            
                            let currentIndex = 0;
                            while(currentIndex < allNodes.length) {
                                const node = allNodes[currentIndex];
                        
                                if (node && node.func === 'else-if') {
                                    // Finish the previous block and push it.
                                    funcArgs.push(currentBlock);
                                    currentBlock = [];
                        
                                    // Push the new condition from 'else-if'.
                                    if (node.args && node.args.length > 0) {
                                        funcArgs.push(node.args[0]);
                                    } else {
                                        // Handle else-if without a condition as false.
                                        funcArgs.push(false); 
                                    }
                                } else if (node && node.func === 'else') {
                                    // Finish the previous block and push it.
                                    funcArgs.push(currentBlock);
                        
                                    // The rest of the nodes form the 'else' block.
                                    const elseBlock = allNodes.slice(currentIndex + 1);
                                    funcArgs.push(elseBlock);
                                    
                                    // Exit the loop as 'else' must be the final clause.
                                    break; 
                                } else {
                                    currentBlock.push(node);
                                }
                                currentIndex++;
                            }

                            // If the script ends without an 'else', push the last block.
                            if (currentIndex === allNodes.length && funcArgs.length % 2 !== 0) {
                                funcArgs.push(currentBlock);
                            }
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