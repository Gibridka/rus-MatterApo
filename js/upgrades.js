const UPGRADES = {
    'M1': {
        max: 1,
        unl: ()=>true,

        desc: `Генерирует <b>1</b> материю в секунду.`,
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
            return `Усиливает генерацию материи в <b>${formatMult(this.base)}</b> per level${pow > 1 ? `<sup>${format(pow,3)}</sup>` : ""}.`
        },
        curr: "matter",

        get scaling() {
            let x = Decimal.add(10,upgradeEffect("UM8",0))
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
            a = a.mul(upgradeEffect("M12"))
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
            return `Увеличивает экспоненту эффектова от <b>M2</b> на <b>+${format(base)}</b> за каждый квадратный-уровень.`
        },
        curr: "matter",

        get scaling() {
            let x = E(10)
            if (hasUpgrade("UM9")) x = x.add(Decimal.div(upgradeEffect("UM8",0),2))
            return x
        },

        cost(a) { return a.scale(this.scaling,2,"P").pow_base(2).pow_base(100) },
        bulk(a) { return a.log(100).log(2).scale(this.scaling,2,"P",true).floor().add(1) },

        effect(a) {
            a = a.mul(upgradeEffect("M12"))
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
            return `Увеличивает базу <b>M2</b> на <b>+${format(base)}</b> за уровень.`
        },
        curr: "matter",

        cost: a => a.sumBase(2).pow_base(1e10).mul(1e50),
        bulk: a => a.div(1e50).log(1e10).sumBase(2,true).floor().add(1),

        effect(a) {
            a = a.mul(upgradeEffect("M12"))
            let x = a.mul(this.base)
            return x
        },
        effDesc: x => "+"+format(x),
    },
    'M5': {
        max: 1,
        unl: ()=>hasUpgrade('M4'),

        desc: `Материя усиливает добычу нетрадиционной материи и ускоряет рост антиматерии одновременно.`,
        curr: "matter",

        cost: 1e150,

        effect(a) {
            let x = player.matter.add(1).slog(10).add(1)
            if (hasUpgrade('M8')) x = x.pow(Decimal.add(2,upgradeEffect("M9",0)))
            return x
        },
        effDesc: x => formatMult(x),
    },
    'M6': {
        unl: ()=>hasUpgrade('M5'),

        get base() { return Decimal.mul(0.1,hasUpgrade("UM10")?getAchievementBoost():1) },

        get desc() {
            let base = this.base
            return `Увеличивает базу для <b>M3</b> и <b>M4</b> на <b>+${format(base)}</b> за ${hasUpgrade("DM2") ? "" : hasUpgrade("UM6") ? "квадртанокоревой" : "кубокорневой"} уровень.`
        },
        curr: "matter",

        cost: a => a.scale(1e4,2,"P",false,tmp.dark_penalty[1]).sumBase(2).pow_base('e800').mul('e400'),
        bulk: a => a.div('e400').log('e800').sumBase(2,true).scale(1e4,2,"P",true,tmp.dark_penalty[1]).floor().add(1),

        effect(a) {
            a = a.mul(upgradeEffect("M12"))
            let x = a.root(hasUpgrade("DM2") ? 1.5 : hasUpgrade("UM6") ? 2 : 3).mul(this.base)
            return x
        },
        effDesc: x => "+"+format(x),
    },
    'M7': {
        max: 1,
        unl: ()=>hasUpgrade('M6'),

        desc: `Время роста антиматерии теперь усиливает генерацию материи в уменьшенном порядке.`,
        curr: "matter",

        cost: E('e5555'),

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

        get desc() { return `Эффект <b>M5</b> увеличен в <b>${format(this.base)}ом</b> порядке.` },
        curr: "matter",

        cost: E('e1.8e4'),
    },
    'M9': {
        max: 100,
        unl: ()=>player.exotic.unl&&hasUpgrade('M8'),

        get base() { return Decimal.add(0.5,0) },

        get desc() {
            let base = this.base
            return `Увеличивает базу для <b>M8</b> на <b>+${format(base)}</b> за уровень.`
        },
        curr: "matter",

        cost: a => a.sumBase(1.1).pow_base(10).mul(1e36).pow_base(10),
        bulk: a => a.log(10).div(1e36).log(10).sumBase(1.1,true).floor().add(1),

        effect(a) {
            a = a.mul(upgradeEffect("M12"))
            let x = a.mul(this.base)
            return x
        },
        effDesc: x => "+"+format(x),
    },
    "M10": {
        max: 1,
        unl: ()=>hasUpgrade('M9'),

        desc: `Экспонента генерации материи увеличено в <b>1.05</b> степене.`,
        curr: "matter",

        cost: E('ee200'),
    },
    'M11': {
        unl: ()=>hasUpgrade('M10') && player.dark.unl,

        desc: `Увеличивает экспоненту генерации материи на <b>^1.1</b> за уровень.`,
        curr: "matter",

        cost: a => a.sumBase(1.1).pow_base(1.5).mul(10000).pow_base(10).pow_base(10),
        bulk: a => a.log(10).log(10).div(10000).log(1.5).sumBase(1.1,true).floor().add(1),

        effect(a) {
            a = a.mul(upgradeEffect("M12"))
            let x = Decimal.pow(1.1,a)
            return x
        },
        effDesc: x => formatPow(x),
    },
    'M12': {
        unl: ()=>hasUpgrade('M11'),

        desc: `Все прошлые повторно покупаемые улучшения <b>M*</b> теперь в <b>+100%</b> сильнее.`,
        curr: "matter",

        cost: a => a.sumBase(1.1).pow_base(1e3).mul(1e27).pow_base(10).pow_base(10),
        bulk: a => a.log(10).log(10).div(1e27).log(1e3).sumBase(1.1,true).floor().add(1),

        effect(a) {
            let x = a.add(1)
            return x
        },
        effDesc: x => formatMult(x),
    },

    "UM1": {
        unl: ()=>true,

        get base() { return Decimal.add(2, upgradeEffect('UM7',0)) },

        get desc() {
            return `Добыча нетрадиционной материи увеличина в <b>${formatMult(this.base)}</b> на текущем уровне.`
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

        desc: `Улучшает экспоненту усиления для генерации материи от нетрадиционной материи на основе твой материи.`,
        curr: "unnatural",

        cost: 1e2,

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

        desc: `Автоматическое получение улучшений <b>M*</b> без фактической траты валюты.`,
        curr: "unnatural",

        cost: 1e3,
    },
    "UM4": {
        max: 1,
        unl: ()=>hasUpgrade('UM3'),

        desc: `Улучшает экспоненту усиления для генерации материи от нетрадиционной материи на основе всей полученной нетрадиционной материи.`,
        curr: "unnatural",

        cost: 1e4,

        effect(a) {
            let x = player.unnatural.total.add(1).log10().div(3)
            return x
        },
        effDesc: x => "+"+format(x),
    },
    "UM5": {
        max: 1,
        unl: ()=>player.exotic.unl && hasUpgrade('UM4'),

        desc: `Вся нетрадиционная материя усиливает добычу экзоктической материи, но в том же порядке увеличивает скорость роста традиционной.`,
        curr: "unnatural",

        cost: 1e9,

        effect(a) {
            let x = player.unnatural.total.add(1).log(1e3).add(1)
            return x
        },
        effDesc: x => formatMult(x),
    },
    "UM6": {
        max: 1,
        unl: ()=>hasUpgrade('UM5'),

        desc: `Улучшение эффекта <b>M6</b> и усиления от достижений.`,
        curr: "unnatural",

        cost: 1e12,
    },
    "UM7": {
        unl: ()=>hasUpgrade('UM6'),

        get base() { return 0.5 },

        get desc() {
            let base = this.base
            return `Увеличивает базу для <b>UM1</b> на <b>+${format(base)}</b> за уровень.`
        },
        curr: "unnatural",

        cost: a => a.sumBase(1.1).pow_base(1e3).mul(1e27),
        bulk: a => a.div(1e27).log(1e3).sumBase(1.1,true).floor().add(1),

        effect(a) {
            let x = Decimal.mul(this.base,a)
            return x
        },
        effDesc: x => "+"+format(x),
    },
    "UM8": {
        unl: ()=>hasUpgrade('UM7'),

        desc: `Отдаляет первое масштабирование <b>M2</b> на <b>+10</b> за уровень (обычно 10).`,
        curr: "unnatural",

        cost: a => a.sumBase(1.1).pow_base(10).mul(1e40),
        bulk: a => a.div(1e40).log(10).sumBase(1.1,true).floor().add(1),

        effect(a) {
            let x = Decimal.mul(10,a)
            return x
        },
        effDesc: x => "+"+format(x,0),
    },
    "UM9": {
        max: 1,
        unl: ()=>hasUpgrade('UM8') && player.dark.unl,

        desc: `<b>UM8</b> теперь влияет на масштабирование <b>M3</b> в 50% порядке.`,
        curr: "unnatural",

        cost: 1e130,
    },
    "UM10": {
        max: 1,
        unl: ()=>hasUpgrade('UM9'),

        desc: `Усиление от достижений теперь влияют на базу <b>M6</b>.`,
        curr: "unnatural",

        cost: 1e270,
    },
    "UM11": {
        max: 1,
        unl: ()=>hasUpgrade('UM10'),

        desc: `Усиление от всей нетрадиционной материи теперь улучшается тетрически.`,
        curr: "unnatural",

        cost: E('e3750'),
    },
    "UM12": {
        unl: ()=>hasUpgrade('UM11'),

        desc: `<b>Квадратизация</b> экспонеты для нетрадиционной материи за каждый уровень.`,
        curr: "unnatural",

        cost: a => a.sumBase(1.1).pow_base(3).mul(150).pow_base(10).pow_base(10),
        bulk: a => a.log(10).log(10).div(150).log(3).sumBase(1.1,true).floor().add(1),

        effect(a) {
            let x = Decimal.pow(2,a)
            return x
        },
        effDesc: x => formatPow(x,0),
    },

    "EM1": {
        max: 1,
        unl: ()=>true,

        desc: `Эффект <b>UM2</b> теперь в <b>квадрате</b>, если он выше <b>+1</b>.`,
        curr: "exotic",

        cost: 1e2,
    },
    "EM2": {
        unl: ()=>hasUpgrade("EM1"),

        get base() { return Decimal.add(2, upgradeEffect("EM8",0)) },

        get desc() {
            return `Увеличивает добычу экзоктической материи в <b>${formatMult(this.base)}</b> за уровень.`
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

        desc: `Добыча нетрадиционной материи улучена.`,
        curr: "exotic",

        cost: 5e3,
    },
    "EM4": {
        max: 1,
        unl: ()=>hasUpgrade("EM3"),

        desc: `<span style="font-size: 0.9em;">Пасивная генерация <b>10%</b> нетрадиционной материи при устранении материи в порядке на который влияет скорость.
        Однако, ты все ещё генерируешь традиционную материю в том же порядке.
        Антиматерия теперь безвредна и оставлена чисто ради забавы.</span>`,
        curr: "exotic",

        cost: 1e6,
    },
    "EM5": {
        max: 1,
        unl: ()=>hasUpgrade("EM4"),

        desc: `Автоматизация улучшений <b>UM*</b> без фактической траты валюты.`,
        curr: "exotic",

        cost: 1e7,
    },
    "EM6": {
        max: 1,
        unl: ()=>hasUpgrade("EM5"),

        desc: `Усиления экзоктики теперь в <b>квадрате</b>.`,
        curr: "exotic",

        cost: 1e9,
    },
    "EM7": {
        unl: ()=>hasUpgrade("EM6") && tmp.dark_penalty[1],

        get base() { return 1 },

        get desc() {
            return `Отдаляет переизбыток генерации материи во втором Темной наказании на <b>${formatMult(this.base)}</b> десятка^3 за уровень.`
        },
        curr: "exotic",

        cost: a => a.sumBase(1.1).pow_base(2).mul(1e18),
        bulk: a => a.div(1e18).log(2).sumBase(1.1,true).floor().add(1),

        effect(a) {
            let x = Decimal.mul(this.base,a)
            if (hasUpgrade("DM7")) x = x.sqr();
            return x
        },
        effDesc: x => "+"+format(x),
    },
    "EM8": {
        unl: ()=>hasUpgrade('EM7'),

        get base() { return 0.5 },

        get desc() {
            let base = this.base
            return `Рост базы для <b>EM2</b> на <b>+${format(base)}</b> за уровень.`
        },
        curr: "exotic",

        cost: a => a.sumBase(1.1).pow_base(1e3).mul(1e30),
        bulk: a => a.div(1e30).log(1e3).sumBase(1.1,true).floor().add(1),

        effect(a) {
            let x = Decimal.mul(this.base,a)
            return x
        },
        effDesc: x => "+"+format(x),
    },

    "DM1": {
        max: 1,
        unl: ()=>true,

        desc: `Вся нетрационная материя даёт <b>экспоненциальный</b> усиление по генерации материи.`,
        curr: "dark",

        cost: 1,

        effect(a) {
            let x = expPow(CURRENCIES.unnatural.total.add(1),1.5)
            return x
        },
        effDesc: x => formatPow(x),
    },
    "DM2": {
        max: 1,
        unl: ()=>hasUpgrade("DM1"),

        desc: `Эффект <b>M6</b> теперь ещё лучше.`,
        curr: "dark",

        cost: 5,
    },
    "DM3": {
        unl: ()=>hasUpgrade("DM2"),

        get base() { return Decimal.add(2, 0) },

        get desc() {
            return `Добыча темной материи увеличено на <b>${formatMult(this.base)}</b> на уровне.`
        },
        curr: "dark",

        cost: a => a.sumBase(1.1).pow_base(10).mul(10),
        bulk: a => a.div(10).log(10).sumBase(1.1,true).floor().add(1),

        effect(a) {
            let x = Decimal.pow(this.base,a)
            return x
        },
        effDesc: x => formatMult(x),
    },
    "DM4": {
        max: 1,
        unl: ()=>hasUpgrade("DM3"),

        desc: `Второе усиление экзоктической материи теперь влияет на рост материи по экспоненте. Усиления экзоктической материи снова в <b>квадрате</b>.`,
        curr: "dark",

        cost: 250,
    },
    "DM5": {
        max: 1,
        unl: ()=>hasUpgrade("DM4"),

        desc: `<span style="font-size: 0.9em;">Пасивная генерация <b>10%</b> экзоматерии из устранения нетрадиционной материи в порядке влияющей на скорость.
        Рост натуральной и испорченной материи больше не влияют и теперь чисто ради времени.
        Покупка данного улучшения приведет к Темному наказанию.</span>`,
        curr: "dark",

        cost: 1e3,

        on_buy() {
            player.antimatter_time = E(0)
        },
    },
    "DM6": {
        max: 1,
        unl: ()=>hasUpgrade("DM5"),

        desc: `Автоматизация улучшений <b>EM*</b> без фактической траты валюты.`,
        curr: "dark",

        cost: 1e4,
    },
    "DM7": {
        max: 1,
        unl: ()=>hasUpgrade("DM6"),

        desc: `Эффект <b>EM7</b> теперь в <b>квадрате</b>.`,
        curr: "dark",

        cost: 1e5,
    },
    "DM8": {
        max: 54,
        unl: ()=>hasUpgrade("DM7"),

        desc: `Башня генерации материи (10^^n) усилена на <b>+1</b> за квадратный уровень.`,
        curr: "dark",

        cost: a => a.pow_base(9).mul(1e12),
        bulk: a => a.div(1e12).log(9).floor().add(1),

        effect(a) {
            let x = a.pow(2)
            return x
        },
        effDesc: x => "+"+format(x),
    },
    "DM9": {
        max: 1,
        unl: ()=>hasUpgrade("DM8"),

        get desc() { return `Войди в <b>Материверс</b>, устраняя каждую материю с её возможностями, заменяя материю её старшим братом - <b>мета-материи</b>.
            Вкладки Материи и Устранений вместе с прошлыми усилениями и улучшения будут отключены.
            Мета-материи будет генерировать на основе материи. Обратной дороги из Материверса не будет, так что...` },
        curr: "dark",

        cost: 1e63,// 1e63,

        on_buy() {
            prevent_save = true
            document.body.style.opacity = 0

            setTimeout(()=>{
                player.meta.unl = true

                player.dark.matter = E(0)
                player.dark.total = E(0)
                resetUpgrades("DM")

                RESETS.dark.doReset()

                updateTemp()

                prevent_save = false
                document.body.style.opacity = 1

                switchTab(2)
            }, 2500)
        },
    },

    "MM1": {
        max: 1,
        unl: ()=>true,

        desc: `Генерирует <b>0.1</b> мета-материи каждую секунду. Дежавю?`,
        curr: "meta",

        cost: E(0),
    },
    'MM2': {
        max: 1,
        unl: ()=>hasUpgrade('MM1'),

        get base() { return Decimal.mul(0.1,upgradeEffect("MM3")) },

        get desc() { return `Мета-материя добавляет к базе генерации мета-материи в <b>${formatPercent(this.base)}</b> порядке.` },
        curr: "meta",

        cost: E(1),
    },
    "MM3": {
        unl: ()=>hasUpgrade("MM2"),

        get base() { return Decimal.mul(2,1) },
        get pow() { return Decimal.mul(upgradeEffect("O1"),simpleUpgradeEffect("MM4",1)) },

        get desc() {
            let p = this.pow
            return `Увеличивает базу для <b>MM2</b> на <b>${formatMult(this.base)}</b> за уровень${p == 1 ? "" : `<sup>${format(p,3)}</sup>`}.`
        },
        curr: "meta",

        cost: a => a.pow_base(2).pow_base(1e2),
        bulk: a => a.log(1e2).log(2).floor().add(1),

        effect(a) {
            let x = this.base.pow(a.pow(this.pow))
            return x
        },
        effDesc: x => formatMult(x),
    },
    'MM4': {
        max: 1,
        unl: ()=>hasUpgrade('MM3'),

        get desc() { return `Лучшая за все время мета-материя увеличивает экспоненту эффекта <b>MM2</b> в уменьшенном порядке.` },
        curr: "meta",

        cost: E('ee5'),

        effect(a) {
            let d = Decimal.div(0.317,upgradeEffect("MM5"))
            let b = player.meta.best.add(10).log10().log10()
            let x = b.div(b.pow(d)).add(1)
            if (hasUpgrade("O3")) x = x.pow(upgradeEffect("O1"));
            if (hasUpgrade("O4")) x = x.pow(upgradeEffect("MM5"));
            return x
        },
        effDesc: x => formatMult(x),
    },
    'MM5': {
        unl: ()=>hasUpgrade('MM4'),

        get base() { return Decimal.mul(2,1) },
        get pow() { return Decimal.mul(1,hasUpgrade("O5")?upgradeEffect("O1"):1) },

        get desc() {
            let p = this.pow
            return `Эффект <b>MM4</b> теперь <b>${formatMult(this.base)}</b> сильнее за уровень.${p == 1 ? "" : `<sup>${format(p,3)}</sup>`}.`
        },
        curr: "meta",

        cost: a => a.pow_base(2.5).pow_base(1e3).pow_base(10).pow_base(10),
        bulk: a => a.log(10).log(10).log(1e3).log(2.5).floor().add(1),

        effect(a) {
            let x = this.base.pow(a.pow(this.pow))
            return x
        },
        effDesc: x => formatMult(x),
    },
    "MM6": {
        unl: ()=>hasUpgrade("MM5"),

        get base() { return Decimal.mul(0.1,simpleUpgradeEffect("O8")) },
        get pow() { return Decimal.add(1,upgradeEffect("O6",0)).mul(hasAchievement("ach44")?getAchievementBoost():1) },

        get desc() {
            let p = this.pow
            return `Увеличивает высоту башни роста мета-материи на <b>+${format(this.base)}</b> за уровень${p == 1 ? "" : `<sup>${format(p,3)}</sup>`}.`
        },
        curr: "meta",

        cost: a => Decimal.tetrate(5e2, a.sumBase(1.1).add(7)),
        bulk: a => a.slog(5e2).sub(7).sumBase(1.1,true).add(1).floor(),

        effect(a) {
            let x = this.base.mul(a.pow(this.pow))
            return x
        },
        effDesc: x => "+"+format(x),
    },

    "O1": {
        max: 5,
        unl: ()=>hasUpgrade('MM3'),

        get base() { return Decimal.mul(2,1) },

        get desc() { return `Сбрось все в обмен на увеличение экспоненты эффекта <b>MM2</b> на <b>${formatMult(this.base)}</b> за уровень.` },
        curr: "meta",

        cost(a) { return Decimal.tetrate(Number.MAX_VALUE, a.add(1)) },
        bulk(a) { return a.slog(Number.MAX_VALUE).floor() },

        effect(a) {
            let x = this.base.pow(a)
            return x
        },
        effDesc: x => formatMult(x),

        on_buy() {
            player.meta.matter = E(0)
            player.meta.best = E(0)

            resetUpgrades("MM")
        }
    },
    "O2": {
        max: 1,
        unl: ()=>hasUpgrade('O1'),

        desc: `Автоматизация улучшений <b>MM*</b> без фактической траты валюты.`,
        curr: "meta",

        cost: E('ee100'),
    },
    "O3": {
        max: 1,
        unl: ()=>hasUpgrade('O2'),

        desc: `Улучшение <b>O1</b> влияет на силу <b>MM4</b>.`,
        curr: "meta",

        cost: E('eee1000'),
    },
    "O4": {
        max: 1,
        unl: ()=>hasUpgrade('O3'),

        desc: `Улучшение <b>MM5</b> увеличивает эффект <b>MM4</b>.`,
        curr: "meta",

        cost: E('5 PT 3'),
    },
    "O5": {
        max: 1,
        unl: ()=>hasUpgrade('O4'),

        desc: `Улучшение <b>O1</b> также влияет на экспоненту <b>MM5</b>.`,
        curr: "meta",

        cost: E('6 TP 2'),
    },
    "O6": {
        max: 18,
        unl: ()=>hasUpgrade("O5"),

        get base() { return Decimal.add(1,upgradeEffect("O7",0)) },
        get pow() { return Decimal.mul(1,1) },

        get desc() {
            let p = this.pow
            return `Увеличивает экспоненту для эффекта <b>MM2</b> на <b>+${format(this.base)}</b> за уровень${p == 1 ? "" : `<sup>${format(p,3)}</sup>`}.`
        },
        curr: "meta",

        cost: a => Decimal.tetrate(10, a.pow(2).pow_base(10).mul(1e4)),
        bulk: a => a.slog(10).div(1e4).log10().root(2).add(1).floor(),

        effect(a) {
            let x = this.base.mul(a.pow(this.pow))
            return x
        },
        effDesc: x => "+"+format(x),
    },
    "O7": {
        max: 4,
        unl: ()=>hasUpgrade("O5"),

        get base() { return Decimal.mul(0.5,1) },
        get pow() { return Decimal.mul(1,1) },

        get desc() {
            let p = this.pow
            return `Увеличивает базу для <b>O6</b> на <b>+${format(this.base)}</b> за уровень${p == 1 ? "" : `<sup>${format(p,3)}</sup>`}.`
        },
        curr: "meta",

        cost: a => Decimal.tetrate(10, a.pow_base(2).mul(19).pow_base(10)),
        bulk: a => a.slog(10).div(1e18).log10().div(19).log(2).add(1).floor(),

        effect(a) {
            let x = this.base.mul(a.pow(this.pow))
            return x
        },
        effDesc: x => "+"+format(x),
    },
    "O8": {
        max: 1,
        unl: ()=>hasUpgrade('O7'),

        desc: `База <b>MM6</b> усилено лучшей мета-материей в уменьшенном порядке`,
        curr: "meta",

        cost: E('1e140 TP 1'),

        effect(a) {
            let x = expPow(player.meta.best.max(1).slog(10).add(1),0.65)
            return x
        },
        effDesc: x => formatMult(x),
    },
    "O9": {
        max: 1,
        unl: ()=>hasUpgrade('O8'),

        desc: `<b style="color : gold">Разломать все до омниуровня...</b>`,
        curr: "meta",

        cost: E('1e308 TP 1'),

        on_buy() {
            prevent_save = true
            document.body.style.opacity = 0

            setTimeout(()=>{
                unlockAchievement("ach46")
                document.body.style.opacity = 1
                el('app').style.display = "none"
                el('the-end').style.display = "block"
                el('the-end').style.opacity = 1

                el('full-time').innerHTML = formatTime(player.time_played)
            }, 2500)
        }
    },
}

const UPG_KEYS = Object.keys(UPGRADES)
const PREFIXES = ["M",'UM','EM',"DM","MM","O"]

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
    "DM": "Dark Matter",
    "MM": "Meta-Matter",
    "O": "Operator",
}

