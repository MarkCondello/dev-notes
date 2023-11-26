##########################
## Getting Help in Linux
##########################
 
# MAN Pages
man command     # => Ex: man ls
 
# The man page is displayed with the less command
# SHORTCUTS:
# h         => getting help
# q         => quit
# enter     => show next line
# space     => show next screen
# /string   => search forward for a string
# ?string   => search backwards for a string
# n / N     => next/previous appearance
 
# checking if a command is shell built-in or executable file
type rm        # => rm is /usr/bin/rm
type cd        # => cd is a shell builtin
 
# getting help for shell built-in commands
help command    # => Ex: help cd
command --help  # => Ex: rm --help
 
# searching for a command, feature or keyword in all man Pages
man -k uname
man -k "copy files"
apropos passwd

##########################
## Keyboard Shortcuts
##########################
TAB  # autocompletes the command or the filename if its unique
TAB TAB (press twice)   # displays all commands or filenames that start with those letters
 
# clearing the terminal
CTRL + L
 
# closing the shell (exit)
CTRL + D
 
# cutting (removing) the current line 
CTRL + U
 
# moving the cursor to the start of the line
CTRL + A
 
# moving the cursor to the end of the line
Ctrl + E
 
# stopping the current command
CTRL + C
 
# sleeping a the running program
CTRL + Z
 
# opening a terminal 
CTRL + ALT + T


##########################
## Linux Paths
##########################
 
.       # => the current working directory
..      # => the parent directory
~       # => the user's home directory
 
cd      # => changing the current directory to user's home directory
cd ~    # => changing the current directory to user's home directory
cd -    # => changing the current directory to the last directory
cd /path_to_dir    # => changing the current directory to path_to_dir 
pwd     # => printing the current working directory
 
# installing tree
sudo apt install tree
 
tree directory/     # => Ex: tree .
tree -d .           # => prints only directories
tree -f .           # => prints absolute paths


##########################
## Account Management
##########################
 
## IMPORTANT FILES
# /etc/passwd # => users and info: username:x:uid:gid:comment:home_directory:login_shell
# /etc/shadow # => users' passwords
# /etc/group # => groups
 
# (creating a user account)[https://www.youtube.com/watch?v=p8QOnty6rSU&list=PLT98CRl2KxKHKd_tH3ssq0HPrThx2hESW&index=2]
useradd [OPTIONS] username
# OPTIONS:
# -m => creates a home directory
# -d directory => specify another home directory
# -c "comment"
# -s shell
# -G => specify the secondary groups (must exist)
# -g => specify the primary group (must exist)
 
Simple Example:
```useradd -m username```

Complex Example:
```useradd -m -d /home/john -c "C++ Developer" -s /bin/bash -G sudo,adm,mail john```
 
# changing a user account
usermod [OPTIONS] username # => uses the same options as useradd
Example:
```usermod -aG developers,managers john # => adding the user to two secondary groups```
 
# deleting a user account
userdel -r username # => -r removes user's home directory as well
 
# creating a group
groupadd group_name
 
# deleting a group
groupdel group_name
 
# displaying all groups
cat /etc/groups
*OR*
cat /etc/group
 
# displaying the groups a user belongs to
groups
 
# creating admin users
# add the user to sudo group in Ubuntu and wheel group in CentOS
usermod -aG sudo john

*Group membership does not apply until you log out and log back in.*
 
## Monitoring Users ##
who -H # => displays logged in users
id # => displays the current user and its groups
whoami # => displays EUID
 
# listing who’s logged in and what’s their current process.
w
uptime
 
# printing information about the logins and logouts of the users
last
last -u username

## setting expirations for user account settings with `chage`
The -E sets an expiration date for an account
``chage -E 2023-11-27 expiring-account``

The -M sets an expiration for a password to an account. The number is the amount of days until the password expires.
Undoing this can be done by using a -1 value.
``chage -M 5 some-account``

Setting a minimum number of days between password changes.
``chage -m 7 some-account``

Lock a user account
``passwd -l account-to-lock``

Unlock a user account
``passwd -u account-to-lock``

##########################
## File Permissions
##########################
 
