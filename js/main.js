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
    let mainWrapper = document.createElement('div');
    mainWrapper.setAttribute('id', 'wrapper-list');
    mainWrapper.className = 'wrapper-list';

    let filterWrapper = document.createElement('div');
    filterWrapper.className = 'filter-wrapper';
    let sortByPrice = document.createElement('button');
    sortByPrice.innerText = 'Сортировать по цене сверху вниз';
    sortByPrice.setAttribute('id', 'sortByPrice');
    sortByPrice.setAttribute('onclick', 'sortByPrice()');
    let sortByPriceReverse = document.createElement('button');
    sortByPriceReverse.innerText = 'Сортировать по цене снизу вверх';
    sortByPriceReverse.setAttribute('id', 'sortByPriceReverse');
    sortByPriceReverse.setAttribute('onclick', 'sortByPriceReverse()');
    let inputWrapper = document.createElement('div');
    inputWrapper.className = 'input-wrapper';
    let inputName = document.createElement('input');
    inputName.setAttribute('id', 'input-name');
    let inputNameSubmit = document.createElement('button');
    inputNameSubmit.innerText = 'Сортировать по имени';
    inputNameSubmit.setAttribute('id', 'input-name-submit');
    inputNameSubmit.setAttribute('onclick', 'sortByName()');
    let cancelBtn = document.createElement('button');
    cancelBtn.innerText = 'Сбросить настройки сортировки';
    cancelBtn.setAttribute('id', 'cancel-filter');
    cancelBtn.setAttribute('onclick', 'cancelFilter()');

    inputWrapper.append(inputName, inputNameSubmit);

    filterWrapper.append(sortByPrice, sortByPriceReverse, inputWrapper);
    let pizzaWrapper = document.createElement('div');
    pizzaWrapper.className = 'pizza-wrapper';

    let ul = document.createElement('ul');

    for (let i = 0; i < array.length; i++) {
        let li = document.createElement('li');
        li.innerText = `${array[i].name} - ${array[i].price}`;
        ul.append(li);
    }

    pizzaWrapper.append(ul);
    mainWrapper.append(filterWrapper, pizzaWrapper);
    container.append(mainWrapper);

    mainWrapper.classList.add('hidden');
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
    pizzaWrapper.setAttribute('id', 'pizza-wrapper');
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

    mainWrapper.classList.add('hidden');
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
        let filteredGrid = document.getElementById('wrapper-grid');
        filteredGrid.classList.remove('hidden');

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
    let startGrid = document.getElementById('wrapper-grid');
    startGrid.classList.remove('hidden');
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
    let newFilteredList = document.getElementById('wrapper-list');
    newFilteredList.classList.remove('hidden');
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
    let newFilteredList = document.getElementById('wrapper-list');
    newFilteredList.classList.remove('hidden');
};

let sortByName = () => {
    let filteredPizzaList = [];
    let textInput = document.getElementById('input-name');
    let textInputValue = textInput.value;

    if (textInputValue === '') alert('Введите название пиццы для фильтра');

    for (let i = 0; i < pizzaList.length; i++) {
        if (pizzaList[i].name.includes(textInputValue)) filteredPizzaList.push(pizzaList[i]);
    }

    let list = document.getElementById('wrapper-list');
    list.remove();
    createList(filteredPizzaList);
    let newFilteredList = document.getElementById('wrapper-list');
    newFilteredList.classList.remove('hidden');
};

let cancelFilter = () => {

};

createList();
createGrid();


let changeToList = document.createElement('button');
changeToList.className = 'button-list';
changeToList.innerText = 'List view';

let changeToGrid = document.createElement('button');
changeToGrid.className = 'button-list';
changeToGrid.innerText = 'Grid view';

changeToList.addEventListener('click', () => {
    let wrapper = document.getElementById('wrapper-grid');

    if (wrapper) {
        wrapper.remove();
        createList();
        let list = document.getElementById('wrapper-list');
        list.classList.remove('hidden');
    } else {
        alert('Already in List view mode');
    }
});

changeToGrid.addEventListener('click', () => {
    let wrapper = document.getElementById('wrapper-list');

    if (wrapper) {
        wrapper.remove();
        createGrid();
        let grid = document.getElementById('wrapper-grid');
        grid.classList.remove('hidden');
    } else {
        alert('Already in Grid view mode');
    }
});

let modal = document.createElement('div');
modal.className = 'modal';
let modalQuestion = document.createElement('div');
modalQuestion.className = 'modal__question';
modalQuestion.innerText = 'В каком режиме отобразить меню?';
let modalWrapper = document.createElement('div');
modalWrapper.className = 'modal__wrapper';
let viewList = document.createElement('button');
viewList.className = 'modal__button';
viewList.innerText = 'Режим списка';
let viewGrid = document.createElement('button');
viewGrid.className = 'modal__button';
viewGrid.innerText = 'Режим сетки';
modalWrapper.append(viewList, viewGrid);
modal.append(modalQuestion, modalWrapper);
document.body.prepend(modal);

viewList.addEventListener('click', () => {
    let wrapperGrid = document.getElementById('wrapper-grid');
    wrapperGrid.classList.remove('hidden');
    wrapperGrid.remove();

    modal.classList.add('hidden');

    let wrapperList = document.getElementById('wrapper-list');
    wrapperList.classList.remove('hidden');

    document.body.prepend(changeToList);
    document.body.prepend(changeToGrid);
});

viewGrid.addEventListener('click', () => {
    let wrapperList = document.getElementById('wrapper-list');
    wrapperList.classList.remove('hidden');
    wrapperList.remove();

    modal.classList.add('hidden');

    let wrapperGrid = document.getElementById('wrapper-grid');
    wrapperGrid.classList.remove('hidden');

    document.body.prepend(changeToList);
    document.body.prepend(changeToGrid);
});

