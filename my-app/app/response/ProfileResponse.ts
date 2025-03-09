import { ErrorSchema } from '../models/ErrorSchema';

export class ProfileResponse {
    error_schema: ErrorSchema;
    output_schema: {
        access_token: string;
        name?: string;
        email?: string;
        username?: string;
        dob?: string;
        gender?: string;
        height?: number;
        weight?: number;
        profile_picture?: string; 
    };

    constructor(
        error_schema: ErrorSchema,
        output_schema: {
            access_token: string;
            name?: string;
            email?: string;
            username?: string;
            dob?: string;
            gender?: string;
            height?: number;
            weight?: number;
            profile_picture?: string; 
        }
    ) {
        this.error_schema = error_schema;
        this.output_schema = output_schema;
    }
}