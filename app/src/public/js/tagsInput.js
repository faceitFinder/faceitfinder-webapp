(function () {
  // Plugin Constructor
  const TagsInput = function (opts) {
    this.options = Object.assign(TagsInput.defaults, opts)
    this.init()
  }

  // Initialize the plugin
  TagsInput.prototype.init = function (opts) {
    this.options = opts ? Object.assign(this.options, opts) : this.options

    if (this.initialized)
      this.destroy()

    if (!(this.orignal_input = document.getElementById(this.options.selector))) {
      console.error("tags-input couldn't find an element with the specified ID")
      return this
    }

    this.arr = []
    this.wrapper = document.createElement('div')
    this.input = document.createElement('input')
    init(this)
    initEvents(this)

    this.initialized = true
    return this
  }

  // Add Tags
  TagsInput.prototype.addTag = function (string) {
    if (this.anyErrors(string)) return

    this.arr.push(string)
    const tagInput = this
    const tag = document.createElement('span')

    this.options.tagClass.split(' ').forEach(className => tag.classList.add(className))
    tag.innerText = string

    // Delete the tag when icon is clicked
    tag.addEventListener('click', function (e) {
      e.preventDefault()
      tagInput.deleteTag(this)
    })

    this.wrapper.insertBefore(tag, this.input)
    this.wrapper.insertBefore(this.input, tag)
    this.orignal_input.value = this.arr.join(',')

    this.wrapper.click()

    return this
  }

  // Delete Tags
  TagsInput.prototype.deleteTag = function (tag) {
    tag.remove()
    this.arr = this.arr.filter(item => item !== tag.innerText)
    this.orignal_input.value = this.arr.join(',')

    return this
  }

  // Make sure input string have no error with the plugin
  TagsInput.prototype.anyErrors = function (string) {
    if (this.options.max != null && this.arr.length >= this.options.max) {
      console.log('max tags limit reached')
      return true
    }
    if (string.length <= 0) return true
    return !this.options.duplicate && this.arr.includes(string)
  }

  // Add tags programmatically 
  TagsInput.prototype.addData = function (array) {
    const plugin = this
    array.forEach(string => plugin.addTag(string))
    return this
  }

  // Get the Input String
  TagsInput.prototype.getInputString = function () {
    return this.arr.join(',')
  }

  // Destroy the plugin
  TagsInput.prototype.destroy = function () {
    this.orignal_input.removeAttribute('hidden')

    delete this.orignal_input
    const self = this

    Object.keys(this).forEach(function (key) {
      if (self[key] instanceof HTMLElement) self[key].remove()
      if (key != 'options') delete self[key]
    })

    this.initialized = false
  }

  // Private function to initialize the tag input plugin
  function init(tags) {
    tags.wrapper.append(tags.input)
    tags.options.wrapperClass.split(' ').forEach(className => tags.wrapper.classList.add(className))
    tags.options.inputClass.split(' ').forEach(className => tags.input.classList.add(className))
    tags.orignal_input.setAttribute('hidden', 'true')
    tags.orignal_input.parentNode.insertBefore(tags.wrapper, tags.orignal_input)
  }

  // initialize the Events
  function initEvents(tags) {
    tags.wrapper.addEventListener('click', function () {
      tags.input.focus()
    })

    tags.input.addEventListener('keydown', function (e) {
      // Check if backspace
      if (e.keyCode == 8 && tags.input.value.length == 0)
        tags.deleteTag(tags.wrapper.querySelector('span:first-of-type'))
      const str = tags.input.value.trim()

      if (!!(~[9, 13, 188].indexOf(e.keyCode))) {
        e.preventDefault()
        tags.input.value = ""

        if (str != "") tags.addTag(str)
      }
    })
  }

  // Set All the Default Values
  TagsInput.defaults = {
    selector: '',
    wrapperClass: 'bg-gray-700 overflow-y-scroll scroll-y text-gray-300 rounded-md h-full p-2 flex justify-top flex-wrap overflow-hidden max-w-2xl h-72 content-start',
    inputClass: 'bg-inherit focus:outline-none w-full h-min m-1',
    tagClass: 'hover:bg-red-400 hover:font-medium bg-slate-600 text-white rounded-md px-2 py-1 m-1 text-ellipsis overflow-hidden max-w-full h-min cursor-pointer',
    max: 10,
    duplicate: false
  }

  window.TagsInput = TagsInput
})()

const search = new TagsInput({ selector: 'search' })

window.onload = () => {
  search.addData(document.getElementById('search').value.split(',').filter(item => item != ''))
}

const searchFormSubmit = (e) => {
  e.preventDefault()
  search.addTag(search.input.value.trim())
  search.input.value = ''
  e.target.submit()
}
