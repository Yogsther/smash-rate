//var socket = io.connect("nut.livfor.it:5923"); // For release
//var socket = io.connect("localhost:5923"); // For local testing

const CHAR_HEIGHT = 62; // 2+ to accommodate the 1px margin
const CHAR_WIDTH = 92;

var amountOfRows;
var perRow;
var currentFighter;

var currentScene = '';
var scenes = [{
        content: '<div id="selection-screen"> <div id="wrapper"></div> </div> <div id="character-inspect"><span id="name-insert">MARIO</span> <img src="content/stock/chara_2_bayonetta_00.png" alt="Stock icon" id="stock-icon"> <div id="character-inspect-shadow"></div> </div> <div id="profile"></div>',
        name: "main"
    }, {
        content: '<div id="skin-tables"> </div> <div id="comments"></div>',
        name: "cards"
    }

]

processURL();

function processURL() {
    url = window.location.href;
    var args = url.substr(url.indexOf("?") + 1).split("&");
    for (a of args) {
        args[a.split("=")[0]] = a.split("=")[1]
    }

    if (args["id"]) {
        loadScene("cards");
        summonCards(args["id"]);
    } else {
        loadScene("main")
        summonFighters();
        preInspectCharacter("fighter_0");
    }
}

window.onpopstate = e => {
    processURL();
}


function summonCards(id) {
    var fighter = FIGHTERS[id];
    document.title = fighter.displayName.en_GB + " | Smash Rate";
    document.getElementById("title-name-spot").innerText = "| " + fighter.displayName.en_GB;
    document.getElementById("skin-tables").innerHTML = "";
    currentFighter = fighter;
    document.getElementById("rate-title").style.color = fighter.color;
    for (i = 0; i < 8; i++) {
        
        card = document.createElement("div");
        card.classList.toggle("character-skin-card");
        card.setAttribute("onmouseenter", "lightUpBorder(this)");

        img = new Image();
        img.src = 'content/default/chara_1_' + fighter.file + '_0' + i + '.png';
        img.classList.toggle("card-image")
        img.style.borderBottom = '5px solid ' + fighter.color;

        card.appendChild(img); // Put image into the card

        stars = document.createElement("div")
        stars.classList.toggle("stars");
        for (j = 1; j <= 5; j++) {
            stars.innerHTML += '<div class="star" onmouseenter="lightUpStars(' + j + ', this)" onmouseleave="lightUpStars(5, this, 0)"> <svg class="star" xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 670 670"><linearGradient x1="0%" x2="0%" y1="0%" y2="100%" id="a"><stop offset="0%" stop-color="#fbc1d4"/><stop offset="100%" stop-color="#d99db0"/></linearGradient><path class="ptn" fill="url(#a)" d="M305.969 112.01c23.984-4.23 101.085 114.077 101.085 114.077s135.358-11.593 148.577 7.665S481.9 366.827 481.9 366.827s49.731 126.392 35.1 141.97-145.846-27.29-145.846-27.29-109.054 87.086-127.735 75.54c-18.655-11.55-15.591-145.423-15.591-145.423s-116.573-77.805-114.808-99.809S250 253.775 250 253.775s31.985-137.54 55.969-141.765z"/></svg> </div>';
        }
        
        card.appendChild(stars);

        info = document.createElement("span");
        info.classList.toggle("info");

        rating = document.createElement("span")
        rating.title = "Rating";
        rating.innerText = '3.5'

        ratingOf = document.createElement("span");
        ratingOf.style.color = "grey";
        ratingOf.innerText = "/ 5";

        info.appendChild(rating);
        info.appendChild(ratingOf);

        card.appendChild(info);

        document.getElementById("skin-tables").appendChild(card);
    
    }

   //document.getElementById("skin-tables").innerHTML = allCardsString;

    for (stars of document.getElementsByClassName("stars")) {
        lightUpStars(5, stars.children[0], 0);
    }

    calculateCardRealEstate()
}


function calculateCardRealEstate() {
    var windowWidthLeft = window.innerWidth - 300;
    var margins = 32; // Per card
    var cardWidth = 240; // Per card

    var amountOfCardsThatFit = Math.floor((windowWidthLeft - (margins / 2)) / (cardWidth + margins));
    if (amountOfCardsThatFit < 1) amountOfCardsThatFit = 1;
    if (amountOfCardsThatFit > 4) amountOfCardsThatFit = 4;

    document.getElementById("skin-tables").style.width = (amountOfCardsThatFit * (margins + cardWidth)) + (margins) + "px";
    //document.getElementById("comments").style.width =  window.innerWidth - document.getElementById("skin-tables").offsetWidth - 34 + "px"
}



