import { useEffect, useState } from "react";
import { isMobileViewport } from "../lib/utils";

export const useViewport = (): boolean => {
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        // This code runs only on the client side
        const handleResize = () => setIsMobile(isMobileViewport());

        handleResize(); // Check viewport on initial load
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return isMobile;
};