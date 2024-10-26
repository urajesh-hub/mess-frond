import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function ItemManager() {
    const [items, setItems] = useState([]);
    const [name, setName] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]);
    const [editingItem, setEditingItem] = useState(null);

    useEffect(() => {
        fetchItems();
        fetchCategories();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await axios.get('http://localhost:5000/items');
            setItems(response.data);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:5000/categories');
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/items', { name, categoryId });
            setItems([...items, response.data]);
            resetForm();
        } catch (error) {
            console.error("Error adding item:", error);
        }
    };

    const handleEditItem = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:5000/items/${editingItem._id}`, { name, categoryId });
            setItems(items.map(item => item._id === editingItem._id ? response.data : item));
            resetForm();
        } catch (error) {
            console.error("Error updating item:", error);
        }
    };

    const handleDeleteItem = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this item?");
        if (!confirmDelete) return; // If the user cancels, do not proceed

        try {
            await axios.delete(`http://localhost:5000/items/${id}`);
            setItems(items.filter(item => item._id !== id));
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    const resetForm = () => {
        setName('');
        setCategoryId('');
        setEditingItem(null);
    };

    const handleEditButtonClick = (item) => {
        setName(item.name);
        setCategoryId(item.categoryId);
        setEditingItem(item);
    };

    const groupedItems = {
        breakfast: items.filter(item => item.categoryId === categories.find(cat => cat.name === 'Breakfast')?._id),
        lunch: items.filter(item => item.categoryId === categories.find(cat => cat.name === 'Lunch')?._id),
        dinner: items.filter(item => item.categoryId === categories.find(cat => cat.name === 'Dinner')?._id),
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Item Manager</h2>

            {/* Add or Edit Item Form */}
            <form onSubmit={editingItem ? handleEditItem : handleAddItem} className="mb-4">
                <div className="form-row align-items-end">
                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter item name"
                            required
                        />
                    </div>
                    <div className="col-md-4">
                        <select
                            className="form-control"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-4">
                        <button type="submit" className="btn btn-primary">{editingItem ? 'Update Item' : 'Add New Item'}</button>
                    </div>
                </div>
            </form>

            {/* Render Breakfast Items */}
            <h3>Breakfast</h3>
            <div className="row mb-4">
                {groupedItems.breakfast.map((item) => (
                    <div className="col-md-2" key={item._id}>
                        <div className="card mb-3">
                            <div className="card-body">
                                <h5 className="card-title">{item.name}</h5>
                                <button className="btn btn-warning btn-sm mr-2" onClick={() => handleEditButtonClick(item)}>Edit</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteItem(item._id)}>Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Render Lunch Items */}
            <h3>Lunch</h3>
            <div className="row mb-4">
                {groupedItems.lunch.map((item) => (
                    <div className="col-md-2" key={item._id}>
                        <div className="card mb-3">
                            <div className="card-body">
                                <h5 className="card-title">{item.name}</h5>
                                <button className="btn btn-warning btn-sm mr-2" onClick={() => handleEditButtonClick(item)}>Edit</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteItem(item._id)}>Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Render Dinner Items */}
            <h3>Dinner</h3>
            <div className="row mb-4">
                {groupedItems.dinner.map((item) => (
                    <div className="col-md-2" key={item._id}>
                        <div className="card mb-3">
                            <div className="card-body">
                                <h5 className="card-title">{item.name}</h5>
                                <button className="btn btn-warning btn-sm mr-2" onClick={() => handleEditButtonClick(item)}>Edit</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteItem(item._id)}>Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ItemManager;
