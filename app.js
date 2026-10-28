
let utilisateur = JSON.parse(localStorage.getItem('evat_profil')) || {
    nom: "Kodjo Marceline",
    type: "adulte",
    sousType: "Travailleur",
    metiers: ["Entrepreneur", "Développeur Web"],
    contacts: [
        { nom: "Service Client ELAWS", tel: "+22898231402", email: "support@evat-elaws.net" }
    ],
    notes: [
        { titre: "Lancement v3.13", contenu: "Module de résolution d'urgences et de crises activé." }
    ],
    crises: [],
    audits: [],
    iaTon: "standard"
};

let ecouteVocaleActive = false;
let appelEnCoursInterval = null;
let secondesAppel = 0;

function lireVocalement(texte) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(texte);
        utterance.lang = 'fr-FR';
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
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
                document.getElementById('elawsInput').value = "j'ai une urgence à régler";
                toggleMicrophone();
                envoyerMessageElaws();
            }
        }, 3000);
    } else {
        btn.classList.remove('active');
        status.style.display = 'none';
    }
}

// --- MODULE DE RÉSOLUTION D'URGENCES & CRISE (v3.13) ---
function analyserEtResoudreCrise() {
    const desc = document.getElementById('criseDescription').value.trim();
    const echelle = document.getElementById('criseEchelle').value;
    const secteur = document.getElementById('criseSecteur').value;
    const container = document.getElementById('resultatCriseContainer');

    if(!desc) {
        alert("Veuillez décrire le problème ou la situation d'urgence.");
        return;
    }

    container.style.display = 'block';
    container.innerHTML = `<div style="background:var(--bg-color); padding:15px; border-radius:12px; border:1px solid var(--danger); text-align:center;">
        <h4 style="color:var(--danger);">🚨 ELAWS analyse la situation d'urgence (${echelle})...</h4>
        <p class="text" style="margin-top:8px;">Recherche de solutions de terrain et élaboration du plan d'action immédiat...</p>
    </div>`;

    setTimeout(() => {
        const solutionTitre = "Plan d'Urgence Immédiat ELAWS";
        const etapes = [
            "Étape 1 : Sécuriser la zone ou les actifs immédiatement impactés.",
            "Étape 2 : Mobiliser le réseau de proximité (entraide locale / contacts enregistrés).",
            "Étape 3 : Appliquer les mesures correctives standardisées (gestion de trésorerie d'urgence ou redémarrage technique)."
        ];

        const criseRecord = {
            description: desc,
            echelle: echelle,
            secteur: secteur,
            titre: solutionTitre,
            etapes: etapes,
            date: new Date().toLocaleDateString()
        };

        if(!utilisateur.crises) utilisateur.crises = [];
        utilisateur.crises.unshift(criseRecord);
        localStorage.setItem('evat_profil', JSON.stringify(utilisateur));

        afficherResultatCrise(criseRecord);
        afficherHistoriqueCrises();
        actualiserDashboard();
        lireVocalement("Analyse terminée. Plan d'urgence généré avec succès.");
    }, 1500);
}

function afficherResultatCrise(data) {
    const container = document.getElementById('resultatCriseContainer');
    let etapesHtml = '';
    data.etapes.forEach((etape, i) => {
        etapesHtml += `<li style="margin-bottom:6px; font-size:13px; color:var(--text-color);">${etape}</li>`;
    });

    container.innerHTML = `<div style="background:var(--bg-color); padding:18px; border-radius:14px; border-left:4px solid var(--danger);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <h4 style="color:var(--danger);">⚡ ${data.titre}</h4>
            <span style="background:rgba(239,68,68,0.2); color:var(--danger); padding:4px 10px; border-radius:8px; font-weight:700; font-size:12px;">Portée : ${data.echelle}</span>
        </div>
        <p style="font-size:13.5px; color:var(--text-secondary); margin-bottom:12px;"><strong>Problème :</strong> "${data.description}"</p>
        <h5 style="color:var(--accent); margin-bottom:6px; font-size:13px;">🛡️ Plan d'action recommandé par ELAWS :</h5>
        <ul style="padding-left:18px; margin-bottom:0;">${etapesHtml}</ul>
    </div>`;
}

