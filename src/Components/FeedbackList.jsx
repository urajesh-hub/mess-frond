import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const FeedbackList = () => {
    const [feedback, setFeedback] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('https://mess-backend-30l4.onrender.com/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        const fetchFeedback = async (categoryId) => {
            setLoading(true);
            const url = categoryId 
                ? `https://mess-backend-30l4.onrender.com/feedback/${categoryId}` 
                : 'https://mess-backend-30l4.onrender.com/feedback';
            
            try {
                const response = await axios.get(url);
                setFeedback(response.data);
            } catch (error) {
                console.error('Error fetching feedback:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
        fetchFeedback(); 
    }, []);

    const fetchFeedback = async (categoryId) => {
        setLoading(true);
        const url = categoryId 
            ? `https://mess-backend-30l4.onrender.com/feedback/${categoryId}` 
            : 'https://mess-backend-30l4.onrender.com/feedback';
        
        try {
            const response = await axios.get(url);
            setFeedback(response.data);
        } catch (error) {
            console.error('Error fetching feedback:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = async (e) => {
        const categoryId = e.target.value;
        setSelectedCategory(categoryId);
        await fetchFeedback(categoryId);
    };

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Feedback List</h1>

            <div className="mb-3">
                <label htmlFor="category" className="form-label">Select Category:</label>
                <select
                    id="category"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    className="form-select"
                >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                        <option key={category._id} value={category._id}>{category.name}</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : feedback.length > 0 ? (
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Rating</th>
                                <th>Feedback</th>
                                <th>Date</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {feedback.map(item => (
                                <tr key={item._id}>
                                    <td>{item.itemId ? item.itemId.name : 'Item not found'}</td>
                                    <td>{item.rating}</td>
                                    <td>{item.feedback}</td>
                                    <td>{new Date(item.date).toLocaleDateString()}</td>
                                    <td>{new Date(item.date).toLocaleTimeString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No feedback available for this category.</p>
            )}
        </div>
    );
};

export default FeedbackList;
