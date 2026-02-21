class WelcomePanel extends Component {
    render({ closeTab, getStarted }) {
        return panel({ header: 'welcome', id: 'welcomePanel', closeTab }, [
            div({ className: 'welcome-logo' }, [
                img({ src: 'images/logo.png' })
            ]),
            div({ className: 'welcome-links' }, [
                h('strong', {}, '版本 ' + VERSION),
                h('br'),
                span({}, '新增了一些新指令，修復了一些錯誤')
            ]),
            div({ className: 'welcome-links' }, [
                link({ href: 'https://ebluvu.notion.site/mosi' }, '教學'),
                ' | ',
                link({ href: 'https://ebluvu.notion.site/wiki-log' }, '需要修正?')
            ]),
            row([
                button({
                    className: 'initial-focus fill',
                    onclick: getStarted
                }, `現在就開始吧!`)
            ])
        ])
    }
}