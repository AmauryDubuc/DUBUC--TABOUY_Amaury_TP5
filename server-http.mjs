/* eslint-disable unicorn/prefer-number-properties */
/* eslint-disable unicorn/prefer-string-slice */
import http from "node:http";
import fs from "node:fs/promises";

const host = "localhost";
const port = 8000;

// function requestListener(_request, response) {
//   response.writeHead(200);
//   response.end("<html><h1>My first server!<h1></html>");
// }

// function requestListener(_request, response) {
//   response.setHeader("Content-Type", "application/json");
//   response.end(JSON.stringify({ message: "I'm OK" }));
// }

// function requestListener(_request, response) {
//   fs.readFile("index.html", "utf8")
//     .then((contents) => {
//       response.setHeader("Content-Type", "text/html");
//       response.writeHead(200);
//       return response.end(contents);
//     })
//     .catch((error) => console.log(response.writeHead(500)));
// }

// async function requestListener(_request, response) {
//   try {
//       const contents = await fs.readFile("index.html", "utf8");
//       response.setHeader("Content-Type", "text/html");
//       response.writeHead(200);
//       return response.end(contents);
//   } catch(error) {
//       console.error(error);
//       response.writeHead(500);
//       response.end("Erreur interne du serveur");
//   }
// }

async function requestListener(request, response) {
    response.setHeader("Content-Type", "text/html");
    try {
      const contents = await fs.readFile("index.html", "utf8");
      const route = request.url.split("/");
      switch (route[1]) {
        case "index.html": {
          response.writeHead(200);
          return response.end(contents);
        }
        case "": {
          response.writeHead(200);
          return response.end(contents);
        }
        case "random.html": {
          response.writeHead(200);
          return response.end(`<html><p>${Math.floor(100 * Math.random())}</p></html>`);
        }
        case "random": {
          const nb = parseInt(route[2]);
          if (isNaN(nb)) {
            response.writeHead(400);
            return response.end(`<html><p>400: Bad Request - nb parameter is missing or not a valid number</p></html>`);
          } else {
            response.writeHead(200);
            let html = "<html><p>"
            for (let index = 0; index < nb; index++) {
              const randomNumber = Math.floor(100 * Math.random());
              html += `${randomNumber}<br>`;
            }
            html += "</p></html>";
            return response.end(html);
          }
        }
        default: {
          response.writeHead(404);
          return response.end(`<html><p>404: NOT FOUND</p></html>`);
        }
      }
    } catch (error) {
      console.error(error);
      response.writeHead(500);
      return response.end(`<html><p>500: INTERNAL SERVER ERROR</p></html>`);
    }
}

const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});

console.log("NODE_ENV =", process.env.NODE_ENV);
