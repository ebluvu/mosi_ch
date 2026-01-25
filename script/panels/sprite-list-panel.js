class SpriteListPanel extends Component {
    constructor() {
        super()
        this.state = {
            filter: '',
            category: 'all',
            selectedCustomGroupSpriteNames: [],
            showCustomGroupOverlay: false,
            showConfigureGroupOverlay: false,
            groupToConfigure: null,
            showEditSpritesOverlay: false
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.category && nextProps.category !== this.state.category) {
            this.setState({ category: nextProps.category })
        }
        if (nextProps.selectedCustomGroupSpriteNames) {
            this.setState({ selectedCustomGroupSpriteNames: nextProps.selectedCustomGroupSpriteNames })
        }
    }

    render ({
        selectSprite,
        editSprite,
        addSprite,
        importSprite,
        spriteList,
        currentSpriteIndex,
        colorList,
        hideAvatar,
        currentRoom,
        customSpriteGroups,
        addCustomGroup,
        removeCustomGroup,
        updateCustomGroup,
        importCustomGroups,
        showError
    }, {
        showImportOverlay,
        filter,
        category,
        selectedCustomGroupSpriteNames,
        showCustomGroupOverlay,
        showConfigureGroupOverlay,
        groupToConfigure
    }) {
        const setCategory = newCategory => {
            if (newCategory === 'custom') {
                this.setState({ showCustomGroupOverlay: true })
            } else {
                this.setState({ category: newCategory })
            }
        }

        const selectCustomGroup = groupName => {
            const group = customSpriteGroups.find(g => g.name === groupName);
            if (group) {
                // 過濾掉不存在的精靈
                const validNames = group.spriteNames.filter(name => spriteList.some(s => s.name === name));
                // 如果有差異就同步修正 customSpriteGroups
                if (validNames.length !== group.spriteNames.length && typeof updateCustomGroup === 'function') {
                    updateCustomGroup({ ...group, spriteNames: validNames });
                }
                this.setState({
                    category: 'custom',
                    selectedCustomGroupSpriteNames: validNames,
                    showCustomGroupOverlay: false,
                });
            }
        }

        let filterInput = textbox({
            placeholder: '搜尋精靈',
            value: filter,
            onchange: e => this.setState({ filter: e.target.value })
        })

        let filterButtons = div({ className: 'row', style: { 'justify-content': 'center', 'margin-top': '8px', 'align-items': 'center' }  }, [
            iconButton({ title: '全部', className: category === 'all' ? 'selected' : '', onclick: () => setCategory('all') }, 'world'),
            iconButton({ title: '房間', className: category === 'room' ? 'selected' : '', onclick: () => setCategory('room') }, 'room'),
            iconButton({ title: '精靈', className: category === 'sprite' ? 'selected' : '', onclick: () => setCategory('sprite') }, 'sprites'),
            iconButton({ title: '對話', className: category === 'dialog' ? 'selected' : '', onclick: () => setCategory('dialog') }, 'script'),
            iconButton({ title: '道具', className: category === 'item' ? 'selected' : '', onclick: () => setCategory('item') }, 'item'),
            iconButton({ title: '牆', className: category === 'wall' ? 'selected' : '', onclick: () => setCategory('wall') }, 'wall'),
            iconButton({ title: '自訂', className: category === 'custom' ? 'selected' : '', onclick: () => setCategory('custom') }, 'extras'),
            div({ style: { flex: 1 } }),
            iconButton({ title: '編輯', onclick: () => this.setState({ showEditSpritesOverlay: true }) }, 'edit')
        ])

        let spriteButtonList = spriteList
            // remember original indices
            .map((sprite, i) => ({ sprite, i }))
            // apply filter
            .filter(({ sprite }) => {
                if (filter && !sprite.name.includes(filter)) {
                    return false
                }

                switch (category) {
                    case 'all':
                        if (hideAvatar && sprite.isAvatar) return false
                        return true
                    case 'room': {
                        if (!currentRoom) return false
                        const roomSpriteNames = [...new Set(currentRoom.tileList.map(t => t.spriteName))]
                        return roomSpriteNames.includes(sprite.name)
                    }
                    case 'dialog':
                        if (!sprite.scriptList) return false
                        return (sprite.scriptList['on-push'] && sprite.scriptList['on-push'].trim()) || (sprite.scriptList['on-message'] && sprite.scriptList['on-message'].trim())
                    case 'sprite':
                        return !sprite.isAvatar && !sprite.isItem && !sprite.isWall
                    case 'item':
                        return sprite.isItem
                    case 'wall':
                        return sprite.isWall
                    case 'custom': {
                        return selectedCustomGroupSpriteNames.includes(sprite.name)
                    }
                    default:
                        return true
                }
            })
            // sort alphabetically, avatar is always first
            .sort((s1, s2) => {
                // 主角始終在第一位
                if (s1.sprite.isAvatar && !s2.sprite.isAvatar) return -1
                if (!s1.sprite.isAvatar && s2.sprite.isAvatar) return 1
                // 其他精靈按名稱排序
                let name1 = s1.sprite.name.toUpperCase()
                let name2 = s2.sprite.name.toUpperCase()
                if (name1 < name2) return -1
                if (name1 > name2) return 1
                else return 0
            })
            // convert to components
            .map(({ sprite, i }) =>
                spriteButton({
                    className: i === currentSpriteIndex ? 'initial-focus' : '',
                    onclick: () => {
                        if (currentSpriteIndex === i && editSprite) {
                            editSprite()
                        } else {
                            selectSprite(i, 'sprite')
                        }
                    },
                    sprite,
                    colorList,
                    isSelected: (i === currentSpriteIndex)
                })
            )

        let addSpriteButton = !addSprite ? null :
            iconButton({
                title: 'new sprite',
                onclick: addSprite
            }, 'add')

        let importSpriteButton = !importSprite ? null :
            iconButton({
                title: 'import sprite',
                onclick: () => this.setState({ showImportOverlay: true })
            }, 'import')

        let importOverlay = !showImportOverlay ? null :
            h(ImportOverlay, {
                header: '匯入精靈',
                onImport: data => {
                    importSprite(data)
                    this.setState({ showImportOverlay: false })
                },
                fileType: '.mosisprite',
                closeOverlay: () => this.setState({ showImportOverlay: false })
            })

        let customGroupOverlay = !showCustomGroupOverlay ? null :
            h(CustomGroupOverlay, {
                closeOverlay: () => this.setState({ showCustomGroupOverlay: false }),
                customSpriteGroups,
                addGroup: addCustomGroup,
                removeGroup: removeCustomGroup,
                selectGroup: selectCustomGroup,
                configureGroup: group => this.setState({ showConfigureGroupOverlay: true, groupToConfigure: group, showCustomGroupOverlay: false }),
                onImportGroups: importCustomGroups,
                showError: showError
            })
        
        let configureGroupOverlay = !showConfigureGroupOverlay ? null :
            h(ConfigureGroupOverlay, {
                closeOverlay: () => this.setState({ showConfigureGroupOverlay: false, groupToConfigure: null }),
                spriteList,
                updateGroup: updatedGroup => {
                    updateCustomGroup(updatedGroup)
                    this.setState({ showConfigureGroupOverlay: false, groupToConfigure: null, showCustomGroupOverlay: true })
                },
                groupToConfigure,
                colorList
            })

        let editSpritesOverlay = !this.state.showEditSpritesOverlay ? null :
            h(EditSpritesOverlay, {
                closeOverlay: () => this.setState({ showEditSpritesOverlay: false }),
                spriteList,
                colorList,
                removeSprites: this.props.removeSprites,
                duplicateSprites: this.props.duplicateSprites
            })

        return panel({ header: 'sprites', id: 'spriteListPanel', closeTab: this.props.closeTab }, [
            div({ className: 'content' }, [
                row([
                    importSpriteButton,
                    filterInput,
                    addSpriteButton
                ]),
                filterButtons,
                hr(),
                div({ className: 'spritelist' }, [
                    spriteButtonList
                ]),
                importOverlay,
                customGroupOverlay,
                configureGroupOverlay,
                editSpritesOverlay,
            ])
        ]);
    }
}

