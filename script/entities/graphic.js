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
            // 型別
            if (graphic.type !== 'picture' && graphic.type !== 'face') {
                throw('type 必須是 picture 或 face！')
            }
            // ====== 進階驗證 ======
            let graphicList = (that.state.graphicList || [])
            // 名稱檢查
            if (typeof graphic.name !== 'string' || graphic.name.trim() === '') {
                throw('圖片名稱不能為空！')
            }
            if (graphicList.find(g => g.name === graphic.name)) {
                throw(`圖片名稱 "${graphic.name}" 已存在！`)
            }
            // frameList 結構
            if (!Array.isArray(graphic.frameList) || graphic.frameList.length === 0) {
                throw('frameList 結構錯誤或為空！')
            }
            if (!graphic.frameList.every(f => Array.isArray(f))) {
                throw('frameList 內容必須都是陣列！')
            }
            // frameList 內容必須是數字
            if (!graphic.frameList.every(f => f.every(v => typeof v === 'number'))) {
                throw('frameList 內容必須都是數字！')
            }
            if (graphic.type === 'picture') {
                // 尺寸
                let width = graphic.roomWidth * graphic.spriteWidth
                let height = graphic.roomHeight * graphic.spriteHeight
                if (graphic.width !== width || graphic.height !== height) {
                    throw('插圖尺寸不符！')
                }
                // 必須有 paletteName/musicName
                if (typeof graphic.paletteName !== 'string') throw('paletteName 必須是字串！')
                if (typeof graphic.musicName !== 'string') throw('musicName 必須是字串！')
                // scriptList
                if (typeof graphic.scriptList !== 'object' || Array.isArray(graphic.scriptList)) {
                    throw('scriptList 必須是物件！')
                }
                if (typeof graphic.scriptList['on-show'] !== 'string' || typeof graphic.scriptList['on-hide'] !== 'string') {
                    throw('scriptList 內容必須是字串！')
                }
                // frame 大小
                if (!graphic.frameList.every(f => f.length === graphic.width * graphic.height)) {
                    throw('frame 大小與圖片尺寸不符！')
                }
                // 不應有 isTransparent
                if ('isTransparent' in graphic) {
                    throw('picture 不應有 isTransparent 屬性！')
                }
            } else if (graphic.type === 'face') {
                // 尺寸
                let width = graphic.spriteWidth * 2
                let height = graphic.spriteHeight * 2
                if (graphic.width !== width || graphic.height !== height) {
                    throw('臉部尺寸不符！')
                }
                // 必須有 isTransparent
                if (typeof graphic.isTransparent !== 'boolean') {
                    throw('face 必須有 isTransparent 屬性！')
                }
                // frame 大小
                if (!graphic.frameList.every(f => f.length === graphic.width * graphic.height)) {
                    throw('frame 大小與臉部尺寸不符！')
                }
                // 不應有 paletteName/musicName/scriptList
                if ('paletteName' in graphic) {
                    throw('face 不應有 paletteName 屬性！')
                }
                if ('musicName' in graphic) {
                    throw('face 不應有 musicName 屬性！')
                }
                if ('scriptList' in graphic) {
                    throw('face 不應有 scriptList 屬性！')
                }
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