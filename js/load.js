function loadGame(start=true, gotNaN=false) {
    if (!gotNaN) prevSave = localStorage.getItem(SAVE_ID)
    player = getPlayerData()
    load(prevSave)
    reloadTemp()

    if (start) {
        setupHTML()
        setupTooltips()

        setTimeout(() => {
            updateTemp()
            loop()

            el("app").style.display = ""
            
            autosave = setInterval(save, 60000, true)
            setInterval(loop, 1000/FPS)
        }, 100);
    }
}