import { getCollection } from 'astro:content';

export async function GET({ url }) {
  const query = url.searchParams.get('query');

  // Handle if query is not present
  if (!query) {
    return new Response(
      JSON.stringify({
        error: 'Query param is missing',
      }),
      {
        status: 400, // Bad request
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  const allBlogArticles = await getCollection('blog');

  // Filter articles based on query
  const searchResults = allBlogArticles.filter((article) => {
    const titleMatch = article.data.title
      .toLowerCase()
      .includes(query.toLowerCase());

    const bodyMatch = article.body
      .toLowerCase()
      .includes(query.toLowerCase());

    const slugMatch = article.slug
      .toLowerCase()
      .includes(query.toLowerCase());

    return titleMatch || bodyMatch || slugMatch;
  });

  // Map results to include only 'data' and 'body'
  const refinedResults = searchResults.map((article) => ({
    data: article.data,
    body: article.body,
  }));

  return new Response(JSON.stringify(refinedResults), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}