
const ELAWS_BRAIN = {
    repondre: function(profil, texte) {
        const t = texte.toLowerCase();
        if(t.includes('bonjour') || t.includes('salut') || t.includes('hello')) {
            return `Bonjour ${profil.nom} ! Comment se passe ton activité dans l'écosystème EVAT ?`;
        }
        if(t.includes('métier') || t.includes('outil')) {
            const metiersList = profil.metiers ? profil.metiers.join(', ') : 'aucun';
            return `Tu as actuellement ${profil.metiers ? profil.metiers.length : 0} métier(s) enregistré(s) : [${metiersList}]. Tu peux les modifier à tout moment dans l'onglet Profil.`;
        }
        if(t.includes('voyage') || t.includes('passeport') || t.includes('visa')) {
            return `Pour tes voyages et formalités, rends-toi dans l'onglet **Voyage & Démarches** pour interroger la base par pays en toute simplicité ! ✈️`;
        }
        if(t.includes('banque') || t.includes('carte') || t.includes('visa/mastercard')) {
            return `Tu peux consulter les exigences bancaires et pièces à fournir par pays dans l'onglet **Banque & Cartes**. 💳`;
        }
        if(t.includes('contact') || t.includes('appel')) {
            return `Ton répertoire personnel dans le Profil te permet de déclencher des appels GSM directs ou des appels Internet chiffrés via le réseau ELAWS. 📇`;
        }
        return `J'ai bien pris en compte ta demande : "${texte}". En tant qu'assistant de l'écosystème EVAT, je suis à tes côtés pour t'accompagner avec fluidité dans tes projets professionnels et personnels ! 💡`;
    }
};
