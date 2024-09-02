const META_MATTER = {
    prefix: [
        ['', 'нетрадиционная', 'экзоктическая', 'темная', 'красная', 'розовая', 'феолетовая', 'фиалковая', 'синяя', 'бюрюзовая', 'зеленая', 'лаймовая', 'желтая', 'оранжевая', 'белая', 'распадающаяся'],
        ["бесконечная", "вечная", "реалистичная", "равная", "близкая", "известная", "индивидуальная", "важная", "имунитетная", "зерская"],
    ],
    
    get base() { return 1e3 },

    formatFull(n) {
        n = E(n)

        let h = "", tier = 0

        if (n.gte(Number.MAX_VALUE)) {
            tier = n.slog(Number.MAX_VALUE).floor().toNumber()-1

            let final = Math.floor(tier/10)
            if (tier+1 < Number.MAX_SAFE_INTEGER) h += n.iteratedlog(Number.MAX_VALUE, tier+1).format() + " ";
            if (final > 0) h += "meta" + (final > 1 ? `<sup>${format(final,0)}</sup>` : "") + "-";
            h += this.prefix[1][tier%10] + " ";
        } else {
            tier = n.toNumber()
            let tier_f = Math.floor(tier)
            
            let final = Math.floor(tier_f/16)
            if (tier_f < Number.MAX_SAFE_INTEGER) h += Decimal.pow(1e3, tier%1).format() + " ";
            if (final > 0) h += "final" + (final > 1 ? `<sup>${format(final,0)}</sup>` : "") + " ";
            if (tier_f % 16 > 0) h += this.prefix[0][tier_f%16] + " ";
        }

        return h + "matter"
    },
}

function updateMetaMatterTemp() {

}

function updateMetaMatterHTML() {
    el("meta-matter-production").innerHTML = META_MATTER.formatFull(player.meta.best)

    updateUpgrades("MM")
    updateUpgrades("O")
}
