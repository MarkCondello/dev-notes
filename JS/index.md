

## [Maps & Sets](https://www.youtube.com/watch?v=hRSwSAr-gok)

### Arrays versus Sets
```
const usersIds = [1, 7, 7, 23]
const isUserOnline = (id) => userIds.includes(id)

// removing items from an array is a lot of work, it also is resource heavy as JS needs to loop through all array items
const removeUserFromIds = (id) => {
  const indexMatch = usersIds.indexOf(id)
  usersIds.splice(indexMatch, 1) // returning a splice will return the spliced item
  // OR
  // return usersIds.filter(user => user != id)
}
// removeUserFromIds(1)
// console.log(usersIds)
const userIdsSet = new Set(usersIds)
// console.log(userIdsSet) // all unique values

const isUserOnlineSet = (id) => userIdsSet.has(id)
const removeUserOnlineSet = (id) => userIdsSet.delete(id)
console.log('Remove user 7', removeUserOnlineSet(7)) // deleting a set item returns true or false only 
console.log('User is online', isUserOnlineSet(7))

userIdsSet.forEach(user => console.log(user)) // we can also iterate over sets too
```

### Objects versus Maps
```
const users = {
  "mark" : {
    id: 1, status: "online",
  },
    "leo" : {
    id: 2, status: "afk",
  }
}
users["theo"] = {'id': 3, status: 'offline'}
// objects arent for arbitrary tree value mapping.

// objects should have strong types and its shape should be defined when it is instantiated and not modified during runtime. There are large performance losses for modifying an objects shape.

// console.log({users})

const usersMap = new Map([
  ["mark", {
    id: 1, status: "online",
  }],
  ["leo", {
    id: 2, status: "afk",
  }]
])

usersMap.set("theo", {'id': 33, status: 'inline'})
// console.log(usersMap)

const LeoUser = usersMap.get("leo")
// console.log({LeoUser})

// we can spread the map to iterate through them too
var filteredUsersById = [...usersMap].filter(user => user[1].id > 1)
// console.log({filteredUsersById})
```