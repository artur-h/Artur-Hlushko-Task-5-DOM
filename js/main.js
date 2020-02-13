'use strict';

class Pizza {
  constructor(name, ingredients, calories, price) {
    this.name = name;
    this.ingredients = ingredients;
    this.calories = calories;
    this.price = price;
  }
}

let pizzaList = [];
for (let key in menu) {
  let findProperty = propertyName => {
    for (let keyInner in menu[key]) {
      if (keyInner === propertyName) return menu[key][keyInner];
    }
  };

  pizzaList.push(new Pizza(
    key,
    findProperty('ingredients'),
    findProperty('calories'),
    findProperty('price'),
  ));
}

let container = document.createElement('div');
container.className = 'container';
document.body.prepend(container);

let createList = (array = pizzaList) => {
  let pizzaWrapper = document.createElement('div');
  pizzaWrapper.setAttribute('id', 'is-list');
  pizzaWrapper.className = 'pizza-wrapper';

  let ul = document.createElement('ul');

  for (let i = 0; i < array.length; i++) {
    let li = document.createElement('li');
    li.innerText = `${array[i].name} - ${array[i].price}`;
    ul.append(li);
  }

  pizzaWrapper.append(ul);
  container.append(pizzaWrapper);
};

let createListFilters = () => {
  let filterWrapper = document.createElement('div');
  filterWrapper.setAttribute('id', 'list-filters');
  filterWrapper.className = 'list-filters';
  filterWrapper.innerHTML = `
    <label>Сортировать по:
      <select id="selectFilter" onchange="filterList(this)">
        <option id="emptyOption" value="empty" style="display: none"></option>
        <option value="sortByPrice">цене по убыванию</option>
        <option value="sortByPriceReverse">цене по возрастанию</option>
        <option value="sortByAlphabet">названию</option>
        <option value="sortByAlphabetReverse">названию в обратном порядке</option>
      </select>
    </label>
  `;

  container.append(filterWrapper);
};

function filterList(e) {
  let pizzaNameArray = [];

  for (let i = 0; i < pizzaList.length; i++) {
    pizzaNameArray.push(pizzaList[i]);
  }

  if (e.value === 'sortByPrice' || e.value === 'sortByPriceReverse') return sortByPrice();
  if (e.value === 'sortByAlphabet') pizzaNameArray.sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    } else {
      return -1;
    }
  });
  if (e.value === 'sortByAlphabetReverse') pizzaNameArray.sort((a, b) => {
    if (a.name > b.name) {
      return -1;
    } else {
      return 1;
    }
  });

  let list = document.getElementById('is-list');
  list.remove();
  createList(pizzaNameArray);

  let cancelListFilterBtn = document.getElementById('cancel-list-filter');
  if (!cancelListFilterBtn) createCancelListFilterBtn();
}

let createGrid = (array = pizzaList) => {
  let pizzaWrapper = document.createElement('div');
  pizzaWrapper.setAttribute('id', 'is-grid');
  pizzaWrapper.className = 'pizza-wrapper';

  for (let i = 0; i < array.length; i++) {

    let pizza = document.createElement('div');
    pizza.className = 'pizza';

    let pizzaImg = document.createElement('div');
    pizzaImg.className = 'pizza__img';

    let pizzaName = document.createElement('h2');
    pizzaName.className = 'pizza__name';
    pizzaName.innerText = array[i].name;

    let pizzaInfo = document.createElement('table');
    pizzaInfo.className = 'info';

    let thList = ['Ингредиенты:', 'Калории:'];
    let tdList = [array[i].ingredients, array[i].calories];

    for (let j = 0; j < 2; j++) {
      let tr = document.createElement('tr');
      let th = document.createElement('th');
      th.innerText = thList[j];

      let td = document.createElement('td');

      if (thList[j] === 'Ингредиенты:') {
        for (let k = 0; k < tdList[j].length; k++) {
          k === tdList[j].length - 1 ? td.innerText += tdList[j][k] : td.innerText += `${tdList[j][k]}, `;
        }
      } else {
        td.innerText = tdList[j];
      }

      tr.append(th, td);
      pizzaInfo.append(tr);
    }

    let pizzaPrice = document.createElement('div');
    pizzaPrice.className = 'pizza__price';
    pizzaPrice.innerText = array[i].price;

    pizza.append(pizzaImg, pizzaName, pizzaInfo, pizzaPrice);
    pizzaWrapper.append(pizza);
  }

  container.append(pizzaWrapper);
};

let createGridFilters = () => {
  let filterWrapper = document.createElement('div');
  filterWrapper.setAttribute('id', 'grid-filters');
  filterWrapper.className = 'grid-filters';
  filterWrapper.innerHTML = `
        <div class="grid-filters__top" id="filterTop">
            <label class="grid-filters__label">
                Фильтровать по одному ингредиенту: 
                <input type="text" id="filterInput" class="grid-filters__input">
            </label>
            <button onclick="filterByIngredient()">Фильтровать</button>
        </div>
    `;

  container.append(filterWrapper);
};

