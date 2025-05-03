const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');

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
  
    // Log entry
    const globalLogPath = path.join(__dirname, '..', 'All_logs', 'user_logs.txt');  // go one level up

    // Ensure log directory exists
    const globalLogDir = path.dirname(globalLogPath);
    if (!fs.existsSync(globalLogDir)) {
      fs.mkdirSync(globalLogDir, { recursive: true });
    }

    const logEntry = `\n[${new Date().toISOString()}] Name: ${name}, Message: '${message}' from Node server.`;

    fs.appendFile(globalLogPath, logEntry, (err) => {
      if (err) {
        console.error('Failed to write log:', err);
      }
    });
      
    // Redirect to thank you page
    res.redirect(`/thankyou.html?name=${encodeURIComponent(name)}&message=${encodeURIComponent(message)}`);
  });

// Start server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
