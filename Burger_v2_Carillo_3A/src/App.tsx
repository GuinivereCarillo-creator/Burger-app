import { useEffect, useState, type FormEvent } from 'react'
import './App.css'

type Burger = {
  id: number
  name: string
  price: number
  desc: string
  rating: number
  image: string
}

type CartItem = {
  burger: Burger
  qty: number
}

const burgers: Burger[] = [
  {
    id: 1,
    name: 'Crispy Chicken',
    price: 99.15,
    desc: 'Chicken breast, chilli sauce, tomatoes, pickles, coleslaw',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=700&q=80',
  },
  {
    id: 2,
    name: 'Ultimate Bacon',
    price: 99.32,
    desc: 'House patty, cheddar cheese, bacon, onion, mustard',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&q=80',
  },
  {
    id: 3,
    name: 'Black Sheep',
    price: 69.15,
    desc: 'American cheese, tomato relish, avocado, lettuce, red onion',
    rating: 3.5,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=700&q=80',
  },
  {
    id: 4,
    name: 'Vegan Burger',
    price: 99.25,
    desc: 'House patty, cheddar cheese, bacon, onion, mustard',
    rating: 3,
    image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=700&q=80',
  },
  {
    id: 5,
    name: 'Double Trouble',
    price: 120.0,
    desc: 'Two beef patties, double cheese, smoky sauce, crisp lettuce',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=700&q=80',
  },
  {
    id: 6,
    name: 'Cheese Overload',
    price: 110.5,
    desc: 'Triple cheddar, mozzarella, house sauce, toasted bun',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=700&q=80',
  },
  {
    id: 7,
    name: 'Spicy Inferno',
    price: 105.75,
    desc: 'Flame grilled patty, jalapenos, hot sauce, pepper jack',
    rating: 4,
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=700&q=80',
  },
  {
    id: 8,
    name: 'Classic Beef',
    price: 89.99,
    desc: 'All beef patty, pickles, tomato, onion, house dressing',
    rating: 4,
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=700&q=80',
  },
]

const peso = (value: number) => '\u20b1' + value.toFixed(2)

function Stars({ value }: { value: number }) {
  const rounded = Math.round(value)
  return (
    <span className="stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= rounded ? 'star on' : 'star'}>
          &#9733;
        </span>
      ))}
    </span>
  )
}

