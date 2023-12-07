---
title: "My blog is live !"
layout: "newpost.njk"
cover: "src/assets/img/news/release.jpg"
recenter: "bottom"
alt: "figma illustration"
date: Created 
emoji: 🚀
mood: https://open.spotify.com/embed/track/0QeI79sp1vS8L3JgpEO7mD?utm_source=generator

updated: false
archived: false
---

## Hello ! And welcome ! 

The purpose of this blog is to have my own place on the internet to post my work and my thoughts. It was made using [11ty](https://www.11ty.dev/), a great static site generator. I discovered through [Jérôme Coupé's introduction to eleventy](https://github.com/jeromecoupe/iad_eleventy_introduction/blob/master/eleventy_introduction_en.md), as a former student of this fellow, he inspired me in a various ways to create this blog. Here is his [(Web)Stoemp](https://www.webstoemp.com/).

## 11ty workarounds

![It can be fun](https://www.legroupe-r.com/uploads/common/_500x500_crop_center-center_none/JBO3.jpg)

#### How I generated all my optimised images

With [Sharp](https://sharp.pixelplumbing.com/), you can crop and resize your image super fast.
```javascript

async function resizeImage(src, width, height, mode) {
    return await Sharp(src)
        .resize({ width: width, height: height, fit: mode })
        .toBuffer();
}

```

```

```javascript

eleventyConfig.addShortcode("myImage", async function(src, alt, smallSize, midSize, bigSize) {
        try {
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
            const srcset = metadata.map((data, index) => {
                const width = [smallSize, midSize, bigSize][index][0];
                return `${data.webp[0].url} ${width}w`;
            }).join(', ');

            let imageAttributes = {
                alt,
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

            console.log(`Generated image HTML:`, imageHTML);

            return imageHTML;
        } 
        catch (error) {
            console.error(`Error in myImage shortcode:`, error);
            return "";
        }



