const Achievements = {
    'ach11': {
        title: `Matter Dimensions?`,
        get desc() { return `Start generating matter.` },
        check: () => hasUpgrade("M1"),
    },
    'ach12': {
        title: `Oh no, everything gets wiped!`,
        get desc() { return `Annihilate matter.` },
    },
    'ach13': {
        title: `Jacorbian-RedSharkian balancing in a nutshell`,
        get desc() { return `Reach <b>${format(1e100)}</b> matter.` },
        check: () => player.matter.gte(1e100),
        get reward() { return `<b>^1.05</b> to matter generation.` },
    },
    'ach14': {
        title: `Finally an automation`,
        get desc() { return `Purchase the <b>UM3</b> upgrade.` },
        check: () => hasUpgrade("UM3"),
    },
    'ach15': {
        title: `Annihilation inside annihilation?!`,
        get desc() { return `Annihilate unnatural matter.` },
    },
    'ach16': {
        title: `Inflation never ends`,
        get desc() { return `Reach <b>${format('ee25')}</b> matter.` },
        check: () => player.matter.gte('ee25'),
    },

    'ach21': {
        title: `No more annihilation, but at what cost?`,
        get desc() { return `Purchase the <b>EM4</b> upgrade.` },
        check: () => hasUpgrade("EM4"),
    },
    'ach22': {
        title: `Wait, that antimatter is dangerous`,
        get desc() { return `Have at least <b>1 day</b> of antimatter growth (approx. <b>${format(getAntimatterGrowth(E(86400)))}</b> antimatter).` },
        check: () => getAntimatterGrowth().gte(getAntimatterGrowth(E(86400))),
        get reward() { return `<b>Double</b> the time speed of antimatter and natural matter growths.` },
    },
    'ach23': {
        title: `Never mind, I don't like inflation`,
        get desc() { return `Reach <b>${format('ee100')}</b> matter without buying the <b>M2</b> upgrade.` },
        check: () => player.matter.gte('ee100') && !hasUpgrade("M2"),
    },
    'ach24': {
        title: `Jacorbian-RedSharkian balancing in a nutshell II`,
        get desc() { return `Reach <b>${format(1e100)}</b> total unnatural matter.` },
        check: () => player.unnatural.total.gte(1e100),
        get reward() { return `<b>^1.05</b> to unnatural matter gain.` },
    },
    'ach25': {
        title: `Can you stop annihilating even more beyond?`,
        get desc() { return `Annihilate exotic matter.` },
    },
    'ach26': {
        title: `Ugh, I feel annihilation going to be useful`,
        get desc() { return `Annihilate exotic matter without buying the <b>EM4</b> upgrade.` },
        get reward() { return `Keep the <b>EM4</b> upgrade on exotic matter annihilation, and it is <b>${formatMult(5)}</b> faster.` },
    },

    'ach31': {
        title: `I'm confused about penalty`,
        get desc() { return `Fine <b>2nd</b> dark penalty.` },
        check: () => tmp.dark_penalty[1],
    },
    'ach32': {
        title: `NO MORE ANNOYING ANNIHILATION!`,
        get desc() { return `Purchase the <b>DM5</b> upgrade.` },
        check: () => hasUpgrade("DM5"),
    },
    'ach33': {
        title: `Jacorbian-RedSharkian balancing in a nutshell III`,
        get desc() { return `Reach <b>${format(1e100)}</b> total exotic matter.` },
        check: () => player.exotic.total.gte(1e100),
        get reward() { return `<b>^1.05</b> to exotic matter gain.` },
    },
    'ach34': {
        title: `There's no point in end inflation`,
        get desc() { return `Reach <b>${format('eee100')}</b> matter.` },
        check: () => player.matter.gte('eee100'),
    },
    'ach35': {
        title: `<img src="style/bart.png">`,
        get desc() { return `Purchase the <b>DM8</b> upgrade.` },
        check: () => hasUpgrade("DM8"),
        get reward() { return `Multiply the time speed of antimatter growth by <b>100</b>. Why are you looking this?` },
    },
    'ach36': {
        title: `You win, but at what cost?`,
        get desc() { return `Reach <b>${format("175 PT 5.741225")}</b> matter.` },
        check: () => player.matter.gte("175 PT 5.741225"),
    },
}

function updateAchievements() {
    for (let [id, v] of Object.entries(Achievements)) {
        let ach = el(id+"-div")

        let h = `<b class="ach-title">${v.title}</b><br class='line'>${v.desc}`

        if ('reward' in v) h += `<br><i>Reward: ${v.reward}</i>`;

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
        addNotify(`<b>Achievement unlocked:</b> ${Achievements[id].title}`)
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