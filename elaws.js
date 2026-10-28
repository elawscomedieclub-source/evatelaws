
const ELAWS_BRAIN = {
    repondre: function(profil, texte) {
        if (!texte) return "Je t'écoute, mon ami ! Pose-moi n'importe quelle question dans n'importe quel domaine.";
        const t = texte.toLowerCase();
        const nom = profil ? profil.nom : "mon ami";
        const metier = profil ? (profil.metierUnique || "professionnel") : "entrepreneur";

        if (t.includes('manger') || t.includes('cuisiner') || t.includes('recette') || t.includes('préparer') || t.includes('faim') || t.includes('plat') || t.includes('cuisson') || t.includes('repas')) {
            return `C'est une excellente question culinaire, ${nom} ! Pour te préparer un bon plat, dis-moi de quels ingrédients tu disposes. Dès que tu me donnes ta liste, je t'écris la recette pas à pas avec les temps de cuisson ! 🍲🔥`;
        }
        if (t.includes('ordinateur') || t.includes('pc') || t.includes('réparer') || t.includes('bug') || t.includes('code') || t.includes('javascript') || t.includes('node') || t.includes('téléphone') || t.includes('logiciel')) {
            return `Sur le plan technique et numérique, ${nom}, voici la méthode pour résoudre ce problème : diagnostic précis, résolution étape par étape et test. Dis-moi quel est l'élément ou l'erreur exacte, et je te donne la solution immédiate ! 💻🛠️`;
        }
        if (t.includes('entreprise') || t.includes('business') || t.includes('argent') || t.includes('client') || t.includes('vente') || t.includes('projet') || t.includes('nif')) {
            return `En tant qu'assistant stratégique pour ton activité de ${metier}, ${nom}, la clé repose sur l'analyse de rentabilité et l'organisation rigoureuse. Veux-tu que l'on rédige un plan d'action détaillé pour ce projet ? 💼📈`;
        }
        return `C'est une question très intéressante, ${nom} ! En tant qu'intelligence universelle de ton écosystème EVAT, voici ce qu'il faut retenir sur "${texte}" :

Pour réussir dans ce domaine, la méthode et la pratique sont essentielles. Si tu veux que l'on développe un point précis ou que l'on calcule quelque chose, dis-le-moi et je t'apporte une réponse immédiate et détaillée ! 💡✨`;
    }
};
