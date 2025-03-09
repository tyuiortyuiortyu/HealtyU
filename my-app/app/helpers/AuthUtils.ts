import AsyncStorage from '@react-native-async-storage/async-storage';

class AuthUtil {
    // Cek apakah user sudah login
    static async checkIsLoggedIn(): Promise<boolean> {
        const token = await AsyncStorage.getItem("access_token");
        return token !== null;
    }

    // Simpan access token
    static async setAccessToken(token: string): Promise<void> {
        await AsyncStorage.setItem("access_token", token);
    }

    // Hapus access token
    static async removeAccessToken(): Promise<void> {
        await AsyncStorage.removeItem("access_token");
    }

    // Ambil access token
    static async getAccessToken(): Promise<string | null> {
        return await AsyncStorage.getItem("access_token");
    }

    // Simpan refresh token
    static async setRefreshToken(token: string): Promise<void> {
        await AsyncStorage.setItem("refresh_token", token);
    }

    // Ambil refresh token
    static async getRefreshToken(): Promise<string | null> {
        return await AsyncStorage.getItem("refresh_token");
    }

    // Hapus refresh token
    static async removeRefreshToken(): Promise<void> {
        await AsyncStorage.removeItem("refresh_token");
    }

    // Cek apakah token masih valid
    static async isTokenValid(): Promise<boolean> {
        const token = await this.getAccessToken();
        if (!token) {
            return false;
        }

        // Decode JWT untuk memeriksa waktu kedaluwarsa
        const payload = this.decodeJWT(token);
        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp > currentTime;
    }

    // Decode JWT
    static decodeJWT(token: string): any {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error("Failed to decode JWT", error);
            return null;
        }
    }

    // Refresh token
    static async refreshToken(): Promise<void> {
        const refreshToken = await this.getRefreshToken();
        if (!refreshToken) return;

        // Lakukan API call untuk refresh token
        try {
            const response = await fetch('/api/refresh-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh_token: refreshToken }),
            });

            if (response.ok) {
                const data = await response.json();
                await this.setAccessToken(data.access_token);
                // Jika ada refresh token baru, simpan juga
                if (data.refresh_token) {
                    await this.setRefreshToken(data.refresh_token);
                }
            } else {
                await this.removeAccessToken();
                await this.removeRefreshToken();
                throw new Error("Failed to refresh token");
            }
        } catch (error) {
            console.error("Token refresh failed", error);
            await this.removeAccessToken();
            await this.removeRefreshToken();
            // Handle logout atau redirect ke halaman login
        }
    }

    // Ambil role user dari token
    static async getUserRole(): Promise<string | null> {
        const token = await this.getAccessToken();
        if (!token) return null;

        const payload = this.decodeJWT(token);
        return payload.role || null; // Asumsikan role ada di dalam payload token
    }

    // Logout
    static async logout(): Promise<void> {
        await this.removeAccessToken();
        await this.removeRefreshToken();
        // Redirect ke halaman login atau lakukan tindakan lain
    }
}
export default AuthUtil;