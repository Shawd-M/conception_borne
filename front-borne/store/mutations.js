export default {
  /**
   * update a state variable of store
   * @param state
   * @param key
   * @param value
   */

  update: (state, { key, value }) => {
    state[key] = value
  },
  /**
   * push item in a state of type array
   * @param state
   * @param key
   * @param value
   */
  pushItem (state, { key, item }) {
    state[key].push(item)
  },

  /**
   * add item in a state of type array in the first place
   * @param state
   * @param key
   * @param value
   */
  unshiftItem (state, { key, item }) {
    state[key].unshift(item)
  },
  /**
   * remove an item to the index position in a state of type array
   * @param state
   * @param key
   * @param value
   * @param index
   */
  removeItem (state, { key, index }) {
    state[key].splice(index, 1)
  },
  /**
   * replace an item to the index position by a new item in a state of type array
   * @param state
   * @param key
   * @param value
   * @param index
   * @param item
   */
  updateItem (state, { key, index, item }) {
    state[key].splice(index, 1, item)
  },
  /**
   * Increment a state variable of store
   * @param state
   * @param key
   */
  increment (state, key) {
    state[key]++
  },

  /**
   * Decremente a state variable of store
   * @param state
   * @param key
   */
  decrement (state, key) {
    state[key]--
  },

  /**
   * Toggle a state variable boolean of store
   * @param state
   * @param key
   */
  toggle (state, key) {
    state[key] = !state[key]
  },

  /**
   * Put update a state variable of store to null
   * @param state
   * @param key
   */
  remove (state, key) {
    state[key] = null
  },
  login (state) {
    state.auth.loggedIn = true
  },
  logout (state) {
    state.auth.loggedIn = false
  },
  /**
   * reset all state variable of store
   * @param state
   */
  reset: (state) => {
    for (const key in state) {
      switch (typeof state[key]) {
        case 'boolean':
          state[key] = false
          break
        case 'number':
          state[key] = 0
          break
        case 'object':
          state[key] = []
          break
        default:
          state[key] = null
          break
      }
    }
  }
}
