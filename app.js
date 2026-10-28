
let utilisateur = JSON.parse(localStorage.getItem('evat_profil')) || {
    nom: "Kodjo",
    type: "adulte",
    sousType: "Travailleur",
    metiers: ["Entrepreneur"],
    contacts: []
};

function toggleMenu() {
    document.getElementById('sidebar').classList.toggle('open');
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.getElementById('tab-' + tabId).classList.add('active');
    document.getElementById('sidebar').classList.remove('open');
    if(tabId === 'profil') chargerProfilInterface();
    if(tabId === 'outils') afficherOutilsDynamiques();
}

function changerTypeProfil() {
    const type = document.getElementById('selectTypeProfil').value;
    const container = document.getElementById('sousProfilContainer');
    if(type === 'adulte') {
        container.innerHTML = `
            <label>Situation Adulte :</label>
            <select id="selectSousProfil" class="input">
                <option value="Travailleur">Travailleur (Formel / Indépendant)</option>
                <option value="Non-travailleur">En recherche / Non actif</option>
                <option value="Illettre">Accompagnement visuel & vocal (Illettré)</option>
            </select>
        `;
    } else {
        container.innerHTML = `
            <label>Situation Enfant :</label>
            <select id="selectSousProfil" class="input">
                <option value="Scolarise">Élève / Scolarisé</option>
                <option value="Non-scolarise">Non scolarisé / Apprentissage pratique</option>
            </select>
        `;
    }
}

function chargerProfilInterface() {
    document.getElementById('inputNom').value = utilisateur.nom || "";
    document.getElementById('selectTypeProfil').value = utilisateur.type || "adulte";
    changerTypeProfil();
    if(document.getElementById('selectSousProfil') && utilisateur.sousType) {
        document.getElementById('selectSousProfil').value = utilisateur.sousType;
    }
    document.getElementById('inputMetier').value = (utilisateur.metiers || []).join(', ');
    afficherContacts();
}

function sauvegarderProfilBase() {
    utilisateur.nom = document.getElementById('inputNom').value.trim() || "Utilisateur";
    utilisateur.type = document.getElementById('selectTypeProfil').value;
    const sousProfilEl = document.getElementById('selectSousProfil');
    if(sousProfilEl) utilisateur.sousType = sousProfilEl.value;
    
    const metiersBruts = document.getElementById('inputMetier').value.trim();
    utilisateur.metiers = metiersBruts ? metiersBruts.split(',').map(m => m.trim()).filter(m => m) : ["Général"];
    
    localStorage.setItem('evat_profil', JSON.stringify(utilisateur));
    document.getElementById('dashNomUser').innerText = utilisateur.nom;
    alert("Profil et métiers enregistrés avec succès !");
    switchTab('dashboard');
}

function ajouterContact() {
    const nom = document.getElementById('contactNom').value.trim();
    const tel = document.getElementById('contactTel').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    if(!nom || (!tel && !email)) {
        alert("Veuillez entrer au moins un nom et un moyen de contact (téléphone ou e-mail).");
        return;
    }
    if(!utilisateur.contacts) utilisateur.contacts = [];
    utilisateur.contacts.push({ nom, tel, email });
    localStorage.setItem('evat_profil', JSON.stringify(utilisateur));
    
    document.getElementById('contactNom').value = '';
    document.getElementById('contactTel').value = '';
    document.getElementById('contactEmail').value = '';
    afficherContacts();
}

function afficherContacts() {
    const div = document.getElementById('listeContacts');
    if(!utilisateur.contacts || utilisateur.contacts.length === 0) {
        div.innerHTML = '<p class="text">Aucun contact enregistré.</p>';
        return;
    }
    let html = '';
    utilisateur.contacts.forEach((c, index) => {
        html += `<div style="background:var(--bg-color); padding:12px; border-radius:8px; margin-top:8px; border-left:3px solid var(--accent); display:flex; justify-content:space-between; align-items:center;">
            <div>
                <strong>${c.nom}</strong><br>
                <span class="text" style="font-size:13px; margin-bottom:0;">📱 ${c.tel || 'Pas de numéro'} | ✉️ ${c.email || 'Pas d'e-mail'}</span>
            </div>
            <div style="display:flex; gap:6px;">
                ${c.tel ? `<a href="tel:${c.tel}" class="btn-action" style="padding:6px 10px; font-size:12px; text-decoration:none;">📞 GSM</a>` : ''}
                ${c.email ? `<button onclick="appelerReseau('${c.email}')" class="btn-action" style="padding:6px 10px; font-size:12px; background:var(--success); color:#fff;">🌐 ELAWS</button>` : ''}
            </div>
        </div>`;
    });
    div.innerHTML = html;
}

function appelerReseau(email) {
    alert(`Lancement de l'appel Internet via ELAWS vers : ${email}`);
}

