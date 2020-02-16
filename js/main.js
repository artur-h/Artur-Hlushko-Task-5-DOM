'use strict';

class Ingredient {
  constructor(name, calories, price) {
    this.name = name;
    this.calories = calories;
    this.price = price;
    this.crosedOut = false;
  }
}

class Pizza {
  constructor(name, ingredients, calories, price) {
    this.name = name;
    this.ingredients = ingredients;
    this.calories = calories;
    this.price = price;
  }
}

let ingredientsList = [];

let ingredientsXhr = new XMLHttpRequest();
ingredientsXhr.open('GET', 'json/ingredients.json');
ingredientsXhr.responseType = 'json';
ingredientsXhr.onload = () => {
  let data = ingredientsXhr.response;
  for (let key in data) {
    let findProperty = propertyName => {
      for (let keyInner in data[key]) {
        if (keyInner === propertyName) return data[key][keyInner];
      }
    };

    ingredientsList.push(new Ingredient(
        key,
        findProperty('calories'),
        findProperty('price'),
    ));
  }
};
ingredientsXhr.send();

let pizzaList = [];

let xhr = new XMLHttpRequest;
xhr.open('GET', 'json/menu.json');
xhr.responseType = 'json';
xhr.onload = () => {
  if (xhr.status !== 200) {
    console.log(`${xhr.status}: ${xhr.statusText}`);
  } else {
    let menu = xhr.response;
    for (let item in menu) {
      let pizzaIngredients = menu[item].ingredients;
      let caloriesSum = 0;
      let priceSum = 0;

      for (let i = 0; i < pizzaIngredients.length; i++) {
        for (let j = 0; j < ingredientsList.length; j++) {
          if (pizzaIngredients[i] == ingredientsList[j].name) {
            pizzaIngredients[i] = ingredientsList[j];
            caloriesSum += ingredientsList[j].calories;
            priceSum += ingredientsList[j].price;
          }
        }
      }

      pizzaList.push(new Pizza(
          item,
          menu[item].ingredients,
          caloriesSum,
          priceSum
      ));
    }
  }
};
xhr.send();

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
    li.innerText = `${array[i].name} - ${array[i].price} грн`;
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
    pizza.setAttribute('id', 'pizza');

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
        let addBtn = document.createElement('button');
        addBtn.className = 'pizza__add-btn';
        addBtn.innerText = 'добавить';
        th.append(addBtn);

        td.className = 'pizza__ingredient-list';
        for (let k = 0; k < tdList[j].length; k++) {
          let span = document.createElement('span');
          span.className = 'pizza__ingredient';
          span.innerText = `${tdList[j][k].name} `;

          td.append(span);
        }
      } else if (thList[j] === 'Калории:') {
        let span = document.createElement('span');
        span.className = 'pizza__calories';
        span.innerText = tdList[j];
        td.append(span);
      }

      tr.append(th, td);
      pizzaInfo.append(tr);
    }

    let pizzaPrice = document.createElement('div');
    pizzaPrice.className = 'pizza__price';
    pizzaPrice.innerText = `${array[i].price} грн`;

    pizza.append(pizzaImg, pizzaName, pizzaInfo, pizzaPrice);
    pizzaWrapper.append(pizza);

    pizza.addEventListener('click', e => {
      let clickTarget = e.target;
      let currentWrapper = e.currentTarget;
      let currentChildrenList = currentWrapper.children;
      let pizzaName;
      let pizzaPrice;
      let pizzaCalories;
      let pizzaIngredients;

      for (let i = 0; i < currentChildrenList.length; i++) {
        if (currentChildrenList[i].className === 'pizza__name') pizzaName = currentChildrenList[i];
        if (currentChildrenList[i].className === 'pizza__price') pizzaPrice = currentChildrenList[i];
      }

      let findElement = classSelector => {
        let collection = document.querySelectorAll(classSelector);
        for (let i = 0; i < collection.length; i++) {
          let wrapper = collection[i].closest('.pizza');
          let childrenList = wrapper.children;
          let name;

          for (let j = 0; j < childrenList.length; j++) {
            if (childrenList[j].className === 'pizza__name') {
              name = childrenList[j].innerHTML;
              if (name === pizzaName.innerHTML && classSelector === '.pizza__calories') pizzaCalories = collection[i];
              if (name === pizzaName.innerHTML && classSelector === '.pizza__ingredient-list') pizzaIngredients = collection[i];
            }
          }
        }
      };

      if (clickTarget.innerText === 'добавить') {
        findElement('.pizza__calories');

        let selectIngredientOuter = document.createElement('div');
        selectIngredientOuter.className = 'select-ingredient-window__outer';
        selectIngredientOuter.addEventListener('click', e => {
          if (e.target !== selectIngredient) {
            selectIngredientOuter.remove();
            selectIngredient.remove();
          }
        });

        let selectIngredient = document.createElement('div');
        selectIngredient.className = 'select-ingredient-window';

        let selectIngredientList = document.createElement('div');
        selectIngredientList.className = 'select-ingredient-window__list';

        let selectIngredientButtons = document.createElement('div');
        selectIngredientButtons.className = 'select-ingredient-window__buttons';
        let doneBtn = document.createElement('button');
        doneBtn.innerText = 'Подтвердить';
        let cancelBtn = document.createElement('button');
        cancelBtn.innerText = 'Отмена';
        selectIngredientButtons.append(doneBtn, cancelBtn);

        findElement('.pizza__ingredient-list');

        let allIngredients = [];
        for (let i = 0; i < ingredientsList.length; i++) {
          allIngredients.push(ingredientsList[i].name);
        }

        let currentIngredients = [];
        for (let i = 0; i < pizzaIngredients.children.length; i++) {
          let ingredientName = pizzaIngredients.children[i].innerText.trim();
          currentIngredients.push(ingredientName);

        }

        let showIngredients = [];
        nextIteration: for (let i = 0; i < allIngredients.length; i++) {
          for (let j = 0; j < currentIngredients.length; j++) {
            if (allIngredients[i] === currentIngredients[j]) {
              continue nextIteration;
            }
          }
          showIngredients.push(allIngredients[i])
        }

        for (let i = 0; i < showIngredients.length; i++) {
          let span = document.createElement('span');
          span.className = 'select-ingredient-window__ingredient';
          span.append(showIngredients[i]);
          selectIngredientList.append(span);
        }

        selectIngredient.append(selectIngredientList, selectIngredientButtons);

        document.body.prepend(selectIngredientOuter, selectIngredient);

        selectIngredient.addEventListener('click', e => {
          let clickModal = e.target;

          if (clickModal.className === 'select-ingredient-window__ingredient') {
            clickModal.classList.add('select-ingredient-window__ingredient--checked');
          } else if (clickModal.className === 'select-ingredient-window__ingredient select-ingredient-window__ingredient--checked') {
            clickModal.classList.remove('select-ingredient-window__ingredient--checked');
          }

          let selected = [];

          if (clickModal.innerText === 'Подтвердить') {
            for (let i = 0; i < selectIngredientList.children.length; i++) {
              if (selectIngredientList.children[i].className === 'select-ingredient-window__ingredient select-ingredient-window__ingredient--checked') {
                selected.push(selectIngredientList.children[i]);

                selectIngredientList.children[i].className = 'pizza__ingredient';
                pizzaIngredients.append(selectIngredientList.children[i]);
                i = -1;
              }
            }

            let ingredientsToAdd = [];

            let xhr = new XMLHttpRequest();
            xhr.open('GET', 'json/ingredients.json');
            xhr.responseType = 'json';
            xhr.onload = () => {
              let data = xhr.response;
              for (let key in data) {
                let findProperty = propertyName => {
                  for (let keyInner in data[key]) {
                    if (keyInner === propertyName) return data[key][keyInner];
                  }
                };

                for (let i = 0; i < selected.length; i++) {
                  if (selected[i].innerText === key) {
                    ingredientsToAdd.push(new Ingredient(
                      key,
                      findProperty('calories'),
                      findProperty('price'),
                    ));
                  }
                }
              }

              for (let i = 0; i < pizzaList.length; i++) {
                if (pizzaName.textContent === pizzaList[i].name) {
                  for (let j = 0; j < ingredientsToAdd.length; j++) {
                    pizzaList[i].ingredients.push(ingredientsToAdd[j]);
                  }
                }
              }

              for (let i = 0; i < pizzaList.length; i++) {
                if (pizzaName.textContent === pizzaList[i].name) {
                  let accPrice = 0;
                  let accCalories = 0;

                  for (let j = 0; j < pizzaList[i].ingredients.length; j++) {
                    if (pizzaList[i].ingredients[j].crosedOut === false) accPrice += pizzaList[i].ingredients[j].price;
                    if (pizzaList[i].ingredients[j].crosedOut === false) accCalories += pizzaList[i].ingredients[j].calories;
                  }

                  pizzaPrice.innerText = accPrice + ' грн';
                  pizzaCalories.innerText = accCalories;
                }
              }
            };
            xhr.send();

            selectIngredientOuter.remove();
            selectIngredient.remove();
          } else if (clickModal.innerText === 'Отмена') {
            selectIngredientOuter.remove();
            selectIngredient.remove();
          }
        });
      }

      if (clickTarget.className === 'pizza__ingredient' || clickTarget.className === 'pizza__ingredient pizza__ingredient--crossedOut') {
        findElement('.pizza__calories');

        for (let i = 0; i < pizzaList.length; i++) {
          let listOfIngredients = pizzaList[i].ingredients;
          for (let j = 0; j < listOfIngredients.length; j++) {
            if (clickTarget.innerText === listOfIngredients[j].name && pizzaList[i].name === pizzaName.textContent) {

              let hasClass = classCheck => {
                for (let className of clickTarget.classList) {
                  if (className === classCheck) {
                    return true;
                  }
                }
                return false;
              };

              if (hasClass('pizza__ingredient--crossedOut')) {
                clickTarget.classList.remove('pizza__ingredient--crossedOut');
                listOfIngredients[j].crosedOut = false;
              } else {
                listOfIngredients[j].crosedOut = true;
                clickTarget.classList.add('pizza__ingredient--crossedOut');
              }

              let accPrice = 0;
              let accCalories = 0;
              for (let k = 0; k < listOfIngredients.length; k++) {
                if (listOfIngredients[k].crosedOut === false) accPrice += listOfIngredients[k].price;
                if (listOfIngredients[k].crosedOut === false) accCalories += listOfIngredients[k].calories;
              }
              pizzaPrice.innerText = accPrice + ' грн';
              pizzaCalories.innerText = accCalories;
            }
          }
        }
      }
    });
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
      if (pizzaList[i].ingredients[j].name === textInputValue) {
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