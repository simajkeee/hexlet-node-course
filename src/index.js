import fastify from 'fastify';

const app = fastify();
const port = 3000;

app.get('/users', (req, res) => {
    res.send('GET /users');
});

app.post('/users', (req, res) => {
    res.send('POST /users');
});

app.get('/hello', (req, res) => {
    const { user } = req.query;
    if (user !== undefined) {
        res.send(`Hello, ${user}!`);
    } else {
        res.send('Hello, World!');
    }
});

app.listen({ port }, () => {
    console.log(`Example app listening on port ${port}`);
});