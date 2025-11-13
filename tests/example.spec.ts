import { test, expect } from "@playwright/test";
let authToken: string;

test.beforeAll('Run before all', async ({request}) => {
  const tokenResponse = await request.post(
    "https://conduit-api.bondaracademy.com/api/users/login",
    {
      data: { user: { email: "pwapiuser@test.com", password: "Welcome" } }
    }
  );
  const tokenResponseJSON = await tokenResponse.json();
  authToken = "Token " + tokenResponseJSON.user.token;})

test("Get test tags", async ({ request }) => {
  const tagsResponse = await request.get(
    "https://conduit-api.bondaracademy.com/api/tags"
  );
  const tagsResponseJSON = await tagsResponse.json();

  expect(tagsResponse.status()).toEqual(200);
  expect(tagsResponseJSON.tags[0]).toEqual("Test");
  expect(tagsResponseJSON.tags.length).toBeLessThanOrEqual(10);
});

test("Get all articles", async ({ request }) => {
  const articlesResponse = await request.get(
    "https://conduit-api.bondaracademy.com/api/articles"
  );
  const articlesResponseJSON = await articlesResponse.json();

  expect(articlesResponse.status()).toEqual(200);
  expect(articlesResponseJSON.articles.length).toBeLessThanOrEqual(10);
  expect(articlesResponseJSON.articlesCount).toEqual(10);
});

test("Create and delete article", async ({ request }) => {
  // Створюємо нову статтю (POST /articles)
  const newArticleResponse = await request.post(
    "https://conduit-api.bondaracademy.com/api/articles/",
    {
      data: {
        article: {
          title: "New Test Article",
          description: "Test Description",
          body: "Test Body",
          tagList: []
        }
      },
      headers: {
        Authorization: authToken
      }
    }
  );

  // Отримуємо JSON-відповідь після створення статті
  const newArticleResponseJSON = await newArticleResponse.json();
  // Перевіряємо, що створення пройшло успішно (код 201)
  expect(newArticleResponse.status()).toEqual(201);
  // Перевіряємо, що назва статті збігається з очікуваною
  expect(newArticleResponseJSON.article.title).toEqual("New Test Article");
  // Дістаємо slug (унікальний ідентифікатор статті)
  const slugId = newArticleResponseJSON.article.slug;
  // Отримуємо список статей (GET /articles)
  const articlesResponse = await request.get(
    "https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0",
    {
      headers: {
        Authorization: authToken
      }
    }
  );

  // Парсимо список статей
  const articlesResponseJSON = await articlesResponse.json();
  // Перевіряємо, що запит успішний (код 200)
  expect(articlesResponse.status()).toEqual(200);
  // Перевіряємо, що перша стаття у списку має правильну назву
  expect(articlesResponseJSON.articles[0].title).toEqual("New Test Article");
  // Видаляємо створену статтю (DELETE /articles/{slug})
  const deleteArticleResponse = await request.delete(
    `https://conduit-api.bondaracademy.com/api/articles/${slugId}`,
    {
      headers: {
        Authorization: authToken
      }
    }
  );

  // Перевіряємо, що видалення пройшло успішно (код 204 — No Content)
  expect(deleteArticleResponse.status()).toEqual(204);
});

test("Create, Update and delete article", async ({ request }) => {
  //Create new article
  const newArticleResponse = await request.post(
    "https://conduit-api.bondaracademy.com/api/articles/",
    {
      data: {
        article: {
          title: "Test NEW Article",
          description: "Test description",
          body: "Test body",
          tagList: []
        }
      },
      headers: {
        Authorization: authToken
      }
    }
  );
  const newArticleResponseJSON = await newArticleResponse.json();
  expect(newArticleResponse.status()).toEqual(201);
  expect(newArticleResponseJSON.article.title).toEqual("Test NEW Article");
  const slugId = newArticleResponseJSON.article.slug;

  //Update created article
  const updateArticleResponse = await request.put(
    `https://conduit-api.bondaracademy.com/api/articles/${slugId}`,
    {
      data: {
        article: {
          title: "Test NEW Article Modified",
          description: "Test description",
          body: "Test body",
          tagList: []
        }
      },
      headers: {
        Authorization: authToken
      }
    }
  );
  const updateArticleResponseJSON = await updateArticleResponse.json();
  expect(updateArticleResponse.status()).toEqual(200);
  expect(updateArticleResponseJSON.article.title).toEqual(
    "Test NEW Article Modified"
  );
  const newSlugId = updateArticleResponseJSON.article.slug;

  //validate that article was updated
  const articlesResponse = await request.get(
    "https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0",
    {
      headers: {
        Authorization: authToken
      }
    }
  );
  const articlesResponseJSON = await articlesResponse.json();
  expect(articlesResponse.status()).toEqual(200);
  expect(articlesResponseJSON.articles[0].title).toEqual(
    "Test NEW Article Modified"
  );

  //Delete created article
  const deleteArticleResponse = await request.delete(
    `https://conduit-api.bondaracademy.com/api/articles/${newSlugId}`,
    {
      headers: {
        Authorization: authToken
      }
    }
  );
  expect(deleteArticleResponse.status()).toEqual(204);
});
