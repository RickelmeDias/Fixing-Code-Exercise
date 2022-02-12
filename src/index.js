const express = require("express");

const { v4: uuid } = require("uuid");
const { validate: isUuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const updatedRepository = request.body;

  if (!isUuid(id)) {
    return response.status(404).json({ error: "Repository not found" });
  }

  const repository = repositories.find(repository => repository.id === id);

  if (!repository) {
    return response.status(404).json({ error: "Repository not found" });
  }

  if (updatedRepository.likes) {
    return response.status(404).json({ likes: repository.likes });
  }

  
  const repoResult = { ...repository, ...updatedRepository };
  repositories[id] = repoResult;

  return response.json(repositories[id]);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }else{
    repositories.splice(repositoryIndex, 1);
    return response.status(204).send();
  }


});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }else{
    repositories[repositoryIndex].likes += 1;
    const likes = repositories[repositoryIndex].likes;
    return response.json({likes: likes});
  }

});

module.exports = app;
