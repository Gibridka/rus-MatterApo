function calc(dt) {
    for (let [i,v] of Object.entries(CURRENCIES)) {
        var passive = v.passive ?? 1
        gainCurrency(i, tmp.currency_gain[i].mul(dt*passive))
    }

    if (player.best_matter.gte(1e3)) {
        player.antimatter_time = player.antimatter_time.add(Decimal.mul(dt,antimatterGrowthSpeed()))

        if (!hasUpgrade("EM4") && getAntimatterGrowth().gte(player.matter)) {
            doReset('unnatural',true)
        }
    }

    if (hasUpgrade("EM4") && player.unnatural.total.gte(1e3)) {
        player.unnatural.anti_time = player.unnatural.anti_time.add(Decimal.mul(dt*getEM4Rate(),tmp.unnatural_speed))

        if (getAntiUnnaturalGrowth().gte(player.unnatural.total)) {
            doReset('exotic',true)
        }
    }

    let au = player.auto_upgs
    for (let id of tmp.auto_upg) if (!(id in au) || au[id]) buyUpgrade(id, false, true);

    player.time_played += dt

    checkAchievements();
}