class InventoryPanel extends Component {
    constructor() {
        super()
        this.state = {
            tab: 'item',
            flashItems: {},
            flashVars: {},
            errorMessage: '',
            showVarOverlay: false,
            editingVar: null,
            showImportVarOverlay: false
        }
    }

    componentDidUpdate(prevProps) {
        // 只讀模式下，偵測 inventory/variables 數值變動，觸發閃爍
        if (this.props.readOnly) {
            // 道具
            let flashItems = {}
            let prevInv = prevProps.inventory || {}
            let currInv = this.props.inventory || {}
            Object.keys(currInv).forEach(name => {
                if (currInv[name] !== prevInv[name]) {
                    flashItems[name] = true
                    setTimeout(() => {
                        this.setState(state => {
                            let f = { ...state.flashItems }
                            delete f[name]
                            return { flashItems: f }
                        })
                    }, 500)
                }
            })
            // 變量
            let flashVars = {}
            let prevVars = prevProps.variables || {}
            let currVars = this.props.variables || {}
            Object.keys(currVars).forEach(name => {
                if (
                    !prevVars[name] ||
                    currVars[name].value !== prevVars[name]?.value ||
                    currVars[name].type !== prevVars[name]?.type
                ) {
                    flashVars[name] = true
                    setTimeout(() => {
                        this.setState(state => {
                            let f = { ...state.flashVars }
                            delete f[name]
                            return { flashVars: f }
                        })
                    }, 500)
                }
            })
            if (Object.keys(flashItems).length || Object.keys(flashVars).length) {
                this.setState({ flashItems, flashVars })
            }
        }
    }

    setTab(tab) {
        this.setState({ tab })
    }

    showError(msg) {
        this.setState({ errorMessage: msg })
        setTimeout(() => this.setState({ errorMessage: '' }), 2000)
    }

    openVarOverlay(varName) {
        this.setState({ showVarOverlay: true, editingVar: varName })
    }
    closeVarOverlay() {
        this.setState({ showVarOverlay: false, editingVar: null })
    }
    handleVarSave = (oldName, newName, type, value, shouldClose = false) => {
        let { variables, onRenameVariable, updateVariable } = this.props
        let oldValue = (variables[oldName] && typeof variables[oldName].value !== 'undefined') ? variables[oldName].value : (type === 'boolean' ? true : 0)
        let newValue = typeof value !== 'undefined' ? value : oldValue
        if (oldName !== newName && onRenameVariable) onRenameVariable(oldName, newName)
        updateVariable && updateVariable(newName, { value: newValue, type })
        if (shouldClose) this.setState({ showVarOverlay: false, editingVar: null })
    }
    handleVarDuplicate = (name, type) => {
        let { variables, updateVariable } = this.props
        let base = name + '-'
        let idx = 1
        let newName = base + idx
        while (variables[newName]) idx++
        newName = base + idx
        let value = (variables[name] && typeof variables[name].value !== 'undefined') ? variables[name].value : (type === 'boolean' ? true : 0)
        updateVariable && updateVariable(newName, { value, type })
        this.setState({ showVarOverlay: false, editingVar: null })
    }
    handleVarRemove = (name) => {
        let { onRemoveVariable } = this.props
        onRemoveVariable && onRemoveVariable(name)
        this.setState({ showVarOverlay: false, editingVar: null })
    }

    openImportVarOverlay = () => {
        this.setState({ showImportVarOverlay: true })
    }
    closeImportVarOverlay = () => {
        this.setState({ showImportVarOverlay: false })
    }
    handleImportVariables = (imported) => {
        let data
        try {
            data = typeof imported === 'string' ? JSON.parse(imported) : imported
        } catch (e) {
            this.showError('匯入格式錯誤！')
            return
        }
        if (!data || typeof data !== 'object') {
            this.showError('匯入格式錯誤！')
            return
        }
        // 升級結構
        let upgraded = {}
        for (let k in data) {
            let v = data[k]
            if (typeof v === 'object' && v !== null && 'value' in v && 'type' in v) {
                upgraded[k] = v
            } else {
                upgraded[k] = { value: v, type: typeof v === 'boolean' ? 'boolean' : 'number' }
            }
        }
        // 合併到現有變量
        let merged = { ...this.props.variables, ...upgraded }
        Object.keys(merged).forEach(name => {
            this.props.updateVariable && this.props.updateVariable(name, merged[name])
        })
        this.setState({ showImportVarOverlay: false })
    }

