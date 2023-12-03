const Image = require("@11ty/eleventy-img");
const Sharp = require('sharp');

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
		return collection.getFilteredByGlob("./src/gallery/*.md").sort(function(a, b) {
			const dateA = new Date(a.data.date);
			const dateB = new Date(b.data.date);
			return dateB - dateA;	
		});
	});

	eleventyConfig.addCollection("news", function (collection) {
		return collection.getFilteredByGlob("./src/news/*.md").sort(function(a, b) {
			const dateA = new Date(a.data.date);
			const dateB = new Date(b.data.date);
			return dateB - dateA;	
		});
	});

	// filters
	eleventyConfig.addFilter("limit", function (array, limit) {
		return array.slice(0, limit);
	});

	eleventyConfig.addFilter("date", function (date, format) {
		var date = new Date(date);
		var year = date.getFullYear();
		var month = date.toLocaleString('en-US', { month: 'long' });
		var day = date.toLocaleString('en-US', { day: '2-digit' });
		switch (format) {
			case 'YYYY':
				return year;
			case 'MONTHDDYYYY':
				return `${month} ${day}, ${year}` ; 
			break;
			default:
				return date;
			break;
		}
	});

	eleventyConfig.addShortcode("myImage", async function(src, alt, smallSize, midSize, bigSize) {
		try {

			 console.log("Debug: myImage shortcode called with src:", src);

			if (!src) {
				console.error("Error: `src` is a required argument to the eleventy-img utility.");
				return "";
			}

			const resizedImageBuffer = await Promise.all([
				resizeImage(src, smallSize[0], smallSize[1], "cover"),
				resizeImage(src, midSize[0], midSize[1], "cover"),
				resizeImage(src, bigSize[0], bigSize[1], "cover"),
			]);

			const metadata = await Promise.all(
				resizedImageBuffer.map(async buffer => {
					return await Image(buffer, {
						formats: ["webp"],
						outputDir: "./dist/assets/img/output",
						urlPath: "/assets/img/output/",
					});
				})
			);

			console.log("Debug: Generated image metadata:", metadata);

			const srcset = metadata.map((data, index) => {
				const width = [smallSize, midSize, bigSize][index][0];
				return `${data.webp[0].url} ${width}w`;
			}).join(', ');

			let imageAttributes = {
				alt,
				sizes: `(min-width: 1050px) 1050px, (min-width: 750px) 750px, 100vw`,
				loading: "lazy",
				decoding: "async",
				class: "o-fluidimage"
			};

			const imageHTML = Image.generateHTML(metadata, imageAttributes);

			const sizes = `(min-width: 1050px) ${bigSize[0]}px, (min-width: 750px) ${midSize[0]}px, ${smallSize[0]}px`;

			const imageHTML = 
				`<picture> 
					<source media="(min-width: 1050px)" srcset="${metadata[2].webp[0].url}">
					<source media="(min-width: 750px)" srcset="${metadata[1].webp[0].url}">
					<img
						class="${ imageAttributes.class }" 
						alt="${ imageAttributes.alt }" 
						loading="${ imageAttributes.loading }
						decoding="${ imageAttributes.decoding }" 
						src="${ metadata[0].webp[0].url }"
					/>
				</picture>`;
			console.log("Debug: Generated image HTML:", imageHTML);

			return imageHTML;
		} 

		catch (error) {
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

async function resizeImage(src, width, height, mode) {
    return await Sharp(src)
        .resize({ width: width, height: height, fit: mode })
        .toBuffer();
}

function generateImageAttributes(metadata) {
    return {
        alt: metadata.alt,
        sizes: '(min-width: 1050px) 1050px, (min-width: 750px) 750px, 100vw',
        loading: "lazy",
        decoding: "async",
        class: "o-fluidimage"
    };
}
