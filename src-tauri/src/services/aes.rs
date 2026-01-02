use aes_gcm::{
    aead::{rand_core::RngCore, Aead, KeyInit, OsRng},
    Aes256Gcm, Nonce,
};

use base64::{engine::general_purpose, Engine as _};
use std::env;

pub fn encrypt(data: &str) -> Vec<u8> {
    dotenvy::dotenv().ok();

    let key = general_purpose::STANDARD
        .decode(env::var("AES_KEY").expect("AES_KEY missing"))
        .expect("Invalid Base64 in AES_KEY");

    if key.len() != 32 {
        panic!("AES_KEY must be 32 bytes (256 bits) after decoding");
    }

    let cipher = Aes256Gcm::new_from_slice(&key).unwrap();

    // Генерируем случайный nonce для КАЖДОГО шифрования
    let mut nonce_bytes = [0u8; 12];
    let _ = OsRng.try_fill_bytes(&mut nonce_bytes);
    let nonce = Nonce::from_slice(&nonce_bytes);

    // Шифруем данные
    let ciphertext = cipher
        .encrypt(nonce, data.as_bytes())
        .expect("Encryption failed");

    // Возвращаем: nonce (12 байт) + ciphertext
    // Получатель должен знать, что первые 12 байт - это nonce
    let mut result = Vec::with_capacity(12 + ciphertext.len());
    result.extend_from_slice(&nonce_bytes);
    result.extend_from_slice(&ciphertext);

    result
}

pub fn decrypt(data: &[u8]) -> String {
    dotenvy::dotenv().ok();

    // Проверяем, что данных достаточно для nonce
    if data.len() < 12 {
        panic!("Data too short to contain nonce");
    }

    let key = general_purpose::STANDARD
        .decode(env::var("AES_KEY").unwrap())
        .unwrap();

    // Первые 12 байт - nonce
    let nonce = Nonce::from_slice(&data[..12]);
    // Остальное - ciphertext
    let ciphertext = &data[12..];

    let cipher = Aes256Gcm::new_from_slice(&key).unwrap();
    let decrypted = cipher
        .decrypt(nonce, ciphertext)
        .expect("Decryption failed - wrong key, corrupted data, or tampering detected");

    String::from_utf8(decrypted).unwrap()
}
