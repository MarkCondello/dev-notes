# VIM Commands

`<NUMBER_OF_LINES>k`
Go up to the number of lines

`<NUMBER_OF_LINES>j`
Go down to the number of lines

`y<NUMBER_OF_LINES>j`
Yank the number of lines down

`y<NUMBER_OF_LINES>k`
Yank the number of lines up

`d<NUMBER_OF_LINES>k`
Delete the number of lines down

`Shift g` = go to the bottom
`gg` = go to the top

`$` = go to the end of the line
`0` = go to the start of the line

File Explorer
`vim .` Opens a file explorer

Replace current buffer with the explore view. Useful when viewing a file.
`:Explore`

Open up a file in a another tab vertically
`:Vex

Split explore to the bottom horizontally
`:Sex`

Press control w to get to window mode and use L or H to switch to another vertical tab, J and K for top or bottom.

`Control + w` then `o` closes other tabs.

## Marks
A marker can be added in standard mode using `m` followed by the character you want to use as the marker ie `mA`
Then when you want to navigate back to that marker simply type ‘A or single quote  and whatever character chosen for the marker.

## Adding plugins
After running the install for Linux follow these [instructions](https://github.com/junegunn/vim-plug?tab=readme-ov-file#vim-script-example) and [here](https://frontendmasters.com/courses/vim-fundamentals/plugins/).

`:GFiles`
Opens a fuzzy finder for git committed files.

##Search and replace
We can select a visual range in visual mode and do a search a replace:
`:s/<TERM_TO_FIND>/<TERM_TO_REPLACE>`

This will replace the first instance.
We can add modifiers like /g for global and /c for confirm
`:s/<TERM_TO_FIND>/<TERM_TO_REPLACE>/gc`

## Macros
Macros can be created by pressing `q` followed by a character to run than macro. The recording will begin once that character is set.
Pressing `q` again will stop the recording.
To run the macro, use the `@` followed by the character used to run the macro.
You can also specify the amount of times to run the macro using a number before `@`. For example:
`10@a`

Here is a scenario where we want to replace an if statement into a case statement:
```
 if (someValue == "someOtherValue1") {
      return 1
  } else if (someValue == "someOtherValue2") {
      return 2
  } else if (someValue == "someOtherValue3") {
      return 3
```

Enter macro mode with `q` and save the macro as ‘a’:
qa. Go to the start of the first if statement and delete up to the first doubles quotes:
`0 dt”`
Find the next quote and delete the rest:
`f” d$`
Go to insert mode and add a semicolon:
`i :`
Press escape to exit insert mode and go to the start and go to insert mode and add the txt case:
`0 i case`
Then go two lines down for the next conditional statement:
`jj`

## Registers
[A register is as simple as a key value store a single character to a string. Some registers are dynamically filled for you, such as the yanking register along with your delete history register, the implicit registers automatically filled for you. Your alternate file, your current file is automatically filled for you.](https://frontendmasters.com/courses/vim-fundamentals/registers/)

If we stuff up a macro, we can find it in the register:
`:reg`
The above macro will be displayed similar to this:
`0dt"<80><fd>af"<80><fd>ad$i<80>kr<80>kb" :^[<80><fd>a0icase ^[kjjj`

We can yank into a register by adding `"<SOME_CHARACTER />` and then `yy`

Helpful details on how to use a register can be found [here](https://stackoverflow.com/questions/1497958/how-do-i-use-vim-registers).