export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Si hay datos en memoria, devolverlos
    if (global.statusData) {
      return res.status(200).json(global.statusData);
    }

    // Fallback: datos por defecto
    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      services: [
        {
          id: 1,
          name: 'Azure Status (Microsoft)',
          url: 'https://azure.status.microsoft.com',
          status: 'operativo',
          details: 'Esperando scraping',
          availability: 99.8,
          incidents: 0,
          source: 'default',
          lastCheck: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Microsoft 365 Status',
          url: 'https://status.cloud.microsoft.com/m365',
          status: 'operativo',
          details: 'Esperando scraping',
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
          details: 'Esperando scraping',
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
          details: 'Esperando scraping',
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
          details: 'Esperando scraping',
          availability: 99.8,
          incidents: 0,
          source: 'default',
          lastCheck: new Date().toISOString()
        }
      ],
      note: 'Vercel Cron Scraping'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
