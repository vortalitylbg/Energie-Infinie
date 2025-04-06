let energie = 0;
let energieParSeconde = 0;
let energieParClick = 1;

// Liste des améliorations
const items = [
    { nom: "Générateur manuel", desc: "Produis de l’énergie en cliquant", image: "./assets/generator.svg", prix: 10, eps: 1, nb: 0 },
    { nom: "Assistant scientifique", desc: "Un stagiaire qui appuie sur le bouton à ta place", image: "./assets/scientist.svg", prix: 100, eps: 5, nb: 0 },
    { nom: "Batterie améliorée", desc: "Stocke plus d’énergie pour éviter les pertes", image: "./assets/battery.svg", prix: 5000, eps: 10, nb: 0 },
    { nom: "Mini-centrale locale", desc: "Automatisation de la production d’énergie", image: "./assets/central.svg", prix: 20000, eps: 20, nb: 0 },
    { nom: "Équipe de chercheurs", desc: "Débloque des technologies augmentant l'efficacité", image: "./assets/searchers.svg", prix: 750000, eps: 50, nb: 0 },
    { nom: "Turbines haute performance", desc: "Améliore la production des centrales", image: "./assets/turbine.svg", prix: 1500000, eps: 100, nb: 0 },
    { nom: "Centrale à fusion expérimentale", desc: "Production massive sans pollution", prix: 500000, eps: 250, nb: 0 },
    { nom: "Intelligence artificielle", desc: "Optimise le rendement énergétique en continu", prix: 3000000, eps: 1000, nb: 0 },
    { nom: "Exploitation géothermique", desc: "Récupère l’énergie du noyau terrestre", prix: 7500000, eps: 5000, nb: 0 },
    { nom: "Colonisation énergétique", desc: "Déploie des infrastructures sur d'autres continents", image: "./assets/colonisation_energetiques.svg", prix: 100000000, eps: 20000, nb: 0 }
];

// Générer les améliorations dans le DOM
const shopContainer = document.getElementById("items");

items.forEach((item, Items_index) => {
    let button = document.createElement("button");
    button.className = "items";
    button.dataset.items_index = Items_index;

    button.dataset.prix = item.prix;
    button.innerHTML = `<img src="${item.image}" class="item-img"> ${item.nom} [${item.prix}⚡] x${item.nb}`;

    button.addEventListener("click", function () {
        buyItem(Items_index);
    });

    shopContainer.appendChild(button);
});


const ameliorations = [
    { nom: "Super Générateur", desc: "Générateurs produisent 2x plus d'énergie", prix: 8},
    { nom: "main plus puissante", desc: "Les cliques rapportent 2x plus d'énergies", prix: 100, coeff_mouse_click: 2 },
    { nom: "Supers Assistants", desc: "Les Assistants scientifiques produisent 2x plus d'energies", prix: 1000, coeff_assistants_click: 2 },
];


const ameliorationsContainer = document.getElementById("ameliorations");

ameliorations.forEach((amelioration, ameliorations_index) => {
    let button = document.createElement("button");
    button.className = "ameliorations";
    button.dataset.ameliorations_index = ameliorations_index;
    button.dataset.prix = ameliorations.prix;
    button.innerHTML = `${amelioration.nom} [${amelioration.prix}⚡]`;

    button.addEventListener("click", function () {
        buyAmelioration(ameliorations_index)
    });

    ameliorationsContainer.appendChild(button)
});


// Achat d'items
function buyItem(Items_index) {
    let item = items[Items_index];

    if (energie >= item.prix) {
        energie -= item.prix;
        energieParSeconde += item.eps;
        item.nb += 1;
        item.prix = Math.floor(item.prix * 1.2); // Augmente le prix après achat

        // Récupérer le bouton et mettre à jour son affichage
        let button = document.querySelector(`button[data-items_index="${Items_index}"]`);
        if (button) {
            button.innerHTML = `<img src="${item.image}" class="item-img"> ${item.nom} [${item.prix}⚡] x${item.nb}`;
        }

        updateDisplay();
    }
}



// Achat d'ameliorations
function buyAmelioration(ameliorations_index) {
    let amelioration = ameliorations[ameliorations_index];

    if (energie >= amelioration.prix) {
        energie -= amelioration.prix;

        if (amelioration.nom === "main plus puissante") {
            energieParClick *= amelioration.coeff_mouse_click;
        } else if (amelioration.nom === "Supers Assistants") {
            items[1].eps *= amelioration.coeff_assistants_click;
        } else if (amelioration.nom === "Super Générateur" && items[0].nb >= 2) {
            items[0].eps *= 2;
        }
        energieParSeconde = items.reduce((total, item) => total + (item.eps * item.nb), 0);

        // Supprimer le bouton d'amélioration après l'achat
        document.querySelector(`[data-ameliorations_index="${ameliorations_index}"]`).remove();

        updateDisplay();
    }
}





// Mise à jour affichage
function updateDisplay() {
    document.title = `${energie} Energies - Energie Infinie`;
    document.getElementById("energie").textContent = energie;
    document.getElementById("eps").textContent = energieParSeconde;
    document.querySelectorAll(".items").forEach(btn => {
        let Items_index = parseInt(btn.dataset.items_index);
        btn.disabled = energie < items[Items_index].prix;
    });
    document.querySelectorAll(".ameliorations").forEach(btn => {
        let ameliorations_index = parseInt(btn.dataset.ameliorations_index);
        btn.disabled = energie < ameliorations[ameliorations_index].prix;
    });
}


// Production automatique toutes les secondes
setInterval(() => {
    energie += energieParSeconde;
    updateDisplay();
}, 1000);




function createEnergyPop(event) {
    let pop = document.createElement("span");
    pop.className = "energy-pop";
    pop.textContent = `+${energieParClick}⚡`;

    // Positionner la pop-up au niveau du clic
    pop.style.left = `${event.clientX}px`;
    pop.style.top = `${event.clientY}px`;

    document.body.appendChild(pop);

    // Supprimer après animation
    setTimeout(() => {
        pop.remove();
    }, 600);
}

// Ajout de l'effet quand on clique
document.getElementById("boutonClick").addEventListener("click", function (event) {
    energie += energieParClick;
    createEnergyPop(event);
    let image = document.getElementById("boutonClick");
    image.classList.add("click-effect");
    setTimeout(() => {
        image.classList.remove("click-effect");
    }, 200);
    updateDisplay();
});


// Création de l'infobulle
let tooltip = document.createElement("div");
tooltip.id = "tooltip";
document.body.appendChild(tooltip);

document.querySelectorAll(".items").forEach((button, index) => {
    button.addEventListener("mouseenter", (e) => {
        let item = items[index];
        tooltip.innerHTML = `<strong>${item.nom}</strong><br>EPS: ${item.eps}<br>${item.desc}`;
        tooltip.style.display = "block";
    });

    button.addEventListener("mousemove", (e) => {
        tooltip.style.left = `${e.pageX + 10}px`;
        tooltip.style.top = `${e.pageY + 10}px`;
    });

    button.addEventListener("mouseleave", () => {
        tooltip.style.display = "none";
    });
});

updateDisplay();
