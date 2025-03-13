// import { ErrorSchema } from '../models/ErrorSchema';

// export class RegisterResponse{
//     error_schema: ErrorSchema;
//     output_schema: {
//         access_token: string;
//     }

//     constructor(error_schema: ErrorSchema, output_schema: {access_token: string}){
//         this.error_schema = error_schema;
//         this.output_schema = output_schema;
//     }
// }

/*
    RegisterResponse -> Didalem ngemap si hasilnya. (output_schema)
    ErrorSchema -> Didalem ngemap si errornya. (error_schema)

    "200 OK"
    "Kode Error aja dimasukin kalo ada error."
*/

import { ErrorSchema } from '../models/ErrorSchema';

export class RegisterResponse {
    error_schema: ErrorSchema;
    output_schema: {
        access_token: string;
        name?: string;  
        email?: string;
        username?: string;
        password?: string;
        password_confirmation?: string;
    };

    constructor(
        error_schema: ErrorSchema,
        output_schema: {
            access_token: string;
            name?: string;
            email?: string;
            username?: string;
            password?: string;
            password_confirmation?: string;
        }
    ) {
        this.error_schema = error_schema;
        this.output_schema = output_schema;
    }
}

export default RegisterResponse;