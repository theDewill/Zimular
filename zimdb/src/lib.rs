use db::{Bignum, CatComp, SimOutData};
use mongodb::{
    bson::{doc, to_document, Bson, Document},
    options::UpdateOptions,
    sync::{Client, Collection},
};
use pyo3::{prelude::*, types::PyList};
use serde::{Deserialize, Serialize};

mod db;
mod mconn;

/// A Python module implemented in Rust.
#[pymodule]
fn zimdb(_py: Python, m: &PyModule) -> PyResult<()> {
    m.add_class::<ZimDB>()?;
    Ok(())
}

#[pyclass]
#[derive(Debug, Serialize, Deserialize)]
struct ZimDB {
    db: db::DB,
    table: db::SimuTable,
}

#[pymethods]
impl ZimDB {
    #[new]
    fn new(dbname: &str, name: &str, conn: &str, tablename: &str) -> PyResult<Self> {
        Ok(ZimDB {
            db: db::DB::new(dbname, name, conn, tablename).unwrap(),
            table: db::SimuTable::new(tablename),
        })
    }

    fn add_data(
        &mut self,
        py: Python,
        time: PyObject,
        component_category: &str,
        component_name: &str,
        action: &str,
        entity: &str,
        metadata: &PyList,
    ) -> PyResult<()> {
        let time = process_bignum(py, time);
        let component_category = str_to_catcomp(component_category);
        let metadata = pylist_to_vec_of_tuples(metadata);

        self.table.add_data(
            time,
            component_category,
            component_name,
            action,
            entity,
            metadata,
        );

        Ok(())
    }

    fn add_workflow(&mut self, name: &str) -> PyResult<()> {
        self.db.add_workflow(name).unwrap();
        Ok(())
    }

    //init component_info

    fn add_resource(&mut self, name: &str, workflow: &str, component_name: &str) -> PyResult<()> {
        self.db
            .add_resource(name, workflow, component_name)
            .unwrap();
        Ok(())
    }

    fn add_container(&mut self, name: &str, workflow: &str, component_name: &str) -> PyResult<()> {
        self.db
            .add_container(name, workflow, component_name)
            .unwrap();
        Ok(())
    }

    fn add_store(&mut self, name: &str, workflow: &str, component_name: &str) -> PyResult<()> {
        self.db.add_store(name, workflow, component_name).unwrap();
        Ok(())
    }

    fn add_custom(&mut self, name: &str, workflow: &str, component_name: &str) -> PyResult<()> {
        self.db.add_custom(name, workflow, component_name).unwrap();
        Ok(())
    }

    fn printdb(&self) -> PyResult<()> {
        println!("{:#?}", self.db);
        Ok(())
    }

    fn printtable(&self) -> PyResult<()> {
        println!("{:#?}", self.table);
        Ok(())
    }

    fn getsizetable(&self) -> PyResult<usize> {
        Ok(self.table.tablelen())
    }

    fn senddb(&self) -> PyResult<()> {
        let client = Client::with_uri_str(self.db.get_conn()).unwrap();
        let db = client.database(self.db.get_dbname());
        let coll = db.collection::<db::DB>(self.db.get_name());
        let input = coll.insert_one(&self.db, None);
        if input.is_ok() {
            Ok(())
        } else {
            panic!("mongo insert Error");
        }
    }

    fn sendtable(&self) -> PyResult<()> {
        let client = Client::with_uri_str(self.db.get_conn()).unwrap();
        let db = client.database(self.db.get_dbname());
        let coll = db.collection::<db::SimuTable>(self.db.get_name());
        let input = coll.insert_one(&self.table, None);
        if input.is_ok() {
            Ok(())
        } else {
            panic!("mongo insert Error");
        }
    }

    fn sendtablecollection(&self) -> PyResult<()>{
        let client = Client::with_uri_str(self.db.get_conn()).unwrap();
        let db = client.database(self.db.get_dbname());
        let coll = db.collection::<Document>(self.db.get_table());

        let docs = self.table.table.iter().map(|x| to_document(&x).unwrap()).collect::<Vec<Document>>();

        let input = coll.insert_many(docs, None);
        if input.is_ok() {
            Ok(())
        } else {
            panic!("mongo insert Error");
        }
    

    }
}

fn pylist_to_vec_of_tuples(py_list: &PyList) -> Vec<(String, String)> {
    let mut vec_of_tuples = Vec::new();

    for inner_list in py_list.iter() {
        if let Ok(inner) = inner_list.extract::<Vec<String>>() {
            if inner.len() == 2 {
                vec_of_tuples.push((inner[0].clone(), inner[1].clone()));
            }
        }
    }

    vec_of_tuples
}

fn str_to_catcomp(comp_cat: &str) -> CatComp {
    match comp_cat {
        "resource" => CatComp::Resource,
        "piorityresource" => CatComp::PriorityResource,
        "peemptiveresource" => CatComp::PreemptiveResource,
        "store" => CatComp::Store,
        "prioritystore" => CatComp::PriorityStore,
        "filterstore" => CatComp::FilterStore,
        "container" => CatComp::Container,
        "custom" => CatComp::Custom,
        _ => panic!("Unsupported type"),
    }
}

fn process_bignum(py: Python, value: PyObject) -> Bignum {
    match value.extract::<i64>(py) {
        Ok(f) => Bignum::Int(f),
        Err(_) => match value.extract::<f64>(py) {
            Ok(i) => Bignum::Float(i),
            Err(_) => {
                panic!("Unsupported type");
            }
        },
    }
}
