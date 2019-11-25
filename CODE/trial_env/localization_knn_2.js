const KNN = require('ml-knn')
const csv = require('csvtojson/v1')
const csv2 = require('csvtojson/v1')

let knn
let csv_data_training = 'D:/DATA KULIAH/SEMESTER VIII/SKRIPSI!!!/trial_env/rssi.csv'
let csv_data_set = 'D:/DATA KULIAH/SEMESTER VIII/SKRIPSI!!!/trial_env/rssi_data_set.csv'
const names = ['ruang', 'time', 'beacon1', 'beacon2']
const names2 = ['ruang', 'time', 'beacon1', 'beacon2']

let data = [], data_set = [];
//let data_training_length
let training_set_feature = [], training_set_class = [],
    test_set_feature = [], test_set_class = [];

function start() {
    csv({ noheader: true, headers: names })
        .fromFile(csv_data_training)
        .on('json', (jsonObj) => {
            data.push(jsonObj); // Push each object to data Array
        })
        .on('done', (error) => {
            data.forEach(obj => delete obj.time);
            data = shuffle_array(data);
        });
}

function start2(){
    csv2({ noheader: true, headers: names2 })
        .fromFile(csv_data_set)
        .on('json', (jsonObj) => {
            data_set.push(jsonObj); // Push each object to data Array
        })
        .on('done', (error) => {
            data_set.forEach(obj => delete obj.time);
            data_set = shuffle_array(data_set);
            train()
        });
}
function train() {
    var dress_test_data = dress_data(data_set)
    test_set_feature = dress_test_data[0]
    test_set_class = dress_test_data[1]
    var dress_train_data = dress_data(data)
    training_set_feature = dress_train_data[0]
    training_set_class = dress_train_data[1]
    
    knn = new KNN(training_set_feature, training_set_class, {k : 5})
    test()
}

function shuffle_array(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function dress_data(data) {

    let types = new Set(); // To gather UNIQUE classes
    let data_feature = [], data_class = []
    data.forEach((row) => {
        types.add(row.ruang);
    });

    typesArray = [...types]; // To save the different types of classes.

    data.forEach((row) => {
        let rowArray, typeNumber;

        rowArray = Object.keys(row).map(key => parseFloat(row[key])).slice(1);

        typeNumber = typesArray.indexOf(row.ruang); // Convert type(String) to type(Number)

        data_feature.push(rowArray)
        data_class.push(typeNumber)

    });
    return [data_feature, data_class]
}

function test() {
    const predict = knn.predict(test_set_feature)
    // console.log(predict)
    // console.log(test_set_class)
    const test_set_length = test_set_class.length
    console.log('Test set size = ', test_set_length)
    percentage_classification(predict, test_set_class)
}

function percentage_classification(predict, expect) {
    let misclassifications = 0;
    let correctClassification = 0;
    for (var index = 0; index < predict.length; index++) {
        if (predict[index] !== expect[index]) {
            misclassifications++;
        } else {
            correctClassification++;
        }
    }
    percentage_misclassification = misclassifications / expect.length * 100;
    percentage_correctClassification = correctClassification / expect.length * 100;
    console.log("Perkiraan benar = ", percentage_correctClassification, "%")
    console.log("Perkiraan salah = ", percentage_misclassification, "%")
}

//start()
for (var i = 0; i < 2; i++){
    if (i==0){
        start()
    }else{
        start2()
    }
}