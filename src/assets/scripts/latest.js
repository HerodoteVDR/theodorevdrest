var cards = document.getElementsByClassName('c-latest__item');
console.log(cards);

for (let i = 0; i < cards.length; i++) {
    const card = cards[i]; // Utilisez "cards" au lieu de "array"
    card.addEventListener('mouseover', function() {
		onCardHover(card, cards);
	});
}

function onCardHover(ccard, ccards) {
	for (let i= 0; i < ccards.length; i++) {
		const thisCard = ccards[i];
		if(thisCard.classList.contains('selected')) {
			thisCard.classList.add('previous');
		}
		else {
			thisCard.classList.remove('previous');
		}
		thisCard.classList.remove('selected')	
	}	

	ccard.classList.add('selected')
}
