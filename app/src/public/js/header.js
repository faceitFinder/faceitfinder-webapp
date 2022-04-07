const toggleMobileMenu = () => {
  const menu = document.querySelector('#mobile-menu')
  const closeButton = document.querySelector('#close-menu')
  const openButton = document.querySelector('#open-menu')
  menu.classList.toggle('hidden')
  closeButton.classList.toggle('hidden')
  openButton.classList.toggle('hidden')
}