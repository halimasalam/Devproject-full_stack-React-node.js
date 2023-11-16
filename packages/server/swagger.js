const swaggerAutogen = require("swagger-autogen")({
  openapi: "3.0.0", //
  autoHeaders: false
});

const docs = {
  info: {
    title: "Calorie Tracker API",
    description: "Calorie Tracker API Documentation",
    version: "1.0.0"
  },
  host: "localhost:4000",
  schemes: ["http"],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  }
};

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./server.js"];

swaggerAutogen(outputFile, endpointsFiles, docs);
