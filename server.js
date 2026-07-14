const jsonServer = require('json-server');

const server = jsonServer.create();

// db.json dosyanın tam yolunu buraya yazmalısın (Örn: klasörler/json/db.json veya json/db.json)

const router = jsonServer.router('klasörler/json/db.json'); 

const middlewares = jsonServer.defaults();

const port = process.env.PORT || 3000;

server.use(middlewares);

server.use(router);

server.listen(port, () => {

    console.log(`JSON Server is running on port ${port}`);

});
 