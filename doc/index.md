_Fast complex asynchronous processes made easy_


# Concepts

* __[Input driven execution](input-driven-exec.html)__: processing starts as soon as input is ready.
* __Parallelism__: tools are executed in parallel if it gives a time benefit. The result is a very fast process.
* __Inputs order preserved__: even if a tool processes 3 inputs at the same time, outputs are post to the next tool in the same order.
* __Tracability__: you always know which input has been needed to produce any output.

# Built-in tools

* [__`BaseName`__](tools.BaseName.html): basename of a path.
* [__`BlackHole`__](tools.BlackHole.html): swallow garbaged outputs.
* [__`ChangeExtension`__](tools.ChangeExtension.html): change extension of a filename.
* [__`ConcatStrings`__](tools.ConcatStrings.html): concat many strings.
* [__`ConsoleLog`__](tools.ConsoleLog.html): log messages for debug.
* [__`Constant`__](tools.Constant.html): outputs a constant.
* [__`DirName`__](tools.DirName.html): dirname of a path.
* [__`ExistsFile`__](tools.ExistsFile.html): test file existence.
* [__`ForEach`__](tools.ForEach.html): loop on each element of an array.
* [__`Join`__](tools.Join.html): join elements of an array.
* [__`LoadStream`__](tools.LoadStream.html): load file as a stream.
* [__`LoadText`__](tools.LoadText.html): load file as a string.
* [__`MatchRegexp`__](tools.MatchRegexp.html): match a string against a regular expression.
* [__`Nop`__](tools.Nop.html): No operation.
* [__`PrefixSuffix`__](tools.PrefixSuffix.html): surround a string with two constants.
* [__`ReadDir`__](tools.ReadDir.html): list all files and subdirectories in a directory.
* [__`SaveText`__](tools.SaveText.html): store string into a file.
* [__`ShellExec`__](tools.ShellExec.html): execute a shell command.
