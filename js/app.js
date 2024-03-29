let cards = [
    'fa-diamond',
    'fa-paper-plane-o',
    'fa-anchor',
    'fa-bolt',
    'fa-bomb',
    'fa-cube',
    'fa-leaf',
    'fa-bicycle',
]

cards = [...cards, ...cards]

function generateCard(card) {
    return `<li class="card" data-column=${card}><i class="fa ${card}"></i></li>` 
}

const deck = document.querySelector('.deck')
const stars = document.querySelectorAll('.stars .fa')
const restart = document.querySelector('.restart')


let openCards = []
const cardList = document.querySelectorAll('.card')

let matchCount = 0;
const starCount = 16;
let starRating = 3;
let clickCount = 0;
let moveCount = 0;

const moves = document.querySelector('.moves')
moves.textContent = moveCount;

let startTime = 0
let endTime = 0
let spendTime = 0
let timer = 0
const timerText = document.querySelector('.timer')



function init() {
    shuffle(cards)
    const cardHTML = cards.map(function(card){
        return generateCard(card)
    })
    deck.innerHTML = cardHTML.join(' ')
    matchCount = 0
    clickCount = 0
    moveCount = 0
    starRating = 3
    spendTime = 0
    moves.textContent = moveCount;
    stars.forEach(star => {
        star.classList.remove('fa-star-o')
        star.classList.add('fa-star')
    })
    openCards = []
    startTime = Date.now()
    setInterval(function() {
        let realTime = Date.now()
        if(matchCount < 8 ) {
            timer = handleTime(realTime - startTime)
            console.log(timer)
            timerText.innerHTML = `<i class="fa fa-clock-o"></i> &nbsp; ${timer}`
        }
    }, 1000)

}

init()

restart.addEventListener('click', function() {
    init()
})


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function matchCard(e) {
    if(e.target.classList.contains('card') 
    && !e.target.classList.contains('show') 
    && !e.target.classList.contains('open') 
    && !e.target.classList.contains('match')){
        // ClickCount prevents opening the third card
        if(clickCount < 2) {
            clickCount += 1

            // Open the card and add it to the openCards array
            e.target.classList.remove('flip-backward')

            e.target.classList.add('open', 'show', 'flip-forward')
            openCards.push(e.target)
            
            // When the openCards array has two cards,
            if(openCards.length >= 2) {
                // Count how many times the player move and update the counter
                moveCount += 1;
                moves.textContent = moveCount;

                // If the move of the player reaches the limit, reduce the star rating
                if(moveCount > starCount - 3 && starCount - moveCount >= 1) {
                    stars[starCount - moveCount].classList.remove('fa-star')
                    stars[starCount - moveCount].classList.add('fa-star-o')
                    starRating = starCount - moveCount
                }
                
                // Find match between two cards that is opened
                if(openCards[0].dataset.column == openCards[1].dataset.column) {
                    openCards.forEach(card => {
                        card.classList.add('match')
                        card.classList.remove('open', 'show')
                    })
                    openCards = []
                    clickCount = 0
                    matchCount += 1
    
                    if(matchCount == 8) {
                        endTime = Date.now();
                        spendTime = endTime - startTime;
                        console.log(handleTime(spendTime))
                        // show win message in modal window
                        modal.classList.add('show')
                        modal.classList.remove('hide')
                        modalBodyText.innerHTML = `You win the game. You moved <strong>${moveCount}</strong> times with <strong>${starRating}</strong> stars. Your time record is <strong>${handleTime(spendTime)}</strong> `
                    }
    
                } else {
                    // If cards are not in match, turn them back
                    setTimeout(function(){
                        openCards.forEach(card => {
                            card.classList.remove('open', 'show', 'flip-forward')
                            card.classList.add('flip-backward')
                        })
                        openCards=[]
                        clickCount = 0
                    }, 1000)
                }
            }
        } 
    }
    
}

deck.addEventListener('click', function(e){
    matchCard(e)
})
deck.addEventListener('touchstart', function(e){
    matchCard(e)
})


// modal 

const modal = document.querySelector('.modal')
const modalClose = document.querySelector('.modal-close')
const modalRestart = document.querySelector('.modal-restart')
const modalBodyText = document.querySelector('.modal-body-text')

modalRestart.addEventListener('click', function(){
    init()
    modal.classList.add('hide')
    modal.classList.remove('show')
})

modalClose.addEventListener('click', function(){
    modal.classList.add('hide')
    modal.classList.remove('show')
})


// console.log(performance.now())


function handleTime(time) {
    const date = new Date(time)
    const minute = date.getMinutes()
    const seconds = date.getSeconds()
    let displayTime;

    if (minute < 10 && seconds < 10) {
        displayTime = `0${minute}:0${seconds}`
    } else if(minute < 10 && seconds > 10) {
        displayTime = `0${minute}:${seconds}`
    } else if(minute > 10 && seconds < 10) {
        displayTime = `${minute}:0${seconds}`
    } else {
        displayTime = `${minute}:${seconds}`
    }
    return displayTime
}