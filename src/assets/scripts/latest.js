var cards = document.getElementsByClassName('c-latest__item')

for (let i = 0; i < cards.length; i++) {
	const card = array[i];
	card.addEventListener('mouseover', function() {
		console.log("mouseover")
	})
}
