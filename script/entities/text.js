let textScript = `
return {

    drawNode: ({ nodes, nodeIndex = 0, canvas, context, fontData, fontDirection, timestamp, bgX = 0, bgY = 0, charsSoFar = 0, maxChars, spacingSoFar = 0, currentLine = 0, linesPerPage = 2, defaultTextColor = 'white', bgWidth, world = null, palette = null }) => {
        if (window._mosiForceFullRender) maxChars = Infinity;
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
            if (node.actionName === 'delay') {
                charsSoFar += window.delayTimer
            } else {
                node.type = 'completed-action'
            }
        }

        // 新增：處理選擇節點
        if (node.type === 'choice') {
            let choiceList = node.choiceList || [];
            let currentIdx = window._mosiChoiceIndex || 0;
            let textScale = window.textScale || 2;
            let lineSpacing = textScale === 1 ? 1.5 : 2;
            let maxLines = 2;
            // 優先從世界數據中讀取，如果沒有則從 window 變數讀取
            if (world && typeof world.dialogMaxLines === 'number' && world.dialogMaxLines >= 2 && world.dialogMaxLines <= 10) {
                maxLines = world.dialogMaxLines
            } else if (typeof window.dialogMaxLines === 'number' && window.dialogMaxLines >= 2 && window.dialogMaxLines <= 10) {
                maxLines = window.dialogMaxLines
            }
            let linesPerPage = maxLines; // 使用設定的最大行數
            let availableLines = linesPerPage - currentLine;
            // 分頁顯示選項（考慮前面字串已佔用 currentLine 行）
            let startLine = Math.floor(currentIdx / availableLines) * availableLines;
            let endLine = Math.min(startLine + availableLines, choiceList.length);
            let leftPadding = fontData.width * textScale;
            let x = Math.floor(bgX + leftPadding);
            let y = Math.floor(bgY + currentLine * fontData.height * lineSpacing + fontData.height * textScale);
            // 分頁顯示選項
            if (currentIdx >= endLine) {
                startLine = currentIdx - linesPerPage + 1;
                endLine = currentIdx + 1;
            }
            let charsSoFar = 0;
            let allChars = choiceList.map(opt => opt.length + 1).reduce((a, b) => a + b, 0); // +1 for space/arrow
            for (let i = startLine; i < endLine; i++) {
                let opt = choiceList[i];
                let optText = opt;
                let optY = Math.floor(y + (i - startLine) * fontData.height * lineSpacing);
                let showChars = Math.max(0, Math.min(optText.length, (typeof maxChars === 'number' ? maxChars : -1) - charsSoFar));
                let displayText = optText.substring(0, showChars);
                // 畫選項文字
                Text.drawSeq(
                    context,
                    fontData,
                    fontDirection,
                    displayText,
                    defaultTextColor,
                    '',
                    x,
                    optY,
                    timestamp
                );
                // 箭頭
                if (i === currentIdx && showChars === optText.length) {
                    let arrowWidth = fontData.width * textScale;
                    let arrowHeight = fontData.height * textScale;
                    let positionOffset = textScale === 1 ? Math.floor(fontData.width * 0.25) : 0;
                    // x 位置：x1 在往左 2px，x2 維持原本
                    let arrowX = x - arrowWidth + 6 - (textScale === 1 ? 2 : 0);
                    // y 位置：x1 往下 1/3 格，x2 維持原本
                    let arrowY = Math.floor(
                        optY
                        + (fontData.height * textScale) / 2
                        - (arrowHeight / 2)
                        + (textScale === 1 ? arrowHeight / 3 : 0)
                    );
                    // 完全比照 drawContinueIndicator 的皮膚動畫寫法
                    let useWorld = world || (window.game && window.game.world);
                    let useSkin = useWorld && useWorld.textboxSkin;
                    let usePalette = palette || (useWorld && useWorld.paletteList ? useWorld.paletteList[useWorld.mainPaletteIndex] : null);
                    let frameCount = useSkin && useSkin.indicatorList ? useSkin.indicatorList.length : 1;
                    let frameIdx;
                    if (typeof window._mosiChoiceArrowFrame === 'number') {
                        frameIdx = window._mosiChoiceArrowFrame % frameCount;
                    } else {
                        let now = Date.now();
                        frameIdx = Math.floor((now / 400) % frameCount);
                    }
                    // 皮膚樣式時才加 positionOffset
                    if (useSkin) {
                        arrowX += positionOffset;
                        arrowY += positionOffset;
                    }
                    Text.drawContinueIndicator(
                        context,
                        fontData,
                        arrowX,
                        arrowY,
                        arrowWidth,
                        arrowHeight,
                        defaultTextColor,
                        useWorld,
                        usePalette,
                        frameIdx
                    );
                }
                charsSoFar += optText.length + 1;
            }
            // 控制動畫跑完才能互動
            window._mosiChoiceCanInteract = ((typeof maxChars === 'number' ? maxChars : -1) >= allChars);
            // === 事件移除工具 ===
            function removeChoiceEventListeners() {
                let canvases = document.querySelectorAll('canvas');
                let textCanvas = canvases[1];
                if (textCanvas) {
                    textCanvas.removeEventListener('mousedown', window._mosiChoiceMouseDown);
                    textCanvas.removeEventListener('mousemove', window._mosiChoiceMouseMove);
                    textCanvas.removeEventListener('mouseup', window._mosiChoiceMouseUp);
                    textCanvas.style.pointerEvents = 'none'; // 讓事件能傳到主流程
                }
                window.removeEventListener('keydown', window._mosiChoiceKeyHandler);
                window.removeEventListener('touchstart', window._mosiChoiceTouchStart);
                window.removeEventListener('touchmove', window._mosiChoiceTouchMove);
                window.removeEventListener('touchend', window._mosiChoiceTouchEnd);
            }
            if (!node._mosiOnSelectWrapped) {
                let _originOnSelect = node.onSelect;
                node.onSelect = function(idx) {
                    if (_originOnSelect) _originOnSelect(idx);
                    window._mosiChoiceActive = false;
                    window._mosiForceFullRender = false;
                    setTimeout(() => {
                        removeChoiceEventListeners();
                        // === 立即移除本頁所有 node（字串+選項合併分頁） ===
                        if (Array.isArray(nodes) && typeof nodeIndex === 'number') {
                            let firstPageNode = nodeIndex;
                            while (firstPageNode > 0 && nodes[firstPageNode - 1].type !== 'page-break') {
                                firstPageNode--;
                            }
                            nodes.splice(firstPageNode, nodeIndex - firstPageNode + 1);
                        }
                        if (window.game && typeof window.game.progressDialog === 'function') {
                            window.game.pageIsComplete = true;
                            window.game.nextPageTimer = window.game.nextPageDelay;
                            window.game.progressDialog();
                        }
                    }, 0);
                };
                node._mosiOnSelectWrapped = true;
            }
            // 每次渲染都重新綁定keydown與pointer/touch事件
            window.removeEventListener('keydown', window._mosiChoiceKeyHandler);
            window.removeEventListener('touchstart', window._mosiChoiceTouchStart);
            window.removeEventListener('touchmove', window._mosiChoiceTouchMove);
            window.removeEventListener('touchend', window._mosiChoiceTouchEnd);
            window.removeEventListener('mousedown', window._mosiChoiceTouchStart);
            window.removeEventListener('mousemove', window._mosiChoiceTouchMove);
            window.removeEventListener('mouseup', window._mosiChoiceTouchEnd);

            let startX, startY, moved = false;
            window._mosiChoiceKeyHandler = function(e) {
                if (!window._mosiChoiceActive || !window._mosiChoiceCanInteract) return;
                let len = choiceList.length;
                if (e.key === 'ArrowUp' || e.key === 'w') {
                    window._mosiChoiceIndex = (window._mosiChoiceIndex + len - 1) % len;
                } else if (e.key === 'ArrowDown' || e.key === 's') {
                    window._mosiChoiceIndex = (window._mosiChoiceIndex + 1) % len;
                } else if (["Enter","z"," ","ArrowRight","d"].includes(e.key)) {
                    if (node.onSelect) node.onSelect(window._mosiChoiceIndex);
                    window._mosiChoiceActive = false;
                    // === 立即移除 choice 節點，直接推進 ===
                    if (Array.isArray(nodes) && typeof nodeIndex === 'number') {
                        nodes.splice(nodeIndex, 1);
                    }
                    if (window.game && typeof window.game.progressDialog === 'function') {
                        window.game.pageIsComplete = true;
                        window.game.nextPageTimer = window.game.nextPageDelay;
                        window.game.progressDialog();
                    }
                }
                if (window.game && typeof window.game.update === 'function') window.game.update();
            };
            // === Touch 狀態 ===
            let startX_touch = 0;
            let startY_touch = 0;
            let endX_touch = 0;
            let endY_touch = 0;
            // === Mouse 狀態 ===
            let startX_mouse, startY_mouse, moved_mouse = false;
            let mouseIsDown = false;
            // === Touch 事件 ===
            window._mosiChoiceTouchStart = function(e) {
                if (!window._mosiChoiceActive || !window._mosiChoiceCanInteract) return;
                if (!e.touches) return;
                e.preventDefault(); // 新增：防止外部頁面滾動
                window._mosiForceFullRender = true;
                let pointer = e.touches[0];
                startX_touch = pointer.clientX;
                startY_touch = pointer.clientY;
                endX_touch = pointer.clientX;
                endY_touch = pointer.clientY; // Initialize endY_touch
                moved_touch = false; // 這裡重設
                if (window.game && typeof window.game.update === 'function') window.game.update();
            };
            window._mosiChoiceTouchMove = function(e) {
                if (!window._mosiChoiceActive || !window._mosiChoiceCanInteract) return;
                if (!e.touches) return;
                e.preventDefault();
                let pointer = e.touches[0];
                endX_touch = pointer.clientX;
                endY_touch = pointer.clientY;
            };
            window._mosiChoiceTouchEnd = function(e) {
                if (!window._mosiChoiceActive || !window._mosiChoiceCanInteract) return;
                if (!e.changedTouches) return;
                e.preventDefault(); // 新增：防止外部頁面滾動
                window._mosiForceFullRender = false;
                let dx = endX_touch - startX_touch;
                let dy = endY_touch - startY_touch;
                let len = choiceList.length;
                if (dx > 30 && dx > Math.abs(dy) * 2) {
                    // 右滑確認
                    window._mosiChoiceKeyHandler({key: 'ArrowRight'});
                } else if (Math.abs(dy) > 20) {
                    if (dy > 0) {
                        // 下滑，選到下一個
                        window._mosiChoiceIndex = (window._mosiChoiceIndex + 1) % len;
                    } else {
                        // 上滑，選到上一個
                        window._mosiChoiceIndex = (window._mosiChoiceIndex + len - 1) % len;
                    }
                    if (window.game && typeof window.game.update === 'function') window.game.update();
                }
                moved_touch = false; // 這裡重設
            };
            // === Mouse 事件 ===
            window._mosiChoiceMouseDown = function(e) {
                e.stopPropagation();
                if (!window._mosiChoiceActive || !window._mosiChoiceCanInteract) return;
                if (e.button !== 0) return; // 只處理左鍵
                window._mosiForceFullRender = true;
                startX_mouse = e.clientX;
                startY_mouse = e.clientY;
                moved_mouse = false;
                mouseIsDown = true; // 新增
                if (window.game && typeof window.game.update === 'function') window.game.update();
            };
            window._mosiChoiceMouseMove = function(e) {
                e.stopPropagation();
                if (!window._mosiChoiceActive || !window._mosiChoiceCanInteract) return;
                if (!mouseIsDown) return; // 新增：只有按下時才切換
                if (typeof startY_mouse !== 'number') return;
                let dy = e.clientY - startY_mouse;
                let len = choiceList.length;
                if (Math.abs(dy) > 20 && !moved_mouse) {
                    if (dy > 0) {
                        window._mosiChoiceIndex = (window._mosiChoiceIndex + 1) % len;
                    } else {
                        window._mosiChoiceIndex = (window._mosiChoiceIndex + len - 1) % len;
                    }
                    moved_mouse = true;
                    if (window.game && typeof window.game.update === 'function') window.game.update();
                }
            };
            window._mosiChoiceMouseUp = function(e) {
                e.stopPropagation();
                if (!window._mosiChoiceActive || !window._mosiChoiceCanInteract) return;
                if (e.button !== 0) return;
                window._mosiForceFullRender = false;
                let dx = e.clientX - startX_mouse;
                if (dx > 30) {
                    window._mosiChoiceKeyHandler({key: 'ArrowRight'});
                }
                if (window.game && typeof window.game.update === 'function') window.game.update();
                moved_mouse = false;
                mouseIsDown = false; // 新增
            };
            // 只在 textCanvas 上註冊滑鼠事件
            let canvases = document.querySelectorAll('canvas');
            let textCanvas = canvases[1]; // 對話層 canvas
            if (textCanvas) {
                textCanvas.style.pointerEvents = '';
                if (textCanvas.focus) textCanvas.focus(); // 新增：自動 focus textCanvas
                textCanvas.addEventListener('mousedown', function(e){});
                textCanvas.addEventListener('mousedown', window._mosiChoiceMouseDown);
                textCanvas.addEventListener('mousemove', window._mosiChoiceMouseMove);
                textCanvas.addEventListener('mouseup', window._mosiChoiceMouseUp);
                // 新增：只在 textCanvas 上註冊 touch 事件
                textCanvas.addEventListener('touchstart', window._mosiChoiceTouchStart, { passive: false });
                textCanvas.addEventListener('touchmove', window._mosiChoiceTouchMove, { passive: false });
                textCanvas.addEventListener('touchend', window._mosiChoiceTouchEnd, { passive: false });
            }
            window.addEventListener('mousedown', function(e){});
            window.addEventListener('keydown', window._mosiChoiceKeyHandler);
            // 移除 window 上的 touch 事件監聽
            // window.addEventListener('touchstart', window._mosiChoiceTouchStart, { passive: false });
            // window.addEventListener('touchmove', window._mosiChoiceTouchMove, { passive: false });
            // window.addEventListener('touchend', window._mosiChoiceTouchEnd, { passive: false });
            // 動畫沒跑完時，return -1
            if ((typeof maxChars === 'number' ? maxChars : -1) < allChars) {
                return -1;
            }
            // 不繼續往下，等選擇後再繼續
            return -1;
        }

        // 動態調整 linesPerPage，但不會超過設定的最大值
        let maxLines = 2
        // 優先從世界數據中讀取，如果沒有則從 window 變數讀取
        if (world && typeof world.dialogMaxLines === 'number' && world.dialogMaxLines >= 2 && world.dialogMaxLines <= 10) {
            maxLines = world.dialogMaxLines
        } else if (typeof window.dialogMaxLines === 'number' && window.dialogMaxLines >= 2 && window.dialogMaxLines <= 10) {
            maxLines = window.dialogMaxLines
        }
        linesPerPage = Math.min(linesPerPage, maxLines)

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
            defaultTextColor,
            bgWidth,
            world,
            palette
        })
    },

    // 新增：計算實際文字行數的函數
    calculateActualLines: (nodes, fontData, bgWidth, textScale = 2) => {
        
        let actualLines = 2 // 最小值永遠是2行
        let currentLine = 0
        let spacingSoFar = 0
        let leftPadding = fontData.width * textScale
        let rightPadding = fontData.width * textScale
        let pageWidth = bgWidth - leftPadding - rightPadding
        
        // 根據 textScale 調整字元寬度計算
        let adjustedFontWidth = fontData.width * textScale
        
        // 過濾掉 completed-action 節點，只計算當前頁面的文字
        let currentPageNodes = []
        let foundPageBreak = false
        for (let node of nodes) {
            if (node.type === 'completed-action') {
                continue // 跳過已完成的動作
            }
            if (node.type === 'page-break') {
                foundPageBreak = true
                break // 遇到分頁就停止
            }
            currentPageNodes.push(node)
        }
        
        // 如果沒有找到 page-break，說明這是當前頁面的所有內容
        if (!foundPageBreak) {
            // 但是我們需要檢查是否有動作會導致分頁
            let hasPageAction = currentPageNodes.some(node => 
                node.type === 'action' && (node.actionName === 'p' || node.actionName === 'page')
            );
            if (hasPageAction) {
                // 找到第一個分頁動作的位置
                let pageActionIndex = currentPageNodes.findIndex(node => 
                    node.type === 'action' && (node.actionName === 'p' || node.actionName === 'page')
                );
                if (pageActionIndex !== -1) {
                    currentPageNodes = currentPageNodes.slice(0, pageActionIndex);
                }
            }
        }
        
        
        for (let node of currentPageNodes) {
            if (node.type === 'text') {
                let words = node.text.split(/\\s+/)
                let startWithSpace = node.text.startsWith(' ')
                
                for (let i = 0; i < words.length; i++) {
                    let word = words[i]
                    if (!word) continue
                    
                    if ((i > 0 || startWithSpace) && spacingSoFar > 0) word = ' ' + word
                    
                    let wordWidth = Text.textWidth(fontData, word)
                    let spaceLeftOnLine = pageWidth - spacingSoFar
                    
                    if (wordWidth <= spaceLeftOnLine || spacingSoFar === 0) {
                        spacingSoFar += wordWidth
                    } else {
                        // 換行
                        currentLine += 1
                        spacingSoFar = wordWidth
                        actualLines = Math.max(actualLines, currentLine + 1)
                    }
                }
            } else if (node.type === 'line-break') {
                currentLine += 1
                spacingSoFar = 0
                actualLines = Math.max(actualLines, currentLine + 1)
            } else if (node.type === 'choice') {
                // 處理 choice 節點，計算選項需要的行數
                let choiceList = node.choiceList || [];
                let maxLines = 2;
                // 優先從世界數據中讀取，如果沒有則從 window 變數讀取
                if (typeof window.dialogMaxLines === 'number' && window.dialogMaxLines >= 2 && window.dialogMaxLines <= 10) {
                    maxLines = window.dialogMaxLines;
                }
                // 計算選項需要的行數（考慮前面文字已佔用的行數）
                let availableLines = maxLines - currentLine;
                let choiceLines = Math.min(choiceList.length, availableLines);
                if (choiceLines > 0) {
                    currentLine += choiceLines;
                    actualLines = Math.max(actualLines, currentLine);
                }
            }
        }
        
        return actualLines
    },

    drawBackground: (context, fontData, position, linesPerPage = 2, bgColor = 'black', world = null, palette = null, actualLines = null) => {
        
        // 新增：根據 window._mosiDialogAlpha 控制對話框透明度
        if (typeof window !== 'undefined' && typeof window._mosiDialogAlpha !== 'undefined') {
            context.globalAlpha = window._mosiDialogAlpha;
        } else {
            context.globalAlpha = 1;
        }
        
        // 動態計算實際需要的行數
        let maxLines = 2
        // 優先從世界數據中讀取，如果沒有則從 window 變數讀取
        if (world && typeof world.dialogMaxLines === 'number' && world.dialogMaxLines >= 2 && world.dialogMaxLines <= 10) {
            maxLines = world.dialogMaxLines
        } else if (typeof window.dialogMaxLines === 'number' && window.dialogMaxLines >= 2 && window.dialogMaxLines <= 10) {
            maxLines = window.dialogMaxLines
        }
        
        // 預設為2行，只有在實際需要更多行時才增加高度
        let actualLinesPerPage = 2
        if (actualLines && actualLines > 2) {
            actualLinesPerPage = Math.min(actualLines, maxLines)
        }
        
        
        if (world && world.textboxSkin) {
            // 只認 top/bottom/fullscreen，否則什麼都不畫
            let pos = typeof window.textPosition === 'string' ? window.textPosition : undefined
            if (pos !== 'top' && pos !== 'bottom' && pos !== 'fullscreen' && pos !== 'center') {
                return { bgX: 0, bgY: 0, bgWidth: 0, bgHeight: 0 }
            }
            let skin = world.textboxSkin
            let bgWidth = context.canvas.width - (fontData.width * 2)
            let textScale = window.textScale || 2
            let bgHeightMultiplier = textScale === 1 ? (actualLinesPerPage <= 2 ? (actualLinesPerPage * 2 + 0.5) : (actualLinesPerPage * 1.5 + 1.5)) : (actualLinesPerPage * 2 + 3)
            let bgHeight = Math.floor(fontData.height * bgHeightMultiplier)
            let bgX = fontData.width
            let bgY
            if (pos === 'top') {
                bgY = fontData.width
            } else if (pos === 'bottom') {
                bgY = context.canvas.height - bgHeight - fontData.width
            } else if (pos === 'fullscreen') {
                // 背景九宮格鋪滿整個畫面
                let fw = skin.fontWidth, fh = skin.fontHeight
                let bgX = 0, bgY = 0
                let bgWidth = context.canvas.width
                let bgHeight = context.canvas.height
                let x0 = bgX, x1 = bgX + fw, x2 = bgX + bgWidth - fw
                let y0 = bgY, y1 = bgY + fh, y2 = bgY + bgHeight - fh
                // 四角
                Text.drawSkinBlock(context, skin.fillList[0], x0, y0, fw, fh, palette, skin.isTransparent)
                Text.drawSkinBlock(context, skin.fillList[2], x2, y0, fw, fh, palette, skin.isTransparent)
                Text.drawSkinBlock(context, skin.fillList[6], x0, y2, fw, fh, palette, skin.isTransparent)
                Text.drawSkinBlock(context, skin.fillList[8], x2, y2, fw, fh, palette, skin.isTransparent)
                // 上下邊（像素級平舖，最後一格 slice）
                for (let xx = x1; xx < x2; xx += fw) {
                    let w = Math.min(fw, x2 - xx)
                    // 上邊線
                    if (w < fw) {
                        let pixelData = skin.fillList[1]
                        let sliced = []
                        for (let row = 0; row < fh; row++) {
                            sliced.push(...pixelData.slice(row * fw, row * fw + w))
                        }
                        Text.drawSkinBlock(context, sliced, xx, y0, w, fh, palette, skin.isTransparent)
                    } else {
                        Text.drawSkinBlock(context, skin.fillList[1], xx, y0, fw, fh, palette, skin.isTransparent)
                    }
                    // 下邊線
                    if (w < fw) {
                        let pixelData = skin.fillList[7]
                        let sliced = []
                        for (let row = 0; row < fh; row++) {
                            sliced.push(...pixelData.slice(row * fw, row * fw + w))
                        }
                        Text.drawSkinBlock(context, sliced, xx, y2, w, fh, palette, skin.isTransparent)
                    } else {
                        Text.drawSkinBlock(context, skin.fillList[7], xx, y2, fw, fh, palette, skin.isTransparent)
                    }
                }
                // 左右邊
                for (let yy = y1; yy < y2; yy += fh) {
                    let h = Math.min(fh, y2 - yy)
                    Text.drawSkinBlock(context, skin.fillList[3], x0, yy, fw, h, palette, skin.isTransparent)
                    Text.drawSkinBlock(context, skin.fillList[5], x2, yy, fw, h, palette, skin.isTransparent)
                }
                // 中間
                for (let xx = x1; xx < x2; xx += fw) {
                    let w = Math.min(fw, x2 - xx)
                    for (let yy = y1; yy < y2; yy += fh) {
                        let h = Math.min(fh, y2 - yy)
                        Text.drawSkinBlock(context, skin.fillList[4], xx, yy, w, h, palette, skin.isTransparent)
                    }
                }
                // 讓文字區塊置中，回傳和 center 分支一致的 bgX/bgY/bgWidth/bgHeight
                let textBgX = fontData.width
                let textBgWidth = context.canvas.width - (fontData.width * 2)
                let textScale = window.textScale || 2
                let bgHeightMultiplier = textScale === 1 ? (actualLinesPerPage <= 2 ? (actualLinesPerPage * 2 + 0.5) : (actualLinesPerPage * 1.5 + 1.5)) : (actualLinesPerPage * 2 + 3)
                let textBgHeight = Math.floor(fontData.height * bgHeightMultiplier)
                let textBgY = Math.floor(context.canvas.height / 2 - textBgHeight / 2)
                return { bgX: textBgX, bgY: textBgY, bgWidth: textBgWidth, bgHeight: textBgHeight }
            } else if (pos === 'center') {
                bgY = Math.floor(context.canvas.height / 2 - bgHeight / 2)
            } else {
                return { bgX: 0, bgY: 0, bgWidth: 0, bgHeight: 0 }
            }
            // 九宮格座標
            let fw = skin.fontWidth, fh = skin.fontHeight
            let x0 = bgX, x1 = bgX + fw, x2 = bgX + bgWidth - fw
            let y0 = bgY, y1 = bgY + fh, y2 = bgY + bgHeight - fh
            let wMid = bgWidth - fw * 2, hMid = bgHeight - fh * 2
            Text.drawSkinBlock(context, skin.fillList[0], x0, y0, fw, fh, palette, skin.isTransparent)
            Text.drawSkinBlock(context, skin.fillList[2], x2, y0, fw, fh, palette, skin.isTransparent)
            Text.drawSkinBlock(context, skin.fillList[6], x0, y2, fw, fh, palette, skin.isTransparent)
            Text.drawSkinBlock(context, skin.fillList[8], x2, y2, fw, fh, palette, skin.isTransparent)
            // 上下邊線（像素級平舖，最後一格 slice）
            for (let xx = x1; xx < x2; xx += fw) {
                let w = Math.min(fw, x2 - xx)
                // 上邊線
                if (w < fw) {
                    let pixelData = skin.fillList[1]
                    let sliced = []
                    for (let row = 0; row < fh; row++) {
                        sliced.push(...pixelData.slice(row * fw, row * fw + w))
                    }
                    Text.drawSkinBlock(context, sliced, xx, y0, w, fh, palette, skin.isTransparent)
                } else {
                    Text.drawSkinBlock(context, skin.fillList[1], xx, y0, fw, fh, palette, skin.isTransparent)
                }
                // 下邊線
                if (w < fw) {
                    let pixelData = skin.fillList[7]
                    let sliced = []
                    for (let row = 0; row < fh; row++) {
                        sliced.push(...pixelData.slice(row * fw, row * fw + w))
                    }
                    Text.drawSkinBlock(context, sliced, xx, y2, w, fh, palette, skin.isTransparent)
                } else {
                    Text.drawSkinBlock(context, skin.fillList[7], xx, y2, fw, fh, palette, skin.isTransparent)
                }
            }
            // 左右邊線
            for (let yy = y1; yy < y2; yy += fh) {
                let h = Math.min(fh, y2 - yy)
                Text.drawSkinBlock(context, skin.fillList[3], x0, yy, fw, h, palette, skin.isTransparent)
                Text.drawSkinBlock(context, skin.fillList[5], x2, yy, fw, h, palette, skin.isTransparent)
            }
            // 中間
            for (let xx = x1; xx < x2; xx += fw) {
                let w = Math.min(fw, x2 - xx)
                for (let yy = y1; yy < y2; yy += fh) {
                    let h = Math.min(fh, y2 - yy)
                    Text.drawSkinBlock(context, skin.fillList[4], xx, yy, w, h, palette, skin.isTransparent)
                }
            }
            return { bgX, bgY, bgWidth, bgHeight }
        }
        let bgWidth = context.canvas.width - (fontData.width * 2)
        let textScale = window.textScale || 2
        // 對話背景高度：x1 = 2行以下用原公式，3行以上用平緩公式，x2 = actualLinesPerPage * 2 + 3
        let bgHeightMultiplier = textScale === 1 ? (actualLinesPerPage <= 2 ? (actualLinesPerPage * 2 + 0.5) : (actualLinesPerPage * 1.5 + 1.5)) : (actualLinesPerPage * 2 + 3)
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

    drawContinueIndicator: (context, fontData, bgX, bgY, bgWidth, bgHeight, indicatorColor = 'white', world = null, palette = null, frameIndex = null) => {
        if (world && world.textboxSkin) {
            let skin = world.textboxSkin
            // 箭頭動畫幀數
            let frameCount = skin.indicatorList.length
            let frameIdx
            if (typeof frameIndex === 'number') {
                frameIdx = frameIndex % frameCount
            } else {
                let now = Date.now()
                frameIdx = Math.floor((now / 400) % frameCount)
            }
            let indicator = skin.indicatorList[frameIdx]
            let fw = skin.fontWidth, fh = skin.fontHeight
            // 箭頭位置（右下角，與原本邏輯一致）
            let textScale = window.textScale || 2
            // x1 不縮小，x2 正常
            let indicatorWidth = textScale === 1 ? fw : fw
            let indicatorHeight = textScale === 1 ? fh : fh
            let positionOffset = textScale === 1 ? Math.floor(fw * 0.5) : 0
            let indicatorX = bgX + bgWidth - fw - indicatorWidth + positionOffset
            let indicatorY = bgY + bgHeight - fh - indicatorHeight + positionOffset
            Text.drawSkinBlock(context, indicator, indicatorX, indicatorY, indicatorWidth, indicatorHeight, palette, world.isTransparent)
            return
        }
        // 預設分支
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
                    // 只亂碼，不偏移
                    // styleX += Math.floor(Math.random() * width / 10)
                    // styleY += Math.floor(Math.random() * height / 10)
                    // 200% 機率亂碼
                    if (Math.random() < 2) {
                        // 隨機選擇不同類型的亂碼字符
                        let glitchType = Math.random()
                        if (glitchType < 0.2) {
                            // 20%：特殊符號
                            const specials = [0x21,0x22,0x23,0x24,0x25,0x26,0x27,0x28,0x29,0x2A,0x2B,0x2C,0x2D,0x2E,0x2F,0x40,0x5E,0x5F,0x60,0x7E,0xA1,0xB1,0xB6,0xBF,0xD7,0xF7]
                            charCode = specials[Math.floor(Math.random()*specials.length)]
                        } else if (glitchType < 0.4) {
                            // 20%：希臘字母
                            charCode = 0x391 + Math.floor(Math.random() * 25) // Α-Ω
                        } else if (glitchType < 0.6) {
                            // 20%：數學符號
                            const math = [0x221E,0x2202,0x220F,0x2211,0x221A,0x222B,0x2248,0x2260,0x2264,0x2265,0x2295,0x2297,0x22A5,0x22C5]
                            charCode = math[Math.floor(Math.random()*math.length)]
                        } else if (glitchType < 0.8) {
                            // 20%：貨幣符號
                            const currency = [0x24,0xA2,0xA3,0xA4,0xA5,0x20AC,0x20A9,0x20B9]
                            charCode = currency[Math.floor(Math.random()*currency.length)]
                        } else {
                            // 20%：幾何圖形與花式符號
                            const misc = [0x25A0,0x25A1,0x25B2,0x25B3,0x25BC,0x25BD,0x25C6,0x25C7,0x25CB,0x25CF,0x25CE,0x25C8,0x25C9,0x25CA,0x25CC,0x2605,0x2606,0x2660,0x2663,0x2665,0x2666,0x266A,0x266B,0x266C,0x266D,0x266F,0x2736,0x273A,0x2744,0x2756,0x2764]
                            charCode = misc[Math.floor(Math.random()*misc.length)]
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
    },

    // === 將 drawSkinBlock 移入 Text 物件 ===
    drawSkinBlock: function(context, pixelData, x, y, w, h, palette, isTransparent = true) {
        for (let cy = 0; cy < h; cy++) {
            for (let cx = 0; cx < w; cx++) {
                let idx = cy * w + cx
                let val = pixelData[idx]
                if ((isTransparent && val) || (!isTransparent && typeof val === 'number')) {
                    if (palette && typeof palette.colorList[val] !== 'undefined') {
                        context.fillStyle = palette.colorList[val]
                        context.fillRect(x + cx, y + cy, 1, 1)
                    }
                }
            }
        }
    }

}
`

let generateTextScript = new Function(textScript)
let Text = generateTextScript()
