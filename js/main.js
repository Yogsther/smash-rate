//var socket = io.connect("nut.livfor.it:5923"); // For release
//var socket = io.connect("localhost:5923"); // For local testing

const CHAR_HEIGHT = 62; // 2+ to accommodate the 1px margin
const CHAR_WIDTH = 92;

var amountOfRows;
var perRow;



var currentScene = '';
var scenes = [
    {
        content: '<div id="selection-screen"> <div id="wrapper"></div> </div> <div id="character-inspect"><span id="name-insert">MARIO</span> <img src="content/stock/chara_2_bayonetta_00.png" alt="Stock icon" id="stock-icon"> <div id="character-inspect-shadow"></div> </div> <div id="profile"></div>',
        name: "main"
    }
]

loadScene("main");
summonFighters();
preInspectCharacter("fighter_0");



function loadScene(name){
    for(scene of scenes){
        if(scene.name == name){
            document.getElementById("content").innerHTML = scene.content;
            currentScene = name;
        }
    }
}

window.onresize = e => {
    if(currentScene == "main") summonFighters();
};

var intervalIndex = 0;

setInterval(() => {
    var rowIndex = 0;
    for(row of document.getElementsByClassName("row")){
        var x = 0;
        for(el of row.children){
            var intensity = ((.5 / amountOfRows) * rowIndex) + ((.5/perRow) * x); // Gradient delay effect-distance, 0-1
            
            if(!isHover(el))el.children[0].style.background = "rgba(0, 0, 0, " + ((Math.sin(intervalIndex + (intensity*6))/4)+.5) + ")";
            
            function isHover(e) {
                return (e.parentElement.querySelector(':hover') === e);
            }

            x++;
        }
        rowIndex++;
    }
    intervalIndex-=.05;
}, 50);

// Select screen loader
function summonFighters() {

    // Clear wrapper
    var wrapper = document.getElementById("wrapper");
    while(wrapper.firstChild) wrapper.removeChild(wrapper.firstChild);
    // Fill with characters
    var width = wrapper.offsetWidth;
    perRow = Math.floor(width / CHAR_WIDTH); /* px width of chracter */
    if (perRow > FIGHTERS.length) perRow = FIGHTERS.length;
    amountOfRows = Math.ceil(FIGHTERS.length / perRow); // Amount of total rows, including smaller onces

    var fighterIndex = 0;

    for (let i = 0; i < amountOfRows; i++) {
        var amount = (FIGHTERS.length - fighterIndex) % perRow;
        if(amount == 0 || i < amountOfRows-1) amount = perRow;
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
                fighterElement.id = "fighter_"+fighterIndex;
                
            var fighterImage = new Image();
                fighterImage.src = "content/profile/chara_7_" + fighter.file + "_00.png";
                fighterImage.classList.toggle("fighter-selection-img")

            fighterElement.addEventListener("mouseenter", e => {
                preInspectCharacter(e.target.id);
            });
            fighterElement.appendChild(fighterImage);

            row.appendChild(fighterElement) // Fill row with character
            fighterIndex++;
        }
        document.getElementById("wrapper").appendChild(row); // Append row into the document
    }
}

function preInspectCharacter(id){
    // When the user only hovers over a character - a mini preview / inspection
    id = id.substr(id.indexOf("_")+1);
    var fighter = FIGHTERS[id];
    document.getElementsByClassName("fighter-selection-img")[id].style.background = fighter.color;
    document.getElementById("character-inspect").style.borderTopColor = fighter.color;
    document.getElementById("name-insert").innerText = fighter.displayName.en_GB;
    document.getElementById("stock-icon").src = 'content/stock/chara_2_' + fighter.file + '_00.png';
    document.getElementById("rate-title").style.color = fighter.color;
}