import backDomain from '../projectSettings.js';
import AjaxFetchModule from '../modules/AjaxFetch.mjs';

export default class UserService {
    static FetchUser() {
        return AjaxFetchModule
            .doGet({
                path: '/profile',
                domain: backDomain,
            });
    }

    static FetchSignUpUser(req = {}) {
        return AjaxFetchModule
            .doPost({
                path: '/profile',
                domain: backDomain,
                body: req,
            });
    }

    static FetchUpdateUpUser(req = {}) {
        return AjaxFetchModule
            .doPut({
                path: '/profile',
                domain: backDomain,
                body: req,
            });
    }

    /**
     Получить данные о пользователе
     * @return Object data
     */
    static async getUser() {
        const response = await this.FetchUser();
        const data = {
            user: null,
            err: {
                status: 200,
                text: null,
            },
            ok: false,
        };

        if (response.status === 401) {
            data.err.status = 401;
            data.err.text = 'Надо авторизоваться!';
            return data;
        }

        if (response.status !== 200) {
            data.err.status = response.status;
            data.err.text = 'Что-то пошло не так!';
            return data;
        }

        data.user = await response.json();
        data.ok = true;
        return data;
    }

    /**
     Зарегестрировать нового пользователя
     * @param formData
     * @return Object data
     */
    static async signup(formData) {
        const data = {
            err: {
                status: 200,
                errors: [],
            },
            ok: false,
        };

        const email = formData.email.value;
        const nickname = formData.nickname.value;
        const password = formData.password.value;
        const passwordRepeat = formData.password_repeat.value;

        if (password !== passwordRepeat) {
            data.err.errors.push({
                text: 'Пароли не совпадают',
            });
            return data;
        }

        if (!(email && password && passwordRepeat && nickname) ) {
            data.err.errors.push({
                text: 'Заполните все поля!',
            });
            return data;
        }

        const req = {
            email: email,
            nickname: nickname,
            password: password,
        };

        const response = await this.FetchSignUpUser(req);

        if (response.status === 403) {
            const body = await response.json();
            data.err.errors = body.error;
            return data;
        }

        if (response.status !== 200) {
            data.err.status = response.status;
            data.err.errors.push({
                text: 'Что-то пошло не так!',
            });
            return data;
        }

        data.ok = true;
        return data;
    }

    /**
     Обновить данные о пользователе
     * @param formData, user
     * @return Object data
     */
    static async update(formData, user) {
        const data = {
            err: {
                mainErr: null,
                errors: [],
            },
            ok: false,
        };

        const email = formData.email.value;
        const nickname = formData.nickname.value;
        const password = formData.password.value;
        const passwordRepeat = formData.password_repeat.value;
        const userAvatar = formData.avatar;

        // if (userAvatar) {
        //     console.log('ecnm');
        //     console.log(userAvatar);
        // } else {
        //     console.log('no');
        // }
        //
        // if (userAvatar.value === '') {
        //     console.log('пусто');
        // } else {
        //     console.log('ytn');
        //     console.log(formData.avatar.files[0]);
        // }
        //
        // if (userAvatar.value !== '') {
        //     console.log('avatar block');
        //     console.log(userAvatar.value);
        //     // // && this.user.avatar !== userAvatar
        //     //     console.log(userAvatar);
        //     const avatarData = new FormData();
        //     const newAvatar = formData.avatar.files[0];
        //     avatarData.append('avatar', newAvatar);
        //
        //     AjaxFetchModule
        //         .doPut({
        //             path: '/profile/avatar',
        //             domain: backDomain,
        //             contentType: 'multipart/form-data',
        //             body: formData.avatar.files[0],
        //         })
        //         .then( (response) => {
        //             console.log(response.status);
        //         })
        //         .catch( (err) => {
        //             console.log(err);
        //         });
        // }

        const req = {};

        if (email !== user.email && email) {
            req.email = email;
        }

        if (nickname !== user.nickname && nickname) {
            req.nickname = nickname;
        }

        if (password) {
            if (password !== passwordRepeat) {
                data.err.errors.push({
                    text: 'Пароли не совпадают',
                });
                return data;
            }
            req.password = password;
        }

        if (Object.keys(req).length === 0) {
            return data;
        }

        const response = await this.FetchUpdateUpUser(req);

        if (response.status === 403) {
            const body = await response.json();
            data.err.errors = body.error;
            return data;
        }

        if (response.status === 401) {
            data.err.mainErr = 'Надо авторизоваться!';
            console.log(data);
            return data;
        }

        if (response.status !== 200) {
            data.err.mainErr = 'Что-то пошло не так!';
            return data;
        }

        data.ok = true;
        return data;
    }
}
