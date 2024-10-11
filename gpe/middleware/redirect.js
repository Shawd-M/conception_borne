/**
 * Prevent a user from browsing the site if he is not logged in and
 * to return to the login page if he is already logged in
 * @param store
 * @param redirect
 * @param route
 */
export default function ({ store, redirect, route }) {
  if (store.state.auth.loggedIn) {
    if (mustBeRedirected(route, store)) {
      console.log(store.state.part)
      redirect(`/${store.state.part}`)
    }
  } else if (!route.name.includes('authentification')) {
    redirect('/authentification/login')
  }

}

/**
 * Check if the user should be redirected or not
 * @param store
 * @param route
 * @returns {boolean}
 */
function mustBeRedirected(route, store) {
  if (route.name === 'index' && store.state.part) {
    return true
  }

  return !!(
    !route.name ||
    route.name.includes('authentification/login')
  )
}