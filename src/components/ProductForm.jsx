import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Other'];

const ProductForm = ({ onAdd, onUpdate, editProduct }) => {
  const [form, setForm] = useState({
    name: '', price: '', category: 'Electronics',
    stock: '', description: '', image: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editProduct) setForm(editProduct);
  }, [editProduct]);

  const validate = () => {
    const errs = {};
    if (!form.name || form.name.length < 3) errs.name = 'Name must be at least 3 characters';
    if (form.name.length > 50) errs.name = 'Name must be at most 50 characters';
    if (!form.price || Number(form.price) <= 0) errs.price = 'Price must be positive';
    if (!/^\d+(\.\d{1,2})?$/.test(form.price)) errs.price = 'Max 2 decimal places allowed';
    if (!form.stock || Number(form.stock) < 0) errs.stock = 'Stock must be non-negative';
    if (form.description.length > 200) errs.description = 'Max 200 characters';
   
    if (
      form.image &&
      !/^https?:\/\/|^data:image\/[a-zA-Z]+;base64,/.test(form.image)
    ) errs.image = 'Invalid URL';
    return errs;
  };

  const handleCancel = () => {
    setForm({ name: '', price: '', category: 'Electronics', stock: '', description: '', image: '' });
    setErrors({});
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    const product = { ...form, id: form.id || Date.now() };
    if (form.id) {
      onUpdate(product);
      Swal.fire({
        icon: 'success',
        title: 'Product updated!',
        timer: 1200,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    } else {
      // Show confirmation popup before adding product
      Swal.fire({
        title: 'Add Product',
        text: 'Are you sure you want to add this product?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Add',
        cancelButtonText: 'Cancel'
      }).then(result => {
        if (result.isConfirmed) {
          onAdd(product);
          Swal.fire({
            icon: 'success',
            title: 'Product added!',
            timer: 1200,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
          });
          setForm({ name: '', price: '', category: 'Electronics', stock: '', description: '', image: '' });
          setErrors({});
        }
      });
      return;
    }
    setForm({ name: '', price: '', category: 'Electronics', stock: '', description: '', image: '' });
    setErrors({});
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card max-w-lg mx-auto"
      style={{ marginBottom: '2rem' }}
    >
      <label htmlFor="name">Name</label>
      <input
        id="name"
        className="w-full border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition p-2 bg-white text-slate-800"
        placeholder="Name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
      />
      {errors.name && <div className="error">{errors.name}</div>}
      <label htmlFor="price">Price</label>
      <input
        id="price"
        type="number"
        className="w-full border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition p-2 bg-white text-slate-800"
        placeholder="Price"
        value={form.price}
        onChange={e => setForm({ ...form, price: e.target.value })}
      />
      {errors.price && <div className="error">{errors.price}</div>}
      <label htmlFor="category">Category</label>
      <select
        id="category"
        className="w-full border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition p-2 bg-white text-slate-800"
        value={form.category}
        onChange={e => setForm({ ...form, category: e.target.value })}
      >
        {categories.map(c => <option key={c}>{c}</option>)}
      </select>
      <label htmlFor="stock">Stock</label>
      <input
        id="stock"
        type="number"
        className="w-full border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition p-2 bg-white text-slate-800"
        placeholder="Stock"
        value={form.stock}
        onChange={e => setForm({ ...form, stock: e.target.value })}
      />
      {errors.stock && <div className="error">{errors.stock}</div>}
      <label htmlFor="description">Description</label>
      <textarea
        id="description"
        className="w-full border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition p-2 bg-white text-slate-800"
        maxLength="200"
        placeholder="Description"
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
      />
      <div style={{ textAlign: 'right', fontSize: '0.9em', color: '#6366f1', marginBottom: '0.5rem' }}>
        {form.description.length}/200
      </div>
      <label htmlFor="image">Image URL</label>
      <input
        id="image"
        className="w-full border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition p-2 bg-white text-slate-800"
        placeholder="Image URL"
        value={form.image}
        onChange={e => setForm({ ...form, image: e.target.value })}
      />
      {errors.image && <div className="error">{errors.image}</div>}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <button
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md font-semibold transition"
          type="submit"
        >
          {form.id ? 'Update' : 'Add'} Product
        </button>
        {form.id && (
          <button
            type="button"
            onClick={handleCancel}
            style={{
              background: '#e5e7eb',
              color: '#23235b',
              boxShadow: 'none'
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ProductForm;
