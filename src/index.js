import fastify from 'fastify';
import view from '@fastify/view';
import formbody from '@fastify/formbody';
import pug from 'pug';
import sanitize from 'sanitize-html';
import generateCourses from "./utils/factories/courseFactory.js";
import generateUsers from "./utils/factories/usersFactory.js";

const state = {
    users: generateUsers(),
    courses: generateCourses(),
}
const sanitizeOptions = {disallowedTagsMode: 'recursiveEscape'};

const app = fastify();
const port = 3000;

await app.register(formbody);
await app.register(view, { engine: { pug } });

app.get('/courses', (req, res) => {
    const term = req.query.term || '';
    const sanitizedTerm = sanitize(term, sanitizeOptions);
    let foundCourses = state.courses;
    if (term) {
        foundCourses = state.courses.filter(({title, description}) => title.includes(sanitizedTerm) || description.includes(sanitizedTerm));
    }

    res.view('src/views/courses/index', { term, courses: foundCourses });
});

app.get('/courses/:id', (req, res) => {
    const { id } = req.params;
    const course = state.courses.find(({id: courseId}) => courseId === id);
    if (!course) {
        return res.status(404).send("Page not found")
    }

    res.view('src/views/courses/show', course);
});

app.get('/users', (req, res) => {
   res.view('src/views/users/index', { users: state.users });
});

app.post('/users', (req, res) => {
    const user = {
        name: req.body.name.trim(),
        email: req.body.email.trim().toLowerCase(),
        password: req.body.password,
    };

    state.users.push(user);

    res.redirect('/users');
});

app.get('/users/:id', (req, res) => {
    const id = sanitize(req.params.id, sanitizeOptions);
    res.type('html');
    res.send(`<h1>${id}</h1>`);
});

app.get('/users/new', (req, res) => {
   res.view('src/views/users/new');
});

app.listen({ port }, () => {
    console.log(`Example app listening on port ${port}`);
});