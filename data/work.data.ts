import { Work } from "../app/types";

/*
@todo Migrate data to Contenful
*/
const dataWork: Work[] = [
  {
    title: "Rebill's SDK",
    description:
      "I led the complete product definition and development of the Rebill SDK. The project has a strong focus on robust data security for payment processing and is designed to handle over +10K transactions per day. React and Tailwind for the frontend, NestJS for the backend, and the CI/CD pipeline fully automated with GitHub Actions and AWS. ☝️",
    github: "https://github.com/rebillto/demo-sdk-v3",
    reference: "https://docs.rebill.com/sdk",
  },
   {
    title: "Coolbooks 📓",
    description:
      "Discover and organize books from social media. Simply paste links from X, TikTok, or Instagram - books are automatically detected and saved to your personal library for easy collection management.",
    deploy: "https://coolbooks.in",
  },
  {
    title: "Basement Supply",
    description:
      "At Basement Studio, they make cool things that perform. This challenge involves implementing a product supply with a Basement signature style, using Next 13, Tailwind, and Jest, with Cypress for testing.",
    github: "https://github.com/alejorrojas/basement-challenge",
    deploy: "https://basement.alejorrojas.com/",
  },
];

export default dataWork;
