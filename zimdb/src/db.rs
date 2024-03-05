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
pub struct DB {
    name: String,
    conn: String,
    modifid: bool,
    save_time: u64,
    database: Box<SimOutData>,
    component_info: ComponentInfo,
    code_table: CodeTable,
}

#[derive(Debug)]
pub struct CodeTable {
    component_category: HashMap<u8, String>,
    component_name: HashMap<u64, String>,
    action: HashMap<u32, String>,
}

#[derive(Debug)]
pub struct ComponentInfo {
    workflow: HashMap<String, Comp>,
}

#[derive(Debug)]
pub struct Comp {
    resources: HashMap<String, IResource>,
    containers: HashMap<String, IContainer>,
    store: HashMap<String, IStore>,
    custom: HashMap<String, ICustom>,
}

#[derive(Debug)]
pub struct IResource {
    name: String,
    quantity: Bignum,
    metadata: HashMap<String, String>,
}

#[derive(Debug)]
pub struct IContainer {
    name: String,
    quantity: Bignum,
    metadata: HashMap<String, String>,
}

#[derive(Debug)]
pub struct IStore {
    name: String,
    quantity: Bignum,
    metadata: HashMap<String, String>,
}

#[derive(Debug)]
pub struct ICustom {
    name: String,
    quantity: Bignum,
    metadata: HashMap<String, String>,
}

#[derive(Debug)]
pub struct SimOutData {
    time: Vec<Bignum>,
    component_category: Vec<u8>,
    component_name: Vec<u64>,
    action: Vec<u32>,
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
            code_table: CodeTable::new(),
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
        component_category: u8,
        component_name: u64,
        action: u32,
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
            self.database.component_name.push(component_name);
            self.database.action.push(action);
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

    pub fn add_code_cc(&mut self, code: u8, name: &str) -> DBResult<()> {
        if self.code_table.component_category.contains_key(&code) {
            return Err(DBERRO::AlreadyExists);
        }
        self.code_table
            .component_category
            .insert(code, name.to_string());
        Ok(())
    }

    pub fn add_code_cn(&mut self, code: u64, name: &str) -> DBResult<()> {
        if self.code_table.component_name.contains_key(&code) {
            return Err(DBERRO::AlreadyExists);
        }
        self.code_table
            .component_name
            .insert(code, name.to_string());
        Ok(())
    }

    pub fn add_code_act(&mut self, code: u32, name: &str) -> DBResult<()> {
        if self.code_table.action.contains_key(&code) {
            return Err(DBERRO::AlreadyExists);
        }
        self.code_table.action.insert(code, name.to_string());
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
}

impl CodeTable {
    pub fn new() -> CodeTable {
        CodeTable {
            component_category: HashMap::new(),
            component_name: HashMap::new(),
            action: HashMap::new(),
        }
    }
}

pub fn connect_db() -> DBResult<()> {
    Ok(())
}