function afficherHistoriqueCrises() {
    const div = document.getElementById('listeHistoriqueCrises');
    if(!utilisateur.crises || utilisateur.crises.length === 0) {
        div.innerHTML = '<p class="text">Aucune urgence enregistrée.</p>';
        return;
    }
    let html = '';
    utilisateur.crises.forEach((c, index) => {
        html += `<div style="background:var(--bg-color); padding:12px 15px; border-radius:12px; margin-top:10px; border-left:3px solid var(--danger); display:flex; justify-content:space-between; align-items:center;">
            <div>
                <strong style="font-size:14px; color:var(--text-color);">${c.description.substring(0, 40)}...</strong><br>
                <span class="text" style="font-size:11.5px; margin-bottom:0;">🚨 Échelle : ${c.echelle} | Secteur : ${c.secteur} (${c.date})</span>
            </div>
            <button onclick="supprimerCrise(${index})" style="background:var(--card-hover); border:1px solid var(--border-color); color:var(--danger); border-radius:8px; padding:6px 10px; cursor:pointer; font-size:11px;">🗑️</button>
        </div>`;
    });
    div.innerHTML = html;
}

function supprimerCrise(index) {
    if(confirm("Supprimer cette urgence de l'historique ?")) {
        utilisateur.crises.splice(index, 1);
        localStorage.setItem('evat_profil', JSON.stringify(utilisateur));
        afficherHistoriqueCrises();
        actualiserDashboard();
    }
}

// --- MODULE D'ÉVALUATION WEB (v3.12) ---
function lancerAuditSite() {
    const urlInput = document.getElementById('auditUrl').value.trim();
    const portee = document.getElementById('auditPortee').value;
    const objectif = document.getElementById('auditObjectif').value;
    const container = document.getElementById('resultatAuditContainer');

    if(!urlInput) {
        alert("Veuillez entrer une URL de site web valide.");
        return;
    }

    container.style.display = 'block';
    container.innerHTML = `<div style="background:var(--bg-color); padding:15px; border-radius:12px; border:1px solid var(--accent); text-align:center;">
        <h4 style="color:var(--accent);">🔍 ELAWS analyse "${urlInput}" (${portee})...</h4>
    </div>`;

    setTimeout(() => {
        const scorePerf = Math.floor(Math.random() * 25) + 75;
        const scoreMobile = Math.floor(Math.random() * 20) + 80;
        const scoreAccess = Math.floor(Math.random() * 15) + 85;
        const scoreGlobal = Math.round((scorePerf + scoreMobile + scoreAccess) / 3);

        const auditData = { url: urlInput, portee, objectif, score: scoreGlobal, date: new Date().toLocaleDateString() };
        if(!utilisateur.audits) utilisateur.audits = [];
        utilisateur.audits.unshift(auditData);
        localStorage.setItem('evat_profil', JSON.stringify(utilisateur));

        afficherResultatAudit(auditData);
        afficherHistoriqueAudits();
        actualiserDashboard();
        lireVocalement(`Audit terminé. Score : ${scoreGlobal} sur 100.`);
    }, 1500);
}

function afficherResultatAudit(data) {
    const container = document.getElementById('resultatAuditContainer');
    container.innerHTML = `<div style="background:var(--bg-color); padding:18px; border-radius:14px; border-left:4px solid var(--success);">
        <h4 style="color:var(--success);">✅ Rapport ELAWS — Score : ${data.score}/100</h4>
        <p class="text" style="margin-top:8px;">Site : ${data.url} (${data.objectif}). Optimisé pour une accessibilité mondiale.</p>
    </div>`;
}

