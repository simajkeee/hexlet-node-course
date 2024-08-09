import fastify from 'fastify';

const app = fastify();
const port = 3000;

app.get('/users', (req, res) => {
    res.send('GET /users');
});

app.get('/users/:id', (req, res) => {
    res.send(`User ID: ${req.params.id}`);
});

app.get('/users/:userId/post/:postId', (req, res) => {
    res.send(`User ID: ${req.params.userId}; Post ID: ${req.params.postId}`);
});

app.get('/courses', (req, res) => {
    res.send('GET /courses');
});

app.get('/courses/new', (req, res) => {
    res.send('Course build');
});

app.get('/courses/:id', (req, res) => {
    res.send(`Course ID: ${req.params.id}`);
});

app.get('/courses/:courseId/lessons/:id', (req, res) => {
    res.send(`Course ID: ${req.params.courseId}; Lesson ID: ${req.params.id}`);
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