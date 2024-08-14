import pug from 'pug';
import fastify from 'fastify';
import view from '@fastify/view';
import formbody from '@fastify/formbody';
import fastifyCookie from '@fastify/cookie';
import { plugin as fastifyReverseRoutes } from 'fastify-reverse-routes';
import usersRoute from './routes/users.js';

import sanitize from 'sanitize-html';
import generateCourses from "./utils/factories/courseFactory.js";
import generateUsers from "./utils/factories/usersFactory.js";

const state = {
    users: generateUsers(),
    courses: generateCourses(),
}

const app = fastify({ exposeHeadRoutes: false });
const port = 3000;

await app.register(formbody);
await app.register(fastifyReverseRoutes);
await app.register(fastifyCookie);
await app.register(view, {
    engine: {pug},
    defaultContext: {
        route: (name, placeholdersValues) => app.reverse(name, placeholdersValues),
    },
});

usersRoute(app, state);

app.get('/courses', { name: 'courses' }, (req, res) => {
    const term = req.query.term || '';
    const sanitizedTerm = sanitize(term, {disallowedTagsMode: 'recursiveEscape'});
    let foundCourses = state.courses;
    if (term) {
        foundCourses = state.courses.filter(({title, description}) => title.includes(sanitizedTerm) || description.includes(sanitizedTerm));
    }

    res.view('src/views/courses/index', { term, courses: foundCourses });
});

app.get('/courses/:id', { name: 'course' }, (req, res) => {
    const { id } = req.params;
    const course = state.courses.find(({id: courseId}) => courseId === id);
    if (!course) {
        return res.status(404).send("Page not found")
    }

    res.view('src/views/courses/show', course);
});

app.get('/', { name: 'home' }, (req, res) => {
    const visited = req.cookies.visited;
    const data = {
      visited,
    };
    res.cookie('visited', true);

    res.view('src/views/index', data);
});

app.listen({ port }, () => {
    console.log(`Example app listening on port ${port}`);
});