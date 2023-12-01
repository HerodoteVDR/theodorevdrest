var cards = document.getElementsByClassName('c-latest__item');
var buttonNext = document.querySelector('.c-button__next');
var buttonPrev = document.querySelector('.c-button__prev');
var descriptions = document.getElementsByClassName('c-latestparaph__item');

cards[0].classList.add('selected');
cards[1].classList.add('previous');
var currentButton=0;

var changeSelectedHandler = function (card) {
    if (window.innerWidth >= 1050) {
		currentButton = card.index;
        changeSelected(card, cards);
    }
};

if(window.innerWidth >= 1050) {
	for (let i = 0; i < cards.length; i++) {
		const card = cards[i];
		card.index = i;
		card.addEventListener('mouseover', function() {
			changeSelectedHandler(card);
		});
	}
}

window.addEventListener('resize', function () {
	if (window.innerWidth < 1050) {
		for (let i = 0; i < cards.length; i++) {
			const card = cards[i];
			card.index = i;
			card.removeEventListener('mouseover', function() {
				changeSelectedHandler(card);
			});
		}
	} 

	else {
        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
			card.index = i;
            card.addEventListener('mouseover', function () {
                changeSelectedHandler(card);
            });
        }
    }
});



buttonNext.addEventListener('click', function () {
    currentButton = (currentButton + 1) % cards.length;
    changeSelected(cards[currentButton], cards);
});

buttonPrev.addEventListener('click', function () {
    currentButton = (currentButton - 1 + cards.length) % cards.length;
    changeSelected(cards[currentButton], cards);
});

function changeSelected(ccard, ccards) {

	if(!ccard.classList.contains('selected')){
		for (let i= 0; i < ccards.length; i++) {
			const thisCard = ccards[i];

			thisCard.classList.remove('previous')	

			if(thisCard.classList.contains('selected')) {
				thisCard.classList.add('previous');
			}

		thisCard.classList.remove('selected')	
		descriptions[i].classList.remove('selected');
	}	

	ccard.classList.add('selected');
	ccard.classList.remove('previous');

	}

	descriptions[currentButton].classList.add('selected');
}
