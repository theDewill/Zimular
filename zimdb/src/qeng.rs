use pyo3::prelude::*;
use mongodb::{
    bson::{doc, to_document, Document},
    options::FindOptions,
    sync::Client,
};

#[pyclass]
struct QueryDB {
    db_string: String,
    db: String,
    db_name: String,
    db_coll_name: String
}


#[pymethods]
impl QueryDB {
    #[new]
    fn new(dbstring: &str, db: &str, db_name: &str, db_coll_name: &str) -> PyResult<Self> {
        Ok(QueryDB {
            db_string: dbstring.to_string(),
            db: db.to_string(),
            db_name: db_name.to_string(),
            db_coll_name: db_coll_name.to_string()
        })
    }

    fn getcomp(&self, com_name: &str, act: &str) -> PyResult<Vec<(f64, String)>> {
        let client = Client::with_uri_str(&self.db_string).unwrap();
        let db = client.database(&self.db_name);
        let coll = db.collection::<Document>(&self.db_coll_name);

        let filter = doc! {"component_name": com_name, "action": act};

        let mut res = Vec::new();

        let opt = FindOptions::builder().sort(doc! {"time": 1}).build();

        //let input = coll.find(filter, None).unwrap();

        if let Ok(cursor) = coll.find(filter, opt) {
            for result in cursor {
                if let Ok(document) = result {
                    if let Ok(time_doc) = document.get_document("time") {
                        if let Ok(time_float) = time_doc.get_f64("Float") {
                            if let Ok(entity) = document.get_str("entity") {
                                res.push((time_float, entity.to_string()));
                            }
                        } else if let Ok(time_int) = time_doc.get_i64("Int") {
                            if let Ok(entity) = document.get_str("entity") {
                                res.push((time_int as f64, entity.to_string()));
                            }
                        }
                    }
                } else {
                    println!("Error: document is not found");
                }
            }
        }

        // println!("{:#?}", res);

        Ok(res)
    }

    fn get_info_from_time(&self, time: f64) -> PyResult<()> {
        // time -> document vec = [(time, comp_cat, comp_name, action, entity, info, metadata)]
    }

    fn get_metadata(&self, comp_name: &str, action: &str) -> PyResult<()> {
        // comp_name, action -> metadata ->PyDic<> 
    }

    fn get_info(&self, comp_name: &str, action: &str) -> PyResult<()> {

    }

}

#[pyfunction]
fn vec_sum() -> Vec<(String, f64)>

#[pyfunction]
fn vec_sub() -> Vec<(String, f64)>
