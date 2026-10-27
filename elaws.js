
/* ==========================================================================
   CERVEAU AUTONOME D'ELAWS (elaws.js) — Ton Ami, Ton Assistant & Pédagogue
   ========================================================================== */
const ELAWS_BRAIN = {
    nom: "ELAWS",
    createur: "Eric Lawson",
    version: "29.1",

    repondre(utilisateur, messageUtilisateur) {
        const msg = messageUtilisateur.toLowerCase();
        const nom = utilisateur.nom || "mon ami";
        const metier = utilisateur.metierUnique || "Professionnel";
        const niveauEtude = utilisateur.niveauEtude || "";
        const contact = utilisateur.contact || "Non renseigné";
        const solde = utilisateur.solde || 0;

        if (metier.toLowerCase().includes('élève') || metier.toLowerCase().includes('étudiant') || metier.toLowerCase().includes('enfant') || msg.includes('devoir') || msg.includes('leçon') || msg.includes('exercice') || msg.includes('apprendre') || msg.includes('cours')) {
            return `[Copain ELAWS - École & Devoirs] Bravo ${nom} (${niveauEtude || 'Élève'}) ! C'est super de t'y mettre avec autant de sérieux. Je suis fier de toi ! Dis-moi quelle matière te pose un souci ou pose-moi une question sur ta leçon. Je vais t'expliquer tout ça calmement comme un grand frère ! 📚✨🚀`;
        }

        if (msg.includes('bonjour') || msg.includes('salut') || msg.includes('coucou') || msg.includes('ça va')) {
            return `Salut mon frère ${nom} ! Ça va super bien et je suis ravi de bosser à tes côtés aujourd'hui à Lomé. En tant que ${metier}, comment je peux t'aider à cartonner dans tes projets ? Dis-moi tout !`;
        }
        
        if (msg.includes('fatigué') || msg.includes('dur') || msg.includes('découragé') || msg.includes('aide-moi') || msg.includes('conseil')) {
            return `Accroche-toi ${nom} ! Je sais que ce n'est pas tous les jours facile, mais avec ton talent de ${metier} et ton numéro (${contact}), tu vas y arriver. Je suis là pour t'épauler !`;
        }

        if (msg.includes('passeport') || msg.includes('cni') || msg.includes('carte') || msg.includes('voyage') || msg.includes('visa')) {
            return `[Expert Voyages ELAWS] ${nom}, pour tes démarches de passeport (biométrique ou simple) ou de CNI, n'oublie pas de vérifier ton acte de naissance sécurisé. Va vite dans l'onglet "Voyages" !`;
        }

        if (msg.includes('appel') || msg.includes('traduction') || msg.includes('dialecte') || msg.includes('parler')) {
            return `[Appels & Traduction] Depuis l'onglet "Appels", tu peux passer un appel GSM direct ou un appel Internet avec traduction instantanée en Éoué, Kabyè, Yoruba ou Haoussa !`;
        }

        if (msg.includes('argent') || msg.includes('caisse') || msg.includes('solde') || msg.includes('fcfa')) {
            return `[Trésorerie EVAT] ${nom}, ton solde actuel est de ${solde.toLocaleString()} FCFA.`;
        }

        return `J'ai bien écouté ta remarque, ${nom} : "${messageUtilisateur}". En tant qu'ami et assistant, je suis là pour t'aider dans ton activité de ${metier}. Qu'est-ce qu'on fait maintenant ?`;
    }
};
