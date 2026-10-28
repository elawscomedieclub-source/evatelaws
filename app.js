
let utilisateur = JSON.parse(localStorage.getItem('evat_profil')) || {
    nom: "Kodjo Marceline",
    type: "adulte",
    sousType: "Travailleur",
    metiers: ["Entrepreneur", "Développeur Web"],
    contacts: [
        { nom: "Service Client ELAWS", tel: "+22898231402", email: "support@evat-elaws.net" }
    ],
    iaTon: "standard"
};

let ecouteVocaleActive = false;
let appelEnCoursInterval = null;
let secondesAppel = 0;

// --- SYNTHESE VOCALE (TEXT-TO-SPEECH) ---
function lireVocalement(texte) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(texte);
        utterance.lang = 'fr-FR';
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
    }
}

// --- COMMANDES VOCALES & INTERACTIONS ELAWS ---
function toggleMicrophone() {
    const btn = document.getElementById('microBtn');
    const status = document.getElementById('voiceStatus');
    ecouteVocaleActive = !ecouteVocaleActive;
    
    if(ecouteVocaleActive) {
        btn.classList.add('active');
        status.style.display = 'block';
        setTimeout(() => {
            if(ecouteVocaleActive) {
                const commandeSimulee = "convertis 25000 FCFA";
                document.getElementById('elawsInput').value = commandeSimulee;
                toggleMicrophone();
                envoyerMessageElaws();
            }
        }, 3000);
    } else {
        btn.classList.remove('active');
        status.style.display = 'none';
    }
}

