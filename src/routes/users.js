import yup from "yup";
import sanitize from "sanitize-html";

export default function(app, state) {
    app.get('/users', { name: 'users' }, (req, res) => {
        res.view('src/views/users/index', { users: state.users });
    });

    app.get('/users/new', { name: 'userCreate' }, (req, res) => {
        res.view('src/views/users/new');
    });

    app.get('/users/:id', { name: 'user' }, (req, res) => {
        const id = sanitize(req.params.id, {disallowedTagsMode: 'recursiveEscape'});
        res.type('html');
        res.send(`<h1>${id}</h1>`);
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

    app.get('/users/:id/edit', (req, res) => {
        const { id } = req.params;
        const user = state.users.find((item) => item.id === id);
        if (!user) {
          res.code(404).send({ message: 'User not found' });
        } else {
          res.view('src/views/users/edit.pug', { user });
        }
    });

    app.patch('/users/:id', (req, res) => {
        const { id } = req.params;
        const { name, email, password, passwordConfirmation, } = req.body;
        const userIndex = state.users.findIndex((item) => item.id === parseInt(id));
        if (userIndex === -1) {
          res.code(404).send({ message: 'User not found' });
        } else {
          state.users[userIndex] = { ...state.users[userIndex], name, email };
          res.send(users[userIndex]);
          res.redirect('src/views/users');
        }
    });

    app.delete('/users/:id', (req, res) => {
        const { id } = req.params;
        const userIndex = state.users.findIndex((item) => item.id === parseInt(id));
        if (userIndex === -1) {
          res.code(404).send({ message: 'User not found' });
        } else {
          state.users.splice(userIndex, 1);
          res.redirect('src/views/users');
        }
    });
}