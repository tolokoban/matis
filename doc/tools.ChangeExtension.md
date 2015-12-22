# tools.ChangeExtension

**************************************
__ChangeExtension(options)__

An extension is the string after the last occurence of a dot (`.`) in a `path`.   This tool replaces  extensions with other one.

## Options
Object describing which changes have to be made.
For  instance `{less:  'css'}`  means that  the  tool must  replace extensions `.less` with `.css`.

## Input
* __path__: The path of which we want to change the extension.

## Output
* __path__: The  path with the  new extension. If the  extension is not part of the _options_, the output is the same as the input.

## Example
```js
var change = Matis.tools.ChangeExtension({less: 'css', md: 'html'});
```
****************************************