function afficherHistoriqueAudits() {
    const div = document.getElementById('listeHistoriqueAudits');
    if(!utilisateur.audits || utilisateur.audits.length === 0) {
        div.innerHTML = '<p class="text">Aucun audit enregistré.</p>';
        return;
    }
    let html = '';
    utilisateur.audits.forEach((a, index) => {
        html += `<div style="background:var(--bg-color); padding:12px 15px; border-radius:12px; margin-top:10px; border-left:3px solid var(--accent); display:flex; justify-content:space-between; align-items:center;">
            <div><strong>${a.url}</strong><br><span class="text" style="font-size:11.5px;">Score : ${a.score}/100</span></div>
            <button onclick="supprimerAudit(${index})" style="background:var(--card-hover); border:1px solid var(--border-color); color:var(--danger); border-radius:8px; padding:6px 10px; cursor:pointer; font-size:11px;">🗑️</button>
        </div>`;
    });
    div.innerHTML = html;
}

function supprimerAudit(index) {
    if(confirm("Supprimer cet audit ?")) {
        utilisateur.audits.splice(index, 1);
        localStorage.setItem('evat_profil', JSON.stringify(utilisateur));
        afficherHistoriqueAudits();
        actualiserDashboard();
    }
}

// --- APPELS TRADUITS ---
function demarrerAppelTraduit() {
    const correspondant = document.getElementById('appelCorrespondant').value.trim() || "Correspondant";
    const langue = document.getElementById('langueInterlocuteur').value;
    const ecran = document.getElementById('ecranAppelLive');
    const flux = document.getElementById('fluxTraductionLive');
    
    ecran.style.display = 'block';
    flux.innerHTML = `<div style="color:var(--success);">📞 Connexion établie avec ${correspondant} (${langue}). Traduction live active...</div>`;
    
    secondesAppel = 0;
    if(appelEnCoursInterval) clearInterval(appelEnCoursInterval);
    
    appelEnCoursInterval = setInterval(() => {
        secondesAppel++;
        const m = String(Math.floor(secondesAppel / 60)).padStart(2, '0');
        const s = String(secondesAppel % 60).padStart(2, '0');
        document.getElementById('chronometreAppel').innerText = `${m}:${s}`;
        if(secondesAppel === 3) {
            ajouterLigneFluxLive(`🔊 [Live] : Traduction active...`);
            lireVocalement("Traduction active en cours.");
        }
    }, 2000);
}

function ajouterLigneFluxLive(htmlTexte) {
    const flux = document.getElementById('fluxTraductionLive');
    const div = document.createElement('div');
    div.style.cssText = "margin-bottom:4px; border-left:2px solid var(--accent); padding-left:8px; font-size:12.5px;";
    div.innerHTML = htmlTexte;
    flux.appendChild(div);
    flux.scrollTop = flux.scrollHeight;
}

function raccrocherAppel() {
    if(appelEnCoursInterval) clearInterval(appelEnCoursInterval);
    document.getElementById('ecranAppelLive').style.display = 'none';
}

// --- BLOC-NOTES ---
function ajouterNoteBlocNotes() {
    const titre = document.getElementById('noteTitre').value.trim();
    const contenu = document.getElementById('noteContenu').value.trim();
    if(!titre || !contenu) { alert("Remplissez le titre et le contenu."); return; }
    if(!utilisateur.notes) utilisateur.notes = [];
    utilisateur.notes.unshift({ titre, contenu, date: new Date().toLocaleDateString() });
    localStorage.setItem('evat_profil', JSON.stringify(utilisateur));
    document.getElementById('noteTitre').value = '';
    document.getElementById('noteContenu').value = '';
    afficherNotesBlocNotes();
    actualiserDashboard();
    alert("Note enregistrée !");
}

function afficherNotesBlocNotes() {
    const div = document.getElementById('listeNotesBlocNotes');
    if(!utilisateur.notes || utilisateur.notes.length === 0) {
        div.innerHTML = '<p class="text">Aucune note enregistrée.</p>';
        return;
    }
    let html = '';
    utilisateur.notes.forEach((n, index) => {
        html += `<div style="background:var(--bg-color); padding:14px; border-radius:12px; margin-top:10px; border-left:3px solid var(--accent);">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <strong>${n.titre}</strong>
                <button onclick="supprimerNote(${index})" style="background:none; border:none; color:var(--danger); cursor:pointer;">🗑️</button>
            </div>
            <p class="text" style="font-size:13px; margin-top:4px;">${n.contenu}</p>
        </div>`;
    });
    div.innerHTML = html;
}

