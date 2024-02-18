# HTN-Backend-Challenge
This is my submission for HTN Backend Challenge 2024. 😌  
It was built using **Express/GraphQL** (had a lot of fun learning GraphQL for this!)

## Setup
- `npm i`: Install required dependencies
- `node ./database/setup.js`: Populate database
- `node index.js`: Run the server

## Endpoints
### Query: `allUsers: [User]`
Returns a list of all users in the database.

**Sample Request**
```
allUsers {
  name
  company
  email
  phone
  skills {
    skill
    rating
  }
}
```

**Sample Response**
```
"allUsers": [
  {
    "name": "Breanna Dillon",
    "company": "Jackson Ltd",
    "email": "lorettabrown@example.net",
    "phone": "+1-924-116-7963",
    "skills": [
      {
        "skill": "Swift",
        "rating": 4
      },
      {
        "skill": "OpenCV",
        "rating": 1
      }
    ]
  }
  ...
]

```


### Query: `userById: User` 
Returns a user that mathces with the given an ID

**Required argument:**
- `id: Int`: the id of the user

**Sample Reqest**
```
userById(id: 5) {
  name
  skills {
    skill
    rating
  }
}
```

**Sample Response**
```
"userById": {
  "name": "Maria Norman",
  "skills": [
    {
      "skill": "OCaml",
      "rating": 3
    },
    {
      "skill": "Ant Design",
      "rating": 4
    }
  ]
}
```


### Mutation: `updateUser: User`
Update some info of a provided user

**Required argument:**
- `id: Int`: the id of the user

**Optional arguments:**
- `name: String`: the name of the user
- `company: String`: the company of the user
- `email: String`: the email of the user
- `phone: String`: the phone number of the user

**Sample Request**
```
updateUser(id: 3, email: "newEmail@gmail.com") {
  name
  email
  phone
}
```

**Sample Response**
```
"updateUser": {
  "name": "Jenny Smith",
  "email": "newEmail@gmail.com",
  "phone": "596.231.3418"
}
```


### Query: `skills: SkillFrequency`
Returns a list of skills with a frequency between a range
**Optional arguments:**
- `min_frequency: Int`: the lower bound of a skill's frequency
- `max_frequency: Int`: the upper bound of a skill's frequency

**Sample Request**
```
skills(min_frequency: 38, max_frequency: 40) {
  name
  frequency
}
```

**Sample Response**
```
"skills": [
  {
    "name": "Angular",
    "frequency": 39
  },
  {
    "name": "Plotly",
    "frequency": 40
  }
]
```


### Query: `userScanEvents: ScanEvent`
Returns a list of attended events given an user id

**Required argument:**
- `user_id: Int`: the id of the user

**Sample Request**
```
userScanEvents(user_id: 1) {
  event_name
}
```

**Sample Response**
```
"userScanEvents": [
  {
    "event_name": "Intro to Computer Vision"
  },
  {
    "event_name": "Closing Ceremony"
  },
]
```


### Mutation: `scanUser: ScanEvent`
Scans the user into an event

**Required arguments:**
- `user_id: Int`
- `event_name: String`

**Sample Request**
```
scanUser(user_id: 1, event_name: "Free food!") {
  event_name
}
```

**Sample Response**
```
"scanUser": {
  "event_name": "Free food!"
}
```


### Query: `isHardwareAvailable: Boolean`
Returns the info and availability of a hardware

**Required argument:**
- `hardware_item: String`

**Sample Request**
```
isHardwareAvailable(hardware_item: "Laptop")
```

**Sample Response**
```
"isHardwareAvailable": true
```


### Mutation: `borrowHardware: Hardwareloan`
Borrow a hardware if it is availble

**Required arguments:**
- `user_id: Int`
- `hardware_item: String`

**Sample Request**
```
borrowHardware(user_id: 1, hardware_item: "Laptop") {
  hardware_item
}
```

**Sample Response**
```
"errors": [
  {
    "message": "Hardware item is currently unavailable",
    ...
  }
],
"data": {
  "borrowHardware": null
}
```



### Mutation: `returnHardware: Harwareloan`
Return a borrowed hardware

**Required arguments:**
- `hardware_item: String`

**Sample Request**
```
returnHardware(hardware_item: "Laptop") {
  hardware_item
}
```

**Sample Response**
```
"returnHardware": {
  "hardware_item": "Laptop"
}
```

## Summary
Given more time, there's definitely a lot of improvement to be made! It was a great learning experience nevertheless~

