# tools.SaveText


Save text or stream to a file, given a `path`.

## Options
As a string, this is the encoding. Otherwise, it has the same meaning as the argument in the [`fs.readFile(filename[, options], callback)`](https://nodejs.org/dist/latest-v4.x/docs/api/fs.html#fs_fs_readfile_filename_options_callback) function of NodeJS.

You can specify the `path` attribute to it. In this case, the corresponding input is not definined.

## Inputs
* __path__ {string}: path of the file to write. This input is not defined if `options.path`is defined.
* __text__ {string}: text to store in this file.

## Outputs
* __path__ {string}: text stored in this file.

 