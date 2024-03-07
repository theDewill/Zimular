use mongodb::{
    bson::{Bson, Document},
    sync::{Client, Collection},
};

use crate::db::DB;

pub fn mongo_connect(uri: &str, dbname: &str, collname: &str) -> Collection<Document> {
    let client = Client::with_uri_str(uri).unwrap();
    let db = client.database(dbname);
    db.collection(collname)
}
