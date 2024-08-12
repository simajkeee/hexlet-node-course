import {faker} from "@faker-js/faker";

function generateCourse() {
    return {
        id: faker.string.uuid(),
        title: faker.lorem.words(3),
        description: faker.lorem.paragraph(),
        price: faker.commerce.price({min: 100, max: 1000, dec: 2, symbol: '$'})
    };
}

function generateCourses(count = 10) {
    return faker.helpers.multiple(generateCourse, { count })
}

export default generateCourses;