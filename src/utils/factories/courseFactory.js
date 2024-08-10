import {faker} from "@faker-js/faker";

function generateCourse() {
    return {
        id: faker.string.uuid(),
        title: faker.lorem.words(3),
        description: faker.lorem.paragraph(),
        price: faker.commerce.price({min: 100, max: 1000, dec: 2, symbol: '$'})
    };
}

function generateCourses(numberOfCourses = 10) {
    const courses = [];
    for (let i = 0; i < numberOfCourses; i++) {
        courses.push(generateCourse());
    }
    return courses;
}

export default generateCourses;