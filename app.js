
let utilisateur = JSON.parse(localStorage.getItem('evat_profil')) || {
    nom: "Kodjo Marceline",
    type: "adulte",
    sousType: "Travailleur",
    metiers: ["Entrepreneur / Développeur"],
    contacts: []
};

let ecouteVocaleActive = false;

function toggleMenu(event) {
    if (event) event.stopPropagation();
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('appOverlay');
    const isOpen = sidebar.classList.toggle('open');
    if (isOpen) {
        overlay.classList.add('active');
    } else {
        overlay.classList.remove('active');
    }
}

function fermerTousLesMenus() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('elawsPopup').style.display = 'none';
    document.getElementById('appOverlay').classList.remove('active');
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.sidebar-links a').forEach(el => el.classList.remove('active'));
    
    document.getElementById('tab-' + tabId).classList.add('active');
    const link = document.getElementById('link-' + tabId);
    if(link) link.classList.add('active');
    
    fermerTousLesMenus();
    
    if(tabId === 'profil') chargerProfilInterface();
    if(tabId === 'outils') afficherOutilsDynamiques();
    if(tabId === 'dashboard') actualiserDashboard();
}

function toggleElawsChat(event) {
    if (event) event.stopPropagation();
    const popup = document.getElementById('elawsPopup');
    const overlay = document.getElementById('appOverlay');
    if(popup.style.display === 'none' || popup.style.display === '') {
        popup.style.display = 'flex';
        overlay.classList.add('active');
    } else {
        popup.style.display = 'none';
        overlay.classList.remove('active');
    }
}

function toggleMicrophone() {
    const btn = document.getElementById('microBtn');
    const status = document.getElementById('voiceStatus');
    ecouteVocaleActive = !ecouteVocaleActive;
    
    if(ecouteVocaleActive) {
        btn.classList.add('active');
        status.style.display = 'block';
        setTimeout(() => {
            if(ecouteVocaleActive) {
                document.getElementById('elawsInput').value = "Bonjour ELAWS, peux-tu m'assister ?";
                toggleMicrophone();
                envoyerMessageElaws();
            }
        }, 3000);
    } else {
        btn.classList.remove('active');
        status.style.display = 'none';
    }
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
    actualiserDashboard();
    alert("Profil, situation et métiers enregistrés avec succès !");
    switchTab('dashboard');
}

function actualiserDashboard() {
    document.getElementById('dashNomUser').innerText = utilisateur.nom || "Mon Ami";
    const typeLabel = utilisateur.type === 'adulte' ? `Adulte (${utilisateur.sousType || 'Travailleur'})` : `Enfant (${utilisateur.sousType || 'Scolarisé'})`;
    document.getElementById('dashStatProfil').innerText = typeLabel;
    const nbMetiers = utilisateur.metiers ? utilisateur.metiers.length : 0;
    document.getElementById('dashStatMetiers').innerText = `${nbMetiers} Métier${nbMetiers > 1 ? 's' : ''}`;
    const nbContacts = utilisateur.contacts ? utilisateur.contacts.length : 0;
    document.getElementById('dashStatContacts').innerText = `${nbContacts} Contact${nbContacts > 1 ? 's' : ''}`;
    
    const badge = document.getElementById('sidebarUserRole');
    if(badge) badge.innerText = `${utilisateur.nom} • ${nbMetiers} Métier(s)`;
}

function ajouterContact() {
    const nom = document.getElementById('contactNom').value.trim();
    const tel = document.getElementById('contactTel').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    
    if(!nom || (!tel && !email)) {
        alert("Veuillez renseigner un nom et au moins un moyen de contact (numéro GSM ou e-mail).");
        return;
    }
    if(!utilisateur.contacts) utilisateur.contacts = [];
    utilisateur.contacts.push({ nom, tel, email });
    localStorage.setItem('evat_profil', JSON.stringify(utilisateur));
    
    document.getElementById('contactNom').value = '';
    document.getElementById('contactTel').value = '';
    document.getElementById('contactEmail').value = '';
    afficherContacts();
    actualiserDashboard();
}

