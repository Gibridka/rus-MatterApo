const Achievements = {
    'ach11': {
        title: `Измерения Материи?`,
        get desc() { return `Начни генерацию материи.` },
        check: () => hasUpgrade("M1"),
    },
    'ach12': {
        title: `О нет, все пропало! `,
        get desc() { return `Уничтожь всю материю.` },
    },
    'ach13': {
        title: `Балансирование Jacorb'а и RedShark'а в двух словах`,
        get desc() { return `Достигни <b>${format(1e100)}</b> материи.` },
        check: () => player.matter.gte(1e100),
        get reward() { return `<b>^1.05</b> к генерации материи.` },
    },
    'ach14': {
        title: `Наконец-то, а то я устал`,
        get desc() { return `Купи улучшение <b>UM3</b>.` },
        check: () => hasUpgrade("UM3"),
    },
    'ach15': {
        title: `Устранение в квадрате?!`,
        get desc() { return `Уничтожь нетрадиционную материю.` },
    },
    'ach16': {
        title: `У инфляции нет конца`,
        get desc() { return `Достигни <b>${format('ee25')}</b> материи.` },
        check: () => player.matter.gte('ee25'),
    },

    'ach21': {
        title: `Устранения больше нет, однако какой ценной`,
        get desc() { return `Купи улучшение <b>EM4</b>.` },
        check: () => hasUpgrade("EM4"),
    },
    'ach22': {
        title: `Так стоп, эта антиматерия опасна`,
        get desc() { return `Имей по крайней мере <b>целый день</b> роста антиматерии (примерн. <b>${format(getAntimatterGrowth(E(86400)))}</b> антиматерии).` },
        check: () => getAntimatterGrowth().gte(getAntimatterGrowth(E(86400))),
        get reward() { return `<b>Удвоение</b> скорости роста антиматерии и натуральной материи` },
    },
    'ach23': {
        title: `Неважно, мне не нравиться инфлянция`,
        get desc() { return `Достигни <b>${format('ee100')}</b> материи без покупки улучшения <b>M2</b>.` },
        check: () => player.matter.gte('ee100') && !hasUpgrade("M2"),
    },
    'ach24': {
        title: `Балансирование Jacorb'а и RedShark'а в двух словах II`,
        get desc() { return `Достигни всего <b>${format(1e100)}</b> нетрадиционной материи.` },
        check: () => player.unnatural.total.gte(1e100),
        get reward() { return `<b>^1.05</b> к нетрадиционной материи` },
    },
    'ach25': {
        title: `Ты можешь перестать уничтожать еще больше?`,
        get desc() { return `Уничтожь экзотическую материю.` },
    },
    'ach26': {
        title: `Ух, чую устранение будет полезным`,
        get desc() { return `Уничтожь экзотическую материю без покупки улучшения <b>EM4</b>.` },
        get reward() { return `Сохранение улучшение <b>EM4</b> при уничтожении экзотической материи и оно в <b>${formatMult(5)}</b> быстрее.` },
    },

    'ach31': {
        title: `Я запутался в наказаниях`,
        get desc() { return `Встреть <b>второе</b> темное наказание.` },
        check: () => tmp.dark_penalty[1],
    },
    'ach32': {
        title: `НАКОНЕЦ-ТО, БОЛЬШЕ НИКАКИХ УСТРАНЕНИЙ!`,
        get desc() { return `Получи улучшение <b>DM5</b>.` },
        check: () => hasUpgrade("DM5"),
    },
    'ach33': {
        title: `Балансирование Jacorb'а и RedShark'а в двух словах III`,
        get desc() { return `Достигни <b>${format(1e100)}</b> всего экзотической материи.` },
        check: () => player.exotic.total.gte(1e100),
        get reward() { return `<b>^1.05</b> к экзотической материи.` },
    },
    'ach34': {
        title: `Смысла в инфляции больше нет`,
        get desc() { return `Достигни <b>${format('eee100')}</b> материи.` },
        check: () => player.matter.gte('eee100'),
    },
    'ach35': {
        title: `<img src="style/bart.png">`,
        get desc() { return `Купите улучшение <b>DM8</b>.` },
        check: () => hasUpgrade("DM8"),
        get reward() { return `<b>x100</b> к скорости роста антиматерии. А ты ожидал чего-то особеного?` },
    },
    'ach36': {
        title: `Ты победил, но чем пришлось заплатить?`,
        get desc() { return `Достигни <b>${format("175 PT 5.741225")}</b> материи.` },
        check: () => player.matter.gte("175 PT 5.741225"),
    },

    'ach41': {
        title: `"бро это каноничное событие"`,
        get desc() { return `Войди в <b>Материверс</b>.` },
        check: () => player.meta.unl,
    },
    'ach42': {
        title: `БЕСКОНЕЧНОЕ УСТРАНЕНИЕ???`,
        get desc() { return `Достигни <b>${format(Number.MAX_VALUE)}</b> мета-материи (<b>${META_MATTER.formatFull(Number.MAX_VALUE)}</b>).` },
        check: () => player.meta.matter.gte(Number.MAX_VALUE),
        get reward() { return `Генерация мета-материи улучшена в <b>10</b>.` },
    },
    'ach43': {
        title: `Время относительно для устранения`,
        b: Decimal.tetrate(Number.MAX_VALUE,2),
        get desc() { return `Достигни <b>${format(this.b)}</b> мета-материи (<b>${META_MATTER.formatFull(this.b)}</b>).` },
        check() { return player.meta.matter.gte(this.b) },
    },
    'ach44': {
        title: `Тетрация начинает вредить!`,
        get desc() { return `Купи улучшение <b>O6</b>.` },
        check: () => hasUpgrade("O6"),
        get reward() { return `Усиление от достижений теперь влияет на экспоненту эффекта улучшения <b>MM6</b>.` },
    },
    'ach45': {
        title: `Там дальше будет мета-мета-материя?`,
        b: Decimal.tetrate(Number.MAX_VALUE,1e100),
        get desc() { return `Достигни <b>${format(this.b)}</b> мета-материи (<b>${META_MATTER.formatFull(this.b)}</b>).` },
        check() { return player.meta.matter.gte(this.b) },
    },
    'ach46': {
        title: `Мастер устранений`,
        get desc() { return `Победи данную игру. На этот раз точно.` },
    },
}

