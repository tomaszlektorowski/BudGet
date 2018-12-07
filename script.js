/////////////////////////// BUDGET MODULE

var budgetController = (function () {
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
    }

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
    }

    return {
        addItem: function (type, des, val) {
            var newItem, ID;
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 1;
            }
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else {
                newItem = new Income(ID, des, val);
            }
            data.allItems[type].push(newItem);
            return newItem;
        },
        deleteItem: function (type,id) {
            var ids, index;
            ids = data.allItems[type].map(function (current) {
                return current.id;
            });
            index = ids.indexOf(id);
            if (index !== (-1)) {
                data.allItems[type].splice(index, 1)
            }
        },

        calculateBudget: function () {
            calculateTotal('exp');
            calculateTotal('inc');
            data.budget = data.totals.inc - data.totals.exp;
        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
            }
        }

    };

})();

var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
};

/////////////////////////// UI MODULE

var UIController = (function () {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        container: '.container',
    };

    return {
        getinput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value, //inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }

        },

        addListItem: function (obj, type) {
            function generateListItemHTML(type){
                var HTML= '<div class="item clearfix" id="' + type +'-' + obj.id + '">' +
                '<div class="item__description">' + obj.description + '</div>' +
                '<div class="right clearfix">' +
                '<div class="item__value">' + obj.value + '</div>' +
                '<div class="item__delete">' +
                '<button class="item__delete--btn">X</button>' +
                '</div>' +
                '</div>' +
                '</div>';
                return HTML;
            }
            if (type==='inc'){
                document.querySelector('.income__list').insertAdjacentHTML('beforeend', generateListItemHTML(type));
            } else {
                document.querySelector('.expenses__list').insertAdjacentHTML('beforeend', generateListItemHTML(type));
            }

        },

        deleteListItem:function(selectorID){
            var el=document.getElementById(selectorID)
            el.parentNode.removeChild(el);
        },

        clearFields: function () {
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function (current, index, array) {
                current.value = "";
            });
            fieldsArr[0].focus();
        },

        getDOMstrings: function () {
            return DOMstrings;
        },

        displayBudget: function (obj) {
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
        }
    };
})();

/////////////////////////// CONTROLLER MODULE

var controller = (function (budgetCtrl, UICtrl) {

    var setupEventListeners = function () {
        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };

    var updateBudget = function () {
        budgetCtrl.calculateBudget();
        var budget = budgetCtrl.getBudget();
        UICtrl.displayBudget(budget);
    };

    var ctrlAddItem = function () {
        var input, newItem;
        input = UICtrl.getinput();
        if (input.description !== "" && !(isNaN(input.value)) && input.value > 0) {
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            UICtrl.addListItem(newItem, input.type);
            UICtrl.clearFields();
        }
        else {
            alert("Incorrect data input!!!");
        }
        updateBudget();
    };

    var ctrlDeleteItem = function (event) {
        var itemID, splitID, type, ID;
        itemID = (event.target.parentNode.parentNode.parentNode.id);
        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            budgetCtrl.deleteItem(type, ID);
            UICtrl.deleteListItem(itemID);
            updateBudget();
        }
    };

    return {
        init: function () {
            setupEventListeners();
            UICtrl.displayBudget(budget = 0,
                totalInc = 0,
                totalExp = 0,
                percentage = 0);
        }
    };

})(budgetController, UIController);

controller.init();