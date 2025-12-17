pub mod entities;
pub mod repositories;

use sea_orm::{Database, DatabaseConnection};
use tracing::info;

pub async fn connect() -> DatabaseConnection {
    dotenvy::dotenv().ok();
    // tracing_subscriber::fmt()
    //     .with_max_level(tracing::Level::DEBUG) // WARNING: In production, this should be set to INFO
    //     .with_test_writer()
    //     .init();
    info!("Connecting to database");
    let db = Database::connect(std::env::var("DATABASE_URL").unwrap())
        .await
        .unwrap();

    info!("Successfully connected to database");
    db
}

pub async fn close(db: DatabaseConnection) {
    info!("Closing database connection");
    db.close().await.unwrap();
    info!("Closed database connection");
}
