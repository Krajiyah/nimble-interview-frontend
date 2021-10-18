export const DefaultHost = "http://localhost:1234"

export class ApiClient {

    constructor(host) {
        this.host = host
    }

    async ping() {
        const res = await fetch(this.host + "/ping")
        return handleRes(res)
    }

    async login(username, password) {
        const res = await fetch(this.host + "/users/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                username,
                password,
            }),
        })
        return handleRes(res)
    }

    async signup(username, password) {
        const res = await fetch(this.host + "/users", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                username,
                password,
            }),
        })
        return handleRes(res)
    }

    async sendMessage(token, data) {
        const res = await fetch(this.host + "/messages", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Token': token,
            },
            body: JSON.stringify({data}),
        })
        return handleRes(res)
    }

    async getMessages(token, page, pageSize) {
        const res = await fetch(this.host + `/messages?page=${page}&pageSize=${pageSize}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Token': token,
            },
        })
        return handleRes(res)
    }
}

async function handleRes(res) {
    const body = await res.json()
    if (res.status != 200) {
        throw new Error(body.error)
    }
    return body.result
}