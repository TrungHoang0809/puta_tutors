
function Validator(formSelector, options = {}) {
    var formRules = {}

    function getParent(childElement, selector) {
        while (childElement.parentElement) {
            if (childElement.parentElement.matches(selector)) {
                return childElement.parentElement;
            }
            childElement = childElement.parentElement;
        }
    }

    var validatorRules = {
        university: function(value){
            return value ? undefined : "Vui lòng nhập trường đại học!";
        },
        career: function(value){
            return value ? undefined : "Nhập nghành học!";
        },
        deegree: function(value){
            return value ? undefined : "Nhập trình độ!";
        },
        img_required: function(value){
            return value ? undefined : "Vui lòng chọn ảnh!";
        },
        province_require: function(value){
            return value ? undefined : "Vui lòng nhập tỉnh thành phố!";
        },
        name_required: function (value) {
            return value ? undefined : "Vui lòng nhập đầy đủ họ và tên!";
        },
        date_required: function(value){
            return value ? undefined : "Vui lòng nhập ngày sinh!";
        },
        place_required: function(value){
            return value ? undefined : "Vui lòng nhâp nguyên quán!";
        },
        phone_required: function (value) {
            return value ? undefined : "Vui lòng nhập số điện thoại!";
        },
        address_required: function (value) {
            return value ? undefined : "Vui lòng nhập địa chỉ!";
        },
        email_required: function (value) {
            return value ? undefined : "Vui lòng nhập email!";
        },
        phone: function (value) {
            var regex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
            return regex.test(value) ? undefined : "Số điện thoại không hợp lệ!";
        },
        phone_number: function (value) {
            return value.length == 10 ? undefined : "Số điện thoại phải có 10 số";
        },
        email: function (value) {
            var regex = /^\w+([\.]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : "Email không hợp lệ!";
        },
        ext_email: function (value) {
            var regex = /^\w+([\.]?\w+)@+(gmail\.com|yahoo\.com|@hotmail\.com)+$/;
            return regex.test(value) ? undefined : "Chỉ hỗ trợ @gmail.com, @yahoo.com, @hotmail.com";
        },
        min: function (min) {
            return function (value) {
                return value.length >= min ? undefined : `Nhập tối thiểu ${min} ký tự`;
            }
        },
        max: function (max) {
            return function (value) {
                return value.length <= max ? undefined : `Nhập tối đa ${max} ký tự`;
            }
        },
    }

    //lấy ra form cần validation:
    var formElement = document.querySelector(formSelector);

    // Chỉ xử lý khi có element trong DOM:
    if (formElement) {
        var inputs = formElement.querySelectorAll("[name][rules]");
        
        for (let input of inputs) {

            var rules = input.getAttribute("rules").split("|");

            for (let rule of rules) {

                var ruleInfo;
                var isRulesHasValue = rule.includes(":");

                if (isRulesHasValue) {
                    ruleInfo = rule.split(':');
                    rule = ruleInfo[0];
                }

                var ruleFunction = validatorRules[rule];

                if (isRulesHasValue) {
                    ruleFunction = ruleFunction(ruleInfo[1]);
                }

                if (Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(ruleFunction);
                }
                else {
                    formRules[input.name] = [ruleFunction];
                }
            }

            input.onblur = handleValidate;
            input.oninput = handleClear;
        }

       
    }

    function handleValidate(event) {

        var listFuncs = formRules[event.target.name];

        var errorMessage;
        listFuncs.find(function (func) {
            return errorMessage = func(event.target.value);
        })

        if (errorMessage) {
            var formGroup = getParent(event.target, ".form-group");

            if (formGroup) {
                formGroup.style.marginBottom = '6px';
                var formMessage = formGroup.querySelector(".form-message");
                formGroup.classList.add("invalid");
                formMessage.classList.add("invalid");
                formMessage.innerText = errorMessage;
            }
        }

        return !errorMessage;
    }

    function handleClear(event) {
        var formGroup = getParent(event.target, ".form-group");
        formGroup.classList.remove("invalid");
        var formMessage = formGroup.querySelector(".form-message");
        if (formMessage) {
            formGroup.style.marginBottom = '20px';
            formMessage.classList.remove("invalid");
            formMessage.innerText = "";
        }
    }

    // xử lý hành động submit form:
    formElement.onsubmit = function (event) {
        event.preventDefault();
        var isValid = true;
        var inputs = formElement.querySelectorAll("[name][rules]");
        for (let input of inputs) {
            if (!handleValidate({ target: input })) {
                isValid = false;
            }
        }

        // Khi không có lỗi submit form:
        if (isValid) {
            if (typeof options.onSubmit === "function") {
                // get all inputs element not disable
                var enableInputs = formElement.querySelectorAll('[name]:not([disable])');
                var formValues = Array.from(enableInputs).reduce(function (values, input) {
                    switch (input.type) {
                        case 'radio':
                            // values[input.name] = formElement.querySelector(`input[name="${input.name}"]:checked`).value;
                            if (input.matches(':checked')) {
                                values[input.name] = input.value;
                            }
                            break;
                        case 'checkbox':
                            if (!input.matches(':checked')) {
                                if (!Array.isArray(values[input.name])) {
                                    values[input.name] = "";
                                }
                                return values;
                            }
                            if (!Array.isArray(values[input.name])) {
                                values[input.name] = [];
                            }
                            values[input.name].push(input.value);
                            break;
                        default:
                            values[input.name] = input.value;
                    }
                    return values;
                }, {})
                options.onSubmit(formValues);
            }
            else {
                formElement.submit();
            }
        }
    }
}