// --- TRADUCTION LIVE EN COURS D'APPEL ---
function demarrerAppelTraduit() {
    const correspondant = document.getElementById('appelCorrespondant').value.trim() || "Correspondant";
    const langue = document.getElementById('langueInterlocuteur').value;
    const ecran = document.getElementById('ecranAppelLive');
    const flux = document.getElementById('fluxTraductionLive');
    
    ecran.style.display = 'block';
    flux.innerHTML = `<div style="color:var(--success);">📞 Connexion établie avec ${correspondant} (${langue}). Traduction live ELAWS active...</div>`;
    
    secondesAppel = 0;
    if(appelEnCoursInterval) clearInterval(appelEnCoursInterval);
    
    appelEnCoursInterval = setInterval(() => {
        secondesAppel++;
        const m = String(Math.floor(secondesAppel / 60)).padStart(2, '0');
        const s = String(secondesAppel % 60).padStart(2, '0');
        document.getElementById('chronometreAppel').innerText = `${m}:${s}`;
        
        if(secondesAppel === 3) {
            const txt = "Mia ɖo ɣeyiɣi nyui aɖe -> Traduction : Nous avons passé un très bon moment.";
            ajouterLigneFluxLive(`🔊 [Live] : ${txt}`);
            lireVocalement("Nous avons passé un très bon moment.");
        } else if(secondesAppel === 8) {
            const resume = "Résumé vocal ELAWS : Accord confirmé sur les conditions.";
            ajouterLigneFluxLive(`💡 <strong>${resume}</strong>`);
            lireVocalement(resume);
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
    const flux = document.getElementById('fluxTraductionLive');
    flux.innerHTML += `<div style="color:var(--danger); margin-top:8px;">⏹️ Appel terminé. ELAWS a enregistré le journal de traduction.</div>`;
    setTimeout(() => {
        document.getElementById('ecranAppelLive').style.display = 'none';
    }, 4000);
}

// --- GESTION DU PROFIL & TON IA ---
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
    alert("Profil et préférences IA enregistrés avec succès !");
    switchTab('dashboard');
}

function actualiserDashboard() {
    document.getElementById('dashNomUser').innerText = utilisateur.nom || "Mon Ami";
    const nbMetiers = utilisateur.metiers ? utilisateur.metiers.length : 0;
    document.getElementById('dashStatMetiers').innerText = `${nbMetiers} Métier${nbMetiers > 1 ? 's' : ''}`;
    const nbContacts = utilisateur.contacts ? utilisateur.contacts.length : 0;
    document.getElementById('dashStatContacts').innerText = `${nbContacts} Contact${nbContacts > 1 ? 's' : ''}`;
    
    const tonLabels = { standard: "Standard pro", pedagogique: "Pédagogique & Simple", vocal_inclusif: "Vocal & Accompagné" };
    document.getElementById('dashStatTon').innerText = `Ton: ${tonLabels[utilisateur.iaTon] || 'Standard'}`;
    
    const badge = document.getElementById('sidebarUserRole');
    if(badge) badge.innerText = `${utilisateur.nom} • ${nbMetiers} Métier(s)`;
}

// --- NAVIGATION & DIVERS ---
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

function ajouterContact() {
    const nom = document.getElementById('contactNom').value.trim();
    const tel = document.getElementById('contactTel').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    
    if(!nom || (!tel && !email)) {
        alert("Veuillez renseigner un nom et un moyen de contact.");
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
        div.innerHTML = '<p class="text">Aucun contact enregistré.</p>';
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
                <button onclick="supprimerContact(${index})" style="background:var(--card-hover); border:1px solid var(--border-color); color:var(--danger); border-radius:6px; padding:6px 8px; cursor:pointer; font-size:11px;" title="Supprimer">🗑️</button>
            </div>
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
        zone.innerHTML = '<p class="text">Aucun corps de métier enregistré.</p>';
        return;
    }
    let html = '';
    utilisateur.metiers.forEach(metier => {
        html += `<div class="card" style="border-left: 4px solid var(--accent); margin-bottom:15px; background:var(--bg-color);">
            <h3 style="color:var(--accent); margin-bottom:6px;">🛠️ Outils Actifs : ${metier}</h3>
            <p class="text" style="font-size:13px;">Espace de travail optimisé pour ${metier}.</p>
        </div>`;
    });
    zone.innerHTML = html;
}

function rechercherVoyage() {
    const pays = document.getElementById('inputPaysVoyage').value.trim();
    const res = document.getElementById('resultatVoyage');
    if(!pays) { res.innerHTML = '<p class="text" style="color:var(--danger);">Entrez un pays.</p>'; return; }
    res.innerHTML = `<div style="background:var(--bg-color); padding:15px; border-radius:8px;"><h4>✈️ Formalités (${pays})</h4><p class="text" style="margin-top:8px;">Passeport valide 6 mois minimum.</p></div>`;
}

function rechercherBanque() {
    const pays = document.getElementById('inputPaysBanque').value.trim();
    const res = document.getElementById('resultatBanque');
    if(!pays) { res.innerHTML = '<p class="text" style="color:var(--danger);">Entrez un pays.</p>'; return; }
    res.innerHTML = `<div style="background:var(--bg-color); padding:15px; border-radius:8px;"><h4>💳 Banque (${pays})</h4><p class="text" style="margin-top:8px;">CNI, Justificatif de domicile, Dépôt.</p></div>`;
}

function convertirDevise() {
    const montant = parseFloat(document.getElementById('montantDevise').value) || 0;
    const source = document.getElementById('deviseSource').value;
    const res = document.getElementById('resultatDevise');
    let eur = montant * 0.001525;
    res.innerHTML = `<div style="background:var(--bg-color); padding:15px; border-radius:8px;"><h4>💱 Résultat</h4><p class="text" style="margin-top:8px; font-weight:bold; color:var(--accent);">${montant} ${source} = ${eur.toFixed(2)} EUR</p></div>`;
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
    div.innerHTML = `<span style="display:inline-block; background:${isUser ? 'var(--accent)' : 'var(--card-hover)'}; color:${isUser ? '#0b0f19' : 'var(--text-color)'}; padding:8px 12px; border-radius:10px; max-width:92%; font-size:13px; text-align:left;"><strong>${isUser ? 'Moi' : 'ELAWS'} :</strong><br>${txt}</span>`;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

document.addEventListener('DOMContentLoaded', () => {
    actualiserDashboard();
    ajouterBulleElaws(`Bonjour ${utilisateur.nom || 'ami'} ! Je suis ELAWS v3.8. Je m'adapte à ton profil (${utilisateur.iaTon}) et peux te lire mes réponses vocalement.`, 'elaws');
});
