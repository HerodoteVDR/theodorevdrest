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
		return collection.getAllSorted().filter(page => page.data.importance && page.data.importance > 0)
			.sort((pageA, pageB) => {
				return pageB.data.importance - pageA.data.importance;
			});
	});

	eleventyConfig.addCollection('socialMedias', function(collection) {
		return [
			{ name: 'Mail', url: 'mailto:theodorevdrest@gmail.com', icon: '/assets/svg/mail.svg', alt: 'theodorevdrest@gmail.com', description: 'Mailing me is the easiest option to contact me for a professional request.' },
			{ name: 'Facebook', url: 'https://www.facebook.com/theodore.vanderrest', icon: '/assets/svg/facebook.svg', alt: "theodore.vanderrest", description: 'Truly unprofessional Facebook page, to sell all my data to big companies'},
			{ name: 'GitHub', url: 'https://github.com/HerodoteVDR', icon: '/assets/svg/github.svg', alt:'@HerodoteVDR', description: 'I like to post some of my work on GitHub, I believe in the amazing power of open source' },
			{ name: 'Phone', url: 'tel:+32493397328', icon: '/assets/svg/phone.svg', alt: '0493397328', description: 'The most straightforward way of discovering my belgian accent' },
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
					return await Image(buffer, {
						formats: ["webp"],
						outputDir: "./dist/assets/img/output",
						urlPath: "/assets/img/output/",
					});
				})
			);

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
