export function removeWhiteBackground(
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    threshold: number = 230
  ): void {
    // Get pixel data from the canvas context
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;  // Uint8ClampedArray of [r,g,b,a,...]
  
    // Iterate through every pixel (4 array entries per pixel)
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i+1], b = data[i+2];
      // If pixel is nearly white (above threshold in all channels):
      if (r >= threshold && g >= threshold && b >= threshold) {
        // Set alpha to 0 (make it transparent)
        data[i+3] = 0;
      }
      // (Optionally, could force non-white pixels to black here if desired)
    }
  
    // Put the modified data back on the canvas
    ctx.putImageData(imageData, 0, 0);
  }
  