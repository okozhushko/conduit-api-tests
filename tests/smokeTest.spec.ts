import { test } from "../utils/fixtures";
import { expect } from "../utils/customExpect";
import { createToken } from "../helpers/createToken";
import { validateSchema } from "../utils/schema-validator";

test("Get articles", async ({ api }) => {
  const response = await api
    .path("/articles")
    .params({ limit: 10, offset: 0 })
    .clearAuth()
    .getRequest(200);
  await expect(response).shouldMatchSchema('articles', 'GET_articles', true)
  expect(response.articles.length).shouldBeLessThanOrEqual(10);
  expect(response.articlesCount).shouldEqual(10);
});

test("Get test tags", async ({ api }) => {
  const response = await api
    .path("/tags")
    .getRequest(200);
  await expect(response).shouldMatchSchema('tags', 'GET_tags', true)
  expect(response.tags[0]).shouldEqual("Test");
  expect(response.tags.length).shouldBeLessThanOrEqual(10);
});

test("Create and delete article", async ({ api }) => {
  // Create new article
  const createArticleResponse = await api
    .path("/articles/")
    .body({ article: { title: "New Test Article", description: "Test Description", body: "Test Body", tagList: [] } })
    .postRequest(201);
  expect(createArticleResponse.article.title).toEqual("New Test Article");
  const slugId = createArticleResponse.article.slug;

  // Get articles
  const articlesResponse = await api
    .path("/articles")
    .params({ limit: 10, offset: 0 })
    .getRequest(200);
  await expect(createArticleResponse).shouldMatchSchema('articles', 'POST_articles', true)
  expect(articlesResponse.articles[0].title).shouldEqual("New Test Article");

  // Delete article
  await api
    .path(`/articles/${slugId}`)
    .deleteRequest(204);

  //Check article is deleted
  const articlesResponseTwo = await api
    .path("/articles")
    .params({ limit: 10, offset: 0 })
    .getRequest(200);
  expect(articlesResponseTwo.articles[0].title).not.shouldEqual("New Test Article");

});

test("Create, Update and delete article", async ({ api }) => {
  const createArticleResponse = await api
    .path("/articles/")
    .body({ article: { title: "Test NEW TEST", description: "Test Description", body: "Test Body", tagList: [] } })
    .postRequest(201);
  expect(createArticleResponse.article.title).shouldEqual("Test NEW TEST");
  const slugId = createArticleResponse.article.slug;

  const updateArticleResponse = await api
    .path(`/articles/${slugId}`)
    .body({ article: { title: "Test NEW TEST Modified", description: "Updated Description", body: "Updated Body" } })
    .putRequest(200);
  expect(updateArticleResponse.article.title).shouldEqual("Test NEW TEST Modified");
  const newSlugId = updateArticleResponse.article.slug;

  const articlesResponse = await api
    .path("/articles")
    .params({ limit: 10, offset: 0 })
    .getRequest(200);
  expect(articlesResponse.articles[0].title).shouldEqual("Test NEW TEST Modified");

  await api
    .path(`/articles/${newSlugId}`)
    .deleteRequest(204);

  const articlesResponseTwo = await api
    .path("/articles")
    .params({ limit: 10, offset: 0 })
    .getRequest(200);
  expect(articlesResponseTwo.articles[0].title).not.shouldEqual("Test NEW TEST Modified");

});


