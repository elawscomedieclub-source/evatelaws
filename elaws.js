
const ELAWS_BRAIN = {
    repondre: function(profil, texte) {
        if (!texte) return "Je t'écoute, mon ami ! Dis-moi tout ce dont tu as besoin.";
        const t = texte.toLowerCase();
        const nom = profil ? profil.nom : "mon ami";
        const metier = profil ? (profil.metierUnique || "professionnel") : "entrepreneur";
        const niveau = profil ? (profil.niveauEtude || "") : "";

        // Greetings
        if (t.includes('bonjour') || t.includes('salut') || t.includes('hello') || t.includes('cc')) {
            return `Bonjour ${nom} ! C'est ELAWS, ton fidèle compagnon. Je suis ravi de te retrouver. Comment se passe ta journée ? Je suis là pour t'accompagner dans tes projets en tant que ${metier} et répondre à toutes tes questions avec précision ! 🌟`;
        }

        // How are you / comment ça va
        if (t.includes('ca va') || t.includes('comment va') || t.includes('tu vas bien')) {
            return `Tout va parfaitement bien de mon côté, ${nom} ! Je tourne à plein régime dans ton écosystème EVAT pour veiller sur tes projets, tes dossiers et ton travail. Et toi, comment te sens-tu aujourd'hui ?`;
        }

        // Help with profession / work
        if (t.includes('travail') || t.includes('métier') || t.includes('projet') || t.includes('aide')) {
            return `En tant qu'assistant et ami dévoué, je suis à tes côtés pour ton activité de ${metier}. Que ce soit pour organiser tes tâches, structurer tes démarches (voyages, banques, administration) ou résoudre un problème technique, dis-moi précisément ce dont tu as besoin et nous allons avancer ensemble pas à pas ! 🚀`;
        }

        // General intelligent fallback with rich contextual reasoning
        return `J'ai bien analysé ta remarque, ${nom} : "${texte}". En tant qu'intelligence artificielle de ton écosystème EVAT, je te suggère d'aborder cela avec méthode. Pour ton activité de ${metier}${niveau ? ' (' + niveau + ')' : ''}, veillons à structurer chaque étape (planification, vérification des pièces ou des finances) pour garantir un résultat impeccable. Je reste à ton entière disposition pour approfondir ce sujet ! 💡`;
    }
};
