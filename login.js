let password;


document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Empêcher le formulaire d'être soumis normalement

  // Récupérer les valeurs des champs du formulaire
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;

  // Utiliser les valeurs récupérées
  console.log("Email:", email);
  console.log("Mot de passe:", password);

  // Envoyer les données du formulaire à votre API d'authentification via une requête AJAX
  fetch('http://localhost:5678/api/users/login', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          email: email,
          password: password
      })
  })
  .then(response => {
      if (response.ok) {
          // Si la connexion est réussie, récupérez les données de la réponse
          return response.json();
      } else if (response.status === 404) {
          // Si l'utilisateur n'est pas trouvé, affichez un message d'erreur approprié
          throw new Error('Utilisateur non trouvé');
      } else {
          // Si une autre erreur se produit, affichez un message d'erreur générique
          throw new Error('Erreur lors de la connexion');
      }
  })
  .then(data => {
      // Stocker le token dans sessionStorage
      sessionStorage.setItem("token", data.token);
       // Stocker un indicateur de connexion réussie dans sessionStorage
    sessionStorage.setItem("isLoggedIn", true);
      // Redirection vers la page d'accueil si la connexion est confirmée
      window.location.href = 'index.html';
  })
  .catch(error => {
      // Afficher le message d'erreur dans le formulaire
      document.getElementById('error-message').innerText = error.message;
  });
});