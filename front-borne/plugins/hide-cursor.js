// plugins/hide-cursor.js
export default function (ctx) {
  const vCardElements = document.querySelectorAll('.v-card')

  document.addEventListener('mousemove', (event) => {
    let isInsideVCard = false
    for (const vCardElement of vCardElements) {
      if (vCardElement.contains(event.target)) {
        isInsideVCard = true
        break
      }
    }
    document.body.classList.toggle('hide-cursor', !isInsideVCard)
  })
}
