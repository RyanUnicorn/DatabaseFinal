const path = require('path')
const session = require('express-session');
const express = require('express');
const app = express();

// Settings
app.set('view engine', 'ejs');
app.use(session({
    secret: 'this_is_a_very_secret_key',
    resave: false,
    saveUninitialized: false,
}));

// Routers
const StudentRouter = require('./Routers/StudentRouter');
const AdminRouter = require('./Routers/AdminRouter');
const DormAdminRouter = require('./Routers/DormAdminRouter');
const ApiRouter = require('./Routers/ApiRouter');

// Middlewares
const logger = require('./Middlewares/Logger');
const defaultRoute = require('./Middlewares/DefaultRoute');
const dataInjector = require('./Middlewares/DataInjector');

// Main setting
app.use(defaultRoute('/Student/Login'));
app.use(logger);
app.use(express.static(path.join(__dirname, '/Public')));
app.use(dataInjector);
app.use('/Student', StudentRouter);
app.use('/Admin', AdminRouter);
app.use('/DormAdmin', DormAdminRouter);
app.use('/Api', ApiRouter);

app.listen(80, () => {
    console.log('http://localhost:80');
});