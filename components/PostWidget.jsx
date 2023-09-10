import React, { useEffect, useState } from 'react';
import moment from 'moment';
import Link from 'next/link';
import { getRecentPosts, getSimilarPosts } from '@/services';


// In normal view, recent posts should be shown. 
// Inside a post, related posts should be shown.
// useEffect only changes when slug changes. 
const PostWidget = ({ categories, slug }) => {
    const [relatedPosts, setRelatedPosts] = useState([])

    useEffect(() => {
        if(slug) {
            getSimilarPosts(categories, slug)
                .then((result) => setRelatedPosts(result))
        } else {
            getRecentPosts()
                .then((result) => setRelatedPosts(result))
        }
    }, [slug])
    
    console.log(relatedPosts);

    return (
        <div className='bg-white shadow-lg rounded-lg p-8 mb-8'>
            <h3>
                { slug ? 'Related Posts' : 'Recent Posts'}
            </h3>
        </div>
    )
}

export default PostWidget