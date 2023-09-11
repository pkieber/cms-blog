
import React, { useRef, useState, useEffect } from 'react';
import { submitComment } from '@/services';

const CommentsForm = ({ slug }) => {
    const [error, setError] = useState(false);
    const [localStorageData, setLocalStorageData] = useState(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        comment: '',
        storeData: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setLocalStorageData(window.localStorage);
        const initialFormData = {
            name: localStorageData?.name || '',
            email: localStorageData?.email || '',
            comment: '',
            storeData: localStorageData?.name || localStorageData?.email || false,
        };
        setFormData(initialFormData);
    }, [localStorageData]);

    const onInputChange = (e) => {
        const { target } = e;
        if (target.type === 'checkbox') {
        setFormData((prevState) => ({
            ...prevState,
            [target.name]: target.checked,
        }));
        } else {
        setFormData((prevState) => ({
            ...prevState,
            [target.name]: target.value,
        }));
        }
    };

    const handlePostSubmission = () => {
        setIsSubmitting(true);
        setError(false);
        const { name, email, comment, storeData } = formData;
        if (!name || !email || !comment) {
            setError(true);
            setIsSubmitting(false);
            return;
        }
        const commentObj = {
            name,
            email,
            comment,
            slug,
        };

        if (storeData) {
            localStorageData.setItem('name', name);
            localStorageData.setItem('email', email);
        } else {
            localStorageData.removeItem('name');
            localStorageData.removeItem('email');
        }

        submitComment(commentObj)
        .then((res) => {
            if (res.createComment) {
            setFormData((prevState) => ({
                ...prevState,
                name: '',
                email: '',
                comment: '',
            }));
            setShowSuccessMessage(true);
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000);
            }
        })
        .finally(() => {
            setIsSubmitting(false);
        });
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-8 pb-12 mb-8">
            <h3 className="text-xl mb-8 font-semibold border-b pb-4">Leave a Reply</h3>
            <div className="grid grid-cols-1 gap-4 mb-4">
                <textarea
                    value={formData.comment}
                    onChange={onInputChange}
                    className="p-4 outline-none w-full rounded-lg h-40 focus:ring-2 focus:ring-gray-200 bg-gray-100 text-gray-700"
                    name="comment"
                    placeholder="Comment"
                />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <input
                    type="text"
                    value={formData.name}
                    onChange={onInputChange}
                    className="py-2 px-4 outline-none w-full rounded-lg focus:ring-2 focus:ring-gray-200 bg-gray-100 text-gray-700"
                    placeholder="Name"
                    name="name"
                />
                <input
                    type="email"
                    value={formData.email}
                    onChange={onInputChange}
                    className="py-2 px-4 outline-none w-full rounded-lg focus:ring-2 focus:ring-gray-200 bg-gray-100 text-gray-700"
                    placeholder="Email"
                    name="email"
                />
            </div>
            <div className="grid grid-cols-1 gap-4 mb-4">
                <div>
                <input
                    checked={formData.storeData}
                    onChange={onInputChange}
                    type="checkbox"
                    id="storeData"
                    name="storeData"
                    value="true"
                />
                <label className="text-gray-500 cursor-pointer" htmlFor="storeData">
                    Save my name, email in this browser for the next time I comment.
                </label>
                </div>
            </div>
            {error && <p className="text-xs text-red-500">All fields are mandatory</p>}
            <div className="mt-8">
                <button
                    type="button"
                    onClick={handlePostSubmission}
                    disabled={isSubmitting}
                    className="transition duration-500 ease hover:bg-indigo-900 inline-block bg-pink-600 text-lg font-medium rounded-full text-white px-8 py-3 cursor-pointer"
                >
                {isSubmitting ? 'Submitting...' : 'Post Comment'}
                </button>
                {showSuccessMessage && (
                <span className="text-xl float-right font-semibold mt-3 text-green-500">Comment submitted for review</span>
                )}
            </div>
        </div>
    );
};

export default CommentsForm;