function updateAchievements() {
    for (let [id, v] of Object.entries(Achievements)) {
        let n = parseInt(id.split("ach")[1])

        let ach = el(id+"-div"), unl = player.meta.unl || n < 41

        ach.style.visibility = unl ? "" : "hidden"

        let h = `<b class="ach-title">${v.title}</b><br class='line'>${v.desc}`

        if ('reward' in v) h += `<br><i>Награда: ${v.reward}</i>`;

        updateTooltip(ach,h)

        ach.className = el_classes({tooltip: true, bought: player.achievements.includes(id)})
    }

    el('ach-total').innerHTML = format(player.achievements.length,0)
    el('ach-boost').innerHTML = formatMult(getAchievementBoost(),3)
}

function setupAchievements() {
    var ach_table = el('achievements')

    for (let [id, v] of Object.entries(Achievements)) {
        let new_ach = document.createElement('button')

        new_ach.id = id+"-div"
        new_ach.innerHTML = 'reward' in v ? "★ " + v.title : v.title
        new_ach.className = "tooltip"

        ach_table.appendChild(new_ach)
    }
}

function unlockAchievement(id) {
    if (!player.achievements.includes(id)) {
        player.achievements.push(id)
        addNotify(`<b>Получено достижение:</b> ${Achievements[id].title}`)
    }
}

function checkAchievements() {
    for (let [id, v] of Object.entries(Achievements)) {
        if (!player.achievements.includes(id) && v.check?.()) unlockAchievement(id)
    }
}

function hasAchievement(id) {
    return player.achievements.includes(id)
}