function App() {
  const [page, setPage] = useState('menu')
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('burger_v2_carillo_3a_cart')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [likes, setLikes] = useState<number[]>([])
  const [active, setActive] = useState<Burger | null>(null)
  const [qty, setQty] = useState(1)
  const [showAll, setShowAll] = useState(false)
  const [note, setNote] = useState('')
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  useEffect(() => {
    localStorage.setItem('burger_v2_carillo_3a_cart', JSON.stringify(cart))
  }, [cart])

  const visible = showAll ? burgers : burgers.slice(0, 4)
  const count = cart.reduce((sum, item) => sum + item.qty, 0)
  const total = cart.reduce((sum, item) => sum + item.burger.price * item.qty, 0)

  const flash = (text: string) => {
    setNote(text)
    window.setTimeout(() => setNote(''), 2200)
  }

  const go = (target: string) => {
    setPage(target)
    setActive(null)
  }

  const toggleLike = (id: number) => {
    setLikes((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const openProduct = (burger: Burger) => {
    setActive(burger)
    setQty(1)
  }

  const placeOrder = () => {
    if (!active) return
    setCart((prev) => {
      const found = prev.find((item) => item.burger.id === active.id)
      if (found) {
        return prev.map((item) =>
          item.burger.id === active.id ? { ...item, qty: item.qty + qty } : item,
        )
      }
      return [...prev, { burger: active, qty }]
    })
    flash(qty + ' x ' + active.name + ' added to your order')
    setActive(null)
  }

  const changeQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.burger.id === id ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0),
    )
  }

  const removeItem = (id: number) => {
    setCart((prev) => prev.filter((item) => item.burger.id !== id))
  }

  const submitForm = (event: FormEvent) => {
    event.preventDefault()
    if (!form.name || !form.email || !form.message) {
      flash('Please complete all fields')
      return
    }
    flash('Thanks ' + form.name + ', we received your message')
    setForm({ name: '', email: '', message: '' })
  }

  const renderPage = () => {
    switch (page) {
      case 'about':
        return (
          <section className="page">
            <h1 className="title">ABOUT US</h1>
            <p className="lead">
              Tasty Burger started as a small street stall with one goal, to serve honest burgers
              made from fresh ingredients every single day.
            </p>
            <div className="stats">
              <div className="stat">
                <strong>1</strong>
                <span>Years grilling</span>
              </div>
              <div className="stat">
                <strong>7+</strong>
                <span>Burger recipes</span>
              </div>
              <div className="stat">
                <strong>1K</strong>
                <span>Happy orders</span>
              </div>
              <div className="infos">
                  <p>Email: <strong>guinivere@gmail.com</strong></p>
                  <p>Contact number: <strong>09123456789</strong></p>
              </div>
            </div>
          </section>
        )
      case 'shop':
        return (
          <section className="page">
            <h1 className="title">YOUR ORDER</h1>
            {cart.length === 0 ? (
              <p className="lead">Your cart is empty.</p>
            ) : (
              <div className="cart">
                {cart.map((item) => (
                  <div className="cart-row" key={item.burger.id}>
                    <img src={item.burger.image} alt={item.burger.name} />
                    <div className="cart-info">
                      <h3>{item.burger.name}</h3>
                      <span>{peso(item.burger.price)}</span>
                    </div>
                    <div className="stepper">
                      <button onClick={() => changeQty(item.burger.id, -1)}>-</button>
                      <span>{item.qty}</span>
                      <button onClick={() => changeQty(item.burger.id, 1)}>+</button>
                    </div>
                    <div className="cart-line">{peso(item.burger.price * item.qty)}</div>
                    <button className="remove" onClick={() => removeItem(item.burger.id)}>
                      Remove
                    </button>
                  </div>
                ))}
                <div className="cart-total">
                  <span>Total</span>
                  <strong>{peso(total)}</strong>
                </div>
                <button className="primary" onClick={() => flash('Order placed. Thank you!')}>
                  Checkout
                </button>
              </div>
            )}
          </section>
        )
      case 'contact':
        return (
          <section className="page">
            <h1 className="title">CONTACT</h1>
            <p className="lead">Send us a message and we will get back to you shortly.</p>
            <form className="contact" onSubmit={submitForm}>
              <input
                placeholder="Pangaran mo ngani"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                placeholder="Email mo ngani"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <textarea
                placeholder="Message"
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
              <button className="primary" type="submit">
                Send Message
              </button>
            </form>
          </section>
        )
      default:
        return (
          <section className="page">
            <h1 className="title">OUR CRAZY BURGERS</h1>
            <h4 className="Guin">Made by Guinivere Carillo</h4>
            <p className="lead">
              Get ready for a wild ride of flavors. Our crazy burgers are loaded with juicy
              patties, bold toppings, and irresistible sauces, all stacked on a perfectly toasted
              bun. Whether you like it cheesy, or extra meaty, we have got a burger that will blow
              your mind.
            </p>
            <div className="grid">
              {visible.map((burger) => (
                <article className="card" key={burger.id}>
                  <div className="thumb" onClick={() => openProduct(burger)}>
                    <img src={burger.image} alt={burger.name} />
                    <span className="view">View Product</span>
                  </div>
                  <div className="card-body">
                    <div className="card-top">
                      <Stars value={burger.rating} />
                      <button
                        className={likes.includes(burger.id) ? 'heart on' : 'heart'}
                        onClick={() => toggleLike(burger.id)}
                      >
                        {likes.includes(burger.id) ? '\u2665' : '\u2661'}
                      </button>
                    </div>
                    <h3>{burger.name}</h3>
                    <p>{burger.desc}</p>
                    <span className="price">{peso(burger.price)}</span>
                  </div>
                </article>
              ))}
            </div>
            <button className="view-more" onClick={() => setShowAll(!showAll)}>
              {showAll ? 'Show Less' : 'View More'}
            </button>
          </section>
        )
    }
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand" onClick={() => go('menu')}>
          <span className="brand-mark">&#127828;</span>
          <span className="brand-text">
            <small>TASTY</small>
            <strong>BURGER</strong>
          </span>
        </div>
        <nav className="nav">
          <button className={page === 'about' ? 'active' : ''} onClick={() => go('about')}>
            ABOUT
          </button>
          <button className={page === 'menu' ? 'active' : ''} onClick={() => go('menu')}>
            OUR MENU
          </button>
          <button className={page === 'shop' ? 'active' : ''} onClick={() => go('shop')}>
            SHOP
          </button>
          <button className={page === 'contact' ? 'active' : ''} onClick={() => go('contact')}>
            CONTACT
          </button>
          <button className="cart-btn" onClick={() => go('shop')}>
            &#128722;
            <span className="badge">{count}</span>
          </button>
        </nav>
      </header>

      {renderPage()}

      {active && (
        <div className="overlay" onClick={() => setActive(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setActive(null)}>
              &#215;
            </button>
            <img src={active.image} alt={active.name} />
            <div className="modal-body">
              <h2>{active.name}</h2>
              <Stars value={active.rating} />
              <p>{active.desc}</p>
              <span className="modal-price">{peso(active.price)}</span>
              <div className="modal-actions">
                <div className="stepper">
                  <button onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
                  <span>{qty}</span>
                  <button onClick={() => setQty(qty + 1)}>+</button>
                </div>
                <button className="primary" onClick={placeOrder}>
                  Order {peso(active.price * qty)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {note && <div className="toast">{note}</div>}
    </div>
  )
}

export default App
