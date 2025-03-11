import { ErrorSchema } from '../models/ErrorSchema';

export class LoginResponse {
    error_schema: ErrorSchema;
    output_schema: {
        access_token: string;
        email?: string; 
        password?: string;
    };

    constructor(
        error_schema: ErrorSchema,
        output_schema: {
            access_token: string;
            email?: string;
            password?: string;
        }
    ) {
        this.error_schema = error_schema;
        this.output_schema = output_schema;
    }
}

export default LoginResponse;