
# Set up Multiple Git accounts 

Generate a ssh key. If one already exists a unique name must be used otherwise it gets over written.

`ssh-keygen -t rsa -C "mark@email.com"`

Provide the current path and ssh file name.
Enter file in which to save the key (/Users/markcondello/.ssh/id_rsa): /Users/markcondello/.ssh/id_rsa_agency_gh

Copy the public key and add it to GitHub:

`cat id_rsa_agency_gh.pub`

Register the private ssh key in the local machine.

`ssh-add /Users/markcondello/.ssh/id_rsa_agency_gh`

Add a reference to the ssh key in the config file
```
## Work github account
Host github.com-markcond
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_rsa_agency_gh
```

When cloning, remember to add the custom Host text eg github.com-markcond after the @ symbol

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