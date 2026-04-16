// Modulo dedicado à validação de email e de nome, para o formulário de newsletter e eventos

export const patterns = {
    email: /^[a-z0-9._%+-]+@[a-z0-9-]+\.[a-z]{2,}$/,
    numbers: /\d/g
};

export function isValidEmail(email) {
    return patterns.email.test(email);
}

export function containsNumbers(text) {
    return patterns.numbers.test(text);
}

