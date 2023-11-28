var cards = document.getElementsByClassName('c-latest__item');
var buttonNext = document.querySelector('.c-button__next');
var buttonPrev = document.querySelector('.c-button__prev');

// the first one must be selected
cards[0].classList.add('selected');
cards[1].classList.add('previous');

// we add to every card it's event listener
for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    card.addEventListener('mouseover', function() {
		changeSelected(card, cards);
	});
}

var currentButton=0;

buttonNext.addEventListener('click', function() {
	if(currentButton>=cards.length) currentButton=0;
	changeSelected(cards[currentButton++], cards);
});

buttonPrev.addEventListener('click', function() {
	if(currentButton<0) currentButton=cards.length-1;
	changeSelected(cards[currentButton--], cards);
});

// now, every time we select a card we unselect every card, and select the new one
function changeSelected(ccard, ccards) {

	if(!ccard.classList.contains('selected')){
		for (let i= 0; i < ccards.length; i++) {
			const thisCard = ccards[i];

		thisCard.classList.remove('previous')	

		if(thisCard.classList.contains('selected')) {
			thisCard.classList.add('previous');
		}

		thisCard.classList.remove('selected')	
	}	

	ccard.classList.add('selected');
	ccard.classList.remove('previous');

	}
}
