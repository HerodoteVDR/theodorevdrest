var containers = document.getElementsByClassName('o-perspective');

console.log(containers);


for (let i = 0; i < containers.length; i++) {
	const container = containers[i];
	container.addEventListener('mousemove', function(event) {

		var x = (event.clientX - container.getBoundingClientRect().left) / container.offsetWidth - 0.5;
		var y = 0.5 - (event.clientY - container.getBoundingClientRect().top) / container.offsetHeight;

        var rotateX = y * -10;
        var rotateY = x * 20;

		var style = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
		container.style.transform = style;
		container.style.webkitTransform = style;
		container.style.mozTransform = style;
		container.style.msTransform = style;
		container.style.oTransform = style;

	})

	container.addEventListener('mouseleave', function() {
		container.style.transform = 'none';
	});
}

