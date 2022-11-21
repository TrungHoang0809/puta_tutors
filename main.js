var inputImgs = document.querySelectorAll("input[name='img']");

function getParent(childElement, selector) {
    while (childElement.parentElement) {
        if (childElement.parentElement.matches(selector)) {
            return childElement.parentElement;
        }
        childElement = childElement.parentElement;
    }
}

inputImgs.forEach(function(input){
    input.onclick = function(){
        var formGroup = getParent(input, ".form-group");
        var inputFile = formGroup.querySelector("input[type=file]");
        inputFile.click();
    }
})

var inputFiles = document.querySelectorAll("input[type='file']");
inputFiles.forEach(function(inputFile){
    inputFile.onchange = function(){
        var formGroup = getParent(inputFile, ".form-group");
        var inputText = formGroup.querySelector("input[type=text]");
        inputText.value = inputFile['files'][0].name;
    }
});