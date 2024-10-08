const el = id => document.getElementById(id);
const FPS = 30;

var player = {}, date = Date.now(), diff = 0;

function loop() {
    updateTemp()
    diff = Date.now()-date;
    updateHTML()
    calc(diff/1000)
    date = Date.now()
}

function getAntimatterGrowth(t=player.antimatter_time) {
    t = tmp.dark_penalty[2] ? t.div(10) : t.root(2).div(5)

    let x = Decimal.tetrate(1e3,t).sub(1).max(0)

    return x
}

function getAntiUnnaturalGrowth(offest=0) {
    let t = player.unnatural.anti_time.add(offest)

    let x = Decimal.pow(1e4,t.div(10)).scale(1e30,3,"D")

    return x.sub(1).max(0)
}

function getAntiExoticGrowth(offest=0) {
    let t = player.exotic.anti_time.add(offest)

    let x = Decimal.pow(1e9,t.div(8))

    return x.sub(1).max(0)
}

var tab = 0, stab = [0], tab_name = 'matter'

const TAB_IDS = {
    'matter': {
        html() {
            updateUpgrades('M')
        },
    },
    'unnatural': {
        name: "Нетрадиционная Материя",

        html() {
            el('unnatural-amount').innerHTML = format(player.unnatural.matter,0)
            el('unnatural-total').innerHTML = format(player.unnatural.total,0)

            el('unnatural-boost').innerHTML = formatMult(tmp.unnatural_boost)

            el('anti-unnaturalmatter-amount').innerHTML = hasUpgrade("DM5") ? "" : player.unnatural.total.gte(1e4)
            ? `Из-за большого количества нетрадиционной материи, у вас выросло <h4>${format(getAntiUnnaturalGrowth().min(player.unnatural.total),0)}</h4> традиционной материи!`
            + (hasUpgrade("EM4") ? "" : ` (<h4>${format(getAntiUnnaturalGrowth(tmp.unnatural_speed).min(player.unnatural.total.add(tmp.currency_gain.unnatural)),0)}</h4> в следующем устранении материи)`)
            : ""

            el('unnatural-gain').innerHTML = hasUpgrade("EM4") ? formatGain(player.unnatural.matter, tmp.currency_gain.unnatural.mul(CURRENCIES.unnatural.passive)) : `(+${format(tmp.currency_gain.unnatural,0)}/annihilation)`

            updateUpgrades('UM')
        },
    },
    'exotic': {
        name: "Экзоктическая материя",

        html() {
            el('exotic-amount').innerHTML = format(player.exotic.matter,0)
            el('exotic-total').innerHTML = format(player.exotic.total,0)

            let effect = tmp.exotic_boost

            el('exotic-boost1').innerHTML = formatMult(effect[0]), el('exotic-boost2').innerHTML = formatPow(effect[1],3);

            el('anti-exoticmatter-amount').innerHTML = hasUpgrade("DM5") ? "" : player.exotic.total.gte(1e9)
            ? `Из-за большого количества экзоктической материи, у вас выросло <h4>${format(getAntiExoticGrowth().min(player.exotic.total),0)}</h4> испорченной материи!`
            + (hasUpgrade("DM5") ? "" : ` (<h4>${format(getAntiExoticGrowth(1).min(player.exotic.total.add(tmp.currency_gain.exotic)),0)}</h4> в следующем устранении нетрадиционной материи)`)
            : ""

            el('exotic-gain').innerHTML = hasUpgrade("DM5") ? formatGain(player.exotic.matter, tmp.currency_gain.exotic.mul(CURRENCIES.exotic.passive)) : `(+${format(tmp.currency_gain.exotic,0)}/annihilation)`

            updateUpgrades('EM')
        },
    },
    'dark': {
        name: "Темная Материя",

        html() {
            el('dark-amount').innerHTML = format(player.dark.matter,0)
            el('dark-total').innerHTML = format(player.dark.total,0)

            el('dark-gain').innerHTML = `(+${format(tmp.currency_gain.dark,0)}/annihilation)`

            let effect = tmp.dark_boost

            el('dark-boost1').innerHTML = formatMult(effect[0]), el('dark-boost2').innerHTML = formatPow(effect[1],3);

            updateDarkPenalties()

            /*
            el('anti-exoticmatter-amount').innerHTML = player.exotic.total.gte(1e9)
            ? `Due to the large amount of exotic matter, you have grown <h4>${format(getAntiExoticGrowth().min(player.exotic.total),0)}</h4> corrupted matter!`
            + (false ? "" : ` (<h4>${format(getAntiExoticGrowth(1).min(player.exotic.total.add(tmp.currency_gain.exotic)),0)}</h4> on next unnatural matter annihilation)`)
            : ""
            */

            updateUpgrades('DM')
        },
    },
    "options": {
        name: "Настройки",

        html() {
            NOTATIONS_OPTIONS.forEach((x,i) => {
                el("notation-btn-" + i).innerHTML = x.html
            })
        },
    },
    "achs": {
        name: "Достижения",

        html: updateAchievements,
    },
    "auto": {
        name: "Автоматизация",

        html() {
            let au = player.auto_upgs

            for (let prefix of PREFIXES) {
                let unl = false, upgs = PREFIX_TO_UPGS[prefix]

                if (!player.meta.unl || !["M","UM","EM","DM"].includes(prefix)) for (let index of upgs) if (tmp.auto_upg.includes(index)) {
                    unl = true
                    break
                }

                el("auto-upgs-" + prefix + "-div").style.display = el_display(unl)

                if (unl) {
                    for (let index of upgs) {
                        let upg_unl = player.upgs_unl.includes(index), elem = el("auto-upg-" + index + "-btn")

                        elem.style.display = el_display(upg_unl)

                        if (upg_unl) elem.className = el_classes({bought: !(index in au) || au[index]})
                    }
                }
            }
        },
    },
    "meta": {
        name: "Мета-Материч",

        html: updateMetaMatterHTML,
    },
}

