use std::collections::HashMap;

use db::Bignum;
use pyo3::{
    prelude::*,
    types::{PyDict, PyList},
};

mod db;

/// A Python module implemented in Rust.
#[pymodule]
fn zimdb(_py: Python, m: &PyModule) -> PyResult<()> {
    m.add_class::<ZimDB>()?;
    m.add_function(wrap_pyfunction!(getdic, m)?)?;
    Ok(())
}

#[pyclass]
struct ZimDB {
    db: db::DB,
}

#[pymethods]
impl ZimDB {
    #[new]
    fn new(name: &str, conn: &str) -> PyResult<Self> {
        Ok(ZimDB {
            db: db::DB::new(name, conn).unwrap(),
        })
    }

    fn add_data(
        &mut self,
        py: Python,
        time: PyObject,
        component_category: u8,
        component_name: u64,
        action: u32,
        entity: &str,
        metadata: &PyList,
    ) -> PyResult<()> {
        let time = process_bignum(py, time);
        let metadata = pylist_to_vec_of_tuples(py, metadata);
        self.db
            .add_data(
                time,
                component_category,
                component_name,
                action,
                entity,
                metadata,
            )
            .unwrap();
        Ok(())
    }

    fn add_workflow(&mut self, name: &str) -> PyResult<()> {
        self.db.add_workflow(name).unwrap();
        Ok(())
    }

    //init component_info
    fn printdb(&self) -> PyResult<()> {
        println!("{:#?}", self.db);
        Ok(())
    }

    fn getsizedb(&self) {
        println!("{:?}", self.db.get_db_size());
    }
}

#[pyfunction]
fn getdic(py: Python, py_dic: &PyList) {
    let b = pylist_to_vec_of_tuples(py, py_dic);
    println!("{:?}", b);
}

fn pylist_to_vec_of_tuples(py: Python, py_list: &PyList) -> Vec<(String, String)> {
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
