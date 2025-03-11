// export class ErrorSchema {
//     error_code: string;
//     error_message: string;
//     additional_message: string;
  
//     constructor(error_code: string, error_message: string, additional_message: string) {
//       this.error_code = error_code;
//       this.error_message = error_message;
//       this.additional_message = additional_message;
//     }
//   }
  
  // {"error_schema":{"error_code":"S001","error_message":"Success","additional_message":""},"output_schema":{"access_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL2F1dGgvcmVnaXN0ZXIiLCJpYXQiOjE3NDA3MTAzNjYsImV4cCI6MTc0MDcxMzk2NiwibmJmIjoxNzQwNzEwMzY2LCJqdGkiOiJUdUVTcmxiN0ZVZFc3SlM5Iiwic3ViIjoiNSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.dserUxv6x9QlN41-sjcAe7mMai_qCqES03-WwsKNXzE"}}

import AsyncStorage from '@react-native-async-storage/async-storage';

export class OutputSchema {
    output_code: string;
    output_message: string;
    additional_message: string;

    constructor(output_code: string, output_message: string, additional_message: string) {
        this.output_code = output_code;
        this.output_message = output_message;
        this.additional_message = additional_message;
    }
}

export class ErrorSchema {
    error_code: string;
    error_message: string;
    additional_message?: string; // Optional

    constructor(error_code: string, error_message: string, additional_message?: string) {
        if (!error_code || !error_message) {
            throw new Error("error_code and error_message are required");
        }

        this.error_code = error_code;
        this.error_message = error_message;
        this.additional_message = additional_message;
    }

    toJSON(): Record<string, string> {
        return {
            error_code: this.error_code,
            error_message: this.error_message,
            ...(this.additional_message && { additional_message: this.additional_message })
        };
    }

    static fromObject(obj: Record<string, any>): ErrorSchema {
        return new ErrorSchema(
            obj.error_code,
            obj.error_message,
            obj.additional_message
        );
    }

    async saveToStorage(): Promise<void> {
        try {
            const jsonValue = JSON.stringify(this.toJSON());
            await AsyncStorage.setItem('error', jsonValue);
        } catch (e) {
            console.error("Failed to save error to storage", e);
        }
    }

    static async getFromStorage(): Promise<ErrorSchema | null> {
        try {
            const jsonValue = await AsyncStorage.getItem('error');
            return jsonValue != null ? ErrorSchema.fromObject(JSON.parse(jsonValue)) : null;
        } catch (e) {
            console.error("Failed to fetch error from storage", e);
            return null;
        }
    }
}

// Contoh penggunaan:
const error = new ErrorSchema("404", "Not Found", "Resource not available");
error.saveToStorage().then(() => {
    console.log("Error saved to AsyncStorage");
});

ErrorSchema.getFromStorage().then((storedError) => {
    if (storedError) {
        console.log("Retrieved error from AsyncStorage:", storedError.toJSON());
    }
});

export default ErrorSchema;
