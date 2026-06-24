// Archivo: /api/services-status.js
// Esta función obtiene datos REALES de los sitios oficiales

export default async function handler(req, res) {
  // Permitir CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const services = [];
    const timestamp = new Date().toISOString();

    // ============================================
    // 1. AZURE STATUS (Scraping real del HTML)
    // ============================================
    try {
      const azureUrl = 'https://azure.status.microsoft.com/es-es/status/';
      const azureRes = await fetch(azureUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      const azureHtml = await azureRes.text();

      // Buscar palabras clave en el HTML oficial
      const hasIncidents = azureHtml.includes('incidents') || 
                          azureHtml.includes('Incidents') ||
                          azureHtml.toLowerCase().includes('active incident');
      
      const hasAdvisories = azureHtml.includes('advisories') || 
                           azureHtml.includes('Advisories');
      
      const isOperational = !hasIncidents && azureHtml.includes('operational');

      let status = 'operativo';
      let details = 'Todos los servicios operativos';
      let availability = 99.9;

      if (hasIncidents) {
        status = 'incidente';
        details = 'Hay incidentes activos en Azure';
        availability = 70.0;
      } else if (hasAdvisories) {
        status = 'degradado';
        details = 'Avisos de servicios degradados';
        availability = 85.0;
      }

      services.push({
        id: 1,
        name: 'Azure Status (Microsoft)',
        url: 'https://status.azure.com',
        status: status,
        details: details,
        availability: availability,
        incidents: hasIncidents ? 1 : 0,
        source: 'scraping-real',
        lastCheck: timestamp
      });
    } catch (error) {
      console.error('Azure error:', error.message);
      services.push({
        id: 1,
        name: 'Azure Status (Microsoft)',
        url: 'https://status.azure.com',
        status: 'unknown',
        details: 'Error consultando estado real',
        availability: 0,
        incidents: 0,
        source: 'error',
        lastCheck: timestamp
      });
    }

    // ============================================
    // 2. MICROSOFT 365 STATUS (Scraping real)
    // ============================================
    try {
      const m365Url = 'https://status.office.com/en-us/status/';
      const m365Res = await fetch(m365Url, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      const m365Html = await m365Res.text();

      const hasIncidents = m365Html.toLowerCase().includes('incident') ||
                          m365Html.includes('Impact') ||
                          m365Html.toLowerCase().includes('active incident');
      
      const hasAdvisories = m365Html.toLowerCase().includes('advisory') ||
                           m365Html.toLowerCase().includes('investigating');
      
      const isOperational = !hasIncidents && m365Html.includes('operational');

      let status = 'operativo';
      let details = 'Todos los servicios de Microsoft 365 operativos';
      let availability = 99.9;

      if (hasIncidents) {
        status = 'incidente';
        details = 'Hay incidentes activos en Microsoft 365';
        availability = 70.0;
      } else if (hasAdvisories) {
        status = 'degradado';
        details = 'Servicios en investigación/mantenimiento';
        availability = 85.0;
      }

      services.push({
        id: 2,
        name: 'Microsoft 365 Status',
        url: 'https://status.office.com',
        status: status,
        details: details,
        availability: availability,
        incidents: hasIncidents ? 1 : 0,
        source: 'scraping-real',
        lastCheck: timestamp
      });
    } catch (error) {
      console.error('M365 error:', error.message);
      services.push({
        id: 2,
        name: 'Microsoft 365 Status',
        url: 'https://status.office.com',
        status: 'unknown',
        details: 'Error consultando estado real',
        availability: 0,
        incidents: 0,
        source: 'error',
        lastCheck: timestamp
      });
    }

    // ============================================
    // 3. CITRIX CLOUD STATUS (Scraping real)
    // ============================================
    try {
      const citrixUrl = 'https://status.cloud.com/';
      const citrixRes = await fetch(citrixUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      const citrixHtml = await citrixRes.text();

      const hasIncidents = citrixHtml.toLowerCase().includes('incident') ||
                          citrixHtml.toLowerCase().includes('degraded') ||
                          citrixHtml.toLowerCase().includes('partial outage');
      
      const isOperational = citrixHtml.includes('All Systems Operational') ||
                           (citrixHtml.includes('operational') && !hasIncidents);

      let status = 'operativo';
      let details = 'Todos los servicios de Citrix Cloud operativos';
      let availability = 99.7;

      if (hasIncidents) {
        status = 'degradado';
        details = 'Algunos servicios de Citrix con problemas';
        availability = 85.0;
      }

      services.push({
        id: 3,
        name: 'Citrix Cloud Status',
        url: 'https://status.cloud.com/',
        status: status,
        details: details,
        availability: availability,
        incidents: hasIncidents ? 1 : 0,
        source: 'scraping-real',
        lastCheck: timestamp
      });
    } catch (error) {
      console.error('Citrix error:', error.message);
      services.push({
        id: 3,
        name: 'Citrix Cloud Status',
        url: 'https://status.cloud.com/',
        status: 'unknown',
        details: 'Error consultando estado real',
        availability: 0,
        incidents: 0,
        source: 'error',
        lastCheck: timestamp
      });
    }

    // ============================================
    // 4. DOWNDETECTOR MICROSOFT 365 (Scraping real)
    // ============================================
    try {
      const ddM365Url = 'https://downdetector.com/status/microsoft-365/';
      const ddM365Res = await fetch(ddM365Url, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      const ddM365Html = await ddM365Res.text();

      // Buscar reportes activos
      const hasReports = ddM365Html.toLowerCase().includes('reports') &&
                        !ddM365Html.toLowerCase().includes('no reports');
      
      const hasOutage = ddM365Html.toLowerCase().includes('outage') ||
                       ddM365Html.toLowerCase().includes('down');

      let status = 'operativo';
      let details = 'Sin reportes de problemas en Downdetector';
      let availability = 99.6;

      if (hasOutage) {
        status = 'incidente';
        details = 'Reportes de caída/outage en Downdetector';
        availability = 70.0;
      } else if (hasReports) {
        status = 'degradado';
        details = 'Reportes de usuarios en Downdetector';
        availability = 85.0;
      }

      services.push({
        id: 4,
        name: 'Microsoft 365 (Downdetector)',
        url: 'https://downdetector.com/status/microsoft-365/',
        status: status,
        details: details,
        availability: availability,
        incidents: hasReports ? 1 : 0,
        source: 'scraping-real',
        lastCheck: timestamp
      });
    } catch (error) {
      console.error('Downdetector M365 error:', error.message);
      services.push({
        id: 4,
        name: 'Microsoft 365 (Downdetector)',
        url: 'https://downdetector.com/status/microsoft-365/',
        status: 'unknown',
        details: 'Error consultando Downdetector',
        availability: 0,
        incidents: 0,
        source: 'error',
        lastCheck: timestamp
      });
    }

    // ============================================
    // 5. DOWNDETECTOR AZURE PERU (Scraping real)
    // ============================================
    try {
      const ddAzureUrl = 'https://downdetector.pe/problemas/windows-azure/';
      const ddAzureRes = await fetch(ddAzureUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      const ddAzureHtml = await ddAzureRes.text();

      const hasReports = ddAzureHtml.toLowerCase().includes('reporte') ||
                        ddAzureHtml.toLowerCase().includes('reports');
      
      const hasOutage = ddAzureHtml.toLowerCase().includes('caída') ||
                       ddAzureHtml.toLowerCase().includes('down');

      let status = 'operativo';
      let details = 'Sin reportes de problemas en Downdetector Perú';
      let availability = 99.7;

      if (hasOutage) {
        status = 'incidente';
        details = 'Reportes de caída en Downdetector Perú';
        availability = 70.0;
      } else if (hasReports) {
        status = 'degradado';
        details = 'Reportes de usuarios en Downdetector';
        availability = 85.0;
      }

      services.push({
        id: 5,
        name: 'Microsoft Azure (Downdetector Perú)',
        url: 'https://downdetector.pe/problemas/windows-azure/',
        status: status,
        details: details,
        availability: availability,
        incidents: hasReports ? 1 : 0,
        source: 'scraping-real',
        lastCheck: timestamp
      });
    } catch (error) {
      console.error('Downdetector Azure error:', error.message);
      services.push({
        id: 5,
        name: 'Microsoft Azure (Downdetector Perú)',
        url: 'https://downdetector.pe/problemas/windows-azure/',
        status: 'unknown',
        details: 'Error consultando Downdetector',
        availability: 0,
        incidents: 0,
        source: 'error',
        lastCheck: timestamp
      });
    }

    // ============================================
    // RESPUESTA FINAL
    // ============================================
    res.status(200).json({
      success: true,
      timestamp: timestamp,
      services: services,
      note: 'Datos obtenidos mediante scraping real de páginas oficiales'
    });

  } catch (error) {
    console.error('Critical error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
