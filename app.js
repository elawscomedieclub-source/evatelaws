
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
}

let activeTab = 'accueil';
let currentThemeIndex = 0;
const themes = ['dark', 'light', 'eco'];

function jouerSonSucces() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
    } catch(e) {}
}

function changerTheme() {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    document.body.setAttribute('data-theme', themes[currentThemeIndex]);
    showToast(`Thème : ${themes[currentThemeIndex].toUpperCase()}`);
}

let listeProfils = JSON.parse(localStorage.getItem('evat_tous_profils')) || [];
let idProfilActif = localStorage.getItem('evat_profil_actif_id') || null;
let utilisateurActif = null;

function chargerDonneesProfil() {
    if (idProfilActif) {
        utilisateurActif = listeProfils.find(p => p.id == idProfilActif) || null;
    }
    if (!utilisateurActif && listeProfils.length > 0) {
        utilisateurActif = listeProfils[0];
        idProfilActif = utilisateurActif.id;
        localStorage.setItem('evat_profil_actif_id', idProfilActif);
    }
}
chargerDonneesProfil();

function showToast(m) {
    const t = document.getElementById('toastNotification');
    document.getElementById('toastText').innerHTML = m;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
}

function toggleMenu() { document.getElementById('sideMenu').classList.toggle('open'); }

function creerNouveauProfil() {
    const nom = document.getElementById('regNom').value.trim();
    const contact = document.getElementById('regContact').value.trim();
    const selectMetier = document.getElementById('selectMetierBase').value;
    const metierCustom = document.getElementById('regMetierCustom').value.trim();
    const metierUnique = metierCustom || selectMetier;
    const niveauEtude = document.getElementById('regNiveauEtude')?.value || '';

    if (!nom) { showToast("Veuillez renseigner votre nom."); return; }

    const nouveauId = 'prof_' + Date.now();
    const nouveauProfil = {
        id: nouveauId,
        nom: nom,
        contact: contact || "Non renseigné",
        metierUnique: metierUnique,
        niveauEtude: niveauEtude,
        solde: 50000,
        journalCaisse: [
            { id: 1, type: 'entree', libelle: 'Capital initial', montant: 50000, date: new Date().toLocaleDateString() }
        ],
        mesuresCouture: [],
        consultationsMedicales: [],
        stocksBoutique: [],
        notesPastorales: [],
        ateliersMecanique: [],
        devoirsEleve: [],
        dossiersVoyagePapiers: [],
        carnetContacts: [],
        discussionsElaws: [
            { role: 'ai', texte: `Salut ${nom} ! C'est ELAWS. Je suis ton ami et ton assistant personnel (v28.0). Que tu sois professionnel ou élève (${niveauEtude || metierUnique}), on est ensemble pour réussir !` }
        ]
    };

    listeProfils.push(nouveauProfil);
    localStorage.setItem('evat_tous_profils', JSON.stringify(listeProfils));
    localStorage.setItem('evat_profil_actif_id', nouveauId);
    
    idProfilActif = nouveauId;
    utilisateurActif = nouveauProfil;

    jouerSonSucces();
    showToast(`Bienvenue, ${nom} !`);
    render();
}

function changerProfilSession() {
    idProfilActif = null; utilisateurActif = null;
    localStorage.removeItem('evat_profil_actif_id');
    render();
}

function selectionnerProfilExistant(id) {
    idProfilActif = id;
    localStorage.setItem('evat_profil_actif_id', id);
    chargerDonneesProfil();
    showToast(`Profil chargé : ${utilisateurActif.nom}`);
    render();
}

function sauvegarderProfilActif() {
    const index = listeProfils.findIndex(p => p.id == utilisateurActif.id);
    if (index !== -1) { listeProfils[index] = utilisateurActif; localStorage.setItem('evat_tous_profils', JSON.stringify(listeProfils)); }
}

function mettreAJourMonContact() {
    const nouveauNum = document.getElementById('monNumeroContact')?.value.trim();
    if(nouveauNum) {
        utilisateurActif.contact = nouveauNum;
        sauvegarderProfilActif();
        jouerSonSucces();
        showToast("Votre numéro de contact a été mis à jour !");
        render();
    } else { showToast("Veuillez saisir un numéro valide."); }
}

