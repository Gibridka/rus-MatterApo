var tmp = {}
var options = {
    notation: "mixed_sc",
    comma: 9,
    mixed_sc: 63,
}

function reloadTemp() {
    tmp = {
        currency_gain: {},
        upgs_effect: {},

        exotic_boost: [1,1],
    }
}

function getUnnaturalBoost() {
    let x = expPow(CURRENCIES.unnatural.total.add(1),Decimal.add(2, simpleUpgradeEffect("UM2",0)).add(simpleUpgradeEffect("UM4",0)))

    return x
}

function getExoticBoost() {
    let x = CURRENCIES.exotic.total.add(1).pow(2), y = CURRENCIES.exotic.total.add(1).log10().div(8).add(1)

    if (hasUpgrade("EM6")) {
        x = x.pow(2)
        y = y.pow(2)
    }

    return [x,y]
}

function getDarkBoost() {
    let x = CURRENCIES.dark.total.add(1).pow(2), y = CURRENCIES.dark.total.add(1).log10().div(10).add(1)

    return [x,y]
}

function getAchievementBoost() {
    let x = Decimal.pow(1.01, player.achievements.length)

    return x
}

function getEM4Rate() {
    return hasAchievement("ach26") ? 1 : 0.1
}

function antimatterGrowthSpeed() {
    let x = simpleUpgradeEffect('M5',E(1))

    if (hasAchievement('ach22')) x = x.mul(2)

    return x
}

function antiUnnaturalGrowthSpeed() {
    let x = simpleUpgradeEffect('UM5',E(1))

    if (hasAchievement('ach22')) x = x.mul(2)

    return x
}

function updateTemp() {
    updateUpgradesTemp()

    tmp.unnatural_boost = getUnnaturalBoost()
    tmp.exotic_boost = getExoticBoost()
    tmp.dark_boost = getDarkBoost()

    tmp.unnatural_speed = antiUnnaturalGrowthSpeed()

    for (let [i,v] of Object.entries(CURRENCIES)) tmp.currency_gain[i] = preventNaNDecimal(v.gain??E(0));

    options.notation = ['sc','st','mixed_sc','log'][player.options.notation]
    options.comma = [3,6,9,12,15][player.options.comma]
    options.mixed_sc = [33,63,303,3003][player.options.mixed_sc]
}