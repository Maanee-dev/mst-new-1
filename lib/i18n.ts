
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      discover: "Discover",
      planTrip: "Plan Trip",
      stays: "Stays",
      offers: "Offers",
      experiences: "Experiences",
      stories: "Stories",
      discovery: "Discovery",
      contact: "Contact",
      faq: "FAQ",
      about: "About Us",
      search: "Search",
      home: "Home",
      readStory: "Read Our Story",
      contactUs: "Contact Us",
      startJourney: "Start Your Journey Now",
      readMore: "Read More",
      seeAll: "See All",
      bespokeOffer: "Bespoke Offer",
      defaultFeatures: "Bespoke Sanctuary • Private Island",
      hero: {
        subtitle1: "PART 1 — DISCOVER THE ISLANDS",
        subtitle2: "PART 2 — PRIVATE STAYS",
        subtitle3: "PART 3 — RELAX IN STYLE",
        title1: "Find Your",
        title1Alt: "Paradise",
        title2: "Luxury",
        title2Alt: "Beach Villas",
        title3: "Relax on the",
        title3Alt: "Water",
        searchPlaceholder: "Search for your dream escape..."
      },
      philosophy: {
        badge: "Our Agency",
        quote: "Find peace in the beauty of the islands.",
        quoteAuthor: "Island Life",
        title: "The Best Maldives Holidays.",
        subtitle: "We help you plan the perfect escape to one of the most beautiful places on earth.",
        description: "Maldives Serenity Travels is a local travel agency based in Addu City. We focus on personal service to make sure your trip is special. From seaplane transfers to finding your own private beach, we take care of all the details for you."
      },
      vibe: {
        badge: "Dream Trip",
        title: "Choose Your Vibe.",
        quietName: "Quiet",
        quietDesc: "Peaceful places to relax by the ocean.",
        adventureName: "Adventure",
        adventureDesc: "Go diving or try fun water sports.",
        familyName: "Family",
        familyDesc: "Great resorts for kids and adults.",
        romanceName: "Romance",
        romanceDesc: "Perfect spots for couples and honeymoons.",
        exploreBtn: "Explore"
      },
      collection: {
        badge: "Our Portfolio",
        title: "The Top Resorts.",
        description: "We have picked the very best resorts in the Maldives. Every place we offer has great service and total privacy.",
        findVilla: "Find your dream villa."
      },
      journal: {
        badge: "The Journal",
        title: "Travel Tips & Stories."
      },
      instagram: {
        badge: "Social Pulse",
        title: "The Gram.",
        disconnect: "Disconnect",
        connect: "Connect Instagram",
        tryAgain: "Try Again",
        noMedia: "No media found in your feed.",
        connectTitle: "Connect your visual story.",
        connectDesc: "Link your Instagram account to showcase your latest Maldivian moments directly on our sanctuary wall.",
        linkAccount: "Link Account"
      },
      chatbot: {
        welcome: "I am Sara. Describe your Maldivian dream, and I shall manifest it.",
        askSara: "Ask Sara",
        reset: "Reset",
        resetMsg: "Dialogue reset. How may I guide you?",
        authRequired: "Authentication Required",
        authDesc: "To enable Sara's intelligence suite, please select your Gemini API Key.",
        connectSara: "Connect Sara",
        billingRequired: "A billing-enabled project key is required.",
        billingDoc: "Billing Documentation",
        placeholder: "Ask about the atolls...",
        connectToBegin: "Connect Sara to begin",
        version: "Perspective Intelligence v3.5",
        suite: "Intelligence Suite"
      },
      plan: {
        badge: "REQUEST HOLIDAY QUOTES",
        step: "Step",
        next: "Continue",
        back: "Back",
        submit: "Submit Inquiry",
        submitting: "DISPATCHING...",
        successBadge: "Dispatch Received",
        successTitle: "Perspective Awaits.",
        successDesc: "Our specialists are curating your custom Maldivian portfolio. Expect a digital dispatch in your inbox within 24 hours.",
        returnHome: "Return Home",
        q1: "Why are you coming to the Maldives?",
        q2: "What experiences are you most looking forward to?",
        q2Desc: "Please choose up to three experiences or skip by clicking \"No Preferences\".",
        q3: "What do you prefer?",
        q3Desc: "Choose your preferences for the perfect sanctuary.",
        q4: "Preferred Resorts",
        q4Desc: "Search and pick between 3 resorts to refine our recommendations.",
        q5: "Almost there!",
        noResorts: "No resorts selected yet",
        searchPlaceholder: "SEARCH PROPERTY NAME...",
        fullName: "Full Name",
        fullNamePlaceholder: "IDENTITY",
        phone: "Contact Number",
        email: "Email Address",
        emailPlaceholder: "DIGITAL SIGNATURE",
        dates: "Travel Dates",
        datesPlaceholder: "E.G. OCTOBER 2024",
        guests: "Number of Guests",
        mealPlan: "Meal Plan",
        noPreferences: "No Preferences",
        purposes: {
          honeymoon: "Honeymoon",
          anniversary: "Wedding Anniversary",
          couples: "Couples Holiday",
          family: "Family Holiday",
          solo: "Solo Travel",
          group: "Group Holiday"
        },
        experiences: {
          snorkelling: "Snorkelling",
          diving: "Scuba Diving",
          surfing: "Surfing",
          spa: "Spa",
          food: "Food",
          culture: "History & Culture"
        },
        preferences: {
          smallIsland: "Small Island",
          largeIsland: "Large Island",
          luxuryResort: "Luxury Resort",
          affordableResort: "Affordable Resort",
          beachVilla: "Beach Villa",
          waterVilla: "Water Villa",
          pool: "A Villa with a Pool",
          noPool: "No Pool"
        },
        mealPlans: {
          bb: "BED & BREAKFAST",
          hb: "HALF BOARD",
          fb: "FULL BOARD",
          ai: "ALL INCLUSIVE"
        }
      },
      seo: {
        homeTitle: "Maldives Serenity Travels | Luxury Maldives Travel Agency & Bespoke Holidays",
        homeDesc: "Discover the ultimate Maldivian escape with Maldives Serenity Travels. We specialize in luxury Maldives holidays, overwater villas, private island resorts, and bespoke travel experiences. Book your dream vacation in the Indian Ocean today.",
        homeKeywords: "Maldives luxury travel, bespoke Maldives holidays, luxury resorts Maldives, overwater villas Maldives, Maldives travel agency, private island Maldives, Maldives honeymoon packages, luxury travel specialist Maldives, Maldives vacation planning, best resorts in Maldives"
      },
      contactPage: {
        badge: "CONNECT",
        title: "Get in touch.",
        subtitle: "We're here to help you plan your perfect Maldivian escape.",
        callOrWhatsapp: "Call or WhatsApp",
        support: "Support",
        directLine: "Direct Line",
        email: "Email",
        address: "Address",
        form: {
          name: "Name",
          namePlaceholder: "YOUR NAME",
          email: "Email",
          emailPlaceholder: "YOUR EMAIL",
          message: "Message",
          messagePlaceholder: "HOW CAN WE HELP?",
          send: "Send Message",
          successTitle: "Message sent.",
          successDesc: "We'll get back to you within 24 hours.",
          sendAnother: "Send another"
        }
      },
      aboutPage: {
        badge: "Volume 01 — The Heritage",
        heroTitle: "CURATING SILENCE.",
        heroSubtitle: "Maldives Serenity Travels is a boutique agency born from the southern frontier of the archipelago, dedicated to the art of the bespoke journey.",
        exploreBtn: "Explore",
        narrativeBadge: "The Narrative",
        narrativeTitle: "A Passion for the Southern Frontier.",
        narrativeP1: "Maldives Serenity Travels was born from a deep-rooted love for the Maldivian archipelago and a desire to share its most hidden sanctuaries with the world. Based in the southern atolls, we bridge the gap between local intimacy and global luxury standards.",
        narrativeP2: "Our journey began with a simple mission: to provide a level of personalized service that transcends the typical travel booking. We don't just book rooms; we manifest dreams through direct resort partnerships and a meticulous eye for detail.",
        quote: "Luxury is found in the silence of the islands.",
        visionaryBadge: "The Visionary",
        founderName: "Maanee Ali.",
        founderQuote: "\"I grew up in the southern atolls, where the ocean isn't just a view—it's a way of life. I founded Serenity Travels to bring that authentic, quiet luxury to the world. We don't just sell holidays; we share our home.\"",
        founderDesc: "Maanee's deep connections with resort founders and local island councils ensure that Serenity guests receive a level of access and hospitality that is truly unparalleled in the industry.",
        founderTitle: "Founder & CEO",
        missionBadge: "Our Mission",
        missionTitle: "Seamless, Personalized Luxury.",
        missionDesc: "To provide discerning travelers with a seamless and deeply personalized journey to the Maldives, ensuring every stay is a masterpiece of comfort, privacy, and authentic island hospitality.",
        visionBadge: "Our Vision",
        visionTitle: "The Trusted Specialist.",
        visionDesc: "To be recognized as the premier trusted specialist for Maldivian travel, setting the global benchmark for curated island escapes.",
        uspBadge: "The Serenity Edge",
        uspTitle: "What Makes Us Different.",
        pillars: {
          p1Title: "Maldives Specialists",
          p1Desc: "Our team consists of local experts with intimate knowledge of every atoll, ensuring you discover the true, hidden essence of the islands.",
          p2Title: "Direct Resort Partnerships",
          p2Desc: "We maintain direct relationships with the finest resorts, allowing us to offer exclusive privileges and the most competitive rates for our guests.",
          p3Title: "Data-Driven Travel Planning",
          p3Desc: "We leverage deep industry insights and seasonal data to recommend the perfect timing and destination for your specific travel desires.",
          p4Title: "Tailor-Made Experiences",
          p4Desc: "Every itinerary is a blank canvas. We meticulously craft each detail to align with your personal definition of luxury and serenity."
        },
        reviewsBadge: "4.9/5 ON GOOGLE",
        reviewsTitle: "Verified Satisfaction.",
        reviewsSubtitle: "Google Reviews",
        confidenceBadge: "Confidence & Security",
        licenseTitle: "Licensed by the Ministry of Tourism, Republic of Maldives.",
        license1: "Ministry of Tourism",
        license2: "Maldives Registry",
        license3: "Verified Satisfaction",
        license4: "Secure Payments",
        ctaBadge: "Your Journey Awaits",
        ctaTitle: "Manifest Your Maldivian Dream.",
        ctaBtn: "Plan My Trip"
      },
      experiencesPage: {
        badge: "The Perspective",
        title: "Curated Living",
        categories: {
          all: "All",
          adventure: "Adventure",
          wellness: "Wellness",
          waterSports: "Water Sports",
          relaxation: "Relaxation",
          culture: "Culture",
          culinary: "Culinary"
        },
        noResults: "No experiences found for this category.",
        viewResort: "View Resort",
        bookNow: "Book Now"
      },
      faqPage: {
        badge: "Knowledge Base",
        title: "Travel Intelligence",
        categories: {
          planning: "Planning & Arrival",
          islandLife: "Island Life",
          currency: "Currency & Payments",
          health: "Health & Safety"
        }
      },
      offersPage: {
        badge: "The Archive",
        title: "Exclusive Privileges",
        subtitle: "Access our curated archives of the most exclusive holiday deals in the Maldives.",
        filters: {
          search: "Search Offers",
          searchPlaceholder: "Resort or Offer...",
          nights: "Nights",
          category: "Category",
          all: "All"
        },
        viewOffer: "View Offer",
        noResults: "No offers found matching your criteria."
      },
      resortsPage: {
        title: "Maldives Luxury Resorts",
        subtitle: "Explore the world's most exclusive overwater villas and private island sanctuaries. From Noonu to South Ari, find your perfect atoll escape.",
        filters: {
          search: "Search",
          searchPlaceholder: "Resort name...",
          atoll: "Atoll",
          transfer: "Transfer Method",
          all: "All"
        },
        noResults: "No resorts found matching your criteria."
      },
      staysPage: {
        title: "Maldivian Portfolios",
        subtitle: "From ultra-luxury resorts to authentic island guest houses, explore our curated collection of Maldivian stays.",
        tabs: {
          resorts: "Resorts",
          guestHouses: "Guest Houses",
          liveaboards: "Liveaboards"
        },
        filters: {
          search: "Search Portfolios",
          searchPlaceholder: "Resort or Atoll...",
          atoll: "Atoll",
          transfer: "Transfer",
          all: "All"
        },
        loadMore: "Load More Portfolios",
        noResults: "No portfolios found matching your search."
      },
      guestHousesPage: {
        title: "Budget Maldives",
        subtitle: "Authentic guest houses on local islands. Experience bikini beaches, whale shark excursions, and the real Maldivian spirit without the resort price tag.",
        noResults: "No guest houses listed for this island yet."
      },
      storiesPage: {
        badge: "The Journal",
        title: "Perspective",
        categories: {
          all: "All",
          dispatch: "Dispatch",
          guide: "Guide",
          update: "Update",
          tip: "Tip"
        },
        searchPlaceholder: "Search stories...",
        readMore: "Read More",
        noResults: "No stories found matching your search."
      },
      resortDetailPage: {
        backBtn: "Back to Portfolios",
        requestQuote: "Request a Bespoke Quote",
        highlights: "Highlights",
        accommodation: "Accommodation",
        transfer: "Transfer",
        mealPlans: "Meal Plans",
        atoll: "Atoll",
        offers: "Exclusive Privileges",
        experiences: "Curated Experiences",
        faq: "Resort Intelligence",
        similar: "Similar Portfolios",
        form: {
          step1: "Select Dates",
          step2: "Your Details",
          checkIn: "Check In",
          checkOut: "Check Out",
          roomType: "Room Type",
          mealPlan: "Meal Plan",
          fullName: "Full Name",
          email: "Email",
          phone: "Phone",
          country: "Country",
          notes: "Special Requests",
          submit: "Request Quote",
          successTitle: "Inquiry Received.",
          successDesc: "Our specialists will curate your bespoke portfolio and contact you within 24 hours.",
          backToResort: "Back to Resort"
        }
      },
      footer: {
        branding: "A bespoke boutique agency born from the southern frontier of the archipelago. We curate silence and luxury for the discerning traveler.",
        newsletter: {
          title: "The Digital Dispatch",
          subtitle: "Receive seasonal privileges and editorial updates directly.",
          placeholder: "YOUR EMAIL",
          button: "Join"
        },
        nav: {
          agency: "Agency",
          heritage: "Our Heritage",
          journal: "The Journal",
          connect: "Connect",
          careers: "Careers",
          portfolio: "Portfolio",
          luxuryResorts: "Luxury Resorts",
          guestHouses: "Guest Houses",
          liveaboards: "Liveaboards",
          exclusives: "Exclusives",
          governance: "Governance",
          terms: "Terms of Service",
          privacy: "Privacy Policy",
          faq: "Travel FAQ",
          safety: "Safety Protocols",
          social: "Social",
          instagram: "Instagram Feed",
          whatsapp: "WhatsApp Direct",
          twitter: "Twitter (X)",
          linkedin: "LinkedIn"
        },
        office: {
          title: "Our Office",
          hoursTitle: "Mon — Fri"
        }
      }
    }
  },
  zh: {
    translation: {
      discover: "发现",
      planTrip: "计划旅行",
      stays: "住宿",
      offers: "优惠",
      experiences: "体验",
      stories: "故事",
      discovery: "发现",
      contact: "联系我们",
      faq: "常见问题",
      about: "关于我们",
      search: "搜索",
      home: "首页",
      readStory: "阅读我们的故事",
      contactUs: "联系我们",
      startJourney: "现在开始您的旅程",
      readMore: "阅读更多",
      seeAll: "查看全部",
      bespokeOffer: "定制优惠",
      defaultFeatures: "定制避风港 • 私人岛屿",
      hero: {
        subtitle1: "第一部分 — 探索群岛",
        subtitle2: "第二部分 — 私人住宿",
        subtitle3: "第三部分 — 风格放松",
        title1: "寻找您的",
        title1Alt: "天堂",
        title2: "奢华",
        title2Alt: "海滩别墅",
        title3: "在水上",
        title3Alt: "放松",
        searchPlaceholder: "搜索您的梦想逃离..."
      },
      philosophy: {
        badge: "我们的机构",
        quote: "在岛屿的美丽中寻找宁静。",
        quoteAuthor: "岛屿生活",
        title: "最好的马尔代夫假期。",
        subtitle: "我们帮助您计划前往地球上最美丽地方之一的完美逃离。",
        description: "马尔代夫宁静旅游是一家位于阿杜市的当地旅行社。我们专注于个人服务，确保您的旅行与众不同。从水上飞机接送到寻找您自己的私人海滩，我们为您处理所有细节。"
      },
      vibe: {
        badge: "梦想之旅",
        title: "选择您的氛围。",
        quietName: "宁静",
        quietDesc: "在海边放松的宁静场所。",
        adventureName: "冒险",
        adventureDesc: "去潜水或尝试有趣的水上运动。",
        familyName: "家庭",
        familyDesc: "适合儿童和成人的绝佳度假村。",
        romanceName: "浪漫",
        romanceDesc: "适合情侣和蜜月的完美地点。",
        exploreBtn: "探索"
      },
      collection: {
        badge: "我们的投资组合",
        title: "顶级度假村。",
        description: "我们挑选了马尔代夫最好的度假村。我们提供的每个地方都有优质的服务和完全的隐私。",
        findVilla: "寻找您的梦想别墅。"
      },
      journal: {
        badge: "期刊",
        title: "旅行技巧与故事。"
      },
      contactPage: {
        badge: "联系我们",
        title: "保持联系",
        subtitle: "我们在这里帮助您规划完美的马尔代夫之旅。",
        callOrWhatsapp: "电话或 WhatsApp",
        support: "支持",
        directLine: "直线电话",
        email: "电子邮件",
        address: "地址",
        form: {
          name: "姓名",
          namePlaceholder: "您的姓名",
          email: "电子邮件",
          emailPlaceholder: "您的电子邮件",
          message: "留言",
          messagePlaceholder: "我们能为您提供什么帮助？",
          send: "发送留言",
          successTitle: "留言已发送。",
          successDesc: "我们将在24小时内回复您。",
          sendAnother: "发送另一条"
        }
      },
      aboutPage: {
        badge: "第01卷 — 传承",
        heroTitle: "策划宁静。",
        heroSubtitle: "Maldives Serenity Travels 是一家诞生于群岛南部边境的精品代理机构，致力于定制旅程的艺术。",
        exploreBtn: "探索",
        narrativeBadge: "叙事",
        narrativeTitle: "对南部边境的热情。",
        narrativeP1: "Maldives Serenity Travels 诞生于对马尔代夫群岛的深厚热爱，以及向世界分享其最隐秘避难所的愿望。总部位于南部环礁，我们弥合了当地亲密度与全球奢侈标准之间的差距。",
        narrativeP2: "我们的旅程始于一个简单的使命：提供超越典型旅游预订的个性化服务水平。我们不仅预订房间；我们通过直接的度假村合作伙伴关系和对细节的细致关注来实现梦想。",
        quote: "奢侈存在于岛屿的宁静之中。",
        visionaryBadge: "远见者",
        founderName: "Maanee Ali.",
        founderQuote: "\"我在南部环礁长大，那里的海洋不仅是风景，更是一种生活方式。我创立 Serenity Travels 是为了向世界分享这种真实、安静的奢侈。我们不仅销售假期；我们分享我们的家。\"",
        founderDesc: "Maanee 与度假村创始人及当地岛屿委员会的深厚联系，确保 Serenity 的宾客获得业内真正无与伦比的准入水平和待客之道。",
        founderTitle: "创始人兼首席执行官",
        missionBadge: "我们的使命",
        missionTitle: "无缝、个性化的奢侈。",
        missionDesc: "为挑剔的旅行者提供前往马尔代夫的无缝且深度个性化的旅程，确保每次入住都是舒适、隐私和真实岛屿待客之道的杰作。",
        visionBadge: "我们的愿景",
        visionTitle: "值得信赖的专家。",
        visionDesc: "被公认为马尔代夫旅游的首选信赖专家，为精心策划的岛屿逃离设定全球基准。",
        uspBadge: "Serenity 优势",
        uspTitle: "我们的不同之处。",
        pillars: {
          p1Title: "马尔代夫专家",
          p1Desc: "我们的团队由当地专家组成，对每个环礁都有深入的了解，确保您发现岛屿真实、隐藏的本质。",
          p2Title: "直接度假村合作伙伴",
          p2Desc: "我们与最顶级的度假村保持直接关系，使我们能够为宾客提供专属特权和最具竞争力的价格。",
          p3Title: "数据驱动的旅游规划",
          p3Desc: "我们利用深厚的行业见解和季节性数据，为您特定的旅游愿望推荐完美的时机和目的地。",
          p4Title: "量身定制的体验",
          p4Desc: "每份行程都是一张白纸。我们精心打造每个细节，以符合您对奢侈和宁静的个人定义。"
        },
        reviewsBadge: "谷歌评分 4.9/5",
        reviewsTitle: "验证的满意度。",
        reviewsSubtitle: "谷歌评论",
        confidenceBadge: "信心与安全",
        licenseTitle: "由马尔代夫共和国旅游部授权。",
        license1: "旅游部",
        license2: "马尔代夫注册",
        license3: "验证的满意度",
        license4: "安全支付",
        ctaBadge: "您的旅程在等待",
        ctaTitle: "实现您的马尔代夫之梦。",
        ctaBtn: "规划我的行程"
      },
      experiencesPage: {
        badge: "视角",
        title: "精心策划的生活",
        categories: {
          all: "全部",
          adventure: "冒险",
          wellness: "康养",
          waterSports: "水上运动",
          relaxation: "放松",
          culture: "文化",
          culinary: "烹饪"
        },
        noResults: "该类别下未找到相关体验。",
        viewResort: "查看度假村",
        bookNow: "立即预订"
      },
      faqPage: {
        badge: "知识库",
        title: "旅游情报",
        categories: {
          planning: "规划与抵达",
          islandLife: "岛屿生活",
          currency: "货币与支付",
          health: "健康与安全"
        }
      },
      offersPage: {
        badge: "档案",
        title: "专属特权",
        subtitle: "访问我们精心策划的马尔代夫最专属假期优惠档案。",
        filters: {
          search: "搜索优惠",
          searchPlaceholder: "度假村或优惠...",
          nights: "晚数",
          category: "类别",
          all: "全部"
        },
        viewOffer: "查看优惠",
        noResults: "未找到符合您标准的优惠。"
      },
      resortsPage: {
        title: "马尔代夫奢侈度假村",
        subtitle: "探索世界上最专属的水上别墅和私人岛屿避难所。从诺努到南阿里，找到您完美的环礁逃离。",
        filters: {
          search: "搜索",
          searchPlaceholder: "度假村名称...",
          atoll: "环礁",
          transfer: "交通方式",
          all: "全部"
        },
        noResults: "未找到符合您标准的度假村。"
      },
      staysPage: {
        title: "马尔代夫投资组合",
        subtitle: "从超豪华度假村到真实的岛屿客栈，探索我们精心策划的马尔代夫住宿系列。",
        tabs: {
          resorts: "度假村",
          guestHouses: "客栈",
          liveaboards: "船宿"
        },
        filters: {
          search: "搜索投资组合",
          searchPlaceholder: "度假村或环礁...",
          atoll: "环礁",
          transfer: "交通",
          all: "全部"
        },
        loadMore: "加载更多投资组合",
        noResults: "未找到符合您搜索条件的投资组合。"
      },
      guestHousesPage: {
        title: "马尔代夫预算之旅",
        subtitle: "当地岛屿上的真实客栈。体验比基尼海滩、鲸鲨远足和真正的马尔代夫精神，而无需支付度假村的价格。",
        noResults: "该岛屿尚未列出客栈。"
      },
      storiesPage: {
        badge: "期刊",
        title: "视角",
        categories: {
          all: "全部",
          dispatch: "简报",
          guide: "指南",
          update: "更新",
          tip: "贴士"
        },
        searchPlaceholder: "搜索故事...",
        readMore: "阅读更多",
        noResults: "未找到符合您搜索条件的故事。"
      },
      resortDetailPage: {
        backBtn: "返回投资组合",
        requestQuote: "索取定制报价",
        highlights: "亮点",
        accommodation: "住宿",
        transfer: "交通",
        mealPlans: "餐饮计划",
        atoll: "环礁",
        offers: "专属特权",
        experiences: "精心策划的体验",
        faq: "度假村情报",
        similar: "类似投资组合",
        form: {
          step1: "选择日期",
          step2: "您的详情",
          checkIn: "入住",
          checkOut: "退房",
          roomType: "房型",
          mealPlan: "餐饮计划",
          fullName: "全名",
          email: "电子邮件",
          phone: "电话",
          country: "国家",
          notes: "特殊要求",
          submit: "索取报价",
          successTitle: "已收到咨询。",
          successDesc: "我们的专家将策划您的定制投资组合，并在24小时内与您联系。",
          backToResort: "返回度假村"
        }
      },
      footer: {
        branding: "一家诞生于群岛南部边境的定制精品机构。我们为挑剔的旅行者策划宁静与奢华。",
        newsletter: {
          title: "数字快报",
          subtitle: "直接接收季节性特权和编辑更新。",
          placeholder: "您的电子邮件",
          button: "加入"
        },
        nav: {
          agency: "机构",
          heritage: "我们的遗产",
          journal: "期刊",
          connect: "联系",
          careers: "职业",
          portfolio: "投资组合",
          luxuryResorts: "奢华度假村",
          guestHouses: "旅馆",
          liveaboards: "船宿",
          exclusives: "独家",
          governance: "治理",
          terms: "服务条款",
          privacy: "隐私政策",
          faq: "旅行常见问题",
          safety: "安全协议",
          social: "社交",
          instagram: "Instagram 动态",
          whatsapp: "WhatsApp 直连",
          twitter: "Twitter (X)",
          linkedin: "领英"
        },
        office: {
          title: "我们的办公室",
          hoursTitle: "周一 — 周五"
        }
      }
    }
  },
  ru: {
    translation: {
      discover: "Откройте",
      planTrip: "План поездки",
      stays: "Проживание",
      offers: "Предложения",
      experiences: "Впечатления",
      stories: "Истории",
      discovery: "Откройте",
      contact: "Контакт",
      faq: "FAQ",
      about: "О нас",
      search: "Поиск",
      home: "Главная",
      readStory: "Наша история",
      contactUs: "Связаться с нами",
      startJourney: "Начните свое путешествие",
      readMore: "Читать далее",
      seeAll: "Посмотреть все",
      bespokeOffer: "Индивидуальное предложение",
      defaultFeatures: "Индивидуальное убежище • Частный остров",
      hero: {
        subtitle1: "ЧАСТЬ 1 — ОТКРОЙТЕ ДЛЯ СЕБЯ ОСТРОВА",
        subtitle2: "ЧАСТЬ 2 — ЧАСТНОЕ ПРОЖИВАНИЕ",
        subtitle3: "ЧАСТЬ 3 — ОТДЫХ СО ВКУСОМ",
        title1: "Найдите свой",
        title1Alt: "Рай",
        title2: "Роскошные",
        title2Alt: "Пляжные виллы",
        title3: "Отдых на",
        title3Alt: "Воде",
        searchPlaceholder: "Поиск вашего идеального отдыха..."
      },
      philosophy: {
        badge: "Наше агентство",
        quote: "Найдите покой в красоте островов.",
        quoteAuthor: "Островная жизнь",
        title: "Лучший отдых на Мальдивах.",
        subtitle: "Мы поможем вам спланировать идеальный побег в одно из самых красивых мест на земле.",
        description: "Maldives Serenity Travels — это местное туристическое агентство, базирующееся в Адду-Сити. Мы ориентируемся на индивидуальный подход, чтобы сделать вашу поездку особенной. От трансфера на гидросамолете до поиска собственного частного пляжа — мы позаботимся обо всех деталях за вас."
      },
      vibe: {
        badge: "Поездка мечты",
        title: "Выберите свою атмосферу.",
        quietName: "Тишина",
        quietDesc: "Спокойные места для отдыха у океана.",
        adventureName: "Приключения",
        adventureDesc: "Займитесь дайвингом или попробуйте водные виды спорта.",
        familyName: "Семья",
        familyDesc: "Отличные курорты для детей и взрослых.",
        romanceName: "Романтика",
        romanceDesc: "Идеальные места для пар и медового месяца.",
        exploreBtn: "Исследовать"
      },
      collection: {
        badge: "Наше портфолио",
        title: "Лучшие курорты.",
        description: "Мы отобрали самые лучшие курорты на Мальдивах. В каждом месте, которое мы предлагаем, отличный сервис и полная конфиденциальность.",
        findVilla: "Найдите виллу своей мечты."
      },
      journal: {
        badge: "Мальдивский журнал",
        title: "Островные истории.",
        subtitle: "Откройте для себя лучшие секреты, советы путешественникам и истории о Мальдивах."
      },
      instagram: {
        badge: "Социальный пульс",
        title: "Социальные сети.",
        disconnect: "Отключить",
        connect: "Подключить Instagram",
        tryAgain: "Попробовать снова",
        noMedia: "Медиа не найдено",
        connectTitle: "Подключите свой мир",
        connectDesc: "Синхронизируйте свою ленту Instagram со своим мальдивским портфолио.",
        linkAccount: "Связать аккаунт"
      },
      chatbot: {
        welcome: "Я Сара. Опишите свою мальдивскую мечту, и я ее воплощу.",
        askSara: "Спросить Сару",
        reset: "Сброс",
        resetMsg: "Диалог сброшен. Как я могу вам помочь?",
        authRequired: "Требуется аутентификация",
        authDesc: "Чтобы включить интеллектуальный пакет Сары, выберите свой API-ключ Gemini.",
        connectSara: "Подключить Сару",
        billingRequired: "Требуется ключ проекта с включенной оплатой.",
        billingDoc: "Документация по оплате",
        placeholder: "Спросите об атоллах...",
        connectToBegin: "Подключите Сару, чтобы начать",
        version: "Perspective Intelligence v3.5",
        suite: "Интеллектуальный пакет"
      },
      plan: {
        badge: "ЗАПРОСИТЬ ПРЕДЛОЖЕНИЕ",
        step: "Шаг",
        next: "Продолжить",
        back: "Назад",
        submit: "Отправить запрос",
        submitting: "ОТПРАВКА...",
        successBadge: "Запрос получен",
        successTitle: "Перспектива ждет.",
        successDesc: "Наши специалисты готовят ваше индивидуальное мальдивское портфолио. Ожидайте цифровое сообщение на вашу почту в течение 24 часов.",
        returnHome: "Вернуться на главную",
        q1: "Почему вы едете на Мальдивы?",
        q2: "Какие впечатления вы ждете больше всего?",
        q2Desc: "Выберите до трех впечатлений или пропустите, нажав «Без предпочтений».",
        q3: "Что вы предпочитаете?",
        q3Desc: "Выберите свои предпочтения для идеального убежища.",
        q4: "Предпочитаемые курорты",
        q4Desc: "Найдите и выберите до 3 курортов, чтобы уточнить наши рекомендации.",
        q5: "Почти готово!",
        noResorts: "Курорты еще не выбраны",
        searchPlaceholder: "ПОИСК ПО НАЗВАНИЮ...",
        fullName: "Полное имя",
        fullNamePlaceholder: "ЛИЧНОСТЬ",
        phone: "Контактный номер",
        email: "Адрес эл. почты",
        emailPlaceholder: "ЦИФРОВАЯ ПОДПИСЬ",
        dates: "Даты поездки",
        datesPlaceholder: "НАПР. ОКТЯБРЬ 2024",
        guests: "Количество гостей",
        mealPlan: "План питания",
        noPreferences: "Без предпочтений",
        purposes: {
          honeymoon: "Медовый месяц",
          anniversary: "Годовщина свадьбы",
          couples: "Отдых для пар",
          family: "Семейный отдых",
          solo: "Одиночное путешествие",
          group: "Групповой отдых"
        },
        experiences: {
          snorkelling: "Сноркелинг",
          diving: "Дайвинг",
          surfing: "Серфинг",
          spa: "Спа",
          food: "Еда",
          culture: "История и культура"
        },
        preferences: {
          smallIsland: "Маленький остров",
          largeIsland: "Большой остров",
          luxuryResort: "Роскошный курорт",
          affordableResort: "Доступный курорт",
          beachVilla: "Вилла на пляже",
          waterVilla: "Вилла на воде",
          pool: "Вилла с бассейном",
          noPool: "Без бассейна"
        },
        mealPlans: {
          bb: "ЗАВТРАК",
          hb: "ПОЛУПАНСИОН",
          fb: "ПОЛНЫЙ ПАНСИОН",
          ai: "ВСЕ ВКЛЮЧЕНО"
        }
      },
      seo: {
        homeTitle: "Maldives Serenity Travels | Лучший роскошный отдых",
        homeDesc: "Спланируйте свой идеальный отдых на Мальдивах с нами. Мы предлагаем лучшие роскошные курорты, виллы на воде и пакеты для семейного отдыха."
      },
      contactPage: {
        badge: "СВЯЗЬ",
        title: "Свяжитесь с нами.",
        subtitle: "Мы здесь, чтобы помочь вам спланировать идеальную поездку на Мальдивы.",
        callOrWhatsapp: "Звонок или WhatsApp",
        support: "Поддержка",
        directLine: "Прямая линия",
        email: "Email",
        address: "Адрес",
        form: {
          name: "Имя",
          namePlaceholder: "ВАШЕ ИМЯ",
          email: "Email",
          emailPlaceholder: "ВАШ EMAIL",
          message: "Сообщение",
          messagePlaceholder: "КАК МЫ МОЖЕМ ВАМ ПОМОЧЬ?",
          send: "Отправить сообщение",
          successTitle: "Сообщение отправлено.",
          successDesc: "Мы ответим вам в течение 24 часов.",
          sendAnother: "Отправить еще одно"
        }
      },
      aboutPage: {
        badge: "Том 01 — Наследие",
        heroTitle: "КУРИРУЕМ ТИШИНУ.",
        heroSubtitle: "Maldives Serenity Travels — это бутик-агентство, рожденное на южных рубежах архипелага, посвященное искусству индивидуальных путешествий.",
        exploreBtn: "Исследовать",
        narrativeBadge: "Повествование",
        narrativeTitle: "Страсть к южным рубежам.",
        narrativeP1: "Maldives Serenity Travels родилось из глубокой любви к Мальдивскому архипелагу и желания поделиться его самыми скрытыми святилищами с миром. Базируясь на южных атоллах, мы преодолеваем разрыв между местной близостью и мировыми стандартами роскоши.",
        narrativeP2: "Наш путь начался с простой миссии: обеспечить уровень персонализированного обслуживания, который превосходит типичное бронирование путешествий. Мы не просто бронируем номера; мы воплощаем мечты через прямые партнерские отношения с курортами и тщательное внимание к деталям.",
        quote: "Роскошь обретается в тишине островов.",
        visionaryBadge: "Визионер",
        founderName: "Маани Али.",
        founderQuote: "\"Я вырос на южных атоллах, где океан — это не просто вид, это образ жизни. Я основал Serenity Travels, чтобы открыть миру эту подлинную, тихую роскошь. Мы не просто продаем отдых; мы делимся своим домом.\"",
        founderDesc: "Глубокие связи Маани с основателями курортов и местными советами островов гарантируют гостям Serenity уровень доступа и гостеприимства, который поистине не имеет аналогов в отрасли.",
        founderTitle: "Основатель и генеральный директор",
        missionBadge: "Наша миссия",
        missionTitle: "Безупречная, персонализированная роскошь.",
        missionDesc: "Обеспечить взыскательным путешественникам безупречное и глубоко персонализированное путешествие на Мальдивы, гарантируя, что каждое пребывание станет шедевром комфорта, уединения и подлинного островного гостеприимства.",
        visionBadge: "Наше видение",
        visionTitle: "Доверенный специалист.",
        visionDesc: "Быть признанным ведущим доверенным специалистом по путешествиям на Мальдивы, устанавливая глобальный стандарт для курируемого островного отдыха.",
        uspBadge: "Преимущество Serenity",
        uspTitle: "Что отличает нас.",
        pillars: {
          p1Title: "Специалисты по Мальдивам",
          p1Desc: "Наша команда состоит из местных экспертов с глубоким знанием каждого атолла, что гарантирует вам открытие истинной, скрытой сущности островов.",
          p2Title: "Прямые партнерства с курортами",
          p2Desc: "Мы поддерживаем прямые отношения с лучшими курортами, что позволяет нам предлагать эксклюзивные привилегии и самые конкурентоспособные цены для наших гостей.",
          p3Title: "Планирование на основе данных",
          p3Desc: "Мы используем глубокие отраслевые знания и сезонные данные, чтобы рекомендовать идеальное время и направление для ваших конкретных желаний.",
          p4Title: "Индивидуальные впечатления",
          p4Desc: "Каждый маршрут — это чистый холст. Мы тщательно прорабатываем каждую деталь, чтобы она соответствовала вашему личному определению роскоши и спокойствия."
        },
        reviewsBadge: "4.9/5 В GOOGLE",
        reviewsTitle: "Подтвержденная удовлетворенность.",
        reviewsSubtitle: "Отзывы в Google",
        confidenceBadge: "Уверенность и безопасность",
        licenseTitle: "Лицензировано Министерством туризма Республики Мальдивы.",
        license1: "Министерство туризма",
        license2: "Реестр Мальдив",
        license3: "Подтвержденная удовлетворенность",
        license4: "Безопасные платежи",
        ctaBadge: "Ваше путешествие ждет",
        ctaTitle: "Воплотите свою мальдивскую мечту.",
        ctaBtn: "Спланировать поездку"
      },
      experiencesPage: {
        badge: "Перспектива",
        title: "Курируемая жизнь",
        categories: {
          all: "Все",
          adventure: "Приключения",
          wellness: "Велнес",
          waterSports: "Водный спорт",
          relaxation: "Релаксация",
          culture: "Культура",
          culinary: "Кулинария"
        },
        noResults: "В этой категории впечатлений не найдено.",
        viewResort: "Посмотреть курорт",
        bookNow: "Забронировать"
      },
      faqPage: {
        badge: "База знаний",
        title: "Информация для путешествий",
        categories: {
          planning: "Планирование и прибытие",
          islandLife: "Жизнь на острове",
          currency: "Валюта и платежи",
          health: "Здоровье и безопасность"
        }
      },
      offersPage: {
        badge: "Архив",
        title: "Эксклюзивные привилегии",
        subtitle: "Доступ к нашим курируемым архивам самых эксклюзивных предложений отдыха на Мальдивах.",
        filters: {
          search: "Поиск предложений",
          searchPlaceholder: "Курорт или предложение...",
          nights: "Ночи",
          category: "Категория",
          all: "Все"
        },
        viewOffer: "Посмотреть предложение",
        noResults: "Предложений, соответствующих вашим критериям, не найдено."
      },
      resortsPage: {
        title: "Роскошные курорты Мальдив",
        subtitle: "Исследуйте самые эксклюзивные водные виллы и частные островные святилища в мире. От Нуну до Южного Ари, найдите свой идеальный атолл.",
        filters: {
          search: "Поиск",
          searchPlaceholder: "Название курорта...",
          atoll: "Атолл",
          transfer: "Способ трансфера",
          all: "Все"
        },
        noResults: "Курортов, соответствующих вашим критериям, не найдено."
      },
      staysPage: {
        title: "Мальдивские портфолио",
        subtitle: "От ультра-роскошных курортов до аутентичных островных гостевых домов — исследуйте нашу курируемую коллекцию мальдивского жилья.",
        tabs: {
          resorts: "Курорты",
          guestHouses: "Гостевые дома",
          liveaboards: "Ливаборды"
        },
        filters: {
          search: "Поиск портфолио",
          searchPlaceholder: "Курорт или атолл...",
          atoll: "Атолл",
          transfer: "Трансфер",
          all: "Все"
        },
        loadMore: "Загрузить больше",
        noResults: "Портфолио, соответствующих вашему поиску, не найдено."
      },
      guestHousesPage: {
        title: "Бюджетные Мальдивы",
        subtitle: "Аутентичные гостевые дома на местных островах. Испытайте бикини-пляжи, экскурсии к китовым акулам и настоящий мальдивский дух без цен курортов.",
        noResults: "Для этого острова гостевые дома пока не указаны."
      },
      storiesPage: {
        badge: "Журнал",
        title: "Перспектива",
        categories: {
          all: "Все",
          dispatch: "Депеша",
          guide: "Гид",
          update: "Обновление",
          tip: "Совет"
        },
        searchPlaceholder: "Поиск историй...",
        readMore: "Читать далее",
        noResults: "Историй, соответствующих вашему поиску, не найдено."
      },
      resortDetailPage: {
        backBtn: "Назад к портфолио",
        requestQuote: "Запросить индивидуальное предложение",
        highlights: "Особенности",
        accommodation: "Размещение",
        transfer: "Трансфер",
        mealPlans: "Питание",
        atoll: "Атолл",
        offers: "Эксклюзивные привилегии",
        experiences: "Курируемые впечатления",
        faq: "Информация о курорте",
        similar: "Похожие портфолио",
        form: {
          step1: "Выберите даты",
          step2: "Ваши данные",
          checkIn: "Заезд",
          checkOut: "Выезд",
          roomType: "Тип номера",
          mealPlan: "План питания",
          fullName: "Полное имя",
          email: "Email",
          phone: "Телефон",
          country: "Страна",
          notes: "Особые пожелания",
          submit: "Запросить предложение",
          successTitle: "Запрос получен.",
          successDesc: "Наши специалисты составят ваше индивидуальное портфолио и свяжутся с вами в течение 24 часов.",
          backToResort: "Назад к курорту"
        }
      },
      footer: {
        branding: "Индивидуальное бутик-агентство, рожденное на южных рубежах архипелага. Мы создаем тишину и роскошь для взыскательных путешественников.",
        newsletter: {
          title: "Цифровой вестник",
          subtitle: "Получайте сезонные привилегии и редакционные обновления напрямую.",
          placeholder: "ВАШ EMAIL",
          button: "Присоединиться"
        },
        nav: {
          agency: "Агентство",
          heritage: "Наше наследие",
          journal: "Журнал",
          connect: "Связаться",
          careers: "Карьера",
          portfolio: "Портфолио",
          luxuryResorts: "Роскошные курорты",
          guestHouses: "Гестхаусы",
          liveaboards: "Сафари-яхты",
          exclusives: "Эксклюзивы",
          governance: "Управление",
          terms: "Условия обслуживания",
          privacy: "Политика конфиденциальности",
          faq: "Часто задаваемые вопросы",
          safety: "Протоколы безопасности",
          social: "Социальные сети",
          instagram: "Instagram",
          whatsapp: "WhatsApp",
          twitter: "Twitter (X)",
          linkedin: "LinkedIn"
        },
        office: {
          title: "Наш офис",
          hoursTitle: "Пн — Пт"
        }
      }
    }
  },
  de: {
    translation: {
      discover: "Entdecken",
      planTrip: "Reise planen",
      stays: "Unterkünfte",
      offers: "Angebote",
      experiences: "Erlebnisse",
      stories: "Geschichten",
      contact: "Kontakt",
      faq: "FAQ",
      about: "Über uns",
      search: "Suche",
      home: "Startseite",
      readStory: "Unsere Geschichte",
      contactUs: "Kontaktieren Sie uns",
      startJourney: "Beginnen Sie Ihre Reise",
      readMore: "Mehr lesen",
      seeAll: "Alle ansehen",
      bespokeOffer: "Maßgeschneidertes Angebot",
      defaultFeatures: "Maßgeschneiderter Rückzugsort • Privatinsel",
      hero: {
        subtitle1: "TEIL 1 — ENTDECKEN SIE DIE INSELN",
        subtitle2: "TEIL 2 — PRIVATE AUFENTHALTE",
        subtitle3: "TEIL 3 — ENTSPANNT REISEN",
        title1: "Finden Sie Ihr",
        title1Alt: "Paradies",
        title2: "Luxuriöse",
        title2Alt: "Strandvillen",
        title3: "Entspannen am",
        title3Alt: "Wasser",
        searchPlaceholder: "Suchen Sie nach Ihrem Traumziel..."
      },
      philosophy: {
        badge: "Unsere Agentur",
        quote: "Finden Sie Ruhe in der Schönheit der Inseln.",
        quoteAuthor: "Inselleben",
        title: "Der beste Malediven-Urlaub.",
        subtitle: "Wir helfen Ihnen, die perfekte Flucht an einen der schönsten Orte der Welt zu planen.",
        description: "Maldives Serenity Travels ist eine lokale Reiseagentur mit Sitz in Addu City. Wir konzentrieren uns auf persönlichen Service, um Ihre Reise zu etwas Besonderem zu machen. Vom Transfer mit dem Wasserflugzeug bis hin zur Suche nach Ihrem eigenen Privatstrand kümmern wir uns um alle Details für Sie."
      },
      vibe: {
        badge: "Traumreise",
        title: "Wählen Sie Ihren Vibe.",
        quietName: "Ruhe",
        quietDesc: "Friedliche Orte zum Entspannen am Ozean.",
        adventureName: "Abenteuer",
        adventureDesc: "Tauchen Sie ab oder probieren Sie Wassersport aus.",
        familyName: "Familie",
        familyDesc: "Tolle Resorts für Kinder und Erwachsene.",
        romanceName: "Romantik",
        romanceDesc: "Perfekte Orte für Paare und Flitterwochen.",
        exploreBtn: "Entdecken"
      },
      collection: {
        badge: "Unser Portfolio",
        title: "Die besten Resorts.",
        description: "Wir haben die allerbesten Resorts auf den Malediven ausgewählt. Jeder Ort, den wir anbieten, bietet exzellenten Service und absolute Privatsphäre.",
        findVilla: "Finden Sie Ihre Traumvilla."
      },
      journal: {
        badge: "Malediven-Journal",
        title: "Inselgeschichten.",
        subtitle: "Entdecken Sie die besten Geheimnisse, Reisetipps und Geschichten über die Malediven."
      },
      instagram: {
        badge: "Social Pulse",
        title: "Soziale Medien.",
        disconnect: "Trennen",
        connect: "Instagram verbinden",
        tryAgain: "Erneut versuchen",
        noMedia: "Keine Medien gefunden",
        connectTitle: "Verbinden Sie Ihre Welt",
        connectDesc: "Synchronisieren Sie Ihren Instagram-Feed mit Ihrem Malediven-Portfolio.",
        linkAccount: "Konto verknüpfen"
      },
      chatbot: {
        welcome: "Ich bin Sara. Beschreiben Sie Ihren maledivischen Traum, und ich werde ihn verwirklichen.",
        askSara: "Sara fragen",
        reset: "Zurücksetzen",
        resetMsg: "Dialog zurückgesetzt. Wie kann ich Sie führen?",
        authRequired: "Authentifizierung erforderlich",
        authDesc: "Um Saras Intelligenz-Suite zu aktivieren, wählen Sie bitte Ihren Gemini API-Key aus.",
        connectSara: "Sara verbinden",
        billingRequired: "Ein abrechnungsfähiger Projekt-Key ist erforderlich.",
        billingDoc: "Abrechnungsdokumentation",
        placeholder: "Fragen Sie nach den Atollen...",
        connectToBegin: "Verbinden Sie Sara, um zu beginnen",
        version: "Perspective Intelligence v3.5",
        suite: "Intelligenz-Suite"
      },
      plan: {
        badge: "URLAUBSANGEBOTE ANFORDERN",
        step: "Schritt",
        next: "Weiter",
        back: "Zurück",
        submit: "Anfrage senden",
        submitting: "WIRD GESENDET...",
        successBadge: "Anfrage erhalten",
        successTitle: "Perspektive erwartet Sie.",
        successDesc: "Unsere Spezialisten erstellen Ihr individuelles Malediven-Portfolio. Erwarten Sie innerhalb von 24 Stunden eine digitale Nachricht in Ihrem Posteingang.",
        returnHome: "Zurück zur Startseite",
        q1: "Warum kommen Sie auf die Malediven?",
        q2: "Auf welche Erlebnisse freuen Sie sich am meisten?",
        q2Desc: "Bitte wählen Sie bis zu drei Erlebnisse aus oder überspringen Sie mit „Keine Präferenzen“.",
        q3: "Was bevorzugen Sie?",
        q3Desc: "Wählen Sie Ihre Präferenzen für den perfekten Rückzugsort.",
        q4: "Bevorzugte Resorts",
        q4Desc: "Suchen und wählen Sie zwischen 3 Resorts, um unsere Empfehlungen zu verfeinern.",
        q5: "Fast geschafft!",
        noResorts: "Noch keine Resorts ausgewählt",
        searchPlaceholder: "IMMOBILIENNAME SUCHEN...",
        fullName: "Vollständiger Name",
        fullNamePlaceholder: "IDENTITÄT",
        phone: "Kontaktnummer",
        email: "E-Mail-Adresse",
        emailPlaceholder: "DIGITALE SIGNATUR",
        dates: "Reisedaten",
        datesPlaceholder: "Z.B. OKTOBER 2024",
        guests: "Anzahl der Gäste",
        mealPlan: "Verpflegung",
        noPreferences: "Keine Präferenzen",
        purposes: {
          honeymoon: "Flitterwochen",
          anniversary: "Hochzeitstag",
          couples: "Urlaub für Paare",
          family: "Familienurlaub",
          solo: "Alleinreise",
          group: "Gruppenreise"
        },
        experiences: {
          snorkelling: "Schnorcheln",
          diving: "Tauchen",
          surfing: "Surfen",
          spa: "Spa",
          food: "Essen",
          culture: "Geschichte & Kultur"
        },
        preferences: {
          smallIsland: "Kleine Insel",
          largeIsland: "Große Insel",
          luxuryResort: "Luxus-Resort",
          affordableResort: "Preiswertes Resort",
          beachVilla: "Strandvilla",
          waterVilla: "Wasservilla",
          pool: "Villa mit Pool",
          noPool: "Kein Pool"
        },
        mealPlans: {
          bb: "ÜBERNACHTUNG/FRÜHSTÜCK",
          hb: "HALBPENSION",
          fb: "VOLLPENSION",
          ai: "ALL INCLUSIVE"
        }
      },
      seo: {
        homeTitle: "Maldives Serenity Travels | Beste Luxusreisen",
        homeDesc: "Planen Sie mit uns Ihren perfekten Malediven-Urlaub. Wir bieten die besten Luxus-Resorts, Wasservillen und Familienurlaubspakete."
      },
      contactPage: {
        badge: "KONTAKT",
        title: "Kontaktieren Sie uns.",
        subtitle: "Wir sind hier, um Ihnen bei der Planung Ihres perfekten Malediven-Urlaubs zu helfen.",
        callOrWhatsapp: "Anruf oder WhatsApp",
        support: "Support",
        directLine: "Direktwahl",
        email: "E-Mail",
        address: "Adresse",
        form: {
          name: "Name",
          namePlaceholder: "IHR NAME",
          email: "E-Mail",
          emailPlaceholder: "IHRE E-MAIL",
          message: "Nachricht",
          messagePlaceholder: "WIE KÖNNEN WIR IHNEN HELFEN?",
          send: "Nachricht senden",
          successTitle: "Nachricht gesendet.",
          successDesc: "Wir werden uns innerhalb von 24 Stunden bei Ihnen melden.",
          sendAnother: "Weitere senden"
        }
      },
      footer: {
        branding: "Eine maßgeschneiderte Boutique-Agentur, entstanden an der südlichen Grenze des Archipels. Wir kuratieren Stille und Luxus für den anspruchsvollen Reisenden.",
        newsletter: {
          title: "Der digitale Dispatch",
          subtitle: "Erhalten Sie saisonale Privilegien und redaktionelle Updates direkt.",
          placeholder: "IHRE E-MAIL",
          button: "Beitreten"
        },
        nav: {
          agency: "Agentur",
          heritage: "Unser Erbe",
          journal: "Das Journal",
          connect: "Kontakt",
          careers: "Karriere",
          portfolio: "Portfolio",
          luxuryResorts: "Luxus-Resorts",
          guestHouses: "Gästehäuser",
          liveaboards: "Safari-Boote",
          exclusives: "Exklusivangebote",
          governance: "Governance",
          terms: "Nutzungsbedingungen",
          privacy: "Datenschutz",
          faq: "Reise-FAQ",
          safety: "Sicherheitsprotokolle",
          social: "Soziales",
          instagram: "Instagram Feed",
          whatsapp: "WhatsApp Direkt",
          twitter: "Twitter (X)",
          linkedin: "LinkedIn"
        },
        office: {
          title: "Unser Büro",
          hoursTitle: "Mo — Fr"
        }
      }
    }
  },
  ar: {
    translation: {
      discover: "اكتشف",
      planTrip: "خطط لرحلتك",
      stays: "الإقامة",
      offers: "العروض",
      experiences: "التجارب",
      stories: "القصص",
      contact: "اتصل بنا",
      faq: "الأسئلة الشائعة",
      about: "من نحن",
      search: "بحث",
      home: "الرئيسية",
      readStory: "اقرأ قصتنا",
      contactUs: "اتصل بنا",
      startJourney: "ابدأ رحلتك الآن",
      readMore: "اقرأ المزيد",
      seeAll: "عرض الكل",
      bespokeOffer: "عرض مخصص",
      defaultFeatures: "ملاذ مخصص • جزيرة خاصة",
      hero: {
        subtitle1: "الجزء 1 — اكتشف الجزر",
        subtitle2: "الجزء 2 — إقامات خاصة",
        subtitle3: "الجزء 3 — استرخِ بأناقة",
        title1: "ابحث عن",
        title1Alt: "جنتك",
        title2: "الفخامة",
        title2Alt: "فيلات شاطئية",
        title3: "استرخِ على",
        title3Alt: "الماء",
        searchPlaceholder: "ابحث عن ملاذك المثالي..."
      },
      philosophy: {
        badge: "وكالتنا",
        quote: "ابحث عن السلام في جمال الجزر.",
        quoteAuthor: "حياة الجزيرة",
        title: "أفضل عطلات المالديف.",
        subtitle: "نحن نساعدك في التخطيط للملاذ المثالي إلى أحد أجمل الأماكن على وجه الأرض.",
        description: "مالديف سيرينيتي ترافيلز هي وكالة سفر محلية مقرها في مدينة أدو. نحن نركز على الخدمة الشخصية لضمان تميز رحلتك. من انتقالات الطائرات المائية إلى العثور على شاطئك الخاص، نحن نهتم بجميع التفاصيل من أجلك."
      },
      vibe: {
        badge: "رحلة الأحلام",
        title: "اختر جوّك.",
        quietName: "هدوء",
        quietDesc: "أماكن هادئة للاسترخاء بجانب المحيط.",
        adventureName: "مغامرة",
        adventureDesc: "اذهب للغوص أو جرب الرياضات المائية الممتعة.",
        familyName: "عائلة",
        familyDesc: "منتجعات رائعة للأطفال والكبار.",
        romanceName: "رومانسية",
        romanceDesc: "أماكن مثالية للأزواج وشهر العسل.",
        exploreBtn: "استكشف"
      },
      collection: {
        badge: "محفظتنا",
        title: "أفضل المنتجعات.",
        description: "لقد اخترنا أفضل المنتجعات في جزر المالديف. كل مكان نقدمه يتميز بخدمة رائعة وخصوصية تامة.",
        findVilla: "ابحث عن فيلا أحلامك."
      },
      journal: {
        badge: "مجلة المالديف",
        title: "قصص الجزيرة.",
        subtitle: "اكتشف أفضل الأسرار ونصائح السفر والقصص حول جزر المالديف."
      },
      instagram: {
        badge: "النبض الاجتماعي",
        title: "وسائل التواصل الاجتماعي.",
        disconnect: "قطع الاتصال",
        connect: "ربط إنستغرام",
        tryAgain: "حاول مرة أخرى",
        noMedia: "لم يتم العثور على وسائط",
        connectTitle: "اربط عالمك",
        connectDesc: "قم بمزامنة خلاصة إنستغرام الخاصة بك مع محفظة المالديف الخاصة بك.",
        linkAccount: "ربط الحساب"
      },
      chatbot: {
        welcome: "أنا سارة. صف حلمك المالديفي، وسأقوم بتحقيقه.",
        askSara: "اسأل سارة",
        reset: "إعادة تعيين",
        resetMsg: "تمت إعادة تعيين الحوار. كيف يمكنني إرشادك؟",
        authRequired: "المصادقة مطلوبة",
        authDesc: "لتمكين مجموعة ذكاء سارة، يرجى تحديد مفتاح Gemini API الخاص بك.",
        connectSara: "ربط سارة",
        billingRequired: "مطلوب مفتاح مشروع مفعل فيه الفوترة.",
        billingDoc: "وثائق الفوترة",
        placeholder: "اسأل عن الجزر المرجانية...",
        connectToBegin: "اربط سارة للبدء",
        version: "الذكاء المنظوري الإصدار 3.5",
        suite: "مجموعة الذكاء"
      },
      plan: {
        badge: "طلب عروض أسعار العطلات",
        step: "خطوة",
        next: "استمرار",
        back: "رجوع",
        submit: "إرسال الاستفسار",
        submitting: "جاري الإرسال...",
        successBadge: "تم استلام الإرسال",
        successTitle: "المنظور ينتظر.",
        successDesc: "يقوم خبراؤنا بتنظيم محفظة المالديف المخصصة لك. توقع إرسالاً رقمياً في بريدك الوارد في غضون 24 ساعة.",
        returnHome: "العودة إلى الصفحة الرئيسية",
        q1: "لماذا تأتي إلى جزر المالديف؟",
        q2: "ما هي التجارب التي تتطلع إليها أكثر؟",
        q2Desc: "يرجى اختيار ما يصل إلى ثلاث تجارب أو التخطي بالنقر فوق \"لا توجد تفضيلات\".",
        q3: "ماذا تفضل؟",
        q3Desc: "اختر تفضيلاتك للملاذ المثالي.",
        q4: "المنتجعات المفضلة",
        q4Desc: "ابحث واختر بين 3 منتجعات لتحسين توصياتنا.",
        q5: "أوشكنا على الانتهاء!",
        noResorts: "لم يتم اختيار أي منتجعات بعد",
        searchPlaceholder: "البحث عن اسم العقار...",
        fullName: "الاسم الكامل",
        fullNamePlaceholder: "الهوية",
        phone: "رقم الاتصال",
        email: "عنوان البريد الإلكتروني",
        emailPlaceholder: "التوقيع الرقمي",
        dates: "تواريخ السفر",
        datesPlaceholder: "مثلاً أكتوبر 2024",
        guests: "عدد الضيوف",
        mealPlan: "خطة الوجبات",
        noPreferences: "لا توجد تفضيلات",
        purposes: {
          honeymoon: "شهر العسل",
          anniversary: "ذكرى الزواج",
          couples: "عطلة للأزواج",
          family: "عطلة عائلية",
          solo: "سفر منفرد",
          group: "عطلة جماعية"
        },
        experiences: {
          snorkelling: "الغطس السطحي",
          diving: "الغوص",
          surfing: "ركوب الأمواج",
          spa: "سبا",
          food: "طعام",
          culture: "التاريخ والثقافة"
        },
        preferences: {
          smallIsland: "جزيرة صغيرة",
          largeIsland: "جزيرة كبيرة",
          luxuryResort: "منتجع فاخر",
          affordableResort: "منتجع بأسعار معقولة",
          beachVilla: "فيلا شاطئية",
          waterVilla: "فيلا فوق الماء",
          pool: "فيلا مع مسبح",
          noPool: "بدون مسبح"
        },
        mealPlans: {
          bb: "مبيت وإفطار",
          hb: "نصف إقامة",
          fb: "إقامة كاملة",
          ai: "شامل كلياً"
        }
      },
      seo: {
        homeTitle: "مالديف سيرينيتي ترافيلز | أفضل العطلات الفاخرة",
        homeDesc: "خطط لرحلتك المثالية إلى جزر المالديف معنا. نحن نقدم أفضل المنتجعات الفاخرة، والفيلات فوق الماء، وحزم العطلات العائلية."
      },
      contactPage: {
        badge: "اتصال",
        title: "اتصل بنا.",
        subtitle: "نحن هنا لمساعدتك في التخطيط لرحلتك المثالية إلى جزر المالديف.",
        callOrWhatsapp: "اتصال أو واتساب",
        support: "الدعم",
        directLine: "الخط المباشر",
        email: "البريد الإلكتروني",
        address: "العنوان",
        form: {
          name: "الاسم",
          namePlaceholder: "اسمك",
          email: "البريد الإلكتروني",
          emailPlaceholder: "بريدك الإلكتروني",
          message: "الرسالة",
          messagePlaceholder: "كيف يمكننا مساعدتك؟",
          send: "إرسال الرسالة",
          successTitle: "تم إرسال الرسالة.",
          successDesc: "سنقوم بالرد عليك في غضون 24 ساعة.",
          sendAnother: "إرسال رسالة أخرى"
        }
      },
      footer: {
        branding: "وكالة بوتيك مخصصة ولدت من الحدود الجنوبية للأرخبيل. نحن ننظم الصمت والفخامة للمسافر المتميز.",
        newsletter: {
          title: "النشرة الرقمية",
          subtitle: "احصل على الامتيازات الموسمية والتحديثات التحريرية مباشرة.",
          placeholder: "بريدك الإلكتروني",
          button: "انضم"
        },
        nav: {
          agency: "الوكالة",
          heritage: "تراثنا",
          journal: "المجلة",
          connect: "اتصل",
          careers: "الوظائف",
          portfolio: "المحفظة",
          luxuryResorts: "منتجعات فاخرة",
          guestHouses: "بيوت ضيافة",
          liveaboards: "يخوت إقامة",
          exclusives: "حصريات",
          governance: "الحوكمة",
          terms: "شروط الخدمة",
          privacy: "سياسة الخصوصية",
          faq: "الأسئلة الشائعة للسفر",
          safety: "بروتوكولات السلامة",
          social: "التواصل الاجتماعي",
          instagram: "إنستغرام",
          whatsapp: "واتساب مباشر",
          twitter: "تويتر (X)",
          linkedin: "لينكد إن"
        },
        office: {
          title: "مكتبنا",
          hoursTitle: "الاثنين — الجمعة"
        }
      }
    }
  },
  ko: {
    translation: {
      discover: "발견하다",
      planTrip: "여행 계획",
      stays: "숙박",
      offers: "제안",
      experiences: "경험",
      stories: "이야기",
      contact: "연락처",
      faq: "자주 묻는 질문",
      about: "회사 소개",
      search: "검색",
      home: "홈",
      readStory: "우리의 이야기",
      contactUs: "문의하기",
      startJourney: "지금 여행을 시작하세요",
      readMore: "더 보기",
      seeAll: "모두 보기",
      bespokeOffer: "맞춤형 제안",
      defaultFeatures: "맞춤형 안식처 • 개인 섬",
      hero: {
        subtitle1: "파트 1 — 섬을 발견하다",
        subtitle2: "파트 2 — 프라이빗 스테이",
        subtitle3: "파트 3 — 스타일리시한 휴식",
        title1: "당신의",
        title1Alt: "낙원을 찾으세요",
        title2: "럭셔리",
        title2Alt: "비치 빌라",
        title3: "물 위에서의",
        title3Alt: "휴식",
        searchPlaceholder: "꿈꾸던 탈출을 검색하세요..."
      },
      philosophy: {
        badge: "우리 에이전시",
        quote: "섬의 아름다움 속에서 평화를 찾으세요.",
        quoteAuthor: "섬 생활",
        title: "최고의 몰디브 휴가.",
        subtitle: "지구상에서 가장 아름다운 곳 중 하나로의 완벽한 탈출을 계획하도록 도와드립니다.",
        description: "몰디브 세레니티 트래블은 아두 시에 본사를 둔 현지 여행사입니다. 우리는 당신의 여행을 특별하게 만들기 위해 개인화된 서비스에 집중합니다. 수상 비행기 환승부터 나만의 프라이빗 비치 찾기까지, 모든 세부 사항을 대신 처리해 드립니다."
      },
      vibe: {
        badge: "꿈의 여행",
        title: "당신의 바이브를 선택하세요.",
        quietName: "조용한",
        quietDesc: "바다 옆에서 휴식을 취할 수 있는 평화로운 곳.",
        adventureName: "모험",
        adventureDesc: "다이빙을 하거나 재미있는 수상 스포츠를 즐겨보세요.",
        familyName: "가족",
        familyDesc: "아이들과 성인 모두를 위한 훌륭한 리조트.",
        romanceName: "로맨스",
        romanceDesc: "커플과 신혼여행을 위한 완벽한 장소.",
        exploreBtn: "탐험하기"
      },
      collection: {
        badge: "우리의 포트폴리오",
        title: "최고의 리조트.",
        description: "우리는 몰디브에서 가장 좋은 리조트들만을 엄선했습니다. 우리가 제공하는 모든 곳은 훌륭한 서비스와 완벽한 프라이버시를 보장합니다.",
        findVilla: "꿈꾸던 빌라를 찾아보세요."
      },
      journal: {
        badge: "몰디브 저널",
        title: "섬 이야기.",
        subtitle: "몰디브에 대한 최고의 비밀, 여행 팁 및 이야기를 발견해보세요."
      },
      instagram: {
        badge: "소셜 펄스",
        title: "소셜 미디어.",
        disconnect: "연결 해제",
        connect: "인스타그램 연결",
        tryAgain: "다시 시도",
        noMedia: "미디어를 찾을 수 없음",
        connectTitle: "당신의 세계를 연결하세요",
        connectDesc: "인스타그램 피드를 몰디브 포트폴리오와 동기화하세요.",
        linkAccount: "계정 연결"
      },
      chatbot: {
        welcome: "저는 사라입니다. 당신의 몰디브 꿈을 들려주시면 제가 실현해 드릴게요.",
        askSara: "사라에게 물어보기",
        reset: "초기화",
        resetMsg: "대화가 초기화되었습니다. 어떻게 도와드릴까요?",
        authRequired: "인증 필요",
        authDesc: "사라의 인텔리전스 스위트를 활성화하려면 Gemini API 키를 선택해주세요.",
        connectSara: "사라 연결하기",
        billingRequired: "결제가 활성화된 프로젝트 키가 필요합니다.",
        billingDoc: "결제 문서",
        placeholder: "아톨에 대해 물어보세요...",
        connectToBegin: "시작하려면 사라를 연결하세요",
        version: "퍼스펙티브 인텔리전스 v3.5",
        suite: "인텔리전스 스위트"
      },
      plan: {
        badge: "휴가 견적 요청",
        step: "단계",
        next: "계속",
        back: "뒤로",
        submit: "문의 제출",
        submitting: "발송 중...",
        successBadge: "발송물 수신됨",
        successTitle: "새로운 관점이 기다립니다.",
        successDesc: "전문가들이 당신만을 위한 맞춤형 몰디브 포트폴리오를 큐레이팅하고 있습니다. 24시간 이내에 이메일로 디지털 발송물을 확인하실 수 있습니다.",
        returnHome: "홈으로 돌아가기",
        q1: "몰디브에 오시는 이유는 무엇인가요?",
        q2: "가장 기대되는 경험은 무엇인가요?",
        q2Desc: "최대 3가지 경험을 선택하거나 \"선호도 없음\"을 클릭하여 건너뛰세요.",
        q3: "어떤 것을 선호하시나요?",
        q3Desc: "완벽한 안식처를 위한 선호도를 선택하세요.",
        q4: "선호하는 리조트",
        q4Desc: "추천 사항을 구체화하기 위해 3개의 리조트를 검색하고 선택하세요.",
        q5: "거의 다 왔습니다!",
        noResorts: "아직 선택된 리조트 없음",
        searchPlaceholder: "숙소 이름 검색...",
        fullName: "성함",
        fullNamePlaceholder: "정체성",
        phone: "연락처",
        email: "이메일 주소",
        emailPlaceholder: "디지털 서명",
        dates: "여행 날짜",
        datesPlaceholder: "예: 2024년 10월",
        guests: "게스트 수",
        mealPlan: "식사 플랜",
        noPreferences: "선호도 없음",
        purposes: {
          honeymoon: "신혼여행",
          anniversary: "결혼 기념일",
          couples: "커플 휴가",
          family: "가족 휴가",
          solo: "나홀로 여행",
          group: "단체 휴가"
        },
        experiences: {
          snorkelling: "스노클링",
          diving: "스쿠버 다이빙",
          surfing: "서핑",
          spa: "스파",
          food: "음식",
          culture: "역사 및 문화"
        },
        preferences: {
          smallIsland: "작은 섬",
          largeIsland: "큰 섬",
          luxuryResort: "럭셔리 리조트",
          affordableResort: "가성비 리조트",
          beachVilla: "비치 빌라",
          waterVilla: "워터 빌라",
          pool: "풀빌라",
          noPool: "수영장 없음"
        },
        mealPlans: {
          bb: "조식 포함",
          hb: "하프 보드",
          fb: "풀 보드",
          ai: "올 인클루시브"
        }
      },
      seo: {
        homeTitle: "몰디브 세레니티 트래블 | 최고의 럭셔리 휴양",
        homeDesc: "우리와 함께 완벽한 몰디브 여행을 계획하세요. 최고의 럭셔리 리조트, 워터 빌라, 가족 휴가 패키지를 제공합니다."
      },
      contactPage: {
        badge: "연결",
        title: "문의하기.",
        subtitle: "완벽한 몰디브 여행 계획을 도와드리기 위해 저희가 여기 있습니다.",
        callOrWhatsapp: "전화 또는 WhatsApp",
        support: "지원",
        directLine: "직통 전화",
        email: "이메일",
        address: "주소",
        form: {
          name: "이름",
          namePlaceholder: "성함",
          email: "이메일",
          emailPlaceholder: "이메일 주소",
          message: "메시지",
          messagePlaceholder: "무엇을 도와드릴까요?",
          send: "메시지 보내기",
          successTitle: "메시지 전송 완료.",
          successDesc: "24시간 이내에 답변해 드리겠습니다.",
          sendAnother: "다른 메시지 보내기"
        }
      },
      footer: {
        branding: "군도의 남쪽 국경에서 탄생한 맞춤형 부티크 에이전시입니다. 안목 있는 여행자를 위해 고요함과 럭셔리를 큐레이팅합니다.",
        newsletter: {
          title: "디지털 디스패치",
          subtitle: "시즌별 혜택과 에디토리얼 업데이트를 직접 받아보세요.",
          placeholder: "이메일 주소",
          button: "가입"
        },
        nav: {
          agency: "에이전시",
          heritage: "우리의 유산",
          journal: "저널",
          connect: "연락",
          careers: "채용",
          portfolio: "포트폴리오",
          luxuryResorts: "럭셔리 리조트",
          guestHouses: "게스트 하우스",
          liveaboards: "리브어보드",
          exclusives: "독점 혜택",
          governance: "거버넌스",
          terms: "서비스 약관",
          privacy: "개인정보 처리방침",
          faq: "여행 FAQ",
          safety: "안전 프로토콜",
          social: "소셜",
          instagram: "인스타그램 피드",
          whatsapp: "WhatsApp 직통",
          twitter: "Twitter (X)",
          linkedin: "LinkedIn"
        },
        office: {
          title: "사무실",
          hoursTitle: "월 — 금"
        }
      }
    }
  },
  ja: {
    translation: {
      discover: "発見する",
      planTrip: "旅行を計画する",
      stays: "宿泊施設",
      offers: "オファー",
      experiences: "体験",
      stories: "ストーリー",
      contact: "お問い合わせ",
      faq: "よくある質問",
      about: "私たちについて",
      search: "検索",
      home: "ホーム",
      readStory: "私たちの物語",
      contactUs: "お問い合わせ",
      startJourney: "今すぐ旅を始めましょう",
      readMore: "もっと読む",
      seeAll: "すべて見る",
      bespokeOffer: "オーダーメイドの特典",
      defaultFeatures: "オーダーメイドの隠れ家 • プライベートアイランド",
      hero: {
        subtitle1: "パート 1 — 島々を発見する",
        subtitle2: "パート 2 — プライベートな滞在",
        subtitle3: "パート 3 — スタイリッシュにリラックス",
        title1: "あなたの",
        title1Alt: "楽園を見つける",
        title2: "贅沢な",
        title2Alt: "ビーチヴィラ",
        title3: "水上での",
        title3Alt: "リラックス",
        searchPlaceholder: "夢の逃避行を検索..."
      },
      philosophy: {
        badge: "私たちのエージェンシー",
        quote: "島の美しさの中に平和を見つけてください。",
        quoteAuthor: "島の生活",
        title: "最高のモルディブ休暇。",
        subtitle: "地球上で最も美しい場所の一つへの完璧な逃避行を計画するお手伝いをします。",
        description: "モルディブ・セレニティ・トラベルズは、アッドゥ市に拠点を置く地元の旅行代理店です。私たちは、あなたの旅行を特別なものにするために、パーソナライズされたサービスに重点を置いています。水上飛行機の送迎から、あなただけのプライベートビーチ探しまで、すべての詳細を私たちが代行します。"
      },
      vibe: {
        badge: "夢の旅行",
        title: "あなたのバイブスを選択してください。",
        quietName: "静か",
        quietDesc: "海辺でリラックスできる平和な場所。",
        adventureName: "冒険",
        adventureDesc: "ダイビングに行ったり、楽しいウォータースポーツに挑戦したりしてください。",
        familyName: "ファミリー",
        familyDesc: "子供から大人まで楽しめる素晴らしいリゾート。",
        romanceName: "ロマンス",
        romanceDesc: "カップルやハネムーンに最適なスポット。",
        exploreBtn: "探索する"
      },
      collection: {
        badge: "私たちのポートフォリオ",
        title: "トップリゾート。",
        description: "モルディブで最高の候補リゾートを厳選しました。私たちが提供するすべての場所は、素晴らしいサービスと完全なプライバシーを誇ります。",
        findVilla: "夢のヴィラを見つけてください。"
      },
      journal: {
        badge: "モルディブ・ジャーナル",
        title: "島の物語。",
        subtitle: "モルディブに関する最高の秘密、旅行のヒント、物語を発見してください。"
      },
      instagram: {
        badge: "ソーシャル・パルス",
        title: "ソーシャルメディア。",
        disconnect: "切断する",
        connect: "Instagramを接続する",
        tryAgain: "再試行する",
        noMedia: "メディアが見つかりません",
        connectTitle: "あなたの世界を繋ぐ",
        connectDesc: "Instagramフィードをモルディブのポートフォリオと同期させます。",
        linkAccount: "アカウントをリンクする"
      },
      chatbot: {
        welcome: "私はサラです。あなたのモルディブの夢を教えてください。それを実現させます。",
        askSara: "サラに聞く",
        reset: "リセット",
        resetMsg: "対話がリセットされました。どのように案内しましょうか？",
        authRequired: "認証が必要です",
        authDesc: "サラ의 인테리전스 스위트를 활성화하려면 Gemini API 키를 선택해주세요.",
        connectSara: "サラを接続する",
        billingRequired: "課金が有効なプロジェクトキーが必要です。",
        billingDoc: "課金ドキュメント",
        placeholder: "環礁について聞く...",
        connectToBegin: "開始するにはサラを接続してください",
        version: "パースペクティブ・インテリジェンス v3.5",
        suite: "インテリジェンス・スイート"
      },
      plan: {
        badge: "休暇の見積もりをリクエストする",
        step: "ステップ",
        next: "次へ",
        back: "戻る",
        submit: "お問い合わせを送信する",
        submitting: "送信中...",
        successBadge: "送信完了",
        successTitle: "新しい視点が待っています。",
        successDesc: "私たちのスペシャリストが、あなただけのモルディブ・ポートフォリオをキュレートしています。24時間以内にメールボックスにデジタルメッセージが届くのをお待ちください。",
        returnHome: "ホームに戻る",
        q1: "なぜモルディブに来るのですか？",
        q2: "最も楽しみにしている体験は何ですか？",
        q2Desc: "最大3つの体験を選択するか、「希望なし」をクリックしてスキップしてください。",
        q3: "どちらを好みますか？",
        q3Desc: "完璧な隠れ家のための好みを選択してください。",
        q4: "希望のリゾート",
        q4Desc: "推奨事項を絞り込むために、3つのリゾートを検索して選択してください。",
        q5: "あと少しです！",
        noResorts: "リゾートがまだ選択されていません",
        searchPlaceholder: "施設名で検索...",
        fullName: "氏名",
        fullNamePlaceholder: "アイデンティティ",
        phone: "電話番号",
        email: "メールアドレス",
        emailPlaceholder: "デジタル署名",
        dates: "旅行日程",
        datesPlaceholder: "例：2024年10月",
        guests: "ゲスト人数",
        mealPlan: "お食事プラン",
        noPreferences: "希望なし",
        purposes: {
          honeymoon: "ハネムーン",
          anniversary: "結婚記念日",
          couples: "カップルでの休暇",
          family: "家族旅行",
          solo: "一人旅",
          group: "グループ旅行"
        },
        experiences: {
          snorkelling: "シュノーケリング",
          diving: "ダイビング",
          surfing: "サーフィン",
          spa: "スパ",
          food: "食事",
          culture: "歴史と文化"
        },
        preferences: {
          smallIsland: "小さな島",
          largeIsland: "大きな島",
          luxuryResort: "ラグジュアリーリゾート",
          affordableResort: "リーズナブルなリゾート",
          beachVilla: "ビーチヴィラ",
          waterVilla: "水上ヴィラ",
          pool: "プール付きヴィラ",
          noPool: "プールなし"
        },
        mealPlans: {
          bb: "朝食付き",
          hb: "ハーフボード",
          fb: "フルボード",
          ai: "オールインクルーシブ"
        }
      },
      seo: {
        homeTitle: "モルディブ・セレニティ・トラベルズ | 最高のラグジュアリー休暇",
        homeDesc: "私たちと一緒に完璧なモルディブ旅行を計画しましょう。最高のラグジュアリーリゾート、水上ヴィラ、家族旅行パッケージを提供しています。"
      },
      contactPage: {
        badge: "接続",
        title: "お問い合わせ。",
        subtitle: "完璧なモルディブ旅行の計画をお手伝いするために、私たちがここにいます。",
        callOrWhatsapp: "電話または WhatsApp",
        support: "サポート",
        directLine: "直通電話",
        email: "メール",
        address: "住所",
        form: {
          name: "名前",
          namePlaceholder: "お名前",
          email: "メール",
          emailPlaceholder: "メールアドレス",
          message: "メッセージ",
          messagePlaceholder: "どのようなご用件でしょうか？",
          send: "メッセージを送信",
          successTitle: "メッセージ送信完了。",
          successDesc: "24時間以内に返信いたします。",
          sendAnother: "別のメッセージを送信"
        }
      },
      footer: {
        branding: "諸島の南の辺境から生まれたオーダーメイドのブティックエージェンシー。目の肥えた旅行者のために、静寂と贅沢をキュレートします。",
        newsletter: {
          title: "デジタル・ディスパッチ",
          subtitle: "季節の特典やエディトリアル・アップデートを直接受け取れます。",
          placeholder: "メールアドレス",
          button: "参加する"
        },
        nav: {
          agency: "エージェンシー",
          heritage: "私たちの遺産",
          journal: "ジャーナル",
          connect: "接続",
          careers: "採用情報",
          portfolio: "ポートフォリオ",
          luxuryResorts: "ラグジュアリーリゾート",
          guestHouses: "ゲストハウス",
          liveaboards: "リブアボード",
          exclusives: "限定特典",
          governance: "ガバナンス",
          terms: "利用規約",
          privacy: "プライバシーポリシー",
          faq: "旅行 FAQ",
          safety: "安全プロトコル",
          social: "ソーシャル",
          instagram: "Instagram フィード",
          whatsapp: "WhatsApp 直通",
          twitter: "Twitter (X)",
          linkedin: "LinkedIn"
        },
        office: {
          title: "私たちのオフィス",
          hoursTitle: "月 — 金"
        }
      }
    }
  },
  it: {
    translation: {
      discover: "Scopri",
      planTrip: "Pianifica viaggio",
      stays: "Soggiorni",
      offers: "Offerte",
      experiences: "Esperienze",
      stories: "Storie",
      contact: "Contatto",
      faq: "FAQ",
      about: "Chi siamo",
      search: "Cerca",
      home: "Home",
      readStory: "La nostra storia",
      contactUs: "Contattaci",
      startJourney: "Inizia il tuo viaggio ora",
      readMore: "Leggi di più",
      seeAll: "Vedi tutti",
      bespokeOffer: "Offerta su misura",
      defaultFeatures: "Santuario su misura • Isola privata",
      hero: {
        subtitle1: "PARTE 1 — SCOPRI LE ISOLE",
        subtitle2: "PARTE 2 — SOGGIORNI PRIVATI",
        subtitle3: "PARTE 3 — RELAX CON STILE",
        title1: "Trova il tuo",
        title1Alt: "Paradiso",
        title2: "Lussuose",
        title2Alt: "Ville sulla spiaggia",
        title3: "Relax sull'",
        title3Alt: "Acqua",
        searchPlaceholder: "Cerca la tua fuga da sogno..."
      },
      philosophy: {
        badge: "La nostra agenzia",
        quote: "Trova la pace nella bellezza delle isole.",
        quoteAuthor: "Vita sull'isola",
        title: "Le migliori vacanze alle Maldive.",
        subtitle: "Ti aiutiamo a pianificare la fuga perfetta in uno dei luoghi più belli della terra.",
        description: "Maldives Serenity Travels è un'agenzia di viaggi locale con sede ad Addu City. Ci concentriamo sul servizio personale per assicurarci che il tuo viaggio sia speciale. Dai trasferimenti in idrovolante alla ricerca della tua spiaggia privata, ci prendiamo cura di tutti i dettagli per te."
      },
      vibe: {
        badge: "Viaggio da sogno",
        title: "Scegli il tuo stile.",
        quietName: "Tranquillità",
        quietDesc: "Luoghi tranquilli per rilassarsi in riva all'oceano.",
        adventureName: "Avventura",
        adventureDesc: "Fai immersioni o prova divertenti sport acquatici.",
        familyName: "Famiglia",
        familyDesc: "Ottimi resort per bambini e adulti.",
        romanceName: "Romance",
        romanceDesc: "Posti perfetti per coppie e lune di miele.",
        exploreBtn: "Esplora"
      },
      collection: {
        badge: "Il nostro portfolio",
        title: "I migliori resort.",
        description: "Abbiamo selezionato i migliori resort delle Maldive. Ogni posto che offriamo ha un ottimo servizio e una privacy totale.",
        findVilla: "Trova la villa dei tuoi sogni."
      },
      journal: {
        badge: "Maldive Journal",
        title: "Storie dell'isola.",
        subtitle: "Scopri i migliori segreti, consigli di viaggio e storie sulle Maldive."
      },
      instagram: {
        badge: "Social Pulse",
        title: "Social Media.",
        disconnect: "Disconnetti",
        connect: "Connetti Instagram",
        tryAgain: "Riprova",
        noMedia: "Nessun media trovato",
        connectTitle: "Connetti il tuo mondo",
        connectDesc: "Sincronizza il tuo feed Instagram con il tuo portfolio delle Maldive.",
        linkAccount: "Collega account"
      },
      chatbot: {
        welcome: "Sono Sara. Descrivi il tuo sogno maldiviano e io lo realizzerò.",
        askSara: "Chiedi a Sara",
        reset: "Reset",
        resetMsg: "Dialogo resettato. Come posso guidarti?",
        authRequired: "Autenticazione richiesta",
        authDesc: "Per abilitare la suite di intelligenza di Sara, seleziona la tua chiave API Gemini.",
        connectSara: "Connetti Sara",
        billingRequired: "È richiesta una chiave di progetto con fatturazione abilitata.",
        billingDoc: "Documentazione di fatturazione",
        placeholder: "Chiedi degli atolli...",
        connectToBegin: "Connetti Sara per iniziare",
        version: "Perspective Intelligence v3.5",
        suite: "Intelligence Suite"
      },
      plan: {
        badge: "RICHIEDI PREVENTIVI PER LE VACANZE",
        step: "Passo",
        next: "Continua",
        back: "Indietro",
        submit: "Invia richiesta",
        submitting: "INVIO IN CORSO...",
        successBadge: "Richiesta ricevuta",
        successTitle: "La prospettiva attende.",
        successDesc: "I nostri specialisti stanno curando il tuo portfolio personalizzato delle Maldive. Aspettati un messaggio digitale nella tua casella di posta entro 24 ore.",
        returnHome: "Torna alla Home",
        q1: "Perché vieni alle Maldive?",
        q2: "Quali esperienze aspetti con più ansia?",
        q2Desc: "Seleziona fino a tre esperienze o salta cliccando su \"Nessuna preferenza\".",
        q3: "Cosa preferisci?",
        q3Desc: "Scegli le tue preferenze per il rifugio perfetto.",
        q4: "Resort preferiti",
        q4Desc: "Cerca e seleziona tra 3 resort per affinare i nostri consigli.",
        q5: "Quasi finito!",
        noResorts: "Nessun resort ancora selezionato",
        searchPlaceholder: "CERCA NOME PROPRIETÀ...",
        fullName: "Nome completo",
        fullNamePlaceholder: "IDENTITÀ",
        phone: "Numero di contatto",
        email: "Indirizzo email",
        emailPlaceholder: "FIRMA DIGITALE",
        dates: "Date del viaggio",
        datesPlaceholder: "ES. OTTOBRE 2024",
        guests: "Numero di ospiti",
        mealPlan: "Piano pasti",
        noPreferences: "Nessuna preferenza",
        purposes: {
          honeymoon: "Luna di miele",
          anniversary: "Anniversario di matrimonio",
          couples: "Fuga per coppie",
          family: "Vacanza in famiglia",
          solo: "Viaggio da solo",
          group: "Vacanza di gruppo"
        },
        experiences: {
          snorkelling: "Snorkeling",
          diving: "Immersioni",
          surfing: "Surf",
          spa: "Spa",
          food: "Cibo",
          culture: "Storia e Cultura"
        },
        preferences: {
          smallIsland: "Isola piccola",
          largeIsland: "Isola grande",
          luxuryResort: "Resort di lusso",
          affordableResort: "Resort conveniente",
          beachVilla: "Villa sulla spiaggia",
          waterVilla: "Villa sull'acqua",
          pool: "Villa con piscina",
          noPool: "Senza piscina"
        },
        mealPlans: {
          bb: "PERNOTTAMENTO E COLAZIONE",
          hb: "MEZZA PENSIONE",
          fb: "PENSIONE COMPLETA",
          ai: "ALL INCLUSIVE"
        }
      },
      seo: {
        homeTitle: "Maldives Serenity Travels | Le migliori vacanze di lusso",
        homeDesc: "Pianifica con noi la tua vacanza perfetta alle Maldive. Offriamo i migliori resort di lusso, ville sull'acqua e pacchetti vacanza per famiglie."
      },
      contactPage: {
        badge: "CONNETTITI",
        title: "Contattaci.",
        subtitle: "Siamo qui per aiutarti a pianificare la tua vacanza perfetta alle Maldive.",
        callOrWhatsapp: "Chiamata o WhatsApp",
        support: "Supporto",
        directLine: "Linea Diretta",
        email: "Email",
        address: "Indirizzo",
        form: {
          name: "Nome",
          namePlaceholder: "IL TUO NOME",
          email: "Email",
          emailPlaceholder: "LA TUA EMAIL",
          message: "Messaggio",
          messagePlaceholder: "COME POSSIAMO AIUTARTI?",
          send: "Invia Messaggio",
          successTitle: "Messaggio Inviato.",
          successDesc: "Ti risponderemo entro 24 ore.",
          sendAnother: "Inviane un altro"
        }
      },
      footer: {
        branding: "Un'agenzia boutique su misura nata dalla frontiera meridionale dell'arcipelago. Curiamo il silenzio e il lusso per il viaggiatore esigente.",
        newsletter: {
          title: "The Digital Dispatch",
          subtitle: "Ricevi privilegi stagionali e aggiornamenti editoriali direttamente.",
          placeholder: "LA TUA EMAIL",
          button: "Unisciti"
        },
        nav: {
          agency: "Agenzia",
          heritage: "La nostra eredità",
          journal: "Il Journal",
          connect: "Connettiti",
          careers: "Carriere",
          portfolio: "Portfolio",
          luxuryResorts: "Resort di lusso",
          guestHouses: "Guest House",
          liveaboards: "Liveaboard",
          exclusives: "Esclusive",
          governance: "Governance",
          terms: "Termini di servizio",
          privacy: "Privacy Policy",
          faq: "FAQ di viaggio",
          safety: "Protocolli di sicurezza",
          social: "Social",
          instagram: "Instagram Feed",
          whatsapp: "WhatsApp Diretto",
          twitter: "Twitter (X)",
          linkedin: "LinkedIn"
        },
        office: {
          title: "Il nostro ufficio",
          hoursTitle: "Lun — Ven"
        }
      }
    }
  },
  fr: {
    translation: {
      discover: "Découvrir",
      planTrip: "Planifier le voyage",
      stays: "Séjours",
      offers: "Offres",
      experiences: "Expériences",
      stories: "Histoires",
      contact: "Contact",
      faq: "FAQ",
      about: "À propos",
      search: "Recherche",
      home: "Accueil",
      readStory: "Notre histoire",
      contactUs: "Contactez-nous",
      startJourney: "Commencez votre voyage",
      readMore: "Lire la suite",
      seeAll: "Voir tout",
      bespokeOffer: "Offre sur mesure",
      defaultFeatures: "Sanctuaire sur mesure • Île privée",
      hero: {
        subtitle1: "PARTIE 1 — DÉCOUVREZ LES ÎLES",
        subtitle2: "PARTIE 2 — SÉJOURS PRIVÉS",
        subtitle3: "PARTIE 3 — DÉTENTE AVEC STYLE",
        title1: "Trouvez votre",
        title1Alt: "Paradis",
        title2: "Luxe",
        title2Alt: "Villas de plage",
        title3: "Détente sur l'",
        title3Alt: "Eau",
        searchPlaceholder: "Recherchez votre escapade de rêve..."
      },
      philosophy: {
        badge: "Notre agence",
        quote: "Trouvez la paix dans la beauté des îles.",
        quoteAuthor: "Vie insulaire",
        title: "Les meilleures vacances aux Maldives.",
        subtitle: "Nous vous aidons à planifier l'escapade parfaite dans l'un des plus beaux endroits de la terre.",
        description: "Maldives Serenity Travels est une agence de voyages locale basée à Addu City. Nous nous concentrons sur un service personnalisé pour que votre voyage soit spécial. Des transferts en hydravion à la recherche de votre propre plage privée, nous nous occupons de tous les détails pour vous."
      },
      vibe: {
        badge: "Voyage de rêve",
        title: "Choisissez votre ambiance.",
        quietName: "Calme",
        quietDesc: "Des endroits paisibles pour se détendre au bord de l'océan.",
        adventureName: "Aventure",
        adventureDesc: "Faites de la plongée ou essayez des sports nautiques amusants.",
        familyName: "Famille",
        familyDesc: "D'excellents complexes pour enfants et adultes.",
        romanceName: "Romance",
        romanceDesc: "Des endroits parfaits pour les couples et les lunes de miel.",
        exploreBtn: "Explorer"
      },
      collection: {
        badge: "Notre portfolio",
        title: "Les meilleurs complexes.",
        description: "Nous avons sélectionné les meilleurs complexes des Maldives. Chaque endroit que nous proposons bénéficie d'un excellent service et d'une intimité totale.",
        findVilla: "Trouvez la villa de vos rêves."
      },
      journal: {
        badge: "Journal des Maldives",
        title: "Histoires de l'île.",
        subtitle: "Découvrez les meilleurs secrets, conseils de voyage et histoires sur les Maldives."
      },
      instagram: {
        badge: "Pouls Social",
        title: "Réseaux Sociaux.",
        disconnect: "Déconnecter",
        connect: "Connecter Instagram",
        tryAgain: "Réessayer",
        noMedia: "Aucun média trouvé",
        connectTitle: "Connectez votre monde",
        connectDesc: "Synchronisez votre flux Instagram avec votre portfolio des Maldives.",
        linkAccount: "Lier le compte"
      },
      chatbot: {
        welcome: "Je suis Sara. Décrivez votre rêve maldivien, et je le réaliserai.",
        askSara: "Demander à Sara",
        reset: "Réinitialiser",
        resetMsg: "Dialogue réinitialisé. Comment puis-je vous guider ?",
        authRequired: "Authentification requise",
        authDesc: "Pour activer la suite d'intelligence de Sara, veuillez sélectionner votre clé API Gemini.",
        connectSara: "Connecter Sara",
        billingRequired: "Une clé de projet avec facturation activée est requise.",
        billingDoc: "Documentation de facturation",
        placeholder: "Posez des questions sur les atolls...",
        connectToBegin: "Connectez Sara pour commencer",
        version: "Perspective Intelligence v3.5",
        suite: "Suite d'Intelligence"
      },
      plan: {
        badge: "DEMANDER DES DEVIS DE VACANCES",
        step: "Étape",
        next: "Continuer",
        back: "Retour",
        submit: "Envoyer la demande",
        submitting: "ENVOI EN COURS...",
        successBadge: "Demande reçue",
        successTitle: "La perspective vous attend.",
        successDesc: "Nos spécialistes préparent votre portfolio personnalisé des Maldives. Attendez-vous à un message numérique dans votre boîte de réception d'ici 24 heures.",
        returnHome: "Retour à l'accueil",
        q1: "Pourquoi venez-vous aux Maldives ?",
        q2: "Quelles expériences attendez-vous avec le plus d'impatience ?",
        q2Desc: "Veuillez sélectionner jusqu'à trois expériences ou passer en cliquant sur « Aucune préférence ».",
        q3: "Que préférez-vous ?",
        q3Desc: "Choisissez vos préférences pour le refuge parfait.",
        q4: "Complexes préférés",
        q4Desc: "Recherchez et sélectionnez parmi 3 complexes pour affiner nos recommandations.",
        q5: "Presque fini !",
        noResorts: "Aucun complexe sélectionné pour le moment",
        searchPlaceholder: "RECHERCHER UN NOM DE PROPRIÉTÉ...",
        fullName: "Nom complet",
        fullNamePlaceholder: "IDENTITÉ",
        phone: "Numéro de contact",
        email: "Adresse e-mail",
        emailPlaceholder: "SIGNATURE NUMÉRIQUE",
        dates: "Dates de voyage",
        datesPlaceholder: "EX. OCTOBRE 2024",
        guests: "Nombre d'invités",
        mealPlan: "Formule repas",
        noPreferences: "Aucune préférence",
        purposes: {
          honeymoon: "Lune de miel",
          anniversary: "Anniversaire de mariage",
          couples: "Escapade en couple",
          family: "Vacances en famille",
          solo: "Voyage en solo",
          group: "Vacances en groupe"
        },
        experiences: {
          snorkelling: "Snorkeling",
          diving: "Plongée",
          surfing: "Surf",
          spa: "Spa",
          food: "Nourriture",
          culture: "Histoire & Culture"
        },
        preferences: {
          smallIsland: "Petite île",
          largeIsland: "Grande île",
          luxuryResort: "Complexe de luxe",
          affordableResort: "Complexe abordable",
          beachVilla: "Villa de plage",
          waterVilla: "Villa sur l'eau",
          pool: "Villa avec piscine",
          noPool: "Sans piscine"
        },
        mealPlans: {
          bb: "PETIT-DÉJEUNER",
          hb: "DEMI-PENSION",
          fb: "PENSION COMPLÈTE",
          ai: "TOUT COMPRIS"
        }
      },
      seo: {
        homeTitle: "Maldives Serenity Travels | Meilleures vacances de luxe",
        homeDesc: "Planifiez votre voyage parfait aux Maldives avec nous. Nous proposons les meilleurs complexes de luxe, villas sur l'eau et forfaits vacances en famille."
      },
      contactPage: {
        badge: "CONNECTER",
        title: "Contactez-nous.",
        subtitle: "Nous sommes là pour vous aider à planifier votre voyage parfait aux Maldives.",
        callOrWhatsapp: "Appel ou WhatsApp",
        support: "Support",
        directLine: "Ligne Directe",
        email: "Email",
        address: "Adresse",
        form: {
          name: "Nom",
          namePlaceholder: "VOTRE NOM",
          email: "Email",
          emailPlaceholder: "VOTRE EMAIL",
          message: "Message",
          messagePlaceholder: "COMMENT POUVONS-NOUS VOUS AIDER ?",
          send: "Envoyer le message",
          successTitle: "Message envoyé.",
          successDesc: "Nous vous répondrons dans les 24 heures.",
          sendAnother: "Envoyer un autre"
        }
      },
      footer: {
        branding: "Une agence boutique sur mesure née de la frontière sud de l'archipel. Nous organisons le silence et le luxe pour le voyageur averti.",
        newsletter: {
          title: "La Dépêche Numérique",
          subtitle: "Recevez directement des privilèges saisonniers et des mises à jour éditoriales.",
          placeholder: "VOTRE EMAIL",
          button: "Rejoindre"
        },
        nav: {
          agency: "Agence",
          heritage: "Notre héritage",
          journal: "Le Journal",
          connect: "Se connecter",
          careers: "Carrières",
          portfolio: "Portfolio",
          luxuryResorts: "Complexes de luxe",
          guestHouses: "Maisons d'hôtes",
          liveaboards: "Bateaux de croisière",
          exclusives: "Exclusivités",
          governance: "Gouvernance",
          terms: "Conditions d'utilisation",
          privacy: "Politique de confidentialité",
          faq: "FAQ voyage",
          safety: "Protocoles de sécurité",
          social: "Social",
          instagram: "Flux Instagram",
          whatsapp: "WhatsApp Direct",
          twitter: "Twitter (X)",
          linkedin: "LinkedIn"
        },
        office: {
          title: "Notre bureau",
          hoursTitle: "Lun — Ven"
        }
      }
    }
  },
  es: {
    translation: {
      discover: "Descubrir",
      planTrip: "Planear viaje",
      stays: "Estancias",
      offers: "Ofertas",
      experiences: "Experiencias",
      stories: "Historias",
      contact: "Contacto",
      faq: "FAQ",
      about: "Nosotros",
      search: "Buscar",
      home: "Inicio",
      readStory: "Nuestra historia",
      contactUs: "Contáctanos",
      startJourney: "Comienza tu viaje ahora",
      readMore: "Leer más",
      seeAll: "Ver todo",
      bespokeOffer: "Oferta a medida",
      defaultFeatures: "Santuario a medida • Isla privada",
      hero: {
        subtitle1: "PARTE 1 — DESCUBRE LAS ISLAS",
        subtitle2: "PARTE 2 — ESTANCIAS PRIVADAS",
        subtitle3: "PARTE 3 — RELAX CON ESTILO",
        title1: "Encuentra tu",
        title1Alt: "Paraíso",
        title2: "Lujosas",
        title2Alt: "Villas de playa",
        title3: "Relax sobre el",
        title3Alt: "Agua",
        searchPlaceholder: "Busca tu escapada de ensueño..."
      },
      philosophy: {
        badge: "Nuestra agencia",
        quote: "Encuentra la paz en la belleza de las islas.",
        quoteAuthor: "Vida en la isla",
        title: "Las mejores vacaciones en Maldivas.",
        subtitle: "Te ayudamos a planear la escapada perfecta a uno de los lugares más bellos de la tierra.",
        description: "Maldives Serenity Travels es una agencia de viajes local con sede en Addu City. Nos enfocamos en el servicio personal para asegurar que tu viaje sea especial. Desde traslados en hidroavión hasta encontrar tu propia playa privada, nos encargamos de todos los detalles por ti."
      },
      vibe: {
        badge: "Viaje de ensueño",
        title: "Elige tu estilo.",
        quietName: "Tranquilidad",
        quietDesc: "Lugares pacíficos para relajarse junto al océano.",
        adventureName: "Aventura",
        adventureDesc: "Bucea o prueba divertidos deportes acuáticos.",
        familyName: "Familia",
        familyDesc: "Excelentes resorts para niños y adultos.",
        romanceName: "Romance",
        romanceDesc: "Lugares perfectos para parejas y lunas de miel.",
        exploreBtn: "Explorar"
      },
      collection: {
        badge: "Nuestro portafolio",
        title: "Los mejores resorts.",
        description: "Hemos seleccionado los mejores resorts de las Maldivas. Cada lugar que ofrecemos tiene un gran servicio y total privacidad.",
        findVilla: "Encuentra la villa de tus sueños."
      },
      journal: {
        badge: "Journal de Maldivas",
        title: "Historias de la isla.",
        subtitle: "Descubre los mejores secretos, consejos de viaje e historias sobre las Maldivas."
      },
      instagram: {
        badge: "Pulso Social",
        title: "Redes Sociales.",
        disconnect: "Desconectar",
        connect: "Conectar Instagram",
        tryAgain: "Reintentar",
        noMedia: "No se encontraron medios",
        connectTitle: "Conecta tu mundo",
        connectDesc: "Sincroniza tu feed de Instagram con tu portafolio de Maldivas.",
        linkAccount: "Vincular cuenta"
      },
      chatbot: {
        welcome: "Soy Sara. Describe tu sueño maldivo y lo haré realidad.",
        askSara: "Preguntar a Sara",
        reset: "Restablecer",
        resetMsg: "Diálogo restablecido. ¿Cómo puedo guiarte?",
        authRequired: "Autenticación requerida",
        authDesc: "Para habilitar la suite de inteligencia de Sara, selecciona tu clave API de Gemini.",
        connectSara: "Conectar a Sara",
        billingRequired: "Se requiere una clave de proyecto con facturación habilitada.",
        billingDoc: "Documentación de facturación",
        placeholder: "Pregunta sobre los atolones...",
        connectToBegin: "Conecta a Sara para comenzar",
        version: "Perspective Intelligence v3.5",
        suite: "Suite de Inteligencia"
      },
      plan: {
        badge: "SOLICITAR PRESUPUESTOS DE VACACIONES",
        step: "Paso",
        next: "Continuar",
        back: "Atrás",
        submit: "Enviar consulta",
        submitting: "ENVIANDO...",
        successBadge: "Consulta recibida",
        successTitle: "La perspectiva aguarda.",
        successDesc: "Nuestros especialistas están curando tu portafolio personalizado de Maldivas. Espera un mensaje digital en tu bandeja de entrada en un plazo de 24 horas.",
        returnHome: "Volver al inicio",
        q1: "¿Por qué vienes a las Maldivas?",
        q2: "¿Qué experiencias esperas con más ansias?",
        q2Desc: "Selecciona hasta tres experiencias o salta haciendo clic en \"Sin preferencias\".",
        q3: "¿Qué prefieres?",
        q3Desc: "Elige tus preferencias para el refugio perfecto.",
        q4: "Resorts preferidos",
        q4Desc: "Busca y selecciona entre 3 resorts para refinar nuestras recomendaciones.",
        q5: "¡Casi listo!",
        noResorts: "Aún no se han seleccionado resorts",
        searchPlaceholder: "BUSCAR NOMBRE DE PROPIEDAD...",
        fullName: "Nombre completo",
        fullNamePlaceholder: "IDENTIDAD",
        phone: "Número de contacto",
        email: "Correo electrónico",
        emailPlaceholder: "FIRMA DIGITAL",
        dates: "Fechas de viaje",
        datesPlaceholder: "EJ. OCTUBRE 2024",
        guests: "Número de invitados",
        mealPlan: "Plan de comidas",
        noPreferences: "Sin preferencias",
        purposes: {
          honeymoon: "Luna de miel",
          anniversary: "Aniversario de bodas",
          couples: "Escapada para parejas",
          family: "Vacaciones familiares",
          solo: "Viaje en solitario",
          group: "Vacaciones en grupo"
        },
        experiences: {
          snorkelling: "Snorkel",
          diving: "Buceo",
          surfing: "Surf",
          spa: "Spa",
          food: "Comida",
          culture: "Historia y Cultura"
        },
        preferences: {
          smallIsland: "Isla pequeña",
          largeIsland: "Isola grande",
          luxuryResort: "Resort de lujo",
          affordableResort: "Resort económico",
          beachVilla: "Villa de playa",
          waterVilla: "Villa sobre el agua",
          pool: "Villa con piscina",
          noPool: "Sin piscina"
        },
        mealPlans: {
          bb: "ALOJAMIENTO Y DESAYUNO",
          hb: "MEDIA PENSIÓN",
          fb: "PENSIÓN COMPLETA",
          ai: "TODO INCLUIDO"
        }
      },
      seo: {
        homeTitle: "Maldives Serenity Travels | Las mejores vacaciones de lujo",
        homeDesc: "Planifica tu viaje perfecto a las Maldivas con nosotros. Ofrecemos los mejores resorts de lujo, villas sobre el agua y paquetes de vacaciones familiares."
      },
      contactPage: {
        badge: "CONECTAR",
        title: "Contáctanos.",
        subtitle: "Estamos aquí para ayudarte a planificar tu viaje perfecto a las Maldivas.",
        callOrWhatsapp: "Llamada o WhatsApp",
        support: "Soporte",
        directLine: "Línea Directa",
        email: "Email",
        address: "Dirección",
        form: {
          name: "Nombre",
          namePlaceholder: "TU NOMBRE",
          email: "Email",
          emailPlaceholder: "TU EMAIL",
          message: "Mensaje",
          messagePlaceholder: "¿CÓMO PODEMOS AYUDARTE?",
          send: "Enviar mensaje",
          successTitle: "Mensaje enviado.",
          successDesc: "Te responderemos en 24 horas.",
          sendAnother: "Enviar otro"
        }
      },
      footer: {
        branding: "Una agencia boutique a medida nacida de la frontera sur del archipiélago. Curamos el silencio y el lujo para el viajero exigente.",
        newsletter: {
          title: "El Despacho Digital",
          subtitle: "Recibe privilegios estacionales y actualizaciones editoriales directamente.",
          placeholder: "TU EMAIL",
          button: "Unirse"
        },
        nav: {
          agency: "Agencia",
          heritage: "Nuestra herencia",
          journal: "El Journal",
          connect: "Conectar",
          careers: "Carreras",
          portfolio: "Portafolio",
          luxuryResorts: "Resorts de lujo",
          guestHouses: "Casas de huéspedes",
          liveaboards: "Vida a bordo",
          exclusives: "Exclusivos",
          governance: "Gobernanza",
          terms: "Términos de servicio",
          privacy: "Política de privacidad",
          faq: "FAQ de viaje",
          safety: "Protocolos de seguridad",
          social: "Social",
          instagram: "Feed de Instagram",
          whatsapp: "WhatsApp Directo",
          twitter: "Twitter (X)",
          linkedin: "LinkedIn"
        },
        office: {
          title: "Nuestra oficina",
          hoursTitle: "Lun — Vie"
        }
      }
    }
  },
  hi: {
    translation: {
      discover: "खोजें",
      planTrip: "यात्रा की योजना",
      stays: "ठहरना",
      offers: "ऑफ़र",
      experiences: "अनुभव",
      stories: "कहानियां",
      contact: "संपर्क",
      faq: "सामान्य प्रश्न",
      about: "हमारे बारे में",
      search: "खोज",
      home: "होम",
      readStory: "हमारी कहानी पढ़ें",
      contactUs: "संपर्क करें",
      startJourney: "अपनी यात्रा अभी शुरू करें",
      readMore: "और पढ़ें",
      seeAll: "सभी देखें",
      bespokeOffer: "अनुकूलित ऑफ़र",
      defaultFeatures: "अनुकूलित अभयारण्य • निजी द्वीप",
      hero: {
        subtitle1: "भाग 1 — द्वीपों की खोज करें",
        subtitle2: "भाग 2 — निजी प्रवास",
        subtitle3: "भाग 3 — स्टाइल में आराम करें",
        title1: "अपना",
        title1Alt: "स्वर्ग खोजें",
        title2: "लक्जरी",
        title2Alt: "बीच विला",
        title3: "पानी पर",
        title3Alt: "आराम",
        searchPlaceholder: "अपने सपनों की सैर खोजें..."
      },
      philosophy: {
        badge: "हमारी एजेंसी",
        quote: "द्वीपों की सुंदरता में शांति पाएं।",
        quoteAuthor: "द्वीप जीवन",
        title: "सबसे अच्छी मालदीव छुट्टियां।",
        subtitle: "हम आपको पृथ्वी पर सबसे सुंदर स्थानों में से एक के लिए सही सैर की योजना बनाने में मदद करते हैं।",
        description: "मालदीव सेरेनिटी ट्रेवल्स अड्डू सिटी में स्थित एक स्थानीय ट्रैवल एजेंसी है। हम आपकी यात्रा को विशेष बनाने के लिए व्यक्तिगत सेवा पर ध्यान केंद्रित करते हैं। सीप्लेन ट्रांसफर से लेकर अपना निजी समुद्र तट खोजने तक, हम आपके लिए सभी विवरणों का ध्यान रखते हैं।"
      },
      vibe: {
        badge: "सपनों की यात्रा",
        title: "अपना वाइब चुनें।",
        quietName: "शांत",
        quietDesc: "समुद्र के किनारे आराम करने के लिए शांतिपूर्ण स्थान।",
        adventureName: "साहसिक",
        adventureDesc: "डाइविंग के लिए जाएं या मजेदार वाटर स्पोर्ट्स आजमाएं।",
        familyName: "परिवार",
        familyDesc: "बच्चों और वयस्कों के लिए बेहतरीन रिसॉर्ट्स।",
        romanceName: "रोमांस",
        romanceDesc: "जोड़ों और हनीमून के लिए सही जगह।",
        exploreBtn: "खोजें"
      },
      collection: {
        badge: "हमारा पोर्टफोलियो",
        title: "शीर्ष रिसॉर्ट्स।",
        description: "हमने मालदीव में सबसे अच्छे रिसॉर्ट्स चुने हैं। हमारे द्वारा पेश किए जाने वाले हर स्थान पर बेहतरीन सेवा और पूर्ण गोपनीयता है।",
        findVilla: "अपने सपनों का विला खोजें।"
      },
      journal: {
        badge: "मालदीव जर्नल",
        title: "द्वीप की कहानियाँ।",
        subtitle: "मालदीव के बारे में सर्वोत्तम रहस्य, यात्रा युक्तियाँ और कहानियाँ खोजें।"
      },
      instagram: {
        badge: "सोशल पल्स",
        title: "सोशल मीडिया।",
        disconnect: "डिस्कनेक्ट करें",
        connect: "इंस्टाग्राम कनेक्ट करें",
        tryAgain: "पुनः प्रयास करें",
        noMedia: "कोई मीडिया नहीं मिला",
        connectTitle: "अपनी दुनिया को जोड़ें",
        connectDesc: "अपने इंस्टाग्राम फीड को अपने मालदीव पोर्टफोलियो के साथ सिंक करें।",
        linkAccount: "खाता लिंक करें"
      },
      chatbot: {
        welcome: "मैं सारा हूँ। अपने मालदीव के सपने का वर्णन करें, और मैं इसे साकार करूँगी।",
        askSara: "सारा से पूछें",
        reset: "रीसेट",
        resetMsg: "संवाद रीसेट हो गया है। मैं आपका मार्गदर्शन कैसे कर सकती हूँ?",
        authRequired: "प्रमाणीकरण आवश्यक",
        authDesc: "सारा के इंटेलिजेंस सुइट को सक्षम करने के लिए, कृपया अपनी जेमिनी एपीआई कुंजी चुनें।",
        connectSara: "सारा को कनेक्ट करें",
        billingRequired: "बिलिंग सक्षम प्रोजेक्ट कुंजी आवश्यक है।",
        billingDoc: "बिलिंग दस्तावेज़",
        placeholder: "एटोल के बारे में पूछें...",
        connectToBegin: "शुरू करने के लिए सारा को कनेक्ट करें",
        version: "परिप्रेक्ष्य इंटेलिजेंस v3.5",
        suite: "इंटेलिजेंस सुइट"
      },
      plan: {
        badge: "छुट्टियों के उद्धरण का अनुरोध करें",
        step: "चरण",
        next: "जारी रखें",
        back: "पीछे",
        submit: "पूछताछ सबमिट करें",
        submitting: "भेजा जा रहा है...",
        successBadge: "सबमिशन प्राप्त हुआ",
        successTitle: "परिप्रेक्ष्य प्रतीक्षा कर रहा है।",
        successDesc: "हमारे विशेषज्ञ आपके व्यक्तिगत मालदीव पोर्टफोलियो को क्यूरेट कर रहे हैं। 24 घंटों के भीतर अपने इनबॉक्स में एक डिजिटल प्रेषण की अपेक्षा करें।",
        returnHome: "होम पर वापस जाएं",
        q1: "आप मालदीव क्यों आ रहे हैं?",
        q2: "आप किन अनुभवों का सबसे अधिक इंतजार कर रहे हैं?",
        q2Desc: "कृपया अधिकतम तीन अनुभव चुनें या \"कोई प्राथमिकता नहीं\" पर क्लिक करके छोड़ दें।",
        q3: "आप क्या पसंद करते हैं?",
        q3Desc: "सही ठिकाने के लिए अपनी प्राथमिकताएं चुनें।",
        q4: "पसंदीदा रिसॉर्ट्स",
        q4Desc: "हमारी सिफारिशों को परिष्कृत करने के लिए 3 रिसॉर्ट्स के बीच खोजें और चुनें।",
        q5: "लगभग पूरा हो गया!",
        noResorts: "अभी तक कोई रिसॉर्ट नहीं चुना गया",
        searchPlaceholder: "संपत्ति का नाम खोजें...",
        fullName: "पूरा नाम",
        fullNamePlaceholder: "पहचान",
        phone: "संपर्क नंबर",
        email: "ईमेल पता",
        emailPlaceholder: "डिजिटल हस्ताक्षर",
        dates: "यात्रा की तिथियां",
        datesPlaceholder: "जैसे अक्टूबर 2024",
        guests: "अतिथियों की संख्या",
        mealPlan: "भोजन योजना",
        noPreferences: "कोई प्राथमिकता नहीं",
        purposes: {
          honeymoon: "हनीमून",
          anniversary: "शादी की सालगिरह",
          couples: "जोड़ों के लिए सैर",
          family: "पारिवारिक छुट्टी",
          solo: "अकेले यात्रा",
          group: "समूह छुट्टी"
        },
        experiences: {
          snorkelling: "स्नॉर्कलिंग",
          diving: "डाइविंग",
          surfing: "सर्फिंग",
          spa: "स्पा",
          food: "भोजन",
          culture: "इतिहास और संस्कृति"
        },
        preferences: {
          smallIsland: "छोटा द्वीप",
          largeIsland: "बड़ा द्वीप",
          luxuryResort: "लक्जरी रिसॉर्ट",
          affordableResort: "किफायती रिसॉर्ट",
          beachVilla: "बीच विला",
          waterVilla: "वाटर विला",
          pool: "पूल के साथ विला",
          noPool: "बिना पूल के"
        },
        mealPlans: {
          bb: "बेड एंड ब्रेकफास्ट",
          hb: "हाफ बोर्ड",
          fb: "फुल बोर्ड",
          ai: "ऑल इंक्लूसिव"
        }
      },
      seo: {
        homeTitle: "मालदीव सेरेनिटी ट्रेवल्स | सर्वश्रेष्ठ लक्जरी छुट्टियां",
        homeDesc: "हमारे साथ अपनी सही मालदीव यात्रा की योजना बनाएं। हम सर्वश्रेष्ठ लक्जरी रिसॉर्ट्स, वाटर विला और पारिवारिक अवकाश पैकेज प्रदान करते हैं।"
      },
      contactPage: {
        badge: "जुड़ें",
        title: "संपर्क करें।",
        subtitle: "हम आपकी सही मालदीव यात्रा की योजना बनाने में आपकी मदद करने के लिए यहाँ हैं।",
        callOrWhatsapp: "कॉल या व्हाट्सएप",
        support: "सहायता",
        directLine: "डायरेक्ट लाइन",
        email: "ईमेल",
        address: "पता",
        form: {
          name: "नाम",
          namePlaceholder: "आपका नाम",
          email: "ईमेल",
          emailPlaceholder: "आपका ईमेल",
          message: "संदेश",
          messagePlaceholder: "हम आपकी कैसे मदद कर सकते हैं?",
          send: "संदेश भेजें",
          successTitle: "संदेश भेज दिया गया।",
          successDesc: "हम 24 घंटों के भीतर आपसे संपर्क करेंगे।",
          sendAnother: "एक और भेजें"
        }
      },
      footer: {
        branding: "द्वीपसमूह के दक्षिणी सीमा से पैदा हुई एक अनुकूलित बुटीक एजेंसी। हम समझदार यात्रियों के लिए शांति और विलासिता का प्रबंधन करते हैं।",
        newsletter: {
          title: "डिजिटल डिस्पैच",
          subtitle: "सीधे मौसमी विशेषाधिकार और संपादकीय अपडेट प्राप्त करें।",
          placeholder: "आपका ईमेल",
          button: "जुड़ें"
        },
        nav: {
          agency: "एजेंसी",
          heritage: "हमारी विरासत",
          journal: "जर्नल",
          connect: "जुड़ें",
          careers: "करियर",
          portfolio: "पोर्टफोलियो",
          luxuryResorts: "लक्जरी रिसॉर्ट्स",
          guestHouses: "गेस्ट हाउस",
          liveaboards: "लिवाबोर्ड",
          exclusives: "एक्सक्लूसिव",
          governance: "शासन",
          terms: "सेवा की शर्तें",
          privacy: "गोपनीयता नीति",
          faq: "यात्रा सामान्य प्रश्न",
          safety: "सुरक्षा प्रोटोकॉल",
          social: "सोशल",
          instagram: "इंस्टाग्राम फीड",
          whatsapp: "व्हाट्सएप डायरेक्ट",
          twitter: "ट्विटर (X)",
          linkedin: "लिंक्डइन"
        },
        office: {
          title: "हमारा कार्यालय",
          hoursTitle: "सोम — शुक्र"
        }
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
