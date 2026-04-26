import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCreateProductMutation, useUpdateProductMutation, useGetProductDetailsQuery } from '@/store/api/productsApiSlice';
import { useGetCategoriesQuery } from '@/store/api/categoriesApiSlice';
import { Package, Upload, X, Plus, Info, Tag, DollarSign, Layers, Image as ImageIcon, Loader2, ChevronLeft, ShieldCheck } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useSelector } from 'react-redux';

const SellerProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { data: productData, isLoading: isProductLoading } = useGetProductDetailsQuery(id, { skip: !isEdit });
  const { data: catData } = useGetCategoriesQuery();
  
  const [formData, setFormData] = useState({
    title: '', description: '', price: '', discountPrice: '', category: '', brand: '', stock: '', sku: '',
    images: [], specifications: {}, richDescription: ''
  });

  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isEdit && productData?.product) {
      const p = productData.product;
      setFormData({
        ...p,
        category: p.category?._id || p.category,
        specifications: p.specifications || {}
      });
    }
  }, [isEdit, productData]);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadPromises = files.map(file => {
        const fd = new FormData();
        fd.append('image', file);
        return axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/upload/image`,
          fd,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          }
        );
      });

      const results = await Promise.all(uploadPromises);
      const urls = results.map(r => r.data.url);
      setFormData(prev => ({ ...prev, images: [...prev.images, ...urls] }));
      toast.success(`${urls.length} image${urls.length > 1 ? 's' : ''} uploaded`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Upload failed. Check Cloudinary credentials.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index) => {
    setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) });
  };

  const addSpec = () => {
    if (specKey && specValue) {
      setFormData({
        ...formData,
        specifications: { ...formData.specifications, [specKey]: specValue }
      });
      setSpecKey('');
      setSpecValue('');
    }
  };

  const removeSpec = (key) => {
    const newSpecs = { ...formData.specifications };
    delete newSpecs[key];
    setFormData({ ...formData, specifications: newSpecs });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.images.length === 0) return toast.error('Add at least one image');
    
    try {
      if (isEdit) {
        await updateProduct({ id, ...formData }).unwrap();
        toast.success('Product updated!');
      } else {
        await createProduct(formData).unwrap();
        toast.success('Product listed successfully!');
      }
      navigate('/seller/products');
    } catch (err) {
      toast.error(err?.data?.message || 'Action failed');
    }
  };

  if (isEdit && isProductLoading) return <div className="container-custom py-20 text-center">Loading...</div>;

  return (
    <div className="container-custom py-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <button onClick={() => navigate(-1)} className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-primary hover:underline">
            <ChevronLeft size={16} /> Back
          </button>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h1>
        </div>
        <button type="submit" form="product-form" disabled={isCreating || isUpdating} className="btn-primary py-4 px-12 text-lg shadow-xl shadow-primary/20">
          {isCreating || isUpdating ? <Loader2 className="animate-spin mx-auto" /> : (isEdit ? 'Update Listing' : 'Publish Product')}
        </button>
      </div>

      <form id="product-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Main Info */}
        <div className="lg:col-span-8 space-y-8">
           
           <div className="card p-8 md:p-12 space-y-8">
              <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3"><Info className="text-primary" /> Basic Information</h3>
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500">Product Title</label>
                    <input type="text" className="input-field py-4 text-lg font-bold" placeholder="e.g. Premium Wireless Headphones v2" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-black uppercase tracking-widest text-gray-500">Category</label>
                       <select className="input-field" required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                          <option value="">Select Category</option>
                          {catData?.categories?.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black uppercase tracking-widest text-gray-500">Brand Name</label>
                       <input type="text" className="input-field" placeholder="e.g. Sony" value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500">Short Description</label>
                    <textarea className="input-field h-32 py-4" placeholder="Briefly describe your product..." required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                 </div>
              </div>
           </div>

           {/* Pricing & Inventory */}
           <div className="card p-8 md:p-12 space-y-8">
              <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3"><DollarSign className="text-primary" /> Pricing & Inventory</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500">Regular Price (₹)</label>
                    <input type="number" className="input-field" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500">Discounted Price (₹)</label>
                    <input type="number" className="input-field" value={formData.discountPrice} onChange={(e) => setFormData({...formData, discountPrice: e.target.value})} />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500">Stock Quantity</label>
                    <input type="number" className="input-field" required value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500">SKU / Model Number</label>
                    <input type="text" className="input-field" placeholder="e.g. WD-1002" value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})} />
                 </div>
              </div>
           </div>

           {/* Specifications */}
           <div className="card p-8 md:p-12 space-y-8">
              <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3"><Layers className="text-primary" /> Technical Specs</h3>
              <div className="space-y-6">
                 <div className="flex gap-4">
                    <input type="text" className="input-field flex-grow" placeholder="Key (e.g. Battery Life)" value={specKey} onChange={(e) => setSpecKey(e.target.value)} />
                    <input type="text" className="input-field flex-grow" placeholder="Value (e.g. 40 Hours)" value={specValue} onChange={(e) => setSpecValue(e.target.value)} />
                    <button type="button" onClick={addSpec} className="btn-secondary py-3 px-6"><Plus size={20} /></button>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(formData.specifications).map(([k, v]) => (
                      <div key={k} className="p-4 bg-light-darker dark:bg-dark rounded-xl flex justify-between items-center group">
                         <div>
                            <p className="text-[10px] font-black uppercase text-gray-400">{k}</p>
                            <p className="text-sm font-bold">{v}</p>
                         </div>
                         <button type="button" onClick={() => removeSpec(k)} className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><X size={16} /></button>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

        </div>

        {/* Media & Side */}
        <div className="lg:col-span-4 space-y-8">
           
           <div className="card p-8 space-y-8">
              <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3"><ImageIcon className="text-primary" /> Product Media</h3>
              <div className="space-y-4">
                 <label className="w-full aspect-video rounded-2xl border-2 border-dashed border-light-darkest dark:border-dark-lightest flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group">
                    {isUploading ? <Loader2 className="animate-spin text-primary" size={32} /> : (
                      <>
                        <Upload className="text-gray-400 group-hover:text-primary mb-2" size={32} />
                        <span className="text-xs font-black uppercase tracking-widest text-gray-400 group-hover:text-primary">Click to Upload Images</span>
                      </>
                    )}
                    <input type="file" multiple className="hidden" onChange={handleImageUpload} accept="image/*" />
                 </label>

                 <div className="grid grid-cols-2 gap-3">
                    {formData.images.map((img, i) => (
                      <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                         <img src={img} alt="" className="w-full h-full object-cover" />
                         <button 
                          type="button" 
                          onClick={() => removeImage(i)}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                         >
                           <X size={14} />
                         </button>
                         {i === 0 && <span className="absolute bottom-2 left-2 bg-primary text-white text-[8px] font-black px-2 py-0.5 rounded uppercase">Thumbnail</span>}
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           <div className="bg-dark text-white p-8 rounded-3xl space-y-6">
              <h4 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-primary">
                 <ShieldCheck size={18} /> Listing Guidelines
              </h4>
              <ul className="text-[10px] font-bold space-y-4 text-gray-400 uppercase tracking-widest">
                 <li className="flex gap-3"><span className="text-primary">01</span> High quality clear images are required.</li>
                 <li className="flex gap-3"><span className="text-primary">02</span> Accurately describe all product features.</li>
                 <li className="flex gap-3"><span className="text-primary">03</span> Proper category selection helps visibility.</li>
                 <li className="flex gap-3"><span className="text-primary">04</span> Stock should be updated regularly.</li>
              </ul>
           </div>

        </div>

      </form>
    </div>
  );
};

export default SellerProductForm;
