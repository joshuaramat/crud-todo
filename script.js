/* Selecting the elements from the HTML file. */
const listsContainer = document.querySelector('[data-lists]')
const newListForm = document.querySelector('[data-new-list-form]')
const newListInput = document.querySelector('[data-new-list-input]')
const deleteListButton = document.querySelector('[data-delete-list-button]')

/* Selecting the list elements from the HTML file. */
const listDisplayContainer = document.querySelector('[data-list-display-container]')
const listTitleElement = document.querySelector('[data-list-title]')
const listCountElement = document.querySelector('[data-list-count]')

/* Selecting the Gratitude elements from the HTML file. */
const GratitudesContainer = document.querySelector('[data-Gratitudes]')
const GratitudeTemplate = document.getElementById('Gratitude-template')
const newGratitudeForm = document.querySelector('[data-new-Gratitude-form]')
const newGratitudeInput = document.querySelector('[data-new-Gratitude-input]')

/* This is setting up the local storage for the to-do list. */
const LOCAL_STORAGE_LIST_KEY = 'Gratitude.lists'
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'Gratitude.selectedListId'
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)

/* Add an event listener to the listsContainer. When the user clicks on the list, the selectedListId is set to the list that was clicked on. */
listsContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'li') {
    selectedListId = e.target.dataset.listId
    saveAndRender()
  }
})

/* Add an event listener to the GratitudesContainer. When the user clicks on the Gratitude, the selectedGratitude is set to the Gratitude that was clicked on. */
GratitudesContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'input') {
    const selectedList = lists.find(list => list.id === selectedListId)
    const selectedGratitude = selectedList.Gratitudes.find(Gratitude => Gratitude.id === e.target.id)
    selectedGratitude.complete = e.target.checked
    save()
    renderGratitudeCount(selectedList)
  }
})

/* This is filtering out the list that is not selected. */
deleteListButton.addEventListener('click', e => {
  lists = lists.filter(list => list.id !== selectedListId)
  selectedListId = null
  saveAndRender()
})

/* Add an event listener for when the user submits the form. Then, the listName is set to the value of the newListInput. If the listName is null or an empty string, the function returns. Then, the list is set to the createList function. The newListInput is set to null. Then, the lists array is pushed to the list. Then, the saveAndRender() function is called. */
newListForm.addEventListener('submit', e => {
  e.preventDefault()
  const listName = newListInput.value
  if (listName == null || listName === '') return
  const list = createList(listName)
  newListInput.value = null
  lists.push(list)
  saveAndRender()
})

/* This is adding an event listener for when the user submits the form. Then, the GratitudeName is set to
the value of the newGratitudeInput. If the GratitudeName is null or an empty string, the function returns.
Then, the Gratitude is set to the createGratitude function. The newGratitudeInput is set to null. Then, the
selectedList is set to the lists array. Then, the selectedList.Gratitudes array is pushed to the Gratitude.
Then, the saveAndRender() function is called. */
newGratitudeForm.addEventListener('submit', e => {
  e.preventDefault()
  const GratitudeName = newGratitudeInput.value
  if (GratitudeName == null || GratitudeName === '') return
  const Gratitude = createGratitude(GratitudeName)
  newGratitudeInput.value = null
  const selectedList = lists.find(list => list.id === selectedListId)
  selectedList.Gratitudes.push(Gratitude)
  saveAndRender()
})

function createList(name) {
  return { id: Date.now().toString(), name: name, Gratitudes: [] }
}

function createGratitude(name) {
  return { id: Date.now().toString(), name: name, complete: false }
}

function saveAndRender() {
  save()
  render()
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
}

function render() {
  clearElement(listsContainer)
  renderLists()

  const selectedList = lists.find(list => list.id === selectedListId)
  if (selectedListId == null) {
    listDisplayContainer.style.display = 'none'
  } else {
    listDisplayContainer.style.display = ''
    listTitleElement.innerText = selectedList.name
    renderGratitudeCount(selectedList)
    clearElement(GratitudesContainer)
    renderGratitudes(selectedList)
  }
}

function renderGratitudes(selectedList) {
  selectedList.Gratitudes.forEach(Gratitude => {
    const GratitudeElement = document.importNode(GratitudeTemplate.content, true)
    const checkbox = GratitudeElement.querySelector('input')
    checkbox.id = Gratitude.id
    checkbox.checked = Gratitude.complete
    const label = GratitudeElement.querySelector('label')
    label.htmlFor = Gratitude.id
    label.append(Gratitude.name)
    GratitudesContainer.appendChild(GratitudeElement)
  })
}

function renderGratitudeCount(selectedList) {
  const incompleteGratitudeCount = selectedList.Gratitudes.filter(Gratitude => !Gratitude.complete).length
  const GratitudeString = incompleteGratitudeCount === 1 ? "gratitude" : "gratitudes"
  listCountElement.innerText = `${incompleteGratitudeCount} ${GratitudeString} in this list`
}

function renderLists() {
  lists.forEach(list => {
    const listElement = document.createElement('li')
    listElement.dataset.listId = list.id
    listElement.classList.add("list-name")
    listElement.innerText = list.name
    if (list.id === selectedListId) {
      listElement.classList.add('active-list')
    }
    listsContainer.appendChild(listElement)
  })
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}

render()