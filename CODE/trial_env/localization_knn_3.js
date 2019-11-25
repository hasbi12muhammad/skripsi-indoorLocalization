const KNN = require('ml-knn');
const csv = require('csvtojson/v1');
const csv2 = require('csvtojson/v1')

function start(){
    let knn;
    let separateData;
    const csv_data_training = 'D:/DATA KULIAH/SEMESTER VIII/SKRIPSI!!!/trial_env/rssi.csv'
    const csv_data_set = 'D:/DATA KULIAH/SEMESTER VIII/SKRIPSI!!!/trial_env/rssi_data_set.csv'
    const names = ['ruang', 'time', 'beacon1', 'beacon2']
    const names2 = ['ruang', 'time', 'beacon1', 'beacon2']
    
    var data = [], data_set = [], feature = [], the_class = [];
    var data_training_length
    var training_set_feature = [], training_set_class = [],
        test_set_feature = [], test_set_class = [];
    
    csv({ noheader: true, headers: names })
        .fromFile(csv_data_training)
        .on('json', (jsonObj) => {
            data.push(jsonObj); // Push each object to data Array
        })
        .on('done', (error) => {
            data.forEach(obj => delete obj.time);
            data = shuffle_array(data);
            data_training_length = data.length
    
            csv2({ noheader: true, headers: names2 })
            .fromFile(csv_data_set)
            .on('json', (jsonObj) => {
                data_set.push(jsonObj); // Push each object to data Array
            })
            .on('done', (error) => {
                data_set.forEach(obj => delete obj.time);
                data_set = shuffle_array(data_set);
                Array.prototype.push.apply(data, data_set);
                dressData();
            });
        });
    
    function shuffle_array(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }
    
    function dressData() {
    
        let types = new Set(); // To gather UNIQUE classes
    
        data.forEach((row) => {
            types.add(row.ruang);
        });
    
        typesArray = [...types]; // To save the different types of classes.
    
        data.forEach((row) => {
            let rowArray, typeNumber;
    
            rowArray = Object.keys(row).map(key => parseFloat(row[key])).slice(1);
    
            typeNumber = typesArray.indexOf(row.ruang); // Convert type(String) to type(Number)
    
            feature.push(rowArray);
            the_class.push(typeNumber);
        });
    
        training_set_feature = feature.slice(0,(data_training_length+1));
        training_set_class = the_class.slice(0,(data_training_length+1));
        test_set_feature = feature.slice(data_training_length);
        test_set_class = the_class.slice(data_training_length);
        
        train();
    }
    
    function train() {
        knn = new KNN(training_set_feature, training_set_class, { k: 3 });
        test();
    }
    
    function test() {
        const result = knn.predict(test_set_feature);
        const testSetLength = test_set_feature.length;
        percentage(result, test_set_class);
        console.log(`Test Set Size = ${testSetLength}`);
        //predict();
    }
    
    function percentage(predicted, expected) {
        let misclassifications = 0;
        let correctClassification = 0;
        for (var index = 0; index < predicted.length; index++) {
            if (predicted[index] !== expected[index]) {
                misclassifications++;
            } else {
                correctClassification++;
            }
        }
        percentage_misclassification = misclassifications / expected.length * 100;
        percentage_correctClassification = correctClassification / expected.length * 100;
        console.log("Perkiraan benar = ", percentage_correctClassification, "%")
        console.log("Perkiraan salah = ", percentage_misclassification, "%")
    }
}

for(i=0; i < 10; i++ ){
    start()
}