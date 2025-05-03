const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');


function getClientIp(req) {
  let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
  if (ip && ip.startsWith('::ffff:')) {
    ip = ip.split(':').pop();
  } else if (ip === '::1') {
    ip = '127.0.0.1';
  }
  return ip;
}

// Response Time + IP Logger Middleware
app.use((req, res, next) => {
  const start = Date.now(); // Start timer

  res.on('finish', () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();
    const ip = getClientIp(req);
    const logMessage = `[${timestamp}] ${req.method} ${req.url} from IP: ${ip} responded in ${duration} ms (Node)\n`;

    // Global log file
    const logDir = path.join(__dirname, '..', 'All_logs');
    const logPath = path.join(logDir, 'response_time_logs.txt');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    fs.appendFile(logPath, logMessage, (err) => {
      if (err) console.error('Error logging response time:', err);
    });

    console.log(logMessage.trim());
  });

  next();
});

// Request log to console
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'contact.html'));
});

app.post('/contact', (req, res) => {
  const name = req.body.name;
  const message = req.body.message;
  const timestamp = new Date().toISOString();
  const ip = getClientIp(req);


  const globalLogPath = path.join(__dirname, '..', 'All_logs', 'user_logs.txt');
  const globalLogDir = path.dirname(globalLogPath);
  if (!fs.existsSync(globalLogDir)) {
    fs.mkdirSync(globalLogDir, { recursive: true });
  }

  const logEntry = `\n[${timestamp}] Name: ${name}, Message: '${message}' from IP: ${ip} (Node server).`;
  fs.appendFile(globalLogPath, logEntry, (err) => {
    if (err) console.error('Failed to write log:', err);
  });

  res.redirect(`/thankyou.html?name=${encodeURIComponent(name)}&message=${encodeURIComponent(message)}`);
});

// Start server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
