/* Selecting the elements from the HTML file. */
const listsContainer = document.querySelector('[data-lists]')
const newListForm = document.querySelector('[data-new-list-form]')
const newListInput = document.querySelector('[data-new-list-input]')
const deleteListButton = document.querySelector('[data-delete-list-button]')

/* Selecting the list elements from the HTML file. */
const listDisplayContainer = document.querySelector('[data-list-display-container]')
const listTitleElement = document.querySelector('[data-list-title]')
const listCountElement = document.querySelector('[data-list-count]')

/* Selecting the gratitude elements from the HTML file. */
const gratitudesContainer = document.querySelector('[data-gratitudes]')
const gratitudeTemplate = document.getElementById('gratitude-template')
const newGratitudeForm = document.querySelector('[data-new-gratitude-form]')
const newGratitudeInput = document.querySelector('[data-new-gratitude-input]')

/* This is setting up the local storage for the to-do list. */
const LOCAL_STORAGE_LIST_KEY = 'gratitude.lists'
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'gratitude.selectedListId'
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)

/* Add an event listener to the listsContainer. When the user clicks on the list, the selectedListId is set to the list that was clicked on. */
listsContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'li') {
    selectedListId = e.target.dataset.listId
    saveAndRender()
  }
})

/* Add an event listener to the gratitudesContainer. When the user clicks on the gratitude, the selectedGratitude is set to the gratitude that was clicked on. */
gratitudesContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'input') {
    const selectedList = lists.find(list => list.id === selectedListId)
    const selectedGratitude = selectedList.gratitudes.find(gratitude => gratitude.id === e.target.id)
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

/* This is adding an event listener for when the user submits the form. Then, the gratitudeName is set to
the value of the newGratitudeInput. If the gratitudeName is null or an empty string, the function returns.
Then, the gratitude is set to the createGratitude function. The newGratitudeInput is set to null. Then, the
selectedList is set to the lists array. Then, the selectedList.gratitudes array is pushed to the gratitude.
Then, the saveAndRender() function is called. */
newGratitudeForm.addEventListener('submit', e => {
  e.preventDefault()
  const gratitudeName = newGratitudeInput.value
  if (gratitudeName == null || gratitudeName === '') return
  const gratitude = createGratitude(gratitudeName)
  newGratitudeInput.value = null
  const selectedList = lists.find(list => list.id === selectedListId)
  selectedList.gratitudes.push(gratitude)
  saveAndRender()
})

/**
 * It takes a name and returns an object with an id, name, and an empty array of gratitudes
 * @param name - The name of the list.
 * @returns An object with an id, name, and gratitudes property.
 */
function createList(name) {
  return { id: Date.now().toString(), name: name, gratitudes: [] }
}

/**
 * Given a name, create a gratitude object with an id, name, and complete property.
 * @param name - The name of the gratitude.
 * @returns An object with an id, name, and complete property.
 */
function createGratitude(name) {
  return { id: Date.now().toString(), name: name, complete: false }
}

/**
 * SaveAndRender() saves the current state and then renders the content.
 */
function saveAndRender() {
  save()
  render()
}

/**
 * It saves the lists and the selected list id to local storage
 */
function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
}

/**
 * It clears the lists container, renders the lists, and then if there's a selected list, it clears the
 * gratitudes container, renders the gratitudes, and displays the list title and gratitude count
 */
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
    clearElement(gratitudesContainer)
    renderGratitudes(selectedList)
  }
}

/**
 * We're looping through the gratitudes in the selected list, creating a new gratitude element for each
 * one, and appending it to the DOM
 * @param selectedList - the list that was selected from the dropdown
 */
function renderGratitudes(selectedList) {
  selectedList.gratitudes.forEach(gratitude => {
    const gratitudeElement = document.importNode(gratitudeTemplate.content, true)
    const checkbox = gratitudeElement.querySelector('input')
    checkbox.id = gratitude.id
    checkbox.checked = gratitude.complete
    const label = gratitudeElement.querySelector('label')
    label.htmlFor = gratitude.id
    label.append(gratitude.name)
    gratitudesContainer.appendChild(gratitudeElement)
  })
}

/**
 * It takes a list as an argument, filters out the incomplete gratitudes, counts the remaining
 * gratitudes, and then updates the listCountElement with the number of gratitudes and the appropriate
 * pluralization
 * @param selectedList - the list that is currently selected
 */
function renderGratitudeCount(selectedList) {
  const incompleteGratitudeCount = selectedList.gratitudes.filter(gratitude => !gratitude.complete).length
  const gratitudeString = incompleteGratitudeCount === 1 ? "gratitude" : "gratitudes"
  listCountElement.innerText = `${incompleteGratitudeCount} ${gratitudeString} in this list`
}

/**
 * We're looping through each list in the lists array, creating a list element for each one, and
 * appending it to the lists container
 */
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

/**
 * It removes all the children of a given element
 * @param element - The element to clear.
 */
function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}

render()