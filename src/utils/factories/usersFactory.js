import {faker} from "@faker-js/faker";

function generateUser() {
    return {
        id: faker.string.uuid(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
    };
}

function generateUsers(count = 10) {
    return faker.helpers.multiple(generateUser, { count })
}

export default generateUsers;