const TABS = [
    {
        unl: ()=>!player.meta.unl,
        name: "Материя",

        stab: "matter",
    },{
        unl: ()=>!player.meta.unl && player.unnatural.unl,
        name: "Устранение",

        stab: [
            ["unnatural"],
            ["exotic", ()=>player.exotic.unl],
            ["dark", ()=>player.dark.unl],
        ],
    },{
        unl: ()=>player.meta.unl,
        name: "Мета-Материя",

        stab: "meta",
    },{
        unl: ()=>tmp.auto_upg.length > 0,
        name: "Автоматизация",

        stab: "auto",
    },{
        name: "Достижения",

        stab: "achs",
    },{
        name: "Настройки",

        stab: "options",
    },
]

function switchTab(t,st) {
    tab = t
    if (st !== undefined) stab[t] = st

    let s = TABS[t].stab

    if (Array.isArray(s)) tab_name = s[stab[t]??0][0]
    else tab_name = s
}

function getTabNotification(id) {
    return TAB_IDS[id].notify?.()
}

function updateTabs() {
    var tab_unlocked = {}

    for (let [i,v] of Object.entries(TABS)) {
        let unl = !v.unl || v.unl(), elem, selected = parseInt(i) == tab, array = Array.isArray(v.stab)
        tab_unlocked[i] = []

        if (array) {
            if (unl) {
                tab_unlocked[i] = v.stab.filter(x => (!x[1] || x[1]()) && getTabNotification(x[0])).map(x => x[0])
            }

            elem = el('stab'+i+'-div')

            elem.style.display = el_display(selected)

            if (selected) v.stab.forEach(([x,u],j) => {
                var s_elem = el('stab'+i+'-'+j+'-button')

                s_elem.style.display = el_display(!u || u())
                s_elem.className = el_classes({"tab-button": true, stab: true, selected: x == tab_name, notify: tab_unlocked[i].includes(x)}) // "tab-button stab"+(x == tab_name ? " selected" : "")
            })
        }

        elem = el('tab'+i+'-button')

        elem.style.display = el_display(unl)
        if (unl) elem.className = el_classes({"tab-button": true, selected, notify: (array ? tab_unlocked[i].length > 0 : getTabNotification(v.stab))}) // "tab-button"+(selected ? " selected" : "")
    }

    for (let [i,v] of Object.entries(TAB_IDS)) {
        let unl = tab_name == i, elem = el(i+"-tab")

        if (!elem) continue;

        elem.style.display = el_display(unl)

        if (unl) v.html?.()
    }
}

function setupTabs() {
    let h = "", h2 = ""

    for (let [i,v] of Object.entries(TABS)) {
        h += `<button class="tab-button" id="tab${i}-button" onclick="switchTab(${i})">${v.name}</button>`

        if (Array.isArray(v.stab)) {
            h2 += `<div id="stab${i}-div" id="${v.stab[stab[i]]}-tab">
            ${v.stab.map(([x],j) => `<button class="tab-button stab" id="stab${i}-${j}-button" onclick="switchTab(${i},${j})">${TAB_IDS[x].name}</button>`).join("")}
            </div>`
        }
    }

    el('tabs').innerHTML = h + h2
}

function addNotify(message,time=3) {
    const notify = document.createElement('div');
    notify.classList.add('notify-ctn');
    notify.innerHTML = message;
    el('notify').appendChild(notify);
    setTimeout(() => {
        notify.style.opacity = 0
        setTimeout(() => {
            notify.remove()
        },1000)
    },time*1000)
}

const DARK_PENALTY = [
    {
        unl: ()=>CURRENCIES.dark.total.gte(1),

        get desc() {
            return [
                `Множитель для экзотики понижен в <b>^0.6</b>.`,
                `Добыча нетрадиционной материи стала лучше.`
            ]
        },
    },{
        unl: ()=>CURRENCIES.dark.total.gte(100),

        get desc() {
            return [
                `Генерация материи замедляется ещё больше, если оно выше <b>${format(tmp.matter_overflow_start)}</b>.`,
                `Масштабирование для <b>M6</b> больше нет.`
            ]
        },
    },{
        unl: ()=>hasUpgrade("DM5"),

        get desc() {
            return [
                `Антиматерия вновь растет и получает иммунитет от <b>M5</b>. Устранение материи вынуждает экзоктическую материю устраниться за тёмную материю.`,
                `Время роста антиматерии слегка улучшает добычу тёмной материи.`
            ]
        },
    },{
        unl: ()=>hasUpgrade("DM7"),

        get desc() {
            return [
                `База для экзоктической материи (из нетрадиционной материи) замедляется ещё сильнее, если оно выше <b>${format(1e100)}</b> и вновь.`,
                `Открывает последние улучшения.`
            ]
        },
    },
]

function setupDarkPenalties() {
    let h = ""

    for (let i in DARK_PENALTY) {
        h += `
        <div class="dark-penalty" id="dark-penalty-${i}">
            <div class="dark-penalty-base" id="dark-penalty-${i}-base">
                
            </div>
        </div>
        `
    }

    el("dark-penalties").innerHTML = h
}

function updateDarkPenalties() {
    let s = ["[-]","[+]"]

    for (let i in DARK_PENALTY) {
        let P = DARK_PENALTY[i]

        let unl = P.unl()

        el(`dark-penalty-${i}`).style.display = el_display(unl)

        if (unl) el(`dark-penalty-${i}-base`).innerHTML = P.desc.map((x,i) => `<div><b>${s[i]}</b> ${x}</div>`).join("")
    }
}
