use aes_gcm::{
    aead::{Aead, KeyInit},
    Aes256Gcm, Nonce,
};
use base64::{engine::general_purpose, Engine as _};
use std::env;

pub fn encrypt(data: &str) -> Vec<u8> {
    dotenvy::dotenv().ok();

    // Ключ для AES256 должен быть 32 байта (ваша строка в base64 должна давать 32 байта)
    let key = general_purpose::STANDARD
        .decode(env::var("AES_KEY").expect("AES_KEY missing"))
        .expect("Invalid Base64 in AES_KEY");

    let nonce_raw =
        hex::decode(env::var("AES_GCM").expect("AES_GCM missing")).expect("Invalid HEX in AES_GCM");
    let nonce = Nonce::from_slice(&nonce_raw);
    let cipher = Aes256Gcm::new_from_slice(&key).unwrap();

    cipher.encrypt(nonce, data.as_bytes()).unwrap()
}

pub fn decrypt(data: &[u8]) -> String {
    dotenvy::dotenv().ok();
    let key = general_purpose::STANDARD
        .decode(env::var("AES_KEY").unwrap())
        .unwrap();
    let nonce_raw =
        hex::decode(env::var("AES_GCM").expect("AES_GCM missing")).expect("Invalid HEX in AES_GCM");
    let nonce = Nonce::from_slice(&nonce_raw);
    let cipher = Aes256Gcm::new_from_slice(&key).unwrap();
    let decrypted = cipher.decrypt(nonce, data).unwrap();
    String::from_utf8(decrypted).unwrap()
}
