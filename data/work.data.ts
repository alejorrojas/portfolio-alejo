import { Work } from "../app/types";

/*
@todo Migrate data to Contenfull
*/
const dataWork: Work[] = [
    {
     title: "Gym API",
     description: "Powerful gym management API built with NestJS and TypeScript. Utilizing TypeORM for seamless SQL database and Swagger support, the API enables essential operations CRUD and secure professor/student logins via JWT. 🏋️‍♀️💻",
     github:"https://github.com/alejorrojas/gym-api"
    },
    {
     title: "Dogs deck",
     description: "Dogs Deck is a community-driven app for discovering and saving your favorite dogs. Create and explore dogs added by the community. Built with React, Redux, NodeJS, and PostgreSQL, deployed on Vercel. 🐾💻",
     github:"https://github.com/alejorrojas/DogsDeck"
    },
    {
     title: "Dogs API",
     description: "Powering the backend of a community-driven dog discovery app. This NodeJS API built with TypeScript, Express, and Sequelize for Dogs Deck app. Supports POST, DELETE, and GET endpoints with filters and integrates seamlessly with an SQL database 🚀⚙",
     github:"https://github.com/alejorrojas/dogs-api"
    },
]

export default dataWork