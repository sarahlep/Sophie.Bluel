

//Récupération des éléments du DOM//


const gallery = document.getElementById('item-list');
const filters = document.querySelector(".filters")




//Récupérationdes travaux//

async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  return await response.json();
}

function createItems(work) {
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const figcaption = document.createElement("figcaption");
  img.src = work.imageUrl;
  figcaption.textContent = work.title;
  figure.classList.add("galleryStyle");
  figure.appendChild(img);
  figure.appendChild(figcaption);
  gallery.appendChild(figure);
}



async function displayItems() {
  gallery.innerHTML = "";
  const items = await getWorks();
  items.forEach((item) => {
    createItems(item);
  });
}

displayItems();





//Récupération des catégories//

async function getCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  return await response.json();
}

async function displayCategoriesButtons() {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn");
  if (!isLoggedIn) {
    const categories = await getCategories();
    categories.forEach((category) => {
      const btn = document.createElement("button");
      btn.textContent = category.name.toUpperCase();
      btn.id = category.id;
      filters.appendChild(btn);
    });
  } else {
    // Si l'utilisateur est connecté, masquer les boutons de filtre
    const filterButtons = document.getElementById("filter-buttons");
    filterButtons.style.display = "none";
  }
}

async function filterCategories() {
  const items = await getWorks();
  const buttons = document.querySelectorAll(".filters button");
  buttons.forEach((button) => {
    button.addEventListener("click", async (e) => { // Ajout de async ici
      const btnId = e.target.id;
      gallery.innerHTML = "";
      if (btnId !== "0") {
        const filteredItems = items.filter((item) => {
          return item.categoryId == btnId;
        });
        filteredItems.forEach((item) => {
          createItems(item);
        });
      } else {
        displayItems();
      }
    });
  });
}

filterCategories();





// Fonction pour afficher les boutons de filtre
async function displayFilterButtons() {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn");

  if (!isLoggedIn) {
    const categories = await getCategories();
    categories.forEach((category) => {
      const btn = document.createElement("button");
      // Mettre seulement la première lettre en majuscule et le reste en minuscules
      const categoryName = category.name.charAt(0).toUpperCase() + category.name.slice(1).toLowerCase();
      btn.textContent = categoryName;
      btn.id = category.id;
      btn.classList.add("filters"); // Ajout de la classe CSS "filters" au bouton
      filters.appendChild(btn);
    });
  } else {
    // Si l'utilisateur est connecté, masquer les boutons de filtre
    filters.style.display = "none";
  }
}

// Appeler la fonction pour afficher les boutons de filtre
displayFilterButtons();




// Fonction pour gérer l'affichage du bouton de modification
function manageEditButton() {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn");

  if (isLoggedIn) {
    // Si l'utilisateur est connecté, créer et afficher le bouton de modification
    const editBtnContainer = document.createElement("div");
    editBtnContainer.classList.add("edit-projets");

    const editBtn = document.createElement("div");
    editBtn.classList.add("edit");
    editBtn.innerHTML = `
    <i class="fa-regular fa-pen-to-square logo-pen"></i>
      <p class="modifier">Modifier</p>
    `;

    editBtnContainer.appendChild(editBtn);
    document.body.appendChild(editBtnContainer);
  }
}

// Appeler la fonction pour gérer l'affichage du bouton de modification
manageEditButton();




// Récupérer l'état de connexion depuis sessionStorage
const isLoggedIn = sessionStorage.getItem("isLoggedIn");

// Sélectionner les éléments de connexion et de déconnexion
const loginLink = document.getElementById("login");
const logoutLink = document.getElementById("logout");

// Vérifier si l'utilisateur est connecté
if (isLoggedIn) {
  // Si l'utilisateur est connecté, masquer le lien de connexion et afficher le lien de déconnexion
  loginLink.style.display = "none";
  logoutLink.style.display = "block";
} else {
  // Si l'utilisateur n'est pas connecté, afficher le lien de connexion et masquer le lien de déconnexion
  loginLink.style.display = "block";
  logoutLink.style.display = "none";
}

// Ajouter un gestionnaire d'événements au lien de déconnexion
logoutLink.addEventListener("click", function () {
  // Effacer le token et l'indicateur de connexion de sessionStorage
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("isLoggedIn");
  // Redirection vers la page de connexion après la déconnexion
  window.location.href = "login.html";
});


// Sélection des éléments nécessaires
const mark = document.querySelector(".fa-xmark");
const editBtn = document.querySelector(".edit-projets .edit");
const modal = document.getElementById("myModal");

// Ajout d'un gestionnaire d'événements pour le bouton "Modifier"
editBtn.addEventListener("click", () => {
  // Ouvrir la modale en affichant son contenu
  modal.style.display = "block";
});

