// # 1. Подключаем API
const apiKey = '1';

// Получение коктейлей по первой букве
function fetchCocktailsByLetter(letter) {
  // URL для получения коктейлей, начинающихся с указанной буквы
  const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${letter}`;

  // Получение данных из API
  fetch(url)
    .then(response => {
      // Проверяем, корректен ли ответ
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Отображение полученных коктейлей
      displayCocktails(data.drinks);
    })
    .catch(error => {
      // Обработка ошибок при получении данных
      console.error('Ошибка при получении коктейлей:', error);
      alert(`Ошибка при получении данных: ${error}`);
    });
}

// # 2. Функция отображения полученных коктейлей

function displayCocktails(cocktails) {
  const cocktailList = document.querySelector('.cocktail-list');
  cocktailList.innerHTML = ''; // Очистка списка перед добавлением новых элементов

  // Проверяем, есть ли коктейли для отображения
  if (cocktails) {
    // Проходим по каждому коктейлю и создаем для него карточку
    cocktails.forEach(cocktail => {
      const cocktailCard = document.createElement('div');
      const currentTheme = body.classList.contains('light__theme')
        ? 'light__theme'
        : 'dark__theme';
      if (currentTheme === 'dark__theme') {
        cocktailCard.classList.add('cocktail-card');
        cocktailCard.classList.toggle('dark__theme');

        cocktailCard.innerHTML = `
        <img class="img__cocktails" src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
        <h3 class="cocktails__name">${cocktail.strDrink}</h3>
        <button class="add-to-favorites">Add to Favorites</button>
      `;

        // Добавляем карточку в список
        cocktailList.appendChild(cocktailCard);
      } else {
        cocktailCard.classList.add('cocktail-card');

        // Добавляем детали коктейля в карточку
        cocktailCard.innerHTML = `
        <img class="img__cocktails" src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
        <h3 class="cocktails__name">${cocktail.strDrink}</h3>
        <button class="add-to-favorites">Add to Favorites</button>
      `;

        // Добавляем карточку в список
        cocktailList.appendChild(cocktailCard);
      }

      // Добавляем обработчик события для кнопки "Add to Favorites"
      cocktailCard
        .querySelector('.add-to-favorites')
        .addEventListener('click', function () {
          addToFavorites(cocktail);
        });
    });
  } else {
    // Отображение сообщения, если коктейли не найдены
    cocktailList.innerHTML =
      '<p class="cocktails__notfound">Коктейли не найдены.</p>';
  }
}

// # 3. Обработчик событий для инпута и aлфавита

document.querySelector('.nav__input').addEventListener('input', function () {
  const query = this.value;
  const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${query}`;

  // Получение данных на основе поискового запроса
  fetch(url)
    .then(response => {
      // Проверяем, корректен ли ответ
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Отображение полученных коктейлей
      displayCocktails(data.drinks);
    })
    .catch(error => {
      // Обработка ошибок при получении данных
      console.error('Ошибка при получении коктейлей:', error);
    });
});

// Добавление обработчиков событий для букв алфавита
document.querySelectorAll('.hero__abc-item').forEach(item => {
  item.addEventListener('click', function () {
    const letter = this.textContent;
    fetchCocktailsByLetter(letter);
  });
});

// # 4. Функция для добавления коктейля в избранное

function addToFavorites(cocktail) {
  let favorites = JSON.parse(sessionStorage.getItem('favorites')) || [];

  // Проверяем, не добавлен ли уже коктейль в избранное
  const alreadyFavorite = favorites.some(
    favorite => favorite.idDrink === cocktail.idDrink
  );
  if (!alreadyFavorite) {
    // Добавляем коктейль в список избранных
    favorites.push(cocktail);
    sessionStorage.setItem('favorites', JSON.stringify(favorites));
    alert(`${cocktail.strDrink} добавлен в избранное`);
  } else {
    alert(`${cocktail.strDrink} уже в избранном`);
  }

  // Обновление отображения избранных коктейлей
  displayFavorites();
}

// # 5. Функция для удаления коктейлей из избранного

function removeFromFavorites(cocktailName) {
  let favorites = JSON.parse(sessionStorage.getItem('favorites')) || [];

  // Фильтруем коктейль для удаления
  favorites = favorites.filter(cocktail => cocktail.strDrink !== cocktailName);
  sessionStorage.setItem('favorites', JSON.stringify(favorites));

  // Обновление отображения избранных коктейлей
  displayFavorites();
}

// # 6. Функция для отображения избранных коктейлей

function displayFavorites() {
  const favoritesSection = document.querySelector('.favorites-section');
  favoritesSection.style.display = 'block'; // Убедимся, что секция видна
  const favoritesList = document.querySelector('.favorites-list');
  favoritesList.innerHTML = ''; // Очистка списка перед добавлением новых элементов

  let favorites = JSON.parse(sessionStorage.getItem('favorites')) || [];

  // Проверяем, есть ли избранные коктейли для отображения
  if (favorites.length > 0) {
    // Проходим по каждому избранному коктейлю и создаем для него карточку
    favorites.forEach(cocktail => {
      const cocktailCard = document.createElement('div');
      cocktailCard.classList.add('cocktail-card');

      // Добавляем детали коктейля в карточку
      cocktailCard.innerHTML = `
        <img class="img__cocktails" src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
        <h3 class="cocktails__name">${cocktail.strDrink}</h3>
        <button class="remove-from-favorites">Remove from favorites</button>
      `;

      // Добавляем карточку в список
      favoritesList.appendChild(cocktailCard);

      // Добавляем обработчик события для кнопки "Remove from Favorites"
      cocktailCard
        .querySelector('.remove-from-favorites')
        .addEventListener('click', function () {
          removeFromFavorites(cocktail.strDrink);
        });
    });
  } else {
    // Отображение сообщения, если нет избранных коктейлей
    favoritesList.innerHTML =
      '<p class="cocktails__notfound">Избранных коктейлей нет.</p>';
  }
}

// # 7. Отображение избранных при загрузке
document.addEventListener('DOMContentLoaded', displayFavorites);

// # 8. Обработчик событий на allFav, убираем все лишнее

document
  .getElementById('allFavoritesButton')
  .addEventListener('click', function () {
    displayFavorites();
    document.querySelector('.alphabet-section').style.display = 'none';
    document.querySelector('.cocktail-section').style.display = 'none';
  });

// #9. Dark Theme

// function changeTheme() {
//   const changeList = document.querySelectorAll(
//     '.toggle__theme, .nav__link, body, .hero__abc-item, .cocktails__notfound, .cocktail-card'
//   );

//   changeList.forEach(elem => {
//     elem.classList.toggle('dark__theme');
//   });
// }
const toggleEl = document.querySelectorAll(
  '.toggle__theme, .nav__link, body, .hero__abc-item, .cocktails__notfound, .cocktail-card'
);

const body = document.body;
function changeTheme() {
  const currentTheme = body.classList.contains('light__theme')
    ? 'light__theme'
    : 'dark__theme';
  const newTheme =
    currentTheme === 'light__theme' ? 'dark__theme' : 'light__theme';

  body.classList.remove(currentTheme);
  body.classList.add(newTheme);
  toggleEl.forEach(elem => elem.classList.remove(currentTheme));
  toggleEl.forEach(elem => elem.classList.add(newTheme));

  localStorage.setItem('theme', newTheme);
}

document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.body.classList.add(savedTheme);
    toggleEl.forEach(elem => elem.classList.add(savedTheme));
  } else {
    document.body.classList.add('light__theme');
    toggleEl.forEach(elem => elem.classList.add('light__theme'));
  }
});