function afficherContacts() {
    const div = document.getElementById('listeContacts');
    if(!utilisateur.contacts || utilisateur.contacts.length === 0) {
        div.innerHTML = '<p class="text">Aucun contact enregistré pour l\'instant.</p>';
        return;
    }
    let html = '';
    utilisateur.contacts.forEach((c, index) => {
        html += `<div style="background:var(--bg-color); padding:12px 15px; border-radius:10px; margin-top:10px; border-left:3px solid var(--accent); display:flex; justify-content:space-between; align-items:center; gap:10px;">
            <div>
                <strong style="font-size:15px; color:var(--text-color);">${c.nom}</strong><br>
                <span class="text" style="font-size:12px; margin-bottom:0; color:var(--text-secondary);">📱 ${c.tel || 'Pas de GSM'} | ✉️ ${c.email || 'Pas d\'e-mail'}</span>
            </div>
            <div style="display:flex; gap:6px; flex-shrink:0;">
                ${c.tel ? `<a href="tel:${c.tel}" class="btn-action" style="padding:6px 12px; font-size:11px; text-decoration:none;" title="Appel GSM direct">📞 GSM</a>` : ''}
                ${c.email ? `<button onclick="appelerReseau('${c.email}')" class="btn-action" style="padding:6px 12px; font-size:11px; background:var(--success); color:#fff;" title="Appel réseau ELAWS">🌐 Réseau</button>` : ''}
                <button onclick="supprimerContact(${index})" style="background:var(--card-hover); border:1px solid var(--border-color); color:var(--danger); border-radius:6px; padding:6px 8px; cursor:pointer; font-size:11px;" title="Supprimer">🗑️</button>
            </div>
        </div>`;
    });
    div.innerHTML = html;
}

function supprimerContact(index) {
    if(confirm("Voulez-vous supprimer ce contact ?")) {
        utilisateur.contacts.splice(index, 1);
        localStorage.setItem('evat_profil', JSON.stringify(utilisateur));
        afficherContacts();
        actualiserDashboard();
    }
}

function appelerReseau(email) {
    alert(`🌐 Connexion Écosystème ELAWS :
L'appel Internet chiffré a été initié avec succès vers l'adresse : ${email}`);
}

function afficherOutilsDynamiques() {
    const zone = document.getElementById('zoneOutilsDynamiques');
    if(!utilisateur.metiers || utilisateur.metiers.length === 0) {
        zone.innerHTML = '<p class="text">Aucun corps de métier enregistré.</p>';
        return;
    }
    let html = '';
    utilisateur.metiers.forEach(metier => {
        html += `<div class="card" style="border-left: 4px solid var(--accent); margin-bottom:15px; background:var(--bg-color);">
            <h3 style="color:var(--accent); margin-bottom:6px;">🛠️ Espace Outils : ${metier}</h3>
            <p class="text" style="font-size:13px;">Outils de travail, notes et calculateurs instantanés pour ${metier}.</p>
            <div class="form-group" style="margin-top:10px;">
                <label style="font-size:12px;">Notes / Tâches en cours :</label>
                <input type="text" class="input" placeholder="Ajouter une note pour ${metier}..." onchange="sauvegarderNoteMetier('${metier}', this.value)">
            </div>
        </div>`;
    });
    zone.innerHTML = html;
}

function sauvegarderNoteMetier(metier, note) {
    if(note.trim()) {
        alert(`Note enregistrée avec succès pour le métier : ${metier} !`);
    }
}

function rechercherVoyage() {
    const pays = document.getElementById('inputPaysVoyage').value.trim();
    const res = document.getElementById('resultatVoyage');
    if(!pays) {
        res.innerHTML = '<p class="text" style="color:var(--danger);">Veuillez entrer un pays valide.</p>';
        return;
    }
    res.innerHTML = `<div style="background:var(--bg-color); padding:16px; border-radius:12px; border:1px solid var(--border-color);">
        <h4 style="color:var(--accent); margin-bottom:8px;">✈️ Exigences & Formalités pour : ${pays}</h4>
        <p class="text" style="margin-bottom:6px; font-size:13px;">• <strong>Passeport :</strong> Validité minimale de 6 mois exigée à la date d'entrée.</p>
        <p class="text" style="margin-bottom:6px; font-size:13px;">• <strong>Visa & Autorisations :</strong> Vérifier auprès des services consulaires officiels de ${pays} selon votre nationalité.</p>
        <p class="text" style="margin-bottom:0; font-size:13px; color:var(--success);">• <strong>Assistance ELAWS :</strong> Pensez à regrouper vos justificatifs d'hébergement et billets retour.</p>
    </div>`;
}

