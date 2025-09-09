"use client"
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

const FeaturedCaterers = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);


  return (
    <section 
      ref={sectionRef}
      className={cn(
        "py-16 bg-white section-animate",
        isVisible && "visible"
      )}
    >
      Featured Caterers
    </section>
  );
};

export default FeaturedCaterers;
