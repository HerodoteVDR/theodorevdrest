---
title: "My blog is live !"
layout: "newpost.njk"
cover: "src/assets/img/news/release.jpg"
recenter: "bottom"
alt: "Launch"
date: Created 
emoji: 🚀
mood: https://open.spotify.com/embed/track/0QeI79sp1vS8L3JgpEO7mD?utm_source=generator
smalldescription: "How I created this blog"

updated: false
archived: false
---

## Hello ! And welcome ! 

The purpose of this blog is to have my own place on the internet to post my work and my thoughts. It was made using [11ty](https://www.11ty.dev/), a great static site generator I discovered through [Jérôme Coupé's introduction to eleventy](https://github.com/jeromecoupe/iad_eleventy_introduction/blob/master/eleventy_introduction_en.md). As a former student of this fellow, he inspired me in a various ways to create this blog. Here is his [website](https://www.webstoemp.com/).  

The source code of this website is also available here on [Github](https://github.com/HerodoteVDR/theodorevdrestportfolio), under an MIT License that let's you get the code. Please credit me if you want to use my work.

## One feature I loved implementing : responsive & optimised images generation 

11ty is awesome because it's very a very simple and lightweight SSG. From it's simple core, it let's you build your website and it's own tools, extending its capabilities in the most dynamic and thrilling way possible. Coming from a Craft CMS project, I was missing the image transform Craft was proposing, so I tried replicating it with Sharp and eleventy image plugin. 

#### How it works : 

With [Sharp](https://sharp.pixelplumbing.com/), you can crop and resize your image super fast.
```javascript
async function resizeImage(src, width, height, mode) {
    return await Sharp(src)
        .resize({ width: width, height: height, fit: mode })
        .toBuffer();
}
```

  
Then, with an ` eleventy.addShortcode ` async function inside your eleventy config, you can generate images at the sizes you want, directly from your templates.

```javascript
eleventyConfig.addShortcode("myImage", async function(src, alt, smallSize, midSize, bigSize, recenter) {
    const resizedImageBuffer = await Promise.all([
      resizeImage(src, smallSize[0], smallSize[1], "cover", recenter),
      resizeImage(src, midSize[0], midSize[1], "cover", recenter),
      resizeImage(src, bigSize[0], bigSize[1], "cover", recenter),
      ]);
}
```

Now we must generate the metadatas, and the image attributes that will be used to generate the html.

```javascript
const metadata = await Promise.all(
    resizedImageBuffer.map(async buffer => {
        return await Image(buffer, {
            formats: ["webp"],
            outputDir: "./dist/assets/img/output",
            urlPath: "/assets/img/output/",
        });
    })
);

let imageAttributes = {
    alt: alt,
    loading: "lazy",
    decoding: "async",
    class: "o-fluidimage"
};
```

We can now create the html :

```javascript
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
```

And call that function from your favorite templating language, here [Nunjucks](https://mozilla.github.io/nunjucks/)

```twig
{# myImage source, alt,  [350, 250], [480, 200], [750, 350] #}
```

And here you have a simple tool that generates all your cropped images. Of course you can extend the format compatibility for the images, allow positioning to the different corners of the image, and many more as sharp has a lot of cool features !
