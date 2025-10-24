// Utility to create a cropped image blob from an image url and crop area
// Uses an offscreen canvas. cropAreaPixels = { x, y, width, height }

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.setAttribute('crossOrigin', 'anonymous'); // needed to avoid CORS issues when cropping
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = url;
  });

export default async function getCroppedImg(imageSrc, crop) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext('2d');

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        return reject(new Error('Canvas is empty'));
      }
      resolve(blob);
    }, 'image/jpeg');
  });
}
