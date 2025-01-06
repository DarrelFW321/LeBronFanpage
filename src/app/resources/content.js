import { InlineCode } from "@/once-ui/components";

  
const person = {
    firstName: 'LeBron',
    lastName:  'James',
    get name() {
        return `${this.firstName} ${this.lastName}`;
    },
    role:      'Professional Basketball Player',
    avatar:    '/images/avatar.jpg',
    location:  'America/Toronto',        // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
    languages: []  // optional: Leave the array empty if you don't want to display languages
}

const newsletter = {
    display: true,
    title: <>Subscribe to Darrel's Newsletter for more LeBron news</>,
    description: <>A die-hard sports fan. I occasionally write about LeBron and the NBA, and more.</>
}

const social = [
    // Links are automatically displayed.
    // Import new icons in /once-ui/icons.ts
    {
        name: 'LeBron official Website',
        icon: 'globe',
        link: 'https://www.lebronjames.com/',
    },
    {
        name: 'X',
        icon: 'x',
        link: 'https://x.com/KingJames',
    },
    {
        name: 'Instagram',
        icon: 'instagram',
        link: 'https://www.instagram.com/kingjames/?hl=en',
    },
    {
        name: 'LBF Foundation',
        icon: 'globe',
        link: 'https://www.lebronjamesfamilyfoundation.org/',
    }
]

const home = {
    label: 'Home',
    title: `The King's Court`,
    description: `LeBron James FanPage`,
    headline: <>The King’s Court: Dive into LeBron's Dominances</>,
    subline: <>Stats, Profile, and More</>
}