// Ajout d'un gestionnaire d'événements pour le bouton de fermeture de la modale
mark.addEventListener("click", () => {
  // Fermer la modale en masquant son contenu
  modal.style.display = "none";
});

// Ajout d'un gestionnaire d'événements pour fermer la modale lors du clic sur la zone extérieure
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    // Si le clic se produit à l'extérieur de la modale, la fermer
    modal.style.display = "none";
  }
});


document.addEventListener("DOMContentLoaded", function () {
  const editModeBanner = document.getElementById("editModeBanner");
  const isLoggedIn = sessionStorage.getItem("isLoggedIn");

  if (isLoggedIn === "true") {
    editModeBanner.style.display = "block"; // Affiche la bannière si l'utilisateur est connecté
  } else {
    editModeBanner.style.display = "none"; // Masque la bannière sinon
  }
});




const itemsModal = document.getElementById("modal-content"); // Sélection de l'élément de la première page de la modale pour afficher les images

// Sélection de l'élément modal-content
const modalContent = document.getElementById("modal-content");



async function displayItemsModal() {
  const items = await getWorks();
  itemsModal.innerHTML = ""; // Efface le contenu précédent de la modale
  items.forEach((item) => {
    const figure = document.createElement("div");
    figure.classList.add("figure");
    const img = document.createElement("img");
    img.classList.add("modal-image"); // Ajoutez la classe pour redimensionner les images
    const span = document.createElement("span");
    span.classList.add("delete-icon"); // Ajoutez la classe pour styliser l'icône de la poubelle
    span.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    span.id = item.id; // Correction de l'attribut id
    img.src = item.imageUrl; // Correction du nom de la propriété
    figure.appendChild(img);
    figure.appendChild(span);
    itemsModal.appendChild(figure);
  });

  // Ajout des éléments supplémentaires à la première page de la modal
  const closeSpan = document.createElement("span");
  const closeIcon = document.createElement("i");
  closeIcon.classList.add("fa-solid", "fa-xmark");
  closeSpan.classList.add("close");
  closeSpan.appendChild(closeIcon);





// Création d'un élément de texte avec la classe CSS "texte-gallerie"
const texteGallerie = document.createElement("div");
texteGallerie.textContent = "Galerie photo";
texteGallerie.classList.add("texte-gallerie");

// Ajout de l'élément texte à l'intérieur de modal-content
modalContent.appendChild(texteGallerie);
  // Ajout d'un gestionnaire d'événements pour le clic sur la croix pour fermer la modale
  closeSpan.addEventListener("click", () => {
    modal.style.display = "none";
  });


  const deleteSpan = document.createElement("span");
  const deleteIcon = document.createElement("i");
  deleteIcon.classList.add("fa-solid", "fa-trash-can");
  deleteSpan.classList.add("delete-icon");
  deleteSpan.id = "delete";
  deleteSpan.appendChild(deleteIcon);

  const addButton = document.createElement("button");
  addButton.textContent = "Ajouter une photo";
  addButton.classList.add("boutton-ajouter");
  addButton.id = "add-photo-button";


  // Ajout de la bordure grise à l'intérieur de la première page de la modale
  const bordureGrise = document.createElement("div");
  bordureGrise.classList.add("bordure-grise");

  // Ajout des éléments à la modale
  itemsModal.appendChild(closeSpan);
  itemsModal.appendChild(bordureGrise); // Ajout de la bordure grise
  itemsModal.appendChild(addButton);

  addButton.addEventListener("click", () => {
    // Afficher la deuxième page de la modale
    const modalContentPageOne = document.getElementById("modal-content");
    const modalContentPageTwo = document.getElementById("modal-content-page-two");
    const modal = document.getElementById("myModal");

    if (modalContentPageOne && modalContentPageTwo && modal) {
      modalContentPageOne.style.display = "none"; // Cacher la première page
      modalContentPageTwo.style.display = "block"; // Afficher la deuxième page
      modal.style.display = "block"; // Afficher la modale
    } else {
      console.error("Les éléments modal-content-page-one, modal-content-page-two ou myModal n'ont pas été trouvés.");
    }
  });

  itemsModal.appendChild(closeSpan);

  itemsModal.appendChild(addButton);

  deleteWorks();
}

displayItemsModal(); // Correction de l'appel de fonction












