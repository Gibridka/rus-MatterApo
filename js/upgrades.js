const UPGRADES = {
    'M1': {
        max: 1,
        unl: ()=>true,

        desc: `Generate <b>1</b> matter every second.`,
        curr: "matter",

        cost: E(0),

        on_buy() { unlockAchievement("ach11") },
    },
    'M2': {
        unl: ()=>hasUpgrade('M1'),

        get pow() { return Decimal.add(1, upgradeEffect('M3',0)).mul(getAchievementBoost()) },
        get base() { return Decimal.add(2, upgradeEffect('M4',0)) },

        get desc() {
            let pow = this.pow
            return `Increase matter generation by <b>${formatMult(this.base)}</b> per level${pow > 1 ? `<sup>${format(pow,3)}</sup>` : ""}.`
        },
        curr: "matter",

        get scaling() {
            let x = Decimal.add(50,upgradeEffect("UM8",0))
            return x
        },

        cost(a) {
            let b = this.scaling

            if (a.gte(b)) a = a.sub(b.sub(1)).sumBase(1.1).add(b.sub(1));

            return a.pow_base(2).pow_base(2)
        },
        bulk(a) {
            let b = this.scaling

            a = a.log(2).log(2)

            if (a.gte(b)) a = a.sub(b.sub(1)).sumBase(1.1,true).add(b.sub(1));

            return a.floor().add(1)
        },

        effect(a) {
            let x = Decimal.pow(this.base,a.pow(this.pow))
            return x
        },
        effDesc: x => formatMult(x),
    },
    'M3': {
        unl: ()=>hasUpgrade('M2',3),

        get base() { return Decimal.add(0.5, upgradeEffect('M6',0)) },

        get desc() {
            let base = this.base
            return `Increase the exponent of <b>M2</b>'s level to its effect by <b>+${format(base)}</b> per square-rooted level.`
        },
        curr: "matter",

        cost: a => a.scale(1e3,2,"P").pow_base(2).pow_base(100),
        bulk: a => a.log(100).log(2).scale(1e3,2,"P",true).floor().add(1),

        effect(a) {
            let x = a.root(2).mul(this.base)
            return x
        },
        effDesc: x => "+"+format(x,3),
    },
    'M4': {
        unl: ()=>hasUpgrade('M3') && player.unnatural.unl,

        get base() { return Decimal.add(0.5, upgradeEffect('M6',0)) },

        get desc() {
            let base = this.base
            return `Increase the base of <b>M2</b> by <b>+${format(base)}</b> per level.`
        },
        curr: "matter",

        cost: a => a.sumBase(2).pow_base(1e9).mul(1e36),
        bulk: a => a.div(1e36).log(1e9).sumBase(2,true).floor().add(1),

        effect(a) {
            let x = a.mul(this.base)
            return x
        },
        effDesc: x => "+"+format(x),
    },
    'M5': {
        max: 1,
        unl: ()=>hasUpgrade('M4'),

        desc: `Matter boosts unnatural matter gain, but speeds time of antimatter growth at same rate.`,
        curr: "matter",

        cost: 1e110,

        effect(a) {
            let x = player.matter.add(1).slog(10).add(1)
            if (hasUpgrade('M8')) x = x.pow(Decimal.add(2,upgradeEffect("M9",0)))
            return x
        },
        effDesc: x => formatMult(x),
    },
    'M6': {
        unl: ()=>hasUpgrade('M5'),

        get base() { return 0.1 },

        get desc() {
            let base = this.base
            return `Increase the base of <b>M3</b> & <b>M4</b> by <b>+${format(base)}</b> per ${hasUpgrade("UM6") ? "square" : "cube"}-rooted level.`
        },
        curr: "matter",

        cost: a => a.sumBase(2).pow_base('e625').mul('e375'),
        bulk: a => a.div('e375').log('e625').sumBase(2,true).floor().add(1),

        effect(a) {
            let x = a.root(hasUpgrade("UM6") ? 2 : 3).mul(this.base)
            return x
        },
        effDesc: x => "+"+format(x),
    },
    'M7': {
        max: 1,
        unl: ()=>hasUpgrade('M6'),

        desc: `Time of antimatter growth raises matter generation at a reduced rate.`,
        curr: "matter",

        cost: E('e15000'),

        effect(a) {
            let x = player.antimatter_time.add(1).log10().div(8).add(1)
            return x
        },
        effDesc: x => formatPow(x,3),
    },
    'M8': {
        max: 1,
        unl: ()=>hasUpgrade('M7'),

        get base() { return Decimal.add(2,upgradeEffect("M9")) },

        get desc() { return `<b>M5</b>'s effect is raised to the <b>${format(this.base)}th</b> power.` },
        curr: "matter",

        cost: E('e60000'),
    },
    'M9': {
        max: 100,
        unl: ()=>player.exotic.unl&&hasUpgrade('M8'),

        get base() { return Decimal.add(0.5,0) },

        get desc() {
            let base = this.base
            return `Increase the base of <b>M8</b> by <b>+${format(base)}</b> per level.`
        },
        curr: "matter",

        cost: a => a.sumBase(1.1).pow_base(10).mul(1e36).pow_base(10),
        bulk: a => a.log(10).div(1e36).log(10).sumBase(1.1,true).floor().add(1),

        effect(a) {
            let x = a.mul(this.base)
            return x
        },
        effDesc: x => "+"+format(x),
    },
    "M10": {
        max: 1,
        unl: ()=>hasUpgrade('M9'),

        desc: `The exponent of matter generation is raised to the <b>1.05th</b> power.`,
        curr: "matter",

        cost: E('ee400'),
    },

    "UM1": {
        unl: ()=>true,

        get base() { return Decimal.add(2, upgradeEffect('UM7',0)) },

        get desc() {
            return `Increase unnatural matter gain by <b>${formatMult(this.base)}</b> on level.`
        },
        curr: "unnatural",

        cost: a => a.sumBase(1.1).pow_base(10).mul(10),
        bulk: a => a.div(10).log(10).sumBase(1.1,true).floor().add(1),

        effect(a) {
            let x = Decimal.pow(this.base,a)
            return x
        },
        effDesc: x => formatMult(x),
    },
    "UM2": {
        max: 1,
        unl: ()=>hasUpgrade('UM1'),

        desc: `Increase the exponent of the unnatural matter boost to matter generation based on your matter.`,
        curr: "unnatural",

        cost: 50,

        effect(a) {
            let x = player.matter.add(1).log10().add(1).log10().add(1).log10().mul(2)
            if (x.gt(1) && hasUpgrade("EM1")) x = x.pow(2);
            return x
        },
        effDesc: x => "+"+format(x),
    },
    "UM3": {
        max: 1,
        unl: ()=>hasUpgrade('UM2'),

        desc: `Automate <b>M*</b> upgrades without spending currencies.`,
        curr: "unnatural",

        cost: 1e3,
    },
    "UM4": {
        max: 1,
        unl: ()=>hasUpgrade('UM3'),

        desc: `Increase the exponent of the unnatural matter boost to matter generation based on your total unnatural matter.`,
        curr: "unnatural",

        cost: 5e3,

        effect(a) {
            let x = player.unnatural.total.add(1).log10().div(3)
            return x
        },
        effDesc: x => "+"+format(x),
    },
    "UM5": {
        max: 1,
        unl: ()=>player.exotic.unl && hasUpgrade('UM4'),

        desc: `Total unnatural matter boosts exotic matter gain, but speeds time of natural matter growth at same rate.`,
        curr: "unnatural",

        cost: 1e10,

        effect(a) {
            let x = player.unnatural.total.add(1).log(1e3).add(1)
            return x
        },
        effDesc: x => formatMult(x),
    },
    "UM6": {
        max: 1,
        unl: ()=>hasUpgrade('UM5'),

        desc: `Improve <b>M6</b>'s effect better.`,
        curr: "unnatural",

        cost: 1e12,
    },
    "UM7": {
        unl: ()=>hasUpgrade('UM6'),

        get base() { return 0.5 },

        get desc() {
            let base = this.base
            return `Increase the base of <b>UM1</b> by <b>+${format(base)}</b> per level.`
        },
        curr: "unnatural",

        cost: a => a.sumBase(1.1).pow_base(1e3).mul(1e30),
        bulk: a => a.div(1e30).log(1e3).sumBase(1.1,true).floor().add(1),

        effect(a) {
            let x = Decimal.mul(this.base,a)
            return x
        },
        effDesc: x => "+"+format(x),
    },
    "UM8": {
        unl: ()=>hasUpgrade('UM7'),

        desc: `Delay the first scaling of <b>M2</b> by <b>+15</b> per level (normally 50).`,
        curr: "unnatural",

        cost: a => a.sumBase(1.1).pow_base(10).mul(1e42),
        bulk: a => a.div(1e42).log(10).sumBase(1.1,true).floor().add(1),

        effect(a) {
            let x = Decimal.mul(15,a)
            return x
        },
        effDesc: x => "+"+format(x,0),
    },

    "EM1": {
        max: 1,
        unl: ()=>true,

        desc: `<b>UM2</b>'s effect is <b>squared</b> above <b>+1</b>.`,
        curr: "exotic",

        cost: 1e2,
    },
    "EM2": {
        unl: ()=>hasUpgrade("EM1"),

        get base() { return 2 },

        get desc() {
            return `Increase exotic matter gain by <b>${formatMult(this.base)}</b> on level.`
        },
        curr: "exotic",

        cost: a => a.sumBase(1.1).pow_base(10).mul(1e3),
        bulk: a => a.div(1e3).log(10).sumBase(1.1,true).floor().add(1),

        effect(a) {
            let x = Decimal.pow(this.base,a)
            return x
        },
        effDesc: x => formatMult(x),
    },
    "EM3": {
        max: 1,
        unl: ()=>hasUpgrade("EM2"),

        desc: `Improve unnatural matter gain better.`,
        curr: "exotic",

        cost: 5e3,
    },
    "EM4": {
        max: 1,
        unl: ()=>hasUpgrade("EM3"),

        desc: `<span style="font-size: 0.9em;">Passively generate <b>10%</b> of unnatural matter gained on matter annihilation at a rate affected by speed.
        However, you still generate time for natural matter growth at the same rate.
        Antimatter will no longer be growing, except for time.</span>`,
        curr: "exotic",

        cost: 1e6,
    },
    "EM5": {
        max: 1,
        unl: ()=>hasUpgrade("EM4"),

        desc: `Automate <b>UM*</b> upgrades without spending currencies.`,
        curr: "exotic",

        cost: 1e7,
    },
    "EM6": {
        max: 1,
        unl: ()=>hasUpgrade("EM5"),

        desc: `Exotic matter boosts are <b>squared</b>.`,
        curr: "exotic",

        cost: 1e9,
    },
}

