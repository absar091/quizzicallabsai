const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const input = path.join(__dirname, '..', 'public', 'favicon.svg');
const out = path.join(__dirname, '..', 'public');

if (!fs.existsSync(input)) {
  console.error('Input SVG not found:', input);
  process.exit(1);
}

async function generate() {
  try {
    const buf32 = await sharp(input).resize(32, 32).png().toBuffer();
    const buf16 = await sharp(input).resize(16, 16).png().toBuffer();
    const buf192 = await sharp(input).resize(192, 192).png().toBuffer();
    const buf512 = await sharp(input).resize(512, 512).png().toBuffer();

  fs.writeFileSync(path.join(out, 'favicon-32x32.png'), buf32);
  fs.writeFileSync(path.join(out, 'icon-192.png'), buf192);
  fs.writeFileSync(path.join(out, 'icon-512.png'), buf512);

  // Note: ICO generation was removed to avoid a devDependency that is unavailable
  // in some environments (e.g., Vercel). If you need a favicon.ico, generate it
  // locally using an ICO tool or convert the PNGs with an external utility.

    console.log('Icons generated successfully in', out);
  } catch (err) {
    console.error('Icon generation failed:', err);
    process.exit(1);
  }
}

generate();