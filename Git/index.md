
# Set up Multiple Git accounts

Generate an SSH key. If one already exists a unique name must be used otherwise it gets over written.
`ssh-keygen -t rsa -C "user@emailaddress.com"`

More details about SSH and how to add a key to a server can be found (here)[https://www.youtube.com/watch?v=bfwfRCCFTVI].

Provide the current path and ssh file name.
Enter file in which to save the key (/Users/markcondello/.ssh/id_rsa): /Users/markcondello/.ssh/id_rsa_agency_gh

Copy the public key and add it to GitHub:
`pbcop < ./id_rsa_agency_gh.pub`

Register the private ssh key in the local machine.
`ssh-add /Users/markcondello/.ssh/id_rsa_agency_gh`

Add a reference to the ssh key in a `config` file like so:
```
## Work github account
Host github.com-markcond
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_rsa_agency_gh
  IdentitiesOnly yes
```

When cloning, remember to add the custom Host text eg github.com-markcond after the `@` symbol
`git clone git@github.com-markcond:AGENCY/sass-lib.git`

[Video with details here.](https://www.youtube.com/watch?v=ap56ivm0dhw)

## Initialize a repo locally
```
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin <REMOTE_URL/>
git push -u origin main
```

## Git flow
Start git flow:
```git flow init```

Run through the questionare and set the branch name:
```git flow feature start NAME_OF_BRANCH```

## Setup remote for deployment
A useful workflow is to deply changes from a specific branch to a server.
Details on the setup by using the `post-receive git hook` and the server remote can be found (here)[https://gist.github.com/nonbeing/f3441c96d8577a734fa240039b7113db].


## Connect to remote repo
Details from github are (here)[https://docs.github.com/en/get-started/getting-started-with-git/managing-remote-repositories].

## Test ssh connection
`ssh -Tv git@github.com`