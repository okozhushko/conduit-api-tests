import { test } from "../../utils/fixtures";
import { expect } from "../../utils/custom-expect";
import articleRequestPayload from "../../request-objects/POST-article.json";
import { Faker, faker } from '@faker-js/faker';
import { getNewRandomArticle } from "../../utils/data-generator";


test("Get Articles", async ({ api }) => {
  const response = await api
    .path("/articles")
    .params({ limit: 10, offset: 0 })
    .clearAuth()
    .getRequest(200);
  await expect(response).shouldMatchSchema('articles', 'GET_articles')
  expect(response.articles.length).shouldBeLessThanOrEqual(10);
  expect(response.articlesCount).shouldEqual(10);
});

test("Get Test Tags", async ({ api }) => {
  const response = await api
    .path("/tags")
    .getRequest(200);
  await expect(response).shouldMatchSchema('tags', 'GET_tags')
  expect(response.tags[0]).shouldEqual("Test");
  expect(response.tags.length).shouldBeLessThanOrEqual(10);
});

test("Create And Delete Article", async ({ api }) => {
  // Create new article
  const articleRequest = getNewRandomArticle()
  const createArticleResponse = await api
    .path("/articles/")
    .body(articleRequest)
    .postRequest(201);
  await expect(createArticleResponse).shouldMatchSchema('articles', 'POST_articles')
  expect(createArticleResponse.article.title).toEqual(articleRequest.article.title);
  const slugId = createArticleResponse.article.slug;

  // Get articles
  const articlesResponse = await api
    .path("/articles")
    .params({ limit: 10, offset: 0 })
    .getRequest(200);
  expect(articlesResponse.articles[0].title).shouldEqual(articleRequest.article.title);

  // Delete article
  await api
    .path(`/articles/${slugId}`)
    .deleteRequest(204);

  //Check article is deleted
  const articlesResponseTwo = await api
    .path("/articles")
    .params({ limit: 10, offset: 0 })
    .getRequest(200);
  expect(articlesResponseTwo.articles[0].title).not.shouldEqual(articleRequest.article.title);

});

test("Create, Update And Delete Article", async ({ api }) => {
  const articleTitle = faker.lorem.sentence(5)
  const articleRequest = JSON.parse(JSON.stringify(articleRequestPayload))
  articleRequest.article.title = articleTitle
  const createArticleResponse = await api
    .path("/articles")
    .body(articleRequest)
    .postRequest(201);
  expect(createArticleResponse.article.title).shouldEqual(articleRequest.article.title);
  const slugId = createArticleResponse.article.slug;

  const articleTitleUpdated = faker.lorem.sentence(5)
  const updateArticleResponse = await api
    .path(`/articles/${slugId}`)
    .body({
      article: {
        title: articleTitleUpdated,
        description: "Updated Description",
        body: "Updated Body"
      }
    })
    .putRequest(200);
  expect(updateArticleResponse.article.title).shouldEqual(articleTitleUpdated);
  const newSlugId = updateArticleResponse.article.slug;

  const articlesResponse = await api
    .path("/articles")
    .params({ limit: 10, offset: 0 })
    .getRequest(200);
  expect(articlesResponse.articles[0].title).shouldEqual(articleTitleUpdated);

  await api
    .path(`/articles/${newSlugId}`)
    .deleteRequest(204);

  const articlesResponseTwo = await api
    .path("/articles")
    .params({ limit: 10, offset: 0 })
    .getRequest(200);
  expect(articlesResponseTwo.articles[0].title).not.shouldEqual(articleTitleUpdated);

});


