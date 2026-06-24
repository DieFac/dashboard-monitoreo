import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Intentar leer del archivo JSON guardado por GitHub Actions
    const dataPath = path.join(process.cwd(), 'data', 'status.json');
    
    if (fs.existsSync(dataPath)) {
      const jsonData = fs.readFileSync(dataPath, 'utf-8');
      const data = JSON.parse(jsonData);
      res.status(200).json(data);
      return;
    }

    // Si el archivo no existe, devolver datos por defecto
    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      services: [
        {
          id: 1,
          name: 'Azure Status (Microsoft)',
          url: 'https://azure.status.microsoft.com/es-es/status',
          status: 'operativo',
          details: 'Esperando primer scraping',
          availability: 99.8,
          incidents: 0,
          source: 'default',
          lastCheck: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Microsoft 365 Status',
          url: 'https://status.cloud.microsoft.com/m365/referrer=serviceStatusRedirect',
          status: 'operativo',
          details: 'Esperando primer scraping',
          availability: 99.8,
          incidents: 0,
          source: 'default',
          lastCheck: new Date().toISOString()
        },
        {
          id: 3,
          name: 'Citrix Cloud Status',
          url: 'https://status.cloud.com/',
          status: 'operativo',
          details: 'Esperando primer scraping',
          availability: 99.8,
          incidents: 0,
          source: 'default',
          lastCheck: new Date().toISOString()
        },
        {
          id: 4,
          name: 'Microsoft 365 (Downdetector Perú)',
          url: 'https://downdetector.pe/problemas/microsoft-365/',
          status: 'operativo',
          details: 'Esperando primer scraping',
          availability: 99.8,
          incidents: 0,
          source: 'default',
          lastCheck: new Date().toISOString()
        },
        {
          id: 5,
          name: 'Microsoft Azure (Downdetector Perú)',
          url: 'https://downdetector.pe/problemas/windows-azure/',
          status: 'operativo',
          details: 'Esperando primer scraping',
          availability: 99.8,
          incidents: 0,
          source: 'default',
          lastCheck: new Date().toISOString()
        }
      ],
      note: 'Datos por defecto - en espera de GitHub Actions'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
