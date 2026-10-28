let utilisateurActif = JSON.parse(localStorage.getItem('evat_profil')) || {
    nom: "Kodjo",
    metierUnique: "Développeur & Entrepreneur"
};

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const btnMenu = document.getElementById('btnInstallerApp');
    const btnAccueil = document.getElementById('btnInstallerAccueil');
    if(btnMenu) btnMenu.style.display = 'block';
    if(btnAccueil) btnAccueil.style.display = 'block';
});

function declencherInstallation() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            deferredPrompt = null;
        });
    } else {
        alert("Pour installer l'application :\n1. Appuie sur les 3 points en haut à droite de ton navigateur.\n2. Sélectionne 'Ajouter à l'écran d'accueil' ou 'Installer l'application'.");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const btnMenu = document.getElementById('btnInstallerApp');
    const btnAccueil = document.getElementById('btnInstallerAccueil');
    if(btnMenu) btnMenu.addEventListener('click', declencherInstallation);
    if(btnAccueil) btnAccueil.addEventListener('click', declencherInstallation);
});

function toggleMenu() {
    document.getElementById('sidebar').classList.toggle('open');
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.getElementById('tab-' + tabId).classList.add('active');
    document.getElementById('sidebar').classList.remove('open');
    if(tabId === 'outils_metier') rendreOutilsMetier();
    if(tabId === 'convertisseur') calculerDevise();
}

function sauvegarderProfil() {
    const nomInput = document.getElementById('profilNom').value.trim();
    const metierInput = document.getElementById('profilMetier').value.trim();
    if(nomInput) utilisateurActif.nom = nomInput;
    if(metierInput) utilisateurActif.metierUnique = metierInput;
    localStorage.setItem('evat_profil', JSON.stringify(utilisateurActif));
    document.getElementById('userNameDisplay').innerText = utilisateurActif.nom;
    alert("Profil enregistré avec succès !");
    switchTab('accueil');
}

function rendreOutilsMetier() {
    const container = document.getElementById('outilsMetierContainer');
    let html = `
        <div class="card" style="border-color:#38bdf8;">
            <h3 class="card-title" style="color:#38bdf8;">🛠️ Espace Activité & Gestion — ${utilisateurActif.metierUnique}</h3>
            <p class="text">Gère tes projets, notes et tâches professionnelles en toute simplicité et en mode hors-ligne.</p>
            <div style="background:var(--bg-color); padding:15px; border-radius:10px; margin-bottom:15px; border:1px solid var(--border-color);">
                <input type="text" id="tacheTitre" class="input" placeholder="Intitulé de la tâche ou du projet *" style="margin-bottom:8px;">
                <textarea id="tacheDetails" class="input" rows="3" placeholder="Détails, notes ou prix..." style="resize:none; margin-bottom:10px;"></textarea>
                <button class="btn-action" onclick="ajouterTacheMetier()">➕ Enregistrer dans l'activité</button>
            </div>
            <h4 style="margin-bottom:8px;">📋 Historique de l'activité :</h4>
            <div id="listeTachesMetier"></div>
        </div>
    `;
    container.innerHTML = html;
    afficherTachesMetier();
}

function ajouterTacheMetier() {
    const titre = document.getElementById('tacheTitre').value.trim();
    const details = document.getElementById('tacheDetails').value.trim();
    if(!titre) { alert("Veuillez saisir un intitulé."); return; }
    if(!utilisateurActif.taches) utilisateurActif.taches = [];
    utilisateurActif.taches.unshift({ titre, details, date: new Date().toLocaleDateString() });
    localStorage.setItem('evat_profil', JSON.stringify(utilisateurActif));
    document.getElementById('tacheTitre').value = '';
    document.getElementById('tacheDetails').value = '';
    afficherTachesMetier();
}

function afficherTachesMetier() {
    const listeDiv = document.getElementById('listeTachesMetier');
    if(!listeDiv) return;
    if(!utilisateurActif.taches || utilisateurActif.taches.length === 0) {
        listeDiv.innerHTML = '<p style="color:var(--text-secondary);">Aucune tâche enregistrée.</p>';
        return;
    }
    let html = '';
    utilisateurActif.taches.forEach((t) => {
        html += `<div style="background:var(--bg-color); padding:10px; border-radius:8px; margin-bottom:8px; border-left:3px solid var(--accent);"><strong>📌 ${t.titre}</strong> (${t.date})<br><p style="margin:5px 0 0 0; color:var(--text-secondary);">${t.details || 'Aucun détail'}</p></div>`;
    });
    listeDiv.innerHTML = html;
}

function calculerDevise() {
    const montant = parseFloat(document.getElementById('convMontant').value) || 0;
    const de = document.getElementById('convDe').value;
    const vers = document.getElementById('convVers').value;
    const tauxEnEuros = { 'EUR': 1.0, 'XOF': 1 / 655.957, 'USD': 1 / 1.08, 'NGN': 1 / 1650, 'GHS': 1 / 14.5 };
    const enEuros = montant * (tauxEnEuros[de] || 1);
    const tauxCible = { 'EUR': 1.0, 'XOF': 655.957, 'USD': 1.08, 'NGN': 1650, 'GHS': 14.5 };
    const resultat = enEuros * (tauxCible[vers] || 1);
    document.getElementById('convResultat').innerText = `Résultat : ${resultat.toLocaleString(undefined, {maximumFractionDigits: 2})} ${vers}`;
}

function envoyerMessageElaws() {
    const input = document.getElementById('chatInput');
    const texte = input.value.trim();
    if(!texte) return;
    ajouterBulleChat(texte, 'user');
    input.value = '';
    setTimeout(() => {
        const reponse = ELAWS_BRAIN.repondre(utilisateurActif, texte);
        ajouterBulleChat(reponse, 'elaws');
    }, 300);
}

function ajouterBulleChat(texte, expediteur) {
    const chat = document.getElementById('chatMessages');
    const isUser = expediteur === 'user';
    const div = document.createElement('div');
    div.style.cssText = `margin-bottom:10px; display:flex; justify-content:${isUser ? 'flex-end' : 'flex-start'};`;
    div.innerHTML = `<div style="background:${isUser ? 'var(--accent)' : 'var(--card-bg)'}; color:${isUser ? '#0f172a' : 'var(--text-color)'}; padding:10px 14px; border-radius:10px; max-width:80%; word-break:break-word; border:1px solid var(--border-color); white-space:pre-line;"><strong>${isUser ? 'Moi' : 'ELAWS'} :</strong><br>${texte}</div>`;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('userNameDisplay').innerText = utilisateurActif.nom;
    document.getElementById('profilNom').value = utilisateurActif.nom;
    document.getElementById('profilMetier').value = utilisateurActif.metierUnique;
    ajouterBulleChat(`Bonjour ${utilisateurActif.nom} ! C'est ELAWS, ton assistant universel. Comment puis-je t'aider aujourd'hui ?`, 'elaws');
    calculerDevise();
});
