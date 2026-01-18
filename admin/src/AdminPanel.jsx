import React, { useState, useEffect } from 'react';
import {
    getCategories, createCategory, updateCategory, deleteCategory,
    getPackages, createPackage, updatePackage, deletePackage,
    createForm, updateForm, deleteForm,
    createButton, updateButton, deleteButton
} from './api';
import { LayoutGrid, Package as PackageIcon, Plus, Trash2, Edit2, ChevronRight, Save, X, FileText, FormInput, MousePointer2 } from 'lucide-react';
import './AdminPanel.css';

const CategoryNode = ({ category, allCategories, allPackages, level, onEdit, onDelete, expandedNodes, onToggle }) => {
    const subCats = allCategories.filter(c => c.parentId === category.id);
    const subPkgs = allPackages.filter(pkg => pkg.categoryId === category.id);
    const isRoot = !category.parentId;
    const isExpanded = !!expandedNodes[category.id];

    return (
        <div className={`category-node level-${level} ${isRoot ? 'root-node' : ''} ${isExpanded ? 'expanded' : 'collapsed'}`}>
            <div className="category-header">
                <button className={`toggle-btn ${isExpanded ? 'active' : ''}`} onClick={() => onToggle(category.id)}>
                    <ChevronRight size={18} className="header-icon" />
                </button>
                {isRoot && <LayoutGrid size={22} className="header-icon root-icon" />}
                <span className="category-name" onClick={() => onToggle(category.id)}>{category.name}</span>
                <div className="header-actions">
                    <button className="btn-icon" onClick={() => onEdit('package', { categoryId: category.id })} title="Add Package">
                        <Plus size={14} />
                    </button>
                    <button className="btn-icon" onClick={() => onEdit('category', { parentId: category.id })} title="Add Sub-category">
                        <LayoutGrid size={14} />
                    </button>
                    <button className="btn-icon" onClick={() => onEdit('category', category)} title="Edit Category Name/Prompt">
                        <Edit2 size={14} />
                    </button>
                    <button className="btn-icon btn-danger" onClick={() => onDelete('category', category.id)} title="Delete Category">
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            {isExpanded && (
                <div className="category-content">
                    {/* Render Packages directly in this category */}
                    {subPkgs.length > 0 && (
                        <div className="package-list">
                            <table className="glass-table">
                                <thead>
                                    <tr>
                                        <th>Package Name</th>
                                        <th>Price</th>
                                        <th>Callback</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subPkgs.map(pkg => (
                                        <tr key={pkg.id}>
                                            <td>{pkg.name}</td>
                                            <td>{pkg.price}</td>
                                            <td><code>{pkg.callbackData}</code></td>
                                            <td className="actions">
                                                <button className="btn-icon" onClick={() => onEdit('package', pkg)}><Edit2 size={14} /></button>
                                                <button className="btn-icon btn-danger" onClick={() => onDelete('package', pkg.id)}><Trash2 size={14} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Recursively render Sub-categories */}
                    {subCats.length > 0 && (
                        <div className="sub-categories">
                            {subCats.map(sub => (
                                <CategoryNode
                                    key={sub.id}
                                    category={sub}
                                    allCategories={allCategories}
                                    allPackages={allPackages}
                                    level={level + 1}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    expandedNodes={expandedNodes}
                                    onToggle={onToggle}
                                />
                            ))}
                        </div>
                    )}

                    {subCats.length === 0 && subPkgs.length === 0 && (
                        <p className="empty-state">No content in this category</p>
                    )}
                </div>
            )}
        </div>
    );
};

const AdminPanel = () => {
    const [categories, setCategories] = useState([]);
    const [packages, setPackages] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [modalType, setModalType] = useState('category');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [expandedNodes, setExpandedNodes] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const cats = await getCategories();
            const pkgs = await getPackages();
            setCategories(cats.data);
            setPackages(pkgs.data);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };

    const handleOpenModal = (type, item = null) => {
        setModalType(type);
        if (item) {
            if (type === 'content') {
                setEditingItem(item);
                setFormData({
                    textContent: item.textContent || '',
                    mediaUrl: item.mediaUrl || '',
                    mediaType: item.mediaType || 'image'
                });
            } else if (type === 'form' || type === 'buttons') {
                setEditingItem(item);
                setFormData({});
            } else if (item.id) {
                setEditingItem(item);
                setFormData({
                    name: item.name || '',
                    parentId: item.parentId || '',
                    description: item.description || ''
                });
            } else {
                setEditingItem(null);
                setFormData(type === 'category' ?
                    { name: '', parentId: item.parentId || '', description: '' } :
                    { name: '', price: '', callbackData: '', categoryId: item.categoryId || '' }
                );
            }
        } else {
            setEditingItem(null);
            setFormData(type === 'category' ? { name: '', parentId: '', description: '' } : { name: '', price: '', callbackData: '', categoryId: '' });
        }
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        try {
            if (modalType === 'category') {
                if (editingItem) {
                    await updateCategory(editingItem.id, formData);
                } else {
                    await createCategory(formData);
                }
            } else if (modalType === 'content') {
                await updateCategory(editingItem.id, formData);
            } else if (modalType === 'package') {
                const normalizedData = {
                    ...formData,
                    callbackData: formData.callbackData?.startsWith('pkg_') ? formData.callbackData : `pkg_${formData.callbackData}`
                };
                if (editingItem) {
                    await updatePackage(editingItem.id, normalizedData);
                } else {
                    await createPackage(normalizedData);
                }
            }
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            alert("Failed to save: " + (error.response?.data?.message || error.message));
        }
    };

    const handleDelete = async (type, id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            if (type === 'category') {
                await deleteCategory(id);
            } else {
                await deletePackage(id);
            }
            fetchData();
        } catch (error) {
            alert("Failed to delete");
        }
    };

    const handleToggleNode = (id) => {
        setExpandedNodes(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return (
        <div className="admin-container">
            <main className="content">
                <header className="content-header">
                    <h1>Bot Content Manager</h1>
                    <button className="btn-primary" onClick={() => handleOpenModal('category')}>
                        <Plus size={18} />
                        <span>Add Category</span>
                    </button>
                </header>

                <section className="table-section">
                    <div className="grouped-content">
                        {categories.filter(c => !c.parentId).map(root => (
                            <CategoryNode
                                key={root.id}
                                category={root}
                                allCategories={categories}
                                allPackages={packages}
                                level={0}
                                onEdit={handleOpenModal}
                                onDelete={handleDelete}
                                expandedNodes={expandedNodes}
                                onToggle={handleToggleNode}
                            />
                        ))}
                        {categories.filter(c => !c.parentId).length === 0 && (
                            <p className="empty-state">No categories found. Start by adding a root category.</p>
                        )}
                    </div>
                </section>
            </main>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <header>
                            <h3>
                                {modalType === 'category' && `${editingItem ? 'Edit' : 'Add'} Category`}
                                {modalType === 'package' && `${editingItem ? 'Edit' : 'Add'} Package`}
                                {modalType === 'content' && `Manage Content: ${editingItem?.name}`}
                                {modalType === 'form' && `Forms & Inputs: ${editingItem?.name}`}
                                {modalType === 'buttons' && `Custom Buttons: ${editingItem?.name}`}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
                        </header>
                        <div className="modal-body">
                            {modalType === 'category' && (
                                <>
                                    <div className="form-group">
                                        <label>Category Name</label>
                                        <input
                                            type="text"
                                            value={formData.name || ''}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g. MLBB"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Parent Category</label>
                                        <select
                                            value={formData.parentId || ''}
                                            onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                                        >
                                            <option value="">None (Root)</option>
                                            {categories.filter(c => c.id !== editingItem?.id).map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Welcome Prompt (Description)</label>
                                        <textarea
                                            rows={3}
                                            className="glass-input"
                                            value={formData.description || ''}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="The text shown when this category is selected..."
                                        />
                                    </div>
                                </>
                            )}

                            {modalType === 'package' && (
                                <>
                                    <div className="form-group">
                                        <label>Package Name</label>
                                        <input
                                            type="text"
                                            value={formData.name || ''}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g. Dia 50 + 50 Bonus"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Price</label>
                                        <input
                                            type="text"
                                            value={formData.price || ''}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            placeholder="e.g. 4000 Ks"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Category</label>
                                        <select
                                            value={formData.categoryId || ''}
                                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Callback Data (no need to add pkg_ prefix)</label>
                                        <input
                                            type="text"
                                            value={formData.callbackData?.replace('pkg_', '') || ''}
                                            onChange={(e) => setFormData({ ...formData, callbackData: e.target.value })}
                                            placeholder="e.g. dia50"
                                        />
                                    </div>
                                </>
                            )}

                            {modalType === 'content' && (
                                <>
                                    <div className="form-group">
                                        <label>Rich Text Content (High Priority)</label>
                                        <textarea
                                            rows={6}
                                            className="glass-input"
                                            value={formData.textContent || ''}
                                            onChange={(e) => setFormData({ ...formData, textContent: e.target.value })}
                                            placeholder="Markdown supported. Use {name} for user name..."
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Media URL</label>
                                        <input
                                            type="text"
                                            value={formData.mediaUrl || ''}
                                            onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
                                            placeholder="https://example.com/image.png"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Media Type</label>
                                        <select
                                            value={formData.mediaType || 'image'}
                                            onChange={(e) => setFormData({ ...formData, mediaType: e.target.value })}
                                        >
                                            <option value="image">Image</option>
                                            <option value="video">Video</option>
                                            <option value="document">Document</option>
                                        </select>
                                    </div>
                                </>
                            )}

                            {modalType === 'form' && (
                                <div className="list-manager">
                                    <table className="glass-table slim">
                                        <thead>
                                            <tr>
                                                <th>Label</th>
                                                <th>Placeholder</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {editingItem.forms?.map(f => (
                                                <tr key={f.id}>
                                                    <td>{f.label}</td>
                                                    <td>{f.placeholder || '-'}</td>
                                                    <td>
                                                        <button className="btn-icon btn-danger" onClick={async () => {
                                                            await deleteForm(f.id);
                                                            const updated = await getCategories();
                                                            setCategories(updated.data);
                                                            setEditingItem(updated.data.find(c => c.id === editingItem.id));
                                                        }}><Trash2 size={12} /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="add-quick-form">
                                        <input type="text" placeholder="Label" id="qf-label" />
                                        <input type="text" placeholder="Placeholder" id="qf-holder" />
                                        <button className="btn-icon" onClick={async () => {
                                            const label = document.getElementById('qf-label').value;
                                            const placeholder = document.getElementById('qf-holder').value;
                                            if (!label) return;
                                            await createForm({ categoryId: editingItem.id, label, placeholder });
                                            const updated = await getCategories();
                                            setCategories(updated.data);
                                            setEditingItem(updated.data.find(c => c.id === editingItem.id));
                                            document.getElementById('qf-label').value = '';
                                            document.getElementById('qf-holder').value = '';
                                        }}><Plus size={14} /></button>
                                    </div>
                                </div>
                            )}

                            {modalType === 'buttons' && (
                                <div className="list-manager">
                                    <table className="glass-table slim">
                                        <thead>
                                            <tr>
                                                <th>Text</th>
                                                <th>Type</th>
                                                <th>Action</th>
                                                <th>Del</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {editingItem.buttons?.map(b => (
                                                <tr key={b.id}>
                                                    <td title={b.text}>{b.text}</td>
                                                    <td>{b.type}</td>
                                                    <td><code>{b.action}</code></td>
                                                    <td>
                                                        <button className="btn-icon btn-danger" onClick={async () => {
                                                            await deleteButton(b.id);
                                                            const updated = await getCategories();
                                                            setCategories(updated.data);
                                                            setEditingItem(updated.data.find(c => c.id === editingItem.id));
                                                        }}><Trash2 size={12} /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="add-quick-form">
                                        <input type="text" placeholder="Text" id="qb-text" />
                                        <select id="qb-type">
                                            <option value="inline">Inline</option>
                                            <option value="standard">Std (Link)</option>
                                            <option value="reply">Reply Key</option>
                                        </select>
                                        <input type="text" placeholder="Action" id="qb-action" />
                                        <button className="btn-icon" onClick={async () => {
                                            const text = document.getElementById('qb-text').value;
                                            const type = document.getElementById('qb-type').value;
                                            const action = document.getElementById('qb-action').value;
                                            if (!text || !action) return;
                                            await createButton({ categoryId: editingItem.id, text, type, action });
                                            const updated = await getCategories();
                                            setCategories(updated.data);
                                            setEditingItem(updated.data.find(c => c.id === editingItem.id));
                                            document.getElementById('qb-text').value = '';
                                            document.getElementById('qb-action').value = '';
                                        }}><Plus size={14} /></button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <footer>
                            <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            {['category', 'package', 'content'].includes(modalType) && (
                                <button className="btn-primary" onClick={handleSave}>
                                    <Save size={18} />
                                    <span>Save Changes</span>
                                </button>
                            )}
                            {['form', 'buttons'].includes(modalType) && (
                                <button className="btn-primary" onClick={() => setIsModalOpen(false)}>
                                    <Save size={18} />
                                    <span>Done</span>
                                </button>
                            )}
                        </footer>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
