let Font = {

    parse: (data) => {
        let name = ''
        let width
        let height
        let characterList = {}

        try {
            let lines = data.split(/\r\n?|\n/)
            let i = 0
            while (i < lines.length) {
                let line = lines[i].toLowerCase()
                let parts = line.split(' ')
                let header = parts[0]

                if (header === 'font') {
                    name = parts[1]
                }
                else if (header === 'size') {
                    width = parseInt(parts[1])
                    height = parseInt(parts[2])
                    if (isNaN(width) || isNaN(height)) {
                        throw('第' + i + '行字體大小無效')
                    }
                }
                else if (header === 'char' && width && height) {
                    let characterId = parseInt(parts[1])
                    if (isNaN(characterId)) {
                        throw('第' + i + '行的字元 ID 無效')
                    }
                    let character = Font.parseCharacter(lines, i + 1)
                    let characterSize = character.width ? character.width * character.height : width * height
                    if (character.data.length !== characterSize) {
                        throw('第' + i + '行字元大小錯誤')
                    }
                    characterList[characterId] = character
                }

                i++
            }
        } catch (e) {
            console.error('無法載入字體', e)
        }

        return {
            name,
            width,
            height,
            characterList
        }
    },

    parseCharacter: (lines, startingLine) => {
        let width
        let height
        let offsetX
        let offsetY
        let spacing
        let data = []

        let i = startingLine
        while (i < lines.length) {
            let line = lines[i].toLowerCase()
            let parts = line.split(' ')
            let header = parts[0]

            if (header === 'char_size') {
                width = parseInt(parts[1])
                height = parseInt(parts[2])
                if (isNaN(width) || isNaN(height)) {
                    throw('第' + i + '行的字元大小無效')
                }
            }
            else if (header === 'char_offset') {
                offsetX = parseInt(parts[1])
                offsetY = parseInt(parts[2])
                if (isNaN(offsetX) || isNaN(offsetY)) {
                    throw('第' + i + '行的字元偏移量無效')
                }
            }
            else if (header === 'char_spacing') {
                spacing = parseInt(parts[1])
                if (isNaN(spacing)) {
                    throw('第' + i + '行的字元間距無效')
                }
            }
            else if (line[0] === '0' || line[0] === '1') {
                for (let j = 0; j < line.length; j++) {
                    if (line[j] === '0') data.push(0)
                    else data.push(1)
                }
            }
            else {
                break
            }

            i++
        }

        let character = {
            width,
            height,
            offsetX,
            offsetY,
            spacing,
            data
        }

        if (isNaN(width)) delete character.width
        if (isNaN(height)) delete character.height
        if (isNaN(offsetX)) delete character.offsetX
        if (isNaN(offsetY)) delete character.offsetY
        if (isNaN(spacing)) delete character.spacing

        return character
    }

}