function ajouterRepertoireContact() {
    const nomC = document.getElementById('nomContactRepertoire')?.value.trim();
    const numC = document.getElementById('numContactRepertoire')?.value.trim();
    const emailC = document.getElementById('emailContactRepertoire')?.value.trim();
    const dialC = document.getElementById('dialecteContactRepertoire')?.value || 'Français';

    if(nomC && numC) {
        if(!utilisateurActif.carnetContacts) utilisateurActif.carnetContacts = [];
        utilisateurActif.carnetContacts.unshift({ id: Date.now(), nom: nomC, numero: numC, email: emailC, dialecte: dialC });
        sauvegarderProfilActif();
        jouerSonSucces();
        showToast("Contact ajouté au répertoire !");
        render();
    } else { showToast("Indiquez au moins le nom et le numéro."); }
}

function lancerAppelGSM(numero) {
    window.location.href = `tel:${numero}`;
    showToast(`📞 Appel GSM en cours vers ${numero}...`);
}

function lancerAppelInternetAvecTraduction(nomDest, dialecteDest) {
    jouerSonSucces();
    showToast(`🌐 Appel Internet & Traduction ELAWS vers ${nomDest} (${dialecteDest})...`);
    setTimeout(() => {
        alert(`[Appel Intelligent ELAWS v28.0] 
Connexion établie avec ${nomDest} !
🗣️ Langue source : Votre voix.
🔄 Traduction instantanée active vers : ${dialecteDest}.
L'interlocuteur vous comprend parfaitement dans son dialecte !`);
    }, 600);
}

function enregistrerDevoirEleve() {
    const matiere = document.getElementById('devoirMatiere')?.value.trim();
    const question = document.getElementById('devoirQuestion')?.value.trim();
    if(matiere && question) {
        if(!utilisateurActif.devoirsEleve) utilisateurActif.devoirsEleve = [];
        const explicationElaws = `[Explication ELAWS] Bonjour ${utilisateurActif.nom} ! Pour ta question en ${matiere} ("${question}"), voici comment comprendre la leçon : Prends le temps de relire ton cours calmement. Si c'est un exercice, décompose-le étape par étape. Tu as tout ce qu'il faut pour réussir ! 🌟`;
        utilisateurActif.devoirsEleve.unshift({ id: Date.now(), matiere, question, reponse: explicationElaws, date: new Date().toLocaleDateString() });
        sauvegarderProfilActif();
        jouerSonSucces();
        showToast("Devoir enregistré et expliqué par ELAWS !");
        render();
    } else { showToast("Remplissez la matière et la question."); }
}

function verifierDossierPapier() {
    const typeDoc = document.getElementById('typeDocAdministratif')?.value;
    const paysDestination = document.getElementById('paysDestinationVoyage')?.value.trim() || "National / International";
    const resultatDiv = document.getElementById('resultatAnalyseDossier');
    if(!resultatDiv) return;

    let pieces = [
        "Acte de naissance sécurisé",
        "Carte d'identité biométrique ou récépissé",
        "Certificat de nationalité",
        "Photos d'identité (fond blanc)",
        "Justificatif de domicile"
    ];

    let listeHtml = `<ul style="margin:10px 0; padding-left:20px; line-height:1.6;">`;
    pieces.forEach(p => { listeHtml += `<li>${p}</li>`; });
    listeHtml += `</ul>`;

    resultatDiv.innerHTML = `
        <div style="background:var(--bg-color); padding:15px; border-radius:10px; border:1px solid var(--accent); margin-top:10px;">
            <strong style="color:var(--accent);">📋 Dossier Requis (${typeDoc.toUpperCase()} — ${paysDestination}) :</strong>
            ${listeHtml}
            <p style="margin-top:10px; font-size:13px; color:var(--text-secondary);">💡 <em>Conseil ELAWS :</em> Vérifiez que tous vos documents portent exactement le même nom.</p>
        </div>
    `;
    jouerSonSucces();
}

function envoyerMessageElawsAI(texteForce) {
    const input = document.getElementById('inputElawsChat');
    const q = texteForce || (input ? input.value.trim() : '');
    if (!q) return;

    if (!utilisateurActif.discussionsElaws) utilisateurActif.discussionsElaws = [];
    utilisateurActif.discussionsElaws.push({ role: 'user', texte: q });

    const reponseElaws = ELAWS_BRAIN.repondre(utilisateurActif, q);

    utilisateurActif.discussionsElaws.push({ role: 'ai', texte: reponseElaws });
    sauvegarderProfilActif();
    jouerSonSucces();
    
    if(input) input.value = '';
    render();

    if('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(reponseElaws));
    }
}

