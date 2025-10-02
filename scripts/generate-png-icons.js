const fs = require('fs');
const path = require('path');

// Simple PNG generator for icons
// This creates basic PNG files with our logo design

function createPNG(width, height, filename) {
  // PNG signature
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);      // Width
  ihdrData.writeUInt32BE(height, 4);     // Height
  ihdrData.writeUInt8(8, 8);             // Bit depth
  ihdrData.writeUInt8(6, 9);             // Color type (RGBA)
  ihdrData.writeUInt8(0, 10);            // Compression
  ihdrData.writeUInt8(0, 11);            // Filter
  ihdrData.writeUInt8(0, 12);            // Interlace
  
  const ihdrChunk = createChunk('IHDR', ihdrData);
  
  // Create image data
  const imageData = Buffer.alloc(height * (width * 4 + 1)); // +1 for filter byte per row
  let offset = 0;
  
  for (let y = 0; y < height; y++) {
    imageData[offset++] = 0; // Filter type (None)
    
    for (let x = 0; x < width; x++) {
      // Create gradient background
      const gradientFactor = (x + y) / (width + height);
      const r = Math.floor(79 + gradientFactor * (236 - 79));
      const g = Math.floor(70 + gradientFactor * (72 - 70));
      const b = Math.floor(229 + gradientFactor * (153 - 229));
      
      // Simple Q logo in center
      const centerX = width / 2, centerY = height / 2;
      const dx = x - centerX, dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const radius = width * 0.35;
      
      if (distance < radius && distance > radius * 0.6) {
        // Q ring
        imageData[offset++] = 255; // R
        imageData[offset++] = 255; // G
        imageData[offset++] = 255; // B
        imageData[offset++] = 255; // A
      } else if (x > centerX && y > centerY && distance < radius * 1.1) {
        // Q tail
        imageData[offset++] = 255; // R
        imageData[offset++] = 255; // G
        imageData[offset++] = 255; // B
        imageData[offset++] = 255; // A
      } else {
        // Background
        imageData[offset++] = r;   // R
        imageData[offset++] = g;   // G
        imageData[offset++] = b;   // B
        imageData[offset++] = 255; // A
      }
    }
  }
  
  // Compress image data (simplified - just add zlib header/footer)
  const compressed = Buffer.concat([
    Buffer.from([0x78, 0x9C]), // zlib header
    imageData,
    Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]) // simplified footer
  ]);
  
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));
  
  // Combine all chunks
  const png = Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
  
  // Write file
  const outputPath = path.join(__dirname, '..', 'public', filename);
  fs.writeFileSync(outputPath, png);
  console.log(`✅ Generated ${filename} (${width}x${height})`);
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  
  const typeBuffer = Buffer.from(type, 'ascii');
  const crc = calculateCRC(Buffer.concat([typeBuffer, data]));
  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc, 0);
  
  return Buffer.concat([length, typeBuffer, data, crcBuffer]);
}

function calculateCRC(data) {
  // Simplified CRC calculation
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < data.length; i++) {
    crc ^= data[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc & 1) ? (0xEDB88320 ^ (crc >>> 1)) : (crc >>> 1);
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

// Generate different sizes
createPNG(192, 192, 'icon-192.png');
createPNG(512, 512, 'icon-512.png');
createPNG(32, 32, 'favicon-32x32.png');