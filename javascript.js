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

// Appeler loadCategories lorsque la page est chargée pour récupérer les catégories disponibles
document.addEventListener("DOMContentLoaded", function () {
  loadCategories(); // Appeler loadCategories lorsque la page est chargée
  adminMode(); // Appeler adminMode après avoir chargé les catégories
});


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
        <p class="modifier">modifier</p>
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








    

    function openFirstModal() {
      const modal = document.getElementById("myModal");
      modal.style.display = "block";


      // Appel de loadCategories pour afficher les catégories dans la liste déroulante de la modale
      loadCategories();

      // Récupérer tous les éléments avec la classe "item"
      const items = document.querySelectorAll('.item');


      // Charger les images dans la modale en passant les données nécessaires
      loadImagesIntoModal(items);


      deleteWork()


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

    document.addEventListener("DOMContentLoaded", function () {
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
    
      items.forEach((item, index) => {
        if (index % 5 === 0) {
          groupDiv = document.createElement('div');
          groupDiv.classList.add('image-row');
          modalContent.appendChild(groupDiv);
        }
    
        const img = item.querySelector('img');
        if (img) {
          const imgContainer = document.createElement('div');
          imgContainer.classList.add('img-container');
          imgContainer.dataset.workId = item.id; // Définir data-work-id avec l'ID de l'élément de travail
    
          const modalImage = document.createElement('img');
          modalImage.src = img.src;
          modalImage.alt = img.alt;
          modalImage.classList.add('modal-image');
    
          const deleteIcon = document.createElement('span');
          deleteIcon.classList.add('delete-icon');
          deleteIcon.id = `delete-icon-${item.id}`; // Ajouter un ID unique basé sur l'ID de l'élément
          deleteIcon.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    
          imgContainer.appendChild(modalImage);
          imgContainer.appendChild(deleteIcon);
          groupDiv.appendChild(imgContainer);
        }
      });
    
      const modalImages = modalContent.querySelectorAll('.modal-image');
      modalImages.forEach(modalImage => {
        modalImage.style.width = '20%'; // Ajustez la largeur selon vos besoins
      });
    }

    //*supression image*/

    function deleteWork() {
      const deleteIcons = document.querySelectorAll('.delete-icon');
      console.log(deleteIcons);
      const token = sessionStorage.getItem("token");

      deleteIcons.forEach(deleteIcon => {
        deleteIcon.addEventListener("click", (e) => {
         const id = deleteIcon.id // Récupérer l'ID de l'élément de travail à partir de l'ID de l'icône de suppression
          console.log(id)
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
                console.log("Le delete n'a pas marché");
                throw new Error("Le delete n'a pas marché");
              }
              // Ne pas essayer de lire la réponse en tant que JSON si elle est vide
              if (response.status === 204) {
                console.log("Le delete a réussi");
                loadItems(); // Mettre à jour la galerie après la suppression
                deleteImageFromModal(id); // Supprimer l'image de la modale
                return; // Sortir de la fonction après avoir effectué la suppression
              }
              return response.json(); // Sinon, lire la réponse en tant que JSON
            })
            .then((data) => {
              console.log("Le delete a reussi voici la data :",data)
              displayItems()
              loadImagesIntoModal()
              deleteImageFromModal()
            })
            .catch((error) => {
              console.error("Erreur lors de la suppression:", error);
            });
        });
      });
    }

    function deleteImageFromModal(id) {
      const deletedImageContainer = document.querySelector(`.img-container[data-work-id="${id}"]`);
      if (deletedImageContainer) {
        const modalContent = document.querySelector('.modal-content');
        modalContent.removeChild(deletedImageContainer); // Supprimer le conteneur de l'image

        // Supprimer l'image correspondante de la galerie
        const galleryImage = document.querySelector(`#item-list .item[data-work-id="${id}"]`);
        if (galleryImage) {
          galleryImage.parentNode.removeChild(galleryImage);
        }
      }
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
      } else {
        console.error("Les éléments modal-content-page-one, modal-content-page-two ou myModal n'ont pas été trouvés.");
      }
    }


    // Sélectionner l'élément de la flèche dans la deuxième page de la modale
    const backArrowPageTwo = document.getElementById('back-arrow-page-two');

    // Ajouter un gestionnaire d'événements pour le clic sur la flèche
    backArrowPageTwo.addEventListener('click', backToFirstModalPage);

    // Définir la fonction pour revenir à la première page de la modale
    function backToFirstModalPage() {
      const modalContentPageOne = document.getElementById("modal-content");
      const modalContentPageTwo = document.getElementById("modal-content-page-two");
      const modal = document.getElementById("myModal");

      if (modalContentPageOne && modalContentPageTwo && modal) {
        modalContentPageOne.style.display = "block"; // Afficher à nouveau la première page
        modalContentPageTwo.style.display = "none"; // Cacher la deuxième page
        modal.style.display = "block"; // Afficher à nouveau la modale
      } else {
        console.error("Les éléments modal-content-page-one, modal-content-page-two ou myModal n'ont pas été trouvés.");
      }
    }






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

    // Appeler loadCategories lorsque la page est chargée pour récupérer les catégories disponibles
    document.addEventListener("DOMContentLoaded", function () {
      loadCategories();
    });

    // Fonction pour charger les catégories disponibles
    function loadCategories() {
      fetch('http://localhost:5678/api/categories')
        .then(response => response.json())
        .then(data => {
          displayCategoryDropdown(data); // Afficher les catégories dans le menu déroulant
        })
        .catch(error => console.error('Erreur lors du chargement des catégories:', error));
    }






    // Fonction pour envoyer le formulaire
    function submitForm(event) {
      event.preventDefault();

      const title = document.getElementById('form__title').value;
      const imageInput = document.getElementById('form__image');
      const token = sessionStorage.getItem("token");
      const allWorks = []; // Garder une liste de tous les travaux pour faciliter le filtrage

      const categoryDropdown = document.getElementById('categorie-dropdown');
      const category = parseInt(categoryDropdown.value); // Extract the selected category value


      if (!token) {
        alert('Vous devez être connecté pour effectuer cette action.')
        return
      }

      const formData = new FormData()
      formData.append('title', title)
      formData.append('category', category)

      if (imageInput.files.length > 0) {
        formData.append('image', imageInput.files[0])
      } else {
        alert('Veuillez sélectionner un fichier image.')
        return
      }

      fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erreur lors de l'envoi de l'image : " + response.statusText)
          }
          return response.json()
        })
        .then((result) => {
          console.log(result)
          /* 
          {
            imageUrl: "http",
            "title": 
          }
           */
          event.target.reset() // Reset le formulaire
          // Réinitialiser la source de l'image de prévisualisation
          document.getElementById('previewImage').src = ''

          // Ajoutez la nouvelle œuvre à la liste allWorks
          allWorks.push(result)

          // Rafraîchir l'affichage de la galerie avec les nouvelles données
          loadItems(); // Mettre à jour la galerie après la suppression
          /* const nouveauWork = `<figure></figure>` */
        })
        .catch((error) => {
          console.error("Erreur lors de l'envoi de l'image :", error)
          alert("Erreur lors de l'envoi de l'image : " + error.message)
        })
    }

    // Écouteur d'événements pour la prévisualisation de l'image
    document.getElementById('form__image').addEventListener('change', function () {
      const file = this.files[0]
      if (file && file.type.match('image.*')) {
        if (file.size <= 4 * 1024 * 1024) {
          // Vérifier que la taille du fichier est inférieure ou égale à 4 Mo
          const reader = new FileReader()
          reader.onload = function (e) {
            const previewImage = document.getElementById('previewImage')
            previewImage.src = e.target.result

            // Réinitialiser le padding à 0
            const dialogContentNewPhoto = document.querySelector('.dialog__content__new__photo')
            dialogContentNewPhoto.style.padding = '0px'

            document.querySelector('.content__add__form').style.display = 'none'
            previewImage.style.display = 'block'
          }
          reader.readAsDataURL(file)
        } else {
          alert("La taille de l'image ne doit pas dépasser 4 Mo.")
          // Réinitialiser l'élément d'entrée de fichier si la taille est trop grande
          this.value = ''
        }
      }

      // Écouteur d'événements pour la soumission du formulaire
      document.getElementById('dialog__edit__work__form').addEventListener('submit', function (e) {
        e.preventDefault() // Empêche la soumission du formulaire
        const contentAdd = document.querySelector('.content__add__form')
        contentAdd.style.display = ''

        const previewImage = document.getElementById('previewImage')
        previewImage.style.display = 'none' // Cacher l'élément #previewImage

        const dialogContentNewPhoto = document.querySelector('.dialog__content__new__photo')
        dialogContentNewPhoto.style.padding = '' // Réinitialiser le padding
      })

      // Écouteur d'événements pour soumettre le formulaire
      document.getElementById('dialog__edit__work__form').addEventListener('submit', submitForm)
      document.getElementById('form__image').addEventListener('change', updateSubmitButton)
      document.getElementById('form__title').addEventListener('input', updateSubmitButton)

      function updateSubmitButton() {
        const file = document.getElementById('form__image').files[0]
        const title = document.getElementById('form__title').value
        const submitButton = document.getElementById('submit_new_work')

        // Vérifier si le fichier est une image et si le titre est rempli
        if (file && title.trim() !== '') {
          submitButton.style.backgroundColor = '#1d6154'
        } else {
          submitButton.style.backgroundColor = '' // Revenir au style par défaut
        }
      }
    })




  } else {
    loadCategories();



  }
}

/* Gestion des images et filtres */



function displayFilterButtons(categories) {
  const filterButtonsDiv = document.getElementById('filter-buttons');
  filterButtonsDiv.innerHTML = '';

  // Vérifier si l'utilisateur est connecté
  const isUserLoggedIn = sessionStorage.getItem("token");

  // Si l'utilisateur n'est pas connecté, afficher les boutons de filtre
  if (!isUserLoggedIn) {
    filterButtonsDiv.innerHTML += `<button class="filter-btns" onclick="filterItems('all')">Tous</button>`;

    categories.forEach(category => {
      filterButtonsDiv.innerHTML += `<button class="filter-btns" onclick="filterItems(${category.id})">${category.name}</button>`;
    });
  }
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


