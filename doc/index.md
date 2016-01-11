_Fast complex asynchronous processes made easy_


# Concepts

* __[Input driven execution](input-driven-exec.html)__: processing starts as soon as input is ready.
* __Parallelism__: tools are executed in parallel if it gives a time benefit. The result is a very fast process.
* __Inputs order preserved__: even if a tool processes 3 inputs at the same time, outputs are post to the next tool in the same order.
* __[Tracability](tracability.html)__: you always know which input has been needed to produce any output.

# Built-in tools

* [__BaseName__](tools.BaseName.html): basename of a path.
* [__BlackHole__](tools.BlackHole.html): swallow garbaged outputs.
* [__ChangeExtension__](tools.ChangeExtension.html): change extension of a filename.
* [__ConcatStrings__](tools.ConcatStrings.html): concat many strings.
* [__ConsoleLog__](tools.ConsoleLog.html): log messages for debug.
* [__Constant__](tools.Constant.html): outputs a constant.
* [__DirName__](tools.DirName.html): dirname of a path.
* [__ExistsFile__](tools.ExistsFile.html): test file existence.
* [__ForEach__](tools.ForEach.html): loop on each element of an array.
* [__Join__](tools.Join.html): join elements of an array.
* [__LoadStream__](tools.LoadStream.html): load file as a stream.
* [__LoadText__](tools.LoadText.html): load file as a string.
* [__MatchRegexp__](tools.MatchRegexp.html): match a string against a regular expression.
* [__Nop__](tools.Nop.html): No operation.
* [__PrefixSuffix__](tools.PrefixSuffix.html): surround a string with two constants.
* [__ReadDir__](tools.ReadDir.html): list all files and subdirectories in a directory.
* [__SaveText__](tools.SaveText.html): store string into a file.
* [__ShellExec__](tools.ShellExec.html): execute a shell command.
