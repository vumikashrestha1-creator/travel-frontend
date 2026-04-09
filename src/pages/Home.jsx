import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #0f4c3a 0%, #1a7a5e 50%, #0f4c3a 100%)',
        color: 'white',
        padding: '80px 20px',
        textAlign: 'center',
        minHeight: '500px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url(https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1600)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)'
        }}/>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '16px' }}>
            🌍 Discover Your Next Adventure
          </h1>
          <p style={{ fontSize: '20px', marginBottom: '32px', opacity: 0.9 }}>
            Secure, affordable travel packages to destinations worldwide
          </p>
          <button
            onClick={() => navigate('/listings')}
            style={{
              background: '#1a7a5e', color: 'white', border: 'none',
              padding: '16px 40px', fontSize: '18px', borderRadius: '8px',
              cursor: 'pointer', fontWeight: 'bold'
            }}>
            Browse Packages
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ padding: '60px 40px', background: '#f9f9f9', textAlign: 'center' }}>
        <h2 style={{ fontSize: '32px', marginBottom: '40px', color: '#0f4c3a' }}>
          Why Choose SafeNest Travel?
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
          {[
            { icon: '🔒', title: 'Secure Booking', desc: 'JWT authentication & encrypted payments' },
            { icon: '💰', title: 'Best Prices', desc: 'Exclusive discounts on all packages' },
            { icon: '🌟', title: 'Top Rated', desc: 'Verified reviews from real travelers' },
            { icon: '✈️', title: 'Global Destinations', desc: 'Packages to 50+ countries worldwide' },
          ].map((f, i) => (
            <div key={i} style={{
              background: 'white', padding: '30px', borderRadius: '12px',
              width: '200px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>{f.icon}</div>
              <h3 style={{ color: '#0f4c3a', marginBottom: '8px' }}>{f.title}</h3>
              <p style={{ color: '#666', fontSize: '14px' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Destinations */}
      <div style={{ padding: '60px 40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '32px', marginBottom: '40px', color: '#0f4c3a' }}>
          Popular Destinations
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          {[
            { name: 'Dubai', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400' },
            { name: 'Bali', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400' },
            { name: 'Paris', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400' },
            { name: 'Tokyo', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400' },
          ].map((d, i) => (
            <div key={i}
              onClick={() => navigate('/listings')}
              style={{
                width: '200px', borderRadius: '12px', overflow: 'hidden',
                cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s'
              }}>
              <img src={d.img} alt={d.name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
              <div style={{ padding: '12px', background: 'white' }}>
                <h3 style={{ color: '#0f4c3a', margin: 0 }}>{d.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div style={{
        background: '#0f4c3a', color: 'white',
        padding: '60px 40px', textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>Ready to Explore?</h2>
        <p style={{ fontSize: '18px', marginBottom: '32px', opacity: 0.9 }}>
          Join thousands of travelers who trust SafeNest Travel
        </p>
        <button
          onClick={() => navigate('/register')}
          style={{
            background: 'white', color: '#0f4c3a', border: 'none',
            padding: '16px 40px', fontSize: '18px', borderRadius: '8px',
            cursor: 'pointer', fontWeight: 'bold', marginRight: '16px'
          }}>
          Register Now
        </button>
        <button
          onClick={() => navigate('/listings')}
          style={{
            background: 'transparent', color: 'white',
            border: '2px solid white',
            padding: '16px 40px', fontSize: '18px', borderRadius: '8px',
            cursor: 'pointer', fontWeight: 'bold'
          }}>
          Browse Packages
        </button>
      </div>
    </div>
  );
};

export default Home;