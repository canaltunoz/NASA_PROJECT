const request = require('supertest');
const app = require('../../app');
const {
    mongoConnect,
    mongoDisconnect
} = require('../../services/mongo');

describe('Launches API', () => {

    beforeAll(async () => {
        await mongoConnect();
    });
    afterAll(async ()=>{
        await mongoDisconnect();
    })
    describe('Test GET /launches', () => {
        test('It should respond 200 success', async () => {
            const response = await request(app)
                .get('/v1/launches')
                .expect('Content-Type', /json/)
                .expect(200);

            // expect(response.statusCode).toBe(200);
        });
    });

    describe('Test POST /v1/launch', () => {
        test('It should respond with 201 success', async () => {

            const response = await request(app)
                .post('/v1/launches')
                .send(completeLaunchData)
                .expect('Content-Type', /json/)
                .expect(201);

            const requestDate = new Date(completeLaunchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();

            expect(responseDate).toBe(requestDate);
            expect(response.body).toMatchObject(uncompleteLaunchData);
        });

        const completeLaunchData = {
            mission: 'USS Ent',
            rocket: 'NCC Cano 1',
            target: 'Kepler-62 f',
            launchDate: '2021-04-20 00:00:00',

        };
        const uncompleteLaunchData = {
            mission: 'USS Ent',
            rocket: 'NCC Cano 1',
            target: 'Kepler-62 f',
        };
        test('It should catch missing required properties', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(uncompleteLaunchData)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toStrictEqual({
                error: 'Bad request : Missing property',
            });
        });

        test('It should catch invalid dates', async () => {

            const response = await request(app)
                .post('/v1/launches')
                .send(uncompleteLaunchData)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toStrictEqual({
                error: 'Bad request : Missing property',
            });

        });
    });

})


