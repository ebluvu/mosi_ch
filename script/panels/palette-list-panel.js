class PaletteListPanel extends Component {
    render ({ closeTab }) {
        return panel({ header: 'palettes', id: 'paletteListPanel', closeTab }, [
            h(PaletteList, this.props)
        ])
    }
}

class PaletteList extends Component {
    render ({
        selectPalette,
        addPalette,
        importPalette,
        currentPaletteIndex,
        paletteList = []
    }, {
        showImportOverlay
    }) {
        let paletteButtonList = paletteList
            .map((palette, i) => ({ palette, i }))
            .sort((a, b) => {
                // 按名稱排序
                let nameA = a.palette.name.toUpperCase()
                let nameB = b.palette.name.toUpperCase()
                if (nameA < nameB) return -1
                if (nameA > nameB) return 1
                return 0
            })
            .map(({ palette, i }) => {
                return paletteButton({
                    className: i === currentPaletteIndex ? 'initial-focus' : '',
                    onclick: () => {
                        selectPalette(i, 'palette')
                    },
                    isSelected: (i === currentPaletteIndex),
                    palette
                })
            })

        let addPaletteButton = !addPalette ? null :
            iconButton({
                title: 'new palette',
                onclick: addPalette
            }, 'add')

        let importPaletteButton = !importPalette ? null :
            iconButton({
                title: 'import palette',
                onclick: () => this.setState({ showImportOverlay: true })
            }, 'import')

        let importOverlay = !showImportOverlay ? null :
            h(ImportOverlay, {
                header: '匯入配色',
                onImport: data => {
                    importPalette(data)
                    this.setState({ showImportOverlay: false })
                },
                fileType: '.mosipalette',
                closeOverlay: () => this.setState({ showImportOverlay: false })
            })

        return div({ className: 'content' }, [
            row([
                importPaletteButton,
                fill(),
                addPaletteButton
            ]),
            hr(),
            div({ className: 'paletteList' }, [
                paletteButtonList
            ]),
            importOverlay
        ])
    }
}