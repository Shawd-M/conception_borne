export default function ({ $auth }) {
  try {
    // Vérifie si $auth existe et si l'utilisateur est connecté
    if ($auth && $auth.loggedIn) {
      console.log($auth.user);
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des informations de l'utilisateur :", error);
  }
}
