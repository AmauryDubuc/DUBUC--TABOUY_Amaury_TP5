Partie 1 :

Question 1.1 :

HTTP/1.1 200 OK
Date: Fri, 22 Sep 2023 06:15:21 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Transfer-Encoding: chunked


Question 1.2 :

HTTP/1.1 200 OK
Content-Type: application/json
Date: Fri, 22 Sep 2023 06:22:53 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Content-Length: 20

On a ajouté l'entête Content-Type: application/json


Question 1.3 :

Le serveur ne trouve pas le fichier index_html acr c'est __index.html 


Question 1.4 :

[Error: ENOENT: no such file or directory, open 'C:\Users\Utilisateur\OneDrive\Documents\Dev Web\CC3\index.html'] {
  errno: -4058,
  code: 'ENOENT',
  syscall: 'open',
  path: 'C:\\Users\\Utilisateur\\OneDrive\\Documents\\Dev Web\\CC3\\index.html'
}

ENOENT (No such file or directory): Commonly raised by fs operations to indicate that a component of the specified pathname does not exist. No entity (file or directory) could be found by the given path.


Question 1.5 :

Affichage de l'erreur 500 dans la console :

function requestListener(_request, response) {
  fs.readFile("index.html", "utf8")
    .then((contents) => {
      response.setHeader("Content-Type", "text/html");
      response.writeHead(200);
      return response.end(contents);
    })
    .catch((error) => console.log(response.writeHead(500)));
}

requestListener en mode async/await :

async function requestListener(_request, response) {
    try {
        const contents = await fs.readFile("index.html", "utf8");
        response.setHeader("Content-Type", "text/html");
        response.writeHead(200);
        return response.end(contents);
    } catch(error) {
        console.error(error);
        response.writeHead(500);
        response.end("Erreur interne du serveur");
    }
}


Question 1.6 :

Elle a ajouté des package :

PS C:\Users\Utilisateur\OneDrive\Documents\Dev Web\CC3> npm install cross-env --save

added 7 packages, and audited 8 packages in 1s

found 0 vulnerabilities
PS C:\Users\Utilisateur\OneDrive\Documents\Dev Web\CC3> npm install nodemon --save-dev

added 33 packages, and audited 41 packages in 1s

3 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities


Question 1.7 :

http-dev:

Il y a un rechargement automatique.

http-prod :

Il n'y a pas de rechargement automatique.


Question 1.8 :

http://localhost:8000/index.html : retourne la page index.html, 200

http://localhost:8000/random.html : retourne un nombre aléatoire, 200

http://localhost:8000/ : erreur 404

http://localhost:8000/dont-exist : erreur 404


J'ai fais en sorte que si on met localhost:8000/ que ce soit pareil que le index.html et il y a la nouvel route /random/:nb

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

Partie 2 :

Question 2.1 :

https://expressjs.com/

https://www.npmjs.com/package/http-errors

https://github.com/pimterry/loglevel

https://github.com/expressjs/morgan


Question 2.2 :

Le "index.html" et le "/" fonctionne parfaitement 

le "/random/:nb" ne marché pas car vu qu'il ya le : devant le nb il faut slice(1) pour enlever le :
app.get("/random/:nb", async function (request, response, next) {
  const length = request.params.nb;
  const contents = Array.from({ length })
    .map((_) => `<li>${Math.floor(100 * Math.random())}</li>`)
    .join("\n");
  return response.send(`<html><ul>${contents}</ul></html>`);
});


Question 2.3 :

index.html et / :

HTTP/1.1 200 OK
X-Powered-By: Express
Accept-Ranges: bytes
Cache-Control: public, max-age=0
Last-Modified: Fri, 22 Sep 2023 06:02:56 GMT
ETag: W/"3ac-18abb7bf0c7"
Content-Type: text/html; charset=UTF-8
Content-Length: 940
Date: Wed, 27 Sep 2023 21:01:57 GMT
Connection: keep-alive
Keep-Alive: timeout=5

random/:nb :

HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: text/html; charset=utf-8
Content-Length: 57
ETag: W/"39-EkXkFbaiGno7imgi2ASBGJyc/aA"
Date: Wed, 27 Sep 2023 21:01:32 GMT
Connection: keep-alive
Keep-Alive: timeout=5

/, index.html et random/:nb ont une ligne X-Powered-By: Express qui a été ajouté


Question 2.4 :

L'événement listening est déclenché lorsque le serveur commence a écouté sur un port spécifique


Question 2.5 :

L'option est activé par défaut par le naviguateur car si on supprime le app.get de / et index.html on est quand meme redirigé par defaut sur le index.html

Question 2.6 :

Avec Ctrl+R :

304 Not Modified car le fichier est dans le cache

Avec Ctrl+Shift+R :

200 OK il a recup le fichier


Rendu avec EJS :

4 :

app.get("/random/:nb", async function (request, response, next) {
  const length = request.params.nb;
  if (Number.isNaN(length)) {
    response.writeHead(400);
    return response.end(`<html><p>400: Bad Request - nb parameter is missing or not a valid number</p></html>`);
  } else {
    const welcome = 'Bonjour monsieur, vous allez bien ?';
    let numbers = []
    for (let index = 0; index < length; index++) {
      const randomNumber = Math.floor(100 * Math.random());
      numbers.push(randomNumber);
    }
    return response.render("random", {numbers, welcome});
  }
});

Gestion d’erreurs :

app.get("/random/:nb", async function (request, response, next) {
  const length = Number.parseInt(request.params.nb, 10)
  if (Number.isNaN(length)) {
    next(createError(400));
  } else {
    const welcome = 'Bonjour monsieur, vous allez bien ?';
    let numbers = []
    for (let index = 0; index < length; index++) {
      const randomNumber = Math.floor(100 * Math.random());
      numbers.push(randomNumber);
    }
    return response.render("random", {numbers, welcome});
  }
});


Question 2.7 :

En mode production :

Error 400
Bad Request

En mode dev :

Error 400
Bad Request

BadRequestError: Bad Request
    at file:///C:/Users/Utilisateur/OneDrive/Documents/Dev%20Web/CC3/server-express.mjs:41:10
    at Layer.handle [as handle_request] (C:\Users\Utilisateur\OneDrive\Documents\Dev Web\CC3\node_modules\express\lib\router\layer.js:95:5)
    at next (C:\Users\Utilisateur\OneDrive\Documents\Dev Web\CC3\node_modules\express\lib\router\route.js:144:13)
    at Route.dispatch (C:\Users\Utilisateur\OneDrive\Documents\Dev Web\CC3\node_modules\express\lib\router\route.js:114:3)
    at Layer.handle [as handle_request] (C:\Users\Utilisateur\OneDrive\Documents\Dev Web\CC3\node_modules\express\lib\router\layer.js:95:5)
    at C:\Users\Utilisateur\OneDrive\Documents\Dev Web\CC3\node_modules\express\lib\router\index.js:284:15
    at param (C:\Users\Utilisateur\OneDrive\Documents\Dev Web\CC3\node_modules\express\lib\router\index.js:365:14)
    at param (C:\Users\Utilisateur\OneDrive\Documents\Dev Web\CC3\node_modules\express\lib\router\index.js:376:14)
    at Function.process_params (C:\Users\Utilisateur\OneDrive\Documents\Dev Web\CC3\node_modules\express\lib\router\index.js:421:3)
    at next (C:\Users\Utilisateur\OneDrive\Documents\Dev Web\CC3\node_modules\express\lib\router\index.js:280:10)