class GraphicListPanel extends Component {
    constructor() {
        super()
        this.state = {
            filter: '',
            showImportOverlay: false
        }
    }

    render({
        selectGraphic,
        editGraphic,
        addGraphic,
        importGraphic,
        graphicList = [],
        currentGraphicIndex = 0,
        colorList = [],
        roomWidth = 12,
        roomHeight = 12,
        spriteWidth = 8,
        spriteHeight = 8,
        type = 'picture', // 由 props 控制
        onTypeChange = () => {},
        paletteList = []
    }, {
        filter,
        showImportOverlay
    }) {
        let filterInput = textbox({
            placeholder: '搜尋圖片',
            value: filter,
            onchange: e => this.setState({ filter: e.target.value })
        })

        let typeButtons = div({ className: 'row', style: { 'justify-content': 'center', 'margin-top': '8px', 'align-items': 'center' } }, [
            iconButton({ 
                title: '插圖', 
                className: type === 'picture' ? 'selected' : '', 
                onclick: () => {
                    onTypeChange('picture')
                }
            }, 'gif'),
            iconButton({ 
                title: '臉部', 
                className: type === 'face' ? 'selected' : '', 
                onclick: () => {
                    onTypeChange('face')
                }
            }, 'face')
        ])

        let filteredList = graphicList.filter(graphic => {
            if (graphic.type !== type) return false
            if (filter && !graphic.name.includes(filter)) return false
            return true
        }).sort((a, b) => {
            // 按名稱排序
            let nameA = a.name.toUpperCase()
            let nameB = b.name.toUpperCase()
            if (nameA < nameB) return -1
            if (nameA > nameB) return 1
            return 0
        })

        let addGraphicButton = !addGraphic ? null :
            iconButton({
                title: 'new graphic',
                onclick: () => {
                    let newGraphic = Graphic.create({ 
                        name: type === 'picture' ? 'picture-1' : 'face-1',
                        type,
                        roomWidth,
                        roomHeight,
                        spriteWidth,
                        spriteHeight
                    })
                    addGraphic(newGraphic)
                }
            }, 'add')

        let importGraphicButton = !importGraphic ? null :
            iconButton({
                title: 'import graphic',
                onclick: () => this.setState({ showImportOverlay: true })
            }, 'import')

        let importOverlay = !showImportOverlay ? null :
            h(GraphicImportOverlay, {
                onImport: data => {
                    importGraphic(data)
                    this.setState({ showImportOverlay: false })
                },
                closeOverlay: () => this.setState({ showImportOverlay: false })
            })

        let graphicGrid = h(GraphicGrid, {
            className: 'initial-focus',
            graphicList: filteredList, // 傳遞過濾後的列表
            currentGraphicIndex: (() => {
                // 如果過濾後的列表為空，直接返回 0
                if (filteredList.length === 0) return 0;
                
                // 確保 currentGraphicIndex 在有效範圍內
                if (currentGraphicIndex < 0 || currentGraphicIndex >= graphicList.length) {
                    // 如果 currentGraphicIndex 無效，找到第一個符合當前 type 的圖片
                    let firstMatchingIdx = graphicList.findIndex(g => g.type === type);
                    if (firstMatchingIdx >= 0) {
                        // 找到第一個符合 type 的圖片在過濾後列表中的位置
                        return filteredList.findIndex(g => g === graphicList[firstMatchingIdx]);
                    }
                    return 0;
                }
                
                // 先檢查當前選中的圖片是否在過濾後的列表中
                let idx = filteredList.findIndex(g => g === graphicList[currentGraphicIndex]);
                if (idx >= 0) return idx;
                
                // 如果當前選中的圖片不在過濾後的列表中，找到第一個符合當前 type 的圖片
                let firstMatchingIdx = graphicList.findIndex(g => g.type === type);
                if (firstMatchingIdx >= 0) {
                    // 找到第一個符合 type 的圖片在過濾後列表中的位置
                    return filteredList.findIndex(g => g === graphicList[firstMatchingIdx]);
                }
                
                // 如果都沒有，設為 0
                return 0;
            })(),
            onSelect: (filteredIdx) => {
                // 取得原始 graphicList 的 index
                const realIdx = graphicList.indexOf(filteredList[filteredIdx]);
                if (currentGraphicIndex === realIdx && editGraphic) {
                    editGraphic();
                } else {
                    selectGraphic(realIdx, 'graphic');
                }
            },
            type,
            colorList,
            paletteList, // 傳遞 paletteList
            gridWidth: 4,
            isAnimated: true // 啟用動畫預覽
        })

        let panelContent = [
            div({ className: 'row' }, [
                importGraphicButton,
                addGraphicButton,
                filterInput,
                typeButtons,
            ]),
            hr(),
            div({ className: 'grid-container' }, [
                graphicGrid,
            ]),
            importOverlay
        ];
        return panel({ header: 'graphics', id: 'graphicListPanel', closeTab: this.props.closeTab }, panelContent);
    }
}

if (typeof module !== 'undefined') module.exports = GraphicListPanel;
window.GraphicListPanel = GraphicListPanel;