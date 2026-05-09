const team = [
  {
    name: "Vumika Shrestha",
    role: "Project Lead & Full Stack Developer",
    emoji: "👩‍💻",
    contributions: "Backend architecture, JWT auth, booking system, project management",
  },
  {
    name: "Sweta Manandhar",
    role: "Frontend Developer",
    emoji: "🎨",
    contributions: "About Us page, Contact form, Loading Spinner, 404 page, listing image fixes, admin features",
  },
  {
    name: "Prasanna Shrestha",
    role: "Frontend Developer",
    emoji: "🖥️",
    contributions: "User profiles, home page design, city dropdowns",
  },
  {
    name: "Alekhya",
    role: "Backend Developer",
    emoji: "⚙️",
    contributions: "Contact, cancel and reschedule booking features",
  },
  {
    name: "Sonika",
    role: "Frontend Developer",
    emoji: "📊",
    contributions: "Analytics dashboard, trip reminder banner",
  },
];

const values = [
  { icon: "🔒", title: "Security First", desc: "Every feature is built with user safety and data protection in mind." },
  { icon: "✈️", title: "Seamless Travel", desc: "We make booking trips simple, fast, and stress-free." },
  { icon: "🤝", title: "Trust & Transparency", desc: "Honest pricing, clear policies, and reliable support." },
  { icon: "🌍", title: "Community Driven", desc: "Built by a passionate student team working together for real impact." },
];

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-900 text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-3">About SafeNest Travel</h1>
        <p className="text-teal-200 text-lg max-w-2xl mx-auto">
          We are a team of students building a secure, modern travel booking experience
          as part of our ICT946 Capstone Project.
        </p>
      </div>

      {/* Mission */}
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-teal-800 mb-4">Our Mission</h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          SafeNest Travel Booking System (STBS) was created to demonstrate how a
          real-world travel platform can be built with security, usability, and
          reliability at its core. We handle everything from user authentication
          with multi-factor security to admin management and AI-powered recommendations.
        </p>
      </div>

      {/* Values */}
      <div className="bg-white py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-teal-800 text-center mb-8">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="text-center p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-3">{v.icon}</div>
                <h3 className="font-bold text-gray-800 mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-teal-800 text-center mb-8">Meet the Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((member) => (
            <div key={member.name} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="text-5xl mb-3 text-center">{member.emoji}</div>
              <h3 className="text-lg font-bold text-gray-800 text-center">{member.name}</h3>
              <p className="text-teal-600 text-sm font-medium text-center mb-3">{member.role}</p>
              <p className="text-gray-500 text-sm text-center">{member.contributions}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer note */}
      <div className="text-center pb-12 text-gray-400 text-sm">
        ICT946 Capstone Project — CIHE 2024 &nbsp;|&nbsp; SafeNest Travel Booking System
      </div>
    </div>
  );
}