function afficherOutilsDynamiques() {
    const zone = document.getElementById('zoneOutilsDynamiques');
    if(!utilisateur.metiers || utilisateur.metiers.length === 0) {
        zone.innerHTML = '<p class="text">Aucun métier enregistré dans ton profil.</p>';
        return;
    }
    let html = '';
    utilisateur.metiers.forEach(metier => {
        html += `<div class="card" style="border-left: 4px solid var(--accent); margin-bottom:15px;">
            <h3>🛠️ Outils pour : ${metier}</h3>
            <p class="text">Espace de travail dédié et outils pratiques adaptés.</p>
            <input type="text" class="input" placeholder="Note rapide pour ${metier}..." onchange="sauvegarderNoteMetier('${metier}', this.value)">
        </div>`;
    });
    zone.innerHTML = html;
}

function sauvegarderNoteMetier(metier, note) {
    alert(`Note enregistrée pour ${metier} : ${note}`);
}

function rechercherVoyage() {
    const pays = document.getElementById('inputPaysVoyage').value.trim();
    const res = document.getElementById('resultatVoyage');
    if(!pays) {
        res.innerHTML = '<p class="text" style="color:#f87171;">Veuillez entrer un pays.</p>';
        return;
    }
    res.innerHTML = `<div style="background:var(--bg-color); padding:15px; border-radius:8px;">
        <h4>✈️ Formalités pour ${pays}</h4>
        <p class="text" style="margin-top:8px;">• <strong>Passeport :</strong> Valide au moins 6 mois requis.<br>• <strong>Visa :</strong> Consulter l'ambassade ou le consulat de ${pays} pour les exigences actuelles.<br>• <strong>Conseil ELAWS :</strong> Vérifiez les vaccins obligatoires et billets de retour.</p>
    </div>`;
}

function rechercherBanque() {
    const pays = document.getElementById('inputPaysBanque').value.trim();
    const res = document.getElementById('resultatBanque');
    if(!pays) {
        res.innerHTML = '<p class="text" style="color:#f87171;">Veuillez entrer un pays ou une banque.</p>';
        return;
    }
    res.innerHTML = `<div style="background:var(--bg-color); padding:15px; border-radius:8px;">
        <h4>💳 Obtention Carte Visa / Mastercard (${pays})</h4>
        <p class="text" style="margin-top:8px;">• <strong>Pièces à fournir :</strong> Pièce d'identité (CNI / Passeport), Justificatif de domicile, Photos d'identité, Dépôt initial minimum.<br>• <strong>Procédure :</strong> Se rendre en agence bancaire locale ou effectuer la demande via l'application de la banque partenaire.</p>
    </div>`;
}

function convertirDevise() {
    const montant = parseFloat(document.getElementById('montantDevise').value) || 0;
    const source = document.getElementById('deviseSource').value;
    const res = document.getElementById('resultatDevise');
    
    let taux = 1;
    let cible = "EUR";
    if(source === 'XOF') { taux = 0.0015; cible = "EUR (€)"; }
    else if(source === 'EUR') { taux = 655.957; cible = "FCFA (XOF)"; }
    else if(source === 'USD') { taux = 600.0; cible = "FCFA (XOF)"; }
    
    const resultat = montant * taux;
    res.innerHTML = `<div style="background:var(--bg-color); padding:15px; border-radius:8px;">
        <h4>💱 Résultat de la conversion</h4>
        <p class="text" style="margin-top:8px; font-size:16px; font-weight:bold; color:var(--accent);">${montant} ${source} = ${resultat.toFixed(2)} ${cible}</p>
    </div>`;
}

function toggleElawsChat() {
    const body = document.getElementById('elawsBody');
    const icon = document.getElementById('elawsToggleIcon');
    if(body.style.display === 'none') {
        body.style.display = 'flex';
        icon.innerText = '▼';
    } else {
        body.style.display = 'none';
        icon.innerText = '▲';
    }
}

function envoyerMessageElaws() {
    const input = document.getElementById('elawsInput');
    const txt = input.value.trim();
    if(!txt) return;
    ajouterBulleElaws(txt, 'user');
    input.value = '';
    setTimeout(() => {
        const rep = ELAWS_BRAIN.repondre(utilisateur, txt);
        ajouterBulleElaws(rep, 'elaws');
    }, 400);
}

function ajouterBulleElaws(txt, exp) {
    const chat = document.getElementById('elawsMessages');
    const isUser = exp === 'user';
    const div = document.createElement('div');
    div.style.cssText = `margin-bottom:8px; text-align:${isUser ? 'right' : 'left'};`;
    div.innerHTML = `<span style="display:inline-block; background:${isUser ? 'var(--accent)' : 'var(--card-bg)'}; color:${isUser ? '#0f172a' : 'var(--text-color)'}; padding:8px 12px; border-radius:8px; max-width:90%; word-break:break-word; border:1px solid var(--border-color); text-align:left;"><strong>${isUser ? 'Moi' : 'ELAWS'} :</strong><br>${txt}</span>`;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('dashNomUser').innerText = utilisateur.nom || "Mon Ami";
    ajouterBulleElaws(`Bonjour ${utilisateur.nom || 'ami'} ! Je suis ELAWS, ton assistant universel. Comment puis-je t'aider ?`, 'elaws');
});
