export default {
  /**
   * Get the value of the specific state variable
   * @param state
   * @param key
   * @returns {a state variable}
   */
  get: state => (key) => {
    return state[key]
  },
  isAuthenticated (state) {
    return state.auth.loggedIn
  },

  loggedInUser (state) {
    return state.auth.user
  }
}