const about = {
    label: 'Profile',
    title: 'About LeBron James',
    description: `Meet LeBron James`,
    tableOfContent: {
        display: true,
        subItems: false
    },
    avatar: {
        display: true
    },
    calendar: {
        display: false,
        link: 'https://cal.com'
    },
    intro: {
        display: true,
        title: 'Introduction',
        description: <>LeBron James is a globally renowned athlete and philanthropist, celebrated for his unparalleled skills on the basketball court and his dedication to inspiring positive change. With a legacy that transcends sports and 4 championships on his belt, he combines athletic excellence, leadership, and a commitment to empowering communities worldwide.</>,    
    },
    work: {
        display: true, // set to false to hide this section
        title: 'Career',
        experiences: [
            {
                company: `Reaching No.1 on the 30-point games list`,
                timeframe: '2025',
                role: 'Achievement',
                achievements: [
                    <>Surpassed Michael Jordan's record by scoring at least 30 points in a regular-season game for the 563rd time during the Los Angeles Lakers' victory over the Atlanta Hawks.</>,
                    <>Doing so while taking 1200 fewer shots.</>
                ],
                images: [{
                    src: '/images/projects/work1.jpg',
                    alt: 'Lebron and Michael',
                    width: 16,
                    height: 9
                }]
            },
            {
                company: `Olympic Gold Medal with Team USA`,
                timeframe: '2024',
                role: 'Achievement',
                achievements: [
                    <>Secured his third Olympic gold medal with Team USA at the Paris Olympics.</>
                ],
                images: [{
                    src: '/images/projects/work2.jpg',
                    alt: 'Lebron, Steph, and KD',
                    width: 16,
                    height: 9
                }]
            },
            {
                company: `Became the No.1 All-time leading Scorer`,
                timeframe: '2023',
                role: 'Achievement',
                achievements: [
                    <>James scored his 38,388th point in a game against the Oklahoma City Thunder, breaking Abdul-Jabbar's previous record of 38,387 points.</>,
                    <>James scored a 14-foot fadeaway jumper with 10.9 seconds left in the third quarter.</>,
                    <>James needed fewer games to reach the top of the scoring list than Abdul-Jabbar, 1,410 compared to Abdul-Jabbar's 1,560.</>,
                ],
                images: [{
                    src: '/images/projects/work0.jpg',
                    alt: 'Lebron and Kareem',
                    width: 16,
                    height: 9
                }]
            },
            {
                company: `NBA Cup Winner and MVP`,
                timeframe: '2023',
                role: 'Achievement',
                achievements: [
                    <>Led the Los Angeles Lakers to victory in the NBA Cup.</>,
                    <>Earned the NBA Cup MVP award for his outstanding performance.</>
                ],
                images: [{
                    src: '/images/projects/work3.jpg',
                    alt: 'Lebron lifting trophy',
                    width: 16,
                    height: 9
                }]
            },
            {
                company: `NBA 75th Anniversary Team`,
                timeframe: '2021',
                role: 'Recognition',
                achievements: [
                    <>Named to the NBA 75th Anniversary Team, celebrating the league's top players of all time.</>
                ],
                images: [{
                    src: '/images/projects/work4.jpg',
                    alt: 'Lebron',
                    width: 16,
                    height: 9
                }]
            },
            {
                company: `4th NBA Championship and Finals MVP`,
                timeframe: '2020',
                role: 'Achievement',
                achievements: [
                    <>Won his fourth NBA championship with the Los Angeles Lakers.</>,
                    <>Earned the NBA Finals MVP award for his exceptional play during the Finals.</>
                ],
                images: [{
                    src: '/images/projects/work5.jpg',
                    alt: 'Lebron',
                    width: 16,
                    height: 9
                }]
            },
            {
                company: `3rd NBA Championship and Finals MVP`,
                timeframe: '2016',
                role: 'Achievement',
                achievements: [
                    <>Led the Cleveland Cavaliers to their first NBA championship.</>,
                    <>Overcame a 3-1 deficit in the Finals against the Golden State Warriors.</>,
                    <>Named NBA Finals MVP for his dominant performance.</>
                ],
                images: [{
                    src: '/images/projects/work6.jpg',
                    alt: 'Lebron',
                    width: 16,
                    height: 9
                }]
            },
            {
                company: `2nd NBA Chapionships and Finals MVP`,
                timeframe: '2013',
                role: 'Achievement',
                achievements: [
                    <>Won his second NBA championship with the Miami Heat back to back.</>,
                    <>Earned his second NBA Finals MVP award back to back.</>,
                ],
                images:[{
                    src: '/images/projects/work7.jpg',
                    alt: 'Lebron',
                    width: 16,
                    height: 9
                }],
            },
            {
                company: `1st NBA Championship and Finals MVP`,
                timeframe: '2012',
                role: 'Achievement',
                achievements: [
                    <>Won his first NBA championship with the Miami Heat.</>,
                    <>Earned the NBA Finals MVP award for his outstanding play during the Finals.</>,
                    <>Secured his second Olympic gold medal with Team USA at the London Olympics.</>
                ],
                images: [{
                    src: '/images/projects/work8.jpg',
                    alt: 'Lebron',
                    width: 16,
                    height: 9
                }]
            },
            {
                company: `1st NBA MVP Award`,
                timeframe: '2009',
                role: 'Recognition',
                achievements: [
                    <>Received his first NBA Most Valuable Player (MVP) award while playing for the Cleveland Cavaliers.</>
                ],
                images: [{
                    src: '/images/projects/work9.jpg',
                    alt: 'Lebron',
                    width: 16,
                    height: 9
                }]
            },
            {
                company: `NBA Rookie of the Year`,
                timeframe: '2004',
                role: 'Recognition',
                achievements: [
                    <>Named NBA Rookie of the Year after an impressive debut season with the Cleveland Cavaliers.</>
                ],
                images: [{
                    src: '/images/projects/work10.jpg',
                    alt: 'Lebron',
                    width: 9,
                    height: 16,
                }]
            },
            {
                company: `NBA Draft - No. 1 Overall Pick`,
                timeframe: '2003',
                role: 'Milestone',
                achievements: [
                    <>Selected first overall in the NBA Draft by the Cleveland Cavaliers, marking the start of his professional career.</>
                ],
                images: [{
                    src: '/images/projects/work11.jpg',
                    alt: 'Lebron',
                    width: 16,
                    height: 9
                }]
            }
        ],
        
    },
    studies: {
        display: true, // set to false to hide this section
        title: 'Profile',
        institutions: [
            {
                name: 'Current Team',
                description: <>Studied software engineering.</>,
            },
            {
                name: 'Jersey',
                description: <>Studied online marketing and personal branding.</>,
            },
            {
                name: 'Position',
                description: <>Studied online marketing and personal branding.</>,
            },
            {
                name: 'Height',
                description: <>Studied online marketing and personal branding.</>,
            },
            {
                name: 'Weight',
                description: <>Studied online marketing and personal branding.</>,
            },
            {
                name: 'Country',
                description: <>Studied online marketing and personal branding.</>,
            },
            {
                name: 'Highest Education',
                description: <>Studied online marketing and personal branding.</>,
            },
            {
                name: 'Draft',
                description: <>Studied online marketing and personal branding.</>,
            },
            {
                name: 'Experience',
                description: <>Studied online marketing and personal branding.</>,
            }
        ]
    },
    technical: {
        display: true, // set to false to hide this section
        title: 'LBF Foundation',
        skills: [
            {
                title: 'I PROMISE Program',
                description: <>Supports at-risk students in LeBron’s hometown of Akron, Ohio.<br/>
                             Provides scholarships, academic support, and family resources.</>,
                // optional: leave the array empty if you don't want to display images
                images: [
                    {
                        src: '/images/projects/org1.jpg',
                        alt: 'Project image',
                        width: 16,
                        height: 9
                    },
                    {
                        src: '/images/projects/org2.jpg',
                        alt: 'Project image',
                        width: 16,
                        height: 9
                    },
                ]
            },
            {
                title: 'I PROMISE School',
                description: <>A public school established for at-risk children, offering free tuition, meals, and bikes for transportation.</>,
                // optional: leave the array empty if you don't want to display images
                images: [
                    {
                        src: '/images/projects/org3.jpg',
                        alt: 'Project image',
                        width: 16,
                        height: 9
                    },{
                        src: '/images/projects/org4.jpg',
                        alt: 'Project image',
                        width: 16,
                        height: 9
                    },
                ]
            },
            {
                title: 'House Three Thirty',
                description: <>A community hub offering financial literacy programs, job training, and family support services.</>,
                // optional: leave the array empty if you don't want to display images
                images: [
                    {
                        src: '/images/projects/org5.jpg',
                        alt: 'Project image',
                        width: 16,
                        height: 9
                    },
                ]
            },
        ]
    }
}

