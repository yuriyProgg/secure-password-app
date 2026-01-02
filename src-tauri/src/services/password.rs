use crate::schemas::PasswordSchema;
use crate::services;
use crate::services::aes::{decrypt, encrypt};
use db::{entities::password, repositories::password::PasswordRepository};
use rand::seq::IteratorRandom;
use sea_orm::{ActiveValue::NotSet, Set};

#[tauri::command]
pub async fn generate_base_password() -> String {
    generate_edit_password(12, true, true, true, true).await
}

#[tauri::command]
pub async fn generate_edit_password(
    length: u16,
    lower: bool,
    upper: bool,
    degits: bool,
    special: bool,
) -> String {
    let mut rng = rand::rng();
    let mut charset = String::new();
    let mut password = String::new();

    if lower {
        charset.extend('a'..='z');
    }
    if upper {
        charset.extend('A'..='Z');
    }
    if degits {
        charset.extend('0'..='9');
    }
    if special {
        charset.push_str("!@#$%^&*()_+-=[]{}|;:,.<>?");
    }
    for _ in 0..length {
        password.push(charset.chars().choose(&mut rng).unwrap());
    }
    password
}

#[tauri::command]
pub async fn list_passwords() -> Vec<PasswordSchema> {
    match services::auth::authenticate().await {
        Ok(authenticated) => {
            if !authenticated {
                return Vec::new();
            }

            let db = db::connect().await;
            let passwords = PasswordRepository::find_all(&db).await.unwrap();
            db::close(db).await;
            decrypt_passwords(passwords).await
        }
        Err(_) => Vec::new(),
    }
}

pub async fn decrypt_passwords(passwords: Vec<password::Model>) -> Vec<PasswordSchema> {
    let mut result: Vec<PasswordSchema> = Vec::new();
    for p in passwords {
        result.push(PasswordSchema {
            id: p.id,
            name: p.name,
            password: decrypt(&p.password),
        });
    }
    result
}

#[tauri::command]
pub async fn update_name(id: i32, name: String) -> bool {
    match services::auth::authenticate().await {
        Ok(r) => {
            if !r {
                return false;
            }
        }
        Err(_) => {
            return false;
        }
    }
    let db = db::connect().await;
    let password: Option<password::Model> = PasswordRepository::find_by_id(&db, id).await.unwrap();
    let mut password: password::ActiveModel = password.unwrap().into();
    password.name = Set(name);
    PasswordRepository::update(&db, password).await.unwrap();
    db::close(db).await;
    return true;
}

#[tauri::command]
pub async fn delete_password(id: i32) -> bool {
    match services::auth::authenticate().await {
        Ok(r) => {
            if !r {
                return false;
            }
        }
        Err(_) => {
            return false;
        }
    }
    let db = db::connect().await;
    match PasswordRepository::delete(&db, id).await {
        Ok(_) => {}
        Err(_) => {
            return false;
        }
    }
    db::close(db).await;
    return true;
}

#[tauri::command]
pub async fn save_password(name: String, password: String) -> bool {
    let mut name = name;
    let len = list_passwords().await.len() + 1;
    if name.is_empty() {
        name = format!("Пароль №{}", len);
    }
    let db = db::connect().await;
    let password = password::ActiveModel {
        id: NotSet,
        name: Set(name),
        password: Set(encrypt(&password)),
        ..Default::default()
    };
    PasswordRepository::create(&db, password).await.unwrap();
    db::close(db).await;
    return true;
}
