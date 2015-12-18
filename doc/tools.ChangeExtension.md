# tools.ChangeExtension


An extension is the string after the last occurence of a dot (`.`) in
a `path`.   This tool replaces  extensions with other one.   It never
fails: the `reject` function will never be called.

@param {object}  extensions -  Each attribute  name is  replaced with
it's  value. For  instance `{js:  'head'}` means  than the  extension
`.js`  must  be  replaced  with `.head`.  Other  files  names  remain
unchanged.
