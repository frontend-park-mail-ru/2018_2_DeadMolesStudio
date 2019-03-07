import SessionService from './SessionService';

describe('Error with formdata in login session', () => {

    it('Should find an error with empty email', async () => {
        const data = {
            'email': {
                value: '',
            },
            'password': {
                value: '12345678',
            },
        };

        const expected = {
            err: {
                status: 200,
                errors: [
                    {text: 'Fill in both fields!',}
                ],
            },
            ok: false,
        };

        const actual = await SessionService.login(data);

        expect(actual).toEqual(expected);
    });

    it('Should find an error with empty password', async () => {
        const data = {
            'email': {
                value: 'ketnipz@mail.ru',
            },
            'password': {
                value: '',
            },
        };

        const expected = {
            err: {
                status: 200,
                errors: [
                    {text: 'Fill in both fields!',}
                ],
            },
            ok: false,
        };

        const actual = await SessionService.login(data);

        expect(actual).toEqual(expected);
    });
});

describe('Error in response in login session', () => {

    it('Should find an error with invalid mail / password pair', async () => {
        const data = {
            'email': {
                value: 'ketnipz@mail.ru',
            },
            'password': {
                value: '123454544',
            },
        };

        const resp = {
            status: 422,
        };

        const expected = {
            err: {
                status: 422,
                errors: [
                    {text: 'Invalid mail / password pair',}
                ],
            },
            ok: false,
        };

        SessionService.fetchLogin().mockImplementation(() => {
            return resp
        });

        const actual = await SessionService.login(data);

        expect(actual).toEqual(expected);
    });

    it('Should find another error in response', async () => {
        const data = {
            'email': {
                value: 'ketnipz@mail.ru',
            },
            'password': {
                value: '123454544',
            },
        };

        const resp = {
            status: 500,
        };

        const expected = {
            err: {
                status: 500,
                errors: [
                    {text: 'Something went wrong',}
                ],
            },
            ok: false,
        };

        SessionService.fetchLogin().mockImplementation(() => {
            return resp
        });

        const actual = await SessionService.login(data);

        expect(actual).toEqual(expected);
    });
});

describe('Success login session', () => {

    it('No error in login session', async () => {
        const data = {
            'email': {
                value: 'ketnipz@mail.ru',
            },
            'password': {
                value: '123454544',
            },
        };

        const resp = {
            status: 200,
        };

        const expected = {
                err: {
                    status: 200,
                    errors: [],
                },
                ok: true,
            };

        SessionService.fetchLogin().mockImplementation(() => {
            return resp
        });

        const actual = await SessionService.login(data);

        expect(actual).toEqual(expected);
    });
});