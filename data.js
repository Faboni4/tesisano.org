/**
 * Tesi & Sano - Static CMS Data
 * This file contains all the editable content for the site.
 */

const SITE_DATA = {
    general: {
        title: "Tesi & Sano",
        tagline: "A journey to save our planet, one adventure at a time.",
        synopsis: "In a world where nature's balance is tipping, two unlikely friends, Tesi and Sano, embark on a global adventure to understand climate change and protect their home. Blending humor, heart, and hope, 'Tesi & Sano' explores the beauty of our planet and the power of small actions.",
        missionTitle: "Why This Series Matters",
        missionText: "We believe that understanding our environment is the first step to protecting it. Through engaging storytelling and lovable characters, we aim to inspire the next generation of eco-heroes.",
        contactEmail: "hello@tesiandsano.com"
    },
    siteSettings: {
        logoUrl: "https://placehold.co/150x50?text=Tesi+&+Sano"
    },
    heroImages: [
        {
            src: "https://placehold.co/1000x500/81C784/1B5E20?text=Adventure+Awaits",
            alt: "Adventure Awaits"
        },
        {
            src: "https://placehold.co/1000x500/0277BD/FFFFFF?text=Protecting+Nature",
            alt: "Protecting Nature"
        },
        {
            src: "https://placehold.co/1000x500/FFAB00/3E2723?text=Join+Tesi+and+Sano",
            alt: "Join Tesi and Sano"
        }
    ],
    characters: [
        {
            id: "tesi",
            name: "Tesi",
            role: "The Protagonist",
            shortDesc: "A curious and spirited young fox with a nose for trouble and a heart of gold.",
            fullDesc: "Tesi is brimming with energy and optimism. While not always the most practical, Tesi's determination drives the duo forward. Tesi represents the inquisitive spirit of children, always asking 'Why?' and 'What can we do?' when faced with environmental puzzles.",
            image: "https://placehold.co/400x500/81C784/1B5E20?text=Tesi",
            detailImage: "https://placehold.co/800x600/81C784/1B5E20?text=Tesi+Full"
        },
        {
            id: "sano",
            name: "Sano",
            role: "The Wise Companion",
            shortDesc: "A calm and knowledgeable owl who carries the wisdom of the ancient forests.",
            fullDesc: "Sano acts as the voice of reason and scientific knowledge. With a library of facts in his head and a cautious nature, he helps navigate the challenges they face. Sano teaches Tesi (and the audience) about the delicate ecosystems they encounter.",
            image: "https://placehold.co/400x500/4FC3F7/01579B?text=Sano",
            detailImage: "https://placehold.co/800x600/4FC3F7/01579B?text=Sano+Full"
        },
        {
            id: "dr-grime",
            name: "Dr. Grime",
            role: "The Antagonist",
            shortDesc: "A misunderstood inventor whose trash-eating machines are causing more harm than good.",
            fullDesc: "Dr. Grime isn't evil, just misguided. He tries to solve problems with clunky machines that often pollute more than they clean. Through his arc, we learn about sustainable technology and the importance of working *with* nature, not trying to conquer it.",
            image: "https://placehold.co/400x500/E0E0E0/424242?text=Dr.+Grime",
            detailImage: "https://placehold.co/800x600/E0E0E0/424242?text=Dr.+Grime+Full"
        }
    ],
    team: [
        {
            id: "maria-rossi",
            name: "Maria Rossi",
            role: "Director",
            bio: "Award-winning animation director with a passion for environmental storytelling.",
            fullBio: "Maria represents the creative vision of Tesi & Sano. With over 15 years in the animation industry, she has helmed multiple successful children's series. Her love for nature photography heavily influences the show's visual style.",
            image: "https://placehold.co/300x300/FFCC80/E65100?text=Maria",
        },
        {
            id: "john-doe",
            name: "John Doe",
            role: "Lead Animator",
            bio: "Bringing characters to life with 2D hand-drawn magic.",
            fullBio: "John is a master of traditional 2D animation. He ensures that every movement of Tesi and Sano feels organic and full of personality. He leads our team of 10 illustrators and animators.",
            image: "https://placehold.co/300x300/90CAF9/0D47A1?text=John",
        },
        {
            id: "sarah-lee",
            name: "Sarah Lee",
            role: "Writer",
            bio: "Weaving complex climate topics into fun, accessible stories.",
            fullBio: "Sarah has a background in both creative writing and environmental science. This unique combination allows her to craft scripts that are scientifically accurate yet incredibly entertaining for kids.",
            image: "https://placehold.co/300x300/A5D6A7/1B5E20?text=Sarah",
        }
    ],
    gallery: [
        {
            src: "https://placehold.co/800x450/A1887F/3E2723?text=Forest+Concept",
            caption: "The Ancient Forest - Concept Art"
        },
        {
            src: "https://placehold.co/800x450/81D4FA/01579B?text=Ice+Caps",
            caption: "Melting Ice Caps - Background Layout"
        },
        {
            src: "https://placehold.co/800x450/FFAB91/BF360C?text=Character+Lineup",
            caption: "Early Character Lineup"
        },
        {
            src: "https://placehold.co/800x450/FFF59D/F57F17?text=Village+Square",
            caption: "The Village Square - Color Key"
        },
        {
            src: "https://placehold.co/800x450/B39DDB/311B92?text=Night+Sky",
            caption: "Starry Night - Mood Board"
        },
        {
            src: "https://placehold.co/800x450/80CBC4/004D40?text=Underwater",
            caption: "Coral Reef Adventure - Concept"
        }
    ]
};

// Export for usage if using modules, but for simple vanilla setup we'll attach to window or just rely on global scope if loaded as script.
window.SITE_DATA = SITE_DATA;
