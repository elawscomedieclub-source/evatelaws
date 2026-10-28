
const ELAWS_BRAIN = {
    repondre: function(profil, texte) {
        const t = texte.toLowerCase();
        if(t.includes('bonjour') || t.includes('salut')) {
            return `Bonjour ${profil.nom} ! Comment se passe ta journée dans l'écosystème EVAT ?`;
        }
        if(t.includes('métier') || t.includes('outil')) {
            return `Tu as actuellement ${profil.metiers ? profil.metiers.length : 0} métier(s) enregistré(s). Tu peux les modifier à tout moment dans ton profil.`;
        }
        return `J'ai bien reçu ton message : "${texte}". En tant qu'intelligence de l'écosystème EVAT, je suis à tes côtés pour t'assister dans tes projets, tes voyages et tes contacts ! 💡`;
    }
};