## LEGEND
u = User
g = Group
o = Others/World
a = all
 
r = Read
w = write
x = execute
- = no access

RWX = 4 + 2 + 1 = 7
File permissions are written in octal notation. Combinations of 4, 2 and 1.
File permissions are assigned by triplet values RWX-RWX-RWX. These are often represented in octal notation 777
After the first character, which indicates the file type, comes 9 characters which represent the file's permissions. Eg `-rw-r--r--`

These triplet combinations are associated for 3 groups: Owners Users and Others.
The first triplet shows the owner permissions, the second one the group permissions, and the last triplet shows everybody else’s permissions.

The permissions for each class are always represented in a precise order: read, write and execute.

More details about the various combinations can be found here: 
https://en.wikipedia.org/wiki/File-system_permissions#Symbolic_notation
 
# displaying the permissions (ls and stat)
ls -l /etc/passwd
    -rw-r--r-- 1 root root 2871 aug 22 14:43 /etc/passwd
 
stat /etc/shadow
    File: /etc/shadow
    Size: 1721      	Blocks: 8          IO Block: 4096   regular file
    Device: 805h/2053d	Inode: 524451      Links: 1
    Access: (0640/-rw-r-----)  Uid: (    0/    root)   Gid: (   42/  shadow)
    Access: 2020-08-24 11:31:49.506277118 +0300
    Modify: 2020-08-22 14:43:36.326651384 +0300
    Change: 2020-08-22 14:43:36.342652202 +0300
    Birth: -
 
# changing the permissions using the relative (symbolic) mode
chmod u+r filename
chmod u+r,g-wx,o-rwx filename
chmod ug+rwx,o-wx filename
chmod ugo+x filename
chmod a+r,a-wx filename
 
# changing the permissions using the absolute (octal) mode
PERMISSIONS      EXAMPLE
u   g   o
rwx rwx rwx     chmod 777 filename
rwx rwx r-x     chmod 775 filename
rwx r-x r-x     chmod 755 filename
rwx r-x ---     chmod 750 filename
rw- rw- r--     chmod 664 filename
rw- r-- r--     chmod 644 filename
rw- r-- ---     chmod 640 filename
 
# setting the permissions as of a reference file
chmod --reference=file1 file2
 
# changing permissions recursively
chmod -R u+rw,o-rwx filename
 
## SUID (Set User ID)
 
# displaying the SUID permission
ls -l /usr/bin/umount 
    -rwsr-xr-x 1 root root 39144 apr  2 18:29 /usr/bin/umount
 
stat /usr/bin/umount 
    File: /usr/bin/umount
    Size: 39144     	Blocks: 80         IO Block: 4096   regular file
    Device: 805h/2053d	Inode: 918756      Links: 1
    Access: (4755/-rwsr-xr-x)  Uid: (    0/    root)   Gid: (    0/    root)
    Access: 2020-08-22 14:35:46.763999798 +0300
    Modify: 2020-04-02 18:29:40.000000000 +0300
    Change: 2020-06-30 18:27:32.851134521 +0300
    Birth: -
 
# setting SUID
chmod u+s executable_file
chmod 4XXX executable_file      # => Ex: chmod 4755 script.sh
 
 
## SGID (Set Group ID)
 
# displaying the SGID permission
ls -ld projects/
    drwxr-s--- 2 student student 4096 aug 25 11:02 projects/
 
stat projects/
    File: projects/
    Size: 4096      	Blocks: 8          IO Block: 4096   directory
    Device: 805h/2053d	Inode: 266193      Links: 2
    Access: (2750/drwxr-s---)  Uid: ( 1001/ student)   Gid: ( 1002/ student)
    Access: 2020-08-25 11:02:15.013355559 +0300
    Modify: 2020-08-25 11:02:15.013355559 +0300
    Change: 2020-08-25 11:02:19.157290764 +0300
    Birth: -
 
# setting SGID
chmod 2750 projects/
chmod g+s projects/
 
## The Sticky Bit
 
# displaying the sticky bit permission
ls -ld /tmp/
    drwxrwxrwt 20 root root 4096 aug 25 10:49 /tmp/
 
