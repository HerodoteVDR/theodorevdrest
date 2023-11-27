const Image = require("@11ty/eleventy-img");

module.exports = function(eleventyConfig) {

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

	eleventyConfig.addCollection("works", function (collection) {
		return collection.getFilteredByGlob("./src/gallery/*.md");
	});

	// filters
	eleventyConfig.addFilter("limit", function (array, limit) {
		return array.slice(0, limit);
	});

	eleventyConfig.addFilter("date", function (date, format) {
		var date = new Date(date);
		switch (format) {
			case 'YYYY':
				var year = date.getFullYear();
				return year;
			break;
			default:
				return date;
			break;
		}
	});

/*	

	eleventyConfig.addShortcode("myImage", async function(src, alt, sizes) {
		console.log(src);
		let metadata = await Image(src, {
			widths: [300, 600],
			formats: ["webp"],
			outputDir: "./dist/assets/img/output",
			urlPath: "/assets/img/output/",
		});

		let imageAttributes = {
			alt,
			sizes,
			loading: "lazy",
			decoding: "async",
			class: "o-fluidimage"
		};

		return Image.generateHTML(metadata, imageAttributes);
	});
	*/

	





	eleventyConfig.addShortcode("myImage", async function(src, alt, sizes) {
		try {
			console.log("Debug: myImage shortcode called with src:", src);

			if (!src) {
				console.error("Error: `src` is a required argument to the eleventy-img utility.");
				return "";
			}

			let metadata = await Image(src, {
				widths: [300, 600],
				formats: ["webp"],
				outputDir: "./dist/assets/img/output",
				urlPath: "/assets/img/output/",
			});

			console.log("Debug: Generated image metadata:", metadata);

			let imageAttributes = {
				alt,
				sizes,
				loading: "lazy",
				decoding: "async",
				class: "o-fluidimage"
			};

			const imageHTML = Image.generateHTML(metadata, imageAttributes);

			console.log("Debug: Generated image HTML:", imageHTML);

			return imageHTML;
		} catch (error) {
			console.error("Error in myImage shortcode:", error);
			return "";
		}
	});

	return {
		dir: {
			input: "src",
			output: "dist",
		},
	}


}