function rechercherBanque() {
    const pays = document.getElementById('inputPaysBanque').value.trim();
    const res = document.getElementById('resultatBanque');
    if(!pays) {
        res.innerHTML = '<p class="text" style="color:var(--danger);">Veuillez entrer un pays ou une institution financière.</p>';
        return;
    }
    res.innerHTML = `<div style="background:var(--bg-color); padding:16px; border-radius:12px; border:1px solid var(--border-color);">
        <h4 style="color:var(--accent); margin-bottom:8px;">💳 Obtention Carte Bancaire (Visa / Mastercard) - ${pays}</h4>
        <p class="text" style="margin-bottom:6px; font-size:13px;">• <strong>Pièces justificatives requises :</strong> Pièce d'identité officielle (CNI ou Passeport), Justificatif de domicile récent, Photos d'identité.</p>
        <p class="text" style="margin-bottom:0; font-size:13px;">• <strong>Dépôt initial :</strong> Requis selon les grilles tarifaires de la banque locale choisie.</p>
    </div>`;
}

function convertirDevise() {
    const montant = parseFloat(document.getElementById('montantDevise').value) || 0;
    const source = document.getElementById('deviseSource').value;
    const res = document.getElementById('resultatDevise');
    
    if(montant <= 0) {
        res.innerHTML = '<p class="text" style="color:var(--danger);">Veuillez entrer un montant valide supérieur à 0.</p>';
        return;
    }

    let resultatFCFA = 0;
    let resultatEUR = 0;
    let resultatUSD = 0;

    if(source === 'XOF') {
        resultatEUR = montant * 0.001525;
        resultatUSD = montant * 0.00165;
        res.innerHTML = `<div style="background:var(--bg-color); padding:16px; border-radius:12px; border:1px solid var(--border-color);">
            <h4>💱 Résultat de la conversion (depuis FCFA XOF)</h4>
            <p class="text" style="margin-top:8px; font-size:15px; font-weight:bold; color:var(--accent);">• ${montant.toLocaleString()} FCFA = ${resultatEUR.toFixed(2)} EUR (€)</p>
            <p class="text" style="margin-bottom:0; font-size:15px; font-weight:bold; color:var(--success);">• ${montant.toLocaleString()} FCFA = ${resultatUSD.toFixed(2)} USD ($)</p>
        </div>`;
    } else if(source === 'EUR') {
        resultatFCFA = montant * 655.957;
        resultatUSD = montant * 1.08;
        res.innerHTML = `<div style="background:var(--bg-color); padding:16px; border-radius:12px; border:1px solid var(--border-color);">
            <h4>💱 Résultat de la conversion (depuis Euro)</h4>
            <p class="text" style="margin-top:8px; font-size:15px; font-weight:bold; color:var(--accent);">• ${montant.toLocaleString()} EUR = ${resultatFCFA.toLocaleString(undefined, {maximumFractionDigits:2})} FCFA (XOF)</p>
            <p class="text" style="margin-bottom:0; font-size:15px; font-weight:bold; color:var(--success);">• ${montant.toLocaleString()} EUR = ${resultatUSD.toFixed(2)} USD ($)</p>
        </div>`;
    } else if(source === 'USD') {
        resultatFCFA = montant * 605.0;
        resultatEUR = montant * 0.925;
        res.innerHTML = `<div style="background:var(--bg-color); padding:16px; border-radius:12px; border:1px solid var(--border-color);">
            <h4>💱 Résultat de la conversion (depuis Dollar US)</h4>
            <p class="text" style="margin-top:8px; font-size:15px; font-weight:bold; color:var(--accent);">• ${montant.toLocaleString()} USD = ${resultatFCFA.toLocaleString(undefined, {maximumFractionDigits:2})} FCFA (XOF)</p>
            <p class="text" style="margin-bottom:0; font-size:15px; font-weight:bold; color:var(--success);">• ${montant.toLocaleString()} USD = ${resultatEUR.toFixed(2)} EUR (€)</p>
        </div>`;
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
    div.style.cssText = `margin-bottom:6px; text-align:${isUser ? 'right' : 'left'}; display:flex; flex-direction:column; align-items:${isUser ? 'flex-end' : 'flex-start'};`;
    div.innerHTML = `<span style="display:inline-block; background:${isUser ? 'var(--accent)' : 'var(--card-hover)'}; color:${isUser ? '#0b0f19' : 'var(--text-color)'}; padding:8px 12px; border-radius:10px; max-width:92%; word-break:break-word; border:1px solid var(--border-color); text-align:left; font-size:13px; line-height:1.4;"><strong>${isUser ? 'Moi' : 'ELAWS'} :</strong><br>${txt}</span>`;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

document.addEventListener('DOMContentLoaded', () => {
    actualiserDashboard();
    ajouterBulleElaws(`Bonjour ${utilisateur.nom || 'ami'} ! Je suis ELAWS, ton assistant universel au sein de l'écosystème EVAT. Comment puis-je t'aider ?`, 'elaws');
});
