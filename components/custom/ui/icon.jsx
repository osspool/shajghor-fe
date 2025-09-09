import { 
    Cloud, 
    Zap, 
    Shield, 
    BarChart3, 
    Code, 
    Headphones,
    ChevronRight,
    Menu,
    X,
    ArrowRight,
    CheckCircle,
    Star,
    Users,
    Building,
    Award,
    Target,
    Mail,
    Phone,
    MapPin,
    Linkedin,
    Twitter,
    Github,
    ExternalLink,
    Calendar,
    Clock,
    User,
    Tag,
    Smartphone,
    Brain,
    TrendingUp,
    Settings,
    Lightbulb,
    Check,
    Sparkles,
    Globe,
    Package,
  } from "lucide-react";
  
  const iconMap = {
    cloud: Cloud,
    zap: Zap,
    shield: Shield,
    barChart3: BarChart3,
    code: Code,
    headphones: Headphones,
    chevronRight: ChevronRight,
    menu: Menu,
    x: X,
    arrowRight: ArrowRight,
    checkCircle: CheckCircle,
    star: Star,
    users: Users,
    building: Building,
    award: Award,
    target: Target,
    mail: Mail,
    phone: Phone,
    smartphone: Smartphone,
    mapPin: MapPin,
    linkedin: Linkedin,
    twitter: Twitter,
    github: Github,
    externalLink: ExternalLink,
    calendar: Calendar,
    clock: Clock,
    user: User,
    tag: Tag,
    // Missing icons for solutions
    'brain-circuit': Brain,
    'arrows-up-from-line': TrendingUp,
    'chart-line': BarChart3,
    'cog': Settings,
    lightbulb: Lightbulb,
    check: Check,
    sparkles: Sparkles,
    globe: Globe,
    package: Package,
    trendingUp: TrendingUp
  };
  
  
  
  export function Icon({ name, size = 24, className }) {
    const IconComponent = iconMap[name];
    
    if (!IconComponent) {
      console.warn(`Icon "${name}" not found`);
      return null;
    }
    
    return <IconComponent size={size} className={className} />;
  }