import React from 'react'

function CategoryCard({category}) {
  return (
    <div className='category-card'>
      <img src={category.imageUrl} alt={category.name} />
      <h3>{category.name}</h3>
      <p>{category.itemCount} items</p>
    </div>
  )
}

export default CategoryCard