// 添加SpriteList組件，用於SpriteListOverlay
class SpriteList extends Component {
    constructor() {
        super()
        this.state = {
            filter: ''
        }
    }

    render({
        selectSprite,
        editSprite,
        addSprite,
        importSprite,
        spriteList,
        currentSpriteIndex,
        colorList,
        closeOverlay
    }, {
        filter
    }) {
        let spriteButtonList = spriteList
            // 應用搜尋過濾
            .filter(sprite => {
                if (filter && !sprite.name.includes(filter)) {
                    return false
                }
                return true
            })
            // 按名稱排序，主角始終在第一位
            .sort((s1, s2) => {
                // 主角始終在第一位
                if (s1.isAvatar && !s2.isAvatar) return -1
                if (!s1.isAvatar && s2.isAvatar) return 1
                // 其他精靈按名稱排序
                let name1 = s1.name.toUpperCase()
                let name2 = s2.name.toUpperCase()
                if (name1 < name2) return -1
                if (name1 > name2) return 1
                else return 0
            })
            .map((sprite, i) =>
                spriteButton({
                    className: i === currentSpriteIndex ? 'initial-focus' : '',
                    onclick: () => {
                        if (currentSpriteIndex === i && editSprite) {
                            editSprite()
                        } else {
                            selectSprite(i)
                        }
                        if (closeOverlay) closeOverlay()
                    },
                    sprite,
                    colorList,
                    isSelected: (i === currentSpriteIndex)
                })
            )

        let addSpriteButton = !addSprite ? null :
            iconButton({
                title: 'new sprite',
                onclick: () => {
                    addSprite()
                    if (closeOverlay) closeOverlay()
                }
            }, 'add')

        let importSpriteButton = !importSprite ? null :
            iconButton({
                title: 'import sprite',
                onclick: () => {
                    importSprite()
                    if (closeOverlay) closeOverlay()
                }
            }, 'import')

        let filterInput = textbox({
            placeholder: '搜尋精靈',
            value: filter,
            onchange: e => this.setState({ filter: e.target.value })
        })

        return div({ className: 'content' }, [
            row([
                importSpriteButton,
                filterInput,
                addSpriteButton
            ]),
            hr(),
            div({ className: 'spritelist' }, [
                spriteButtonList
            ])
        ]);
    }
}

window.SpriteList = SpriteList;