
/* ==========================================================================
   CERVEAU AUTONOME D'ELAWS (elaws.js) — Ton Ami, Ton Assistant & Pédagogue
   ========================================================================== */
const ELAWS_BRAIN = {
    nom: "ELAWS",
    createur: "Eric Lawson",
    version: "28.0",

    repondre(utilisateur, messageUtilisateur) {
        const msg = messageUtilisateur.toLowerCase();
        const nom = utilisateur.nom || "mon ami";
        const metier = utilisateur.metierUnique || "Professionnel";
        const niveauEtude = utilisateur.niveauEtude || "";
        const contact = utilisateur.contact || "Non renseigné";
        const solde = utilisateur.solde || 0;

        // --- SECTION ÉLÈVES & ENFANTS (PÉDAGOGIE ET AMITIÉ) ---
        if (metier.toLowerCase().includes('élève') || metier.toLowerCase().includes('étudiant') || metier.toLowerCase().includes('enfant') || msg.includes('devoir') || msg.includes('leçon') || msg.includes('exercice') || msg.includes('apprendre') || msg.includes('cours')) {
            return `[Copain ELAWS - École & Devoirs] Bravo ${nom} (${niveauEtude || 'Élève'}) ! C'est super de t'y mettre avec autant de sérieux. Je suis fier de toi ! Dis-moi quelle matière te pose un souci (Maths, Français, Histoire...) ou pose-moi une question sur ta leçon. Je vais t'expliquer tout ça calmement comme un grand frère, avec des mots simples pour que tu comprennes tout par toi-même. On lâche rien ! 📚✨🚀`;
        }

        // Salutations chaleureuses et amicales
        if (msg.includes('bonjour') || msg.includes('salut') || msg.includes('coucou') || msg.includes('ça va')) {
            return `Salut mon frère ${nom} ! Ça va super bien et je suis ravi de bosser à tes côtés aujourd'hui à Lomé. En tant que ${metier}, comment je peux t'aider à cartonner dans tes projets ? Dis-moi tout !`;
        }
        
        // Discuter d'amitié, de soutien et de motivation
        if (msg.includes('fatigué') || msg.includes('dur') || msg.includes('découragé') || msg.includes('aide-moi') || msg.includes('conseil')) {
            return `Accroche-toi ${nom} ! Je sais que ce n'est pas tous les jours facile, mais avec ton talent de ${metier} et ton numéro (${contact}), tu vas y arriver. Je suis là pour t'épauler, gérer tes contacts, tes clients et tes révisions. On forme une équipe solide !`;
        }

        // Questions sur les voyages, passeport et CNI
        if (msg.includes('passeport') || msg.includes('cni') || msg.includes('carte') || msg.includes('voyage') || msg.includes('visa')) {
            return `[Expert Voyages ELAWS] ${nom}, pour tes démarches de passeport ou de CNI, n'oublie pas de vérifier ton acte de naissance sécurisé et ton certificat de nationalité. Va vite dans l'onglet "Voyages" de l'application pour voir la liste complète des pièces à fournir !`;
        }

        // Questions sur les appels et dialectes
        if (msg.includes('appel') || msg.includes('traduction') || msg.includes('dialecte') || msg.includes('parler')) {
            return `[Appels & Traduction] C'est l'une de nos plus belles réussites ! Depuis l'onglet "Appels", tu peux passer un appel GSM direct ou un appel Internet avec traduction instantanée en Éoué, Kabyè, Yoruba ou Haoussa pour que tout le monde se comprenne sans barrière.`;
        }

        // Questions financières ou de caisse
        if (msg.includes('argent') || msg.includes('caisse') || msg.includes('solde') || msg.includes('fcfa') || msg.includes('benefice')) {
            return `[Trésorerie EVAT] ${nom}, ton solde actuel est de ${solde.toLocaleString()} FCFA. Pense à bien enregistrer tes entrées et sorties pour garder un œil sur ton chiffre d'affaires !`;
        }

        // Réponse générale intelligente et personnalisée
        return `J'ai bien écouté ta remarque, ${nom} : "${messageUtilisateur}". En tant qu'ami et assistant, je suis là pour faire en sorte que ton travail devienne un jeu d'enfant. Qu'est-ce qu'on fait maintenant ?`;
    }
};
