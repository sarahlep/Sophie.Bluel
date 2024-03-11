//*Opération en commun*//
function loadCategories() {
  fetch('http://localhost:5678/api/categories')
    .then(response => response.json())
    .then(data => {
      displayFilterButtons(data);
      displayCategoryDropdown(data); // Appel de la fonction pour afficher les catégories dans le menu déroulant
    })
    .catch(error => console.error('Erreur lors du chargement des catégories:', error));
}
loadItems();


function loadItems() {
  fetch('http://localhost:5678/api/works')
    .then(response => response.json())
    .then(data => {
      displayItems(data);
    })
    .catch(error => console.error('Erreur lors du chargement des éléments:', error));
}


function displayItems(items) {
  const itemList = document.getElementById('item-list');
  itemList.innerHTML = '';

  items.forEach(item => {
    itemList.innerHTML += `
      <div class="item" data-category="${item.category.name}">
        <img src="${item.imageUrl}" alt="${item.title}">
        <h3>${item.title}</h3>
        </div>`;
    });
  }

//*Mode connecté*//

adminMode();

function adminMode() {
    /**Check if a token is present in the sessionStorage */
    if (sessionStorage.getItem("token")) {
        const header = document.querySelector('header');
        const switchLogout = document.getElementById('logout');
        const switchLogin = document.getElementById('login');
        const portfolio = document.getElementById('portfolio');
        const titlemyProjets = document.createElement('h2');
       

        /**Create <div> edit mode content and insert at the beginning of the header */
        const editModeBar = `<div class="edit-mode">
        <i class="logo-edit fa-regular fa-pen-to-square"></i>
        <p>Mode édition</p>
        </div>`;
        header.style.marginTop = "88px";
        header.insertAdjacentHTML("afterbegin", editModeBar);

        /**change login text to switchLogout text */
        /* switchLogout.textContent = "logout";
        switchLogout.href = "#"; */
        switchLogin.classList.add("hidden");
        switchLogout.classList.remove("hidden");




        switchLogout.addEventListener("click", () => {
            /**Delete the session token and reload the page */
            sessionStorage.removeItem("token");
            location.reload();
        });

        /**Create a <div> container for toModified and title "Mes Projets" */
        const containerDivBtn = document.createElement("div");
        containerDivBtn.classList.add("edit-projets");
        /**Create the <di> link to edit projects */
        const btnToModified = `<div class="edit">
        <i class="fa-regular fa-pen-to-square"></i>
        <p>modifier</p>
        </div>`;

        /**Insert container before first portfolio item and move projects inside */
        portfolio.insertBefore(containerDivBtn, portfolio.firstChild);
        containerDivBtn.appendChild(titlemyProjets);
        /**Insert edit link after projects */
        titlemyProjets.insertAdjacentHTML("afterend", btnToModified);

        /**Hide category buttons */
        const categoriesButtonsFilter = document.querySelectorAll('.category-btn');
        categoriesButtonsFilter.forEach(button => {
            button.style.display = 'none';
        });

        /**Access to "modifier" */
        const editBtn = document.querySelector(".edit");
        if (editBtn) {
            /**If the element is found, add an event listener for the click */
            editBtn.addEventListener("click", openFirstModal);
        };


        const modalContainer = document.getElementById('myModal');
        const modalPageOneButton = document.getElementById('modal-page-one-button');
        const modalPageTwoButton = document.getElementById('modal-page-two-button');
        const modalContentPageOne = document.getElementById('modal-content-page-one');
        const modalContentPageTwo = document.getElementById('modal-content-page-two');
        
        // Fonction pour récupérer les travaux (par exemple depuis une API)
        async function getWorks() {
          try {
            const response = await fetch('http://localhost:5678/api/works');
            if (!response.ok) {
              throw new Error('Erreur lors de la récupération des travaux');
            }
            const data = await response.json();
            displayItems(data); // Afficher les travaux une fois récupérés
          } catch (error) {
            console.error('Erreur lors de la récupération des travaux:', error);
          }
        
          // Code pour récupérer les travaux depuis une API
        }
        function openFirstModal() {
          const modal = document.getElementById("myModal");
          modal.style.display = "block";

// Récupérer tous les éléments avec la classe "item"
const items = document.querySelectorAll('.item');


  // Charger les images dans la modale en passant les données nécessaires
  loadImagesIntoModal(items);
          
 // Sélectionnez toutes les icônes de poubelle ici, après que les images ont été chargées dans la modale
 const deleteIcons = document.querySelectorAll('.delete-icon');
 console.log(deleteIcons); // Vérifiez si les icônes de la poubelle sont correctement sélectionnées maintenant

 // Parcourez chaque icône de poubelle pour ajouter un gestionnaire d'événements
 deleteIcons.forEach(deleteIcon => {
   // Ajoutez un gestionnaire d'événements de clic
   deleteIcon.addEventListener('click', function() {
     console.log("L'élément avec l'ID a été cliqué :", this.id);
     // Vous pouvez ajouter ici la logique pour supprimer l'image associée
     // par exemple, en appelant une fonction deleteImage(this.id)
     // où this.id est l'ID de l'image associée à cette icône de la poubelle
 // Appelez la fonction deleteWork avec l'identifiant du travail à supprimer
 // Récupérez l'identifiant du travail à supprimer
 const workId = this.id;
 // Appelez la fonction deleteWork avec l'identifiant du travail à supprimer
 deleteWork(workId);
 // Supprimez l'élément parent (conteneur d'image) de la galerie modale
 this.parentElement.remove();
});
});
    
          const modalContent = document.querySelector('.modal-content');
          const addPhotoButton = document.createElement('button');
          addPhotoButton.id = "add-photo-button";
          addPhotoButton.classList.add('boutton-ajouter'); // Ajouter la classe ici
          addPhotoButton.textContent = "Ajouter une photo"; // Ajoutez cette ligne pour définir
          modalContent.appendChild(addPhotoButton);
        
          const closeSpan = document.createElement('span');
          closeSpan.classList.add('close');
          closeSpan.innerHTML = "&times;";
          modalContent.appendChild(closeSpan);
        
          closeSpan.addEventListener('click', closeFirstModal);
        
          // Ajouter un gestionnaire d'événements pour basculer la visibilité du bouton "Ajouter une photo"
          addPhotoButton.addEventListener('click', openSecondModalPage);
        }
        
        
        
        function closeFirstModal() {
          const modalContentPageOne = document.getElementById("modal-content");
          const modalContentPageTwo = document.getElementById("modal-content-page-two");
          const modal = document.getElementById("myModal");
        
          if (modalContentPageOne && modalContentPageTwo) {
            modalContentPageOne.style.display = "block"; // Afficher à nouveau la première page
            modalContentPageTwo.style.display = "none"; // Cacher la deuxième page
            modal.style.display = "none"; // Cacher la modal
          } else {
            console.error("Les éléments modal-content-page-one et modal-content-page-two n'ont pas été trouvés.");
          }
        }
        
        document.addEventListener("DOMContentLoaded", function() {
          const addPhotoButton = document.getElementById("add-photo-button");
          addPhotoButton.addEventListener("click", openSecondModalPage);
        });
        
        function openSecondModalPage() {
          const modalContentPageOne = document.getElementById("modal-content");
          const modalContentPageTwo = document.getElementById("modal-content-page-two");
          const addPhotoButton = document.getElementById("add-photo-button");
        
          if (modalContentPageOne && modalContentPageTwo && addPhotoButton) {
            modalContentPageOne.style.display = "none"; // Cacher la première page
            modalContentPageTwo.style.display = "block"; // Afficher la deuxième page
            addPhotoButton.classList.add('hidden'); // Masquer le bouton "Ajouter une photo"
            console.log("Button hidden:", addPhotoButton); // Vérifiez si le bouton est correctement sélectionné
          } else {
            console.error("Les éléments modal-content-page-one, modal-content-page-two ou add-photo-button n'ont pas été trouvés.");
          }
        }
        
        function loadImagesIntoModal(items) {
          const modalContent = document.querySelector('.modal-content');
          
          modalContent.innerHTML = '';
        
          let groupDiv;
        
          items.forEach(item => {
            const img = item.querySelector('img');
            if (img) {
              const imgContainer = document.createElement('div');
              imgContainer.classList.add('img-container');
        
              const modalImage = document.createElement('img');
              modalImage.src = img.src;
              modalImage.alt = img.alt;
              modalImage.classList.add('modal-image');
        
              const deleteIcon = document.createElement('span');
              deleteIcon.classList.add('delete-icon');
              deleteIcon.id = item.id; // Ajouter l'ID ici
              deleteIcon.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
        
              imgContainer.appendChild(modalImage);
              imgContainer.appendChild(deleteIcon);
              modalContent.appendChild(imgContainer);
            }
          });
        
          const modalImages = modalContent.querySelectorAll('.modal-image');
          modalImages.forEach(modalImage => {
            modalImage.style.width = '20%'; 
          });
        }
        


        
      async function deleteWork(id) {
        console.log('ID du travail à supprimer :', id); // Ajoutez cette ligne pour vérifier l'ID du travail à supprimer
          const token = sessionStorage.getItem("token")
          try {
            const response = await fetch(`http://localhost:5678/api/works/${id}`, {
              method: 'DELETE',
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                // Vous pouvez ajouter d'autres en-têtes si nécessaire, comme les autorisations d'authentification
              },
            });

            console.log('Réponse de la suppression :', response); // Ajoutez cette ligne pour vérifier la réponse de la suppression

            if (!response.ok) {
              alert("Le travail a bien été suprrimé")

 // Supprimer l'image du DOM
 const deletedImage = document.querySelector(`.delete-icon[id="${id}"]`);
 if (deletedImage) {
     deletedImage.parentElement.remove(); // Supprime le parent de l'icône de suppression (qui est normalement le conteneur de l'image)
 }

              let updatedWorks = await getWorks()
              console.log('Travaux mis à jour :', updatedWorks); // Ajoutez cette ligne pour vérifier les travaux mis à jou
      displayWorks(updatedWorks)
      displayModalGallery(updatedWorks)
            }
            console.log('Le travail a été supprimé avec succès');
            // Vous pouvez effectuer des actions supplémentaires après la suppression réussie, par exemple actualiser la liste des travaux
          } catch (error) {
            console.error('Erreur lors de la suppression du travail:', error);
          }
        
        // Code pour effacer un projet (work)
        };
        
        
        // Sélectionnez toutes les icônes de poubelle
        /* const deleteIcons = document.querySelectorAll('.bin-container'); */
        const deleteIcons = document.querySelectorAll('.delete-icon'); // undefined
        console.log(deleteIcons); // null
        
        // Parcourez chaque icône de poubelle pour ajouter un gestionnaire d'événements
        deleteIcons.forEach(deleteIcon => {
          // Ajoutez un gestionnaire d'événements de clic
          deleteIcon.addEventListener('click', function() {
            console.log("Le work avec l'id a été cliqué :", this.id)
            // Récupérez l'identifiant du travail à supprimer
            const workId = this.id;
            
            // Appelez la fonction deleteWork avec l'identifiant du travail à supprimer
            deleteWork(workId);
            
            // Supprimez l'élément parent (conteneur d'image) de la galerie modale
            this.parentElement.remove();
          });
        });
        
        
        
        
        /*Gestion de la deuxième page*/
        
        // Fonction pour charger les catégories et les afficher dans le menu déroulant
        function displayCategoryDropdown(categories) {
          const categoryDropdown = document.getElementById('categorie-dropdown');
          categoryDropdown.innerHTML = '';
        
          categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id; // Utilisez l'ID de la catégorie comme valeur
            option.textContent = category.name; // Utilisez le nom de la catégorie comme texte affiché
            categoryDropdown.appendChild(option);
          });
        }
        




    } else {
      loadCategories();


      
    }
}

/* Gestion des images et filtres */



function displayFilterButtons(categories) {
const filterButtonsDiv = document.getElementById('filter-buttons');
filterButtonsDiv.innerHTML = '';

filterButtonsDiv.innerHTML += `<button class="filter-btns" onclick="filterItems('all')">Tous</button>`;

categories.forEach(category => {
filterButtonsDiv.innerHTML += `<button class="filter-btns" onclick="filterItems(${category.id})">${category.name}</button>`;
});
}





function filterItems(categoryId) {
if (categoryId === 'all') {
loadItems();
} else {
fetch('http://localhost:5678/api/works')
  .then(response => response.json())
  .then(data => {
    const filteredItems = data.filter(item => item.category.id === categoryId);
    displayItems(filteredItems);
  })
  .catch(error => console.error('Erreur lors du filtrage des éléments:', error));
}
}












