
const ELAWS_BRAIN = {
    repondre: function(profil, texte) {
        const t = texte.toLowerCase();
        const ton = profil.iaTon || "standard";
        let prefixe = "";
        if (ton === "pedagogique") prefixe = "💡 [Mode Pédagogique] ";
        if (ton === "vocal_inclusif") prefixe = "🗣️ [Mode Vocal] ";

        if(t.includes('bonjour') || t.includes('salut')) {
            return `${prefixe}Bonjour ${profil.nom} ! Assistant interactif EVAT v3.14 prêt.`;
        }
        if(t.includes('voyage') || t.includes('démarche') || t.includes('passeport')) {
            return `${prefixe}Rendez-vous dans l'onglet **Guide Voyage & Démarches** pour lancer votre suivi interactif pas à pas !`;
        }
        return `${prefixe}Requête traitée : "${texte}". Accompagnement en cours.`;
    }
};
