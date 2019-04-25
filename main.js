/**
 * Code from professor. Altered to suit homework requirements.
 */

import { openDb, fetchTodos, createTodo, deleteTodo } from './database.js'

// Get references to the form elements.
const newTodoForm = document.getElementById('new-todo-form')
const newTodoInput = document.getElementById('new-todo')
const todoList = document.getElementById('todo-items')

// Handle new todo item form submissions.
newTodoForm.onsubmit = function() {
  // Get the todo text.
  const text = newTodoInput.value

  // Check to make sure the text is not blank (or just spaces).
  if (text.replace(/ /g, '') !== '') {
    // Create the todo item.
    createTodo(text, function(todo) {
      refreshTodos()
    })
  }

  // Reset the input field.
  newTodoInput.value = ''

  // Don't send the form.
  return false
}

window.onload = function() {
  // Display the todo items.
  openDb(refreshTodos)
}

// Update the list of todo items.
function refreshTodos() {
  fetchTodos(function(todos) {
    todoList.innerHTML = ''

    for (let index = todos.length - 1; index >= 0; index--) {
      // Read the todo items backwards (most recent first).
      const todo = todos[index]

      addTodo(todo)
    }
  })
}

function addTodo(todo) 
{
  // Delete button
  const li = document.createElement('li')
  li.id = 'todo-' + todo.timestamp
  const deleteButton = document.createElement('input')
  deleteButton.type = 'button'
  deleteButton.className = 'delete-Button'
  deleteButton.value = 'Delete'
  deleteButton.setAttribute('data-id', todo.timestamp)
  
  li.appendChild(deleteButton)

  // Setup an event listener for the deleteButton.
  deleteButton.addEventListener('click', function(e) {
    const id = parseInt(e.target.getAttribute('data-id'))

    deleteTodo(id, refreshTodos)
  })
  // Displays todo text. Not editable.
  const span = document.createElement("span")
  span.innerHTML = todo.text
  li.appendChild(span)

  // Input.
  const todoText = document.createElement('input')
  todoText.type = 'text'
  todoText.id = 'todoText-' + todo.timestamp
  todoText.value = todo.text
  todoText.setAttribute('data-id', todo.timestamp)

  // Edit button.
  const editButton = document.createElement('input')
  editButton.type = 'button'
  editButton.className = 'edit-button'
  editButton.value = 'Edit'
  editButton.setAttribute('data-id', todo.timestamp)

  todoList.appendChild(li)

  // Save button.
  const saveButton = document.createElement('input')
      saveButton.type = 'button'
      saveButton.className = 'saveButton'
      saveButton.value = 'Save'
      saveButton.setAttribute('save-id', todo.timestamp)
  
  // Setup event listener for editButton.
  editButton.addEventListener('click', function(e) 
    {
      const editID = parseInt(e.target.getAttribute('data-id'))

      // Editable text box appears once Edit button is clicked.
      li.appendChild(todoText)
      
      const editField = document.createElement('input')
      editField.type = 'text'
      editField.value = todo.text
      editButton.value = 'Edit'
      editField.setAttribute('data-id', todo.timestamp)

      li.replaceChild(editField, todoText)
      li.replaceChild(saveButton,editButton)      

      saveButton.addEventListener('click', function(e) 
      {
        
        const editTodo = editField.value
        
        // Check to make sure the text is not blank (or just spaces).
        if (editTodo.replace(/ /g, '') !== '') {
          // Create the todo item.
          createTodo(editTodo, function(todo) 
          {
            deleteTodo(editID, refreshTodos)
          })
        } else {
          deleteTodo(editID, refreshTodos)
        }
      })
    })
  // Displays edit button.
  li.appendChild(editButton)
}
