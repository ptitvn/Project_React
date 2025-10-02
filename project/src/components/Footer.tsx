import React from "react";
import { FaTwitter, FaFacebookF, FaInstagram, FaGithub } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white mt-12">
      {/* Đường kẻ ngang trên cùng (duy nhất) */}
      <div className="w-full border-t border-gray-200"></div>

      <div className="container mx-auto px-6 py-12">
        {/* 5 cột cùng hàng ngang: MY BLOG, About Rareblocks, Company, Help, Resources */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* MY BLOG */}
         
            <h2 className="text-xl font-bold">MY BLOG</h2>
          

          {/* About Rareblocks */}
          <div>
            <h3 className="text-sm font-semibold mb-2">About Rareblocks</h3>
            <p className="text-sm text-gray-600 leading-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              dictum felis ut erat semper porta. Cras metus nibh, faucibus vel
              vehicula id, laoreet nec velit. Nullam vehicula nibh vel libero
              posuere venenatis.
            </p>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-700 hover:text-black">About</a></li>
              <li><a href="#" className="text-gray-700 hover:text-black">Features</a></li>
              <li><a href="#" className="text-gray-700 hover:text-black">Works</a></li>
              <li><a href="#" className="text-gray-700 hover:text-black">Career</a></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Help</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-700 hover:text-black">Customer Support</a></li>
              <li><a href="#" className="text-gray-700 hover:text-black">Delivery Details</a></li>
              <li><a href="#" className="text-gray-700 hover:text-black">Terms &amp; Conditions</a></li>
              <li><a href="#" className="text-gray-700 hover:text-black">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-700 hover:text-black">Free eBooks</a></li>
              <li><a href="#" className="text-gray-700 hover:text-black">Development Tutorial</a></li>
              <li><a href="#" className="text-gray-700 hover:text-black">How-to Blog</a></li>
              <li><a href="#" className="text-gray-700 hover:text-black">Youtube Playlist</a></li>
            </ul>
          </div>
        </div>

        {/* Icons mạng xã hội (tùy chọn) */}
        <div className="flex justify-center items-center gap-6 mt-10">
          <a href="#" aria-label="Twitter" className="text-gray-700 hover:text-black"><FaTwitter size={18} /></a>
          <a href="#" aria-label="Facebook" className="text-gray-700 hover:text-black"><FaFacebookF size={18} /></a>
          <a href="#" aria-label="Instagram" className="text-gray-700 hover:text-black"><FaInstagram size={18} /></a>
          <a href="#" aria-label="GitHub" className="text-gray-700 hover:text-black"><FaGithub size={18} /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;