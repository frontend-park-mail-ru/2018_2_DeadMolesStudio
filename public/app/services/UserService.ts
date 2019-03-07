import backDomain from '../projectSettings';
import AjaxFetchModule from 'modules/AjaxFetch.js';
import userState from 'modules/User';

export default class UserService {
    /**
     Получить данные пользователя для модуля User
     * @return user
     */
    static async getUserState() {
        const response = await this.fetchUser();

        if (response.status !== 200) {
            return null;
        }

        const user = await response.json();
        return user;
    }

    /**
     Получить данные о пользователя по ID
     * @param id
     * @return user
     */
    static async getUserByID(id) {
        const data = {
            user: null,
            ok: false,
        };

        const response = await this.fetchUserByID(id);
        if (response.status !== 200) {
            return data;
        }
        data.user = await response.json();
        data.ok = true;
        return data;
    }

    /**
     Получить данные о пользователе
     * @return Object data
     */
    static async getUser() {
        const data = {
            user: null,
            err: {
                status: 200,
                text: null,
            },
            ok: false,
        };

        if (userState.isAuth() ) {
            data.user = userState.getUser();
            data.ok = true;
            return data;
        }

        const response = await this.fetchUser();

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

        userState.setUser(data.user);

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

        data.err.errors.push({text: '',});
        data.err.errors.push({text: '',});
        data.err.errors.push({text: '',});
        data.err.errors.push({text: '',});


        if (!(email && password && passwordRepeat && nickname) ) {
            data.err.errors[3] = {text: 'Fill in all the fields!',};
            return data;
        }

        if (!this.validateNickname(nickname) ) {
            data.err.errors[0] = {text: 'Nickname is wrong',};
            return data;
        }

        if (nickname.length < 4) {
            data.err.errors[0] = {text: 'Nickname is too small',};
            return data;
        }

        if (nickname.length > 20) {
            data.err.errors[0] = {text: 'Nickname is too long',};
            return data;
        }

        if (!this.validateEmail(email) ) {
            data.err.errors[1] = {text: 'Email is wrong',};
            return data;
        }

        if (password.length < 4) {
            data.err.errors[2] = {text: 'Passwords is too small',};
            return data;
        }

        if (password.length > 30) {
            data.err.errors[2] = {text: 'Passwords is too long',};
            return data;
        }

        if (password !== passwordRepeat) {
            data.err.errors[3] = {text: 'Passwords do not match!',};
            return data;
        }

        const req = {
            email: email,
            nickname: nickname,
            password: password,
        };

        const response = await this.fetchSignUpUser(req);

        if (response.status === 403) {
            const body = await response.json();
            data.err.errors[3] = body.error[0];
            return data;
        }

        if (response.status !== 200) {
            data.err.status = response.status;
            data.err.errors[3] = {text: 'Something went wrong',};
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

        data.err.errors.push({text: '',});
        data.err.errors.push({text: '',});
        data.err.errors.push({text: '',});
        data.err.errors.push({text: '',});
        data.err.errors.push({text: '',});

        const req = {
            email: '',
            nickname: '',
            password: '',
        };

        let count = 0;

        if (email !== user.email && email) {
            if (!this.validateEmail(email) ) {
                data.err.errors[1] = {text: 'Email is wrong',};
                return data;
            }
            req.email = email;
            count += 1;
        }

        if (nickname !== user.nickname && nickname) {
            if (!this.validateNickname(nickname) ) {
                data.err.errors[0] = {text: 'Nickname is wrong',};
                return data;
            }

            if (nickname.length < 4) {
                data.err.errors[0] = {text: 'Nickname is too small',};
                return data;
            }

            if (nickname.length > 20) {
                data.err.errors[0] = {text: 'Nickname is too big',};
                return data;
            }
            req.nickname = nickname;
            count += 1;
        }

        if (password) {
            if (password.length < 4) {
                data.err.errors[2] = {text: 'Passwords is too small',};
                return data;
            }

            if (password.length > 30) {
                data.err.errors[2] = {text: 'Passwords is too big',};
                return data;
            }

            if (password !== passwordRepeat) {
                data.err.errors[3] = {text: 'Passwords do not match!',};
                return data;
            }
            req.password = password;
            count += 1;
        }

        if (count !== 0) {
            const response = await this.fetchUpdateUpUser(req);

            if (response.status === 403) {
                const body = await response.json();
                data.err.errors[4] = body.error[1];
                return data;
            }

            if (response.status === 401) {
                data.err.mainErr = 'You must log in!';
                return data;
            }

            if (response.status !== 200) {
                data.err.mainErr = 'Something went wrong';
                return data;
            }
        }

        if (userAvatar.value !== '') {
            console.log(userAvatar.files[0]);
            const avatarData = new FormData();
            avatarData.append('avatar', userAvatar.files[0], userAvatar.value);

            const responseAvatar = await this.fetchUpdateAvatar(avatarData);

            if (responseAvatar.status !== 200) {
                data.err.errors[4] = {text: 'Unable to load avatar',};
                return data;
            }
        }

        userState.deleteUser();
        data.ok = true;
        return data;
    }

    static validateEmail(email) {
        const reg = /^(?!.*@.*@.*$)(?!.*@.*\-\-.*\..*$)(?!.*@.*\-\..*$)(?!.*@.*\-$)(?!.*<.*$)(?!.*>.*$)(.*@.+(\..{1,11})?)$/;

        return reg.test(email);
    }

    static validateNickname(nickname) {
        const reg = /^(?!.*<.*$)(?!.*>.*$)(?!.* .*$)(.*)$/;

        return reg.test(nickname);
    }

    static fetchUser() {
        return AjaxFetchModule
            .doGet({
                path: '/profile',
                domain: backDomain,
            });
    }

    static fetchSignUpUser(req = {}) {
        return AjaxFetchModule
            .doPost({
                path: '/profile',
                domain: backDomain,
                body: req,
            });
    }

    static fetchUserByID(id) {
        return AjaxFetchModule
            .doGet({
                path: `/profile?id=${id}`,
                domain: backDomain,
            });
    }

    static fetchUpdateUpUser(req = {}) {
        return AjaxFetchModule
            .doPut({
                path: '/profile',
                domain: backDomain,
                body: req,
            });
    }

    static fetchUpdateAvatar(form) {
        return AjaxFetchModule
            .doPut({
                path: '/profile/avatar',
                domain: backDomain,
                contentType: 'multipart/form-data',
                body: form,
            });
    }
}
