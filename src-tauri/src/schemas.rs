#[derive(serde::Serialize)]
pub struct PasswordSchema {
    pub id: i32,
    pub name: String,
    pub password: String,
}
