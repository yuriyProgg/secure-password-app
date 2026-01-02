pub use sea_orm_migration::prelude::*;

mod m20251216_212010_add_name_to_password;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![Box::new(m20251216_212010_add_name_to_password::Migration)]
    }
}
