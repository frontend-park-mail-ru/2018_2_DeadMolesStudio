import ShopService from './ShopService';
// jest.mock('modules/AjaxFetch');

describe('getSkins', () => {
    it('возвращает объект с ошибкой если статус ответа с сервера не 200', () => {

        ShopService.fetchSkins = jest.fn().mockImplementation(() => {
            return {
                status: 404,
                json: () => ({})
            };
        });

        const expected = {
            skins: null,
            ok: false,
            err: 'Something went wrong!',
        };

        const actual = ShopService.getSkins();

        expect(actual).toEqual(expected);
    });

    it('возвращает объект со скинами если статус ответа с сервера 200', () => {

        ShopService.fetchSkins = jest.fn().mockImplementation(() => {
            return {
                status: 200,
                json: () => ({
                    "skins": [
                        {"id":1,"name":"Classic","cost":0},
                        {"id":2,"name":"Nature","cost":50},
                        {"id":3,"name":"Home","cost":100},
                        {"id":4,"name":"Pumpkin","cost":150},
                        {"id":5,"name":"Freak","cost":200},
                        {"id":6,"name":"Christmas","cost":0}
                    ],
                })
            };
        });

        const expected = {
            skins: null,
            ok: false,
            err: 'Something went wrong!',
        };

        const actual = ShopService.getSkins();

        expect(actual).toEqual(expected);
    });


});