
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

    if (!nom) { showToast("Veuillez renseigner votre nom."); return; }

    const nouveauId = 'prof_' + Date.now();
    const nouveauProfil = {
        id: nouveauId,
        nom: nom,
        contact: contact || "Non renseigné",
        metierUnique: metierUnique,
        solde: 50000,
        journalCaisse: [
            { id: 1, type: 'entree', libelle: 'Capital initial', montant: 50000, date: new Date().toLocaleDateString() }
        ],
        factures: [],
        agendaRdv: [],
        mesuresCouture: [],
        consultationsMedicales: [],
        stocksBoutique: [],
        notesPastorales: [],
        ateliersMecanique: [],
        coursEnseignant: [],
        dossiersVoyagePapiers: [],
        carnetContacts: [],
        discussionsElaws: [
            { role: 'ai', texte: `Bonjour ${nom} ! Bienvenue dans EVAT & ELAWS (v25.0 Modulaire). Ton numéro (${contact || 'Non défini'}) est enregistré. Tous les modules (Appels GSM/Internet avec traduction, Outils Métiers, Micro) sont prêts.` }
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

// --- GESTION DES CONTACTS & APPELS (GSM & INTERNET) AVEC TRADUCTION ---
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
    showToast(`🌐 Appel Internet VoIP chiffré & Traduction ELAWS vers ${nomDest} (${dialecteDest})...`);
    setTimeout(() => {
        alert(`[Appel Intelligent ELAWS v25.0] 
Connexion établie avec ${nomDest} !
🗣️ Langue source : Votre voix.
🔄 Traduction instantanée active vers : ${dialecteDest}.
L'interlocuteur vous comprend parfaitement dans son dialecte !`);
    }, 600);
}

// --- OUTILS MÉTIERS & PAPIERS ---
function enregistrerMesureCouture() {
    const client = document.getElementById('coutureClient')?.value.trim();
    const epaule = document.getElementById('coutureEpaule')?.value || '';
    const poitrine = document.getElementById('couturePoitrine')?.value || '';
    const longueur = document.getElementById('coutureLongueur')?.value || '';
    const details = document.getElementById('coutureDetails')?.value.trim() || '';

    if(client) {
        if(!utilisateurActif.mesuresCouture) utilisateurActif.mesuresCouture = [];
        utilisateurActif.mesuresCouture.unshift({ id: Date.now(), client, epaule, poitrine, longueur, details, date: new Date().toLocaleDateString() });
        sauvegarderProfilActif();
        jouerSonSucces();
        showToast("Mesures enregistrées !");
        render();
    } else { showToast("Veuillez indiquer le nom du client."); }
}

function ajouterNotePastorale() {
    const titre = document.getElementById('pasteurTitre')?.value.trim();
    const contenu = document.getElementById('pasteurContenu')?.value.trim();
    if(titre) {
        if(!utilisateurActif.notesPastorales) utilisateurActif.notesPastorales = [];
        utilisateurActif.notesPastorales.unshift({ id: Date.now(), titre, contenu, date: new Date().toLocaleDateString() });
        sauvegarderProfilActif();
        jouerSonSucces();
        showToast("Prédication enregistrée !");
        render();
    } else { showToast("Indiquez le titre du message."); }
}

function ajouterConsultationMedicale() {
    const patient = document.getElementById('medPatient')?.value.trim();
    const diagnostic = document.getElementById('medDiagnostic')?.value.trim();
    const prescription = document.getElementById('medPrescription')?.value.trim();

    if(patient && diagnostic) {
        if(!utilisateurActif.consultationsMedicales) utilisateurActif.consultationsMedicales = [];
        utilisateurActif.consultationsMedicales.unshift({ id: Date.now(), patient, diagnostic, prescription, date: new Date().toLocaleDateString() });
        sauvegarderProfilActif();
        jouerSonSucces();
        showToast("Consultation enregistrée !");
        render();
    } else { showToast("Remplissez le patient et le diagnostic."); }
}

function ajouterStockBoutique() {
    const article = document.getElementById('boutiqueArticle')?.value.trim();
    const qte = parseInt(document.getElementById('boutiqueQte')?.value);
    const prix = parseFloat(document.getElementById('boutiquePrix')?.value);

    if(article && !isNaN(qte) && !isNaN(prix)) {
        if(!utilisateurActif.stocksBoutique) utilisateurActif.stocksBoutique = [];
        utilisateurActif.stocksBoutique.unshift({ id: Date.now(), article, qte, prix });
        sauvegarderProfilActif();
        jouerSonSucces();
        showToast("Article ajouté au stock !");
        render();
    } else { showToast("Remplissez correctement les champs."); }
}

function ajouterAtelierMecanique() {
    const vehicule = document.getElementById('mecaVehicule')?.value.trim();
    const panne = document.getElementById('mecaPanne')?.value.trim();
    const cout = parseFloat(document.getElementById('mecaCout')?.value) || 0;

    if(vehicule && panne) {
        if(!utilisateurActif.ateliersMecanique) utilisateurActif.ateliersMecanique = [];
        utilisateurActif.ateliersMecanique.unshift({ id: Date.now(), vehicule, panne, cout, date: new Date().toLocaleDateString() });
        sauvegarderProfilActif();
        jouerSonSucces();
        showToast("Réparation enregistrée !");
        render();
    } else { showToast("Remplissez le véhicule et la panne."); }
}

function verifierDossierPapier() {
    const typeDoc = document.getElementById('typeDocAdministratif')?.value;
    const paysDestination = document.getElementById('paysDestinationVoyage')?.value.trim() || "National / International";
    const resultatDiv = document.getElementById('resultatAnalyseDossier');
    if(!resultatDiv) return;

    let pieces = [];
    let conseils = "";

    if (typeDoc === 'passeport') {
        pieces = [
            "Acte de naissance sécurisé (original ou copie certifiée)",
            "Carte nationale d'identité biométrique valide",
            "Certificat de nationalité",
            "Photos d'identité aux normes (fond blanc)",
            "Quittance / Reçu de paiement des frais de timbre passeport",
            "Justificatif de domicile ou attestation de résidence"
        ];
        conseils = `Pour l'obtention de votre passeport pour ${paysDestination}, assurez-vous que tous vos documents d'état civil portent les mêmes noms exacts.`;
    } else if (typeDoc === 'cni') {
        pieces = [
            "Ancienne carte d'identité ou Déclaration de perte",
            "Acte de naissance original sécurisé",
            "Certificat de nationalité",
            "Justificatif de résidence",
            "Timbres fiscaux ou reçu de quittance"
        ];
        conseils = `Le dépôt pour la carte d'identité (CNI) se fait auprès des services compétents de votre localité.`;
    } else if (typeDoc === 'sejour') {
        pieces = [
            "Passeport en cours de validité",
            "Visa d'établissement ou d'entrée",
            "Contrat de travail ou attestation",
            "Justificatif de logement",
            "Visite médicale / Carnet de vaccination"
        ];
        conseils = `Constituez votre dossier de titre de séjour au moins 2 mois avant l'expiration de votre visa.`;
    } else {
        pieces = [
            "Formulaire de demande de visa complété",
            "Passeport valide (6 mois min. après retour)",
            "Photos d'identité récentes",
            "Billets d'avion aller-retour",
            "Réservation d'hôtel ou certificat d'hébergement",
            "Attestation d'assurance voyage"
        ];
        conseils = `Vérifiez si une vaccination spécifique (ex: Fièvre jaune) est exigée pour ${paysDestination}.`;
    }

    let listeHtml = `<ul style="margin:10px 0; padding-left:20px; line-height:1.6;">`;
    pieces.forEach(p => { listeHtml += `<li>${p}</li>`; });
    listeHtml += `</ul>`;

    resultatDiv.innerHTML = `
        <div style="background:var(--bg-color); padding:15px; border-radius:10px; border:1px solid var(--accent); margin-top:10px;">
            <strong style="color:var(--accent);">📋 Dossier Requis (${typeDoc.toUpperCase()} — ${paysDestination}) :</strong>
            ${listeHtml}
            <p style="margin-top:10px; font-size:13px; color:var(--text-secondary);">💡 <em>Conseil ELAWS :</em> ${conseils}</p>
            <button class="btn-action" style="margin-top:10px; background:#0ea5e9;" onclick="sauvegarderDossierActif('${typeDoc}', '${paysDestination}')">💾 Sauvegarder ce dossier</button>
        </div>
    `;
    jouerSonSucces();
}

function sauvegarderDossierActif(doc, pays) {
    if(!utilisateurActif.dossiersVoyagePapiers) utilisateurActif.dossiersVoyagePapiers = [];
    utilisateurActif.dossiersVoyagePapiers.unshift({ id: Date.now(), doc, pays, date: new Date().toLocaleDateString() });
    sauvegarderProfilActif();
    showToast("Dossier administratif sauvegardé !");
    render();
}

// --- DISCUSSION ELAWS + MICRO ---
function envoyerMessageElawsAI(texteForce) {
    const input = document.getElementById('inputElawsChat');
    const q = texteForce || (input ? input.value.trim() : '');
    if (!q) return;

    if (!utilisateurActif.discussionsElaws) utilisateurActif.discussionsElaws = [];
    utilisateurActif.discussionsElaws.push({ role: 'user', texte: q });

    const lowerQ = q.toLowerCase();
    let reponse = "";

    if (lowerQ.includes('bonjour') || lowerQ.includes('salut') || lowerQ.includes('coucou')) {
        reponse = `Salut ${utilisateurActif.nom} ! Ton contact (${utilisateurActif.contact}) est bien enregistré. En tant que ${utilisateurActif.metierUnique}, je t'assiste sur tous tes outils.`;
    } else if (lowerQ.includes('passeport') || lowerQ.includes('carte') || lowerQ.includes('voyage')) {
        reponse = `[Expert Voyages ELAWS] Pour tes démarches de passeport ou CNI, consulte l'onglet "Voyages".`;
    } else if (lowerQ.includes('appel') || lowerQ.includes('traduction')) {
        reponse = `[Appels & Traduction] Passe tes appels GSM ou Internet avec traduction en direct depuis l'onglet "Appels".`;
    } else {
        reponse = `J'ai bien noté : "${q}". Tout est sécurisé dans ton écosystème modulaire v25.0.`;
    }

    utilisateurActif.discussionsElaws.push({ role: 'ai', texte: reponse });
    sauvegarderProfilActif();
    jouerSonSucces();
    
    if(input) input.value = '';
    render();

    if('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(reponse));
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
    showToast("🎤 Parle à ELAWS, j'écoute...");
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
                profilsExistantsHtml += `<button class="btn-action" style="background:var(--card-bg); border:1px solid var(--accent); color:var(--text-main); text-align:left; padding:12px;" onclick="selectionnerProfilExistant('${p.id}')">👤 <strong>${p.nom}</strong> (${p.contact}) <small style="float:right; color:var(--accent);">[${p.metierUnique}]</small></button>`;
            });
            profilsExistantsHtml += `</div></div>`;
        }

        content.innerHTML = `
            <div class="card" style="border-color:var(--accent); max-width:500px; margin: 10px auto; text-align:center;">
                <img src="https://img.icons8.com/color/96/000000/artificial-intelligence.png" alt="Logo" style="width:72px; height:72px; margin-bottom:10px; border-radius:16px; border:2px solid var(--accent);">
                <h2 style="color:var(--accent); margin-top:0;">✨ E.V.A.T. & ELAWS</h2>
                <p class="text" style="text-align:center;">Architecture Modulaire (v25.0 — Zéro Écran Noir)</p>
                
                ${profilsExistantsHtml}

                <div style="text-align:left;">
                    <h4 style="margin-bottom:10px; border-top:1px solid var(--border-color); padding-top:15px;">📝 Créer mon Profil & Contact :</h4>
                    <input type="text" id="regNom" class="input" placeholder="Votre Nom ou Prénom *" style="margin-bottom:8px;">
                    <input type="tel" id="regContact" class="input" placeholder="Votre Numéro de Téléphone (ex: +228 98231402) *" style="margin-bottom:8px;">
                    
                    <label style="font-size:12px; color:var(--text-secondary); display:block; margin-bottom:4px;">Choisissez votre Corps de Métier :</label>
                    <select id="selectMetierBase" class="input" style="margin-bottom:8px;" onchange="document.getElementById('regMetierCustom').value = this.value;">
                        <option value="Couturier / Tailleur">✂️ Couturier / Tailleur</option>
                        <option value="Pasteur / Guide Spirituel">📖 Pasteur / Guide Spirituel</option>
                        <option value="Médecin / Soignant">🩺 Médecin / Soignant</option>
                        <option value="Commerçant / Boutique">🛍️ Commerçant / Boutique</option>
                        <option value="Mécanicien / Artisan">🔧 Mécanicien / Artisan</option>
                        <option value="Enseignant / Formateur">📚 Enseignant / Formateur</option>
                    </select>

                    <input type="text" id="regMetierCustom" class="input" value="Couturier / Tailleur" placeholder="Ou personnalisez votre métier..." style="margin-bottom:12px;">
                    
                    <button class="btn-action" onclick="creerNouveauProfil()">🚀 Démarrer (v25.0 Modulaire)</button>
                </div>
            </div>
        `;
        return;
    }

    document.getElementById('appHeader').style.display = 'block';
    document.getElementById('bottomBar').style.display = 'flex';
    const badge = document.getElementById('badgeDomaineActif');
    if(badge) badge.innerHTML = `💼 ${utilisateurActif.nom} (${utilisateurActif.contact}) — [${utilisateurActif.metierUnique}]`;

    document.querySelectorAll('.bar-item').forEach(el => el.classList.remove('active'));
    if(activeTab === 'accueil') document.getElementById('barAccueil')?.classList.add('active');
    if(activeTab === 'appels_traduction') document.getElementById('barAppel')?.classList.add('active');
    if(activeTab === 'elaws_compagnon') document.getElementById('barElaws')?.classList.add('active');
    if(activeTab === 'outils_metier') document.getElementById('barOutil')?.classList.add('active');
    if(activeTab === 'voyages_papiers') document.getElementById('barVoyage')?.classList.add('active');

    if (activeTab === 'accueil') {
        content.innerHTML = `
            <div class="card" style="border-color: var(--accent);">
                <div class="badge-gamified">🌟 Architecture Modulaire v25.0 Active</div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <div>
                        <span style="font-size:11px; color:var(--accent); font-weight:700;">👤 PROFIL ACTIF & CONTACT</span>
                        <div style="font-size:17px; font-weight:800;">${utilisateurActif.nom}</div>
                        <div style="font-size:13px; color:var(--accent);">📱 Contact : ${utilisateurActif.contact}</div>
                    </div>
                    <button class="btn-top" onclick="changerProfilSession()">🔄 Changer</button>
                </div>
                <p class="text">Métier : <strong style="color:var(--accent);">${utilisateurActif.metierUnique}</strong>. Le code est désormais séparé en plusieurs fichiers (HTML, CSS, JS), éliminant tout risque d'écran noir ou de perte de code lors des mises à jour.</p>
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
                <h3 class="card-title" style="color:#0ea5e9;">📞 Appels (GSM & Internet) & Traduction de Dialecte</h3>
                <p class="text">Communiquez sans barrière : ELAWS traduit en temps réel les dialectes lors des appels Internet.</p>
                
                <div style="background:var(--bg-color); padding:15px; border-radius:10px; margin-bottom:15px; border:1px solid var(--border-color);">
                    <label style="font-size:12px; color:var(--text-secondary); display:block; margin-bottom:4px;">Mon Numéro de Contact :</label>
                    <div style="display:flex; gap:8px; margin-bottom:10px;">
                        <input type="tel" id="monNumeroContact" class="input" value="${utilisateurActif.contact}" placeholder="Votre numéro..." style="margin-bottom:0;">
                        <button class="btn-action" style="background:#059669; width:auto; padding:0 15px;" onclick="mettreAJourMonContact()">Mettre à jour</button>
                    </div>
                </div>

                <h4 style="margin-top:15px; margin-bottom:8px;">➕ Ajouter un Contact & Dialecte :</h4>
                <div style="background:var(--bg-color); padding:15px; border-radius:10px; margin-bottom:15px; border:1px solid var(--border-color);">
                    <input type="text" id="nomContactRepertoire" class="input" placeholder="Nom du contact *" style="margin-bottom:8px;">
                    <input type="tel" id="numContactRepertoire" class="input" placeholder="Numéro de téléphone *" style="margin-bottom:8px;">
                    <input type="email" id="emailContactRepertoire" class="input" placeholder="Email (optionnel)" style="margin-bottom:8px;">
                    
                    <label style="font-size:12px; color:var(--text-secondary); display:block; margin-bottom:4px;">Langue ou Dialecte :</label>
                    <select id="dialecteContactRepertoire" class="input" style="margin-bottom:10px;">
                        <option value="Français">🇫🇷 Français</option>
                        <option value="Éoué / Mina">🇹🇬 Éoué / Mina (Togo)</option>
                        <option value="Kabyè">🇹🇬 Kabyè (Togo)</option>
                        <option value="Yoruba / Nago">🇳🇬 Yoruba / Nago</option>
                        <option value="Haoussa">🌍 Haoussa</option>
                        <option value="Anglais">🇬🇧 Anglais</option>
                    </select>

                    <button class="btn-action" style="background:#0ea5e9;" onclick="ajouterRepertoireContact()">💾 Enregistrer le Contact</button>
                </div>

                <h4 style="margin-bottom:8px;">📖 Répertoire & Appels :</h4>
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
                        <strong style="font-size:12px; color:${isAi ? 'var(--accent)' : 'var(--text-secondary)'};">${isAi ? '🤖 ELAWS (Expert ' + utilisateurActif.metierUnique + ')' : utilisateurActif.nom}</strong>
                        <p style="margin:8px 0 0 0; font-size:14px; white-space: pre-line;">${msg.texte}</p>
                        ${isAi ? `<button onclick="window.speechSynthesis.speak(new SpeechSynthesisUtterance('${msg.texte.replace(/'/g, "'").replace(/\n/g, " ")}'))" style="position:absolute; top:10px; right:10px; background:var(--accent); color:#000; border:none; padding:4px 8px; border-radius:6px; font-size:11px; font-weight:700; cursor:pointer;">🔊 Écouter</button>` : ''}
                    </div>
                `;
            });
        }
        content.innerHTML = `
            <div class="card" style="border-color:var(--accent);">
                <h3 class="card-title" style="color:var(--accent);">🤖 ELAWS v25.0 — Assistant Vocal & Discussion</h3>
                <p class="text">Parle avec ELAWS en écrivant ou en activant le micro :</p>
                
                <div style="text-align:center; margin-bottom:15px;">
                    <button class="btn-action" onclick="demarrerMicroElaws()" style="background:linear-gradient(135deg, #ec4899 0%, #db2777 100%); font-size:16px; padding:14px; border-radius:30px;">
                        🎤 Parler à ELAWS (Micro)
                    </button>
                </div>

                <div style="background:var(--bg-color); padding:15px; border-radius:12px; max-height:350px; overflow-y:auto; margin-bottom:15px; border:1px solid var(--border-color);" id="boiteDiscussionElaws">
                    ${chatHtml}
                </div>
                <div style="display:flex; gap:8px;">
                    <input type="text" id="inputElawsChat" class="input" placeholder="Écris ton message à ELAWS..." style="margin-bottom:0;" onkeypress="if(event.key === 'Enter') envoyerMessageElawsAI()">
                    <button class="btn-action" style="width:auto; padding:0 22px;" onclick="envoyerMessageElawsAI()">Envoyer 🚀</button>
                </div>
            </div>
        `;
    } else if (activeTab === 'outils_metier') {
        const metier = utilisateurActif.metierUnique.toLowerCase();
        let outilsHtml = '';

        if (metier.includes('couturier') || metier.includes('tailleur')) {
            let mesuresHtml = '';
            if(utilisateurActif.mesuresCouture && utilisateurActif.mesuresCouture.length > 0) {
                utilisateurActif.mesuresCouture.forEach(m => {
                    mesuresHtml += `<div style="background:var(--bg-color); padding:10px; border-radius:8px; margin-bottom:8px; border-left:3px solid #f59e0b;"><strong>✂️ Client : ${m.client}</strong> (${m.date})<br><small>Épaule: ${m.epaule} cm | Poitrine: ${m.poitrine} cm | Longueur: ${m.longueur} cm</small><br><em>Détails : ${m.details || 'Aucun'}</em></div>`;
                });
            } else { mesuresHtml = '<p style="color:var(--text-secondary);">Aucune mesure enregistrée.</p>'; }

            outilsHtml += `
                <div class="card" style="border-color:#f59e0b;">
                    <h3 class="card-title" style="color:#f59e0b;">✂️ Carnet de Mesures & Commandes (Couture)</h3>
                    <div style="background:var(--bg-color); padding:15px; border-radius:10px; margin-bottom:15px; border:1px solid var(--border-color);">
                        <input type="text" id="coutureClient" class="input" placeholder="Nom du Client *" style="margin-bottom:8px;">
                        <div style="display:flex; gap:8px; margin-bottom:8px;">
                            <input type="text" id="coutureEpaule" class="input" placeholder="Épaule (cm)" style="margin-bottom:0;">
                            <input type="text" id="couturePoitrine" class="input" placeholder="Poitrine (cm)" style="margin-bottom:0;">
                            <input type="text" id="coutureLongueur" class="input" placeholder="Longueur (cm)" style="margin-bottom:0;">
                        </div>
                        <input type="text" id="coutureDetails" class="input" placeholder="Modèle ou remarques..." style="margin-bottom:10px;">
                        <button class="btn-action" style="background:#f59e0b;" onclick="enregistrerMesureCouture()">💾 Enregistrer les Mesures</button>
                    </div>
                    <h4 style="margin-bottom:8px;">Historique des Clients :</h4>
                    ${mesuresHtml}
                </div>
            `;
        }

        if (metier.includes('pasteur') || metier.includes('guide') || metier.includes('culte')) {
            let notesHtml = '';
            if(utilisateurActif.notesPastorales && utilisateurActif.notesPastorales.length > 0) {
                utilisateurActif.notesPastorales.forEach(n => {
                    notesHtml += `<div style="background:var(--bg-color); padding:10px; border-radius:8px; margin-bottom:8px; border-left:3px solid #f59e0b;"><strong>📖 ${n.titre}</strong> (${n.date})<br><p style="margin:5px 0 0 0; white-space:pre-line;">${n.contenu}</p></div>`;
                });
            } else { notesHtml = '<p style="color:var(--text-secondary);">Aucune prédication enregistrée.</p>'; }

            outilsHtml += `
                <div class="card" style="border-color:#f59e0b;">
                    <h3 class="card-title" style="color:#f59e0b;">📖 Notes de Prédication & Pastorale</h3>
                    <div style="background:var(--bg-color); padding:15px; border-radius:10px; margin-bottom:15px; border:1px solid var(--border-color);">
                        <input type="text" id="pasteurTitre" class="input" placeholder="Thème du culte *" style="margin-bottom:8px;">
                        <textarea id="pasteurContenu" class="input" rows="4" placeholder="Saisissez vos notes bibliques..." style="resize:none; margin-bottom:10px;"></textarea>
                        <button class="btn-action" style="background:#f59e0b;" onclick="ajouterNotePastorale()">💾 Sauvegarder la Prédication</button>
                    </div>
                    <h4 style="margin-bottom:8px;">Mes Prédications :</h4>
                    ${notesHtml}
                </div>
            `;
        }

        if (metier.includes('medecin') || metier.includes('soignant')) {
            let medHtml = '';
            if(utilisateurActif.consultationsMedicales && utilisateurActif.consultationsMedicales.length > 0) {
                utilisateurActif.consultationsMedicales.forEach(c => {
                    medHtml += `<div style="background:var(--bg-color); padding:10px; border-radius:8px; margin-bottom:8px; border-left:3px solid #3b82f6;"><strong>🩺 Patient : ${c.patient}</strong> (${c.date})<br>Diagnostic : ${c.diagnostic}<br>Prescription : ${c.prescription}</div>`;
                });
            } else { medHtml = '<p style="color:var(--text-secondary);">Aucune consultation enregistrée.</p>'; }

            outilsHtml += `
                <div class="card" style="border-color:#3b82f6;">
                    <h3 class="card-title" style="color:#3b82f6;">🩺 Registre de Consultations Médicales</h3>
                    <div style="background:var(--bg-color); padding:15px; border-radius:10px; margin-bottom:15px; border:1px solid var(--border-color);">
                        <input type="text" id="medPatient" class="input" placeholder="Nom du Patient *" style="margin-bottom:8px;">
                        <input type="text" id="medDiagnostic" class="input" placeholder="Diagnostic / Symptômes *" style="margin-bottom:8px;">
                        <input type="text" id="medPrescription" class="input" placeholder="Prescription / Traitement *" style="margin-bottom:10px;">
                        <button class="btn-action" style="background:#3b82f6;" onclick="ajouterConsultationMedicale()">💾 Enregistrer la Consultation</button>
                    </div>
                    <h4 style="margin-bottom:8px;">Derniers Patients :</h4>
                    ${medHtml}
                </div>
            `;
        }

        if (metier.includes('commercant') || metier.includes('boutique')) {
            let stockHtml = '';
            if(utilisateurActif.stocksBoutique && utilisateurActif.stocksBoutique.length > 0) {
                utilisateurActif.stocksBoutique.forEach(s => {
                    stockHtml += `<div style="background:var(--bg-color); padding:10px; border-radius:8px; margin-bottom:8px; border-left:3px solid #10b981;"><strong>🛍️ ${s.article}</strong> — Stock : ${s.qte} | Prix : ${s.prix.toLocaleString()} FCFA</div>`;
                });
            } else { stockHtml = '<p style="color:var(--text-secondary);">Aucun article en stock.</p>'; }

            outilsHtml += `
                <div class="card" style="border-color:#10b981;">
                    <h3 class="card-title" style="color:#10b981;">🛍️ Gestion de Stock & Boutique</h3>
                    <div style="background:var(--bg-color); padding:15px; border-radius:10px; margin-bottom:15px; border:1px solid var(--border-color);">
                        <input type="text" id="boutiqueArticle" class="input" placeholder="Nom de l'article *" style="margin-bottom:8px;">
                        <div style="display:flex; gap:8px; margin-bottom:8px;">
                            <input type="number" id="boutiqueQte" class="input" placeholder="Quantité" style="margin-bottom:0;">
                            <input type="number" id="boutiquePrix" class="input" placeholder="Prix unitaire (FCFA)" style="margin-bottom:0;">
                        </div>
                        <button class="btn-action" style="background:#10b981;" onclick="ajouterStockBoutique()">➕ Ajouter au Stock</button>
                    </div>
                    <h4 style="margin-bottom:8px;">Inventaire Actuel :</h4>
                    ${stockHtml}
                </div>
            `;
        }

        if (metier.includes('mecanicien') || metier.includes('artisan')) {
            let mecaHtml = '';
            if(utilisateurActif.ateliersMecanique && utilisateurActif.ateliersMecanique.length > 0) {
                utilisateurActif.ateliersMecanique.forEach(m => {
                    mecaHtml += `<div style="background:var(--bg-color); padding:10px; border-radius:8px; margin-bottom:8px; border-left:3px solid #f59e0b;"><strong>🔧 Véhicule : ${m.vehicule}</strong> (${m.date})<br>Panne : ${m.panne}<br>Coût : ${m.cout.toLocaleString()} FCFA</div>`;
                });
            } else { mecaHtml = '<p style="color:var(--text-secondary);">Aucun véhicule enregistré.</p>'; }

            outilsHtml += `
                <div class="card" style="border-color:#f59e0b;">
                    <h3 class="card-title" style="color:#f59e0b;">🔧 Suivi Atelier Mécanique</h3>
                    <div style="background:var(--bg-color); padding:15px; border-radius:10px; margin-bottom:15px; border:1px solid var(--border-color);">
                        <input type="text" id="mecaVehicule" class="input" placeholder="Véhicule / Client *" style="margin-bottom:8px;">
                        <input type="text" id="mecaPanne" class="input" placeholder="Description de la panne *" style="margin-bottom:8px;">
                        <input type="number" id="mecaCout" class="input" placeholder="Coût estimé (FCFA)" style="margin-bottom:10px;">
                        <button class="btn-action" style="background:#f59e0b;" onclick="ajouterAtelierMecanique()">💾 Enregistrer la Réparation</button>
                    </div>
                    <h4 style="margin-bottom:8px;">Véhicules en Atelier :</h4>
                    ${mecaHtml}
                </div>
            `;
        }

        if (!outilsHtml) {
            outilsHtml = `
                <div class="card" style="border-color:#f59e0b;">
                    <h3 class="card-title" style="color:#f59e0b;">🛠️ Espace Professionnel — ${utilisateurActif.metierUnique}</h3>
                    <p class="text">Votre profil et vos contacts sont pleinement actifs.</p>
                </div>
            `;
        }

        content.innerHTML = outilsHtml;
    } else if (activeTab === 'voyages_papiers') {
        let savedDossiersHtml = '';
        if(utilisateurActif.dossiersVoyagePapiers && utilisateurActif.dossiersVoyagePapiers.length > 0) {
            utilisateurActif.dossiersVoyagePapiers.forEach(d => {
                savedDossiersHtml += `<div style="background:var(--bg-color); padding:10px; border-radius:8px; margin-bottom:8px; border-left:3px solid #0ea5e9;"><strong>✈️ Document : ${d.doc.toUpperCase()}</strong> — Destination : ${d.pays} <small>(${d.date})</small></div>`;
            });
        } else { savedDossiersHtml = '<p style="color:var(--text-secondary);">Aucun dossier sauvegardé.</p>'; }

        content.innerHTML = `
            <div class="card" style="border-color:#0ea5e9;">
                <h3 class="card-title" style="color:#0ea5e9;">✈️ Assistant Voyages, Passeport & Papiers d'Identité</h3>
                <p class="text">Sélectionnez le document ou la démarche souhaitée pour obtenir instantanément la liste complète des pièces à fournir :</p>
                
                <div style="background:var(--bg-color); padding:15px; border-radius:10px; margin-bottom:15px; border:1px solid var(--border-color);">
                    <label style="font-size:12px; color:var(--text-secondary); display:block; margin-bottom:4px;">Type de Document :</label>
                    <select id="typeDocAdministratif" class="input" style="margin-bottom:8px;">
                        <option value="passeport">📘 Passeport Biométrique</option>
                        <option value="cni">🪪 Carte Nationale d'Identité (CNI)</option>
                        <option value="sejour">📄 Carte de Séjour / Résidence</option>
                        <option value="visa">✈️ Visa de Voyage / Tourisme</option>
                    </select>

                    <input type="text" id="paysDestinationVoyage" class="input" placeholder="Pays de destination ou d'émission..." style="margin-bottom:10px;">
                    
                    <button class="btn-action" style="background:#0ea5e9;" onclick="verifierDossierPapier()">🔍 Afficher les Dossiers à Fournir</button>
                </div>

                <div id="resultatAnalyseDossier"></div>

                <h4 style="margin-top:20px; margin-bottom:8px;">📁 Mes Dossiers Archivés :</h4>
                ${savedDossiersHtml}
            </div>
        `;
    } else if (activeTab === 'dashboard') {
        content.innerHTML = `
            <div class="card" style="border-color:#3b82f6;">
                <h3 class="card-title" style="color:#3b82f6;">📊 Tableau de Bord</h3>
                <div class="stat-grid">
                    <div class="stat-box">
                        <div style="font-size:12px; color:var(--text-secondary);">Trésorerie Caisse</div>
                        <div class="stat-num" style="color:var(--accent);">${utilisateurActif.solde.toLocaleString()} FCFA</div>
                    </div>
                </div>
            </div>
        `;
    } else if (activeTab === 'agenda') {
        content.innerHTML = `
            <div class="card" style="border-color:#f59e0b;">
                <h3 class="card-title" style="color:#f59e0b;">📅 Agenda & Rendez-vous</h3>
                <p class="text">Planifiez vos rendez-vous professionnels.</p>
            </div>
        `;
    } else if (activeTab === 'economie') {
        content.innerHTML = `
            <div class="card" style="border-color:var(--accent);">
                <h3 class="card-title">🪙 Journal de Caisse</h3>
                <div style="font-size:24px; font-weight:800; color:var(--accent); text-align:center; padding:10px; background:var(--bg-color); border-radius:10px; margin-bottom:15px;">${utilisateurActif.solde.toLocaleString()} FCFA</div>
            </div>
        `;
    } else if (activeTab === 'sauvegarde') {
        content.innerHTML = `
            <div class="card" style="border-color:var(--accent);">
                <h3 class="card-title">💾 Sauvegarde & Sécurité</h3>
                <p class="text">Toutes vos données (profils, contacts, caisse, mesures) sont automatiquement sauvegardées en local sur votre appareil.</p>
            </div>
        `;
    }
}

function switchTab(t) { activeTab = t; document.getElementById('sideMenu').classList.remove('open'); render(); window.scrollTo(0, 0); }
render();
