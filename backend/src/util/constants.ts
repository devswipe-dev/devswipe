import dotenv from 'dotenv';
import { Response } from 'express';
dotenv.config();

export const PORT: string = process.env.PORT || "5000";
export const MONGO_CONNECTION_STRING: string = process.env.MONGO_CONNECTION_STRING!;
export const MONGO_DB_NAME: string = process.env.MONGO_DB_NAME!;
export const USER_COLLECTION_NAME: string = "Users";
export const PROJECT_COLLECTION_NAME: string = "Projects";
export const CHAT_COLLECTION_NAME: string = "Chat";
export const SESSION_SECRET: string = process.env.SESSION_SECRET!;
export const ALLOWED_ORIGINS: string[] = process.env.ALLOWED_ORIGINS!.split(", ");

export function returnWithErrorJson(res: Response, error: string) {
    return res.status(406).json({error: error});
}

export function returnWithOKJson(res: Response) {
    return res.status(200).json({status: "OK"});
}

export const attributes: Set<string> = new Set([
    "Backend",
    "Frontend",
    "Junior",
    "Mid",
    "Senior",
    "Python",
    "C",
    "Java",
    "JavaScript",
    "TypeScript",
    "C++",
    "PHP",
    "Ruby",
    "Swift",
    "Kotlin",
    "Go",
    "SQL",
    "HTML",
    "CSS",
    "React",
    "Node.js",
    "Express.js",
    "Angular",
    "Vue.js",
    "Bootstrap",
    "jQuery",
    "Git",
    "GitHub",
    "GitLab",
    "Bitbucket",
    "Bash",
    "Linux",
    "Windows",
    "macOS",
    "Docker",
    "Kubernetes",
    "AWS",
    "Google Cloud",
    "Microsoft Azure",
    "Firebase",
    "MongoDB",
    "MySQL",
    "PostgreSQL",
    "SQLite",
    "Redis",
    "Elasticsearch",
    "REST APIs",
    "GraphQL",
    "SOAP",
    "JSON",
    "XML",
    "WebSockets",
    "Microservices",
    "Nginx",
    "Apache",
    "Jenkins",
    "CI/CD",
    "Agile Methodology",
    "Scrum",
    "JIRA",
    "Trello",
    "Test-Driven Development (TDD)",
    "Unit Testing",
    "Selenium",
    "Jest",
    "Mocha",
    "Jasmine",
    "Postman",
    "React Native",
    "Flutter",
    "Android Development",
    "iOS Development",
    "SwiftUI",
    "Xcode",
    "Android Studio",
    "SQL Server",
    "Firebase Firestore",
    "Laravel",
    "Django",
    "Flask",
    "Spring Boot",
    "Ruby on Rails",
    "Apache Kafka",
    "Redis",
    "Vagrant",
    "Terraform",
    "Virtualization",
    "CloudFormation",
    "OAuth",
    "JWT",
    "Web Security",
    "Cryptography",
    "OWASP Top 10",
    "Load Balancing",
    "Data Structures",
    "Algorithms",
    "Object-Oriented Programming (OOP)",
    "Functional Programming",
    "Design Patterns",
    "Computer Networks",
    "Version Control Systems",
    "Shell Scripting",
    "Data Analytics",
    "Data Visualization",
    "Excel"
]);