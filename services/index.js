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

/*
export const submitComment = async (obj) => {
    const result = await fetch('/api/comments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
    },
        body: JSON.stringify(obj),
    });

    return result.json();
};
*/


export const submitComment = async (obj) => {
    try {
        const result = await fetch('/api/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj),
        });
    
        if (!result.ok) {
            throw new Error(`Failed to submit comment. HTTP status ${result.status}`);
        }
        return result.json();
    } catch (error) {
        console.error('Error submitting comment:', error);
        throw error;
    }
};


export const getComments = async (slug) => {
    const query = gql`
        query GetComments($slug: String!) {
            comments(where: { post: {slug: $slug } }) {
                name
                createdAt
                comment
            }
        }
    `;

    try {
        const result = await request(graphqlAPI, query, { slug });
        return result.comments;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
};


export const getFeaturedPosts = async () => {
    const query = gql`
        query GetCategoryPost() {
            posts(where: {featuredPost: true}) {
            author {
                name
                photo {
                    url
                }
            }
            featuredImage {
                url
            }
            title
            slug
            createdAt
            }
        }   
    `;

    try {
        const result = await request(graphqlAPI, query);
        return result.posts;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
};


export const getAdjacentPosts = async (createdAt, slug) => {
    const query = gql`
        query GetAdjacentPosts($createdAt: DateTime!,$slug:String!) {
            next:posts(
            first: 1
            orderBy: createdAt_ASC
            where: {slug_not: $slug, AND: {createdAt_gte: $createdAt}}
            ) {
                title
                featuredImage {
                    url
            }
                createdAt
                slug
            }
            previous:posts(
            first: 1
            orderBy: createdAt_DESC
            where: {slug_not: $slug, AND: {createdAt_lte: $createdAt}}
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
        const result = await request(graphqlAPI, query, { slug, createdAt });
        return { next: result.next[0], previous: result.previous[0] };
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
};


export const getCategoryPost = async (slug) => {
    const query = gql`
        query GetCategoryPost($slug: String!) {
            postsConnection(where: {categories_some: {slug: $slug}}) {
            edges {
                cursor
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
        const result = await request(graphqlAPI, query, { slug });
        return result.postsConnection.edges;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
};