const blog = {
    label: 'Highlights',
    title: `The King's Legendary Plays.`,
    description: `Dive into the electrifying highlights of LeBron James' career. Relive his iconic dunks, game-winning shots, and unforgettable moments that cemented his legacy as one of basketball's greatest. Witness greatness in every play!`,
    // Create new blog posts by adding a new .mdx file to app/blog/posts
    // All posts will be listed on the /blog route
}

const work = {
    label: 'Stats',
    title: 'Live Stats',
    description: `LeBron James' Live Stats`
    // Create new project pages by adding a new .mdx file to app/blog/posts
    // All projects will be listed on the /home and /work routes
}

const gallery = {
    label: 'Gallery',
    title: 'Gallery',
    description: `A LeBron photo collection`,
    images: [
        { 
            src: '/images/gallery/img-01.jpg', 
            alt: 'image',
            orientation: 'vertical'
        },      
        { 
            src: '/images/gallery/img-02.jpg', 
            alt: 'image',
            orientation: 'vertical'
        },
        { 
            src: '/images/gallery/img-03.jpg', 
            alt: 'image',
            orientation: 'horizontal',
        },
        { 
            src: '/images/gallery/img-04.jpg', 
            alt: 'image',
            orientation: 'horizontal'
        },
        { 
            src: '/images/gallery/img-05.jpg', 
            alt: 'image',
            orientation: 'horizontal'
        },
        { 
            src: '/images/gallery/img-06.jpg', 
            alt: 'image',
            orientation: 'horizontal'
        },
        { 
            src: '/images/gallery/img-07.jpg', 
            alt: 'image',
            orientation: 'vertical'
        },
        { 
            src: '/images/gallery/img-08.jpg', 
            alt: 'image',
            orientation: 'horizontal'
        },
        { 
            src: '/images/gallery/img-09.jpg', 
            alt: 'image',
            orientation: 'horizontal'
        },
        { 
            src: '/images/gallery/img-10.jpg', 
            alt: 'image',
            orientation: 'horizontal'
        },
        { 
            src: '/images/gallery/img-11.jpg', 
            alt: 'image',
            orientation: 'vertical'
        },
        { 
            src: '/images/gallery/img-12.jpg', 
            alt: 'image',
            orientation: 'vertical'
        },
        { 
            src: '/images/gallery/img-13.jpg', 
            alt: 'image',
            orientation: 'horizontal'
        },
        { 
            src: '/images/gallery/img-14.jpg', 
            alt: 'image',
            orientation: 'horizontal'
        },
    ]
}

export { person, social, newsletter, home, about, blog, work, gallery };