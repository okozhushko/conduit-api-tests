import { test } from "../utils/fixtures";
import { expect } from "@playwright/test";
import { APILogger } from "../utils/logger";

let authToken: string;

test.beforeAll("Run before all", async ({ api }) => {
  const tokenResponse = await api
    .path("/users/login")
    .body({ user: { email: "pwapiuser@test.com", password: "Welcome" } })
    .postRequest(200);
  authToken = "Token " + tokenResponse.user.token;
});

test("Get articles", async ({ api }) => {
  const response = await api
    .path("/articles")
    .params({ limit: 10, offset: 0 })
    .getRequest(200);
  expect(response.articles.length).toBeLessThanOrEqual(10);
  expect(response.articlesCount).toEqual(10);
});

test("Get test tags", async ({ api }) => {
  const response = await api.path("/tags").getRequest(200);
  expect(response.tags[0]).toEqual("Test");
  expect(response.tags.length).toBeLessThanOrEqual(10);
});

test("Create and delete article", async ({ api }) => {
  // Create new article
  const createArticleResponse = await api
    .path("/articles/")
    .headers({ Authorization: authToken })
    .body({ article: { title: "New Test Article", description: "Test Description", body: "Test Body", tagList: [] } })
    .postRequest(201);
  expect(createArticleResponse.article.title).toEqual("New Test Article");
  const slugId = createArticleResponse.article.slug;

  // Get articles
  const articlesResponse = await api
    .path("/articles")
    .headers({ Authorization: authToken })
    .params({ limit: 10, offset: 0 })
    .getRequest(200);
  expect(articlesResponse.articles[0].title).toEqual("New Test Article");

  // Delete article
  await api
    .path(`/articles/${slugId}`)
    .headers({ Authorization: authToken })
    .deleteRequest(204);

//Check article is deleted
  const articlesResponseTwo = await api
    .path("/articles")
    .headers({ Authorization: authToken })
    .params({ limit: 10, offset: 0 })
    .getRequest(200);
    expect(articlesResponseTwo.articles[0].title).not.toEqual("New Test Article");

});

test("Create, Update and delete article", async ({ api }) => {
const createArticleResponse = await api
    .path("/articles/")
    .headers({ Authorization: authToken })
    .body({ article: { title: "Test NEW TEST", description: "Test Description", body: "Test Body", tagList: [] } })
    .postRequest(201);
expect(createArticleResponse.article.title).toEqual("Test NEW TEST");
const slugId = createArticleResponse.article.slug;

const updateArticleResponse =  await api    
    .path(`/articles/${slugId}`)
    .headers({ Authorization: authToken })
    .body({ article: { title: "Test NEW TEST Modified", description: "Updated Description", body: "Updated Body" } })
    .putRequest(200);
expect(updateArticleResponse.article.title).toEqual("Test NEW TEST Modified");
const newSlugId = updateArticleResponse.article.slug;

const articlesResponse = await api
    .path("/articles")
    .headers({ Authorization: authToken })
    .params({ limit: 10, offset: 0 })
    .getRequest(200);
expect(articlesResponse.articles[0].title).toEqual("Test NEW TEST Modified");

await api
    .path(`/articles/${newSlugId}`)
    .headers({ Authorization: authToken })
    .deleteRequest(204);

const articlesResponseTwo = await api
    .path("/articles")
    .headers({ Authorization: authToken })
    .params({ limit: 10, offset: 0 })
    .getRequest(200);
expect(articlesResponseTwo.articles[0].title).not.toEqual("Test NEW TEST Modified");

});


