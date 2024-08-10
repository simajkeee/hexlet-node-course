import fastify from 'fastify';
import view from '@fastify/view';
import pug from 'pug';
import sanitize from 'sanitize-html';
import generateCourses from "./utils/factories/courseFactory.js";

const courses = generateCourses()
const app = fastify();
const port = 3000;
const sanitizeOptions = {disallowedTagsMode: 'recursiveEscape'};
await app.register(view, { engine: { pug } });

app.get('/courses', (req, res) => {
    const term = req.query.term || '';
    const sanitizedTerm = sanitize(term, sanitizeOptions);
    let foundCourses = courses;
    if (term) {
        foundCourses = courses.filter(({title, description}) => title.includes(sanitizedTerm) || description.includes(sanitizedTerm));
    }

    res.view('src/views/courses/index', { term, courses: foundCourses });
});

app.get('/courses/:id', (req, res) => {
    const { id } = req.params;
    const course = courses.find(({id: courseId}) => courseId === id);
    if (!course) {
        return res.status(404).send("Page not found")
    }

    res.view('src/views/courses/show', course);
});

app.get('/users/:id', (req, res) => {
    const id = sanitize(req.params.id, sanitizeOptions);
    res.type('html');
    res.send(`<h1>${id}</h1>`);
});

app.listen({ port }, () => {
    console.log(`Example app listening on port ${port}`);
});