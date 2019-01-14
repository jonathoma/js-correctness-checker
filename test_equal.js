var compare = require('dom-compare').compare,
    reporter = require('dom-compare').GroupingReporter,
    expected = ..., // expected DOM tree
    actual = ..., // actual one
    result, diff, groupedDiff;
 
// compare to DOM trees, get a result object
result = compare(expected, actual);
 
// get comparison result
console.log(result.getResult()); // false cause' trees are different
 
// get all differences
diff = result.getDifferences(); // array of diff-objects
 
// differences, grouped by node XPath
groupedDiff = reporter.getDifferences(result); // object, key - node XPATH, value - array of differences (strings)
 
// string representation
console.log(reporter.report(result));

