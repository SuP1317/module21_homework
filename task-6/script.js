document.addEventListener('DOMContentLoaded', function() {
   
const pageInput = document.getElementById('pageInput');
const limitInput = document.getElementById('limitInput');
const requestBtn = document.getElementById('requestBtn');
const errorMessage = document.getElementById('errorMessage');
const loading = document.getElementById('loading');
const gallery = document.getElementById('gallery');
const info = document.getElementById('info');
            

const STORAGE_KEY = 'lastSuccessfulRequest';
            

showSavedImages();
            

requestBtn.addEventListener('click', makeRequest);
            
pageInput.addEventListener('keypress', handleEnterKey);
limitInput.addEventListener('keypress', handleEnterKey);
            
function handleEnterKey(e) {
    if (e.key === 'Enter') {
        makeRequest();
    }
}
            
function makeRequest() {
    
    const page = pageInput.value.trim();
    const limit = limitInput.value.trim();
                
 
    const validation = validateInputs(page, limit);
                
    if (!validation.isValid) {
        showError(validation.message);
        return;
    }
                
   
    hideError();
                
    // индикатор загрузки
    showLoading(true);
                
    //  URL запрос
    const url = `https://jsonplaceholder.typicode.com/photos?_page=${page}&_limit=${limit}`;
                
    // 
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка сети или сервера');
            }
            return response.json();
        })
   .then(images => {
       if (images && images.length > 0) {
           displayImages(images);
           saveToLocalStorage(images, page, limit);
        
       }
   })
        .catch(error => {
            showError('Произошла ошибка при загрузке изображений: ' + error.message);
        })
        .finally(() => {
       
            showLoading(false);
        });
}
            
function validateInputs(page, limit) {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
                
    const isPageValid = !isNaN(pageNum) && pageNum >= 1 && pageNum <= 10;
    const isLimitValid = !isNaN(limitNum) && limitNum >= 1 && limitNum <= 10;
                
    if (!isPageValid && !isLimitValid) {
        return {
            isValid: false,
            message: 'Номер страницы и лимит вне диапазона от 1 до 10'
        };
    }
                
    if (!isPageValid) {
        return {
            isValid: false,
            message: 'Номер страницы вне диапазона от 1 до 10'
        };
    }
                
    if (!isLimitValid) {
        return {
            isValid: false,
            message: 'Лимит вне диапазона от 1 до 10'
        };
    }
                
    return {
        isValid: true,
        message: ''
    };
}
            
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    gallery.innerHTML = '';
    info.textContent = '';
}
            
function hideError() {
    errorMessage.classList.remove('show');
    errorMessage.textContent = '';
}
            
function showLoading(show) {
    if (show) {
        loading.classList.add('show');
        requestBtn.disabled = true;
        requestBtn.textContent = 'Загрузка...';
    } else {
        loading.classList.remove('show');
        requestBtn.disabled = false;
        requestBtn.textContent = 'Запрос';
    }
}
            
function displayImages(images) {
    gallery.innerHTML = '';
                
    if (!images || images.length === 0) {
        gallery.innerHTML = '<div class="info">Изображения не найдены</div>';
        return;
    }
                
    images.forEach(image => {
        const card = document.createElement('div');
        card.className = 'card';
                    
      card.innerHTML = `
    <img src="${image.url}" alt="${image.title}">
    <div class="card-content">
        <div class="card-title">${image.title}</div>
        <div class="card-id">ID: ${image.id}, Альбом: ${image.albumId}</div>
    </div>
`;      
        gallery.appendChild(card);
    });
}
            
function saveToLocalStorage(images, page, limit) {
    const data = {
        images: images,
        page: page,
        limit: limit
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
            
function showSavedImages() {
    const savedData = localStorage.getItem(STORAGE_KEY);
    
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            
            pageInput.value = data.page || 1;
            limitInput.value = data.limit || 5;
            
            if (data.images && data.images.length > 0) {
                displayImages(data.images);
                
            }
            
        } catch (error) {
            console.error('Ошибка при чтении данных из localStorage:', error);
            localStorage.removeItem(STORAGE_KEY);
        }
    }
}
})

            

        