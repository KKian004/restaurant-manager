import { useState, useEffect } from 'react'
import { Menu, ShoppingCart, Receipt, History, Plus, Trash2, Edit, Printer, X, Utensils, Sparkles } from 'lucide-react'
import { db } from './firebase'
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore'

// Initial menu data based on YUMI BOWL EST 2026 menu
const initialMenu = [
  // Signature Bowls
  { id: 1, name: 'OG Soul Bowl', price: 750, category: 'Signature Bowls', image: '/OG soup.png' },
  { id: 2, name: 'Sticky Honey Heat', price: 850, category: 'Signature Bowls', image: '/Sticky honey heat.png' },
  { id: 3, name: 'Hot Girl Mac', price: 750, category: 'Signature Bowls', image: '/Hot Girl Mac.png' },
  { id: 4, name: 'Lemon Herb Crunch', price: 850, category: 'Signature Bowls', image: '/Lemon Herb Crunch.png' },
  { id: 5, name: 'The BBQ Drip', price: 950, category: 'Signature Bowls', image: '/The BBQ drip.jpg' },
  // Mojitos
  { id: 6, name: 'Strawberry Sunrise Mojito', price: 500, category: 'Mojitos', image: '/Strawberry mojito.jpg.jpeg' },
  { id: 7, name: 'Classic Mojito', price: 500, category: 'Mojitos', image: '/Classic mojito.jpeg' },
  { id: 8, name: 'Passion Mojito', price: 500, category: 'Mojitos', image: '/passion mojito.png' },
  { id: 9, name: 'Cucumber Kiwi Mojito', price: 500, category: 'Mojitos', image: '/cucumber mojito.png' },
  // Sauce Line Up
  { id: 10, name: 'House Cheese Drip', price: 0.00, category: 'Sauce Line Up', image: '/House cheese drip.png' },
  { id: 11, name: 'Honey Butter Glaze', price: 0.00, category: 'Sauce Line Up', image: '/Honey Butter Glaze.png' },
  { id: 12, name: 'Spicy Mayo', price: 0.00, category: 'Sauce Line Up', image: '/Spicy Mayo.png' },
  { id: 13, name: 'Peri Peri Sauce', price: 0.00, category: 'Sauce Line Up', image: '/Peri peri sauce.png' },
  { id: 14, name: 'Smoky BBQ Drip', price: 0.00, category: 'Sauce Line Up', image: '/smoky bbq drip.png' },
  { id: 15, name: 'Lemon Herb Sauce', price: 0.00, category: 'Sauce Line Up', image: '/Lemon Herb sauce.png' },
  // Extra Sauces
  { id: 16, name: 'Extra Cheese', price: 150, category: 'Extra Sauces', image: '/Extra cheese.jpeg' },
  { id: 17, name: 'Chili Oil', price: 150, category: 'Extra Sauces', image: '/Chilli oil.jpeg' },
  { id: 18, name: 'Signature Sauce', price: 150, category: 'Extra Sauces', image: '/Signature sauce.jpeg' },
]

