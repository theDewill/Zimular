use std::collections::HashMap;

type DBResult<T> = std::result::Result<T, DBERRO>;

#[derive(Debug)]
pub enum DBERRO {
    NotFound,
    AlreadyExists,
    InvalidData,
    ConnectionError,
    UnknownError,
}

#[derive(Debug)]
pub enum Bignum {
    Int(i64),
    Float(f64),
}

#[derive(Debug)]
pub enum CatComp {
    Resource,
    PriorityResource,
    PreemptiveResource,
    Store,
    FilterStore,
    PriorityStore,
    Container,
    Custom,
}

#[derive(Debug)]
pub struct DB {
    name: String,
    conn: String,
    modifid: bool,
    save_time: u64,
    database: Box<SimOutData>,
    component_info: ComponentInfo,
}

#[derive(Debug)]
pub struct ComponentInfo {
    workflow: HashMap<String, Comp>,
}

#[derive(Debug)]
pub struct Comp {
    resources: HashMap<String, CompInfo>,
    containers: HashMap<String, CompInfo>,
    store: HashMap<String, CompInfo>,
    custom: HashMap<String, CompInfo>,
}

#[derive(Debug)]
pub struct CompInfo {
    name: String,
    catagory: String,
    notification: HashMap<String, String>,
    data: HashMap<String, String>,
}

#[derive(Debug)]
pub struct SimOutData {
    time: Vec<Bignum>,
    component_category: Vec<CatComp>,
    component_name: Vec<String>,
    action: Vec<String>,
    entity: Vec<String>,
    metadata: Vec<Vec<(String, String)>>,
}

impl DB {
    pub fn new(name: &str, conn: &str) -> DBResult<DB> {
        Ok(DB {
            name: name.to_string(),
            conn: conn.to_string(),
            modifid: false,
            save_time: 0,
            database: Box::new(SimOutData {
                time: Vec::new(),
                component_category: Vec::new(),
                component_name: Vec::new(),
                action: Vec::new(),
                entity: Vec::new(),
                metadata: Vec::new(),
            }),
            component_info: ComponentInfo {
                workflow: HashMap::new(),
            },
        })
    }

    pub fn new_with_capacity(name: &str, conn: &str, capacity: usize) -> DBResult<DB> {
        Ok(DB {
            name: name.to_string(),
            conn: conn.to_string(),
            modifid: false,
            save_time: 0,
            database: Box::new(SimOutData {
                time: Vec::with_capacity(capacity),
                component_category: Vec::with_capacity(capacity),
                component_name: Vec::with_capacity(capacity),
                action: Vec::with_capacity(capacity),
                entity: Vec::with_capacity(capacity),
                metadata: Vec::with_capacity(capacity),
            }),
            component_info: ComponentInfo {
                workflow: HashMap::new(),
            },
        })
    }

    pub fn get_mut_database(&mut self) -> DBResult<&mut SimOutData> {
        Ok(&mut self.database)
    }

    pub fn get_database(&self) -> DBResult<&SimOutData> {
        Ok(&self.database)
    }

    pub fn get_mut_component_info(&mut self) -> DBResult<&mut ComponentInfo> {
        Ok(&mut self.component_info)
    }

    pub fn get_component_info(&self) -> DBResult<&ComponentInfo> {
        Ok(&self.component_info)
    }

    pub fn add_data(
        &mut self,
        time: Bignum,
        component_category: CatComp,
        component_name: &str,
        action: &str,
        entity: &str,
        metadata: Vec<(String, String)>,
    ) -> DBResult<()> {
        if self.database.time.len() == self.database.component_category.len()
            && self.database.component_category.len() == self.database.component_name.len()
            && self.database.component_name.len() == self.database.action.len()
            && self.database.action.len() == self.database.entity.len()
        {
            self.database.time.push(time);
            self.database.component_category.push(component_category);
            self.database
                .component_name
                .push(component_name.to_string());
            self.database.action.push(action.to_string());
            self.database.entity.push(entity.to_string());
            self.database.metadata.push(metadata);
            Ok(())
        } else {
            return Err(DBERRO::UnknownError);
        }
    }