const UPG_KEYS = Object.keys(UPGRADES)
const PREFIXES = ["M",'UM','EM']

function getUpgrades(prefix) { return UPG_KEYS.filter(key => key.split(prefix)[0] == "" && Number(key.split(prefix)[1])) }

const PREFIX_TO_UPGS = (()=>{
    let x = {}
    PREFIXES.forEach(y => {x[y] = getUpgrades(y)})
    return x
})()

const PREFIX_NAMES = {
    "M": "Matter",
    "UM": "Unnatural Matter",
    "EM": "Exotic Matter",
}

function getUpgradeCost(id) {
    let u = UPGRADES[id]

    return Decimal.gt(u.max ?? EINF,1) ? u.cost(player.upgrades[id]) : u.cost
}

function buyUpgrade(id, all = false, auto = false) {
    let u = UPGRADES[id], lvl = player.upgrades[id], max = u.max ?? EINF

    if (tmp.lock_upg.includes(id) || !player.upgs_unl.includes(id) && !u.unl() || lvl.gte(max)) return

    let cost = getUpgradeCost(id), curr = CURRENCIES[u.curr]

    if (curr.amount.gte(cost)) {
        let bulk = player.upgrades[id].add(1)

        if ((all || auto) && Decimal.gt(max, 1)) {
            bulk = bulk.max(u.bulk(curr.amount).min(max))
            cost = u.cost(bulk.sub(1))
        }

        player.upgrades[id] = bulk
        if (!auto) {
            curr.amount = curr.amount.sub(cost).max(0)
            u.on_buy?.()
        }

        if (!player.upgs_unl.includes(id)) player.upgs_unl.push(id);
    }
}