// Suppression d'une image dans la modal
function deleteWorks() {
  const trashAll = document.querySelectorAll('.fa-trash-can'); // Sélectionner tous les icônes de la poubelle
  trashAll.forEach((trash) => {
    trash.addEventListener("click", (e) => {
      const id = e.target.parentElement.id; // Récupérer l'ID de l'image à supprimer
      const token = sessionStorage.getItem("token"); // Récupérer le token de l'utilisateur
      if (token) {
        const init = {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        };
        fetch("http://localhost:5678/api/works/" + id, init)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Erreur lors de la suppression de l'image");
            }
            return response.text(); // Retourner le texte de la réponse
          })
          .then((data) => {
            /* if (data.trim() !== "") {
              try {
                const jsonData = JSON.parse(data);
                    console.log("La suppression a réussi, voici la data :", jsonData);
              } catch (e) {

              }
            }
            displayItemsModal()
            displayItems()
 */
            if (data.trim() !== "") {
              // Traiter les données JSON si elles ne sont pas vides
              try {
                const jsonData = JSON.parse(data);
                console.log("La suppression a réussi, voici la data :", jsonData);
                // Mettre à jour les images dans la modale
                displayItemsModal();
                // Mettre à jour les images dans la galerie sur la page d'accueil
                displayItems();
              } catch (error) {
                console.error("Erreur lors de l'analyse de la réponse JSON :", error);
              }
            } else {
              console.log("La suppression a réussi mais la réponse est vide.");
              // Mettre à jour les images dans la modale
              displayItemsModal();
              // Mettre à jour les images dans la galerie sur la page d'accueil
              displayItems();
            }
          })
          .catch((error) => {
            console.error("Une erreur est survenue lors de la suppression :", error);
          });
      }
    });
  });
}


/*Gestion de la deuxième page*/



//Fermeture de la modale 2//

// Sélectionner l'élément de la croix dans la page 2 de la modale
const closeButtonPageTwo = document.querySelector('#modal-content-page-two .close');

// Ajouter un gestionnaire d'événements pour le clic sur la croix
closeButtonPageTwo.addEventListener('click', closeSecondModalPage);

// Définir la fonction pour fermer la page 2 de la modale
function closeSecondModalPage() {
  const modalContentPageOne = document.getElementById("modal-content");
  const modalContentPageTwo = document.getElementById("modal-content-page-two");
  const modal = document.getElementById("myModal");

  if (modalContentPageOne && modalContentPageTwo && modal) {
    modalContentPageOne.style.display = "block"; // Afficher à nouveau la première page
    modalContentPageTwo.style.display = "none"; // Cacher la deuxième page
    modal.style.display = "none"; // Cacher la modale

    // Change la couleur du bouton "Valider" en gris
    const validerButton = document.getElementById("submitValider");
    validerButton.style.backgroundColor = "gray";
    validerButton.style.color = "black";
  } else {
    console.error("Les éléments modal-content-page-one, modal-content-page-two ou myModal n'ont pas été trouvés.");
  }
}
// Sélectionner l'élément de la flèche dans la deuxième page de la modale
const backArrowPageTwo = document.getElementById('back-arrow-page-two');

// Ajouter un gestionnaire d'événements pour le clic sur la flèche
backArrowPageTwo.addEventListener('click', backToFirstModalPage); // Appeler la fonction backToFirstModalPage

// Définir la fonction pour revenir à la première page de la modale
function backToFirstModalPage() {
  console.log('Function lancée')
  const modalContentPageOne = document.getElementById("modal-content");
  const modalContentPageTwo = document.getElementById("modal-content-page-two");
  const modal = document.getElementById("myModal");
  console.log(modalContentPageOne)

  if (modalContentPageOne && modalContentPageTwo && modal) {
    console.log('Nous sommes dans le if')
    modalContentPageTwo.style.display = "none"; // Cacher la deuxième page
    modalContentPageOne.style.display = "grid"; // Afficher à nouveau la première page
    modal.style.display = "block"; // Afficher à nouveau la modale
  } else {
    console.error("Les éléments modal-content-page-one, modal-content-page-two ou myModal n'ont pas été trouvés.");
  }
}


let errorSizeImg; // Déclaration de la variable au niveau global
//gestion  du formulaire de la deuxième modal
//récupération de case-image
const addImgworks = document.querySelector(".case-image");

//récupération de content-addworks
const contentaddworks = document.querySelector(".content-addworks");

//création d'un élément image
const previewImgSelected = document.createElement("img");
previewImgSelected.id = "previewImgSelected"; // Ajouter un id à l'élément img

// récupération du bouton qui permet de mettre une image
const addImgBtn = document.getElementById("add-img-btn");


