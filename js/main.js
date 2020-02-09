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
    document.body.append(pizzaWrapper);
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
        <button id="cancel-filter" onclick="cancelFilter()">Сбросить настройки сортировки</button>
    `;

    document.body.append(filterWrapper);
};

let createGrid = (array = pizzaList) => {
    let mainWrapper = document.createElement('div');
    mainWrapper.setAttribute('id', 'wrapper-grid');
    mainWrapper.className = 'wrapper-grid';

    let filterWrapper = document.createElement('div');
    filterWrapper.setAttribute('id', 'filter-wrapper');
    filterWrapper.className = 'filter-wrapper';
    let inputText = document.createElement('input');
    inputText.setAttribute('id', 'filterInput');
    inputText.className = 'filter-wrapper__input';
    let label = document.createElement('label');
    label.innerText = 'Фильтровать по одному ингредиенту: ';
    label.className = 'filter-wrapper__label';
    label.append(inputText);
    let filterButton = document.createElement('button');
    filterButton.setAttribute('onclick', 'filterByIngredient()');
    filterButton.innerText = 'Фильтровать';
    let filterTop = document.createElement('div');
    filterTop.setAttribute('id', 'filterTop');
    filterTop.className = 'filter-wrapper__top';
    filterTop.append(label, filterButton);
    filterWrapper.append(filterTop);
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

    mainWrapper.append(filterWrapper, pizzaWrapper);
    container.append(mainWrapper);
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

    if (filteredPizzaList.length !== 0 && filteredPizzaList.length !== 19) {
        let grid = document.getElementById('wrapper-grid');
        grid.remove();
        createGrid(filteredPizzaList);

        let filterWrapper = document.getElementById('filter-wrapper');
        let showFiltered = document.createElement('div');
        showFiltered.className = 'filter-wrapper__filtered';
        showFiltered.innerText = `Пиццы отфильтрованы по ингредиенту: ${textInputValue}`;
        filterWrapper.append(showFiltered);

        let filterTop = document.getElementById('filterTop');
        let cancelFilter = document.createElement('button');
        cancelFilter.className = 'cancel-filter';
        cancelFilter.innerText = 'Отменить фильтрацию';
        cancelFilter.setAttribute('onclick', 'cancelFilterByIngredient()');
        filterTop.append(cancelFilter);

    } else if (filteredPizzaList.length === 0 && textInputValue !== '') {
        alert('Пицца с таким ингредиентом не найдена');
    }
};

let cancelFilterByIngredient = () => {
    let grid = document.getElementById('wrapper-grid');
    grid.remove();
    createGrid();
};

let sortByPrice = () => {
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

    let list = document.getElementById('wrapper-list');
    list.remove();
    createList(filteredList);
};

let sortByPriceReverse = () => {
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

    let list = document.getElementById('wrapper-list');
    list.remove();
    createList(filteredList);
};

let sortByName = () => {
    let filteredPizzaList = [];
    let textInput = document.getElementById('input-name');
    let textInputValue = textInput.value;

    if (textInputValue === '') return alert('Введите название пиццы для фильтра');

    for (let i = 0; i < pizzaList.length; i++) {
        if (pizzaList[i].name.includes(textInputValue)) filteredPizzaList.push(pizzaList[i]);
    }

    if (filteredPizzaList.length === 0) return alert('Пицца с таким именем не найдена');

    let list = document.getElementById('wrapper-list');
    list.remove();
    createList(filteredPizzaList);
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
    if (e.target.id === 'grid-mode') createGrid();

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
        gridMode.remove();
        createList();
    } else if (elem.id === 'change-to-list' && listMode) {
        alert('Режим просмотра "Список" - уже включен.');
    }

    if (elem.id === 'change-to-grid' && !gridMode) {
        listMode.remove();
        createGrid();
    } else if (elem.id === 'change-to-grid' && gridMode) {
        alert('Режим просмотра "Сетка" - уже включен.');
    }
};