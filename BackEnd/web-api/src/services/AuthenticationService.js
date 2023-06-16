let bcrypt = require('bcryptjs')
let UnauthorizedException = require('../exceptions/UnauthorizedException.js')
const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET

class AuthenticationService {
    constructor(userService, studentService) {
        this.userService = userService
        this.studentService = studentService
    }

    async login(username, password) {
        let response;
        if (username === undefined || username === null || username === '' || password === undefined || password === null || password === '') {
            throw new UnauthorizedException()
        }
        const user = await this.userService.findByUsername(username)
        if (user === undefined || user.length === 0) {
            throw new UnauthorizedException()
        }

        await bcrypt.compare(password, user[0].PASSWORD).then(function (result) {
            //  return result
            if (result) {
                const token = jwt.sign(
                    {username: username},
                    jwtSecret,
                    {
                        expiresIn: "2h",
                    });

                response = {
                    token: token,
                    username: user[0].USERNAME,
                    role: user[0].ROLE
                }
            } else
                throw new UnauthorizedException()
        });
        return response;
    }

    async register(studentRegisterDto) {
        if (studentRegisterDto.username === undefined || studentRegisterDto.username === null || studentRegisterDto.username === '' || studentRegisterDto.password === undefined || studentRegisterDto.password === null || studentRegisterDto.password === '') {
            throw new UnauthorizedException()
        }
        delete studentRegisterDto.repeatPassword;

        studentRegisterDto.password = await bcrypt.hash(studentRegisterDto.password, 10);
        await this.studentService.createStudent(studentRegisterDto)
    }

}

module.exports = AuthenticationService;