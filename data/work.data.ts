import { Work } from "../app/types";

/*
@todo Migrate data to Contenful
*/
const dataWork: Work[] = [
  {
    title: "Basement Supply",
    description:
      "At Basement Studio, they make cool things that perform. This challenge involves implementing a product supply with a Basement signature style, using Next 13, Tailwind, and Jest, with Cypress for testing. 🤘🚀",
    github: "https://github.com/alejorrojas/basement-challenge",
    deploy: "https://alejoxbasement.vercel.app/",
  },
  {
    title: "Gym API",
    description:
      "Powerful gym management API built with NestJS and TypeScript. Utilizing TypeORM for seamless SQL database and Swagger support, the API enables essential operations CRUD and secure professor/student logins via JWT. 🏋️‍♀️💻",
    github: "https://github.com/alejorrojas/gym-api",
  },
  {
    title: "Java Compiler",
    description:
      "As a project for 'Universidad Tecnologica Nacional' this Java compiler transforms XML into HTML with advanced features like syntactic analysis, error detection, and the compilation of well-structured HTML files. Emphasis is placed on understanding the syntactic analysis process and derivation trees based on language grammar. ☁⚙ ",
    github: "https://github.com/alejorrojas/utn-compiler",
  },
  {
    title: "Dogs API",
    description:
      "Powering the backend of a community-driven dog discovery app. This NodeJS API built with TypeScript, Express, and Sequelize for Dogs Deck app. Supports POST, DELETE, and GET endpoints with filters and integrates seamlessly with an SQL database 🚀⚙",
    github: "https://github.com/alejorrojas/dogs-api",
  },
];

export default dataWork;
