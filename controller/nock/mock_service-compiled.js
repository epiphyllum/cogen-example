var nock = require('nock');
var service = nock('http://localhost:3000').log(console.log);

service.get('/a').reply(200, { a: 1 }).get('/b').reply(200, { b: 1 }).get('/op').reply(200, { op: 'add' }).post('/add', { a: 1, b: 1 }).reply(200, { c: 2 })
//.post('/add', 'a=1&b=1').reply(200, { c: 2 })
//.get('/add').reply(200, { c: 2 })
.post('/sub', { a: 1, b: 1 }).reply(200, { c: 0 });

module.exports = service;

//# sourceMappingURL=mock_service-compiled.js.map