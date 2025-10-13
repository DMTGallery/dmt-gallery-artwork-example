function calculateTraits(seedBlockData) {
    // Define random in the same way as in the artwork.
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
    const random = new Random(seedBlockData.merkle_root);

    // Get traits.
    let circleRadius = random.randomDecFromRange(0.01, 0.5);
    let circleColor = random.randomChoice([
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

    // Create the object, that contains all the artwork traits.
    const traits = {};

    // Set the "Size" trait.
    traits['Size'] = circleRadius < 0.15
        ? "Small"
        : circleRadius > 0.35
            ? "Large"
            : "Medium";

    // Set the "Color" trait.
    switch (circleColor) {
        case 'lightyellow':
            traits['Color'] = "Light yellow";
            break;
        case 'papayawhip':
            traits['Color'] = "Papaya whip";
            break;
        case 'seagreen':
            traits['Color'] = "Sea green";
            break;
        case 'olive':
            traits['Color'] = "Olive";
            break;
        case 'lightcyan':
            traits['Color'] = "Light cyan";
            break;
        case 'cadetblue':
            traits['Color'] = "Cadet blue";
            break;
        case 'cornflowerblue':
            traits['Color'] = "Corn flower blue";
            break;
        case 'mediumslateblue':
            traits['Color'] = "Medium slate blue";
            break;
        case 'lavender':
            traits['Color'] = "Lavender";
            break;
        case 'plum':
            traits['Color'] = "Plum";
            break;
        case 'indigo':
            traits['Color'] = "Indigo";
            break;
        case 'snow':
            traits['Color'] = "Snow";
            break;
        case 'beige':
            traits['Color'] = "Beige";
            break;
        case 'oldlace':
            traits['Color'] = "Old lace";
            break;
        case 'gainsboro':
            traits['Color'] = "Gainsboro";
            break;
        case 'black':
            traits['Color'] = "Black";
            break;
    }

    // Return the traits we've calculated.
    return traits;
}