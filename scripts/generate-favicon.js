const fs = require('fs');
const path = require('path');

// Simple ICO file generator for favicon
// This creates a basic ICO file structure with our SVG converted to a simple format

const icoHeader = Buffer.from([
  0x00, 0x00, // Reserved
  0x01, 0x00, // Type (1 = ICO)
  0x01, 0x00  // Number of images
]);

const icoEntry = Buffer.from([
  0x20,       // Width (32px)
  0x20,       // Height (32px) 
  0x00,       // Color count (0 = no palette)
  0x00,       // Reserved
  0x01, 0x00, // Color planes
  0x20, 0x00, // Bits per pixel (32)
  0x00, 0x00, 0x00, 0x00, // Image size (will be updated)
  0x16, 0x00, 0x00, 0x00  // Offset to image data
]);

// Simple 32x32 favicon data (RGBA format)
// This represents our Quizzicallabs logo in a simplified bitmap format
const faviconData = Buffer.alloc(32 * 32 * 4); // 32x32 pixels, 4 bytes per pixel (RGBA)

// Fill with gradient background and simple Q logo
for (let y = 0; y < 32; y++) {
  for (let x = 0; x < 32; x++) {
    const offset = (y * 32 + x) * 4;
    
    // Create gradient background (purple to pink)
    const gradientFactor = (x + y) / 64;
    const r = Math.floor(79 + gradientFactor * (236 - 79));   // 4f46e5 to ec4899
    const g = Math.floor(70 + gradientFactor * (72 - 70));
    const b = Math.floor(229 + gradientFactor * (153 - 229));
    
    // Simple Q shape in center
    const centerX = 16, centerY = 16;
    const dx = x - centerX, dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 12 && distance > 8) {
      // Outer ring of Q
      faviconData[offset] = 255;     // R (white)
      faviconData[offset + 1] = 255; // G
      faviconData[offset + 2] = 255; // B
      faviconData[offset + 3] = 255; // A
    } else if (x > centerX && y > centerY && distance < 15) {
      // Q tail
      faviconData[offset] = 255;     // R (white)
      faviconData[offset + 1] = 255; // G
      faviconData[offset + 2] = 255; // B
      faviconData[offset + 3] = 255; // A
    } else {
      // Background gradient
      faviconData[offset] = r;       // R
      faviconData[offset + 1] = g;   // G
      faviconData[offset + 2] = b;   // B
      faviconData[offset + 3] = 255; // A (fully opaque)
    }
  }
}

// Update image size in entry
const imageSize = faviconData.length;
icoEntry.writeUInt32LE(imageSize, 8);

// Combine all parts
const icoFile = Buffer.concat([icoHeader, icoEntry, faviconData]);

// Write to public directory
const outputPath = path.join(__dirname, '..', 'public', 'favicon.ico');
fs.writeFileSync(outputPath, icoFile);

console.log('✅ Generated favicon.ico successfully!');