export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const isValidName = (name: string): boolean => {
    const nameRegex = /^[a-zA-Z0-9_ ]*$/;
    return nameRegex.test(name);
};