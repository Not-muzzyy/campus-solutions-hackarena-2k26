import { useState } from 'react'
import { PageHeader, useToast, Toast } from '../../components/ui/index'
import api from '../../api/axios'

const MENU = {
  Meals: [
    {name:'Veg Thali',price:60,desc:'Rice + Dal + Sabzi + Roti'},
    {name:'Egg Thali',price:70,desc:'Rice + Dal + Egg Curry + Roti'},
    {name:'Chicken Biryani',price:90,desc:'Full plate with raita'},
    {name:'Veg Biryani',price:70,desc:'Full plate with raita'},
  ],
  'Snacks & Drinks': [
    {name:'Masala Dosa',price:30,desc:'With sambar & chutney'},
    {name:'Bread Omelette',price:25,desc:'2 eggs with bread'},
    {name:'Tea / Coffee',price:10,desc:'Freshly prepared'},
    {name:'Cold Drink',price:20,desc:'Pepsi / Sprite / Maaza'},
    {name:'Samosa (2 pcs)',price:15,desc:'With chutney'},
    {name:'Vada Pav',price:20,desc:'With chutney'},
  ]
}

export default function Canteen() {
  const [cart, setCart] = useState({})
  const [orderSuccess, setOrderSuccess] = useState(null)
  const [loading, setLoading] = useState(false)
  const { toast, show, hide } = useToast()

  const add = (name, price) => {
    setCart(prev => ({ ...prev, [name]: { price, qty: (prev[name]?.qty || 0) + 1 } }))
    show(`${name} added`)
  }
  const chg = (name, d) => {
    setCart(prev => {
      const qty = (prev[name]?.qty || 0) + d
      if (qty <= 0) { const n = {...prev}; delete n[name]; return n }
      return { ...prev, [name]: { ...prev[name], qty } }
    })
  }

  const keys = Object.keys(cart)
  const subtotal = keys.reduce((s,k) => s + cart[k].price * cart[k].qty, 0)
  const gst = Math.round(subtotal * 0.05)
  const total = subtotal + gst

  const placeOrder = async () => {
    if (!keys.length) return
    setLoading(true)
    try {
      const items = keys.map(k => ({ item_name: k, quantity: cart[k].qty, price: cart[k].price }))
      const res = await api.post('/canteen/order', { items })
      setOrderSuccess(res.data)
      setCart({})
    } catch {
      show('Order failed. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader title="Smart Canteen" subtitle="Order online — get notified when ready. No queues." />
      <div className="flex flex-col md:flex-row gap-3 px-5 py-4">
        {/* Menu */}
        <div className="flex-1 overflow-y-auto">
          {Object.entries(MENU).map(([cat, items]) => (
            <div key={cat} className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-[0.6rem] text-[#F59E0B] uppercase tracking-[0.1em]">{cat}</span>
                <div className="flex-1 h-px bg-[#262626]"></div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {items.map(item => (
                  <div key={item.name} className="bg-[#0f0f0f] border border-[#262626] rounded-sm p-3 hover:border-[#3a3a3a] transition-colors">
                    <div className="text-[0.8rem] text-[#e5e5e5] font-medium mb-0.5">{item.name}</div>
                    <div className="font-display font-bold text-[#F59E0B] text-[0.9rem]">Rs.{item.price}</div>
                    <div className="text-[0.62rem] text-[#525252] mt-0.5 mb-2">{item.desc}</div>
                    <button onClick={() => add(item.name, item.price)} className="bg-red-700 hover:bg-red-600 text-white text-[0.65rem] px-2.5 py-1 rounded-sm transition-colors">+ Add</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Cart */}
        <div className="w-full md:w-[280px] flex-shrink-0">
          <div className="bg-[#0f0f0f] border border-[#262626] rounded-sm p-4 md:sticky md:top-4">
            <div className="font-display font-bold text-[0.9rem] text-white mb-3 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-red-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              Your Order
            </div>

            {keys.length === 0 ? (
              <div className="font-mono text-[0.68rem] text-[#525252] text-center py-4">No items added yet</div>
            ) : (
              <div>
                {keys.map(k => (
                  <div key={k} className="flex items-center gap-2 py-2 border-b border-[#1e1e1e]">
                    <span className="flex-1 text-[0.76rem] text-[#e5e5e5]">{k}</span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => chg(k,-1)} className="w-4 h-4 bg-[#262626] border border-[#3a3a3a] text-white flex items-center justify-center text-[0.8rem] rounded-sm">-</button>
                      <span className="font-mono text-[0.72rem] w-4 text-center">{cart[k].qty}</span>
                      <button onClick={() => chg(k,1)} className="w-4 h-4 bg-[#262626] border border-[#3a3a3a] text-white flex items-center justify-center text-[0.8rem] rounded-sm">+</button>
                    </div>
                    <span className="font-display font-bold text-[#F59E0B] text-[0.76rem]">Rs.{cart[k].price*cart[k].qty}</span>
                  </div>
                ))}
                <div className="mt-3 pt-3 border-t border-[#262626]">
                  {[{l:'Subtotal',v:`Rs.${subtotal}`},{l:'GST (5%)',v:`Rs.${gst}`}].map(r=>(
                    <div key={r.l} className="flex justify-between font-mono text-[0.68rem] text-[#525252] mb-1"><span>{r.l}</span><span>{r.v}</span></div>
                  ))}
                  <div className="flex justify-between font-display font-bold text-[#F59E0B] mt-1.5"><span>Total</span><span>Rs.{total}</span></div>
                </div>
                <button onClick={placeOrder} disabled={loading}
                  className="w-full mt-3 bg-red-700 hover:bg-red-600 disabled:bg-[#262626] text-white font-semibold text-[0.78rem] py-2.5 rounded-sm transition-colors">
                  {loading ? 'Placing...' : 'Pay via Razorpay'}
                </button>
              </div>
            )}

            {orderSuccess && (
              <div className="bg-green-950/10 border border-green-900/20 rounded-sm p-3 mt-3">
                <div className="font-mono text-[0.7rem] text-green-400 font-medium mb-1">Order Placed — Token #{orderSuccess.token}</div>
                <div className="text-[0.7rem] text-[#525252]">Ready in ~{orderSuccess.estimated_minutes} min. Pick up at {orderSuccess.counter}.</div>
              </div>
            )}
          </div>
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hide} />}
    </div>
  )
}
