document.addEventListener('DOMContentLoaded', function() {
const userIdInput = document.getElementById('userIdInput');
const getTasksBtn = document.getElementById('getTasksBtn');
const resultDiv = document.getElementById('result');
            
            
getTasksBtn.addEventListener('click', fetchTasks);
            
         
userIdInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
       fetchTasks();
        }
    });
            
function fetchTasks() {
    const userId = userIdInput.value.trim();
                
                // проверка введенного числа
    if (!userId || userId < 1 || userId > 10) {
        showError('Пожалуйста, введите корректный ID пользователя (от 1 до 10)');
        return;
    }
                
             
    showLoading();
                
                // отправка запроса
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}/todos`)
        .then(response => {
                      
            if (response.status === 404) {
                throw new Error('Пользователь с указанным id не найден');
            }
            if (!response.ok) {
                throw new Error('Произошла ошибка при получении данных');
            }
            return response.json();
        })
        .then(tasks => {
            // проверка наличия задач
            if (tasks && tasks.length > 0) {
                displayTasks(userId, tasks);
            } else {
              
                showError('Пользователь с указанным id не найден');
            }
        })
        .catch(error => {
            showError(error.message);
        });
}
            
function showLoading() {
    resultDiv.innerHTML = '<div class="loading">Загрузка данных...</div>';
    getTasksBtn.disabled = true;
    getTasksBtn.textContent = 'Загрузка...';
}
            
function displayTasks(userId, tasks) {
   
    const userInfo = document.createElement('div');
    userInfo.className = 'user-info';
    userInfo.innerHTML = `<strong>Пользователь ID: ${userId}</strong> - найдено ${tasks.length} задач`;
                
    // Список задач
    const taskList = document.createElement('ul');
    taskList.className = 'task-list';
                
    
    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
                    
       
        const checkbox = document.createElement('span');
        checkbox.textContent = task.completed ? '✅ ' : '⏳ ';
        checkbox.style.marginRight = '8px';
                    
        taskItem.appendChild(checkbox);
        taskItem.appendChild(document.createTextNode(task.title));
                    
        taskList.appendChild(taskItem);
    });
                
    // обновление данных
    resultDiv.innerHTML = '';
    resultDiv.appendChild(userInfo);
    resultDiv.appendChild(taskList);
                
    // кнопка снова готова к работе
    resetButton();
}
            
function showError(message) {
    resultDiv.innerHTML = `<div class="error">${message}</div>`;
    resetButton();
}
            
function resetButton() {
    getTasksBtn.disabled = false;
    getTasksBtn.textContent = 'Получить список задач';
}

    });