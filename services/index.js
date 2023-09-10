import { request, gql } from 'graphql-request';

const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT;


export const getPosts = async () => {
    const query = gql`
        query MyQuery {
            postsConnection {
                edges {
                    node {
                        author {
                            bio
                            name
                            id
                            photo {
                                url
                            }
                        }
                        createdAt
                        slug
                        title
                        excerpt
                        featuredImage {
                            url
                        }
                        categories {
                            name
                            slug
                        }
                    }
                }
            }
        }
    `;

    try {
        const result = await request(graphqlAPI, query);
        return result.postsConnection.edges.map(edge => edge.node);
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
};



export const getPostDetails = async (slug) => {
    const query = gql`
        query GetPostDetails($slug : String!) {
            post(where: {slug: $slug}) {
                title
                excerpt
                featuredImage {
                    url
                }
                author{
                    name
                    bio
                    photo {
                    url
                    }
                }
                createdAt
                slug
                content {
                    raw
                }
                categories {
                    name
                    slug
                }
            }
        }
    `;

    try {
        const result = await request(graphqlAPI, query, { slug });
        return result.post;
    } catch (error) {
        console.error('Error fetching post details:', error);
        return null;
    }
};


export const getRecentPosts = async () => {
    const query = gql`
        query GetPostDetails() {
            posts(
                orderBy: createdAt_ASC
                last: 3
            ) {
                title
                featuredImage {
                    url
                }
                createdAt
                slug
            }
        }
    `;

    try {
        const result = await request(graphqlAPI, query);
        return result.posts;
    } catch (error) {
        console.error('Error fetching recent posts:', error);
        return [];
    }
};


// Similar posts --> excluding the current slug, but showing slugs within the same category. 
export const getSimilarPosts = async (categories, slug) => {
    const query = gql`
        query GetPostDetails($slug: String!, $categories: [String!]) {
            posts(
                where: { slug_not: $slug, AND: {categories_some: { slug_in: $categories }}}
                last: 3
            ) {
                title
                featuredImage {
                    url
                }
                createdAt
                slug
            }
        }
    `;

    try {
        const result = await request(graphqlAPI, query, { categories, slug });
        return result.posts;
    } catch (error) {
        console.error('Error fetching similar posts:', error);
        return [];
    }
};


export const getCategories = async () => {
    const query = gql`
        query GetCategories {
            categories {
                name
                slug
            }
        }
    `;

    try {
        const result = await request(graphqlAPI, query);
        return result.categories;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
};