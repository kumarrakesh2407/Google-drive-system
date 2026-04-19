export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Mock file data for demonstration
    const mockFiles = [
      {
        id: '1',
        name: 'Document.pdf',
        size: '2.5 MB',
        type: 'application/pdf',
        uploadDate: '2024-01-15'
      },
      {
        id: '2', 
        name: 'Presentation.pptx',
        size: '5.1 MB',
        type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        uploadDate: '2024-01-14'
      },
      {
        id: '3',
        name: 'Spreadsheet.xlsx',
        size: '1.8 MB',
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        uploadDate: '2024-01-13'
      }
    ];

    res.status(200).json(mockFiles);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
}
