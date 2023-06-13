class AuthenticationResponseDto{
    constructor(token, role) {
        this.token = token
        this.role =  role
    }
}

module.exports = AuthenticationResponseDto