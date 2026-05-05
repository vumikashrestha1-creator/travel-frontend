import { useState } from "react";

const Contact = () => {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-3">Contact Us</h1>
        <p className="text-gray-600 mb-8">
          Need help with a booking, cancellation, refund, or reschedule request?
          Send a message to the SafeNest Travel support team.
        </p>

        {sent ? (
          <div className="bg-green-50 border border-green-200 text-green-700 p-5 rounded-xl">
            Your message has been submitted successfully. Our support team will contact you soon.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <input type="text" required placeholder="Full Name" className="w-full border border-gray-300 rounded-lg px-4 py-3" />
            <input type="email" required placeholder="Email Address" className="w-full border border-gray-300 rounded-lg px-4 py-3" />
            <textarea required rows="5" placeholder="Message" className="w-full border border-gray-300 rounded-lg px-4 py-3" />
            <button type="submit" className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold">
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Contact;
