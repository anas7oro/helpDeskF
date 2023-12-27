function calculateEntropy(password) {
    const N = 94; // Number of possible symbols (ASCII printable characters)
    const L = password.length; // Length of the password

    const entropy = Math.log2(Math.pow(N, L));
    return entropy;
}

module.exports = calculateEntropy;