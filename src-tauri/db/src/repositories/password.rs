use sea_orm::{ActiveModelTrait, DatabaseConnection, DbErr, DeleteResult, EntityTrait};

use crate::entities::password;

pub struct PasswordRepository;

impl PasswordRepository {
    pub async fn find_by_id(
        db: &DatabaseConnection,
        id: i32,
    ) -> Result<Option<password::Model>, DbErr> {
        password::Entity::find_by_id(id).one(db).await
    }
    pub async fn find_all(db: &DatabaseConnection) -> Result<Vec<password::Model>, DbErr> {
        password::Entity::find().all(db).await
    }
    pub async fn create(
        db: &DatabaseConnection,
        active_model: password::ActiveModel,
    ) -> Result<password::ActiveModel, DbErr> {
        active_model.save(db).await
    }
    pub async fn update(
        db: &DatabaseConnection,
        active_model: password::ActiveModel,
    ) -> Result<password::Model, DbErr> {
        active_model.update(db).await
    }
    pub async fn delete(db: &DatabaseConnection, id: i32) -> Result<DeleteResult, DbErr> {
        password::Entity::delete_by_id(id).exec(db).await
    }
}
