function el_display(bool) { return bool ? "" : "none" }
function el_classes(data) { return Object.keys(data).filter(x => data[x]).join(" ") }

function updateHTML() {
    el('matter-amount').innerHTML = player.meta.unl ? format(player.meta.matter) : format(player.matter,0)
    el('matter-gain').innerHTML = player.meta.unl ? player.meta.matter.formatGain(tmp.currency_gain.meta) : player.matter.formatGain(tmp.currency_gain.matter)

    el('antimatter-amount').innerHTML = (tmp.dark_penalty[2] || !hasUpgrade("EM4")) && player.best_matter.gte(1e3) ? `Due to the large amount of matter, you have grown <h4>${format(getAntimatterGrowth().min(player.matter),0)}</h4> antimatter!` : ""

    el('matter-name').innerHTML = player.meta.unl ? "meta-matter" : "matter"

    updateTabs()
}

function updateTheme() {
    el('theme_css').href = options.theme != "normal" ? "style/"+options.theme+".css" : ""
}

const NOTATIONS_OPTIONS = [
    {
        get html() {
            return "Формат записи чисел: " + ["Научный", "Стандартный", "Смешено Научный", "Логарифмический"][player.options.notation]
        },
        click() {
            player.options.notation = (player.options.notation + 1) % 4
        },
    },{
        get html() {
            return "Максимум кол-во чисел в научном формате (после e): " + [3,6,9,12,15][player.options.comma]
        },
        click() {
            player.options.comma = (player.options.comma + 1) % 5
        },
    },{
        get html() {
            return "Начальное число для Смешанного научного: " + ["e33", "e63", "e303", "e3003"][player.options.mixed_sc]
        },
        click() {
            player.options.mixed_sc = (player.options.mixed_sc + 1) % 4
        },
    },{
        get html() {
            return "Тема: " + ["Обычная (Светлая)", "Темная"][player.options.theme]
        },
        click() {
            player.options.theme = (player.options.theme + 1) % 2

            options.theme = ['normal','dark'][player.options.theme]
            updateTheme()
        },
    },
]

function setupNotations() {
    el('notations').innerHTML = NOTATIONS_OPTIONS.map((x,i) => `<button class="big-btn" id="notation-btn-${i}"></button>`).join("")

    NOTATIONS_OPTIONS.forEach((x,i) => {
        el("notation-btn-" + i).onclick = x.click
    })
}

function setupAutomations() {
    let table = document.getElementById("auto-upgrades")
    let au = player.auto_upgs
    for (let prefix of PREFIXES) {
        let elem = document.createElement("div")
        elem.id = "auto-upgs-" + prefix + "-div"
        elem.className = "auto-div"
        elem.innerHTML = `<h4>${PREFIX_NAMES[prefix]} Upgrades</h4><div class="auto-upgs-grid" id="auto-upgs-${prefix}-grid"></div>`
        table.appendChild(elem)

        let grid = el("auto-upgs-" + prefix + "-grid")
        for (let index of PREFIX_TO_UPGS[prefix]) {
            let upg_grid = document.createElement("button")
            upg_grid.id = "auto-upg-" + index + "-btn"
            upg_grid.innerHTML = index
            upg_grid.onclick = () => {
                au[index] = index in au && !au[index]
            }
            grid.appendChild(upg_grid)
        }
    }
}

function setupHTML() {
    setupUpgradesHTML()
    setupTabs()
    setupNotations()
    setupAchievements()
    setupAutomations()
    setupDarkPenalties()
}
