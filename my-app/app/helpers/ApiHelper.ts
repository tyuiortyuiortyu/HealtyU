// import AsyncStorage from '@react-native-async-storage/async-storage';

// export class ApiHelper {
//     static async request<T>(url: string, method: "GET" | "POST", model?: any, accessToken?: string): Promise<T> {
//         try {
//             const headers: Record<string, string> = {
//                 "Content-Type": "application/json",
//             };

//             // Jika accessToken tidak diberikan sebagai parameter, coba ambil dari AsyncStorage
//             const token = accessToken || (await AsyncStorage.getItem("access_token"));

//             // Tambahkan token ke headers jika token tersedia
//             if (token) {
//                 headers["Authorization"] = `Bearer ${token}`;
//             }

//             const response = await fetch(url, {
//                 method,
//                 headers,
//                 body: model ? JSON.stringify(model) : undefined,
//             });

//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }

//             return await response.json();
//         } catch (error) {
//             if (error instanceof Error) {
//                 throw new Error(error.message || "API request failed");
//             } else {
//                 throw new Error("API request failed");
//             }
//         }
//     }
// }

// contoh penggunaan
// const response = await ApiHelper.request<MyResponseType>("/api/data", "GET");
// or
// const response = await ApiHelper.request<MyResponseType>("/api/data", "GET", undefined, "your_access_token_here");

// sebelum pakai simpan dulu
// import AsyncStorage from '@react-native-async-storage/async-storage';

// Simpan token setelah login/registrasi
// await AsyncStorage.setItem("access_token", "your_access_token_here");



import AsyncStorage from '@react-native-async-storage/async-storage';

export class ApiHelper {
    static async request<T>(
        url: string,
        method: "GET" | "POST" | "DELETE" | "PUT", // Tambahkan method DELETE dan PUT
        model?: any,
        accessToken?: string,
        isMultipart: boolean = false
    ): Promise<T> {
        try {
            const headers: Record<string, string> = {};

            // Jika accessToken tidak diberikan sebagai parameter, coba ambil dari AsyncStorage
            const token = accessToken || (await AsyncStorage.getItem("access_token"));

            // Tambahkan token ke headers jika token tersedia
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            // Jika bukan multipart, set Content-Type ke application/json
            if (!isMultipart) {
                headers["Content-Type"] = "application/json";
            }

            // Siapkan body request
            let body: any;
            if (model) {
                if (isMultipart) {
                    // Jika multipart, gunakan FormData
                    body = new FormData();
                    for (const key in model) {
                        if (model.hasOwnProperty(key)) {
                            body.append(key, model[key]);
                        }
                    }
                } else {
                    // Jika bukan multipart, gunakan JSON
                    body = JSON.stringify(model);
                }
            }

            const response = await fetch(url, {
                method,
                headers,
                body,
            });

            // Jika response tidak OK, lempar error dengan detail response
            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(
                    errorResponse.message || `HTTP error! Status: ${response.status}`
                );
            }

            return await response.json();
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message || "API request failed");
            } else {
                throw new Error("API request failed");
            }
        }
    }

    // Tambahkan fungsi logout
    static async logout(): Promise<void> {
        try {
            const accessToken = await AsyncStorage.getItem("access_token");

            if (!accessToken) {
                throw new Error("No access token found");
            }

            // Kirim permintaan logout ke backend
            await this.request<void>(
                "http://127.0.0.1:8000/api/auth/logout",
                "POST",
                undefined, // Tidak perlu body untuk logout
                accessToken
            );

            // Hapus token dari AsyncStorage setelah logout berhasil
            await AsyncStorage.removeItem("access_token");
            await AsyncStorage.removeItem("isGuest");
            await AsyncStorage.removeItem("profile_data");
            await AsyncStorage.removeItem("userData");
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message || "Logout failed");
            } else {
                throw new Error("Logout failed");
            }
        }
    }
}

export default ApiHelper;