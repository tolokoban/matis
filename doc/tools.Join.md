# tools.Join


Join all elements of an array with a `glue`.

## Options
You can set a optional string to serve as a glue between array's elements.

## Inputs
* __array__ {array[string]}: array of strings whom elements you want to join.

## Outputs
* __text__ {string}: joined elements separated with `glue` or en empty string if `glue` is undefined.

## Example
```js
it('should join with a glue.', function(done) {
    var tool = Matis.tools.Join(",");
    tool.exec(
        {array: ['a', 'b', 'c']},
        function(outputs) {
            expect(outputs.text).toBe("a,b,c");
            done();
        }
    );
});
```

