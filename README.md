# KatKin's Full-stack Coding Test

## BEFORE YOU BEGIN

Please take your time to thoroughly read through this README. If anything is unclear or you think there is a mistake somewhere, please let us know via email. We recommend you spend around 90 minutes on this test and do as much as you can. Submission instructions are at the bottom of this README.

This test is split into two parts - a backend REST API section, and a frontend section. If you struggle to finish the backend section, then please do the frontend section to the best of your ability by either faking/stubbing or not doing any API calls.

Do not worry if you do not finish everything. If in doubt, err on the side of quality.

We also encourage you to:

- Use Google, Stackoverflow, online documentation, AI as much as you require.
- Write tests if you think they are beneficial, but only if you think they are within reason of the time limit.
- Install and use any third party packages if you see fit
- Think about what you would do if you had more time, or if this was a real-world production project. We may ask further questions about your solution in further interviews.

## How will we assess your solution?

- Readability and how well-typed your code is
- The code should be written in Typescript and _must_ compile and run, on Node 18 or later.
- We take into account your previous experience with TypeScript.
- Don't implement anything unnecessary - i.e. authentication, database, containerization. We won't give additional credit for that.

## Description

As a highly personalised service, communications to our customers must be tailored purr-fectly and personalised to each and every customer. As we have multiple channels of communications (i.e. emails, SMS, landing pages), we like to keep the templating logic for this channel-agnostic and in a dedicated REST API service.

For example, calling `GET /comms/welcome-fresh/<USER-ID>` might return

```json
{
  "message": "Welcome to KatKin, <full-name>! We're super excited for <cat1> and <cat2> to join the KatKin club and start loving fresh!"
}
```

with the interpolated values populated with that specific customer's (and cat's) data. This endpoint could then be used to generate content for SMSs, emails, or personalized web pages.

## The setup

A skeletal backend has already been setting up for you, using TypeScript and NestJS - the language and framework we use at KatKin. To run this backend, you can do `yarn start`.

There is no frontend setup - you are free to setup one of your own React-based one as you choose, either within the same repository or in a different repository.

There is a `data.json` file containing user data in this repository, which you should read from in place of a database.

## 1. The Backend Task

Within this codebase, create an endpoint `/comms/your-next-delivery/<USER-ID>`, that looks up the corresponding user's data, and returns a JSON payload of the following shape:

```JSON
{
    "title": "Your next delivery for <cat names, separated by comma or 'and'>",
    "message": "Hey <firstName>! In two days' time, we'll be charging you for your next order for <cat names, formatted as described below>'s fresh food.",
    "totalPrice": <total price, calculated via the formula shown in a later section in this README>,
    "freeGift": <true if the total price exceeds 120 pounds, otherwise false>
}
```

Cat names should be formatted in a grammatically correct manner, i.e. just `A` if there's a single cat named A, `A and B` if there's two cats, `A, B and C` if there's three or more cats.

For example, with the following user:

```JSON
{
  "id": "ff535484-6880-4653-b06e-89983ecf4ed5",
  "firstName": "Kayleigh",
  "lastName": "Wilderman",
  "email": "Kayleigh_Wilderman@hotmail.com",
  "cats": [
    {
      "name": "Dorian",
      "subscriptionActive": true,
      "breed": "Thai",
      "pouchSize": "C"
    },
    {
      "name": "Ocie",
      "subscriptionActive": true,
      "breed": "Somali",
      "pouchSize": "F"
    },
    {
      "name": "Eldridge",
      "subscriptionActive": false,
      "breed": "Himalayan",
      "pouchSize": "A"
    }
  ]
}
```

hitting `/comms/your-next-delivery/ff535484-6880-4653-b06e-89983ecf4ed5` should return the following body:

```JSON
{
    "title": "Your next delivery for Dorian and Ocie",
    "message": "Hey Kayleigh! In two days' time, we'll be charging you for your next order for Dorian and Ocie's fresh food.",
    "totalPrice": 134.00,
    "freeGift": true
}
```

### Price calculation

Cats come in different shapes and sizes. Bigger cats need more food, and vice versa. Our food is delivered in pouches, hence we use the term _pouch size_ to refer to how much food a cat needs. Therefore, every cat in the dataset will have a `pouchSize` attributed to them - between `A` to `F`. Every pouch size will have its own price.

A user's order price is there calculated as the sum of their _active_ cats' pouch size prices. The pouch size prices are described below:

```
A -> 55.50 GBP
B -> 59.50 GBP
C -> 62.75 GBP
D -> 66.00 GBP
E -> 69.00 GBP
F -> 71.25 GBP
```

So for example, if a user had 3 cats, each on pouch size A, B, C, but only the first two cats (on A and B) currently have an active subscription, then their price would be 55.50 + 59.50 = £115.00 pounds.

## 2. The Frontend Task

Using React (or your favourite React-based metaframework of choice), create a frontend with just one page - `/welcome/<USER-ID>`, which calls the API endpoint described in the previous step and renders the message in a style similar to the figma file provided [here](https://www.figma.com/design/b6Q7B8dBr6QbdqkhPNoFgD/Untitled?node-id=0-1).

You can:

- Create a separate folder/repository to do this if you choose.
- Use any libraries/frameworks you want, i.e. Tailwind, styled components (or not - feel free to just use regular styling/CSS as well).
- Use any project generators you want (i.e. `create-next-app`, `create-react-app`, `create-vite-app`)

_Note_: We aren't expecting an exact 1-to-1 copy of the design, i.e. exact fonts, spacing, or colors. Just get roughly close enough. **Use any random image of a cat** that you can find.

# Submission

Send it via email to tech@katkin.com & nikki@katkin.com, you can attach the code in one of the two following ways:

1. Make your solution publicly available in a Git repository(s) and send us the URL(s). You can have a separate frontend/backend repository if you want. Please make sure to name the repository something inconspicuous, i.e, don't put `KatKin` in the name. Do not fork this repository as your solution will be visible to all other candidates.
2. Or, if option 1 is unfeasible, zip up all your code (please do not include `node_modules`!).

We would also appreciate it if you can write a sentence or two about what you think of this test and/or and how we could improve it.
