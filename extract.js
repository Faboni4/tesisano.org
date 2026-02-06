const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, 'data.js');
const outputFile = path.join(__dirname, 'data_new.js');
const imagesDir = path.join(__dirname, 'public', 'images');

// Ensure images directory exists
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

// Create streams
// explicit encoding ensures we get strings, not buffers
const readStream = fs.createReadStream(inputFile, { encoding: 'utf8', highWaterMark: 64 * 1024 });
const writeStream = fs.createWriteStream(outputFile, { encoding: 'utf8' });

let buffer = '';
let globalImageCount = 0;
// Overlap size should be enough to cover the "data:image/xxxxx;base64," header part. 
// If a chunk splits right in the middle of this header, we need to ensure we don't flush it.
const OVERLAP_SIZE = 100;

console.log('Starting extraction process...');

readStream.on('data', (chunk) => {
    buffer += chunk;

    // Regex explanation:
    // data:image\/(?<ext>[a-zA-Z]+);base64,  -> Matches the header, capturing extension
    // (?<data>[A-Za-z0-9+/=]+)               -> Matches the base64 content (greedy)
    const regex = /data:image\/([a-zA-Z]+);base64,([A-Za-z0-9+/=]+)/g;

    let match;
    let processedUntil = 0;

    while ((match = regex.exec(buffer)) !== null) {
        // Crucial Check: If the match goes all the way to the end of the current buffer,
        // it might be incomplete (split across chunks). We wait for more data.
        if (match.index + match[0].length === buffer.length) {
            break;
        }

        // Write everything before this match to the output file
        writeStream.write(buffer.slice(processedUntil, match.index));

        // Extract Details
        const ext = match[1]; // e.g., 'png', 'jpeg'
        const base64Data = match[2];

        // Save Image
        globalImageCount++;
        const imageName = `image_${globalImageCount}.${ext}`;
        const imagePath = path.join(imagesDir, imageName);
        const webPath = `/public/images/${imageName}`; // The replacement string

        try {
            fs.writeFileSync(imagePath, Buffer.from(base64Data, 'base64'));
        } catch (err) {
            console.error(`Failed to save image ${imageName}:`, err.message);
        }

        // Write replacement path to output file
        writeStream.write(webPath);

        // Move pointer forward
        processedUntil = match.index + match[0].length;
    }

    // Determine what to keep in the buffer for the next iteration
    let remaining = buffer.slice(processedUntil);

    // We strictly keep the last OVERLAP_SIZE characters to handle split headers.
    // If the remaining buffer is larger, we can safely flush the older part.
    // If it's smaller, we keep it all.
    if (remaining.length > OVERLAP_SIZE) {
        const toWrite = remaining.slice(0, remaining.length - OVERLAP_SIZE);
        writeStream.write(toWrite);
        buffer = remaining.slice(remaining.length - OVERLAP_SIZE);
    } else {
        buffer = remaining;
    }
});

readStream.on('end', () => {
    // Process any final matches in the remaining buffer (unlikely to be split at very end)
    const regex = /data:image\/([a-zA-Z]+);base64,([A-Za-z0-9+/=]+)/g;
    let match;
    let processedUntil = 0;

    while ((match = regex.exec(buffer)) !== null) {
        writeStream.write(buffer.slice(processedUntil, match.index));
        const ext = match[1];
        const base64Data = match[2];

        globalImageCount++;
        const imageName = `image_${globalImageCount}.${ext}`;
        const imagePath = path.join(imagesDir, imageName);
        const webPath = `/public/images/${imageName}`;

        fs.writeFileSync(imagePath, Buffer.from(base64Data, 'base64'));
        writeStream.write(webPath);
        processedUntil = match.index + match[0].length;
    }

    // Flush whatever is left
    writeStream.write(buffer.slice(processedUntil));
    writeStream.end();

    console.log('------------------------------------------------');
    console.log(`Extraction complete.`);
    console.log(`Total images extracted: ${globalImageCount}`);
    console.log(`New data file created: ${outputFile}`);
    console.log(`Images saved in: ${imagesDir}`);
    console.log('------------------------------------------------');
});

readStream.on('error', (err) => {
    console.error('Error reading input file:', err);
});

writeStream.on('error', (err) => {
    console.error('Error writing output file:', err);
});
