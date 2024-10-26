import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const FeedbackForm = () => {
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [feedbacks, setFeedbacks] = useState({}); // Object to store feedbacks for each selected item

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await axios.get('http://localhost:5000/categories');
            setCategories(response.data);
        };
        fetchCategories();
    }, []);

    const handleCategoryClick = async (categoryId) => {
        const response = await axios.get(`http://localhost:5000/items/${categoryId}`);
        setItems(response.data);
        setSelectedItems([]); // Clear selected items when changing category
        setFeedbacks({}); // Reset feedbacks when changing category
    };

    const handleCheckboxChange = (itemId) => {
        setSelectedItems((prev) => {
            if (prev.includes(itemId)) {
                return prev.filter(id => id !== itemId);
            }
            return [...prev, itemId];
        });
    };

    const handleRatingChange = (itemId, rating) => {
        setFeedbacks((prev) => ({
            ...prev,
            [itemId]: { ...prev[itemId], rating } // Store the rating for the specific item
        }));
    };

    const handleFeedbackChange = (itemId, feedback) => {
        setFeedbacks((prev) => ({
            ...prev,
            [itemId]: { ...prev[itemId], feedback } // Store the feedback for the specific item
        }));
    };

    const handleSubmit = async () => {
        // Validation: Check if any items are selected
        if (selectedItems.length === 0) {
            alert("Please select at least one item.");
            return;
        }
    
        // Validation: Check if feedback data is complete for each selected item
        for (const itemId of selectedItems) {
            const itemFeedback = feedbacks[itemId]?.feedback || ''; // Default to empty string if undefined
            const itemRating = feedbacks[itemId]?.rating;
    
            if (itemRating === undefined || itemFeedback.trim() === '') {
                alert(`Please provide a rating and feedback for item ${itemId}.`);
                return;
            }
        }
    
        try {
            // Save feedback for each selected item
            for (const itemId of selectedItems) {
                await axios.post('http://localhost:5000/feedback', {
                    itemId,
                    rating: feedbacks[itemId].rating,
                    feedback: feedbacks[itemId].feedback,
                    date: new Date()
                });
            }
            // Reset form after submission
            setSelectedItems([]);
            setFeedbacks({}); // Clear feedbacks as well
            setItems([]); // Clear items
    
            alert("Feedback submitted successfully! Thank you!");
        } catch (error) {
            console.error("Error submitting feedback:", error);
            alert("An error occurred while submitting feedback. Please try again.");
        }
    };

    return (
        <div className="container mt-4">
            <h3 className="mb-4 text-center">FEEDBACK FROM</h3>
            <div className="mb-3">
                {categories.map(cat => (
                    <button key={cat._id} className="btn btn-primary me-2" onClick={() => handleCategoryClick(cat._id)}>
                        {cat.name}
                    </button>
                ))}
            </div>
            <div className="row " >
                {items.map(item => (
                    <div key={item._id} className="col-3 mb-3 ">
                        <div className="card p-3 "  >
                            <div className="form-check" >
                                <input 
                                    type="checkbox" 
                                    className="form-check-input" 
                                    checked={selectedItems.includes(item._id)} 
                                    onChange={() => handleCheckboxChange(item._id)} 
                                />
                                <label className="form-check-label fw-bold">{item.name}</label>
                            </div>
                            <div className="mt-2">
                            {/* <label className="form-label centered-label ">5 STAR RATINGS</label> */}
                            <h6 className="text-center">RATINGS</h6>
                                
                                <div>
                                    {[1, 2, 3, 4, 5].map(rating => (
                                        <div key={rating} className="form-check form-check-inline">
                                            <input 
                                                type="radio" 
                                                className="form-check-input" 
                                                name={`rating-${item._id}`} 
                                                onChange={() => handleRatingChange(item._id, rating)} 
                                            />
                                            
                                            <label className="form-check-label">{rating}</label>
                                            
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-2">
                                <textarea 
                                    className="form-control" 
                                    placeholder="Enter your feedback" 
                                    onChange={(e) => handleFeedbackChange(item._id, e.target.value)} 
                                    value={feedbacks[item._id]?.feedback || ''} // Ensure controlled input
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <button className="btn btn-success mt-3" onClick={handleSubmit}>Submit Feedback</button>
        </div>
    );
};

export default FeedbackForm;
