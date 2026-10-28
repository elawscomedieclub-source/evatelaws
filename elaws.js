
const ELAWS_BRAIN = {
    repondre: function(profil, texte) {
        const t = texte.toLowerCase();
        const ton = profil.iaTon || "standard";
        
        let prefixe = "";
        if (ton === "pedagogique") prefixe = "💡 [Mode Pédagogique] ";
        if (ton === "vocal_inclusif") prefixe = "🗣️ [Mode Vocal] ";

        if(t.includes('bonjour') || t.includes('salut')) {
            return `${prefixe}Bonjour ${profil.nom} ! Comment puis-je t'aider aujourd'hui ?`;
        }
        if(t.includes('convertis') || t.includes('fcfa')) {
            return `${prefixe}Conversion prise en compte. Consulte l'onglet **Échange & Devises** pour plus de détails !`;
        }
        return `${prefixe}J'ai bien reçu ton message : "${texte}". Je veille sur l'écosystème EVAT !`;
    }
};