    pub fn add_workflow(&mut self, name: &str) -> DBResult<()> {
        self.component_info.workflow.insert(
            name.to_string(),
            Comp {
                resources: HashMap::new(),
                containers: HashMap::new(),
                store: HashMap::new(),
                custom: HashMap::new(),
            },
        );

        Ok(())
    }

    pub fn get_db_size(&self) {
        let time = std::mem::size_of_val(&self.database.time);
        let component_category = std::mem::size_of_val(&self.database.component_category);
        let component_name = std::mem::size_of_val(&self.database.component_name);
        let action = std::mem::size_of_val(&self.database.action);
        let entity = std::mem::size_of_val(&self.database.entity);
        let metadata = std::mem::size_of_val(&self.database.metadata);

        println!(
            "time: {}, component_category: {}, component_name: {}, action: {}, entity: {}, metadata: {}",
            time, component_category, component_name, action, entity, metadata
        );
    }

    pub fn dbtimelen(&self) -> usize {
        self.database.time.len()
    }

    pub fn get_db_database_field(&self, field: &str, index: usize) -> DBResult<String> {
        match field {
            "time" => Ok(format!("{:?}", self.database.time[index])),
            "component_category" => Ok(format!("{:?}", self.database.component_category[index])),
            "component_name" => Ok(format!("{:?}", self.database.component_name[index])),
            "action" => Ok(format!("{:?}", self.database.action[index])),
            "entity" => Ok(self.database.entity[index].to_string()),
            "metadata" => Ok(format!("{:?}", self.database.metadata[index])),
            _ => Err(DBERRO::NotFound),
        }
    }

    pub fn add_resource(&mut self, name: &str, workflow: &str, catagory: &str) -> DBResult<()> {
        let comp = self
            .component_info
            .workflow
            .get_mut(workflow)
            .ok_or(DBERRO::NotFound)?;
        comp.resources.insert(
            name.to_string(),
            CompInfo {
                name: name.to_string(),
                catagory: catagory.to_string(),
                notification: HashMap::with_capacity(0),
                data: HashMap::with_capacity(0),
            },
        );
        Ok(())
    }

    pub fn add_container(&mut self, name: &str, workflow: &str, catagory: &str) -> DBResult<()> {
        let comp = self
            .component_info
            .workflow
            .get_mut(workflow)
            .ok_or(DBERRO::NotFound)?;
        comp.containers.insert(
            name.to_string(),
            CompInfo {
                name: name.to_string(),
                catagory: catagory.to_string(),
                notification: HashMap::with_capacity(0),
                data: HashMap::with_capacity(0),
            },
        );
        Ok(())
    }

    pub fn add_store(&mut self, name: &str, workflow: &str, catagory: &str) -> DBResult<()> {
        let comp = self
            .component_info
            .workflow
            .get_mut(workflow)
            .ok_or(DBERRO::NotFound)?;
        comp.store.insert(
            name.to_string(),
            CompInfo {
                name: name.to_string(),
                catagory: catagory.to_string(),
                notification: HashMap::with_capacity(0),
                data: HashMap::with_capacity(0),
            },
        );
        Ok(())
    }

    pub fn add_custom(&mut self, name: &str, workflow: &str, catagory: &str) -> DBResult<()> {
        let comp = self
            .component_info
            .workflow
            .get_mut(workflow)
            .ok_or(DBERRO::NotFound)?;
        comp.custom.insert(
            name.to_string(),
            CompInfo {
                name: name.to_string(),
                catagory: catagory.to_string(),
                notification: HashMap::with_capacity(0),
                data: HashMap::with_capacity(0),
            },
        );
        Ok(())
    }
}

pub fn connect_db() -> DBResult<()> {
    Ok(())
}
