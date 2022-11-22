var inputImgs = document.querySelectorAll("input[name='img']");

function getParent(childElement, selector) {
    while (childElement.parentElement) {
        if (childElement.parentElement.matches(selector)) {
            return childElement.parentElement;
        }
        childElement = childElement.parentElement;
    }
}

inputImgs.forEach(function (input) {
    input.onclick = function () {
        var formGroup = getParent(input, ".form-group");
        var inputFile = formGroup.querySelector("input[type=file]");
        inputFile.click();
    }
})

var inputFiles = document.querySelectorAll("input[type='file']");
inputFiles.forEach(function (inputFile) {
    inputFile.onchange = function () {
        var formGroup = getParent(inputFile, ".form-group");
        var inputText = formGroup.querySelector("input[type=text]");
        inputText.value = inputFile['files'][0].name;
    }
});

window.onload = function () {
    const menuBtn = document.querySelector('.mobile-menu-icon');
    const closeBtn = document.querySelector('.mobile-menu-header i');
    const modalOverlay = document.querySelector(".mobile-overlay");


    menuBtn.onclick = function () {
        var overlay = document.querySelector(".mobile-overlay");
        var sideMenu = document.querySelector(".mobile-menu");
        overlay.style.display = 'block';
        sideMenu.style.display = "block";
        sideMenu.style.animation = "menuFadeIn 0.5s ease"

        // prevent body scroll:
        var body = document.querySelector("body");
        body.style.overflow = "hidden";
    }

    closeBtn.onclick = function () {
        var body = document.querySelector("body");
        body.style.overflow = "initial";
        
        var overlay = document.querySelector(".mobile-overlay");
        var sideMenu = document.querySelector(".mobile-menu");
        overlay.style.display = 'none';
        sideMenu.style.animation = "menuFadeOut .5s ease";

        setTimeout(function () {
            sideMenu.style.display = 'none';
        }, 400)
    }

    modalOverlay.onclick = function () {
        var body = document.querySelector("body");
        body.style.overflow = "initial";

        var overlay = document.querySelector(".mobile-overlay");
        var sideMenu = document.querySelector(".mobile-menu");
        overlay.style.display = 'none';
        sideMenu.style.animation = "menuFadeOut .5s ease";

        setTimeout(function () {
            sideMenu.style.display = 'none';
        }, 400)
    }

}