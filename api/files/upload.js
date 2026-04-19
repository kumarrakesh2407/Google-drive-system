import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({
      uploadDir: '/tmp',
      keepExtensions: true,
    });

    const [fields, files] = await form.parse(req);
    const file = files.file[0];

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Create a mock file response
    const uploadedFile = {
      id: Date.now().toString(),
      name: file.originalFilename,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      type: file.mimetype || 'application/octet-stream',
      uploadDate: new Date().toISOString().split('T')[0]
    };

    // Clean up the temporary file
    if (fs.existsSync(file.filepath)) {
      fs.unlinkSync(file.filepath);
    }

    res.status(200).json(uploadedFile);
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
}
