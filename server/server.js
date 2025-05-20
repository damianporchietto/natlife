const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const swaggerUi = require('swagger-ui-express')
const swaggerSpecs = require('./config/swagger')
const { connectDB } = require('./config/db')
const mealRoutes = require('./routes/mealRoutes')
const workoutRoutes = require('./routes/workoutRoutes')
const userRoutes = require('./routes/userRoutes')
const reportRoutes = require('./routes/reportRoutes')
dotenv.config()
connectDB()

const app = express()
app.use(express.json())

// Health check endpoint
app.get('/health', (req, res) => {
  const uptime = process.uptime()
  const days = Math.floor(uptime / 86400)
  const hours = Math.floor((uptime % 86400) / 3600)
  const minutes = Math.floor((uptime % 3600) / 60)
  const seconds = Math.floor(uptime % 60)
  
  const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`
  res.status(200).send(`OK - Uptime: ${uptimeString}`)
})

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "NatLife API Documentation"
}));

// API routes
app.use('/api/meals', mealRoutes)
app.use('/api/workouts', workoutRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api', userRoutes)

const clientBuildPath = path.join(__dirname, 'client', 'dist');

// Serve static files with proper MIME types
app.use(express.static(clientBuildPath, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

app.get('*', (req, res) => {
  const indexPath = path.join(clientBuildPath, 'index.html');
  console.log('Serving index from:', indexPath);
  res.sendFile(indexPath);
});

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`))