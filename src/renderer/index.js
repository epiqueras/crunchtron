/* global window, document */

const $ = document.querySelector.bind(document)

document.addEventListener('DOMContentLoaded', () => {
  // Set theme
  document.documentElement.classList.toggle('default', true)

  // Fix scroll the right section
  document.addEventListener('scroll', () => {
    const body = $('body')
    const top = body.scrollTop
    const bottom = body.scrollHeight - body.scrollTop - window.innerHeight
    const div = $('#welcome_right') || $('#sidebar')

    if (top > 65 + 20) {
      div.style.position = 'fixed'
      div.style.top = '81px'
      div.style.right = '-10px'
      if (bottom <= 60) {
        div.style.bottom = (60 - bottom) + 'px'
        div.style.top = 'initial'
      }
      return
    }

    div.style.position = 'initial'
  })
})
