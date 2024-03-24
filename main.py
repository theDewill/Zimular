import optuna
import pyttsx3
import pandas as pd
import matplotlib.pyplot as plt
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout,Input
from tensorflow.keras.optimizers import Adam
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from keras.losses import mean_squared_error
from tensorflow.keras.models import load_model

def text_speech(text: str)->None:
    engine = pyttsx3.init()
    engine.say(text)
    engine.runAndWait()

#importing the data set 
data_url = "./machine_components_data.csv"
data_set = pd.read_csv(data_url)

data = pd.read_csv("./machine_components_data.csv")

text_speech("Loading and reading the data set....")

#prepairing the input and the output
columns_to_drop_output = ['Capacity', 'Failure_Rate', 'Setup_Time', 'Quality_Parameter']
expected_output = data.drop(columns_to_drop_output, axis=1)

columns_to_drop_input = ['Processing_Time', 'Maintenance_Interval', 'Maintenance_Duration', 
                          'Failure_Rate', 'Energy_Consumption', 'Availability']
expected_input = data.drop(columns_to_drop_input, axis=1)

scaler = StandardScaler()
expected_input_scaled = scaler.fit_transform(expected_input)

train_input, test_input, train_output, test_output = train_test_split(expected_input_scaled, expected_output,
                                                                      test_size=.2, random_state=42)
#creating the ANN model 
text_speech("Start creating and fine tuning the neural networks for best model architecture....")
def objective(trial):
    num_layers = trial.suggest_int('num_layers', 1, 10)
    num_nodes = trial.suggest_int('num_nodes', 16, 128)
    dropout_rate = trial.suggest_uniform('dropout_rate', 0.0, 1.0)
    learning_rate = trial.suggest_loguniform('learning_rate', 1e-6, 1e-1)

    model = Sequential()
    model.add(Input(shape=(len(expected_input.columns),)))
    for _ in range(num_layers):
        model.add(Dense(num_nodes, activation='relu'))
        model.add(Dropout(dropout_rate))
    model.add(Dense(len(expected_output.columns), activation='sigmoid')) 

    model.compile(optimizer=Adam(learning_rate),
                  loss='mean_squared_error',  
                  metrics=['mean_absolute_error'])  
    model.fit(train_input, train_output, epochs=5, validation_split=0.2, verbose=0)
    val_loss, val_mae = model.evaluate(test_input, test_output, verbose=0)
    return val_mae 

#finetuning 
study = optuna.create_study(direction='maximize')
study.optimize(objective, n_trials = 25)

best_params = study.best_params
print("Best hyper-parameters : ", best_params)

best_model = Sequential()
best_model.add(Input(shape=(len(expected_input.columns),)))
for _ in range(best_params['num_layers']):
    best_model.add(Dense(best_params['num_nodes'], activation='relu'))
    best_model.add(Dropout(best_params['dropout_rate']))
best_model.add(Dense(len(expected_output.columns), activation='sigmoid'))

text_speech("Compiling the models...")
best_model.compile(optimizer ='adam', loss='mean_squared_error', metrics=['mean_absolute_error'])


text_speech("Start traning...")
best_model.fit(train_input, train_output, epochs=100, validation_split=0.2)
best_model.summary()
text_speech("Evaluating the model ....")
test_loss, test_acc = best_model.evaluate(test_input, test_output)
text_speech("Saving the trained model...")
#best_model.save('best_model.h5')

print("Test accuracy:", test_acc)
text_speech("Test accuracy will be" + str(test_acc))
text_speech("Ready for the Predictions....")
print(best_model.predict(test_input))

#loaded_model = load_model('best_model.h5')

# predictions = loaded_model.predict()

# print(predictions)