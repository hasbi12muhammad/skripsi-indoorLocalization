var inspect = require('inspect-stream');
 
var arrayify = require('arrayify-merge.s');
var slice    = require('slice-flow.s');
 
var scikit = require('scikit-learn');
 
var features = scikit.dataset('load_digits.data'); //stream of features
var labels   = scikit.dataset('load_digits.target'); //stream of labels
 
// arrayify is transform stream that turns two input streams
// into one stream by wraping packets of inputs in array.
// So trainingSet outputs arrays [<feature>, <label>]
var trainingSet = arrayify();
features.pipe(trainingSet);
labels.pipe(trainingSet);
 
var clf = scikit.svm('SVC', {
  gamma: 0.001,
  C:     100
});
 
trainingSet
  .pipe(slice([0, -1])) //passes all packets except last one
  .pipe(clf)
  .on('error', function (err) {
    console.log(err);
  })
  .on('end', function () {
    // now we have trained model
 
    var predict = clf.predict();
    var features = scikit.dataset('load_digits.data');
    features.pipe(slice(-1)) //passes only last packet
      .pipe(predict)
      .pipe(inspect());
  });