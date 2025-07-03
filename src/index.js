require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const cors = require('cors');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false })); // <-- Agrega esta línea
app.use(cors({
  origin: ['https://llamadas-node.netlify.app', 'http://localhost:5173'] // Cambia esto por tu URL de Netlify
}));

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_NUMBER;
const client = twilio(accountSid, authToken);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint para llamadas desde el backend (no desde navegador)
app.post('/call', async (req, res) => {
  const { number } = req.body;
  console.log(`Intentando realizar una llamada al número: ${number}`);
  try {
    await client.calls.create({
      to: number,
      from: twilioNumber,
      url: 'http://demo.twilio.com/docs/voice.xml'
    });
    res.json({ message: 'Llamada realizada correctamente' });
  } catch (error) {
    console.error('Error al realizar la llamada:', error.message);
    res.status(500).json({ message: 'Error al realizar la llamada', error: error.message });
  }
});

// Endpoint para TwiML App (usado por Twilio Client)
app.post('/voice', (req, res) => {
  const twiml = new twilio.twiml.VoiceResponse();
  const to = req.body.To;
  if (to) {
    twiml.dial({ callerId: twilioNumber }).number(to);
  } else {
    twiml.say('No se proporcionó un número de destino.');
  }
  res.type('text/xml');
  res.send(twiml.toString());
});

// Endpoint para generar token de Twilio Client
const { jwt: { AccessToken } } = require('twilio');
app.get('/token', (req, res) => {
  const identity = 'usuario_navegador';
  const token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY_SID,
    process.env.TWILIO_API_KEY_SECRET,
    { identity }
  );
  const voiceGrant = new AccessToken.VoiceGrant({
    outgoingApplicationSid: process.env.TWILIO_TWIML_APP_SID,
    incomingAllow: true,
  });
  token.addGrant(voiceGrant);
  res.send({ token: token.toJwt(), identity });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
