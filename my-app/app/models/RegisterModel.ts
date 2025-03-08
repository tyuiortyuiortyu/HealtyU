export class RegisterModel{
    email: string;
    password: string;
    name: string;

    constructor(email: string, password: string, name: string){
        this.email = email;
        this.password = password;
        this.name = name;
    }
}

// {
//     "email": "nikitas@admin.com",
//     "password":"admin123",
//     "name":"User Nikita"
// }