const express = require('express');
const cors = require('cors');
const app = express();
const initDatabase = require('./models/init');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');

app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

initDatabase().then(() => {
    app.listen(3000, () => console.log('Server running on port 3000'));
});