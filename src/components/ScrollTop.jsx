import React,{useEffect} from 'react'
import { useLocation } from "react-router-dom";

const ScrollTop = () => {
 const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top
  }, [pathname]);

  return null;
}

export default ScrollTop