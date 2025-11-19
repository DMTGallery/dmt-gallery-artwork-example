# Circle
Circle is an example artwork made for DMT Gallery for the purpose of educating artists. This tutorial assumes you have knowledge of HTML, CSS, JS. 

Also, we have deployed this artwork on-chain on Bitcoin Mainnet. [Feel free to explore it here](https://ordinals.com/inscription/eb3eee3fa15069b1d922c31b90a9e3ccb3033651f5f03f61c0ccd9e57de6a183i0).
> [!NOTE]  
> This page continues [this tutorial](https://dmt-gallery.gitbook.io/doc/artists/technical-requirements). If you haven't read it, but want to make an artwork for DMT Gallery, it's highly recommended you do.

As you already know, the 2 primary components of any DMT Gallery artwork are:
1. The artwork script.
2. The traits script.

Here we will only review the artwork script (full source code is in the `circle-artwork.html` file in this repository), since [this page](https://dmt-gallery.gitbook.io/doc/artists/technical-requirements#what-you-need-to-provide) has already told you everything about the traits script.

The traits script for this artwork can also be found in this repository (the `circle-traits-script.js` file).

### The artwork script
Beginning of the artwork script is pretty standard, so we omitted the CSS styles to keep it shorter:
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <meta charset="UTF-8"/>
    <title>Circle</title>
    <style>
        /* 
        Styles for the states of the artwork page.
        (we'll go over the states your artwork page should have).
        Feel free to change this CSS to adjust the visuals.
        */
    </style>
</head>
<body>
<script id="dmt-mint-block" data-block-number="DMT_MINT_BLOCK_NUMBER"></script>
```
In the script above, pay attention to the last line.
This is a ["dataset" element](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset), all it does is it holds data. This data is accessible from JS.
In this dataset, the `blockNumber` key holds `DMT_MINT_BLOCK_NUMBER` value.

Right now, this value is just a placeholder.
When users mint your project, the art they'll get is this script, but with all `DMT_MINT_BLOCK_NUMBER` occurrences replaced.
**In your artwork**, **this line must be exactly the same**.

> [!WARNING]  
> Don't use the `DMT_MINT_BLOCK_NUMBER` string anywhere else in your artwork code, 
> unless you want it replaced with a block number of a minter's dmt-mint json.

**You will use this block number to load data of the block, that will "seed" your artwork**. We will tell you how to do it later. For now, just remember, that this is how users get different artwork variations from the same script.

> [!TIP]  
> For the curious ones, all mints have a dmt-mint json embedded into their content.
> That's where this block number will come from, to later be injected into your artwork script.
> The dmt-mint json acts as an "on-chain certificate", which secures the fact, that a Bitcoin block
> with the right element has been used to mint your artwork.
> 
> We cannot hand-pick block numbers, we can only choose an element.
> And then, the blocks with the element are the blocks we can use to create mints of your artwork.
> This is how Bitcoin "seeds" your artwork non-arbitrarily and defines the supply cap (supply of mints = supply of element).

Let's move on to the next code segment!
```
<div class="page-div" id="no-access-to-on-chain-page">
    <div class="flex-column-centered">
        <p>
            Your environment doesn't provide access to Bitcoin's on-chain data.<br/>
            Either view this artwork from an ordinals viewer or add recursion support.
        </p>
    </div>
</div>
<div class="page-div" id="dmt-mint-not-injected-page">
    <div class="flex-column-centered">
        <p id="dmt-mint-not-injected-text">
            A "dmt-mint" json, which points to a specific Bitcoin block, hasn't been injected.<br/>
            You can still explore this artwork by generating it from data of a random Bitcoin block:
        </p>
        <button onclick="onGenerateArtworkClick()">Generate</button>
    </div>
</div>
<script>
    // Get html elements of pages.
    let noRecursionSupportPageElement = document.getElementById('no-access-to-on-chain-page');
    let dmtMintNotInjectedPageElement = document.getElementById('dmt-mint-not-injected-page');

    // Define a boolean to prevent "Generate" double click.
    let startedGeneratingArtwork = false;

    // Check, whether a dmt-mint block has been injected into the script.
    // If it has been injected, the artwork script will load the artwork right away.
    const dmtMintBlock = document.getElementById('dmt-mint-block');
    const injectedMintBlockNumber = parseInt(dmtMintBlock.dataset.blockNumber);
    const blockNumberNotInjected = !blockNumberValid(injectedMintBlockNumber);

    // Below are the methods to show/hide error pages conveniently.
    function showDmtMintNotInjectedPage() {
        if (dmtMintNotInjectedPageElement != null) {
            dmtMintNotInjectedPageElement.style.display = 'flex';
        }
    }

    function removeDmtMintNotInjectedPage() {
        if (dmtMintNotInjectedPageElement != null) {
            dmtMintNotInjectedPageElement.remove();
            dmtMintNotInjectedPageElement = null;
        }
    }

    function showNoRecursionSupportPage() {
        if (noRecursionSupportPageElement != null) {
            noRecursionSupportPageElement.style.display = 'flex';
        }
    }

    function removeNoRecursionSupportPage() {
        if (noRecursionSupportPageElement != null) {
            noRecursionSupportPageElement.remove();
            noRecursionSupportPageElement = null;
        }
    }

    // This method helps us understand, whether a valid 
    // dmt-mint json block number has been injected.
    function blockNumberValid(blockNumber) {
        return Number.isInteger(blockNumber) && blockNumber >= 0;
    }

    // Implementation for the "Generate" button, which triggers rendering of this artwork from a random block.
    async function onGenerateArtworkClick() {
        if (!startedGeneratingArtwork) {
            startedGeneratingArtwork = true;
            removeDmtMintNotInjectedPage();
            removeNoRecursionSupportPage();
            await setupArtwork(null);
        }
    }

    // A convenience function to log all of the current traits into console.
    // Assumes, that the traits script has been imported into this script.
    function logArtworkTraits(seedBlockData) {
        const traitsString = JSON.stringify(calculateTraits(seedBlockData), null, 2);
        console.log(`This variation is generated from data of Bitcoin block ${seedBlockData.height}.`);
        console.log("Artwork traits:\n" + traitsString);
    }

    // Just shows the "Bitcoin data not available" error page properly in 1 method.
    function onFailedToReachRecursiveEndpoint() {
        showNoRecursionSupportPage();
        removeDmtMintNotInjectedPage();
    }
</script>
```
When your artwork script is run, it is possible, that data, that the script tries to load from Bitcoin, is not available (for example, when the PC doesn't have Bitcoin and ord running). Since all of our art is fully on-chain, "access to on-chain" must be provided.

Users, who run your artwork, may not know it. This is why, in case of errors, we need to display some text, that will explain, why the artwork hasn't been shown.

The code above is essentially that, plus some other minor things. Now, let's explore in more detail:

1. `<div class="page-div" id="no-access-to-on-chain-page"></div>` - element of the page, which contains a "Bitcoin data is not available" message. Show it, when a request for Bitcoin data fails.
2. `<div class="page-div" id="dmt-mint-not-injected-page">` - element of the page, which contains a message about the fact, that a dmt-mint block number hasn't been injected. Such error is possible, when people find and view your artwork inscription directly, instead of viewing their mint. This page provides a "Generate" button, which should generate an artwork from a random Bitcoin block. 
3. `<script>...</script>` - a script, which manages the divs above + some other things. Go ahead and read the code, everything is marked with comments. All DMT Gallery artworks must use this script for error handling. You will see, how this script is used, during artwork initialization below.

Let's move on to the next code segment:

```
<!-- A tool for loading data of the block, that a "dmt-mint" json points to (also can load data of random blocks) -->
<script src='/content/576ad54f673471775515f9bd3c0a3fb2c4e6971ea3a919e2cde45fd2a91c3b4ai0' onerror="onFailedToReachRecursiveEndpoint()"></script>
<!-- Artwork traits script -->
<script src='/content/0a9102c61dac30d571c4ce04adb65237cf900e2a7942a4838899befceb618678i0' onerror="onFailedToReachRecursiveEndpoint()"></script>
<!-- Deterministic random script -->
<script>
    class Random {
        constructor(merkleRoot) {
            this.useA = false;
            const Sfc32 = function (hex) {
                let a = parseInt(hex.substring(0, 8), 16);
                let b = parseInt(hex.substring(8, 16), 16);
                let c = parseInt(hex.substring(16, 24), 16);
                let d = parseInt(hex.substring(24, 32), 16);
                return function () {
                    a |= 0;
                    b |= 0;
                    c |= 0;
                    d |= 0;
                    const t = (((a + b) | 0) + d) | 0;
                    d = (d + 1) | 0;
                    a = b ^ (b >>> 9);
                    b = (c + (c << 3)) | 0;
                    c = (c << 21) | (c >>> 11);
                    c = (c + t) | 0;
                    return (t >>> 0) / 4294967296;
                };
            };
            this.prngA = new Sfc32(merkleRoot.substring(0, 32));
            this.prngB = new Sfc32(merkleRoot.substring(32, 64));
            for (let i = 0; i < 1e6; i += 2) {
                this.prngA();
                this.prngB();
            }
        }

        randomDec() {
            this.useA = !this.useA;
            return this.useA ? this.prngA() : this.prngB();
        }

        randomDecFromRange(a, b) {
            return a + (b - a) * this.randomDec();
        }

        randomChoice(list) {
            return list[Math.floor(this.randomDecFromRange(0, list.length))];
        }
    }
</script>
```

Here we have some other dependencies the artwork will need. If you've read [this page](https://dmt-gallery.gitbook.io/doc/artists/technical-requirements#requirement-1-deterministic), you already know what the random script is for, so let's focus on the rest.

2 of the other dependencies are pulled directly from on-chain. When you set `src=` of a script to a URL without a hostname, the `GET` request is made to the current origin.
Your script can assume, that there is Bitcoin and ord running on the current origin.
But if there is no Bitcoin/ord, this must also be handled and explained to the user, like this: `onerror="onFailedToReachRecursiveEndpoint()"`.

GET `/content/<inscriptionId>` returns content of the inscription with the provided id. [Other requests, that can be made to get on-chain data](https://docs.ordinals.com/inscriptions/recursion.html).

Here is what the imported scripts do:
1. The first script gives you 2 methods: `loadRandomBlockData()` and `loadBlockData(blockNumber)`. Both methods return the block data object, field(s) of which you'll use as "seed". If `blockNumberNotInjected == true`, you show the error page with the "Generate" button and use `loadRandomBlockData()` during artwork initialization. Otherwise - use `loadBlockData(blockNumber)`.
2. The second script just imports the traits script. Every artwork must import its traits script, calculate and display mint's traits. Easiest way is to do this is to log them in console by invoking `logArtworkTraits(blockDataObject)`.

Now, let's move to the final part, where the artwork is initialized and drawn, where everything comes together!
I marked all the code with comments, so just read it and you'll understand.

```
<!-- Artwork script -->
<script>
    // Schedule invocation of the "setup()" method to initialize our artwork, as soon as the page is loaded.
    // If you use p5.js or similar alternatives, such "entry" method is already provided.
    window.onload = () => {
        setup();
    }

    // Create the artwork state variables.
    let circleRadius;
    let circleColor;

    // Starts artwork initialization. 
    function setup() {
        if (blockNumberNotInjected) {
            // Block of a dmt-mint json hasn't been injected into the script, communicate it to the user.
            showDmtMintNotInjectedPage();
        } else {
            // Block of a dmt-mint json has been injected into the script, we can start loading the artwork.
            setupArtwork(injectedMintBlockNumber);
            removeDmtMintNotInjectedPage();
            removeNoRecursionSupportPage();
        }
    }

    // The entry point into the "artwork" code.
    async function setupArtwork(blockNumber) {
        // Get the block, which we should use as "seed" for the artwork.
        let seedBlockData = null;
        try {
            if (blockNumber == null) {
                // If mint block number hasn't been injected, this is not a mint, the user has launched
                // your artwork directly and clicked "Generate" from the error page to render from a random block.
                seedBlockData = await loadRandomBlockData();
            } else {
                // This is a valid mint, which has to render a specific block.
                // Get the block data of this mint using the injected dmt-mint block number.
                seedBlockData = await loadBlockData(blockNumber);
            }
        } catch (e) {
            // Methods, that load block data, talk to Bitcoin.
            // If a request to Bitcoin failed, we show the appropriate error
            // and rethrow to stop the setupArtwork() method.
            onFailedToReachRecursiveEndpoint();
            throw e;
        }

        // Log the artwork traits (traits must be displayed on-chain, this is the easiest way to do it).
        logArtworkTraits(seedBlockData);

        // We have a block, ready to be used as "seed".
        // Make a "Random" object, seeded with the block's merkle root.
        const random = new Random(seedBlockData.merkle_root);

        // Setup a canvas we'll draw on.
        const canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        document.body.appendChild(canvas);

        // Initialize state to know what to draw.
        // Pay attention to the way the radius is set, it is not a constant value!
        // We multiply it by the lowest screen dimension to ensure it looks the same in any window size.
        circleRadius = random.randomDecFromRange(0.01, 0.5) * Math.min(canvas.width, canvas.height);
        circleColor = random.randomChoice([
            'lightyellow',
            'papayawhip',
            'seagreen',
            'olive',
            'lightcyan',
            'cadetblue',
            'cornflowerblue',
            'mediumslateblue',
            'lavender',
            'plum',
            'indigo',
            'snow',
            'beige',
            'oldlace',
            'gainsboro',
            'black'
        ]);

        // Draw the artwork.
        drawArtwork(canvas);
    }

    // Basic JS drawing :)
    function drawArtwork(canvas) {
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = circleColor;
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, circleRadius, 0, 2 * Math.PI);
        ctx.fill();
    }
</script>
</body>
</html>
```

Congratulations, you've finished the tutorial!
If you still have questions about making your artwork, jump into our Discord and ask, we'll be glad to help. 

Also, when making your artwork, feel free to copy this project. You'll need 70% of this code anyway (error handling, initialization), so this can act as a good starting point!