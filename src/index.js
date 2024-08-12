import pug from 'pug';
import yup from 'yup';
import fastify from 'fastify';
import view from '@fastify/view';
import formbody from '@fastify/formbody';
import { plugin as fastifyReverseRoutes } from 'fastify-reverse-routes';


import sanitize from 'sanitize-html';
import generateCourses from "./utils/factories/courseFactory.js";
import generateUsers from "./utils/factories/usersFactory.js";

const state = {
    users: generateUsers(),
    courses: generateCourses(),
}
const sanitizeOptions = {disallowedTagsMode: 'recursiveEscape'};

const app = fastify({ exposeHeadRoutes: false });
const port = 3000;

await app.register(formbody);
await app.register(fastifyReverseRoutes);
await app.register(view, {
    engine: {pug},
    defaultContext: {
        route: (name, placeholdersValues) => app.reverse(name, placeholdersValues),
    },
});

app.get('/courses', { name: 'courses' }, (req, res) => {
    const term = req.query.term || '';
    const sanitizedTerm = sanitize(term, sanitizeOptions);
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

app.get('/users', { name: 'users' }, (req, res) => {
   res.view('src/views/users/index', { users: state.users });
});

app.post('/users', {
    attachValidation: true,
    schema: {
        body: yup.object({
            name: yup.string().min(2, 'Имя должно быть не меньше двух символов'),
            email: yup.string().email(),
            password: yup.string().min(5),
            passwordConfirmation: yup.string().min(5),
        }),
    },
    validatorCompiler: ({ schema, method, url, httpPart }) => (data) => {
        if (data.password !== data.passwordConfirmation) {
            return {
                error: Error('Password confirmation is not equal the password'),
            };
        }
        try {
            const result = schema.validateSync(data);
            return { value: result };
        } catch (e) {
            return { error: e };
        }
    },
}, (req, res) => {
    const { name, email, password, passwordConfirmation } = req.body;

    if (req.validationError) {
        const data = {
            name, email, password, passwordConfirmation,
            error: req.validationError,
        };

        res.view('src/views/users/new', data);
        return;
    }

    const user = {
        name,
        email,
        password,
    };

    state.users.push(user);

    res.redirect('/users');
});

app.get('/users/:id', { name: 'user' }, (req, res) => {
    const id = sanitize(req.params.id, sanitizeOptions);
    res.type('html');
    res.send(`<h1>${id}</h1>`);
});

app.get('/users/new', { name: 'userCreate' }, (req, res) => {
   res.view('src/views/users/new');
});

app.get('/', { name: 'home' }, (req, res) => {
    res.view('src/views/index');
});

app.listen({ port }, () => {
    console.log(`Example app listening on port ${port}`);
});