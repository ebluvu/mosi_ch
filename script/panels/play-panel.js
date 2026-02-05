class PlayPanel extends Component {
    componentDidMount() {
        this.game = new Game(deepClone(this.props.world), this.gameWrapper)
        this.game.setInventoryChangeCallback(inv => this.setState({ playInventory: inv }))
        this.game.setVariablesChangeCallback(vars => this.setState({ playVariables: vars }))
        this.game.setDialogChangeCallback((dialogNodes, scriptInfo) => this.setState({ currentDialogNodes: dialogNodes, lastDialogScriptInfo: scriptInfo }))
        this.game.begin()
    }

    componentWillUnmount() {
        this.game.end()
    }

    constructor(props) {
        super(props)
        this.state = {
            sidePanel: null, // 'inventory' | 'dialog' | null
            playInventory: null,
            playVariables: null,
            currentDialogNodes: [],
            lastDialogScriptInfo: null
        }
    }

    handleSidePanel(panel) {
        this.setState(state => ({ sidePanel: state.sidePanel === panel ? null : panel }))
    }

    render({ closeTab, world }, { showShareOverlay, playInventory, playVariables, sidePanel, currentDialogNodes, lastDialogScriptInfo }) {
        let shareOverlay = !showShareOverlay ? null :
            h(ShareOverlay, {
                closeOverlay: () => this.setState({ showShareOverlay: false }),
                world
            })

        // header row with panel toggle buttons
        let panelButtons = [
            iconButton({
                className: 'simple' + (sidePanel === 'inventory' ? ' selected' : ''),
                title: '只供檢視清單',
                onclick: () => this.handleSidePanel('inventory')
            }, 'list'),
            iconButton({
                className: 'simple' + (sidePanel === 'dialog' ? ' selected' : ''),
                title: '只供檢視對話',
                onclick: () => this.handleSidePanel('dialog')
            }, 'script')
        ]

        // decide which side panel to show
        let sidePanelNode = null
        if (sidePanel === 'inventory') {
            sidePanelNode = div({ className: 'side-panel' }, [
                h(InventoryPanel, {
                    spriteList: world.spriteList,
                    inventory: playInventory || world.inventory,
                    variables: playVariables || world.variables,
                    readOnly: true,
                    closeTab: () => this.setState({ sidePanel: null })
                })
            ])
        } else if (sidePanel === 'dialog') {
            sidePanelNode = div({ className: 'side-panel' }, [
                h(DialogPanel, {
                    dialogNodes: currentDialogNodes,
                    scriptInfo: lastDialogScriptInfo,
                    world: world, // 傳遞world物件
                    closeTab: () => this.setState({ sidePanel: null })
                })
            ])
        }

        return div({ className: 'main' }, [
            div({ className: 'editor-header row' }, [
                iconButton({
                    className: 'simple',
                    onclick: closeTab
                }, 'back'),
                fill(),
                ...panelButtons,
                fill(),
                iconButton({
                    className: 'simple',
                    onclick: () => this.setState({ showShareOverlay: true })
                }, 'share')
            ]),
            div({ className: 'play-panel', style: { display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: '8px' } }, [
                div({
                    className: 'play-canvas',
                    ref: n => this.gameWrapper = n
                }),
                sidePanelNode
            ]),
            helpLink('81a516dbc0ee4b56b8c348c7ed25eebb'),
            shareOverlay
        ])
    }
}

class DialogPanel extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentEvent: props.scriptInfo ? props.scriptInfo.eventName : null
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.scriptInfo !== this.props.scriptInfo) {
            this.setState({ currentEvent: nextProps.scriptInfo ? nextProps.scriptInfo.eventName : null })
        }
    }

    render({ dialogNodes, scriptInfo, closeTab, world }, { currentEvent }) {
        // header內容
        let sourceName = ''
        if (!scriptInfo) {
            sourceName = '對話'
        } else if (scriptInfo.eventName === 'on-push' || scriptInfo.eventName === 'on-message') {
            sourceName = scriptInfo.context && scriptInfo.context.sprite ? scriptInfo.context.sprite.name : '精靈'
        } else if (scriptInfo.eventName === 'on-enter' || scriptInfo.eventName === 'on-exit') {
            const roomIndex = scriptInfo.context && scriptInfo.context.roomIndex
            sourceName = (roomIndex !== undefined && world && world.roomList && world.roomList[roomIndex])
                ? world.roomList[roomIndex].name
                : '房間'
        } else if (scriptInfo.eventName === 'on-show' || scriptInfo.eventName === 'on-hide') {
            const graphicIndex = scriptInfo.context && scriptInfo.context.graphicIndex
            sourceName = (graphicIndex !== undefined && world && world.graphicList && world.graphicList[graphicIndex])
                ? world.graphicList[graphicIndex].name
                : '插圖'
        } else if (scriptInfo.eventName === 'on-start') {
            sourceName = world && world.worldName ? world.worldName : '世界'
        } else {
            sourceName = '對話'
        }
        // 沒有對話時
        if (!scriptInfo) {
            return panel({ header: 'script', closeTab }, [
                '（目前沒有對話）'
            ])
        }
        // 有對話時
        let eventButtons = [
            button({
                className: 'simple fill' + (currentEvent === scriptInfo.eventName ? ' selected' : ''),
                onclick: () => this.setState({ currentEvent: scriptInfo.eventName })
            }, '> ' + sourceName + ' ★')
        ]
        return panel({ header: 'script', closeTab }, [
            row([
                eventButtons
            ]),
            div({
                style: {
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    background: '#f8f8f8',
                    padding: 8,
                    borderRadius: 4,
                    maxHeight: (window.innerWidth <= 600 ? '200px' : '400px'),
                    overflowY: 'scroll',
                    WebkitOverflowScrolling: 'touch'
                }
            },
                scriptInfo.script
            )
        ])
    }
}
