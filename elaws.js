
const ELAWS_BRAIN = {
    repondre: function(profil, texte) {
        const t = texte.toLowerCase();
        if(t.includes('bonjour') || t.includes('salut')) {
            return `Bonjour ${profil.nom} ! Je suis prêt à t'accompagner dans tes appels avec traduction instantanée en direct.`;
        }
        if(t.includes('appel') || t.includes('traduction') || t.includes('dialecte')) {
            return `La fonction de traduction live est active dans l'onglet **Appel Direct & Traduction Live**. ELAWS traduit en temps réel et résume les échanges !`;
        }
        return `J'ai bien reçu ton message : "${texte}". Je veille en arrière-plan pour faciliter tes communications dans tous les dialectes ! 💡`;
    }
};
