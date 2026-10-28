
const ELAWS_BRAIN = {
    repondre: function(profil, texte) {
        const t = texte.toLowerCase();
        const ton = profil.iaTon || "standard";
        let prefixe = "";
        if (ton === "pedagogique") prefixe = "💡 [Mode Pédagogique] ";
        if (ton === "vocal_inclusif") prefixe = "🗣️ [Mode Vocal] ";

        if(t.includes('bonjour') || t.includes('salut')) {
            return `${prefixe}Bonjour ${profil.nom} ! Bouclier d'urgence EVAT activé.`;
        }
        if(t.includes('urgence') || t.includes('crise') || t.includes('problème')) {
            return `${prefixe}Rendez-vous dans l'onglet **Urgences & Solutions** pour soumettre votre situation et obtenir un plan d'action immédiat par ELAWS !`;
        }
        return `${prefixe}Requête d'urgence traitée : "${texte}". Écosystème de terrain opérationnel.`;
    }
};
