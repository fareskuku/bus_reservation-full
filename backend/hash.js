const bcrypt = require('bcrypt');

async function generateHash() {
    const password = 'admin123';
    const hash = await bcrypt.hash(password, 10);
    console.log('=====================================');
    console.log('Password:', password);
    console.log('Hash:', hash);
    console.log('=====================================');
    console.log('\nCopy this hash and use it in your SQL:');
    console.log(`UPDATE users SET password_hash = '${hash}' WHERE email = 'admin@bus.com';`);
}

generateHash();