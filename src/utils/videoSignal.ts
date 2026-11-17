export function createVideoSignalDetector(onSignalChange: (hasSignal: boolean) => void) {
  const sampleCanvas = document.createElement('canvas');
  sampleCanvas.width = 16;
  sampleCanvas.height = 9;
  const context = sampleCanvas.getContext('2d', { willReadFrequently: true });
  let noSignalSince: number | null = null;
  let lastSampleAt = 0;
  let hasSignal = true;

  return (source: CanvasImageSource, now: number) => {
    if (!context || now - lastSampleAt < 500) return;
    lastSampleAt = now;

    context.drawImage(source, 0, 0, sampleCanvas.width, sampleCanvas.height);
    const { data } = context.getImageData(0, 0, sampleCanvas.width, sampleCanvas.height);
    let darkPixels = 0;
    let totalLuminance = 0;

    for (let index = 0; index < data.length; index += 4) {
      const luminance = 0.299 * data[index] + 0.587 * data[index + 1] + 0.114 * data[index + 2];
      totalLuminance += luminance;
      if (luminance <= 12) darkPixels += 1;
    }

    const pixelCount = sampleCanvas.width * sampleCanvas.height;
    const likelyNoSignal = totalLuminance / pixelCount < 8 && darkPixels / pixelCount > 0.95;

    if (!likelyNoSignal) {
      noSignalSince = null;
      if (!hasSignal) {
        hasSignal = true;
        onSignalChange(true);
      }
      return;
    }

    noSignalSince ??= now;
    if (hasSignal && now - noSignalSince >= 1500) {
      hasSignal = false;
      onSignalChange(false);
    }
  };
}
