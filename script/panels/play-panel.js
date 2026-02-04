class PlayPanel extends Component {
    componentDidMount() {
        this.game = new Game(deepClone(this.props.world), this.gameWrapper)
        this.game.setInventoryChangeCallback(inv => this.setState({ playInventory: inv }))
        this.game.setVariablesChangeCallback(vars => this.setState({ playVariables: vars }))
        this.game.begin()
    }

    componentWillUnmount() {
        this.game.end()
    }

    render({ closeTab, world }, { showShareOverlay, playInventory, playVariables }) {

        let shareOverlay = !showShareOverlay ? null :
            h(ShareOverlay, {
                closeOverlay: () => this.setState({ showShareOverlay: false }),
                world
            })

        return div({ className: 'main' }, [
            div({ className: 'editor-header row' }, [
                iconButton({
                    className: 'simple',
                    onclick: closeTab
                }, 'back'),
                fill(),
                iconButton({
                    className: 'simple',
                    onclick: () => this.setState({ showShareOverlay: true })
                }, 'share')
            ]),
            div({ className: 'play-panel with-inventory' }, [
                div({
                    className: 'play-canvas',
                    ref: n => this.gameWrapper = n
                }),
                h(InventoryPanel, {
                    spriteList: world.spriteList,
                    inventory: playInventory || world.inventory,
                    variables: playVariables || world.variables,
                    readOnly: true
                })
            ]),
            helpLink('play'),
            shareOverlay
        ])

    }
}
