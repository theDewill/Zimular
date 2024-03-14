extern crate ndarray;
use pyo3::{prelude::* , types::PyList};
use pyo3::types::PyDict;
use pyo3::Python;
use mongodb::{
    bson::{doc, to_document, Document},
    options::FindOptions,
    sync::Client,
};

use array::{array , Array2};
use std::*;



#[pyclass]
struct QueryDB {
    db_string: String, //Mongo Uri
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

        //custom type : -----

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

    fn get_info_from_time(&self, time: f64) -> PyResult<(Vec<time_info>)> {

        //Vector to store the data
        let outFrame : Vec<time_info> = Vec::new();


        let client = Client::with_uri_str(&self.db_string).unwrap();
        let db = client.database(&self.db_name);
        let coll   = db.collection::<Document>(&self.db_coll_name);
        let opt =  FindOptions::builder()
        .sort(doc! { "time": 1 }) // Sort by "name" in ascending order
        .build();

        let mut cursor = coll.find(
            doc! { "time": time as f64 },
            opt
        );

    //----- 2nd option------ [ written by : Nomin Sendinu ]

    //     let pipeline = vec![
    //     doc! {
    //         "$facet": {
    //             "IntDocuments": [
    //                 { "$match": { "time.Int": { "$exists": true } , "time.int": time } },
    //                 { "$project": { "time.Int": } } ,// Project only the "time.Int" field
    //                 { "$sort": { "time.Int": 1 } },
    //             ],
    //             "FloatDocuments": [
    //                 { "$match": { "time.Float": { "$exists": true } , "time.int": time as f64 } },                   
    //                 { "$project": { "time.Float": time as f64} }, // Project only the "time.Float" field
    //                 { "$sort": { "time.Int": 1 } },
    //             ]
    //         }
    //     }
    // ];
    // let options = AggregateOptions::builder().build();
    // let mut cursor = collection.aggregate(pipeline, options)?;

    while let Some(result) = cursor.next() {
        match result {
            Ok(doc) => {
                if let (Some(time),Some(comp_catg),Some(como_name),Some(action),Some(entity), Some(info), Some(metadata))=
            (
                doc.get_f64("time"),
                doc.get_str("comp_cat"),
                doc.get_str("comp_name"),
                doc.get_str("action"),
                doc.get_str("entity"),
                doc.get_str("info"),
                doc.get_str("metadata"),
            )
                {
                outFrame.push((time, comp_catg, como_name, action, entity, info, metadata));
            }
            },
            Err(e) => {
                println!("Error retrieving document: {:?}", e);
                return Err(e.into())
            },
        }
    }
        
    }

    
    fn get_metadata(&self, py: Python, db_string: &str, db_name: &str, db_coll_name: &str, comp_name: &str, action: &str) -> PyResult<PyObject> {
    
    let client = Client::with_uri_str(db_string).map_err(|e| PyErr::new::<pyo3::exceptions::PyException, _>(format!("{}", e)))?;
    let db = client.database(db_name);
    let coll  = db.collection::<Document>(&self.db_coll_name);

    let opt = FindOptions::builder().sort(doc! { "time": 1 }).build();
    let cursor = coll.find(
        doc! { "comp_name": comp_name, "action": action }, opt
    ).map_err(|e| PyErr::new::<pyo3::exceptions::PyException, _>(format!("{}", e)))?;

    let dict = PyDict::new(py);

    for result in cursor {
        match result {
            Ok(doc) => {
                if let (Ok(comp_name), Ok(metadata)) = (doc.get_str("comp_name"), doc.get_str("metadata")) {
                    dict.set_item(comp_name, metadata).map_err(|e| PyErr::new::<pyo3::exceptions::PyException, _>(format!("{}", e)))?;
                }
            },
            Err(e) => {
                println!("Error retrieving document: {:?}", e);
                return Err(PyErr::new::<pyo3::exceptions::PyException, _>(format!("{}", e)));
            },
        }
    }

    Ok(dict.into());
}

    fn get_info(&self, comp_name: &str, action: &str) -> PyResult<()> {

    }

}


//[(user1 , [1,2,3,4,5]), (user2 , [1,2,3,4,5])]
#[pyfunction]
fn vec_sum(V1 : Vec<(f64 , String)>, V2 : Vec<(f64, String )>) -> Vec<(f64 , String)> {

    type vec_type = Vec<(f64 , String)>;

    let V1 : vec_type = Vec::new();
    let a = Array1::from(V1);
    let b = Array1::from(V2);
    &a + &b
}

#[pyfunction]
fn vec_sub() -> Vec<(String, f64)> {
    
}
