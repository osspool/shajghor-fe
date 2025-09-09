"use client";

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-foreground text-white py-4">
            {/* Bottom copyright */}
            <div className="text-center  text-xs">
                <p>© {year} ShajGhor. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
