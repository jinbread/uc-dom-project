

const cards = [
    'fa-diamond', 'fa-diamond', 
    'fa-paper-plane-o', 'fa-paper-plane-o', 
    'fa-anchor', 'fa-anchor', 
    'fa-bolt', 'fa-bolt', 
    'fa-bomb', 'fa-bomb', 
    'fa-cube', 'fa-cube', 
    'fa-leaf', 'fa-leaf', 
    'fa-bicycle', 'fa-bicycle', 
]

function generateCard(card) {
    return `<li class="card" data-column=${card}><i class="fa ${card}"></i></li>` 
}

const deck = document.querySelector('.deck')
const stars = document.querySelectorAll('.stars .fa')
const restart = document.querySelector('.restart')


let openCards = []
const cardList = document.querySelectorAll('.card')

let matchCount = 0;
const starCount = 11;
let starRating = 0;
let clickCount = 0;
let moveCount = 0;

const moves = document.querySelector('.moves')
moves.textContent = moveCount;


function init() {
    shuffle(cards)
    const cardHTML = cards.map(function(card){
        return generateCard(card)
    })
    deck.innerHTML = cardHTML.join(' ')
    matchCount = 0
    clickCount = 0
    moveCount = 0
    starRating = 0
    moves.textContent = moveCount;
    stars.forEach(star => {
        star.classList.remove('fa-star-o')
        star.classList.add('fa-star')
    })

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

deck.addEventListener('click', function(e){
    if(e.target.classList.contains('card') 
    && !e.target.classList.contains('show') 
    && !e.target.classList.contains('open') 
    && !e.target.classList.contains('match')){
        // ClickCount prevents opening the third card
        if(clickCount < 2) {
            clickCount += 1

            // Open the card and add it to the openCards array
            e.target.classList.add('open', 'show')
            openCards.push(e.target)
            
            // When the openCards array has two cards,
            if(openCards.length >= 2) {
                // Count how many times the player move and update the counter
                moveCount += 1;
                moves.textContent = moveCount;

                // If the move of the player reaches the limit, reduce the star rating
                if(moveCount > starCount - 3 && starCount - moveCount >= 0) {
                    stars[starCount - moveCount].classList.remove('fa-star')
                    stars[starCount - moveCount].classList.add('fa-star-o')
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
                        if (moveCount < starCount) {
                            starRating = starCount - moveCount
                        } else {
                            starRating = 0
                        }
                        

                        alert('You win the game. You moved ' + moveCount + ' times with ' + starRating + ' stars!' )
                        // document.querySelector('.container').innerHTML = `<div><h1>You win the game. You moved ${moveCount} times.</h1></div>`
                    }
    
                } else {
                    // If cards are not in match, turn them back
                    setTimeout(function(){
                        openCards.forEach(card => {
                            card.classList.remove('open', 'show')
                        })
                        openCards=[]
                        clickCount = 0
                    }, 1000)
                }
            }
        } 
    }
    
})

