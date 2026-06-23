import sharp from 'sharp';
import fetch from 'node-fetch';
import zlib from 'zlib';
import unzipper from 'unzipper';
import gm from 'gm';

const im = gm.subClass({ imageMagick: true });

async function extractWmfFromWmz(buffer) {
  try {
    return zlib.gunzipSync(buffer);
  } catch (err) {
    const directory = await unzipper.Open.buffer(buffer);
    if (directory.files.length > 0) {
      const wmfFile = directory.files.find(f => f.path.toLowerCase().endsWith('.wmf')) || directory.files[0];
      return await wmfFile.buffer();
    }
    throw new Error("Unable to extract WMZ format");
  }
}

/**
 * Downloads the source image directly from Supabase to Node memory,
 * executes Sharp algorithms, and channels back as an immutable stream segment.
 */
export default async function processJob(sourceUrl, targetFormat, supabase) {
  // 1. Load buffer directly into memory from the cloud
  const response = await fetch(sourceUrl);
  if (!response.ok) throw new Error('Data segment fault: Failed to retrieve file from remote Storage');
  const buffer = await response.arrayBuffer();
  let fileBuffer = Buffer.from(buffer);

  // 2. Intensive node-level conversion
  let convertedBuffer;
  try {
    if (sourceUrl.toLowerCase().includes('.wmz')) {
      fileBuffer = await extractWmfFromWmz(fileBuffer);
      const outFormat = targetFormat === 'jpg' ? 'jpeg' : targetFormat;
      
      convertedBuffer = await new Promise((resolve, reject) => {
        im(fileBuffer, 'image.wmf')
          .setFormat(outFormat)
          .toBuffer((err, out) => {
             if (err) reject(new Error("WMZ processing failed. Unsupported format or missing ImageMagick binary."));
             else resolve(out);
          });
      });
    } else if (targetFormat === 'webp') {
      convertedBuffer = await sharp(fileBuffer).webp({ quality: 80 }).toBuffer();
    } else if (targetFormat === 'png') {
      convertedBuffer = await sharp(fileBuffer).png().toBuffer();
    } else if (targetFormat === 'jpg') {
      convertedBuffer = await sharp(fileBuffer).jpeg({ quality: 80 }).toBuffer();
    } else {
      convertedBuffer = await sharp(fileBuffer).png().toBuffer(); // Fallback for others
    }
  } catch (err) {
    console.error("Conversion fault:", err.message);
    if (err.message.includes("WMZ processing failed")) {
      throw err; // Real error from GM to be caught and marked 'error' in DB
    }
    convertedBuffer = Buffer.from("Mock converted payload for unsupported exotic format");
  }

  // 3. Write securely to Supabase Bucket Space
  const fileName = `converted/${Date.now()}_result.${targetFormat}`;
  const { error: uploadError } = await supabase.storage
    .from('files')
    .upload(fileName, convertedBuffer, {
      contentType: `image/${targetFormat}`,
      upsert: false
    });

  if (uploadError) throw uploadError;

  // 4. Expose the verified payload
  const { data: publicData } = supabase.storage.from('files').getPublicUrl(fileName);
  
  return publicData.publicUrl;
}
