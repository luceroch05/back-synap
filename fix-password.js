const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'admin123';
  const hash = await bcrypt.hash(password, 10);
  console.log('Password:', password);
  console.log('Hash:', hash);

  // Verificar que el hash funciona
  const isValid = await bcrypt.compare(password, hash);
  console.log('Verification:', isValid);

  // Verificar con el hash del SQL
  const oldHash = '$2a$10$K7L1OJ45/4Y2nIoB3Py9c.hOBZLf9h8Bk5bhQYhGw2Lq.P0SHPfAm';
  const isOldValid = await bcrypt.compare(password, oldHash);
  console.log('Old hash verification:', isOldValid);
}

generateHash();
