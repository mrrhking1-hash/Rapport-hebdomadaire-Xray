let donnees = [];
let ligneEnEdition = null;

// Affichage de la date (Ligne 10 en VBA)
document.getElementById('currentDate').innerText = new Date().toLocaleDateString('fr-FR');

function enregistrer() {
    const commande = document.getElementById('commande').value;
    const fournisseur = document.getElementById('fournisseur').value;
    const quantite = document.getElementById('quantite').value;
    const chantier = document.getElementById('chantier').value;

    if(!commande || !fournisseur) return alert("Remplissez les champs !");

    const nouvelleEntree = {
        id: ligneEnEdition !== null ? donnees[ligneEnEdition].id : donnees.length + 1,
        date: new Date().toLocaleDateString('fr-FR'),
        commande,
        fournisseur,
        quantite,
        chantier
    };

    if (ligneEnEdition !== null) {
        donnees[ligneEnEdition] = nouvelleEntree;
        ligneEnEdition = null;
    } else {
        donnees.push(nouvelleEntree);
    }

    viderChamps();
    rafraichirTableau();
}

function rafraichirTableau() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';

    donnees.forEach((item, index) => {
        const row = `
            <tr class="border-b border-gray-200 hover:bg-gray-50 transition">
                <td class="p-3 text-gray-500">${index + 1}</td>
                <td class="p-3 font-bold italic">${item.date}</td>
                <td class="p-3 italic">${item.commande}</td>
                <td class="p-3 italic">${item.fournisseur}</td>
                <td class="p-3 font-bold text-blue-600">${item.quantite}</td>
                <td class="p-3 italic">${item.chantier}</td>
                <td class="p-3 text-center space-x-2">
                    <button onclick="editer(${index})" class="text-blue-500 hover:text-blue-700"><i class="fas fa-edit"></i></button>
                    <button onclick="supprimer(${index})" class="text-red-500 hover:text-red-700"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function editer(index) {
    const item = donnees[index];
    document.getElementById('commande').value = item.commande;
    document.getElementById('fournisseur').value = item.fournisseur;
    document.getElementById('quantite').value = item.quantite;
    document.getElementById('chantier').value = item.chantier;
    ligneEnEdition = index;
}

function supprimer(index) {
    if(confirm("Supprimer cette ligne ?")) {
        donnees.splice(index, 1);
        rafraichirTableau();
    }
}

function viderChamps() {
    document.querySelectorAll('input').forEach(input => input.value = '');
}

function toutEffacer() {
    if(confirm("Nouveau rapport ? Cela effacera tout.")) {
        donnees = [];
        rafraichirTableau();
    }
}

function exporterPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('landscape');
    
    doc.text("Rapport Hebdomadaire - Care Space", 14, 15);
    
    const rows = donnees.map(item => [item.id, item.date, item.commande, item.fournisseur, item.quantite, item.chantier]);
    
    doc.autoTable({
        head: [['N°', 'Date', 'Commande', 'Fournisseur', 'Quantité', 'Chantier']],
        body: rows,
        startY: 20,
        theme: 'grid',
        headStyles: { fillColor: [0, 0, 0] }
    });

    doc.save(`Rapport_CareSpace_${new Date().toISOString().slice(0,10)}.pdf`);
}