stat /tmp/
    File: /tmp/
    Size: 4096      	Blocks: 8          IO Block: 4096   directory
    Device: 805h/2053d	Inode: 786434      Links: 20
    Access: (1777/drwxrwxrwt)  Uid: (    0/    root)   Gid: (    0/    root)
    Access: 2020-08-22 14:46:03.259455125 +0300
    Modify: 2020-08-25 10:49:53.756211470 +0300
    Change: 2020-08-25 10:49:53.756211470 +0300
    Birth: -
 
# setting the sticky bit
mkdir temp
chmod 1777 temp/
chmod o+t temp/
ls -ld temp/
    drwxrwxrwt 2 student student 4096 aug 25 11:04 temp/
 
 
## UMASK
# displaying the UMASK
umask 
 
# setting a new umask value
umask new_value     # => Ex: umask 0022
 
## Changing File Ownership (root only)

chmod u defines what permissions a user has for a file.
The permissions available are “rwx”. Read Write or Execute.

Options can be added with + eg:
chmod u +rwx

Options can be removed with a minus - eg:
chmod u -rwx

We can also modify the group with the user using “ug” eg:
chmod ug=rw FILENAME.ext

To recursively run an operation over files and folder using -R flag.

We can copy permissions from one file to another using the following command
chmod —reference FILE_TO_COPY.ext FILE_TO_UPDATE.ext

Permissions on a parent directory are more important than a files permissions. IE if a parent dir has RWX and a file within that dir will has no permissions, it will still be readable, writable or exexucatable / deletable.
 
# changing the owner
chown new_owner file/directory      # => Ex: sudo chown john a.txt
 
# changing the group owner
chgrp new_group file/directory
 
# changing both the owner and the group owner
chown new_owner:new_group file/directory
 
# changing recursively the owner or the group owner
chown -R new-owner file/directory
 
# displaying the file attributes
lsattr filename
 
#changing the file attributes
chattr +-attribute filename     # => Ex: sudo chattr +i report.txt


##########################
## Bash Aliases
##########################
 
# listing all Aliases
alias
 
# creating an alias:  alias_name="command"
alias copy="cp -i"
 
# to make the aliases you define persistent, add them to ~/.bashrc
 
# removing an alias: unalias alias_name
unalias copy
 
## Useful Aliases ##
alias c="clear"
alias cl="clear;ls;pwd"
alias root="sudo su"
alias ports="netstat -tupan"
alias sshconfig="sudo vim /etc/ssh/sshd_config"
alias my_server="ssh -p 3245-l user100 80.0.0.1"
alias update=”sudo apt update && sudo apt dist-upgrade -y && sudo apt clean”
alias lt="ls -hSF --size -1"
alias ping='ping -c 5'
 
# Interactive File Manipulation
alias cp="cp -i"
alias mv="mv -i"
alias rm="rm -i"
 
## Important alias ##
# This may look a bit confusing, but essentially, 
# it makes all of the other aliases you define function correctly when used with sudo 
alias sudo='sudo '      # use single quotes, not double quotes.

## Editing sudoers
[This video explains details to update the sudoers file.](https://www.youtube.com/watch?v=07JOqKOBRnU&t=23s)

Critically editing this file should only be done using sudo visudo. This opens a editor used for editing this file. The editor will prompt you if there are any errors while editing.
The editor will print `What now?` if there is an error.
We can choose `e` to edit the file to fix any errors.

## Monitor system resources
[This video explains details about htop.](https://www.youtube.com/watch?v=tU9cO9FwDx0)
We can actually use the mouse in the GUI to interact with htop.
We can search for processes by name and by the user who runs a process too.
There are facilities to modify what is displayed as well as the colour scheme.


## PS command
The ps command shows the status of active processes during a session.

When running ps the following columns are shown:
- PID = process id
- TTY = terminal used to run the process
- TIME = time the CPU takes to run the process 
- CMD = the command running as part of the process

We can also run:
`ps -aux` OR `ps aux`

To show all processes running by the current user run `ps -x`.

Processes started by the system (not the user) are designated with a ? In the TTY column

Variations of the ps command:
- `ps -He`
- `ps -axjf`