class StudentRegisterDto {
    constructor(username, firstname, lastname, email, password) {
        this.username = username;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
    }
}

module.exports = StudentRegisterDto;