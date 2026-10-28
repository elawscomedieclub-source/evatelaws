
const ELAWS_BRAIN = {
    repondre: function(profil, texte) {
        const t = texte.toLowerCase();
        const ton = profil.iaTon || "standard";
        
        let prefixe = "";
        if (ton === "pedagogique") prefixe = "💡 [Mode Pédagogique] ";
        if (ton === "vocal_inclusif") prefixe = "🗣️ [Mode Vocal & Accompagné] ";

        if(t.includes('bonjour') || t.includes('salut')) {
            return `${prefixe}Bonjour ${profil.nom} ! Comment puis-je t'assister aujourd'hui dans l'écosystème EVAT ?`;
        }
        if(t.includes('convertis') || t.includes('fcfa')) {
            return `${prefixe}Conversion instantanée prise en compte. Pour convertir précisément tes devises, rends-toi dans l'onglet **Échange & Devises** !`;
        }
        if(t.includes('aide') || t.includes('aide-moi')) {
            return `${prefixe}Je suis ELAWS, ton assistant universel. Tu peux utiliser les commandes vocales, lancer des appels traduits en direct, ou gérer tes outils métiers.`;
        }
        return `${prefixe}J'ai bien compris ta demande : "${texte}". Je reste à tes côtés pour optimiser tes projets !`;
    }
};
