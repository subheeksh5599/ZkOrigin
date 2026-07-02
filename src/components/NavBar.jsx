import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="fixed top-0 left-0 z-50 md:p-9 p-3 flex items-center md:gap-8 gap-4">
      <Link to="/" className="font-mono text-2xl font-bold tracking-tight">
        <span className="text-teal-400">zk</span><span className="text-white">Origin</span>
      </Link>
      <Link to="/dashboard" className="text-white/60 hover:text-white text-sm font-semibold uppercase tracking-wider transition-colors">
        Dashboard
      </Link>
    </nav>
  );
};

export default NavBar;
