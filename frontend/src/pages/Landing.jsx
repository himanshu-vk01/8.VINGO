import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUtensils, FaMotorcycle, FaStore, FaStar, FaChevronDown, FaBars, FaTimes } from 'react-icons/fa';
import { BiFoodMenu } from 'react-icons/bi';
import { MdDeliveryDining, MdWork } from 'react-icons/md';
import homeImage from '../assets/home.png';
import scooterImage from '../assets/scooter.png';
import shopImage from '../assets/shop.png';

function Landing() {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('home');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const primaryColor = "#ff4d2d";
    const hoverColor = "#e64323";
    const bgColor = "#fff9f6";

    useEffect(() => {
        const handleScroll = () => {
            const sections = ['home', 'famous-food', 'work-with-us', 'testimonial', 'about'];
            const scrollPosition = window.scrollY + 100;

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsMenuOpen(false);
        }
    };

    const handleLetsOrder = () => {
        navigate('/signin');
    };

    const handleJoinAsOwner = () => {
        navigate('/signup?role=owner');
    };

    const famousFoods = [
        { name: 'Pizza', image: '🍕', description: 'Delicious cheesy pizzas' },
        { name: 'Burger', image: '🍔', description: 'Juicy burgers with fresh ingredients' },
        { name: 'Sushi', image: '🍣', description: 'Fresh and authentic sushi' },
        { name: 'Pasta', image: '🍝', description: 'Creamy and flavorful pasta' },
        { name: 'Tacos', image: '🌮', description: 'Spicy and tangy tacos' },
        { name: 'Desserts', image: '🍰', description: 'Sweet treats for every craving' },
    ];

    const testimonials = [
        {
            name: 'Sarah Johnson',
            role: 'Food Lover',
            text: 'Vingo has transformed how I order food! Fast delivery and amazing variety.',
            rating: 5,
            image: '👩'
        },
        {
            name: 'Mike Chen',
            role: 'Busy Professional',
            text: 'The best food delivery app I\'ve used. Reliable and always on time!',
            rating: 5,
            image: '👨'
        },
        {
            name: 'Emma Davis',
            role: 'Restaurant Owner',
            text: 'As a shop owner, Vingo has helped me reach more customers and grow my business.',
            rating: 5,
            image: '👩‍💼'
        },
    ];

    return (
        <div className="min-h-screen bg-[#fff9f6]">
            {/* Navigation Bar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold cursor-pointer" style={{ color: primaryColor }} onClick={() => scrollToSection('home')}>
                                Vingo
                            </h1>
                        </div>
                        
                        {/* Desktop Navigation */}
                        <div className="hidden md:flex space-x-8">
                            <button
                                onClick={() => scrollToSection('home')}
                                className={`transition-colors ${activeSection === 'home' ? 'font-semibold' : ''}`}
                                style={{ color: activeSection === 'home' ? primaryColor : '#666' }}
                            >
                                Home
                            </button>
                            <button
                                onClick={() => scrollToSection('famous-food')}
                                className={`transition-colors ${activeSection === 'famous-food' ? 'font-semibold' : ''}`}
                                style={{ color: activeSection === 'famous-food' ? primaryColor : '#666' }}
                            >
                                Famous Food
                            </button>
                            <button
                                onClick={() => scrollToSection('work-with-us')}
                                className={`transition-colors ${activeSection === 'work-with-us' ? 'font-semibold' : ''}`}
                                style={{ color: activeSection === 'work-with-us' ? primaryColor : '#666' }}
                            >
                                Work With Us
                            </button>
                            <button
                                onClick={() => scrollToSection('testimonial')}
                                className={`transition-colors ${activeSection === 'testimonial' ? 'font-semibold' : ''}`}
                                style={{ color: activeSection === 'testimonial' ? primaryColor : '#666' }}
                            >
                                Testimonial
                            </button>
                            <button
                                onClick={() => scrollToSection('about')}
                                className={`transition-colors ${activeSection === 'about' ? 'font-semibold' : ''}`}
                                style={{ color: activeSection === 'about' ? primaryColor : '#666' }}
                            >
                                About
                            </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="hidden md:flex items-center space-x-4">
                            <button
                                onClick={handleLetsOrder}
                                className="px-6 py-2 rounded-lg font-semibold text-white transition-all duration-200 hover:scale-105 shadow-lg"
                                style={{ backgroundColor: primaryColor }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = hoverColor}
                                onMouseLeave={(e) => e.target.style.backgroundColor = primaryColor}
                            >
                                Let's Order
                            </button>
                            <button
                                onClick={handleJoinAsOwner}
                                className="px-6 py-2 rounded-lg font-semibold border-2 transition-all duration-200 hover:scale-105"
                                style={{ borderColor: primaryColor, color: primaryColor }}
                            >
                                Join as Shop Owner
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden text-gray-700"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-t">
                        <div className="px-4 py-4 space-y-4">
                            <button onClick={() => scrollToSection('home')} className="block w-full text-left py-2">Home</button>
                            <button onClick={() => scrollToSection('famous-food')} className="block w-full text-left py-2">Famous Food</button>
                            <button onClick={() => scrollToSection('work-with-us')} className="block w-full text-left py-2">Work With Us</button>
                            <button onClick={() => scrollToSection('testimonial')} className="block w-full text-left py-2">Testimonial</button>
                            <button onClick={() => scrollToSection('about')} className="block w-full text-left py-2">About</button>
                            <div className="pt-4 space-y-2 border-t">
                                <button
                                    onClick={handleLetsOrder}
                                    className="w-full px-6 py-2 rounded-lg font-semibold text-white"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    Let's Order
                                </button>
                                <button
                                    onClick={handleJoinAsOwner}
                                    className="w-full px-6 py-2 rounded-lg font-semibold border-2"
                                    style={{ borderColor: primaryColor, color: primaryColor }}
                                >
                                    Join as Shop Owner
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Home Section */}
            <section id="home" className="min-h-screen flex items-center justify-center pt-16 px-4">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div className="text-center md:text-left">
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                            <span style={{ color: primaryColor }}>Delicious</span> Food
                            <br />
                            Delivered to Your Door
                        </h1>
                        <p className="text-xl text-gray-600 mb-8">
                            Experience the best food delivery service with a wide variety of cuisines from top-rated restaurants.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <button
                                onClick={handleLetsOrder}
                                className="px-8 py-4 rounded-lg font-semibold text-white text-lg transition-all duration-200 hover:scale-105 shadow-lg"
                                style={{ backgroundColor: primaryColor }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = hoverColor}
                                onMouseLeave={(e) => e.target.style.backgroundColor = primaryColor}
                            >
                                Let's Order
                            </button>
                            <button
                                onClick={handleJoinAsOwner}
                                className="px-8 py-4 rounded-lg font-semibold border-2 text-lg transition-all duration-200 hover:scale-105"
                                style={{ borderColor: primaryColor, color: primaryColor }}
                            >
                                Join as Shop Owner
                            </button>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="relative z-10">
                            <img src={homeImage} alt="Food Delivery" className="w-full h-auto rounded-2xl shadow-2xl" />
                        </div>
                        <div className="absolute -bottom-6 -right-6 w-full h-full bg-gradient-to-br from-orange-200 to-red-200 rounded-2xl -z-10 opacity-50"></div>
                    </div>
                </div>
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <FaChevronDown className="text-gray-400" size={24} />
                </div>
            </section>

            {/* Famous Food Section */}
            <section id="famous-food" className="min-h-screen py-20 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: primaryColor }}>
                            Famous Food
                        </h2>
                        <p className="text-xl text-gray-600">Explore our most popular dishes</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {famousFoods.map((food, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-br from-white to-orange-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer border border-orange-100"
                            >
                                <div className="text-6xl mb-4 text-center">{food.image}</div>
                                <h3 className="text-2xl font-bold mb-2 text-center" style={{ color: primaryColor }}>
                                    {food.name}
                                </h3>
                                <p className="text-gray-600 text-center">{food.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Work With Us Section */}
            <section id="work-with-us" className="min-h-screen py-20 px-4" style={{ backgroundColor: bgColor }}>
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: primaryColor }}>
                            Work With Us
                        </h2>
                        <p className="text-xl text-gray-600">Join the Vingo family and grow your business</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto" style={{ backgroundColor: `${primaryColor}20` }}>
                                <FaStore size={32} style={{ color: primaryColor }} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-center" style={{ color: primaryColor }}>
                                Restaurant Owner
                            </h3>
                            <p className="text-gray-600 text-center mb-6">
                                List your restaurant and reach thousands of customers. Manage your menu, orders, and grow your business.
                            </p>
                            <button
                                onClick={handleJoinAsOwner}
                                className="w-full px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 hover:scale-105"
                                style={{ backgroundColor: primaryColor }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = hoverColor}
                                onMouseLeave={(e) => e.target.style.backgroundColor = primaryColor}
                            >
                                Join Now
                            </button>
                        </div>
                        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto" style={{ backgroundColor: `${primaryColor}20` }}>
                                <FaMotorcycle size={32} style={{ color: primaryColor }} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-center" style={{ color: primaryColor }}>
                                Delivery Partner
                            </h3>
                            <p className="text-gray-600 text-center mb-6">
                                Become a delivery partner and earn money on your own schedule. Flexible hours and competitive pay.
                            </p>
                            <button
                                onClick={() => navigate('/signup?role=deliveryBoy')}
                                className="w-full px-6 py-3 rounded-lg font-semibold border-2 transition-all duration-200 hover:scale-105"
                                style={{ borderColor: primaryColor, color: primaryColor }}
                            >
                                Apply Now
                            </button>
                        </div>
                        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto" style={{ backgroundColor: `${primaryColor}20` }}>
                                <MdWork size={32} style={{ color: primaryColor }} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-center" style={{ color: primaryColor }}>
                                Join Our Team
                            </h3>
                            <p className="text-gray-600 text-center mb-6">
                                We're always looking for talented individuals to join our team. Check out our open positions.
                            </p>
                            <button
                                onClick={() => navigate('/signup')}
                                className="w-full px-6 py-3 rounded-lg font-semibold border-2 transition-all duration-200 hover:scale-105"
                                style={{ borderColor: primaryColor, color: primaryColor }}
                            >
                                View Jobs
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonial Section */}
            <section id="testimonial" className="min-h-screen py-20 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: primaryColor }}>
                            What Our Customers Say
                        </h2>
                        <p className="text-xl text-gray-600">Real reviews from real people</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-orange-100"
                            >
                                <div className="flex items-center mb-4">
                                    <div className="text-4xl mr-4">{testimonial.image}</div>
                                    <div>
                                        <h4 className="font-bold text-lg">{testimonial.name}</h4>
                                        <p className="text-gray-600 text-sm">{testimonial.role}</p>
                                    </div>
                                </div>
                                <div className="flex mb-4" style={{ color: primaryColor }}>
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <FaStar key={i} className="fill-current" />
                                    ))}
                                </div>
                                <p className="text-gray-700 italic">"{testimonial.text}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="min-h-screen py-20 px-4" style={{ backgroundColor: bgColor }}>
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: primaryColor }}>
                            About Vingo
                        </h2>
                        <p className="text-xl text-gray-600">Your trusted food delivery partner</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                        <div>
                            <h3 className="text-3xl font-bold mb-6" style={{ color: primaryColor }}>
                                Our Mission
                            </h3>
                            <p className="text-lg text-gray-700 mb-4">
                                At Vingo, we believe that great food should be accessible to everyone, anywhere, anytime. 
                                We connect hungry customers with amazing local restaurants and dedicated delivery partners.
                            </p>
                            <p className="text-lg text-gray-700 mb-4">
                                Our platform makes it easy for restaurant owners to reach more customers, for delivery partners 
                                to earn a flexible income, and for food lovers to enjoy their favorite meals without leaving home.
                            </p>
                            <div className="flex flex-wrap gap-4 mt-8">
                                <div className="flex items-center space-x-2">
                                    <FaUtensils style={{ color: primaryColor }} />
                                    <span className="font-semibold">1000+ Restaurants</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <MdDeliveryDining style={{ color: primaryColor }} />
                                    <span className="font-semibold">Fast Delivery</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <FaStar style={{ color: primaryColor }} />
                                    <span className="font-semibold">4.8 Rating</span>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                                <img src={scooterImage} alt="Delivery" className="w-24 h-24 mx-auto mb-4" />
                                <h4 className="font-bold text-lg mb-2" style={{ color: primaryColor }}>Fast Delivery</h4>
                                <p className="text-gray-600">Quick and reliable service</p>
                            </div>
                            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                                <img src={shopImage} alt="Shop" className="w-24 h-24 mx-auto mb-4" />
                                <h4 className="font-bold text-lg mb-2" style={{ color: primaryColor }}>Best Restaurants</h4>
                                <p className="text-gray-600">Top-rated partners</p>
                            </div>
                        </div>
                    </div>
                    <div className="text-center">
                        <h3 className="text-3xl font-bold mb-8" style={{ color: primaryColor }}>
                            Ready to Get Started?
                        </h3>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={handleLetsOrder}
                                className="px-8 py-4 rounded-lg font-semibold text-white text-lg transition-all duration-200 hover:scale-105 shadow-lg"
                                style={{ backgroundColor: primaryColor }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = hoverColor}
                                onMouseLeave={(e) => e.target.style.backgroundColor = primaryColor}
                            >
                                Let's Order
                            </button>
                            <button
                                onClick={handleJoinAsOwner}
                                className="px-8 py-4 rounded-lg font-semibold border-2 text-lg transition-all duration-200 hover:scale-105"
                                style={{ borderColor: primaryColor, color: primaryColor }}
                            >
                                Join as Shop Owner
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <h3 className="text-2xl font-bold mb-4" style={{ color: primaryColor }}>Vingo</h3>
                            <p className="text-gray-400">Delicious food delivered to your door.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><button onClick={() => scrollToSection('home')} className="hover:text-white transition-colors">Home</button></li>
                                <li><button onClick={() => scrollToSection('famous-food')} className="hover:text-white transition-colors">Famous Food</button></li>
                                <li><button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors">About</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">For Business</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><button onClick={() => scrollToSection('work-with-us')} className="hover:text-white transition-colors">Work With Us</button></li>
                                <li><button onClick={handleJoinAsOwner} className="hover:text-white transition-colors">Join as Owner</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Contact</h4>
                            <p className="text-gray-400">Email: hmraj62051@gmail.com</p>
                            <p className="text-gray-400">Phone: 8757643800</p>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
                        <p>&copy; 2026 QUICKBITE. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Landing;