let filterByIngredient = () => {
  let filteredPizzaList = [];
  let textInput = document.getElementById('filterInput');
  let textInputValue = textInput.value;

  if (textInputValue === '') alert('Введите в поле для ввода назнвание ингредиента');

  for (let i = 0; i < pizzaList.length; i++) {
    for (let j = 0; j < pizzaList[i].ingredients.length; j++) {
      if (pizzaList[i].ingredients[j] === textInputValue) {
        filteredPizzaList.push(pizzaList[i]);
      }
    }
  }

  if (filteredPizzaList.length !== 0) {
    let grid = document.getElementById('is-grid');
    grid.remove();
    createGrid(filteredPizzaList);

    let hasCancelBtn = document.getElementById('cancel-filter-by-ingredient');
    let showFiltered = document.getElementById('show-filtered-by-ingredient');

    if (showFiltered) showFiltered.innerText = `Пиццы отфильтрованы по ингредиенту: ${textInputValue}`;

    if (!hasCancelBtn) {
      let filterWrapper = document.getElementById('grid-filters');
      showFiltered = document.createElement('div');
      showFiltered.setAttribute('id', 'show-filtered-by-ingredient');
      showFiltered.className = 'filter-wrapper__filtered';
      showFiltered.innerText = `Пиццы отфильтрованы по ингредиенту: ${textInputValue}`;
      filterWrapper.append(showFiltered);

      let filterTop = document.getElementById('filterTop');
      let cancelFilter = document.createElement('button');
      cancelFilter.setAttribute('id', 'cancel-filter-by-ingredient');
      cancelFilter.className = 'cancel-filter';
      cancelFilter.innerText = 'Отменить фильтрацию';
      cancelFilter.setAttribute('onclick', 'cancelFilterByIngredient()');
      filterTop.append(cancelFilter);
    }

  } else if (filteredPizzaList.length === 0 && textInputValue !== '') {
    alert('Пицца с таким ингредиентом не найдена');
  }
};

let cancelFilterByIngredient = () => {
  let grid = document.getElementById('is-grid');
  let cancelBtn = document.getElementById('cancel-filter-by-ingredient');
  let showFiltered = document.getElementById('show-filtered-by-ingredient');
  let textInput = document.getElementById('filterInput');

  grid.remove();
  cancelBtn.remove();
  showFiltered.remove();
  textInput.value = '';
  createGrid();
};

let createCancelListFilterBtn = () => {
  let cancelBtn = document.createElement('button');
  cancelBtn.setAttribute('onclick', 'cancelListFilter()');
  cancelBtn.setAttribute('id', 'cancel-list-filter');
  cancelBtn.innerText = 'Отменить фильтрацию';

  let listFilters = document.getElementById('list-filters');
  listFilters.append(cancelBtn);
};

let cancelListFilter = () => {
  let list = document.getElementById('is-list');
  let cancelBtn = document.getElementById('cancel-list-filter');
  let selectFilter = document.getElementById('selectFilter');
  let emptyOption = document.getElementById('emptyOption');

  list.remove();
  cancelBtn.remove();
  selectFilter.value = emptyOption.value;
  createList();
};

let sortByPrice = () => {
  let filteredList = [];
  let priceFilter = document.getElementById('selectFilter');

  for (let i = 0; i < pizzaList.length; i++) {
    filteredList.push(pizzaList[i]);
  }

  if (priceFilter.value === 'sortByPrice') filteredList.sort((a, b) => parseInt(b.price) - parseInt(a.price));
  if (priceFilter.value === 'sortByPriceReverse') filteredList.sort((a, b) => parseInt(a.price) - parseInt(b.price));

  let list = document.getElementById('is-list');
  list.remove();
  createList(filteredList);

  let cancelListFilterBtn = document.getElementById('cancel-list-filter');
  if (!cancelListFilterBtn) createCancelListFilterBtn();
};

let modal = document.createElement('div');
modal.className = 'modal';
modal.innerHTML = `
    <div class="modal__question">В каком режиме просмотра отобразить меню?</div>
    <div class="modal__wrapper">
        <button class="modal__button" id="list-mode">Режим списка</button>
        <button class="modal__button" id="grid-mode">Режим сетки</button>
    </div>
`;
document.body.prepend(modal);

let firstListMode = document.getElementById('list-mode').addEventListener('click', firstSelectedViewMode);
let firstGridMode = document.getElementById('grid-mode').addEventListener('click', firstSelectedViewMode);

function firstSelectedViewMode(e) {
  modal.remove();
  if (e.target.id === 'list-mode') {
    createListFilters();
    createList();
  }
  if (e.target.id === 'grid-mode') {
    createGridFilters();
    createGrid();
  }

  let viewMode = document.createElement('div');
  viewMode.className = 'view-mode';
  viewMode.innerHTML = `
        <div class="view-mode" id="view-mode">
            <button class="view-mode__button" id="change-to-list" onclick="changeViewMode(this)" >Режим списка</button>
            <button class="view-mode__button" id="change-to-grid" onclick="changeViewMode(this)">Режим сетки</button>
        </div>
    `;
  document.body.prepend(viewMode);
}

let changeViewMode = elem => {
  let listMode = document.getElementById('is-list');
  let gridMode = document.getElementById('is-grid');

  if (elem.id === 'change-to-list' && !listMode) {
    container.innerHTML = '';
    createListFilters();
    createList();
  } else if (elem.id === 'change-to-list' && listMode) alert('Режим просмотра "Список" - уже включен.');

  if (elem.id === 'change-to-grid' && !gridMode) {
    container.innerHTML = '';
    createGridFilters();
    createGrid();
  } else if (elem.id === 'change-to-grid' && gridMode) alert('Режим просмотра "Сетка" - уже включен.');
};