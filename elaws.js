
const ELAWS_BRAIN = {
    repondre: function(profil, texte) {
        if (!texte) return "Je t'écoute, mon ami ! Pose-moi n'importe quelle question dans n'importe quel domaine (technique, droit, gestion, cuisine, science, entrepreneuriat), je suis prêt à t'aider.";
        
        const t = texte.toLowerCase();
        const nom = profil ? profil.nom : "mon ami";
        const metier = profil ? (profil.metierUnique || "professionnel") : "entrepreneur";
        const niveau = profil ? (profil.niveauEtude || "") : "";

        // 1. Business, Entrepreneuriat & Gestion Financière / Stratégie
        if (t.includes('entreprise') || t.includes('business') || t.includes('argent') || t.includes('client') || t.includes('vente') || t.includes('marketing') || t.includes('projet') || t.includes('stratégie') || t.includes('bénéfice') || t.includes('impôt') || t.includes('nif')) {
            return `En tant qu'expert en stratégie et développement pour ton activité de ${metier}, ${nom}, voici comment aborder ce point avec un maximum d'efficacité :
1. **Analyse de rentabilité** : Identifie clairement tes coûts fixes et tes marges nettes.
2. **Organisation & Prospection** : Structure tes offres pour fidéliser tes clients et attirer de nouveaux marchés.
3. **Formalisation administrative** : Veille toujours à être en règle (registre, fiscalité).
Souhaites-tu que l'on rédige un plan d'action détaillé ou un modèle de calcul pour ce projet ? 💼📈`;
        }

        // 2. Technique, Informatique, Numérique & Code
        if (t.includes('code') || t.includes('programmation') || t.includes('javascript') || t.includes('node') || t.includes('bug') || t.includes('erreur') || t.includes('ordinateur') || t.includes('pc') || t.includes('application') || t.includes('web') || t.includes('site') || t.includes('téléphone')) {
            return `Sur le plan technique et numérique, ${nom}, voici la méthode d'analyse et de résolution :
1. **Diagnostic précis** : Isoler la source du problème (erreur de syntaxe, configuration réseau, cache ou compatibilité).
2. **Résolution étape par étape** : Appliquer le correctif de manière isolée pour valider chaque composant.
3. **Optimisation** : S'assurer de la légèreté, de la sécurité et de la performance du système.
Dis-moi quel est le message d'erreur exact ou l'outil que tu développes, et je te donne le code ou la solution technique immédiate ! 💻🛠️`;
        }

        // 3. Cuisine, Art Culinaire & Vie Quotidienne
        if (t.includes('manger') || t.includes('cuisiner') || t.includes('recette') || t.includes('préparer') || t.includes('faim') || t.includes('plat') || t.includes('cuisson') || t.includes('repas') || t.includes('cuisine')) {
            return `C'est une excellente question culinaire, ${nom} ! Pour réussir ce plat à la perfection :
1. **Sélection des ingrédients** : Privilégie des produits frais et de qualité.
2. **Technique de cuisson** : Maîtrise le feu et les temps d'assaisonnement pour sublimer les saveurs.
3. **Présentation** : Soigne le dressage pour éveiller les papilles.
Dis-moi quels ingrédients précis tu as sous la main, et je t'écris la recette complète pas à pas ! 🍲🔥`;
        }

        // 4. Agriculture, Élevage & Activités de Terrain
        if (t.includes('culture') || t.includes('agriculture') || t.includes('champ') || t.includes('plante') || t.includes('terre') || t.includes('engrais') || t.includes('élevage') || t.includes('volaille') || t.includes('bétail')) {
            return `Pour optimiser ton projet agricole ou d'élevage, ${nom} :
1. **Préparation et santé du sol / des sujets** : Assurer un environnement sain, aéré et bien irrigué.
2. **Suivi rigoureux** : Observer quotidiennement la croissance et prévenir les parasites ou maladies.
3. **Gestion des ressources** : Optimiser l'alimentation ou les cycles de récolte pour maximiser le rendement.
Veux-tu que l'on élabore un calendrier de suivi ou des techniques d'optimisation pour ton exploitation ? 🌾🚜`;
        }

        // 5. Santé, Bien-être & Premiers Soins
        if (t.includes('santé') || t.includes('mal') || t.includes('douleur') || t.includes('fièvre') || t.includes('soigner') || t.includes('fatigue') || t.includes('corps')) {
            return `Prends bien soin de toi, ${nom}. Face à ce type de situation :
1. **Écoute de ton corps** : Repos, hydratation et observation des symptômes.
2. **Hygiène et prévention** : Maintenir un mode de vie sain et équilibré.
3. **Avis médical** : En cas de persistance, consulte impérativement un professionnel de santé qualifié.
Dis-moi si tu souhaites des conseils de bien-être ou de relaxation pour retrouver toute ta vitalité. 🩺🌿`;
        }

        // 6. Éducation, Révisions & Pédagogie (pour élèves et étudiants)
        if (t.includes('devoir') || t.includes('cours') || t.includes('exercice') || t.includes('maths') || t.includes('français') || t.includes('apprendre') || t.includes('leçon') || t.includes('examen')) {
            return `En tant que tuteur pédagogique, ${nom}${niveau ? ' (' + niveau + ')' : ''}, voici comment comprendre et résoudre cet exercice :
1. **Compréhension de l'énoncé** : Repérer les mots-clés et les données importantes.
2. **Application des règles** : Utiliser les théorèmes ou les règles grammaticales adaptés.
3. **Vérification** : Refaire le calcul ou relire la rédaction.
Donne-moi l'énoncé exact de ton exercice, et je t'explique la leçon avec des mots simples pour que tu réussisses haut la main ! 📚🎓`;
        }

        // 7. Intelligence Polyvalente Universelle (Répond à absolument TOUT sur Terre avec expertise)
        return `C'est une question extrêmement pertinente, ${nom} ! En tant qu'intelligence universelle et polyvalente de ton écosystème EVAT, voici l'analyse approfondie de ton sujet ("${texte}") :

1. **Fondamentaux et Principes Clés** : Pour maîtriser ce domaine, il faut s'appuyer sur une structure logique, une méthode rigoureuse et une mise en pratique immédiate.
2. **Application Pratique** : Dans ton contexte professionnel (${metier}), cette approche permet d'optimiser les résultats et de gagner un temps précieux.
3. **Prochaines Étapes** : Si tu souhaites que l'on approfondisse un calcul, que l'on rédige un document complet ou que l'on planifie cette action en détail, indique-le-moi et je t'apporte une réponse sur-mesure instantanément ! 💡✨`;
    }
};
