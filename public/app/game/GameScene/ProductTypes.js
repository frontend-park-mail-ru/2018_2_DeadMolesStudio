const PRODUCTS = {
    0: '\uD83C\uDF46', // 🍆
    1: '\uD83C\uDF4E', // 🍎
    2: '\uD83C\uDF49', // 🍉
    3: '\uD83C\uDF55', // 🍕
    4: '\uD83C\uDF6D', // 🍭
    5: '\uD83C\uDF44', // 🍄
    6: '\uD83C\uDF3D', // 🌽

    EATEN_CORRECT: '+3',
    EATEN_WRONG: '-1',

    HIDDEN_POOL: '\uD83D\uDCA9', // 💩
};

PRODUCTS.COLLECTED = (points = 1) => {
    const id = `COL_${points}`;
    if (!PRODUCTS[id]) {
        const sign = points >= 0 ? '+' : '';
        PRODUCTS[id] = `${sign}${points}`;
    }
    return id;
};

export default PRODUCTS;
