let cards = ["ciri.png", "geralt.png", "jaskier.png", "jaskier.png", "iorweth.png", "triss.png",
  "geralt.png", "yen.png", "ciri.png", "triss.png", "yen.png", "iorweth.png"];

let oneCardIsVisible = false;
let turnCounter = 0;
let visibleNumber;
let lock = false;
let pairsLeft = cards.length / 2;
let gameStarted = false;

let cardHooks = getCardHookArray(cards);

let shuffledCards = shuffleCardList(cards);

$('#board').onload(startGame());

function startGame() {
  if (!gameStarted) {
    addEventListenersToCardHooks(cardHooks)
    gameStarted = true;
  }
}

function shuffleCardList(array) {

  let currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function getCardHookArray(array) {
  let numberOfElements = array.length;
  let cardHooks = [];
  for (let i = 0; i <= numberOfElements - 1; i++) {
    cardHooks[i] = $('#c' + i)[0];
  }
  return cardHooks;
}

function addEventListenersToCardHooks(cardHooks) {
  for (let i = 0; i <= cardHooks.length - 1; i++) {
    cardHooks[i].addEventListener('click', function () {
      revealCard(i);
    });
  }
}

function revealCard(cardNumber) {

  let isCardVisible = checkIfCardVisible(cardNumber);

  if (isCardVisible && !lock) {
    lock = true;
    showCard(cardNumber);
    if (!oneCardIsVisible) {
      storeCurrentVisibleCardNumber(cardNumber);
      lock = false;
    } else {
      checkIfCardsArePair(cardNumber);
      turnCounter++;
      updateCounter();
      oneCardIsVisible = false;
    }
  }
}

function hideTwoCards(firstCard, secondCard) {
  $('#c' + firstCard).css('opacity', 0);
  $('#c' + secondCard).css('opacity', 0);

  pairsLeft--;

  if (pairsLeft == 0) {
    gameOver();
  }
  lock = false;
}

function flipBackCards(firstCard, secondCard) {
  $('#c' + firstCard).css('background-image', 'url(img/karta.png');
  $('#c' + firstCard).addClass('card');
  $('#c' + firstCard).removeClass('cardActiv');

  $('#c' + secondCard).css('background-image', 'url(img/karta.png');
  $('#c' + secondCard).addClass('card');
  $('#c' + secondCard).removeClass('cardActiv');

  lock = false;
}

function showCard(cardNumber) {
  let image = "url(img/" + shuffledCards[cardNumber] + ")";
  $('#c' + cardNumber).css('background-image', image);
  $('#c' + cardNumber).addClass('cardActiv');
  $('#c' + cardNumber).removeClass('card');
}

function gameOver() {
  $('.board').addClass('won');
  $('.board').html('You won!<br>Done in ' + turnCounter + ' turns. <br> ' +
    '<span class="playAgain" onclick="window.location.reload();"' +
    'style="cursor: pointer;">Play Again?</span>');
  playAgain();
}

function playAgain() {
  $('.playAgain').hover(function () {
    $(this).css("color", "#E9B64A");
  }, function () {
    $(this).css("color", "#209781");
  });
}

function updateCounter() {
  $('.score').html('Turn counter: ' + turnCounter)
}

function timeoutHideTwoCards(cardNumber) {
  setTimeout(function () {
    hideTwoCards(cardNumber, visibleNumber)
  }, 750);
}

function timeoutFlipBackTwoCards(cardNumber) {
  setTimeout(function () {
    flipBackCards(cardNumber, visibleNumber)
  }, 1000);
}

function storeCurrentVisibleCardNumber(cardNumber) {
  visibleNumber = cardNumber
  oneCardIsVisible = true;
}

function checkIfCardsArePair(cardNumber) {
  if (shuffledCards[visibleNumber] == shuffledCards[cardNumber] && visibleNumber != cardNumber) {
    timeoutHideTwoCards(cardNumber);
  } else {
    timeoutFlipBackTwoCards(cardNumber);
  }
}

function checkIfCardVisible(cardNumber) {
  let cardOpacityValue = $('#c' + cardNumber).css('opacity');
  if (cardOpacityValue != 0) return true;
  else return false;
}
