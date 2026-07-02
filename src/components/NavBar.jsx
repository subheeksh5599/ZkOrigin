import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="fixed top-0 left-0 z-50 md:p-9 p-3 flex items-center md:gap-8 gap-4">
      <img src="/images/nav-logo.svg" alt="zkOrigin" className="md:w-28 w-24" />
      <Link to="/dashboard" className="text-white/60 hover:text-white text-sm font-semibold uppercase tracking-wider transition-colors">
        Dashboard
      </Link>
    </nav>
  );
};

export default NavBar;
