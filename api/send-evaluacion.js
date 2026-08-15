export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // Capturas los datos enviados desde tus componentes de React
  const datosEvaluacion = req.body; 

  const appId = process.env.APPSHEET_APP_ID;
  const accessKey = process.env.APPSHEET_ACCESS_KEY;

  try {
    const response = await fetch(`https://appsheet.com{appId}/tables/NombreDeTuTabla/Add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'applicationAccessKey': accessKey
      },
      body: JSON.stringify({
        Action: "Add",
        Properties: { Locale: "es-ES" },
        Rows: [ datosEvaluacion ]
      })
    });

    const resultado = await response.json();
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({ error: 'Error al conectar con AppSheet' });
  }
}