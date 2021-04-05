function Validator(options){

    var alertRegrister = document.querySelector('#form-1');

    function getParent(element, selector){
        while(element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    var selectorRules = {};

    //ham thuc hien invalid
    function validate(inputElement, rule){
        var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
        // var errorMessage = rule.test(inputElement.value);
        // var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        var errorMessage;

        // lay ra cac rules cua selector
        var rules = selectorRules[rule.selector];

        // lap qua tung rules va kiem tra
        // neu co loi thi dung viec kiem tra
        for(var i=0; i<rules.length; i++){
            errorMessage = rules[i](inputElement.value);
            if(errorMessage) break;
        }

        if(errorMessage){
            errorElement.innerText = errorMessage;
            getParent(inputElement, options.formGroupSelector).classList.add('invalid');
        } else {
            errorElement.innerText = '';
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
        }

        return !errorMessage;
    }

    //lay element cua form can validate
    var formElement = document.querySelector(options.form);
    if(formElement){

        formElement.onsubmit = function(e){
            e.preventDefault(); // bo di hanh dong mac dinh submit form

            var isFormValid = true;

            // lap qua tung rules va validate
            options.rules.forEach(function(rule){
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);
                if(!isValid){
                    isFormValid = false;
                }
            });

            if(isFormValid){
                //truong hop submit vs js
                if(typeof options.onSubmit === 'function'){
                    var enableInputs = formElement.querySelectorAll('[name]:not([disabled])');
                    var formValues = Array.from(enableInputs).reduce(function(values, input){
                        values[input.name] = input.value;
                        return values;
                    }, {});
                    options.onSubmit(formValues);
                    if(alertRegrister){
                        alert('Regrister account success!')
                        window.location.href = 'https://dongvuvd7.github.io/Login-RegristerF8/loginForm.html';
                    }
                    else window.location.href = 'http://localhost:8080/#/employee'
                } else { // truong hop submit mac dinh
                    formElement.submit();
                }
            }
        }

        // lap qua moi rule va xu ly(lang nghe su kien)
        options.rules.forEach(function(rule){

            //luu lai cac rules cho moi input
            if(Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test);
            }
            else {
                selectorRules[rule.selector] = [rule.test];
            }

            var inputElement = formElement.querySelector(rule.selector);
            if(inputElement){
                // xy ly trong truong hop blur khoi input
                inputElement.onblur = function(){
                    //value: inputElement.value
                    // test func: rule.test

                    validate(inputElement, rule);
                }

                //xu ly moi khi nguuoi dung nhap value vao input (tro lai binh thuong de nhap roi moi check)
                inputElement.oninput = function(){
                    var errorElement = getParent(inputElement, options.formGroupSelector).querySelector('.form-message');
                    errorElement.innerText = '';
                    getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
                }
            }
        });
    }

};

//Dinh nghia cac rules
//Nguyen tac cua cac rules:
    //1. Khi co loi -> tra ra message loi
    //2. Khi hop le -> khong tra ra gi ca
Validator.isRequired = function(selector, message){
    return {
        selector: selector,
        test: function(value){
            return value.trim() ? undefined : message || 'Vui lòng nhập trường này';
        }
    };

};

Validator.isEmail = function(selector, message){
    return {
        selector: selector,
        test: function(value){
            var regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return regex.test(value) ? undefined : message || 'Vui lòng nhập email hợp lệ';
        }
    };
};

Validator.minLength = function(selector, min, message){
    return {
        selector: selector,
        test: function(value){
            return value.length >= min ? undefined : message || 'Mật khẩu có tối thiểu ' + min + ' ký tự !'
        }
    };
};

Validator.isConfirmed = function(selector, getConfirmValue, message){
    return{
        selector: selector,
        test: function(value){
            return value === getConfirmValue() ? undefined : message || 'Password chưa hợp lệ';
        }
    }
}