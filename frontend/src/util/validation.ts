export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const isValidName = (name: string): boolean => {
    const nameRegex = /^[a-zA-Z0-9_ ]*$/;
    return nameRegex.test(name);
};

export const isValidPassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
    return passwordRegex.test(password);
};

export const isEmpty =(str: string | undefined | null): boolean => {
    return !str || str.trim() === '';
}