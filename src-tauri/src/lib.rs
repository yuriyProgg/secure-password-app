mod schemas;
mod services;

use services::{auth, password};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .invoke_handler(tauri::generate_handler![
            auth::authenticate,
            password::generate_base_password,
            password::generate_edit_password,
            password::list_passwords,
            password::update_name,
            password::delete_password,
            password::save_password
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
