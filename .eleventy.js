const Image = require("@11ty/eleventy-img");
const Sharp = require('sharp');

module.exports = function(eleventyConfig) {

	eleventyConfig.addPassthroughCopy("./src/assets/audio/");
	eleventyConfig.addPassthroughCopy("./src/assets/css/");
	eleventyConfig.addPassthroughCopy("./src/assets/favicon/");
	eleventyConfig.addPassthroughCopy("./src/assets/scripts/");
	eleventyConfig.addPassthroughCopy("./src/assets/svg/");
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
		return collection.getAllSorted().filter(page => page.data.importance && page.data.importance > 0)
			.sort((pageA, pageB) => {
				return pageB.data.importance - pageA.data.importance;
			});
	});

	eleventyConfig.addCollection('socialMedias', function(collection) {
		return [
			{ name: 'Mail', url: 'mailto:theodorevdrest@gmail.com', icon: '/assets/svg/mail.svg', alt: 'theodorevdrest@gmail.com', description: 'Mailing me is the easiest option to contact me for a professional request.' },
			{ name: 'LinkedIn', url: 'https://www.linkedin.com/in/theodore-van-der-rest/', icon: '/assets/svg/linkedin.svg', alt: "theodore-van-der-rest", description: 'Quickest way to check if I am open to work.'},
			{ name: 'GitHub', url: 'https://github.com/HerodoteVDR', icon: '/assets/svg/github.svg', alt:'@HerodoteVDR', description: 'I like to post some of my work on GitHub, I believe in the amazing power of open source' },
			{ name: 'Phone', url: 'tel:+32493397328', icon: '/assets/svg/phone.svg', alt: '+32493397328', description: 'The most straightforward way of discovering my belgian accent' },
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
			const dateA = new Date(a.date);
			const dateB = new Date(b.date);
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
		var month;
		var day = date.toLocaleString('en-US', { day: '2-digit' });
		switch (format) {
			case 'YYYY':
				return year;
			case 'MONTHDDYYYY':
			month = date.toLocaleString('en-US', { month: 'long' });
				return `${month} ${day}, ${year}` ; 
			break;
			case 'DDMMYYYY' :
				month = date.getMonth();
				return `${day}/${month}/${year}`;
			default:
				return date;
			break;
		}
	});

	eleventyConfig.addShortcode("myImage", async function(src, alt, smallSize, midSize, bigSize, recenter) {
		try {
			if (!src) {
				console.error(`Error: src is a required argument to the eleventy-img utility.`);
				return "";
			}

			const resizedImageBuffer = await Promise.all([
				resizeImage(src, smallSize[0], smallSize[1], "cover", recenter),
				resizeImage(src, midSize[0], midSize[1], "cover", recenter),
				resizeImage(src, bigSize[0], bigSize[1], "cover", recenter),
			]);

			const metadata = await Promise.all(
				resizedImageBuffer.map(async buffer => {
					const newalt = alt.replace(/\s/g, "").toLowerCase();
					const gImage = await Image(buffer, {
						formats: ["webp"],
						filenameFormat: function(id, src, width, format, options) {
							return `${width}w.${format}`;
						},
						outputDir: `./dist/assets/img/${newalt}`,
						urlPath: `/assets/img/${newalt}`,
					});
					return gImage;
				})
			);

			let imageAttributes = {
				alt: alt,
				loading: "lazy",
				decoding: "async",
				class: "o-fluidimage"
			};

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

			return imageHTML;
		} 

		catch (error) {
			console.error(`Error in myImage shortcode:`, error);
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

async function resizeImage(src, width, height, mode, position) {
	var pos;
	if(position) {
		pos = position;
	}
	else {
		pos = "center";
	}
    return await Sharp(src)
        .resize({ width: width, height: height, fit: mode, position: pos })
        .toBuffer();
}
