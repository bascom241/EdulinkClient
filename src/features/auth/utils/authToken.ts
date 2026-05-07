export const setToken = (token: string) => {
    localStorage.setItem("auth", token)
}

export const getToken = () => {
    localStorage.getItem("auth")
}

export const removeToken = () => {
    localStorage.removeItem("auth")
}