function hasUpgrade(id,l=1) { return player.upgrades[id].gte(l) }
function upgradeEffect(id,def=1) { return tmp.upgs_effect[id] ?? def }
function simpleUpgradeEffect(id,def=1) { return hasUpgrade(id) ? tmp.upgs_effect[id] ?? def : def }

function updateUpgradesTemp() {
    for (let id in UPGRADES) {
        let u = UPGRADES[id]
        if (u.effect) tmp.upgs_effect[id] = u.effect(player.upgrades[id])
    }

    let auto = []

    if (hasUpgrade("UM3")) auto.push(...PREFIX_TO_UPGS['M']);
    if (hasUpgrade("EM5")) auto.push(...PREFIX_TO_UPGS['UM']);

    tmp.auto_upg = auto

    let lock = []

    tmp.lock_upg = lock
}

function resetUpgrades(id,keep=[]) {
    for (let i of PREFIX_TO_UPGS[id]) if (!keep.includes(i)) player.upgrades[i] = E(0)
}

function setupUpgradesHTML() {
    for (let prefix of PREFIXES) {
        let h = ""
        for (let index of PREFIX_TO_UPGS[prefix]) {
            h += `<button onclick="buyUpgrade('${index}')" id="upg-${index}-div"><div id="upg-${index}-desc"></div><div class='upgrade-ID'>${index}</div></button>`
        }
        el('upgrades-' + prefix + '-table').innerHTML = h
    }
}

function updateUpgrades(prefix) {
    for (let index of PREFIX_TO_UPGS[prefix]) {
        let u = UPGRADES[index], lvl = player.upgrades[index], max = u.max ?? EINF, bought = lvl.gte(max)
        let upg_elem = el('upg-' + index + '-div'), unl = player.upgs_unl.includes(index) || u.unl()

        upg_elem.style.display = unl ? "" : "none"

        if (unl) {
            let curr = CURRENCIES[u.curr]

            let h = ""
            if (Decimal.gt(max,1)) h += `<div>[Level ${format(lvl,0) + (Decimal.lt(max,EINF) ? " / " + format(max,0) : "")}]</div>`;
            h += u.desc

            if (u.effDesc) h += `<br>Effect: ${u.effDesc(tmp.upgs_effect[index])}`;
            var cost = getUpgradeCost(index)
            if (!bought) h += `<br>Cost: ${format(cost,0)} ${curr.name}`;

            el('upg-' + index + '-desc').innerHTML = h
            upg_elem.className = el_classes({bought, locked: !bought && (tmp.lock_upg.includes(index) || curr.amount.lt(cost))})
        }
    }
}