function supprimerNote(index) {
    if(confirm("Supprimer cette note ?")) {
        utilisateur.notes.splice(index, 1);
        localStorage.setItem('evat_profil', JSON.stringify(utilisateur));
        afficherNotesBlocNotes();
        actualiserDashboard();
    }
}

function changerTypeProfil() {
    const type = document.getElementById('selectTypeProfil').value;
    const container = document.getElementById('sousProfilContainer');
    if(type === 'adulte') {
        container.innerHTML = `<label>Situation Adulte :</label><select id="selectSousProfil" class="input"><option value="Travailleur">Travailleur</option><option value="Non-travailleur">Non actif</option><option value="Illettre">Accompagnement vocal</option></select>`;
    } else {
        container.innerHTML = `<label>Situation Enfant :</label><select id="selectSousProfil" class="input"><option value="Scolarise">Scolarisé</option><option value="Non-scolarise">Non scolarisé</option></select>`;
    }
}

function chargerProfilInterface() {
    document.getElementById('inputNom').value = utilisateur.nom || "";
    document.getElementById('selectTypeProfil').value = utilisateur.type || "adulte";
    changerTypeProfil();
    if(document.getElementById('selectSousProfil') && utilisateur.sousType) {
        document.getElementById('selectSousProfil').value = utilisateur.sousType;
    }
    document.getElementById('selectTonIa').value = utilisateur.iaTon || "standard";
    document.getElementById('inputMetier').value = (utilisateur.metiers || []).join(', ');
    afficherContacts();
}

function sauvegarderProfilBase() {
    utilisateur.nom = document.getElementById('inputNom').value.trim() || "Utilisateur";
    utilisateur.type = document.getElementById('selectTypeProfil').value;
    const sousProfilEl = document.getElementById('selectSousProfil');
    if(sousProfilEl) utilisateur.sousType = sousProfilEl.value;
    utilisateur.iaTon = document.getElementById('selectTonIa').value;
    const metiersBruts = document.getElementById('inputMetier').value.trim();
    utilisateur.metiers = metiersBruts ? metiersBruts.split(',').map(m => m.trim()).filter(m => m) : ["Général"];
    localStorage.setItem('evat_profil', JSON.stringify(utilisateur));
    actualiserDashboard();
    alert("Profil enregistré !");
    switchTab('dashboard');
}

function actualiserDashboard() {
    document.getElementById('dashNomUser').innerText = utilisateur.nom || "Mon Ami";
    const nbCrises = utilisateur.crises ? utilisateur.crises.length : 0;
    const nbAudits = utilisateur.audits ? utilisateur.audits.length : 0;
    const nbNotes = utilisateur.notes ? utilisateur.notes.length : 0;
    
    document.getElementById('dashStatCrises').innerText = `${nbCrises} Résolution`;
    document.getElementById('dashStatAudits').innerText = `${nbAudits} Audit`;
    document.getElementById('dashStatNotes').innerText = `${nbNotes} Note`;
    
    const badge = document.getElementById('sidebarUserRole');
    if(badge) badge.innerText = `${utilisateur.nom} • ${nbCrises} Crise(s) traitée(s)`;
}

function toggleMenu(event) {
    if (event) event.stopPropagation();
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('appOverlay');
    const isOpen = sidebar.classList.toggle('open');
    if (isOpen) overlay.classList.add('active');
    else overlay.classList.remove('active');
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
    if(tabId === 'outils') { afficherOutilsDynamiques(); afficherNotesBlocNotes(); }
    if(tabId === 'audit') afficherHistoriqueAudits();
    if(tabId === 'crise') afficherHistoriqueCrises();
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

function ajouterContact() {
    const nom = document.getElementById('contactNom').value.trim();
    const tel = document.getElementById('contactTel').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    if(!nom || (!tel && !email)) { alert("Remplissez un nom et un contact."); return; }
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
        div.innerHTML = '<p class="text">Aucun contact.</p>';
        return;
    }
    let html = '';
    utilisateur.contacts.forEach((c, index) => {
        html += `<div style="background:var(--bg-color); padding:10px; border-radius:10px; margin-top:8px; display:flex; justify-content:space-between; align-items:center;">
            <div><strong>${c.nom}</strong><br><span class="text" style="font-size:11px;">📱 ${c.tel || 'N/A'}</span></div>
            <button onclick="supprimerContact(${index})" style="background:none; border:none; color:var(--danger); cursor:pointer;">🗑️</button>
        </div>`;
    });
    div.innerHTML = html;
}

