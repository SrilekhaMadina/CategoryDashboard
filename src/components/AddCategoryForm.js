import React, { useState } from 'react'
import { addCategory } from '../api/api'

function AddCategoryForm({ onCategoryAdded }) {
    const [name, setName] = useState('')
    const [itemCount, setItemCount] = useState(0)
    const [imageUrl, setImageUrl] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const newCategory = { name, itemCount, imageUrl }
            await addCategory(newCategory)
            onCategoryAdded(newCategory)
            setName('')
            setItemCount(0)
            setImageUrl('')
        } catch (error) {
            console.error('Error adding category:', error)
            alert('Failed to add category')
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Category Name:
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
            <label>
                Item Count:
                <input type="number" value={itemCount} onChange={(e) => setItemCount(parseInt(e.target.value))} required />
            </label>
            <label>
                Image URL:
                <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required />
            </label>
            <button type="submit">Add Category</button>
        </form>
    )
}

export default AddCategoryForm