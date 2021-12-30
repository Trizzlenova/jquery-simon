// AUDIO
const sounds = {
    green: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"),
    yellow: new Audio ("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"),
    blue: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"),
    red: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"),
};

// BACKGROUND
const $background = $('#background');

// GAME
const $gameboard = $('gameboard')
const $green = $('#green');
const $yellow = $('#yellow');
const $blue = $('#blue');
const $red = $('#red');
const $colors = $('.color')
const $round = $('#round');
const $power = $('#start');
const $light = $('#light');

let colors = [$green, $yellow, $blue, $red];

let power = false;
let colorCompOrder = [];
let current = 0;
let turn = 0;
let round = 0;
let compSpeed = 800;
let letUserClick = false;
let timer;
let randomColor;
let random;
let selected;

function colorFlash(color) {
    if (power) {
        sounds[color.id].play()
        color.animate({
            opacity: '1'
        }, 300)
        color.animate({
            opacity: '.8'
        }, 200) 
    }
}

function roundDisplay(round) {
    if(round === -1) $round.html('00');
    if(round < 10) {
        $round.html(`0${round}`);
    } else {
        $round.html(round)
    }
}

function addRandomColor() {
    roundDisplay(colorCompOrder.length)
    letUserClick = false;
    
    setTimeout(compPlay, 1000)
    function compPlay() {
        random = Math.floor(Math.random() * colors.length);
        randomColor = colors[random];
        colorCompOrder.push(randomColor[0]);
        if (colorCompOrder.length >= 5) {
            compSpeed = 600;
        }
        timer = setInterval(() => {
            colorFlash(colorCompOrder[current]);
            current++
            if (current === colorCompOrder.length) {
                clearInterval(timer);
                current = 0;
                letUserClick = true;
                return colorCompOrder;
            }
        }, compSpeed)
    }
}

function play() {
    addRandomColor()
    setTimeout(userPlay, 1000)
    function userPlay() {
        $colors.click((event) => {
            selected = event.target
            if(letUserClick) {
                colorFlash(selected)
                if (selected.id === colorCompOrder[turn].id) {
                    turn++;
                    round++;
                    if (turn === colorCompOrder.length) {
                        turn = 0;
                        clearTimeout();
                        setTimeout(addRandomColor(), 10000)
                    }
                } else {
                    turn = 0;
                    colorCompOrder = []
                    compSpeed = 800;
                    clearTimeout()
                    setTimeout(addRandomColor(), 10000)
                }
            }
        });
    }
}

function powerOn() {
    power = true;
    $light.css({backgroundColor: 'green'})
    $round.css({backgroundColor: '#bcb8b8'})
    play()
}

function powerOff() {
    location.reload(true);
    power = false;
    $light.css({backgroundColor: '#8a0000'});
    $round.css({backgroundColor: '#5b5a5a'})
    colorCompOrder = []
    $round.html('');
    $colors.click(() => {return});
}

$power.click(() => {
    if (power) {
        powerOff();
    } else {
        powerOn()
    }
})