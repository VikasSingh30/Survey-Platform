require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const surveyRoutes = require('./routes/surveyRoutes');
const publicSurveyRoutes = require('./routes/publicSurveyRoutes');
const respondentRoutes = require('./routes/respondentRoutes');

const app = express();
app.use(cors());
app.use(express.json());

console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('PORT:', process.env.PORT);

app.get('/', (req, res) => {
  res.send('API is running');
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/surveys', surveyRoutes);
app.use('/api/v1/public', publicSurveyRoutes);
app.use('/api/v1/respondents', respondentRoutes);

app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ success: false, message: 'Server error' });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log(`Server running on http://localhost:${process.env.PORT}`)
    );
  })
  .catch(err => console.error('MongoDB connection error:', err));
