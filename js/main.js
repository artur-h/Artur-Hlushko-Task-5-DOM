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
        <button id="sort-by-price" onclick="sortByPrice()">Сортировать по цене сверху вниз</button>
        <button id="sort-by-price-reverse" onclick="sortByPriceReverse()">Сортировать по цене снизу вверх</button>
        <div class="input-wrapper">
            <input type="text" id="input-name">
            <button id="input-name-submit" onclick="sortByName()">Сортировать по имени</button>
        </div>
    `;

    container.append(filterWrapper);
};

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
    let grid = document.getElementById('is-list');
    let cancelBtn = document.getElementById('cancel-list-filter');
    let textInput = document.getElementById('input-name');

    grid.remove();
    cancelBtn.remove();
    textInput.value = '';
    createList();
};

let filteredPizzaListByName = [];

let sortByPrice = () => {
    if (filteredPizzaListByName.length !== 0) {
        filteredPizzaListByName.sort((a, b) => {
            let firstPrice = a.price.split(/\s/);
            let secondPrice = b.price.split(/\s/);

            if (+firstPrice[0] > +secondPrice[0]) {
                return -1;
            } else {
                return 1;
            }
        });

        let list = document.getElementById('is-list');
        list.remove();
        createList(filteredPizzaListByName);
    } else {
        let filteredList = [];
        for (let i = 0; i < pizzaList.length; i++) {
            filteredList.push(pizzaList[i]);
        }

        filteredList.sort((a, b) => {
            let firstPrice = a.price.split(/\s/);
            let secondPrice = b.price.split(/\s/);

            if (+firstPrice[0] > +secondPrice[0]) {
                return -1;
            } else {
                return 1;
            }
        });

        let list = document.getElementById('is-list');
        list.remove();
        createList(filteredList);
    }

    let cancelListFilterBtn = document.getElementById('cancel-list-filter');
    if (!cancelListFilterBtn) createCancelListFilterBtn();
};

let sortByPriceReverse = () => {
    if (filteredPizzaListByName.length !== 0) {
        filteredPizzaListByName.sort((a, b) => {
            let firstPrice = a.price.split(/\s/);
            let secondPrice = b.price.split(/\s/);

            if (+firstPrice[0] > +secondPrice[0]) {
                return 1;
            } else {
                return -1;
            }
        });

        let list = document.getElementById('is-list');
        list.remove();
        createList(filteredPizzaListByName);
    } else {
        let filteredList = [];
        for (let i = 0; i < pizzaList.length; i++) {
            filteredList.push(pizzaList[i]);
        }

        filteredList.sort((a, b) => {
            let firstPrice = a.price.split(/\s/);
            let secondPrice = b.price.split(/\s/);

            if (+firstPrice[0] > +secondPrice[0]) {
                return 1;
            } else {
                return -1;
            }
        });

        let list = document.getElementById('is-list');
        list.remove();
        createList(filteredList);
    }

    let cancelListFilterBtn = document.getElementById('cancel-list-filter');
    if (!cancelListFilterBtn) createCancelListFilterBtn();
};

let sortByName = () => {
    filteredPizzaListByName = [];
    let textInput = document.getElementById('input-name');
    let textInputValue = textInput.value;

    if (textInputValue === '') return alert('Введите название пиццы для фильтра');

    for (let i = 0; i < pizzaList.length; i++) {
        if (pizzaList[i].name.includes(textInputValue)) filteredPizzaListByName.push(pizzaList[i]);
    }

    if (filteredPizzaListByName.length === 0) return alert('Пицца с таким именем не найдена');

    let list = document.getElementById('is-list');
    list.remove();
    createList(filteredPizzaListByName);

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
            <button class="view-mode__button" id="change-to-list" onclick="changeViewMode(this)" >List view</button>
            <button class="view-mode__button" id="change-to-grid" onclick="changeViewMode(this)">Grid view</button>
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