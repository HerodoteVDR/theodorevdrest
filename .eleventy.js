module.exports = function(eleventyConfig) {
	eleventyConfig.addPassthroughCopy("./src/css/");
	eleventyConfig.addWatchTarget("./src/css/");

	eleventyConfig.addPassthroughCopy("./src/assets/");
	eleventyConfig.addWatchTarget("./src/assets/");


	const markdownIt = require('markdown-it')
	const markdownItAttrs = require('markdown-it-attrs')
	const markdownItOptions = {
		html: true,
		breaks: true,
		linkify: true
	}

	const markdownLib = markdownIt(markdownItOptions).use(markdownItAttrs)
	eleventyConfig.setLibrary('md', markdownLib)

	eleventyConfig.addCollection('mainPages', function (collection) {
		return collection.getAllSorted().filter(page => page.data.importance && page.data.importance > 0);
	});

	eleventyConfig.addCollection('socialMedias', function(collection) {
		return [
			{ name: 'Mail', url: 'mailto:theodorevdrest@gmail.com', icon: '/assets/svg/mail.svg' },
			{ name: 'Facebook', url: 'https://www.facebook.com/theodore.vanderrest', icon: '/assets/svg/facebook.svg'},
			{ name: 'GitHub', url: 'https://github.com/HerodoteVDR', icon: '/assets/svg/github.svg' },
			{ name: 'Phone', url: 'tel:+32493397328', icon: '/assets/svg/phone.svg' },
		];
	});

	return {
		dir: {
			input: "src",
			output: "dist",
		},
	}
}

