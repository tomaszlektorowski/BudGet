
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
        percentage: -1
    }

    return {
        addItem: function (type, des, val) {
            var newItem, ID;

            //create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 1;
            }

            //create new item based on the expense or income type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            data.allItems[type].push(newItem);
            //return the new element
            return newItem;
        },
        calculateBudget: function () {
            calculateTotal('exp');
            calculateTotal('inc');
            // calculate total income and expenses

            //calculate the budget:income-expenses
            data.budget = data.totals.inc - data.totals.exp;
            // calculate the percentage of income that we spend
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }

        },
        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        }
    };

})();

var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
};



var UIController = (function () {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel:'.budget__value',
        incomeLabel:'.budget__income--value',
        expensesLabel:'.budget__expenses--value',
        percentageLabel:'.budget__expenses--percentage'
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
            var html, element;
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-'+obj.id+'">' +
                    '<div class="item__description">'+obj.description+'</div>' +
                    '<div class="right clearfix">' +
                    '<div class="item__value">'+obj.value+'</div>' +
                    '<div class="item__delete">' +
                    '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            }
            else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-'+obj.id+'">' +
                    '<div class="item__description">'+obj.description+'</div>' +
                    '<div class="right clearfix">' +
                    '<div class="item__value">'+obj.value+'</div>' +
                    '<div class="item__percentage">21%</div>' +
                    '<div class="item__delete">' +
                    '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            }
            //insert html into dom
            document.querySelector(element).insertAdjacentHTML('beforeend', html);

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
        displayBudget:function(obj){
            document.querySelector(DOMstrings.budgetLabel).textContent=obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent=obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent=obj.totalExp;
            document.querySelector(DOMstrings.percentageLabel).textContent=obj.budget;

            if(obj.percentage>0){
                document.querySelector(DOMstrings.percentageLabel).textContent=obj.percentage+'%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent='---';
            }

        }
    };
})();
//////////////////////////////////////////
//GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {

    var setupEventListeners = function () {
        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    }


    var updateBudget = function () {

        // 1.Calculate the budget
        budgetCtrl.calculateBudget();
        // 2.return budget
        var budget = budgetCtrl.getBudget();

        // 3.Display budget to the UI
        UICtrl.displayBudget(budget);
    };

    var ctrlAddItem = function () {
        var input, newItem;
        // 1.Get the filled input data
        input = UICtrl.getinput();
        if (input.description !== "" && !(isNaN(input.value)) && input.value > 0) {
            // 2.Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            // 3.Add the new item to the user interface
            UICtrl.addListItem(newItem, input.type);
            //Clear fields
            UICtrl.clearFields();
        }
        else {
            alert("Incorrect data input!!!");
        }


        //Calculate and display budget
        updateBudget();

    }

    return {
        init: function () {
            setupEventListeners();
        },
        showData: function () {
            console.log(data);
        }

    };

})(budgetController, UIController);

controller.init();



