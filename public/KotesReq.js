
class Requester {
    constructor(options) {
        this.baseUrl = options.baseUrl
        this.name = 'holly shit'
    }

    async login(body, callback) {
        try {
            if (typeof body.username !== 'string' || typeof body.password != 'string')
                throw new Error('username and password must be of type string')
            else if (body.username.trim() == '' || body.password == '')
                throw new Error('username and password must be provided')

            const options = {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            }
            const response = await fetch(`${this.baseUrl}/api/users/login`, options)
            const data = await response.json()


            if (typeof callback === 'function') return callback(undefined, data)
            return data
        } catch (error) {
            if (typeof callback === 'function') return callback(error)
            return error
        }
    }

    async getUser(callback) {
        return await this.getAccessToken(undefined, async (error, tokens) => {
            if (error) return console.log('there was an error')
            try {
                const accessToken = tokens.tokens.accessToken
                const options = {
                    method: 'GET',
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    }
                }
                const url = `${this.baseUrl}/api/users/me`

                const response = await fetch(url, options)
                const user = await response.json()
                // console.log(callback)
                if (typeof callback === 'function') {
                    // return callback(undefined, user)
                }

                return user

            } catch (error) {
                if (typeof callback === 'function') return callback(error)
                console.log(error)
            }
        })
    }
    async logout() {
        return await this.getAccessToken(undefined, async (error, tokens) => {
            const { accessToken, refreshToken } = tokens.tokens
            const options = {
                method: 'POST',
                headers: {
                    "RefreshToken": `Bearer ${refreshToken}`,
                    "Authorization": `Bearer ${accessToken}`
                }
            }
            const url = `${this.baseUrl}/api/users/logout`

            const response = await fetch(url, options)
            const user = await response.json()
            if (user.sucess)
                return window.location = 'login.html'
            return user
        })
    }

    save(data) {
        if (data.trim() === '') return console.log('save method requires a string type token')
        if (data.toLowerCase() === '@info') {
            return console.log('this function was designed to take in a refreshToken and save it to a cookie')
        }
        if (!data)
            throw new Error('save method requires data')
        return document.cookie = data
    }

    async getAccessToken(refreshToken, callback) {
        try {
            const token = refreshToken || document.cookie

            if (!token) {
                throw new Error('getAccessToken requires a refreshToken from enther the user or as a cookie')
            } else if (typeof token !== 'string') {
                throw new Error('refreshToken need to be typeof string')
            } else if (token.trim() == '') {
                throw new Error('refreshToken cannot be empty')
            }

            const options = {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "RefreshToken": `Bearer ${token}`
                }
            }
            const url = `${this.baseUrl}/api/users/createaccess`
            const response = await fetch(url, options)
            var newToken = await response.json()


            if (typeof callback === 'function') {
                return callback(undefined, newToken)
            }
            return newToken

        } catch (error) {
            if (typeof callback === 'function') callback(error)
            return newToken
        }
    }
}




