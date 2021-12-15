const toGrayScale = (r, g, b) => (r + g + b) / 3;

const MAXIMUM_WIDTH = 452;
const MAXIMUM_HEIGHT = 600;

const clampDimensions = (width, height) => {
  if (height > MAXIMUM_HEIGHT) {
    const reducedWidth = Math.floor((width * MAXIMUM_HEIGHT) / height);
    return [reducedWidth, MAXIMUM_HEIGHT];
  }

  if (width > MAXIMUM_WIDTH) {
    const reducedHeight = Math.floor((height * MAXIMUM_WIDTH) / width);
    return [MAXIMUM_WIDTH, reducedHeight];
  }

  return [width, height];
};

const convertToGrayScales = (context, width, height) => {
  const imageData = context.getImageData(0, 0, width, height);

  const grayScales = [];

  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];

    const grayScale = toGrayScale(r, g, b);
    imageData.data[i] =
      imageData.data[i + 1] =
      imageData.data[i + 2] =
        grayScale;

    grayScales.push(grayScale);
  }

  context.putImageData(imageData, 0, 0);

  return grayScales;
};

const grayRamp =
  "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,\"^`'. ";
const rampLength = grayRamp.length;

const getCharacterForGrayScale = (grayScale) =>
  grayRamp[Math.ceil((rampLength / 255) * grayScale - 1)];

const drawAscii = (grayScales, width) => {
  const asciiArt = document.getElementById("ascii-art");
  const ascii = grayScales.reduce((asciiImage, grayScale, index) => {
    let nextChars = getCharacterForGrayScale(grayScale);

    if ((index + 1) % width === 0) {
      nextChars += "\n";
    }

    return asciiImage + nextChars;
  }, "");

  asciiArt.textContent = ascii;
};

const init = () => {
  const canvas = document.getElementById("preview");
  const ctx = canvas.getContext("2d");
  const input = document.getElementById("picture");

  input.onchange = (e) => {
    const file = e.target.files[0];
    console.log(file.type);
    if (file.type != "image/jpeg") return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const image = new Image();
      image.onload = () => {
        const [width, height] = clampDimensions(image.width, image.height);
        // const { width, height } = image;
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(image, 0, 0, width, height);
        drawAscii(convertToGrayScales(ctx, width, height), canvas.width);
      };
      image.src = event.target.result;
    };

    reader.readAsDataURL(file);
  };
};

window.addEventListener("DOMContentLoaded", init);