function lightUpBorder(el) {
    el.style.outlineColor = currentFighter.color;
}

function lightUpStars(amount, star, color) {
    // Amount is the amount of stars to be lit, 1-5
    // Star is one of the five stars in the group to be lit
    i = 0;
    if (color === undefined) color = currentFighter.color;
    if (color === 0) color = 'rgb(66, 66, 66)'; // Default empty color
    for (child of star.parentElement.children) {
        if (i >= amount) break;
        i++;
        child.children[0].children[1].setAttribute("fill", color);
    }
}


function loadScene(name) {
    for (scene of scenes) {
        if (scene.name == name) {
            document.getElementById("content").innerHTML = scene.content;
            document.getElementById("title-name-spot").innerText = "";
            document.title = "Smash Rate"
            currentScene = name;
        }
    }
}

window.onresize = e => {
    if (currentScene == "main") summonFighters();
    if (currentScene == "cards") calculateCardRealEstate();
};

var intervalIndex = 0;

/* Main screen animation */
setInterval(() => {
    if (currentScene == "main") {

        var rowIndex = 0;
        for (row of document.getElementsByClassName("row")) {
            var x = 0;
            for (el of row.children) {
                var intensity = ((.5 / amountOfRows) * rowIndex) + ((.5 / perRow) * x); // Gradient delay effect-distance, 0-1

                if (!isHover(el)) el.children[0].style.background = "rgba(0, 0, 0, " + ((Math.sin(intervalIndex + (intensity * 6)) / 4) + .5) + ")";

                function isHover(e) {
                    return (e.parentElement.querySelector(':hover') === e);
                }

                x++;
            }
            rowIndex++;
        }
        intervalIndex -= .05;
    }
}, 50);

// Select screen loader
function summonFighters() {

    // Clear wrapper
    var wrapper = document.getElementById("wrapper");
    while (wrapper.firstChild) wrapper.removeChild(wrapper.firstChild);
    // Fill with characters
    var width = wrapper.offsetWidth;
    perRow = Math.floor(width / CHAR_WIDTH); /* px width of chracter */
    if (perRow > FIGHTERS.length) perRow = FIGHTERS.length;
    amountOfRows = Math.ceil(FIGHTERS.length / perRow); // Amount of total rows, including smaller onces

    var fighterIndex = 0;

    for (let i = 0; i < amountOfRows; i++) {
        var amount = (FIGHTERS.length - fighterIndex) % perRow;
        if (amount == 0 || i < amountOfRows - 1) amount = perRow;
        createRow(amount);
    }

    function createRow(amount) {
        var row = document.createElement("div"); // Create a row to fill
        row.classList.toggle("row");
        row.style.width = CHAR_WIDTH * amount + "px";

        for (let i = 0; i < amount; i++) {

            var fighter = FIGHTERS[fighterIndex];

            var fighterElement = document.createElement("div");
            fighterElement.classList.toggle("fighter-selection");
            fighterElement.id = "fighter_" + fighterIndex;

            var fighterImage = new Image();
            fighterImage.src = "content/profile/chara_7_" + fighter.file + "_00.png";
            fighterImage.classList.toggle("fighter-selection-img")
            fighterImage.id = "fighter_" + fighterIndex;

            fighterElement.addEventListener("mouseenter", e => {
                preInspectCharacter(e.target.id);
            });
            fighterElement.addEventListener("click", e => {
                inspect(e.target.id);
            });
            fighterElement.appendChild(fighterImage);

            row.appendChild(fighterElement) // Fill row with character
            fighterIndex++;
        }
        document.getElementById("wrapper").appendChild(row); // Append row into the document
    }
}

function inspect(id) {
    id = id.substr(id.indexOf("_") + 1);
    window.history.pushState("", "?", "/?id=" + id);
    processURL()
}

function back() {
    window.history.pushState("", "?", "/");
    processURL()
}

function preInspectCharacter(id) {
    // When the user only hovers over a character - a mini preview / inspection
    id = id.substr(id.indexOf("_") + 1);
    var fighter = FIGHTERS[id];
    document.getElementsByClassName("fighter-selection-img")[id].style.background = fighter.color;
    document.getElementById("character-inspect").style.borderTopColor = fighter.color;
    document.getElementById("name-insert").innerText = fighter.displayName.en_GB;
    document.getElementById("stock-icon").src = 'content/stock/chara_2_' + fighter.file + '_00.png';
    document.getElementById("rate-title").style.color = fighter.color;
}