function App() {
  const [activeTab, setActiveTab] = useState('orders')
  const [menu, setMenu] = useState(initialMenu)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentOrder, setCurrentOrder] = useState([])
  const [showAddItem, setShowAddItem] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [newItem, setNewItem] = useState({ name: '', price: '', category: 'Main' })
  const [selectedCategory, setSelectedCategory] = useState('Signature Bowls')
  const [orderCategory, setOrderCategory] = useState('Signature Bowls')

  // Load data from Firebase
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load menu
      const menuSnapshot = await getDocs(collection(db, 'menu'))
      if (!menuSnapshot.empty) {
        const menuData = menuSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setMenu(menuData)
      }
      
      // Load orders
      const ordersSnapshot = await getDocs(query(collection(db, 'orders'), orderBy('date', 'desc')))
      const ordersData = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setOrders(ordersData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['Signature Bowls', 'Mojitos', 'Sauce Line Up', 'Extra Sauces']

  // Menu Management Functions
  const handleAddItem = async () => {
    if (newItem.name && newItem.price) {
      try {
        const item = {
          name: newItem.name,
          price: parseFloat(newItem.price),
          category: newItem.category
        }
        await addDoc(collection(db, 'menu'), item)
        await loadData()
        setNewItem({ name: '', price: '', category: 'Main' })
        setShowAddItem(false)
      } catch (error) {
        console.error('Error adding item:', error)
      }
    }
  }

  const handleEditItem = (item) => {
    setEditingItem(item)
    setNewItem({ name: item.name, price: item.price.toString(), category: item.category })
    setShowAddItem(true)
  }

  const handleUpdateItem = async () => {
    if (editingItem && newItem.name && newItem.price) {
      try {
        const itemRef = doc(db, 'menu', editingItem.id)
        await updateDoc(itemRef, {
          name: newItem.name,
          price: parseFloat(newItem.price),
          category: newItem.category
        })
        await loadData()
        setEditingItem(null)
        setNewItem({ name: '', price: '', category: 'Main' })
        setShowAddItem(false)
      } catch (error) {
        console.error('Error updating item:', error)
      }
    }
  }

  const handleDeleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, 'menu', id))
      await loadData()
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  // Order Functions
  const addToOrder = (item) => {
    const existingItem = currentOrder.find(o => o.id === item.id)
    if (existingItem) {
      setCurrentOrder(currentOrder.map(o => 
        o.id === item.id ? { ...o, quantity: o.quantity + 1 } : o
      ))
    } else {
      setCurrentOrder([...currentOrder, { ...item, quantity: 1 }])
    }
  }

  const removeFromOrder = (id) => {
    setCurrentOrder(currentOrder.filter(item => item.id !== id))
  }

  const updateQuantity = (id, delta) => {
    setCurrentOrder(currentOrder.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + delta)
        return { ...item, quantity: newQuantity }
      }
      return item
    }))
  }

  const getOrderTotal = () => {
    return currentOrder.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const submitOrder = async () => {
    if (currentOrder.length === 0) return
    
    try {
      const order = {
        items: currentOrder,
        total: getOrderTotal(),
        date: new Date().toISOString()
      }
      await addDoc(collection(db, 'orders'), order)
      await loadData()
      setCurrentOrder([])
    } catch (error) {
      console.error('Error submitting order:', error)
    }
  }

  const printReceipt = (order) => {
    const receiptWindow = window.open('', '_blank')
    receiptWindow.document.write(`
      <html>
        <head>
          <title>Receipt #${order.id}</title>
          <style>
            body { font-family: monospace; padding: 20px; max-width: 300px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 20px; }
            .item { display: flex; justify-content: space-between; margin: 5px 0; }
            .total { border-top: 1px solid #000; margin-top: 10px; padding-top: 10px; font-weight: bold; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>YUMI BOWL CHEESE BAR</h2>
            <p>Receipt #${order.id}</p>
            <p>${new Date(order.date).toLocaleString()}</p>
          </div>
          ${order.items.map(item => `
            <div class="item">
              <span>${item.name} x${item.quantity}</span>
              <span>KSH ${(item.price * item.quantity).toLocaleString()}</span>
            </div>
          `).join('')}
          <div class="total">
            <div class="item">
              <span>TOTAL</span>
              <span>KSH ${order.total.toLocaleString()}</span>
            </div>
          </div>
          <div class="footer">
            <p>Thank you for dining with us!</p>
          </div>
        </body>
      </html>
    `)
    receiptWindow.document.close()
    receiptWindow.print()
  }

  const groupedMenu = categories.reduce((acc, category) => {
    acc[category] = menu.filter(item => item.category === category)
    return acc
  }, {})

  // Background images mapping
  const categoryBackgrounds = {
    'Signature Bowls': '/Signature Bowls.png',
    'Mojitos': '/Mojito background.png',
    'Sauce Line Up': '/Sauce line up background.png',
    'Extra Sauces': '/Menu Background.png'
  }

  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <header className="glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-center relative">
            {/* Japanese decorative pattern */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
              <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.03) 10px, rgba(0,0,0,0.03) 20px)' }}></div>
            </div>
            <div className="flex flex-col items-center relative z-10">
              <div className="text-xs text-amber-600 mb-1 tracking-[0.3em] uppercase font-medium">ゆみ</div>
              <div className="text-4xl font-black text-gray-800 tracking-wider uppercase" style={{ fontFamily: 'sans-serif', letterSpacing: '0.1em' }}>Yumi</div>
              <div className="text-xl font-bold text-amber-700 tracking-wide uppercase" style={{ fontFamily: 'sans-serif', letterSpacing: '0.15em' }}>BOWL</div>
              <div className="text-sm font-semibold text-gray-600 tracking-[0.2em] uppercase" style={{ fontFamily: 'sans-serif' }}>CHEESE BAR</div>
            </div>
            <div className="mt-2 flex items-center space-x-2 relative z-10">
              <div className="w-8 h-px bg-amber-400"></div>
              <Sparkles size={16} className="text-amber-500" />
              <div className="w-8 h-px bg-amber-400"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="glass border-b border-amber-200/30 sticky top-24 z-40">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex space-x-2 bg-amber-50/50 p-1.5 rounded-2xl">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 ${
                activeTab === 'orders' 
                  ? 'bg-white text-gray-800 shadow-md border border-amber-200' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white/70'
              }`}
            >
              <ShoppingCart size={20} />
              <span className="font-medium">New Order</span>
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 ${
                activeTab === 'menu' 
                  ? 'bg-white text-gray-800 shadow-md border border-amber-200' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white/70'
              }`}
            >
              <Menu size={20} />
              <span className="font-medium">Menu</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 ${
                activeTab === 'history' 
                  ? 'bg-white text-gray-800 shadow-md border border-amber-200' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white/70'
              }`}
            >
              <History size={20} />
              <span className="font-medium">History</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6 pb-24 relative">
        {/* Japanese decorative border */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-50"></div>
        
        {/* Faded background image */}
        {activeTab === 'menu' && categoryBackgrounds[selectedCategory] && (
          <div 
            className="absolute inset-0 z-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `url(${categoryBackgrounds[selectedCategory]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
        )}
        
        {/* iPad landscape optimizations */}
        <style>{`
          @media (min-width: 768px) and (orientation: landscape) {
            .grid-cols-1.lg\:grid-cols-3 {
              grid-template-columns: 2fr 1fr;
            }
            .max-h-96 {
              max-height: calc(100vh - 400px);
            }
          }
          @media (min-width: 1024px) and (orientation: landscape) {
            .grid-cols-1.md\:grid-cols-2 {
              grid-template-columns: repeat(3, 1fr);
            }
          }
        `}</style>
        {activeTab === 'orders' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 slide-up">
            {/* Menu Items */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                <span className="text-gray-800">Menu Items</span>
                <Sparkles size={18} className="text-stone-500" />
              </h2>
              {/* Category Navigation for Orders */}
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setOrderCategory(category)}
                    className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                      orderCategory === category
                        ? 'bg-amber-600 text-white shadow-md'
                        : 'bg-white text-gray-600 hover:bg-amber-50 border border-amber-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {menu
                  .filter(item => item.category === orderCategory)
                  .map(item => (
                    <button
                      key={item.id}
                      onClick={() => addToOrder(item)}
                      className="w-full flex justify-between items-center p-4 bg-white hover:bg-amber-50/50 rounded-2xl transition-all duration-300 hover:scale-[1.01] active:scale-95 border border-amber-100 hover:border-amber-300 shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-center space-x-3">
                        {item.image && (
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-amber-100 flex-shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                          </div>
                        )}
                        <span className="font-medium text-gray-700">{item.name}</span>
                      </div>
                      <span className="text-lg font-semibold text-amber-800">
                        KSH {item.price.toLocaleString()}
                      </span>
                    </button>
                  ))}
              </div>
            </div>

            {/* Current Order */}
            <div className="card sticky top-32 lg:col-span-1">
              <div className="card sticky top-24 slide-up">
                <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                  <span className="text-gray-800">Current Order</span>
                  <ShoppingCart size={20} className="text-stone-500" />
                </h2>
                {currentOrder.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
                      <ShoppingCart size={32} className="text-gray-500" />
                    </div>
                    <p className="text-gray-400">No items in order</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 max-h-96 overflow-y-auto mb-4 pr-2" style={{ maxHeight: 'calc(100vh - 500px)' }}>
                      {currentOrder.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-white/70 rounded-2xl border border-amber-100">
                          <div className="flex items-center space-x-3 flex-1">
                            {item.image && (
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-amber-100 flex-shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="font-medium text-gray-700">{item.name}</p>
                              <p className="text-sm text-gray-500">KSH {item.price.toLocaleString()} each</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-9 h-9 bg-amber-100 hover:bg-amber-200 rounded-xl transition-colors flex items-center justify-center font-semibold text-amber-700"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-semibold text-gray-800">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-9 h-9 bg-amber-100 hover:bg-amber-200 rounded-xl transition-colors flex items-center justify-center font-semibold text-amber-700"
                            >
                              +
                            </button>
                            <button
                              onClick={() => removeFromOrder(item.id)}
                              className="ml-2 w-9 h-9 bg-red-50 hover:bg-red-100 rounded-xl transition-colors flex items-center justify-center text-red-500"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-white/10 pt-4">
                      <div className="flex justify-between text-2xl font-bold mb-4 pt-2">
                        <span className="text-gray-700">Total:</span>
                        <span className="text-gray-900">
                          KSH {getOrderTotal().toLocaleString()}
                        </span>
                      </div>
                      <button
                        onClick={submitOrder}
                        className="w-full btn btn-success flex items-center justify-center space-x-2"
                      >
                        <span>Complete Order</span>
                        <Sparkles size={18} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="slide-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center space-x-2">
                <span className="text-gray-800">Menu Management</span>
                <Sparkles size={18} className="text-stone-500" />
              </h2>
              <button
                onClick={() => { setShowAddItem(true); setEditingItem(null); setNewItem({ name: '', price: '', category: selectedCategory }) }}
                className="btn btn-primary flex items-center space-x-2"
              >
                <Plus size={18} />
                <span>Add Item</span>
              </button>
            </div>

            {/* Modal Popup */}
            {showAddItem && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div 
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                  onClick={() => { setShowAddItem(false); setEditingItem(null); setNewItem({ name: '', price: '', category: 'Main', emoji: '🍽️' }) }}
                ></div>
                <div className="relative bg-white rounded-3xl shadow-xl p-6 w-full max-w-lg border border-stone-200 scale-in">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-xl">{editingItem ? 'Edit Item' : 'Add New Item'}</h3>
                    <button
                      onClick={() => { setShowAddItem(false); setEditingItem(null); setNewItem({ name: '', price: '', category: 'Main', emoji: '🍽️' }) }}
                      className="w-10 h-10 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors flex items-center justify-center text-gray-600"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="label">Name</label>
                      <input
                        type="text"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        className="input"
                        placeholder="Item name"
                      />
                    </div>
                    <div>
                      <label className="label">Price</label>
                      <input
                        type="number"
                        step="0.01"
                        value={newItem.price}
                        onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                        className="input"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="label">Category</label>
                      <select
                        value={newItem.category}
                        onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                        className="input"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex space-x-3 mt-6">
                    <button
                      onClick={editingItem ? handleUpdateItem : handleAddItem}
                      className="flex-1 btn btn-primary"
                    >
                      {editingItem ? 'Update Item' : 'Add Item'}
                    </button>
                    <button
                      onClick={() => { setShowAddItem(false); setEditingItem(null); setNewItem({ name: '', price: '', category: 'Main' }) }}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Category Navigation */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-amber-50 border border-amber-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Individual Menu Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menu
                .filter(item => item.category === selectedCategory)
                .map(item => (
                  <div key={item.id} className="card">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1">{item.name}</h4>
                        <p className="text-lg font-bold text-amber-800">KSH {item.price.toLocaleString()}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditItem(item)}
                          className="p-2 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors text-amber-600"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-2 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-xl mb-3" onError={(e) => e.target.style.display = 'none'} />
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="slide-up">
            <h2 className="text-xl font-bold mb-6 flex items-center space-x-2">
              <span className="text-gray-800">Order History</span>
              <Sparkles size={18} className="text-stone-500" />
            </h2>
            {orders.length === 0 ? (
              <div className="card text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
                  <Receipt size={48} className="text-gray-500" />
                </div>
                <p className="text-gray-400 text-lg">No orders yet</p>
                <p className="text-gray-500 text-sm mt-2">Start taking orders to see them here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="card hover:scale-[1.01] transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm text-gray-400">Order #{order.id}</p>
                        <p className="text-sm text-gray-400">{new Date(order.date).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <p className="text-2xl font-bold text-gray-800">
                          KSH {order.total.toLocaleString()}
                        </p>
                        <button
                          onClick={() => printReceipt(order)}
                          className="btn btn-secondary flex items-center space-x-2"
                        >
                          <Printer size={18} />
                          <span>Receipt</span>
                        </button>
                      </div>
                    </div>
                    <div className="border-t border-white/10 pt-4">
                      <div className="space-y-2">
                        {order.items.map(item => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span>{item.name} x{item.quantity}</span>
                            <span className="font-semibold">KSH {(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
