import {
    ForkKnifeCrossedIcon,
    // BookOpen,
    // Bot,
    // Command,
    // Frame,
    // LifeBuoy,
    // Map,
    // PieChart,
    ListIcon,
    // NetworkIcon,
    // GalleryVerticalIcon,
    // File,
    // FileLock,
    // FileInput,
    // SpellCheck,
    // Users,
    // FileText,
    // Coins,
    // Building2,
    // UserCircle,
    // Wallet,
    // BookA,
    // BookUp2,
    // ListFilter,
    // DiamondPlusIcon,
    Package,
    // Send,
    // Settings2,
    SquareTerminal,
    LayoutDashboard,
    Box,
    Barcode,
    DollarSign,
    Send,
    SparklesIcon,
    PackagePlus,
    Settings,
    Key,
    LoaderPinwheel,
    CalendarClock,
    Clock,
    CalendarCheck,
    Wallet,
    Cpu,
    Users,
    Cog,
    BarChart3,
    Building2Icon,
} from "lucide-react";
export const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    adminMain: [
        {
            title: "Admin",
            items: [
                {
                    title: "Dashboard",
                    url: "/super",
                    icon: SquareTerminal,
                    isActive: true,
                    items: [],
                },
                {
                    title: "Parlours",
                    url: "/super/parlours",
                    icon: ListIcon,
                    items: [],
                },
                {
                    title: "Organization",
                    url: "/super/organization",
                    icon: Building2Icon,
                    items: [], // Adding empty items array to maintain consistency
                },
                {
                    title: "Subscription",
                    url: "/super/subscription",
                    icon: Cpu,
                    items: [], 
                },
            ],
        },
    ],
    navMain: [
        {
            title: "Platform",
            items: [
                {
                    title: "Dashboard",
                    url: "/dashboard",
                    icon: LayoutDashboard,
                    isActive: true,
                    items: [],
                    roles: [ 'admin', 'manager', 'employee' ]
                },
                {
                    title: "Point of Sale",
                    url: "/dashboard/pos",
                    icon: SquareTerminal,
                    isActive: true,
                    items: [],
                    roles: [ 'admin', 'manager', 'employee' ]
                },
                
            ],
        },
        {
            // title: "Configuration",
            title: "Parlour",
            items: [
                {
                    title: "Services",
                    url: "/dashboard/parlour/services",
                    icon: SparklesIcon,
                    roles: [ 'admin', 'manager' ]
                },
                {
                    title: "Bookings",
                    url: "/dashboard/parlour/bookings",
                    icon: CalendarCheck,
                    roles: [ 'admin', 'manager' ]
                },
                {
                    title: "Parlour Settings",
                    url: "/dashboard/parlour/settings",
                    roles: [ 'admin', 'manager' ],
                    icon: Settings,
                },
                {
                    title: "Staff",
                    url: "/dashboard/parlour/staff",
                    roles: [ 'admin', 'manager' ],
                    icon: Users,
                },
                
                
            ],
        },
        {
            // title: "Configuration",
            title: "Finance",
            items: [
                {
                    title: "Transactions",
                    url: "/dashboard/finance/transactions",
                    icon: Wallet,
                    roles: [ 'admin', 'manager' ] 
                },
                {
                    title: "My Subscription",
                    url: "/dashboard/finance/subscription",
                    icon: Cpu,
                    roles: [ 'admin', 'manager' ] 
                },
               
              
            ],
        },
        // {
        //     // title: "Configuration",
        //     title: "Operations",
        //     items: [
        //         {
        //             title: "Listings",
        //             url: "/dashboard/listings",
        //             icon: ListIcon,
        //         },
        //     ],
        // },
    ],
    navSecondary: [
        {
            title: "Profile",
            url: "/dashboard/profile",
            icon: Users,
            roles: [ 'admin', 'manager', 'employee' ] 
          },
        {
            title: "Settings",
            url: "/dashboard/settings",
            icon: Cog,
            roles: [ 'admin', 'manager', 'employee' ] 
          },
    ],
};
