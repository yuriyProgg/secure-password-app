// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use migration::{Migrator, MigratorTrait};
use db::*;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let db = connect().await;
    Migrator::up(&db, None).await?;
    close(db).await;
    secure_password_app_lib::run();
    Ok(())
}