function getUpgradeCost(id) {
    let u = UPGRADES[id]

    return Decimal.gt(u.max ?? EINF,1) ? u.cost(player.upgrades[id]) : u.cost
}

function buyUpgrade(id, all = false, auto = false) {
    let u = UPGRADES[id], lvl = player.upgrades[id], max = u.max ?? EINF

    if (tmp.lock_upg.includes(id) || !player.upgs_unl.includes(id) && !u.unl() || lvl.gte(max)) return

    let cost = getUpgradeCost(id), curr = CURRENCIES[u.curr]

    if (!Decimal.isNaN(cost) && curr.amount.gte(cost)) {
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

function hasUpgrade(id,l=1) { return player.upgrades[id]?.gte?.(l) }
function upgradeEffect(id,def=1) { return tmp.upgs_effect[id] ?? def }
function simpleUpgradeEffect(id,def=1) { return hasUpgrade(id) ? tmp.upgs_effect[id] ?? def : def }

function updateUpgradesTemp() {
    for (let id in UPGRADES) {
        let u = UPGRADES[id]
        if (u.effect) tmp.upgs_effect[id] = u.effect(player.upgrades[id])
    }

    let auto = []

    if (!player.meta.unl) {
        if (hasUpgrade("UM3")) auto.push(...PREFIX_TO_UPGS['M']);
        if (hasUpgrade("EM5")) auto.push(...PREFIX_TO_UPGS['UM']);
        if (hasUpgrade("DM6")) auto.push(...PREFIX_TO_UPGS['EM']);
    }

    if (hasUpgrade("O2")) auto.push(...PREFIX_TO_UPGS['MM']);

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
