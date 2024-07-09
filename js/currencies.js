const CURRENCIES = {
    matter: {
        get amount() { return player.matter },
        set amount(v) { player.matter = v.max(0) },

        get best() { return player.best_matter },
        set best(v) { player.best_matter = v.max(0) },

        name: "matter",
    
        get gain() {
            let x = E(hasUpgrade('M1') ? 1 : 0)

            x = x.mul(upgradeEffect('M2')).mul(tmp.unnatural_boost).mul(tmp.exotic_boost[0]).mul(tmp.dark_boost[0])

            if (hasUpgrade('M7')) x = x.pow(upgradeEffect('M7'));
            if (hasAchievement('ach13')) x = x.pow(1.05);

            x = x.pow(tmp.exotic_boost[1])

            if (hasUpgrade("M10")) x = expPow(x,1.05);

            return x
        },
    },
    unnatural: {
        get amount() { return player.unnatural.matter },
        set amount(v) { player.unnatural.matter = v.max(0) },

        get total() { return player.unnatural.total },
        set total(v) { player.unnatural.total = v.max(0) },

        name: "unnatural matter",
    
        get gain() {
            if (player.best_matter.lt(1e3)) return E(0)

            let x = player.best_matter.div(1e2).slog(10)

            if (hasUpgrade("EM3")) x = x.pow(2)
            
            x = x.sub(1).pow_base(10).mul(simpleUpgradeEffect('M5')).mul(upgradeEffect('UM1')).mul(tmp.exotic_boost[0]).mul(tmp.dark_boost[0])

            if (hasAchievement('ach24')) x = x.pow(1.05);

            x = x.pow(tmp.dark_boost[1])

            return x.floor()
        },

        get passive() { return hasUpgrade("EM4") ? Decimal.mul(tmp.unnatural_speed,getEM4Rate()) : 0 },
    },
    exotic: {
        get amount() { return player.exotic.matter },
        set amount(v) { player.exotic.matter = v.max(0) },

        get total() { return player.exotic.total },
        set total(v) { player.exotic.total = v.max(0) },

        name: "exotic matter",
    
        get gain() {
            if (player.unnatural.total.lt(1e3)) return E(0)

            let x = expPow(player.unnatural.total.div(1e3),0.5).mul(simpleUpgradeEffect('UM5')).mul(upgradeEffect('EM2')).mul(tmp.dark_boost[0])

            return x.floor()
        },

        passive: 0,
    },
    dark: {
        get amount() { return player.dark.matter },
        set amount(v) { player.dark.matter = v.max(0) },

        get total() { return player.dark.total },
        set total(v) { player.dark.total = v.max(0) },

        name: "dark matter",
    
        get gain() {
            if (player.exotic.total.lt(1e9)) return E(0)

            let x = expPow(player.exotic.total.div(1e9),1/3)

            return x.floor()
        },

        passive: 0,
    },
}

function setupCurrencies() {
    
}

function gainCurrency(id,amt) {
    var curr = CURRENCIES[id]
    curr.amount = curr.amount.add(amt)
    if ('total' in curr) curr.total = curr.total.add(amt);
    if ('best' in curr) curr.best = curr.best.max(curr.amount);
}