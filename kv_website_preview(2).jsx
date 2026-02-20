'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const roles = { PUBLIC: 'public', VIP: 'vip', ELITE: 'elite', ADMIN: 'admin' };
const INVITE_CODE = 'KV-ELITE-2026';
const curatedProductImages = Array.from({ length: 12 }, (_, i) => `/images/kv/kv${i + 1}.jpg`);
const initialProducts = Array.from({ length: 12 }, (_, i) => ({ id: i + 1, name: `KV Signature ${i + 1}`, price: 2500 + i * 200, stock: 3, tier: i % 4 === 0 ? roles.ELITE : roles.PUBLIC, image: curatedProductImages[i], limited: i % 3 === 0, model: '/models/kv-model.glb' }));

export default function KVProductionPlatform() {
  const [page, setPage] = useState('home');
  const [products] = useState(initialProducts);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [inviteInput, setInviteInput] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [animatedRevenue, setAnimatedRevenue] = useState(0);
  const targetRevenue = 12500000;

  useEffect(() => {
    let start = 0;
    const interval = setInterval(() => { start += 250000; if (start >= targetRevenue) { start = targetRevenue; clearInterval(interval); } setAnimatedRevenue(start); }, 40);
    return () => clearInterval(interval);
  }, []);

  const addToCart = (product) => { setCart(prev => [...prev, product]); setCartOpen(true); };
  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const handleStripeCheckout = async () => { window.location.href = '/api/stripe-checkout'; };
  const handleInviteAccess = () => { if (inviteInput === INVITE_CODE) { setAuthenticated(true); setPage('vip'); } else { alert('Invalid private access code.'); } };

  return (
    <div className="bg-black text-white min-h-screen overflow-x-hidden">
      <nav className="fixed top-0 w-full flex justify-between items-center px-10 py-6 bg-black/60 backdrop-blur-md z-50">
        <div className="text-2xl tracking-[0.4em] cursor-pointer" onClick={() => setPage('home')}>K V</div>
        <div className="space-x-6 text-sm">
          {['home','shop','investor','about','vip','organization','roadmap','global','architecture'].map(p => (
            <button key={p} onClick={() => setPage(p)}>{p.toUpperCase()}</button>
          ))}
          <button onClick={() => setCartOpen(true)}>CART ({cart.length})</button>
        </div>
      </nav>

      <AnimatePresence exitBeforeEnter>
        {page === 'home' && (
          <motion.section key="home" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="relative h-screen flex items-center justify-center text-center">
            <video autoPlay muted loop className="absolute w-full h-full object-cover opacity-60">
              <source src="/video/kv-hero.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black"></div>
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }} className="relative z-10">
              <h1 className="text-6xl tracking-[0.6em]">K V</h1>
              <p className="mt-6 text-gray-300">Architected Power. Silent Authority.</p>
              <button onClick={() => setPage('shop')} className="mt-10 border border-yellow-500 text-yellow-500 px-8 py-3">ENTER COLLECTION</button>
            </motion.div>
          </motion.section>
        )}

        {page === 'shop' && (
          <motion.section key="shop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="pt-32 px-10 pb-20">
            <h2 className="text-3xl text-center mb-12">Signature Collection</h2>
            <div className="grid md:grid-cols-3 gap-10">
              {products.map(p => (
                <motion.div key={p.id} whileHover={{ y:-10, scale:1.03 }} className="text-center">
                  <img src={p.image} alt={p.name} className="w-full h-[400px] object-cover cursor-pointer" onClick={() => setSelectedProduct(p)} />
                  <div className="mt-4">{p.name}</div>
                  <div className="text-gray-400">₹{p.price}</div>
                  <button onClick={() => addToCart(p)} className="mt-3 border border-yellow-500 text-yellow-500 px-4 py-1">Add to Cart</button>
                </motion.div>
              ))}
            </div>

            <AnimatePresence>
              {selectedProduct && (
                <motion.div key="modal" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
                  <div className="bg-gray-900 p-8 max-w-3xl w-full relative">
                    <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4">✕</button>
                    <h3 className="mb-6 text-xl">3D Preview — {selectedProduct.name}</h3>
                    <model-viewer src={selectedProduct.model} auto-rotate camera-controls style={{ width: '100%', height: '400px' }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        )}

        {page === 'investor' && (
          <motion.section key="investor" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="pt-32 px-10 pb-20 text-center">
            <h2 className="text-3xl mb-10">Investor Growth</h2>
            <div className="text-4xl mb-6">₹{animatedRevenue.toLocaleString()}</div>
            <svg width="400" height="200" className="mx-auto">
              <polyline fill="none" stroke="gold" strokeWidth="3" points="0,180 80,150 160,130 240,100 320,60 400,40" />
            </svg>
            <p className="text-gray-400 mt-6">42% YoY Growth — Expanding Global Flagship Presence</p>
          </motion.section>
        )}

        {page === 'about' && (
          <motion.section key="about" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="pt-32 px-10 pb-20 text-center">
            <h2 className="text-3xl mb-6">About KV Platform</h2>
            <p className="max-w-2xl mx-auto text-gray-400 mt-4">
              KV is a luxury lifestyle platform designed to deliver an immersive, cinematic, and ultra-exclusive experience. Explore our curated signature collections, VIP-only drops, and private concierge services. The platform integrates interactive 3D product previews, AI styling assistance, and dynamic investor insights, creating a seamless blend of commerce, innovation, and elite brand experience.
            </p>
          </motion.section>
        )}

        {page === 'vip' && authenticated && (
          <motion.section key="vip" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="pt-32 px-10 pb-20 text-center">
            <h2 className="text-3xl mb-6">Elite Concierge Dashboard</h2>
            <p className="text-gray-400">
              Welcome to the KV VIP portal — the inner sanctum of luxury. As an exclusive member, you gain access to invite-only collections, personalized concierge services, early capsule drops, and tailored AI styling recommendations. This dashboard is designed for ultra-high-net-worth clients seeking privacy, exclusivity, and a seamless, cinematic luxury shopping experience.
            </p>
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {cartOpen && (
          <motion.div initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }} className="fixed right-0 top-0 h-full w-96 bg-gray-950 p-8 z-50">
            <h2 className="text-xl mb-6">Your Selection</h2>
            {cart.map((item, i) => (
              <div key={i} className="flex justify-between mb-3">
                <span>{item.name}</span>
                <span>₹{item.price}</span>
              </div>
            ))}
            <div className="mt-6 border-t border-gray-800 pt-4">
              <div className="flex justify-between font-semibold">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <button onClick={handleStripeCheckout} className="mt-6 w-full border border-yellow-500 text-yellow-500 py-2">Secure Stripe Checkout</button>
              <button onClick={() => setCartOpen(false)} className="mt-4 w-full text-gray-500">Close</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="py-12 text-center text-gray-600 border-t border-gray-800">© 2026 KV — The House of Quiet Power</footer>
    </div>
  );
}