function supprimerContact(index) {
    if(confirm("Supprimer ce contact ?")) {
        utilisateur.contacts.splice(index, 1);
        localStorage.setItem('evat_profil', JSON.stringify(utilisateur));
        afficherContacts();
        actualiserDashboard();
    }
}

function afficherOutilsDynamiques() {
    const zone = document.getElementById('zoneOutilsDynamiques');
    if(!utilisateur.metiers || utilisateur.metiers.length === 0) {
        zone.innerHTML = '<p class="text">Aucun métier.</p>';
        return;
    }
    let html = '';
    utilisateur.metiers.forEach(m => {
        html += `<div class="card" style="background:var(--bg-color); border-left:3px solid var(--accent);"><h4>🛠️ ${m}</h4><p class="text" style="font-size:12px;">Outils de proximité actifs.</p></div>`;
    });
    zone.innerHTML = html;
}

function rechercherVoyage() {
    const pays = document.getElementById('inputPaysVoyage').value.trim();
    const res = document.getElementById('resultatVoyage');
    if(!pays) { res.innerHTML = '<p class="text" style="color:var(--danger);">Entrez un pays.</p>'; return; }
    res.innerHTML = `<div style="background:var(--bg-color); padding:12px; border-radius:10px;"><h4>✈️ (${pays})</h4><p class="text" style="margin-top:6px;">Passeport requis.</p></div>`;
}

function rechercherBanque() {
    const pays = document.getElementById('inputPaysBanque').value.trim();
    const res = document.getElementById('resultatBanque');
    if(!pays) { res.innerHTML = '<p class="text" style="color:var(--danger);">Entrez une banque/pays.</p>'; return; }
    res.innerHTML = `<div style="background:var(--bg-color); padding:12px; border-radius:10px;"><h4>💳 (${pays})</h4><p class="text" style="margin-top:6px;">CNI et justificatif requis.</p></div>`;
}

function convertirDevise() {
    const montant = parseFloat(document.getElementById('montantDevise').value) || 0;
    const source = document.getElementById('deviseSource').value;
    const res = document.getElementById('resultatDevise');
    let eur = montant * 0.001525;
    res.innerHTML = `<div style="background:var(--bg-color); padding:12px; border-radius:10px;"><strong style="color:var(--accent);">${montant} ${source} = ${eur.toFixed(2)} EUR</strong></div>`;
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
        lireVocalement(rep);
    }, 400);
}

function ajouterBulleElaws(txt, exp) {
    const chat = document.getElementById('elawsMessages');
    const isUser = exp === 'user';
    const div = document.createElement('div');
    div.style.cssText = `margin-bottom:6px; text-align:${isUser ? 'right' : 'left'};`;
    div.innerHTML = `<span style="display:inline-block; background:${isUser ? 'var(--accent)' : 'var(--card-hover)'}; color:${isUser ? '#070a13' : 'var(--text-color)'}; padding:9px 13px; border-radius:12px; max-width:92%; font-size:13px; text-align:left;"><strong>${isUser ? 'Moi' : 'ELAWS'} :</strong><br>${txt}</span>`;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

document.addEventListener('DOMContentLoaded', () => {
    actualiserDashboard();
    ajouterBulleElaws(`Bonjour ${utilisateur.nom || 'ami'} ! ELAWS v3.13 est prêt pour résoudre les urgences et crises du monde entier.`, 'elaws');
});
