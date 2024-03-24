
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black/60 text-white">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">About Us</h3>
            <p>our dedicated software engineers innovate solutions that empower clients. With diverse expertise and a commitment to progress, we're shaping the future of technology.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Products</h3>
            <ul>
              <li><a href="#">Unilodge</a></li>
              <li><a href="#">Terracode</a></li>
              <li><a href="#">Product</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <p>Email: terracode@gmail.com</p>
            
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
            <ul>
              <li><a href="#">Facebook</a></li>
              <li><a href="#">Twitter</a></li>
              <li><a href="#">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-4 text-center">
          <p>&copy; {new Date().getFullYear()} Our Website. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