//gestionnaire d'évenemtn sur le boutton d'ajout d'image
addImgBtn.addEventListener("input", () => {
  const selectedImage = addImgBtn.files[0];
  const maxSizeInBytes = 4 * 1024 * 1024; // 4 Mo
  if (selectedImage.size > maxSizeInBytes) {
    //récupération de la span pour afficher un message d'erreur image trop grande
    const errorSizeImg = document.getElementById("message-erreur-taille-image");
    //ajout du texte dans la span
    errorSizeImg.textContent = "La taille de l'image ne doit pas dépasser 4 mo.";
    //réinialisation du champs image
    addImgBtn.value = "";// vide le champs image de la seconde modale

  } else {
    //création d'un objet URL pour l'image sélectionné
    const selectedImageUrl = URL.createObjectURL(selectedImage);

    //ajout de l'image sélectionné dans l'élément image créer
    previewImgSelected.src = selectedImageUrl;

    //ajout de la classe à l'élément image
    previewImgSelected.classList.add("preview-image");

    //masque le boutton d'ajout d'image 
    addImgworks.style.display = "none";

    //affchiche l'image
    contentaddworks.style.display = "block";

    contentaddworks.appendChild(previewImgSelected);
    addProject.textContent = ""; // vide le champs message
    errorSizeImg.textContent = ""

    //change la couleur du boutton valiser quand une image est sélestionné
    const validerButton = document.getElementById("submitValider");
    validerButton.style.backgroundColor = "#1d6154";
    validerButton.style.color = "white";
  }
});


// Gestionnaire d'événements sur le bouton "Ajouter"
addImgBtn.addEventListener("click", textaddImg); // Vide le champ message du formulaire
function textaddImg() {
  // Assurez-vous que errorSizeImg est défini avant d'essayer d'accéder à sa propriété textContent
  if (errorSizeImg) {
    errorSizeImg.textContent = "";
  } else {
    console.error("errorSizeImg is not defined or null");
  }
}


contentaddworks.addEventListener("click", closeimagework); // pour vider le champs image de la second modale
function closeimagework() {
  contentaddworks.style.display = "none"; //
  addImgworks.style.display = "flex";
}

 errorSizeImg = document.getElementById('message-erreur-taille-image');

addImgBtn.addEventListener("click", textaddImg); // vide le champs  message du formulaire
function textaddImg() {
  // Assurez-vous que errorSizeImg est défini avant d'essayer d'accéder à sa propriété textContent
  if (errorSizeImg) {
    errorSizeImg.textContent = "";
  } else {
    console.error("errorSizeImg is not defined or null");
  }
}

//catégories dynamique dans le formulaire d'envoie
function categoriesForm() {
  getCategories()
    .then((categories) => {
      const categorieSelect = document.getElementById("categorie");

      categories.forEach((category) => {
        //création des catégories
        const optionElement = document.createElement("option");
        optionElement.value = category.id;
        optionElement.textContent = category.name;

        //mettre les catégories des les options du formulaire
        categorieSelect.appendChild(optionElement);
      });

    })
    .catch((error) => {
      console.error(error);
    });

}

categoriesForm()


document.addEventListener("DOMContentLoaded", function () {
  // Code à exécuter une fois que le document est entièrement chargé

  // Sélection du formulaire d'ajout de travail
  const addWorkForm = document.getElementById("addWork");

  // Ajout d'un gestionnaire d'événements pour la soumission du formulaire
  addWorkForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Empêcher le comportement par défaut du formulaire


    // Récupération du token
    const token = sessionStorage.getItem("token");



    // Récupération des valeurs des champs du formulaire
    const title = document.getElementById("title").value;
    const category = document.getElementById("categorie").value;
    const image = document.getElementById("add-img-btn").files[0];

    // Validation des champs
    if (title.trim() === "" || category.trim() === "" || !image) {
      // Affichage d'un message d'erreur si des champs sont vides
      document.getElementById("addProject").textContent = "Tous les champs sont requis.";
      return;
    }

    // Création d'un objet FormData pour envoyer les données du formulaire
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("image", image);

    // Envoi de la requête POST avec fetch
    fetch("http://localhost:5678/api/works", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}` // Assurez-vous de définir correctement la variable token
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Erreur lors de l'ajout de l'œuvre.");
        }
        return response.json();
      })
      .then(data => {
        // Réinitialisation du formulaire et affichage d'un message de succès
        addWorkForm.reset();
        document.getElementById("addProject").textContent = "Projet ajouté avec succès.";


     // Réinitialisation du formulaire et affichage d'un message de succès
  addWorkForm.reset();
  document.getElementById("addProject").textContent = "Projet ajouté avec succès.";

  // Réinitialisation de l'image affichée
  document.getElementById("previewImgSelected").src = "";
  
  // Masquer la partie contenant l'image sélectionnée
  document.querySelector(".content-addworks").style.display = "none";

  // Affichage de la section pour ajouter une nouvelle image
  document.querySelector(".case-image").style.display = "flex";

        // Actualisation de l'affichage des travaux
        displayItemsModal();
        displayItems();
        displayFilterButtons();
      })
      .catch(error => {
        console.error(error);
        document.getElementById("addProject").textContent = "Une erreur est survenue lors de l'ajout du projet.";
      });
  });
});


