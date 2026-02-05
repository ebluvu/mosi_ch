let Graphic = {
    // 建立 Picture 或 Face graphic
    create: function({
        name = '',
        type = 'picture',
        paletteName = '',
        musicName = '',
        roomWidth = 12,
        roomHeight = 12,
        spriteWidth = 8,
        spriteHeight = 8,
        frameList,
        scriptList = {},
        // 新增 context 參數
        paletteList,
        mainPaletteIndex,
        musicList
    } = {}) {
        if (type === 'picture') {
            let width = roomWidth * spriteWidth
            let height = roomHeight * spriteHeight
            // 預設 paletteName/musicName
            if (!paletteName && paletteList && typeof mainPaletteIndex === 'number' && paletteList[mainPaletteIndex]) {
                paletteName = paletteList[mainPaletteIndex].name
            }
            if (!musicName && musicList && musicList[0]) {
                musicName = musicList[0].name
            }
            return {
                name,
                type,
                paletteName,
                musicName,
                roomWidth,
                roomHeight,
                spriteWidth,
                spriteHeight,
                width,
                height,
                frameList: frameList || [Array(width * height).fill(0)],
                scriptList: {
                    'on-show': scriptList['on-show'] || '',
                    'on-hide': scriptList['on-hide'] || ''
                }
            }
        } else if (type === 'face') {
            let width = spriteWidth * 2
            let height = spriteHeight * 2
            return {
                name,
                type,
                isTransparent: false, // 只有 face 有 isTransparent 屬性
                spriteWidth,
                spriteHeight,
                width,
                height,
                frameList: frameList || [Array(width * height).fill(0)]
            }
        }
    },

    add: function(that, graphic) {
        let graphicList = (that.state.graphicList || []).slice()
        // 若 paletteName/musicName 為空，自動補預設值
        if (graphic.type === 'picture') {
            if (!graphic.paletteName && that.state.paletteList && typeof that.state.mainPaletteIndex === 'number' && that.state.paletteList[that.state.mainPaletteIndex]) {
                graphic.paletteName = that.state.paletteList[that.state.mainPaletteIndex].name
            }
            if (!graphic.musicName && that.state.musicList && that.state.musicList[0]) {
                graphic.musicName = that.state.musicList[0].name
            }
        }
        graphic = !(graphic instanceof MouseEvent) ? deepClone(graphic) :
            Graphic.create({ name: 'graphic-1', paletteList: that.state.paletteList, mainPaletteIndex: that.state.mainPaletteIndex, musicList: that.state.musicList })
        // 取得唯一名稱
        let baseName = graphic.name
        let number = parseInt(baseName.split('-').slice(-1)[0])
        if (isInt(number)) {
            let numberLength = (number).toString().length + 1
            baseName = baseName.slice(0, -numberLength)
        } else {
            number = 2
        }
        while (graphicList.find(g => g.name === graphic.name)) {
            graphic.name = baseName + '-' + number
            number++
        }
        graphicList.push(graphic)
        let currentGraphicIndex = graphicList.length - 1
        that.setCurrentTab && that.setCurrentTab('graphic')
        that.setState({ graphicList, currentGraphicIndex })
    },

    import: (that, graphicData) => {
        try {
            let graphic = JSON.parse(graphicData)
            
            // ====== 基本屬性驗證 ======
            // 型別檢查
            if (graphic.type !== 'picture' && graphic.type !== 'face') {
                throw('type 必須是 picture 或 face！')
            }
            
            // 名稱檢查
            if (typeof graphic.name !== 'string' || graphic.name.trim() === '') {
                throw('圖片名稱不能為空！')
            }
            
            // 檢查名稱是否已存在
            let graphicList = (that.state.graphicList || [])
            if (graphicList.find(g => g.name === graphic.name)) {
                throw(`圖片名稱 "${graphic.name}" 已存在！`)
            }
            
            // ====== 尺寸驗證 ======
            // 檢查基本尺寸屬性
            if (typeof graphic.spriteWidth !== 'number' || graphic.spriteWidth <= 0) {
                throw('spriteWidth 必須是正整數！')
            }
            if (typeof graphic.spriteHeight !== 'number' || graphic.spriteHeight <= 0) {
                throw('spriteHeight 必須是正整數！')
            }
            if (typeof graphic.width !== 'number' || graphic.width <= 0) {
                throw('width 必須是正整數！')
            }
            if (typeof graphic.height !== 'number' || graphic.height <= 0) {
                throw('height 必須是正整數！')
            }
            
            // 檢查尺寸是否與當前世界設定相符
            if (graphic.spriteWidth !== that.state.spriteWidth || graphic.spriteHeight !== that.state.spriteHeight) {
                throw(`精靈尺寸不符！當前世界設定為 ${that.state.spriteWidth}x${that.state.spriteHeight}，匯入的圖片為 ${graphic.spriteWidth}x${graphic.spriteHeight}`)
            }
            
            // ====== frameList 驗證 ======
            if (!Array.isArray(graphic.frameList) || graphic.frameList.length === 0) {
                throw('frameList 結構錯誤或為空！')
            }
            if (!graphic.frameList.every(f => Array.isArray(f))) {
                throw('frameList 內容必須都是陣列！')
            }
            if (!graphic.frameList.every(f => f.every(v => typeof v === 'number'))) {
                throw('frameList 內容必須都是數字！')
            }
            if (graphic.type === 'picture') {
                // 檢查房間尺寸屬性
                if (typeof graphic.roomWidth !== 'number' || graphic.roomWidth <= 0) {
                    throw('picture 必須有 roomWidth 屬性且為正整數！')
                }
                if (typeof graphic.roomHeight !== 'number' || graphic.roomHeight <= 0) {
                    throw('picture 必須有 roomHeight 屬性且為正整數！')
                }
                
                // 檢查房間尺寸是否與當前世界設定相符
                if (graphic.roomWidth !== that.state.roomWidth || graphic.roomHeight !== that.state.roomHeight) {
                    throw(`房間尺寸不符！當前世界設定為 ${that.state.roomWidth}x${that.state.roomHeight}，匯入的圖片為 ${graphic.roomWidth}x${graphic.roomHeight}`)
                }
                
                // 驗證尺寸計算
                let expectedWidth = graphic.roomWidth * graphic.spriteWidth
                let expectedHeight = graphic.roomHeight * graphic.spriteHeight
                if (graphic.width !== expectedWidth || graphic.height !== expectedHeight) {
                    throw(`插圖尺寸不符！預期 ${expectedWidth}x${expectedHeight}，實際 ${graphic.width}x${graphic.height}`)
                }
                
                // 檢查調色盤和音樂名稱
                if (typeof graphic.paletteName !== 'string' || graphic.paletteName.trim() === '') {
                    throw('picture 必須有 paletteName 屬性且不能為空！')
                }
                if (typeof graphic.musicName !== 'string' || graphic.musicName.trim() === '') {
                    throw('picture 必須有 musicName 屬性且不能為空！')
                }
                
                // 檢查 scriptList
                if (typeof graphic.scriptList !== 'object' || Array.isArray(graphic.scriptList)) {
                    throw('scriptList 必須是物件！')
                }
                if (typeof graphic.scriptList['on-show'] !== 'string') {
                    throw('scriptList["on-show"] 必須是字串！')
                }
                if (typeof graphic.scriptList['on-hide'] !== 'string') {
                    throw('scriptList["on-hide"] 必須是字串！')
                }
                
                // 不應有 isTransparent
                if ('isTransparent' in graphic) {
                    throw('picture 不應有 isTransparent 屬性！')
                }
            } else if (graphic.type === 'face') {
                // 驗證臉部尺寸計算
                let expectedWidth = graphic.spriteWidth * 2
                let expectedHeight = graphic.spriteHeight * 2
                if (graphic.width !== expectedWidth || graphic.height !== expectedHeight) {
                    throw(`臉部尺寸不符！預期 ${expectedWidth}x${expectedHeight}，實際 ${graphic.width}x${graphic.height}`)
                }
                
                // 必須有 isTransparent
                if (typeof graphic.isTransparent !== 'boolean') {
                    throw('face 必須有 isTransparent 屬性且為布林值！')
                }
                
                // 不應有 picture 專用屬性
                if ('paletteName' in graphic) {
                    throw('face 不應有 paletteName 屬性！')
                }
                if ('musicName' in graphic) {
                    throw('face 不應有 musicName 屬性！')
                }
                if ('scriptList' in graphic) {
                    throw('face 不應有 scriptList 屬性！')
                }
                if ('roomWidth' in graphic) {
                    throw('face 不應有 roomWidth 屬性！')
                }
                if ('roomHeight' in graphic) {
                    throw('face 不應有 roomHeight 屬性！')
                }
            }
            
            // ====== frame 大小驗證 ======
            let expectedFrameSize = graphic.width * graphic.height
            if (!graphic.frameList.every(f => f.length === expectedFrameSize)) {
                throw(`frame 大小與圖片尺寸不符！預期 ${expectedFrameSize} 像素，實際 ${graphic.frameList[0]?.length || 0} 像素`)
            }
            
            // ====== 驗證結束 ======
            Graphic.add(that, graphic)
        } catch (e) {
            console.error('無法導入圖片！', e)
            that.setState && that.setState({ showErrorOverlay: true, errorMessage: typeof e === 'string' ? e : '無法導入圖片！' })
        }
    },

    export: (that, graphicIndex) => {
        let graphic = deepClone((that.state.graphicList || [])[graphicIndex])
        // 如果是 face，移除 picture 專屬欄位，避免匯出時混入
        if (graphic && graphic.type === 'face') {
            delete graphic.paletteName;
            delete graphic.musicName;
            delete graphic.scriptList;
            delete graphic.roomWidth;
            delete graphic.roomHeight;
        }
        let graphicData = JSON.stringify(graphic)
        return graphicData
    },

    rename: (that, graphicIndex, newName) => {
        let graphicList = (that.state.graphicList || []).slice()
        let graphic = graphicList[graphicIndex]
        let oldName = graphic.name
        if (newName === '') {
            that.setState && that.setState({ showErrorOverlay: true, errorMessage: `圖片名稱不能為空!` })
        } else if (graphicList.find(g => g.name === newName)) {
            that.setState && that.setState({ showErrorOverlay: true, errorMessage: `其他圖片已經命名為 "${newName}"!` })
        } else {
            graphic.name = newName
            that.setState && that.setState({ graphicList })
        }
    },

    remove: (that, graphicIndex) => {
        let graphicList = (that.state.graphicList || []).slice()
        graphicList.splice(graphicIndex, 1)
        that.setState && that.setState({ graphicList })
    },

    resize: (graphic, newWidth, newHeight) => {
        let oldWidth = graphic.width
        let oldHeight = graphic.height
        graphic.frameList = graphic.frameList.map(frame => {
            let newFrame = Array(newWidth * newHeight).fill(0)
            for (let x = 0; x < oldWidth; x++) {
                for (let y = 0; y < oldHeight; y++) {
                    if (x < newWidth && y < newHeight) {
                        let oldIndex = y * oldWidth + x
                        let oldPixelData = frame[oldIndex]
                        let newIndex = y * newWidth + x
                        newFrame[newIndex] = oldPixelData
                    }
                }
            }
            return newFrame
        })
        graphic.width = newWidth
        graphic.height = newHeight
    },

    updateScript: function(that, graphicIndex, event, script) {
        let graphicList = that.state.graphicList.slice();
        let graphic = graphicList[graphicIndex];
        if (!graphic) return;
        if (!graphic.scriptList) graphic.scriptList = {};
        graphic.scriptList[event] = script;
        that.setState({ graphicList });
    },

    addFrame: function(that, graphicIndex, newFrame) {
        let graphicList = (that.state.graphicList || []).slice();
        let graphic = graphicList[graphicIndex];
        if (!graphic || !Array.isArray(graphic.frameList)) return;
        graphic.frameList = graphic.frameList.slice();
        graphic.frameList.push(newFrame);
        that.setState && that.setState({ graphicList });
    },

    removeFrame: function(that, graphicIndex, frameIndex) {
        let graphicList = (that.state.graphicList || []).slice();
        let graphic = graphicList[graphicIndex];
        if (!graphic || !Array.isArray(graphic.frameList)) return;
        graphic.frameList = graphic.frameList.slice();
        graphic.frameList.splice(frameIndex, 1);
        that.setState && that.setState({ graphicList });
    },

    updateFrame: function(that, graphicIndex, frameIndex, newFrame) {
        let graphicList = (that.state.graphicList || []).slice();
        let graphic = graphicList[graphicIndex];
        if (!graphic || !Array.isArray(graphic.frameList)) return;
        graphic.frameList = graphic.frameList.slice();
        graphic.frameList[frameIndex] = newFrame;
        that.setState && that.setState({ graphicList });
    },

    setIsTransparent: function(that, graphicIndex, newValue) {
        let graphicList = (that.state.graphicList || []).slice();
        let graphic = graphicList[graphicIndex];
        if (!graphic || graphic.type !== 'face') return; // 只有 face 才能設定 isTransparent
        graphic.isTransparent = newValue;
        that.setState && that.setState({ graphicList });
    },

    // 生成 GIF
    createGif: function(that, graphicIndex, scale, colorList, onComplete) {
        let graphicList = that.state.graphicList;
        let graphic = graphicList[graphicIndex];
        if (!graphic) return;
        let width = graphic.width * scale;
        let height = graphic.height * scale;
        let frameCount = 12;
        let frames = Array(frameCount).fill(0).map(() => Array(width * height).fill(0));
        frames.forEach((frame, i) => {
            let frameIndex = i % graphic.frameList.length;
            let graphicFrame = graphic.frameList[frameIndex];
            graphicFrame.forEach((pixel, j) => {
                if (!pixel) return;
                let pxOffset = Math.floor(j % graphic.width) * scale;
                let pyOffset = Math.floor(j / graphic.width) * scale;
                for (let x = 0; x < scale; x++) {
                    for (let y = 0; y < scale; y++) {
                        let pixelIndex = x + pxOffset + ((y + pyOffset) * width);
                        frame[pixelIndex] = pixel;
                    }
                }
            });
        });
        if (typeof FRAME_RATE === 'undefined') {
            // 若無全域 FRAME_RATE，預設 400
            window.FRAME_RATE = 400;
        }
        GIF.encode(width, height, frames, (typeof FRAME_RATE !== 'undefined' ? FRAME_RATE : window.FRAME_RATE), colorList, onComplete);
    }
}

// 輸出
if (typeof module !== 'undefined') module.exports = Graphic; 