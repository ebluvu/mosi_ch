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
            helpLink('play'),
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

    render({ dialogNodes, scriptInfo, closeTab }, { currentEvent }) {
        // 如果沒有scriptInfo，顯示「目前沒有對話」
        if (!scriptInfo) {
            return div({ className: 'dialog-panel' }, [
                div({ className: 'panel-header' }, [
                    span({}, '對話'),
                    span({}, button({
                        onclick: closeTab,
                        className: 'simple icon'
                    }, '×'))
                ]),
                div({ className: 'panel-content' }, [
                    div({ className: 'dialog-content' }, '（目前沒有對話）')
                ])
            ])
        }

        // 取得來源名稱
        let sourceName = ''
        if (scriptInfo.sourceType === 'sprite') {
            sourceName = scriptInfo.context && scriptInfo.context.sprite ? scriptInfo.context.sprite.name : '精靈'
        } else if (scriptInfo.sourceType === 'room') {
            sourceName = scriptInfo.context && scriptInfo.context.roomIndex !== undefined ? `房間 ${scriptInfo.context.roomIndex + 1}` : '房間'
        } else {
            sourceName = '世界'
        }

        // 建立事件按鈕（類似script-panel）
        let eventButtons = [
            button({
                className: 'simple fill' + (currentEvent === scriptInfo.eventName ? ' selected' : ''),
                onclick: () => this.setState({ currentEvent: scriptInfo.eventName })
            }, '> ' + scriptInfo.eventName.replace('-', ' ') + ' ★')
        ]

        return div({ className: 'dialog-panel' }, [
            div({ className: 'panel-header' }, [
                span({}, sourceName),
                span({}, button({
                    onclick: closeTab,
                    className: 'simple icon'
                }, '×'))
            ]),
            div({ className: 'panel-content' }, [
                row([
                    eventButtons
                ]),
                div({ className: 'dialog-content' }, [
                    div({ style: { fontFamily: 'monospace', whiteSpace: 'pre-wrap', background: '#f8f8f8', padding: 8, borderRadius: 4 } },
                        scriptInfo.script
                    )
                ])
            ])
        ])
    }
}
