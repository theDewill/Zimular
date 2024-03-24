use mongodb::{
    bson::{doc, Bson, Document},
    options::FindOptions,
    sync::Client,
};
use pyo3::prelude::*;
use serde_json::json;

#[pyclass]
pub struct QueryDB {
    db_string: String,
    db: String,
    db_name: String,
    db_coll_name: String,
}

#[pymethods]
impl QueryDB {
    #[new]
    fn new(dbstring: &str, db: &str, db_name: &str, db_coll_name: &str) -> PyResult<Self> {
        Ok(QueryDB {
            db_string: dbstring.to_string(),
            db: db.to_string(),
            db_name: db_name.to_string(),
            db_coll_name: db_coll_name.to_string(),
        })
    }

    //Vec<(f64, String)>

    fn getcomp(&self, com_name: &str, act: &str) -> PyResult<String> {
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
                        if let Ok(time_float) = document.get_f64("time") {
                            if let Ok(entity) = document.get_str("entity") {
                                res.push(json!({
                                    "time": time_float,
                                    "entity": entity.to_string()
                                }));
                            }
                        }
                } else {
                    println!("Error: document is not found");
                }
            }
        }

        // println!("{:#?}", res);
        let rest = json!(res).to_string();
        Ok(rest)
    }
    //Vec<(String, usize, usize, usize, usize)>

    fn get_workflow_details(&self, sim_name: &str) -> PyResult<String> {
        let client = Client::with_uri_str(&self.db_string).unwrap();
        let db = client.database(&self.db_name);
        let coll = db.collection::<Document>(&self.db);

        let mut top = Vec::new();

        let filter = doc! {"database": sim_name};

        if let Ok(cursor) = coll.find(filter, None) {
            for result in cursor {
                if let Ok(r_doc) = result {
                    let comp_info = r_doc.get_document("component_info").unwrap();
                    let workflow_info = comp_info.get_document("workflow").unwrap();
                    for (workflow_name, values) in workflow_info {
                        if let Bson::Document(w_data) = values {
                            let mut resource_info: usize = 0;
                            let mut piores_info: usize= 0;
                            let mut preem_info: usize= 0;
                            let mut container_info: usize= 0;
                            let mut store_info: usize= 0;
                            let mut fil_info: usize= 0;
                            let mut priostore_info: usize= 0;
                            let mut custom_info: usize= 0;

                            if let Ok(r_data) = w_data.get_array("resources") {
                                resource_info = r_data.len();
                            }

                            if let Ok(rpio_data) = w_data.get_array("piority_resources"){
                                piores_info = rpio_data.len();
                            }

                            if let Ok(rpeer_data) = w_data.get_array("preemptive_resources"){
                                preem_info = rpeer_data.len();
                            }

                            if let Ok(c_data) = w_data.get_array("containers") {
                                container_info = c_data.len();
                            }

                            if let Ok(s_data) = w_data.get_array("store") {
                                store_info = s_data.len();
                            }

                            if let Ok(spio_data) = w_data.get_array("priority_store"){
                                priostore_info = spio_data.len();
                            }

                            if let Ok(fil_data) = w_data.get_array("filter_store"){
                                fil_info = fil_data.len();
                            }

                            if let Ok(cus_data) = w_data.get_array("custom") {
                                custom_info = cus_data.len();
                            }

                            top.push(json!({
                                "workflow_name": workflow_name.to_string(),
                                "res_count": resource_info,
                                "prires_count": piores_info,
                                "preeres_count": preem_info,
                                "cont_count": container_info,
                                "store_count": store_info,
                                "filstore_count": fil_info,
                                "pristore_count": priostore_info,
                                "custom": custom_info
                            }));
                        }                        
                    }   
                }
            }
        }


        Ok(json!(top).to_string())
    }

    fn last_element_time(&self) -> PyResult<f64> {
        let client = Client::with_uri_str(&self.db_string).unwrap();
        let db = client.database(&self.db_name);
        let coll = db.collection::<Document>(&self.db_coll_name);

        let options = FindOptions::builder().sort(doc! {"time": -1}).projection(doc! {"_id": 0, "time": 1}).build();

        if let Ok(cursor) = coll.find(None, options) {
            for result in cursor {
                if let Ok(document) = result {
                    if let Ok(time_float) = document.get_f64("time") {
                        return Ok(time_float);
                    }
                }
            }
            panic!("Error: time is not found : fn last_element_time")
        } else {
            panic!("Error: cursor is not found : fn last_element_time")
        }
    
    }

    fn get_entity_info(&self, sim_name: &str) -> PyResult<String> {
        let client = Client::with_uri_str(&self.db_string).unwrap();
        let db = client.database(&self.db_name);
        let coll = db.collection::<Document>(&self.db);

        let mut res = Vec::new();
        println!("sim_name: {:?}", sim_name);
        let filter = doc! {"database": sim_name};
        let mut total_count: f64 = 0.0;        

        if let Ok(cursor) = coll.find(filter, None) {
            for result in cursor {
                if let Ok(r_doc) = result {
                    let ent_info = r_doc.get_document("entity").unwrap();
                    for (entity_name, values) in ent_info {
                        total_count += values.as_f64().unwrap();
                        res.push((entity_name.to_string(), values.as_f64().unwrap()));
                    }
                }
            }
        }

        let mut res2 = Vec::new();
        for (name, value) in res {
            res2.push(json!({
                "entity_name": name,
                "entity_count": value, 
                "percentage":(value/total_count)*100.0
            }));
        }

        Ok(json!(res2).to_string())

    }


    fn avg_entity_time(&self, sim_name: &str) -> PyResult<f64>{
        let client = Client::with_uri_str(&self.db_string).unwrap();
        let db = client.database(&self.db_name);
        let coll = db.collection::<Document>(&self.db);

        let filter = doc! {"database": sim_name};
        let mut total_count: f64 = 0.0;
        let total_time = &self.last_element_time().unwrap();

        if let Ok(cursor) = coll.find(filter, None) {
            for result in cursor {
                if let Ok(r_doc) = result {
                    let ent_info = r_doc.get_document("entity").unwrap();
                    for (_, values) in ent_info {
                        total_count += values.as_f64().unwrap();
                    }
                }
            }
        }

        Ok(total_time/total_count)
    }

    //(f64, f64, f64, f64, f64, f64, f64, f64)

    fn get_component_count(&self, sim_name: &str) -> PyResult<String> {
        let client = Client::with_uri_str(&self.db_string).unwrap();
        let db = client.database(&self.db_name);
        let coll = db.collection::<Document>(&self.db);
        let filter = doc! {"database": sim_name};

        let mut resource_info: usize = 0;
        let mut piores_info: usize = 0;
        let mut preem_info: usize = 0;
        let mut container_info: usize = 0;
        let mut store_info: usize = 0;
        let mut fil_info: usize = 0;
        let mut priostore_info: usize = 0;
        let mut custom_info: usize = 0;


        if let Ok(cursor) = coll.find(filter, None) {
            for result in cursor {
                if let Ok(r_doc) = result {
                    let comp_info = r_doc.get_document("component_info").unwrap();
                    let workflow_info = comp_info.get_document("workflow").unwrap();
                    for (_, values) in workflow_info {
                        if let Bson::Document(w_data) = values {

                            if let Ok(r_data) = w_data.get_array("resources") {
                                resource_info += r_data.len();
                            }

                            if let Ok(rpio_data) = w_data.get_array("piority_resources"){
                                piores_info += rpio_data.len();
                            }

                            if let Ok(rpeer_data) = w_data.get_array("preemptive_resources"){
                                preem_info += rpeer_data.len();
                            }

                            if let Ok(c_data) = w_data.get_array("containers") {
                                container_info += c_data.len();
                            }

                            if let Ok(s_data) = w_data.get_array("store") {
                                store_info += s_data.len();
                            }

                            if let Ok(spio_data) = w_data.get_array("priority_store"){
                                priostore_info += spio_data.len();
                            }

                            if let Ok(fil_data) = w_data.get_array("filter_store"){
                                fil_info += fil_data.len();
                            }

                            if let Ok(cus_data) = w_data.get_array("custom") {
                                custom_info += cus_data.len();
                            }

                        }                        
                    }   
                }
            }
        }

        let total_sum = (resource_info + piores_info + preem_info + container_info + store_info + fil_info + priostore_info + custom_info) as f64;

        let resource_percent = ((resource_info as f64 / total_sum) * 100.0).round();
        let piores_percent = ((piores_info as f64 / total_sum) * 100.0).round();
        let preem_percent = ((preem_info as f64 / total_sum) * 100.0).round();
        let container_percent = ((container_info as f64 / total_sum) * 100.0).round();
        let store_percent = ((store_info as f64 / total_sum) * 100.0).round();
        let fil_percent = ((fil_info as f64 / total_sum) * 100.0).round();
        let priostore_percent = ((priostore_info as f64 / total_sum) * 100.0).round();
        let custom_percent = ((custom_info as f64 / total_sum) * 100.0).round();

        Ok(json!({
            "resource": resource_percent,
            "piorityresource": piores_percent,
            "peemptiveresource": preem_percent,
            "container": container_percent,
            "store": store_percent,
            "filterstore": fil_percent,
            "prioritystore": priostore_percent,
            "custom": custom_percent,
        }).to_string())
    }

    fn get_full_data(
        &self,
        time: Option<f64>,
        comp_cat: Option<&str>,
        comp_name: Option<&str>,
        action: Option<&str>,
        entity: Option<&str>,
        info: Option<f64>,
    ) -> PyResult<String>{
        let client = Client::with_uri_str(&self.db_string).unwrap();
        let db = client.database(&self.db_name);
        let coll = db.collection::<Document>(&self.db_coll_name);
        let mut res = Vec::new();

        let mut filter = doc! {};

        if let Some(e) = entity {
            filter.insert("entity", e);
        }
        if let Some(t) = time {
            filter.insert("time", t);
        }
        if let Some(b) = comp_name {
            filter.insert("component_name", b);
        }
        if let Some(c) = comp_cat {
            filter.insert("component_category", c);
        }
        if let Some(a) = action {
            filter.insert("action", a);
        }
        if let Some(i) = info {
            filter.insert("info", i);
        }


        let opt = FindOptions::builder().sort(doc! {"time": 1}).build();


        if let Ok(cursor) = coll.find(filter, opt) {
            for result in cursor {
                if let Ok(document) = result {
                        if let Ok(time_float) = document.get_f64("time") {
                            
                                if let Ok(info) = document.get_f64("info") {
                                    res.push(json!({
                                        "time": time_float,
                                        "component_category": document.get_str("component_category").unwrap().to_string(),
                                        "component_name": document.get_str("component_name").unwrap().to_string(),
                                        "action": document.get_str("action").unwrap().to_string(),
                                        "entity": Some(document.get_str("entity").unwrap_or_default().to_string()),
                                        "info": Some(info)
                                }));
                                    
                                }
                            
                        }
                } else {
                    println!("Error: document is not found");
                }
            }
        }else {
            println!("cursor is not found");
        }
        Ok(json!(res).to_string())
    }

    fn get_comp_name_cat_workflow(&self, sim_name: &str) -> PyResult<String> {
        let client = Client::with_uri_str(&self.db_string).unwrap();
        let db = client.database(&self.db_name);
        let coll = db.collection::<Document>(&self.db);

        let mut top = Vec::new();

        let filter = doc! {"database": sim_name};

        if let Ok(cursor) = coll.find(filter, None) {
            for result in cursor {
                if let Ok(r_doc) = result {
                    let comp_info = r_doc.get_document("component_info").unwrap();
                    let workflow_info = comp_info.get_document("workflow").unwrap();
                    for (workflow_name, values) in workflow_info {
                        if let Bson::Document(w_data) = values {
                            for (comp_name, comp_cat) in w_data {
                                for i in comp_cat.as_array().unwrap() {
                                    top.push(json!({
                                        "workflow_name": workflow_name.to_string(),
                                        "component_catgory": comp_name.to_string(),
                                        "component_name": i.as_str().unwrap().to_string()
                                    }));
                                }
                            }
                        }                        
                    }   
                }
            }
        }

        Ok(json!(top).to_string())
    }

    fn get_resource_enter_count(&self, res_name: &str) -> PyResult<i64> {
        let client = Client::with_uri_str(&self.db_string).unwrap();
        let db = client.database(&self.db_name);
        let coll = db.collection::<Document>(&self.db_coll_name);

        let mut count:i64 = 0;

        let filter = doc! {"component_name": res_name, "action": "enter"};

        if let Ok(cursor) = coll.find(filter, None) {
            for result in cursor {
                if let Ok(_) = result {
                    count += 1;
                }
            }
        }

        Ok(count)

    }

    fn get_resource_leave_count(&self, res_name: &str) -> PyResult<i64> {
        let client = Client::with_uri_str(&self.db_string).unwrap();
        let db = client.database(&self.db_name);
        let coll = db.collection::<Document>(&self.db_coll_name);

        let mut count:i64 = 0;

        let filter = doc! {"component_name": res_name, "action": "leave"};

        if let Ok(cursor) = coll.find(filter, None) {
            for result in cursor {
                if let Ok(_) = result {
                    count += 1;
                }
            }
        }

        Ok(count)

    }

    fn get_resource_queued_count(&self, res_name: &str) -> PyResult<i64> {
        let client = Client::with_uri_str(&self.db_string).unwrap();
        let db = client.database(&self.db_name);
        let coll = db.collection::<Document>(&self.db_coll_name);

        let mut count:i64 = 0;

        let filter = doc! {"component_name": res_name, "action": "queued"};

        if let Ok(cursor) = coll.find(filter, None) {
            for result in cursor {
                if let Ok(_) = result {
                    count += 1;
                }
            }
        }

        Ok(count)

    }

    fn get_containter_put_count(&self, cont_name: &str) -> PyResult<i64> {
        let client = Client::with_uri_str(&self.db_string).unwrap();
        let db = client.database(&self.db_name);
        let coll = db.collection::<Document>(&self.db_coll_name);

        let mut count:i64 = 0;

        let filter = doc! {"component_name": cont_name, "action": "put"};

        if let Ok(cursor) = coll.find(filter, None) {
            for result in cursor {
                if let Ok(_) = result {
                    count += 1;
                }
            }
        }

        Ok(count)

    }

    fn get_containter_get_count(&self, cont_name: &str) -> PyResult<i64> {
        let client = Client::with_uri_str(&self.db_string).unwrap();
        let db = client.database(&self.db_name);
        let coll = db.collection::<Document>(&self.db_coll_name);

        let mut count:i64 = 0;

        let filter = doc! {"component_name": cont_name, "action": "get"};

        if let Ok(cursor) = coll.find(filter, None) {
            for result in cursor {
                if let Ok(_) = result {
                    count += 1;
                }
            }
        }

        Ok(count)

    }

    fn get_store_put_count(&self, store_name: &str) -> PyResult<i64> {
        let client = Client::with_uri_str(&self.db_string).unwrap();
        let db = client.database(&self.db_name);
        let coll = db.collection::<Document>(&self.db_coll_name);

        let mut count:i64 = 0;

        let filter = doc! {"component_name": store_name, "action": "put"};

        if let Ok(cursor) = coll.find(filter, None) {
            for result in cursor {
                if let Ok(_) = result {
                    count += 1;
                }
            }
        }

        Ok(count)

    }

    fn get_store_get_count(&self, store_name: &str) -> PyResult<i64> {
        let client = Client::with_uri_str(&self.db_string).unwrap();
        let db = client.database(&self.db_name);
        let coll = db.collection::<Document>(&self.db_coll_name);

        let mut count:i64 = 0;

        let filter = doc! {"component_name": store_name, "action": "get"};

        if let Ok(cursor) = coll.find(filter, None) {
            for result in cursor {
                if let Ok(_) = result {
                    count += 1;
                }
            }
        }

        Ok(count)

    }

    // this fn is used to create enter time chart for that we need each time and each time how much entity count (time, entity_count)
    fn resource_enter_time_chart(&self, res_name: &str) -> PyResult<String> {
        let client = Client::with_uri_str(&self.db_string).unwrap();
        let db = client.database(&self.db_name);
        let coll = db.collection::<Document>(&self.db_coll_name);

        let mut res: Vec<(f64, f64)> = Vec::new();

        let filter = doc! {"component_name": res_name, "action": "enter"};

        let opt = FindOptions::builder().sort(doc! {"time": 1}).build();

        if let Ok(cursor) = coll.find(filter, opt) {
            for result in cursor {
                if let Ok(document) = result {
                    if let Ok(time_float) = document.get_f64("time") {

                            // If the Vec is empty or the time is greater than the last time in the Vec,
                            // push a new tuple with the time and entity value
                            if res.is_empty() || time_float > res.last().unwrap().0 {
                                res.push((time_float, 1.0));
                            } else {
                                // Otherwise, add the entity value to the last tuple's entity count
                                res.last_mut().unwrap().1 += 1.0;
                            }
                    }
                }
            }
        }
        //println!("{:?}", res);
        Ok(json!(res).to_string())
    }

    fn resource_leave_time_chart(&self, res_name: &str) -> PyResult<String> {
        let client = Client::with_uri_str(&self.db_string).unwrap();
        let db = client.database(&self.db_name);
        let coll = db.collection::<Document>(&self.db_coll_name);

        let mut res: Vec<(f64, f64)> = Vec::new();

        let filter = doc! {"component_name": res_name, "action": "leave"};

        let opt = FindOptions::builder().sort(doc! {"time": 1}).build();

        if let Ok(cursor) = coll.find(filter, opt) {
            for result in cursor {
                if let Ok(document) = result {
                    if let Ok(time_float) = document.get_f64("time") {

                            // If the Vec is empty or the time is greater than the last time in the Vec,
                            // push a new tuple with the time and entity value
                            if res.is_empty() || time_float > res.last().unwrap().0 {
                                res.push((time_float, 1.0));
                            } else {
                                // Otherwise, add the entity value to the last tuple's entity count
                                res.last_mut().unwrap().1 += 1.0;
                            }
                    }
                }
            }
        }
        //println!("{:?}", res);
        Ok(json!(res).to_string())
    }

    fn resource_queued_time_chart(&self, res_name: &str) -> PyResult<Vec<(f64,f64)>> {
        let client = Client::with_uri_str(&self.db_string).unwrap();
        let db = client.database(&self.db_name);
        let coll = db.collection::<Document>(&self.db_coll_name);

        let mut res: Vec<(f64, f64)> = Vec::new();

        let filter = doc! {"component_name": res_name, "action": "queued"};

        let opt = FindOptions::builder().sort(doc! {"time": 1}).build();

        if let Ok(cursor) = coll.find(filter, opt) {
            for result in cursor {
                if let Ok(document) = result {
                    if let Ok(time_float) = document.get_f64("time") {
                         if let Ok(entity) = document.get_f64("info") {
                            if res.is_empty() || time_float != res.last().unwrap().0 {
                                res.push((time_float, entity));
                            } else{
                                res.last_mut().unwrap().1 = entity;
                            }

                        }
                    }
                }
            }
        }
        //println!("{:?}", res);
        Ok(res)
    }

    fn container_amount_time_chart(&self, cont_name: &str) -> PyResult<Vec<(f64,f64)>> {
        let client = Client::with_uri_str(&self.db_string).unwrap();
        let db = client.database(&self.db_name);
        let coll = db.collection::<Document>(&self.db_coll_name);

        let mut res: Vec<(f64, f64)> = Vec::new();

        let filter = doc! {"component_name": cont_name};

        let opt = FindOptions::builder().sort(doc! {"time": 1}).build();

        if let Ok(cursor) = coll.find(filter, opt) {
            for result in cursor {
                if let Ok(document) = result {
                    if let Ok(time_float) = document.get_f64("time") {
                         if let Ok(entity) = document.get_f64("info") {
                            if res.is_empty() || time_float != res.last().unwrap().0 {
                                res.push((time_float, entity));
                            } else{
                                res.last_mut().unwrap().1 = entity;
                            }

                        }
                    }
                }
            }
        }
        //println!("{:?}", res);
        Ok(res)
    }

    fn container_get_time_chart(&self, cont_name: &str) -> PyResult<Vec<(f64,f64)>> {
        let client = Client::with_uri_str(&self.db_string).unwrap();
        let db = client.database(&self.db_name);
        let coll = db.collection::<Document>(&self.db_coll_name);

        let mut res: Vec<(f64, f64)> = Vec::new();

        let filter = doc! {"component_name": cont_name, "action": "get"};

        let opt = FindOptions::builder().sort(doc! {"time": 1}).build();

        if let Ok(cursor) = coll.find(filter, opt) {
            for result in cursor {
                if let Ok(document) = result {
                    if let Ok(time_float) = document.get_f64("time") {
                         if let Ok(entity) = document.get_f64("info") {
                            if res.is_empty() || time_float != res.last().unwrap().0 {
                                res.push((time_float, entity));
                            } else{
                                res.last_mut().unwrap().1 = entity;
                            }

                        }
                    }
                }
            }
        }
        //println!("{:?}", res);
        Ok(res)
    }

    fn store_amount_time_chart(&self, store_name: &str) -> PyResult<Vec<(f64,f64)>> {
        let client = Client::with_uri_str(&self.db_string).unwrap();
        let db = client.database(&self.db_name);
        let coll = db.collection::<Document>(&self.db_coll_name);

        let mut res: Vec<(f64, f64)> = Vec::new();

        let filter = doc! {"component_name": store_name};

        let opt = FindOptions::builder().sort(doc! {"time": 1}).build();

        if let Ok(cursor) = coll.find(filter, opt) {
            for result in cursor {
                if let Ok(document) = result {
                    if let Ok(time_float) = document.get_f64("time") {
                         if let Ok(entity) = document.get_f64("info") {
                            if res.is_empty() || time_float != res.last().unwrap().0 {
                                res.push((time_float, entity));
                            } else{
                                res.last_mut().unwrap().1 = entity;
                            }

                        }
                    }
                }
            }
        }
        //println!("{:?}", res);
        Ok(res)
    }

    fn store_get_time_chart(&self, store_name: &str) -> PyResult<String> {
        let client = Client::with_uri_str(&self.db_string).unwrap();
        let db = client.database(&self.db_name);
        let coll = db.collection::<Document>(&self.db_coll_name);

        let mut res: Vec<(f64, f64)> = Vec::new();

        let filter = doc! {"component_name": store_name, "action": "get"};

        let opt = FindOptions::builder().sort(doc! {"time": 1}).build();

        if let Ok(cursor) = coll.find(filter, opt) {
            for result in cursor {
                if let Ok(document) = result {
                    if let Ok(time_float) = document.get_f64("time") {
                         if let Ok(entity) = document.get_f64("info") {
                            if res.is_empty() || time_float != res.last().unwrap().0 {
                                res.push((time_float, entity));
                            } else{
                                res.last_mut().unwrap().1 = entity;
                            }

                        }
                    }
                }
            }
        }
        //println!("{:?}", res);
        Ok(json!(res).to_string())
    }

    fn get_time_entity(&self, entity_name: &str) -> PyResult<Vec<(f64, String, String)>> {
        let client = Client::with_uri_str(&self.db_string).unwrap();
        let db = client.database(&self.db_name);
        let coll = db.collection::<Document>(&self.db_coll_name);

        let mut res: Vec<(f64, String, String)> = Vec::new();

        let filter = doc! {"entity": entity_name};

        let opt = FindOptions::builder().sort(doc! {"time": 1}).build();

        if let Ok(cursor) = coll.find(filter, opt) {
            for result in cursor {
                if let Ok(document) = result {
                    if let Ok(time_float) = document.get_f64("time") {
                        res.push((time_float, document.get_str("component_name").unwrap().to_string() , document.get_str("action").unwrap().to_string()));
                    }
                }
            }
        }

        Ok(res)

    }

    fn get_time_comp_info(&self, comp_name: &str, action: &str) -> PyResult<Vec<(f64, f64)>> {
        let client = Client::with_uri_str(&self.db_string).unwrap();
        let db = client.database(&self.db_name);
        let coll = db.collection::<Document>(&self.db_coll_name);

        let mut res: Vec<(f64, f64)> = Vec::new();

        let filter: Document;

        if action == "full" {
            filter = doc! {"component_name": comp_name};
        } else {
            filter = doc! {"component_name": comp_name, "action": action};
        }

        //let filter = doc! {"component_name": comp_name, "action": action};

        let opt = FindOptions::builder().sort(doc! {"time": 1}).build();

        if let Ok(cursor) = coll.find(filter, opt) {
            for result in cursor {
                if let Ok(document) = result {
                    if let Ok(time_float) = document.get_f64("time") {
                        if let Ok(info) = document.get_f64("info") {
                            res.push((time_float, info));
                        }
                    }
                }
            }
        }

        Ok(res)

    }

    fn get_full_setdata(
        &self,
        time: Option<f64>,
        comp_cat: Option<&str>,
        comp_name: Option<&str>,
        action: Option<&str>,
        entity: Option<&str>,
        info: Option<f64>,
    ) -> PyResult<Vec<(f64, String, String, String, Option<String>, Option<f64>)>>{
        let client = Client::with_uri_str(&self.db_string).unwrap();
        let db = client.database(&self.db_name);
        let coll = db.collection::<Document>(&self.db_coll_name);
        let mut res = Vec::new();

        let mut filter = doc! {};

        if let Some(e) = entity {
            filter.insert("entity", e);
        }
        if let Some(t) = time {
            filter.insert("time", t);
        }
        if let Some(b) = comp_name {
            filter.insert("component_name", b);
        }
        if let Some(c) = comp_cat {
            filter.insert("component_category", c);
        }
        if let Some(a) = action {
            filter.insert("action", a);
        }
        if let Some(i) = info {
            filter.insert("info", i);
        }


        let opt = FindOptions::builder().sort(doc! {"time": 1}).build();


        if let Ok(cursor) = coll.find(filter, opt) {
            for result in cursor {
                if let Ok(document) = result {
                        if let Ok(time_float) = document.get_f64("time") {
                            
                                if let Ok(info) = document.get_f64("info") {
                                    res.push((
                                        time_float,
                                        document.get_str("component_category").unwrap().to_string(),
                                        document.get_str("component_name").unwrap().to_string(),
                                        document.get_str("action").unwrap().to_string(),
                                        Some(document.get_str("entity").unwrap_or_default().to_string()),
                                        Some(info)
                                ));
                                    
                                }
                            
                        }
                } else {
                    println!("Error: document is not found");
                }
            }
        }else {
            println!("cursor is not found");
        }
        Ok(res)
    }
}

// fn vec_sum(v1: Vec<f64, String>, v2: Vec<f64, String>) -> Vec<(f64, String)> {
//     if v1.len() != v2.len() {
//         panic!("The length of two vectors must be the same");
//             } else {
//         let mut res = Vec::new();
//         for i in 0..v1.len() {
//             res.push((v1[i].0 + v2[i].0, v1[i].1));
//         }
//         res

//     }
// }

// fn vec_sub(v1: Vec<f64, String>, v2: Vec<f64, String>) -> Vec<(f64, String)> {
//     if v1.len() != v2.len() {
//         panic!("The length of two vectors must be the same");
//             } else {
//         let mut res = Vec::new();
//         for i in 0..v1.len() {
//             res.push((v1[i].0 - v2[i].0, v1[i].1));
//         }
//         res

//     }

// }