    render({ closeTab, spriteList = [], inventory = {}, variables = {}, readOnly = false, updateInventory, updateVariable, onRenameVariable, onRemoveVariable }) {
        // 道具清單
        let itemList = spriteList.filter(s => s.isItem)

        // 分頁按鈕
        let itemTabBtn = iconButton({
            className: 'simple' + (this.state.tab === 'item' ? ' selected' : ''),
            title: '道具',
            onclick: () => this.setTab('item')
        }, 'item')
        let variableTabBtn = iconButton({
            className: 'simple' + (this.state.tab === 'variable' ? ' selected' : ''),
            title: '變量',
            onclick: () => this.setTab('variable')
        }, 'random')

        // 道具頁內容
        let itemRows = itemList.map(item => {
            let count = typeof inventory[item.name] === 'number' ? inventory[item.name] : 0
            let flashClass = this.props.readOnly && this.state.flashItems[item.name] ? 'flash' : ''
            return row([
                span({ style: { flex: 1 } }, item.name),
                readOnly ?
                    span({ className: flashClass }, count) :
                    numbox({
                        value: count,
                        min: 0,
                        style: { width: '60px' },
                        onchange: e => updateInventory && updateInventory(item.name, parseInt(e.target.value) || 0)
                    })
            ])
        })
        if (itemRows.length === 0) itemRows = [span({}, '（尚無道具）')]

        // 變量頁內容
        let importVarButton = !readOnly && this.state.tab === 'variable' ? iconButton({
            title: '匯入變量',
            onclick: this.openImportVarOverlay
        }, 'import') : null
        let addVariableButton = !readOnly && this.state.tab === 'variable' ? iconButton({
            title: '新增變量',
            onclick: () => {
                // 自動產生唯一名稱 variable1, variable2...
                let base = 'variable'
                let idx = 1
                let name = base + idx
                while (variables.hasOwnProperty(name)) {
                    idx++
                    name = base + idx
                }
                updateVariable && updateVariable(name, { value: 0, type: 'number' })
            }
        }, 'add') : null
        let variableRows = Object.keys(variables).map(varName => {
            let variable = variables[varName]
            let value = variable && typeof variable.value !== 'undefined' ? variable.value : 0
            let type = variable && variable.type ? variable.type : (typeof value === 'boolean' ? 'boolean' : 'number')
            let nameInput = this.props.readOnly ?
                span({ style: { flex: 1 }, key: 'name-' + varName }, varName) :
                button({
                    key: 'name-' + varName,
                    style: { flex: 1 },
                    onclick: () => this.openVarOverlay(varName)
                }, varName)
            let flashClass = this.props.readOnly && this.state.flashVars[varName] ? 'flash' : ''
            let valueInput = this.props.readOnly ?
                span({ key: 'val-' + varName, className: flashClass }, value + (type === 'boolean' ? (value ? ' (True)' : ' (False)') : '')) :
                (type === 'number' ?
                    numbox({
                        key: 'val-' + varName,
                        value: value,
                        style: { width: '60px' },
                        onchange: e => this.props.updateVariable && this.props.updateVariable(varName, { value: parseInt(e.target.value) || 0, type })
                    }) :
                    button({
                        key: 'val-' + varName,
                        className: 'fill',
                        style: { flexBasis: 'min-content', flexGrow: 'inherit' },
                        onclick: () => this.props.updateVariable && this.props.updateVariable(varName, { value: !value, type })
                    }, value ? 'True' : 'False')
                )
            return row([
                nameInput,
                valueInput
            ])
        })
        if (variableRows.length === 0) variableRows = [span({}, '（尚無變量）')]

        // 主內容
        let content = this.state.tab === 'item' ? itemRows : [
            row([importVarButton, fill(), addVariableButton]),
            ...variableRows
        ]
        let errorOverlay = this.state.errorMessage ?
            h(ErrorOverlay, {
                errorMessage: this.state.errorMessage,
                closeOverlay: () => this.setState({ errorMessage: '' })
            }) : null
        let varOverlay = null
        if (this.state.showVarOverlay && this.state.editingVar) {
            let variable = variables[this.state.editingVar]
            varOverlay = h(VariableSettingOverlay, {
                closeOverlay: () => this.closeVarOverlay(),
                varName: this.state.editingVar,
                variable,
                variables,
                onSave: this.handleVarSave,
                onDuplicate: this.handleVarDuplicate,
                onRemove: this.handleVarRemove
            })
        }
        let importVarOverlay = this.state.showImportVarOverlay ?
            h(ImportOverlay, {
                header: '匯入變量',
                onImport: this.handleImportVariables,
                closeOverlay: this.closeImportVarOverlay
            }) : null
        return panel({ header: 'list', id: 'inventoryPanel', closeTab }, [
            row([
                itemTabBtn,
                variableTabBtn
            ]),
            hr(),
            div({ className: 'inventory-content' }, content),
            helpLink('21b642e52df08046ae60f61f0e9bf253'),
            varOverlay,
            importVarOverlay,
            errorOverlay
        ])
    }
} 