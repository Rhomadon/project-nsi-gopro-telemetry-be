const express = require('express');
const bodyParser = require('body-parser');
const extractorRoute = require('./routes/extractorRoute');
const morgan = require('morgan');

const app = express();

// Menampilkan log setiap request route yang diakses
app.use(morgan('combined'));

// Middleware untuk memproses body pada request HTTP
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Gunakan rute yang telah dibuat
app.use(extractorRoute);

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