function demarrerMicroElaws() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        showToast("Reconnaissance vocale non supportée.");
        return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    showToast("🎤 Parle à ton ami ELAWS, j'écoute...");
    recognition.onresult = (event) => {
        const texteRecu = event.results[0][0].transcript;
        const input = document.getElementById('inputElawsChat');
        if(input) input.value = texteRecu;
        envoyerMessageElawsAI(texteRecu);
    };
    recognition.onerror = () => { showToast("Erreur du micro."); };
    recognition.start();
}

function render() {
    const content = document.getElementById('mainContent');
    if(!content) return;
    content.innerHTML = '';

    if (!utilisateurActif) {
        document.getElementById('appHeader').style.display = 'none';
        document.getElementById('bottomBar').style.display = 'none';
        
        let profilsExistantsHtml = '';
        if (listeProfils.length > 0) {
            profilsExistantsHtml = `<div style="margin-bottom:20px;"><h4 style="margin-bottom:8px;">👥 Profils enregistrés :</h4><div style="display:flex; flex-direction:column; gap:8px;">`;
            listeProfils.forEach(p => {
                profilsExistantsHtml += `<button class="btn-action" style="background:var(--card-bg); border:1px solid var(--accent); color:var(--text-main); text-align:left; padding:12px;" onclick="selectionnerProfilExistant('${p.id}')">👤 <strong>${p.nom}</strong> (${p.contact}) <small style="float:right; color:var(--accent);">[${p.metierUnique} ${p.niveauEtude ? '• ' + p.niveauEtude : ''}]</small></button>`;
            });
            profilsExistantsHtml += `</div></div>`;
        }

        content.innerHTML = `
            <div class="card" style="border-color:var(--accent); max-width:500px; margin: 10px auto; text-align:center;">
                <img src="https://img.icons8.com/color/96/000000/artificial-intelligence.png" alt="Logo" style="width:72px; height:72px; margin-bottom:10px; border-radius:16px; border:2px solid var(--accent);">
                <h2 style="color:var(--accent); margin-top:0;">✨ E.V.A.T. & ELAWS</h2>
                <p class="text" style="text-align:center;">Écosystème Universel & Scolaire (v28.0)</p>
                
                ${profilsExistantsHtml}

                <div style="text-align:left;">
                    <h4 style="margin-bottom:10px; border-top:1px solid var(--border-color); padding-top:15px;">📝 Créer mon Profil & Rôle :</h4>
                    <input type="text" id="regNom" class="input" placeholder="Votre Nom ou Prénom *" style="margin-bottom:8px;">
                    <input type="tel" id="regContact" class="input" placeholder="Votre Numéro de Téléphone (ex: +228 98231402) *" style="margin-bottom:8px;">
                    
                    <label style="font-size:12px; color:var(--text-secondary); display:block; margin-bottom:4px;">Choisissez votre Profil / Métier :</label>
                    <select id="selectMetierBase" class="input" style="margin-bottom:8px;" onchange="document.getElementById('regMetierCustom').value = this.value; document.getElementById('blocNiveauEleve').style.display = (this.value.includes('Élève')) ? 'block' : 'none';">
                        <option value="Élève / Étudiant">🎒 Élève / Étudiant (Aide aux devoirs)</option>
                        <option value="Couturier / Tailleur">✂️ Couturier / Tailleur</option>
                        <option value="Pasteur / Guide Spirituel">📖 Pasteur / Guide Spirituel</option>
                        <option value="Médecin / Soignant">🩺 Médecin / Soignant</option>
                        <option value="Commerçant / Boutique">🛍️ Commerçant / Boutique</option>
                        <option value="Mécanicien / Artisan">🔧 Mécanicien / Artisan</option>
                    </select>

                    <div id="blocNiveauEleve" style="margin-bottom:8px;">
                        <label style="font-size:12px; color:var(--accent); display:block; margin-bottom:4px;">Niveau d'Études :</label>
                        <select id="regNiveauEtude" class="input">
                            <option value="CP / CE1 / CE2">📚 Primaire (CP - CE2)</option>
                            <option value="CM1 / CM2">📚 Primaire (CM1 - CM2)</option>
                            <option value="6ème / 5ème / 4ème">🎒 Collège (6ème - 4ème)</option>
                            <option value="3ème (Brevet)">🎒 Collège (3ème / Brevet)</option>
                            <option value="Seconde / Première / Terminale">🎓 Lycée (Seconde - Terminale)</option>
                            <option value="Université / Supérieur">🎓 Université / Supérieur</option>
                        </select>
                    </div>

                    <input type="text" id="regMetierCustom" class="input" value="Élève / Étudiant" placeholder="Ou personnalisez..." style="margin-bottom:12px;">
                    
                    <button class="btn-action" onclick="creerNouveauProfil()">🚀 Démarrer avec ELAWS (v28.0)</button>
                </div>
            </div>
        `;
        return;
    }

    document.getElementById('appHeader').style.display = 'block';
    document.getElementById('bottomBar').style.display = 'flex';
    const badge = document.getElementById('badgeDomaineActif');
    if(badge) badge.innerHTML = `💼 ${utilisateurActif.nom} (${utilisateurActif.contact}) — [${utilisateurActif.metierUnique} ${utilisateurActif.niveauEtude ? '• ' + utilisateurActif.niveauEtude : ''}]`;

    document.querySelectorAll('.bar-item').forEach(el => el.classList.remove('active'));
    if(activeTab === 'accueil') document.getElementById('barAccueil')?.classList.add('active');
    if(activeTab === 'appels_traduction') document.getElementById('barAppel')?.classList.add('active');
    if(activeTab === 'elaws_compagnon') document.getElementById('barElaws')?.classList.add('active');
    if(activeTab === 'outils_metier') document.getElementById('barOutil')?.classList.add('active');
    if(activeTab === 'voyages_papiers') document.getElementById('barVoyage')?.classList.add('active');

    if (activeTab === 'accueil') {
        content.innerHTML = `
            <div class="card" style="border-color: var(--accent);">
                <div class="badge-gamified">🌟 Cerveau ELAWS (elaws.js) Connecté</div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <div>
                        <span style="font-size:11px; color:var(--accent); font-weight:700;">👤 PROFIL ACTIF & CONTACT</span>
                        <div style="font-size:17px; font-weight:800;">${utilisateurActif.nom}</div>
                        <div style="font-size:13px; color:var(--accent);">📱 Contact : ${utilisateurActif.contact}</div>
                    </div>
                    <button class="btn-top" onclick="changerProfilSession()">🔄 Changer</button>
                </div>
                <p class="text">Rôle : <strong style="color:var(--accent);">${utilisateurActif.metierUnique} ${utilisateurActif.niveauEtude ? '(' + utilisateurActif.niveauEtude + ')' : ''}</strong>. ELAWS est ton compagnon et ton ami pour t'aider dans ton travail ou tes révisions scolaires.</p>
            </div>
        `;
    } else if (activeTab === 'appels_traduction') {
        let carnetHtml = '';
        if(utilisateurActif.carnetContacts && utilisateurActif.carnetContacts.length > 0) {
            utilisateurActif.carnetContacts.forEach(c => {
                carnetHtml += `
                    <div style="background:var(--bg-color); padding:12px; border-radius:10px; margin-bottom:10px; border-left:4px solid #0ea5e9; display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <strong>👤 ${c.nom}</strong><br>
                            <small style="color:var(--accent);">📱 ${c.numero}</small><br>
                            <small style="color:#f59e0b;">🗣️ Langue / Dialecte : ${c.dialecte || 'Français'}</small>
                        </div>
                        <div style="display:flex; gap:6px;">
                            <button class="btn-action" style="background:#059669; padding:8px 10px; font-size:11px; width:auto;" onclick="lancerAppelGSM('${c.numero}')">📞 GSM</button>
                            <button class="btn-action" style="background:#0ea5e9; padding:8px 10px; font-size:11px; width:auto;" onclick="lancerAppelInternetAvecTraduction('${c.nom}', '${c.dialecte || 'Français'}')">🌐 Traduire & Appeler</button>
                        </div>
                    </div>
                `;
            });
        } else { carnetHtml = '<p style="color:var(--text-secondary);">Aucun contact dans le répertoire.</p>'; }

        content.innerHTML = `
            <div class="card" style="border-color:#0ea5e9;">
                <h3 class="card-title" style="color:#0ea5e9;">📞 Appels & Traduction de Dialecte</h3>
                <p class="text">Communiquez sans barrière en Éoué, Kabyè, Yoruba ou Haoussa.</p>
                <div style="background:var(--bg-color); padding:15px; border-radius:10px; margin-bottom:15px; border:1px solid var(--border-color);">
                    <label style="font-size:12px; color:var(--text-secondary); display:block; margin-bottom:4px;">Mon Numéro de Contact :</label>
                    <div style="display:flex; gap:8px; margin-bottom:10px;">
                        <input type="tel" id="monNumeroContact" class="input" value="${utilisateurActif.contact}" placeholder="Votre numéro..." style="margin-bottom:0;">
                        <button class="btn-action" style="background:#059669; width:auto; padding:0 15px;" onclick="mettreAJourMonContact()">Mettre à jour</button>
                    </div>
                </div>
                <h4 style="margin-top:15px; margin-bottom:8px;">➕ Ajouter un Contact :</h4>
                <div style="background:var(--bg-color); padding:15px; border-radius:10px; margin-bottom:15px; border:1px solid var(--border-color);">
                    <input type="text" id="nomContactRepertoire" class="input" placeholder="Nom du contact *" style="margin-bottom:8px;">
                    <input type="tel" id="numContactRepertoire" class="input" placeholder="Numéro de téléphone *" style="margin-bottom:8px;">
                    <select id="dialecteContactRepertoire" class="input" style="margin-bottom:10px;">
                        <option value="Français">🇫🇷 Français</option>
                        <option value="Éoué / Mina">🇹🇬 Éoué / Mina</option>
                        <option value="Kabyè">🇹🇬 Kabyè</option>
                        <option value="Yoruba">🇳🇬 Yoruba</option>
                        <option value="Haoussa">🌍 Haoussa</option>
                    </select>
                    <button class="btn-action" style="background:#0ea5e9;" onclick="ajouterRepertoireContact()">💾 Enregistrer</button>
                </div>
                ${carnetHtml}
            </div>
        `;
    } else if (activeTab === 'elaws_compagnon') {
        let chatHtml = '';
        if (utilisateurActif.discussionsElaws) {
            utilisateurActif.discussionsElaws.forEach(msg => {
                const isAi = msg.role === 'ai';
                chatHtml += `
                    <div style="background:${isAi ? 'rgba(5,150,105,0.15)' : 'var(--bg-color)'}; border-left:4px solid ${isAi ? 'var(--accent)' : 'var(--border-color)'}; padding:14px; border-radius:10px; margin-bottom:12px; position:relative;">
                        <strong style="font-size:12px; color:${isAi ? 'var(--accent)' : 'var(--text-secondary)'};">${isAi ? '🤖 ELAWS (Ton Ami & Pédagogue)' : utilisateurActif.nom}</strong>
                        <p style="margin:8px 0 0 0; font-size:14px; white-space: pre-line;">${msg.texte}</p>
                    </div>
                `;
            });
        }
        content.innerHTML = `
            <div class="card" style="border-color:var(--accent);">
                <h3 class="card-title" style="color:var(--accent);">🤖 ELAWS v28.0 — Ton Ami Bienveillant</h3>
                <p class="text">Discute avec ELAWS pour tes révisions, tes projets ou pour trouver du soutien :</p>
                <div style="text-align:center; margin-bottom:15px;">
                    <button class="btn-action" onclick="demarrerMicroElaws()" style="background:linear-gradient(135deg, #ec4899 0%, #db2777 100%); font-size:16px; padding:14px; border-radius:30px;">
                        🎤 Parler à ELAWS (Micro)
                    </button>
                </div>
                <div style="background:var(--bg-color); padding:15px; border-radius:12px; max-height:350px; overflow-y:auto; margin-bottom:15px; border:1px solid var(--border-color);">
                    ${chatHtml}
                </div>
                <div style="display:flex; gap:8px;">
                    <input type="text" id="inputElawsChat" class="input" placeholder="Parle à ton ami ELAWS..." style="margin-bottom:0;" onkeypress="if(event.key === 'Enter') envoyerMessageElawsAI()">
                    <button class="btn-action" style="width:auto; padding:0 22px;" onclick="envoyerMessageElawsAI()">Envoyer 🚀</button>
                </div>
            </div>
        `;
    } else if (activeTab === 'outils_metier') {
        const isEleve = utilisateurActif.metierUnique.toLowerCase().includes('élève') || utilisateurActif.metierUnique.toLowerCase().includes('étudiant');
        
        if (isEleve) {
            let devoirsHtml = '';
            if (utilisateurActif.devoirsEleve && utilisateurActif.devoirsEleve.length > 0) {
                utilisateurActif.devoirsEleve.forEach(d => {
                    devoirsHtml += `<div style="background:var(--bg-color); padding:12px; border-radius:8px; margin-bottom:10px; border-left:4px solid #34d399;"><strong>🎒 Matière : ${d.matiere}</strong> (${d.date})<br>❓ <em>Question :</em> ${d.question}<br><p style="margin:8px 0 0 0; color:var(--accent); white-space:pre-line;">${d.reponse}</p></div>`;
                });
            } else { devoirsHtml = '<p style="color:var(--text-secondary);">Aucune question de cours enregistrée pour l’instant.</p>'; }

            content.innerHTML = `
                <div class="card" style="border-color:#34d399;">
                    <h3 class="card-title" style="color:#34d399;">🎒 Espace Élève & Aide aux Devoirs (Niveau : ${utilisateurActif.niveauEtude || 'Général'})</h3>
                    <p class="text">Pose une question sur ton cours ou ton exercice. ELAWS t'expliquera la leçon avec des mots simples pour t'aider à réussir !</p>
                    <div style="background:var(--bg-color); padding:15px; border-radius:10px; margin-bottom:15px; border:1px solid var(--border-color);">
                        <input type="text" id="devoirMatiere" class="input" placeholder="Matière (ex: Mathématiques, Français, Histoire) *" style="margin-bottom:8px;">
                        <textarea id="devoirQuestion" class="input" rows="3" placeholder="Écris ta question ou l'énoncé de ton exercice ici..." style="resize:none; margin-bottom:10px;"></textarea>
                        <button class="btn-action" onclick="enregistrerDevoirEleve()">💡 Demander l'explication à ELAWS</button>
                    </div>
                    <h4 style="margin-bottom:8px;">📚 Mes Leçons & Explications ELAWS :</h4>
                    ${devoirsHtml}
                </div>
            `;
        } else {
            content.innerHTML = `
                <div class="card" style="border-color:#f59e0b;">
                    <h3 class="card-title" style="color:#f59e0b;">🛠️ Espace Professionnel — ${utilisateurActif.metierUnique}</h3>
                    <p class="text">Votre profil est actif. Vous pouvez gérer vos clients et vos projets en toute autonomie.</p>
                </div>
            `;
        }
    } else if (activeTab === 'voyages_papiers') {
        content.innerHTML = `
            <div class="card" style="border-color:#0ea5e9;">
                <h3 class="card-title" style="color:#0ea5e9;">✈️ Assistant Voyages & Papiers d'Identité</h3>
                <div style="background:var(--bg-color); padding:15px; border-radius:10px; margin-bottom:15px; border:1px solid var(--border-color);">
                    <select id="typeDocAdministratif" class="input" style="margin-bottom:8px;">
                        <option value="passeport">📘 Passeport Biométrique</option>
                        <option value="cni">🪪 Carte Nationale d'Identité (CNI)</option>
                    </select>
                    <input type="text" id="paysDestinationVoyage" class="input" placeholder="Pays de destination..." style="margin-bottom:10px;">
                    <button class="btn-action" style="background:#0ea5e9;" onclick="verifierDossierPapier()">🔍 Afficher les Dossiers</button>
                </div>
                <div id="resultatAnalyseDossier"></div>
            </div>
        `;
    } else if (activeTab === 'dashboard') {
        content.innerHTML = `
            <div class="card" style="border-color:#3b82f6;">
                <h3 class="card-title" style="color:#3b82f6;">📊 Tableau de Bord</h3>
                <div class="stat-grid">
                    <div class="stat-box">
                        <div style="font-size:12px; color:var(--text-secondary);">Trésorerie / Caisse</div>
                        <div class="stat-num" style="color:var(--accent);">${utilisateurActif.solde.toLocaleString()} FCFA</div>
                    </div>
                </div>
            </div>
        `;
    } else if (activeTab === 'agenda') {
        content.innerHTML = `<div class="card"><h3 class="card-title">📅 Agenda</h3><p class="text">Planifiez vos rendez-vous.</p></div>`;
    } else if (activeTab === 'economie') {
        content.innerHTML = `<div class="card"><h3 class="card-title">🪙 Caisse</h3><div style="font-size:24px; font-weight:800; color:var(--accent); text-align:center;">${utilisateurActif.solde.toLocaleString()} FCFA</div></div>`;
    } else if (activeTab === 'sauvegarde') {
        content.innerHTML = `<div class="card"><h3 class="card-title">💾 Sécurité</h3><p class="text">Sauvegarde locale active.</p></div>`;
    }
}

function switchTab(t) { activeTab = t; document.getElementById('sideMenu').classList.remove('open'); render(); window.scrollTo(0, 0); }
render();
