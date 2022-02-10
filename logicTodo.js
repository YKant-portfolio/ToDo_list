import modals from "./modals.js";

const logicTodo = () => {
	// Globals
	const todoList = document.querySelector('#todo-list');
	const userSelect = document.querySelector('#user-todo');
	const form = document.querySelector('form');
	let todos = [];
	let users = [];

	// Attach Events 
	document.addEventListener('DOMContentLoaded', initApp);
	form.addEventListener('submit', handleSubmit);


	// Basic Logic
	function getUserName(userId) {
		const user = users.find((user) => user.id === userId);
		return user.name;
	}

	function printTodo({ id, userId, title, completed }) {
		const li = document.createElement('li');
		li.className = 'todo-item';
		li.dataset.id = id;
		li.innerHTML = `<span>${title} <em> by </em> <strong>${getUserName(userId)}</strong></span>`;

		const status = document.createElement('input');
		status.type = 'checkbox';
		status.checked = completed;
		status.addEventListener('change', handleTodoChange)

		const close = document.createElement('span');
		close.innerHTML = '&times;';
		close.className = 'close';
		close.addEventListener('click', handleClose)

		li.prepend(status);
		li.append(close);

		todoList.prepend(li);
	}

	function createUserOption(user) {
		const option = document.createElement('option');
		option.value = user.id;
		option.innerText = user.name;
		userSelect.append(option);
	}

	function removeTodo(todoId) {
		todos = todos.filter(todo => todo.id !== todoId);
		const todo = todoList.querySelector(`[data-id="${todoId}"]`);
		todo.querySelector('input').removeEventListener('change', handleTodoChange);
		todo.querySelector('.close').removeEventListener('click', handleClose);
		todo.remove();
	}


	// Event Logic
	function initApp() {
		Promise.all([getAllTodos(), getAllUsers()]).then(values => {
			[todos, users] = values;
			todos.forEach(todo => printTodo(todo));
			users.forEach(user => createUserOption(user))
		});
	}

	function handleSubmit(event) {
		event.preventDefault();
		createTodo({
			"userId": Number(form.user.value),
			"title": form.todo.value,
			"completed": false,
		});
		form.reset();
	}

	function handleTodoChange(event) {
		const target = event.target;
		const todoID = target.parentElement.dataset.id;
		const complited = target.checked;
		toggleTodoComplete(todoID, complited);
	}
	function handleClose() {
		const todoId = this.parentElement.dataset.id;
		deleteTodo(todoId);
	}
	function alertError(error) {
		modals(error.message);
	}

	// Acync ligic
	async function getAllTodos() {
		try {
			const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=10');
			const data = await response.json();
			return data;
		} catch (error) {
			alertError(error);
		}
	}

	async function getAllUsers() {
		try {
			const response = await fetch('https://jsonplaceholder.typicode.com/users?_limit=7');
			const data = await response.json();
			return data;
		} catch {
			alertError(error);
		}
	}

	async function createTodo(todo) {
		try {
			const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
				method: "POST",
				body: JSON.stringify(todo),
				headers: {
					'Content-Type': 'application/json',
				},
			});
			const newTodo = await response.json();
			console.log(newTodo);
			printTodo(newTodo);
		} catch (error) {
			alertError(error);
		}
	}

	async function toggleTodoComplete(todoId, completed) {
		try {
			const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
				method: "PATCH",
				body: JSON.stringify({ completed }),
				headers: {
					'Content-Type': 'application/json'
				},
			});
			if (!response.ok) {
				// Error
				throw new Error("Проблема с подключению к серверу ! поробуйте зайти позже");
			}
		} catch (error) {
			alertError(error);
		}
	}

	async function deleteTodo(todoId) {
		try {
			const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
				method: "DELETE",
				headers: {
					'Content-Type': 'application/json'
				},
			});
			if (response.ok) {
				removeTodo(todoId)
			} else {
				throw new Error("Ошибка: Нет соеденения с сервером! поробуйте зайти позже");
			}
		} catch (error) {
			alertError(error);
		}
	}
};

export default logicTodo;
