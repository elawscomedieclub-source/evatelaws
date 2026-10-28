
let utilisateur = JSON.parse(localStorage.getItem('evat_profil')) || {
    nom: "Kodjo Marceline",
    type: "adulte",
    sousType: "Travailleur",
    metiers: ["Entrepreneur", "Développeur Web"],
    contacts: [
        { nom: "Service Client ELAWS", tel: "+22898231402", email: "support@evat-elaws.net" }
    ],
    habitudes: {
        localisationActuelle: "Lomé, Togo"
    }
};

let ecouteVocaleActive = false;
let appelEnCoursInterval = null;
let secondesAppel = 0;

// --- MODULE DE TRADUCTION TEMPS RÉEL EN COURS D'APPEL ---
function demarrerAppelTraduit() {
    const correspondant = document.getElementById('appelCorrespondant').value.trim() || "Correspondant";
    const langue = document.getElementById('langueInterlocuteur').value;
    const ecran = document.getElementById('ecranAppelLive');
    const flux = document.getElementById('fluxTraductionLive');
    
    ecran.style.display = 'block';
    flux.innerHTML = `<div style="color:var(--success);">📞 Connexion établie avec ${correspondant} (Langue : ${langue})...</div>`;
    
    secondesAppel = 0;
    if(appelEnCoursInterval) clearInterval(appelEnCoursInterval);
    
    appelEnCoursInterval = setInterval(() => {
        secondesAppel++;
        const m = String(Math.floor(secondesAppel / 60)).padStart(2, '0');
        const s = String(secondesAppel % 60).padStart(2, '0');
        document.getElementById('chronometreAppel').innerText = `${m}:${s}`;
        
        // Simulation d'interventions en direct d'ELAWS traduisant le dialecte en temps réel
        if(secondesAppel === 3) {
            ajouterLigneFluxLive(`🔊 [Interlocuteur (${langue})] : "Mia ɖo ɣeyiɣi nyui aɖe" -> 🇫🇷 <em>Traduction ELAWS : "Nous avons passé un très bon moment."</em>`);
        } else if(secondesAppel === 7) {
            ajouterLigneFluxLive(`💡 <strong>Résumé vocal ELAWS :</strong> L'interlocuteur exprime sa satisfaction et confirme l'entente.`);
        } else if(secondesAppel === 12) {
            ajouterLigneFluxLive(`🔊 [Interlocuteur (${langue})] : "Wò ŋɔŋlɔwo dzea ŋunye" -> 🇫🇷 <em>Traduction ELAWS : "Vos propositions me conviennent."</em>`);
        }
    }, 1500);
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
    flux.innerHTML += `<div style="color:var(--danger); margin-top:8px;">⏹️ Appel terminé. Résumé des échanges enregistré par ELAWS.</div>`;
    setTimeout(() => {
        document.getElementById('ecranAppelLive').style.display = 'none';
    }, 4000);
}

// --- CAPTEURS ET PROACTIVITE ---
function initCapteursEtProactivite() {
    const heure = new Date().getHours();
    let momentJournee = "journée";
    if (heure >= 5 && heure < 12) momentJournee = "matinée";
    else if (heure >= 12 && heure < 18) momentJournee = "après-midi";
    else momentJournee = "soirée";

    const box = document.getElementById('proactiveSuggestionBox');
    const textEl = document.getElementById('proactiveText');
    if(box && textEl) {
        textEl.innerText = `En cette ${momentJournee}, ELAWS est configuré pour traduire en direct tes appels téléphoniques et dialectes en temps réel.`;
        box.style.display = 'block';
    }
}

// --- GESTION DES MENUS ET ONGLETS ---
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

function toggleMicrophone() {
    const btn = document.getElementById('microBtn');
    const status = document.getElementById('voiceStatus');
    ecouteVocaleActive = !ecouteVocaleActive;
    
    if(ecouteVocaleActive) {
        btn.classList.add('active');
        status.style.display = 'block';
        setTimeout(() => {
            if(ecouteVocaleActive) {
                document.getElementById('elawsInput').value = "ELAWS, active la traduction live pour mon prochain appel";
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
    alert("Profil et métiers enregistrés avec succès !");
    switchTab('dashboard');
}

function actualiserDashboard() {
    document.getElementById('dashNomUser').innerText = utilisateur.nom || "Mon Ami";
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
        alert("Veuillez renseigner un nom et au moins un moyen de contact.");
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
    initCapteursEtProactivite();
    ajouterBulleElaws(`Bonjour ${utilisateur.nom || 'ami'} ! Je suis ELAWS. Je gère tes appels et ta traduction live en temps réel.`, 'elaws');
});
