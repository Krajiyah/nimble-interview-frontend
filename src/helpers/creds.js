import * as SecureStore from 'expo-secure-store';

const usernameKey = "username"
const passwordKey = "password"
const tokenKey = "token"
const configKey = "config"

export async function saveCreds(username, password, token) {
    await SecureStore.setItemAsync(usernameKey, username)
    await SecureStore.setItemAsync(passwordKey, password)
    await SecureStore.setItemAsync(tokenKey, token)
}

export async function getCreds() {
    return {
        username: await SecureStore.getItemAsync(usernameKey),
        password: await SecureStore.getItemAsync(passwordKey),
        token: await SecureStore.getItemAsync(tokenKey),
    }
}

export async function getConfig() {
    return JSON.parse((await SecureStore.getItemAsync(configKey)) || "{}")
}

export async function setConfig(config) {
    await SecureStore.setItemAsync(configKey, JSON.stringify(config))
}
