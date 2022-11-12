import axios from "axios";
import { API_ACCESS_TOKEN } from './constants'

const getToken = () => {
    return API_ACCESS_TOKEN
}

class AxiosService {
    constructor() {
        const instance = axios.create();
        this.instance = instance;
    }

    get(url, data) {
        return this.instance.get(url, data);
    }

    post(url, data, newConfig) {
        return this.instance.post(url, data, newConfig);
    }

    // 
    getWithTokenOnHeaders(url) {
        const config = {
            headers: { "x-access-token": `${getToken()}` },
        };
        return this.instance.get(url, config);
    }

    getWithToken(url, data) {
        const config = {
            headers: { Authorization: `Bearer ${getToken()}` },
        };
        return this.instance.get(url, config);
    }

    postLogin(url, data) {
        const username = data.email;
        const password = data.password;
        const token = Buffer.from(`${username}:${password}`, "utf8").toString(
            "base64"
        );
        const config = {
            headers: { Authorization: `Basic ${token}` },
        };
        return this.instance.post(url, data, config);
    }

    postWithTokenOnHeaders(url, data) {
        const { access_token } = data;
        const config = {
            headers: { "x-access-token": access_token },
        };
        return this.instance.post(url, data, config);
    }

    postWithToken(url, data, newConfig = {}) {
        const config = {
            headers: { Authorization: `Bearer ${getToken()}` },
            ...newConfig,
        };
        return this.instance.post(url, data, config);
    }

    putWithToken(url, data, newConfig) {
        const config = {
            headers: { Authorization: `Bearer ${getToken()}` },
            ...newConfig,
        };
        return this.instance.put(url, data, config);
    }

    deleteWithToken(url, data) {
        const config = {
            headers: { Authorization: `Bearer ${getToken()}` },
        };
        return this.instance.delete(url, config);
    }

    patchWithToken(url, data) {
        const config = {
            headers: { Authorization: `Bearer ${getToken()}` },
        };
        return this.instance.patch(url, data, config);
    }
}

const newAxiosService = new AxiosService();

newAxiosService.instance.interceptors.response.use(undefined, (error) => {
    if (error.message === "Network Error" && !error.response) {
        console.log("Network Error");
        return {
            status: "Network Error",
            data: null,
        };
    } else {
        const { status, data } = error.response; //status, data, config
        if (status === 400) {
            // const { isAuthenticated } = store.getState().authencation;
            // if (isAuthenticated) {
            //     logoutWhenHasError();
            // }
            // AlertError("Bad request!");
            return {
                status: 400,
                data,
            };
        }
        if (status === 401) {
            console.log("Unauthrized!");
            return {
                status: 401,
                data,
            };
        }
        if (status === 406) {
            return {
                status: 406,
                data,
            };
        }
        // HTTP_ME_450_EMAIL_EXIST
        if (status === 450) {
            return {
                status: 450,
                data,
            };
        }
        // HTTP_ME_451_EMAIL_DOES_NOT_EXIST
        if (status === 451) {
            return {
                status: 451,
                data,
            };
        }
        // HTTP_ME_452_ACCOUNT_IS_NOT_ACTIVATED
        if (status === 452) {
            return {
                status: 452,
                data,
            };
        }
        // HTTP_ME_453_ACCOUNT_IS_ACTIVATED
        if (status === 453) {
            return {
                status: 453,
                data,
            };
        }
        // HTTP_ME_454_OLD_PASSWORD_IS_INCORRECT
        if (status === 454) {
            return {
                status: 454,
                data,
            };
        }
        // HTTP_ME_455_TOKEN_INCORRECT_OR_EXPIRED
        if (status === 455) {
            return {
                status: 455,
                data,
            };
        }
        if (status === 500) {
            // AlertError("Internal server!");
            return {
                status: 500,
                data,
            };
        }
        if (status === 600) {
            return {
                status: 600,
                data,
            };
        } 
        else {
            return error.response
        }
    }
});

export default newAxiosService;
