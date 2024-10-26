import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function CategoryManager() {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [editCategoryId, setEditCategoryId] = useState(null);
    const [editName, setEditName] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    // Fetch all categories
    const fetchCategories = async () => {
        try {
            const response = await axios.get('https://mess-backend-30l4.onrender.com/categories');
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    // Add a new category
    const handleAddCategory = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://mess-backend-30l4.onrender.com/categories', { name });
            setCategories([...categories, response.data]);
            setName('');
        } catch (error) {
            console.error("Error adding category:", error);
        }
    };

    // Start editing a category
    const handleEditClick = (category) => {
        setEditCategoryId(category._id);
        setEditName(category.name);
    };

    // Update an existing category
    const handleUpdateCategory = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`https://mess-backend-30l4.onrender.com/categories/${editCategoryId}`, { name: editName });
            setCategories(categories.map((cat) => (cat._id === editCategoryId ? response.data : cat)));
            setEditCategoryId(null);
            setEditName('');
        } catch (error) {
            console.error("Error updating category:", error);
        }
    };

    // Delete a category
    const handleDeleteCategory = async (categoryId) => {
        try {
            await axios.delete(`https://mess-backend-30l4.onrender.com/categories/${categoryId}`);
            setCategories(categories.filter((category) => category._id !== categoryId));
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Category Manager</h2>

            {/* Add Category */}
            <form onSubmit={handleAddCategory} className="mb-3">
                <div className="input-group">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-control"
                        placeholder="Add new category"
                        required
                    />
                    <button type="submit" className="btn btn-primary">Add Category</button>
                </div>
            </form>

            {/* Edit Category */}
            {editCategoryId && (
                <form onSubmit={handleUpdateCategory} className="mb-3">
                    <div className="input-group">
                        <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="form-control"
                            placeholder="Update category name"
                            required
                        />
                        <button type="submit" className="btn btn-success">Update</button>
                        <button type="button" onClick={() => setEditCategoryId(null)} className="btn btn-secondary ms-2">Cancel</button>
                    </div>
                </form>
            )}

            {/* Category List */}
            <div className="row">
                {categories.map((category) => (
                    <div key={category._id} className="col-md-4 mb-3">
                        <div className="card h-100">
                            <div className="card-body">
                                <h5 className="card-title text-center">{category.name}</h5>
                                <table className="table">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <button onClick={() => handleEditClick(category)} className="btn btn-warning btn-sm">Edit</button>
                                            </td>
                                            <td>
                                                <button onClick={() => handleDeleteCategory(category._id)} className="btn btn-danger btn-sm">Delete</button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CategoryManager;
