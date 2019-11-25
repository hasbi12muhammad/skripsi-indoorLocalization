const KNN = require('ml-knn');
const csv = require('csvtojson/v1');
const { euclidean, squaredEuclidean } = require('ml-distance-euclidean');
const crossVal = require('ml-cross-validation')

function start() {
    let knn;
    let separateData;
    const csvFilePath = 'D:/DATA KULIAH/SEMESTER VIII/SKRIPSI!!!/trial_env/rssi.csv';
    const names = ['ruang', 'time', 'beacon1', 'beacon2'];

    let data = [], x = [], y = [];

    let trainingsetX = [], trainingsetY = [], testsetX = [], testsetY = [];

    csv({ noheader: true, headers: names })
        .fromFile(csvFilePath)
        .on('json', (jsonObj) => {
            data.push(jsonObj); // Push each object to data Array
        })
        .on('done', (error) => {
            data.forEach(obj => delete obj.time);
            data = shuffleArray(data);
            separateData = 0.4 * data.length;
            dressData();
        });

    function shuffleArray(array) {
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

            x.push(rowArray);
            y.push(typeNumber);

        });

        trainingsetX = x.slice(separateData);
        trainingsetY = y.slice(separateData);
        testsetX = x.slice(0, separateData);
        testsetY = y.slice(0, separateData);

        train();
    }

    function train() {
        knn = new KNN(trainingsetX, trainingsetY, { k: 5 });
        test();
    }

    function test() {
        const result = knn.predict(testsetX);
        const testSetLength = testsetX.length;
        percentage(result, testsetY);
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

    // function predict() {
    //     let room1 = x.slice(0, 10)
    //     let room2 = x.slice(217)
    //     let result1, result2, ruang1, ruang2

    //     for (var i = 0; i < room1.length; i++) {

    //         result1 = knn.predict(room1[i])
    //         if (result1 == 0) {
    //             ruang1 = '1'
    //         } else {
    //             ruang1 = '2'
    //         }
    //         console.log('karakteristik jaringan = ', room1[i], ', ruang = ', ruang1, 'harusnya ruang 1')

    //     }
    //     console.log('=====================================')
    //     for (var i = 0; i < room2.length; i++) {

    //         result2 = knn.predict(room2[i])
    //         if (result2 == 0) {
    //             ruang2 = '1'
    //         } else {
    //             ruang2 = '2'
    //         }
    //         console.log('karakteristik jaringan = ', room2[i], ', ruang = ', ruang2, 'harusnya ruang 2')
    //     }
    // }
}

for (i = 0; i < 10; i++) {
    start()
}