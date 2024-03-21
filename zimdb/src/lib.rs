use db::CatComp;
use mongodb::{
    bson::{doc, to_document, Document},
    options::FindOptions,
    sync::Client,
};
use prettytable::{Cell, Row, Table};
use pyo3::exceptions::PyValueError;
use pyo3::{prelude::*, types::PyList};
use serde::{Deserialize, Serialize};

mod db;
mod qeng;

/// A Python module implemented in Rust.
#[pymodule]
fn zimdb(_py: Python, m: &PyModule) -> PyResult<()> {
    m.add_class::<ZimDB>()?;
    m.add_class::<qeng::QueryDB>()?;
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
    fn new(dbname: &str, name: &str, conn: &str, tablename: &str, len: usize) -> PyResult<Self> {
        Ok(ZimDB {
            db: db::DB::new(dbname, name, conn, tablename, len).unwrap(),
            table: db::SimuTable::new(tablename),
        })
    }

    fn add_data(
        &mut self,
        time: f64,
        component_category: &str,
        component_name: &str,
        action: &str,
        entity: Option<String>,
        info: Option<f64>,
        metadata: Option<&PyList>,
    ) -> PyResult<()> {
        let component_category = str_to_catcomp(component_category);
        let metadata = pylist_to_vec_of_tuples(metadata);

        self.table.add_data(
            time,
            component_category,
            component_name,
            action,
            entity,
            info,
            metadata,
        );

        if self.table.tablelen() == self.db.get_dblen() {
            self.sendtablecollection().unwrap();
            self.table.clear_table();
            self.db.change_modifid(true);
            self.db.change_savetime();
        }

        Ok(())
    }

    fn add_input_data_group(&mut self, groupname: &str, key: &str, value: &str) -> PyResult<()> {
        Ok(self.db.add_inputdata(groupname, key, value).unwrap())
    }

    fn add_workflow(&mut self, name: &str) -> PyResult<()> {
        self.db.add_workflow(name).unwrap();
        Ok(())
    }

    fn addcomp_toworkflow(
        &mut self,
        workflow_name: String,
        comp_name: String,
        comp_cat: String,
    ) -> PyResult<()> {
        let comp_cat = str_to_catcomp(&comp_cat);
        self.db
            .add_com_to_workflow(&workflow_name, comp_cat, &comp_name)
            .unwrap();
        Ok(())
    }

    fn add_entity_to_db(&mut self, entity: &str, value: f64) -> PyResult<()> {
        self.db.add_entity(entity, value).unwrap();
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

    fn sendtablecollection(&self) -> PyResult<()> {
        let client = Client::with_uri_str(self.db.get_conn()).unwrap();
        let db = client.database(self.db.get_dbname());
        let coll = db.collection::<Document>(self.db.get_table());

        let docs = self
            .table
            .table
            .iter()
            .map(|x| to_document(&x).unwrap())
            .collect::<Vec<Document>>();

        let input = coll.insert_many(docs, None);
        if input.is_ok() {
            Ok(())
        } else {
            panic!("mongo insert Error");
        }
    }

    fn getcomp(&self, com_name: &str, act: &str) -> PyResult<Vec<(f64, String)>> {
        let client = Client::with_uri_str(self.db.get_conn()).unwrap();
        let db = client.database(self.db.get_dbname());
        let coll = db.collection::<Document>(self.db.get_table());

        let filter = doc! {"component_name": com_name, "action": act};

        let mut res = Vec::new();

        let opt = FindOptions::builder().sort(doc! {"time": 1}).build();

        //let input = coll.find(filter, None).unwrap();

        if let Ok(cursor) = coll.find(filter, opt) {
            println!("{:?}", cursor);
            for result in cursor {
                if let Ok(document) = result {
                    if let Ok(time_float) = document.get_f64("time") {
                        if let Ok(entity) = document.get_str("entity") {
                            res.push((time_float, entity.to_string()));
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

    fn print_table_col(&self) -> PyResult<()> {
        let client = Client::with_uri_str(self.db.get_conn()).unwrap();
        let db = client.database(self.db.get_dbname());
        let coll = db.collection::<Document>(self.db.get_table());

        // Query the collection
        let mut cursor = coll
            .find(None, None)
            .map_err(|e| PyValueError::new_err(format!("MongoDB error: {}", e)))?;

        // Create a table
        let mut table = Table::new();
        table.set_format(*prettytable::format::consts::FORMAT_CLEAN);

        // Add headers
        if let Some(doc) = cursor
            .next()
            .transpose()
            .map_err(|e| PyValueError::new_err(format!("MongoDB error: {}", e)))?
        {
            let headers: Vec<_> = doc.keys().map(|k| k.to_string()).collect();
            table.add_row(Row::from(headers));
        }

        // Add rows
        while let Some(doc) = cursor
            .next()
            .transpose()
            .map_err(|e| PyValueError::new_err(format!("MongoDB error: {}", e)))?
        {
            let row: Vec<_> = doc.values().map(|v| Cell::new(&v.to_string())).collect();
            table.add_row(Row::from(row));
        }

        // Print the table
        table.printstd();

        Ok(())
    }
}

fn pylist_to_vec_of_tuples(py_list: Option<&PyList>) -> Option<Vec<(String, String)>> {
    let mut vec_of_tuples = Vec::new();
    // match py_list{
    //     Some(v) => println!("v: {:?}", v),
    //     None => println!("None")
    // }

    if let Some(list) = py_list {
        for item in list.iter() {
            if let Ok(item) = item.extract::<Vec<String>>() {
                if item.len() == 2 {
                    vec_of_tuples.push((item[0].clone(), item[1].clone()));
                } else {
                    panic!("Unsupported type [Pylist -> [[str, str]] ]");
                }
            } else {
                panic!("Unsupported type [Pylist -> [[str, str]] ]");
            }
        }
        Some(vec_of_tuples)
    } else {
        None
    }
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

//fn process_bignum(py: Python, value: PyObject) -> Bignum {
//    match value.extract::<i64>(py) {
//        Ok(f) => Bignum::Int(f),
//        Err(_) => match value.extract::<f64>(py) {
//            Ok(i) => Bignum::Float(i),
//            Err(_) => {
//                panic!("Unsupported type");
//            }
//        },
//    }
//}
