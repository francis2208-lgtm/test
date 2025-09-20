import React from 'react';

const FooterLink: React.FC<{ href?: string; children: React.ReactNode }> = ({ href = '#', children }) => (
    <li>
        <a href={href} className="text-dark-text-secondary hover:text-white transition-colors">
            {children}
        </a>
    </li>
);

const AddressBlock: React.FC<{ title: string; lines: string[]; isContact?: boolean }> = ({ title, lines, isContact = false }) => (
    <div>
        <h4 className="font-bold text-white mb-3">{title}</h4>
        <div className="text-dark-text-secondary space-y-1">
            {lines.map((line, index) => 
                isContact && index === 0 ? 
                <a key={index} href={`mailto:${line}`} className="hover:text-white transition-colors">{line}</a> :
                <p key={index}>{line}</p>
            )}
        </div>
    </div>
);

const Footer = () => {
    return (
        <footer className="mt-8 animate-fadeInUp">
            <div className="h-1 bg-gradient-to-r from-rss-green to-rss-cyan rounded-t-xl" />
            <div className="bg-dark-card rounded-b-xl shadow-2xl shadow-black/30 text-sm">
                <div className="max-w-screen-xl mx-auto py-12 px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
                    {/* Logo */}
                    <div className="lg:col-span-1 pr-4">
                        <h1 className="text-3xl font-bold text-white">
                            Resourcestaff
                        </h1>
                    </div>

                    {/* Links Column 1 */}
                    <div className="mt-4 md:mt-0">
                        <ul className="space-y-3">
                            <FooterLink>Home</FooterLink>
                            <FooterLink>About</FooterLink>
                            <FooterLink>Leadership team</FooterLink>
                            <FooterLink>Sustainability</FooterLink>
                            <FooterLink>Contact</FooterLink>
                        </ul>
                    </div>
                    
                    {/* Links Column 2 */}
                    <div className="mt-4 md:mt-0">
                         <ul className="space-y-3">
                            <FooterLink>Partner with RSS</FooterLink>
                            <FooterLink>Work with RSS</FooterLink>
                            <FooterLink>How RSS works</FooterLink>
                            <FooterLink>Security and disaster recovery</FooterLink>
                        </ul>
                    </div>

                    {/* Addresses */}
                    <div className="mt-4 lg:mt-0 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
                         <div>
                            <AddressBlock title="Philippines HQ" lines={[
                                "4th Floor",
                                "Clark Centre 10 Berthaphil",
                                "Jose Abad Santos Ave",
                                "Clark Freeport Zone",
                                "Pampanga Philippines 2009"
                            ]}/>
                            <div className="mt-6">
                                <AddressBlock title="Perth HQ" lines={[
                                    "Level 3, 41-43 Ord Street",
                                    "West Perth 6005"
                                ]}/>
                            </div>
                        </div>
                        <div>
                             <AddressBlock title="Philippines Aero Park" lines={[
                                "7th Floor",
                                "One West Aeropark",
                                "Clark Freeport Zone",
                                "Gateway Clark Global City",
                                "Pampanga Philippines 2009"
                            ]}/>
                            <div className="mt-6">
                                <AddressBlock title="Contact us" lines={[
                                    "info@resourcestaff.com.au"
                                ]} isContact={true}/>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="border-t border-dark-border">
                    <p className="py-6 text-center text-dark-text-secondary text-xs">
                        Copyright &copy; Resource Staff {new Date().getFullYear()}. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
