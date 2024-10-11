// middleware/userInfo.js
export default function ({ $auth, store }) {
  console.log(store.state.colorAdmin)
  // if ($auth.loggedIn) {
  //   const {restaurant: {restaurant_detail}} = $auth.user;
  //   if (store.state.colorText !== restaurant_detail.colorText ? restaurant_detail.colorText : 'white')
  //     store.commit('update', { key: 'colorText', value: restaurant_detail.colorText ? restaurant_detail.colorText : 'white' });
  //   if (store.state.colorAdmin !== restaurant_detail.colorAdmin ? restaurant_detail.colorAdmin : '#8BD78F')
  //     store.commit('update', { key: 'colorAdmin', value: restaurant_detail.colorAdmin ? restaurant_detail.colorAdmin : '#8BD78F' })
  // }
}
