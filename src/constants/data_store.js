// ========== FILES ===========
import narutoChibi from "../../assets/arts/naruto_2.png";
import leviChibi from "../../assets/arts/levi_1.png";
import luffyChibi from "../../assets/arts/luffy_1.png";
import togaChibi from "../../assets/arts/toga_1.png";
import colors from "./colors";
import uuid from "react-native-uuid";

export const characterRoles = [
  { id: "1", title: "Protagonist / Main Character" },
  { id: "3", title: "Deuteragonist / Second VIP Character" },
  { id: "2", title: "Antagonist / Boss Villian " },
  { id: "5", title: "Villian Character" },
  { id: "10", title: "Major Allied Character" },
  { id: "6", title: "Love Interest Character" },
  { id: "7", title: "Mentor Character" },
  { id: "18", title: "Narrator Character" },
  { id: "4", title: "Minor Character" },
  { id: "8", title: "Filler Character" },
];

export const charPropInfos = [
  {
    id: "1",
    name: "Name",
    prop: "name",
    selected: false,
  },
  {
    id: "2479",
    name: "Other names",
    prop: "other_names",
    selected: false,
  },
  {
    id: "2",
    name: "Show",
    prop: "show",
    prop2: "name_j",
    prop3: "name_e",
    selected: false,
  },
  {
    id: "3",
    name: "Role",
    prop: "role",
    selected: false,
  },
  {
    id: "4",
    name: "Type",
    prop: "type",
    selected: false,
  },
  {
    id: "674",
    name: "Groups",
    prop: "groups",
    selected: false,
  },
  {
    id: "5",
    name: "Birthday",
    prop: "birthday",
    selected: false,
  },
  {
    id: "6",
    name: "Gender",
    prop: "gender",
    selected: false,
  },
  {
    id: "7",
    name: "Height",
    prop: "height",
    selected: false,
  },
  {
    id: "8",
    name: "Rival",
    prop: "rival",
    selected: false,
  },
  {
    id: "9",
    name: "Voice Actors",
    prop: "voiceActor",
    selected: false,
  },
  {
    id: "10",
    name: "Father",
    prop: "father",
    selected: false,
  },
  {
    id: "11",
    name: "Mother",
    prop: "mother",
    selected: false,
  },
  {
    id: "57856",
    name: "Brothers",
    prop: "brothers",
    selected: false,
  },
  {
    id: "45",
    name: "Sisters",
    prop: "sisters",
    selected: false,
  },
  {
    id: "14",
    name: "Lover",
    prop: "lover",
    selected: false,
  },
];

export const characterTypes = [
  {
    id: uuid.v4(),
    title: "Tsundere",
    description:
      "Tsundere have harsh personalities acting in a way where they show hatred to their love interest.They get embarrassed when they are complimented or shown appreciation but make their love interest feel as if they can’t stand them",
    example: "Taiga Aisaka from Toradora",
  },
  {
    id: uuid.v4(),
    title: "Yandere",
    description:
      "The Yandere character is very deceiving at first. Yanderes are obsessed with their love interest and will make ends meet to get with them no matter what. Yan comes from Yanderu meaning mentally ill",
    example: "Satou Matsuzaka from Happy Sugar Life",
  },
  {
    id: uuid.v4(),
    title: "Deredere",
    description:
      "The Deredere character is the friendliest of the Deres. A Deredere is kind to everyone and makes sure their love interest knows it. Dere means lovestruck",
    example: "Rinko Yamato from Ore Monogatari",
  },
  {
    id: uuid.v4(),
    title: "Dandere",
    description:
      "The Dandere character is the strong silent type. The “Dan” in Dandere means silence. Quiet and shy, the Dandere is closed off to the world. Like the Kuudere, the Dandere isn’t always cold to everyone but just prefers to be quiet",
    example: "Nagisa Furukawa from Clannad",
  },
  {
    id: uuid.v4(),
    title: "Himedere(F)/Oujidere(M)",
    description:
      "The Himedere and the Oujidere are the male and female Dere types that want to be treated like Princess and Princes. The characters that fall into these categories don’t have to be royalty but just want their love interest to treat them as such",
    example: "Noelle Silva from Black Clover",
  },
  {
    id: uuid.v4(),
    title: "Bakadere",
    description:
      "The Bakadere is a character that is clumsy and often doesn’t make smart decisions. The word Baka, as you probably already know means stupid.",
    example: "Red Blood Cell from Cells at Work.",
  },
  {
    id: uuid.v4(),
    title: "Kamidere",
    description:
      "The Kamidere is a character with a god complex. Kami is the Japanese word for god. The Kamidere isn’t restricted to a specific gender and often just craves power more than a love interest. Kamidere are very arrogant and believe that they are the greatest creation in the world",
    example: "Light Yagami from Death Note",
  },
  {
    id: uuid.v4(),
    title: "Kuudere",
    description:
      "The Kuudere is quiet like the Dandere but is cold and cynical. Kuu comes from the Japanese pronunciation of the English world “cool”. The Kuudere rarely shows a caring side even to their love interest on the outside but cares on the inside",
    example: "Homura Akemi from Madoka Magica",
  },
  {
    id: uuid.v4(),
    title: "Sadodere",
    description:
      "The Sadodere is a character that loves to manipulate in sadistic ways. Sado comes from Sadomasochism and describes the personality of a cruel character. The Sadodere gets pleasure from putting their love interest in a tough situation that either causes them pain or humiliation",
    example: "Kurumi Tokisaki from Date A Live",
  },
  {
    id: uuid.v4(),
    title: "Shundere",
    description:
      "The Shundere suffers from depression and is sad throughout the series. Shun comes from a Japanese sound “shun” which is used to represent sadness. Shunderes don’t always need to have a reason to be sad, as most just have a depressing aura around them",
    example: "Tomoko Kuroki from WataMote",
  },
];

export const showGenres = [
  {
    id: "1",
    discription:
      "The action genre depicts extremely high levels of intense action",
    example: "Fullmetal Alchemist",
    title: "Action",
  },
  {
    id: "2",
    title: "Adventure",
    discription:
      "The adventure genre is about travelling and undertaking an adventure in a certain place or around the world ",
    example: "One Piece",
  },
  {
    id: "3",
    title: "Romance",
    discription: "Romance is all about love and sweet moments",
    example: "Honey and Clover",
  },
  {
    id: "4",
    title: "Comedy",
    discription: "The main purpose of the comedy genre is to make you laugh!",
    example: "Gintama",
  },
  {
    id: "5",
    title: "Drama",
    discription:
      "Bringing us tears and a wave of emotions is basically what the drama genre does best!",
    example: "Clannad",
  },
  {
    id: "6",
    title: "Fantasy",
    discription:
      "The fantasy genre in anime primarily deals with fantasy worlds and surreal events and locations",
    example: "Nanatsu no Taizai",
  },
  {
    id: "7",
    title: "Magic",
    discription:
      "Magic, in all its essence, is about magical stuff like spells and incantations",
    example: "Magi: Labyrinth of Magic",
  },
  {
    id: "8",
    title: "Supernatural",
    discription:
      "Supernatural are most times mythical, mystical, bizarre, or something outside the bounds of accepted reality",
    example: "Blue Exorcist",
  },
  {
    id: "9",
    title: "Horror",
    discription:
      " If there are ghosts, monsters, gore, and creeps, then this genre is your pick",
    example: "Parasyte -the maxim",
  },
  {
    id: "10",
    title: "Mystery",
    discription:
      "Whether it’s an event, a place, or an item, there’s some sort of mystery surrounding the narrative.",
    example: "Detective Conan",
  },
  {
    id: "11",
    title: "Psychological",
    discription:
      "Psychological anime are shows that delve into how the mind and psyche work",
    example: "Death Note",
  },
  {
    id: "12",
    title: "Sci-Fi",
    discription:
      "Sci-fi (short for science fiction) is a genre that showcases scientific and technological elements",
    example: "Evangelion",
  },
];

export const showInfoProps = [
  {
    id: "1",
    name: "Name in Japanese",
    prop: "name_j",
    selected: false,
  },
  {
    id: "2479",
    name: "Name in English",
    prop: "name_e",
    selected: false,
  },
  {
    id: "10",
    name: "Other names",
    prop: "other_names",
    selected: false,
  },
  {
    id: "11",
    name: "Spinoffs",
    prop: "spinoffs",
    selected: false,
  },
  {
    id: "2",
    name: "Episodes",
    prop: "episodes",
    selected: false,
  },
  {
    id: "8",
    name: "Main Genres",
    prop: "genres",
    selected: false,
  },
  {
    id: "9",
    name: "Sub Genres",
    prop: "subGenres",
    selected: false,
  },
  {
    id: "3",
    name: "Creator",
    prop: "creator",
    selected: false,
  },
  {
    id: "4",
    name: "Release Date",
    prop: "releaseDate",
    selected: false,
  },
  {
    id: "674",
    name: "End Date",
    prop: "endDate",
    selected: false,
  },
];

export const subGenres = [
  {
    id: "1",
    title: "Cyberpunk",
    discription:
      "This type of anime is a subgenre of sci-fi. It usually displays a future where society has become more ingrained with technology",
    example: "Ghost in the Shell",
  },
  {
    id: "2",
    title: "Game",
    discription:
      "The game category encompasses shows revolving around the idea of gaming and playing",
    example: "Yu-Gi-Oh!",
  },
  {
    id: "3",
    title: "Ecchi",
    discription:
      "This subgenre is generally accepted as being full of sexually provocative scenes plus comedy sometimes",
    example: "High School DxD",
  },
  {
    id: "4",
    title: "Demons",
    discription:
      "This majors in monsters, beasts, ghosts, and other demon-type figures",
    example: "Chrono Crusade",
  },
  {
    id: "5",
    title: "Harem",
    discription:
      "This type features more than two female characters go head-over-heels for a single male characte",
    example: "Nisekoi",
  },
  {
    id: "6",
    title: "Josei",
    discription:
      "It specifically targets female viewers around the age range of 18-40",
    example: "Princess Jellyfish",
  },
  {
    id: "7",
    title: "Martial Arts",
    discription:
      "Martial arts play a big role in every anime that has fighting/battles in it",
    example: "Baki the Grappler",
  },
  {
    id: "8",
    title: "Kids",
    discription: "These are perfect for children 12 and under",
    example: "Doraemon",
  },
  {
    id: "9",
    title: "Historical",
    discription:
      "This anime revolves around events in history and moments of antiquity",
    example: "Samurai Champloo",
  },
  {
    id: "10",
    title: "Hentai",
    discription:
      'Hentai means "pervert" in Japanese. This is the R-18 (mature) domain of the anime world',
    example: "Yokosou! Sukebe Elf no Mori ",
  },
  {
    id: "11",
    title: "Isekai",
    discription:
      "This subgenre typically has a narrative where a protagonist somehow gets transported to a different world",
    example: "Sword Art Online",
  },
  {
    id: "12",
    title: "Military",
    discription:
      "This subgenre involves the military and wars in one way or another.",
    example: "Code Geass",
  },
  {
    id: "13",
    title: "Mecha",
    discription:
      "Mecha stands for mechanical (as in mechanical units or robots)",
    example: "Mobile Suit Gundam",
  },
  {
    id: "14",
    title: "Music",
    discription:
      "These shows typically focus on singing, dancing, or playing musical instruments",
    example: "K-On!",
  },
  {
    id: "15",
    title: "Police",
    discription:
      "The police subgenre emphasizes the life and struggles of law enforcement in their line of duty.",
    example: "Psycho-Pass",
  },
  {
    id: "16",
    title: "Post-Apocalyptic",
    discription:
      "Animes where the world is destroyed and/or humans are nearly extinct",
    example: "Attack on Titan",
  },
  {
    id: "17",
    title: "School",
    discription:
      "Animes where school is the primary setting and the anime deals mostly with school and student life",
    example: "Ansatsu Kyoushitsu",
  },
  {
    id: "18",
    title: "Seinen",
    discription:
      "Specifically targets male viewers around the age range of 18-40. ",
    example: "Berserk",
  },
  {
    id: "19",
    title: "Shoujo",
    discription:
      "Specifically targets female viewers around the age range of 10-18",
    example: "Sailor Moon Crystal",
  },
  {
    id: "20",
    title: "Shoujo-ai",
    discription:
      "The typically young female characters in shojou-ai anime show love and affection for each other",
    example: "Aoi Hana",
  },
  {
    id: "21",
    title: "Shounen",
    discription:
      "Specifically targets male viewers around the age range of 10-18",
    example: "Naruto",
  },
  {
    id: "22",
    title: "Shounen-ai",
    discription:
      "The typically younger boys in these shows display tender affection for each other",
    example: "Hybrid Child",
  },
  {
    id: "23",
    title: "Space",
    discription: "Any anime set in the cosmos can be labeled in this category",
    example: "Outlaw Star",
  },
  {
    id: "24",
    title: "Sports",
    discription: "Shows that cover characters engaging in athletic competition",
    example: "Haikyuu!!",
  },
  {
    id: "25",
    title: "Super Power",
    discription:
      "Your pick if you’re seeing an array of explosive super powers scrambling right on the screen.",
    example: "Dragon Ball",
  },
  {
    id: "246",
    title: "Tragedy",
    discription:
      "Revolves around tragic events or phenomenon where the characters are deeply involved and affected",
    example: "Tokyo Magnitude 8.0",
  },
  {
    id: "279",
    title: "Vampire",
    discription: "Concepts of vampires, werewolves and other human beasts",
    example: "Vampire Knight",
  },
  {
    id: "2496",
    title: "Yaoi",
    discription:
      "Yaoi is the much more sexually explicit counterpart of shounen-ai (older boys)",
    example: "Super Lovers",
  },
  {
    id: "285",
    title: "Yuri",
    discription:
      "Yuri is essentially the more mature and explicit version of shojou-ai",
    example: "Yuri Kuma Arashi",
  },
];

export const actionDatas = [
  {
    id: "1",
    title: "Channels",
    subTitle: "See your favorite channels!",
    info1: "Subscribe to different channels to get good feeds",
    nav: "Channel",
    bg: "#ffafbd",
    bg1: "#ffc3a0",
    icon: "tv",
    iconPack: "I",
  },
  {
    id: "48d",
    title: "Stories",
    subTitle: "Daily feeds!",
    info1: "Have fun with watching stories",
    nav: "modal",
    bg: "#42275a",
    bg1: "#734b6d",
    icon: "circle",
    iconPack: "F",
  },
  {
    id: "4",
    title: "Connect",
    subTitle: "Connect with weebos nearby.",
    info1: "Browse and follow your favorite groups",
    nav: "Connect",
    bg: "#36d1dc",
    bg1: "#5b86e5",
    icon: "locate-sharp",
    iconPack: "I",
  },
  {
    id: "2",
    title: "Shows",
    subTitle: "See your favorite anime shows!",
    info1: "Browse and follow your favorite shows",
    nav: "Shows",
    bg: "#2b5876",
    bg1: "#4e4376",
    icon: "tv-sharp",
    iconPack: "I",
  },
  {
    id: "3",
    title: "Groups",
    subTitle: "See anime organizations!",
    info1: "Browse and follow your favorite groups",
    nav: "Group",
    bg: "#06beb6",
    bg1: "#48b1bf",
    icon: "people",
    iconPack: "I",
  },
];

export const calender = {
  months: [
    { full: "January", short: "Jan" },
    {
      full: "February",
      short: "Feb",
    },
    {
      full: "March",
      short: "Mar",
    },
    {
      full: "April",
      short: "Apr",
    },
    {
      full: "May",
      short: "May",
    },
    {
      full: "June",
      short: "Jun",
    },
    {
      full: "July",
      short: "Jul",
    },
    {
      full: "August",
      short: "Aug",
    },
    {
      full: "September",
      short: "Sept",
    },
    {
      full: "October",
      short: "Oct",
    },
    {
      full: "November",
      short: "Nov",
    },
    {
      full: "December",
      short: "Dec",
    },
  ],
};

export const HomeArr = [
  {
    id: "ifhdfoih",
    text: "spacer",
  },
  {
    id: "9686981",
    title: "Weebo welcomes You!",
    text: "Hello Weeb, Weebo welcomes you to the Manga and Anime community of degenerate weebs just like you \n Have fun and connect with your fellow weebs in this Beta version, a more stable version of the app will be released soon",
    bg: "#C45D33",
    image: narutoChibi,
  },
  {
    id: "2986",
    title: "Weebo Instances",
    text: "Weebo Instances represents official Anime or Manga Series, Characters, Groups and even your own Channels \n These Weebo Instances will be managed by you when created, or won in Challenges. \n Please do not create existing instance that's already created in the app as they will not be verified and consequently removed",
    bg: "#A40D4E",
    // bg: "#9E6B59",
    image: togaChibi,
  },
  {
    id: "986082",
    title: "Weebo on Android",
    text: "Yo weeb, Weebo is currently only available on the android platform. \n The team is working really hard for the iOS version, please be patient and stay updated",
    bg: "#77472E",
    image: leviChibi,
  },
  {
    id: "276",
    title: "Support Weebo",
    text: "You can support the Weebo team to help improve this app. \n The Weebo developer team requires support for a better app management and user experience",
    bg: colors.facebook,
    image: luffyChibi,
  },
  {
    id: "sshsi",
    text: "spacer",
  },
];

// not needed
export const app_constants = {
  appID: "5fca7d38d49a5c21e4af4bbb",
};

// not needed
export const test_location_obj = {
  coords: {
    accuracy: 500,
    altitude: 0,
    altitudeAccuracy: 0,
    heading: 0,
    latitude: 7.8259637,
    longitude: 6.0750349,
    speed: 0,
  },
  mocked: false,
  timestamp: 1665566676905,
};

export const challenger_info_lookup = {
  dropdown: ["type", "role", "genres", "subGenres"],
  datetime: ["birthday", "releaseDate", "endDate"],
};

export const settingsData = [
  {
    id: "1",
    title: "General",
    data: [
      {
        id: "1",
        name: "Auto video play",
        key: "vid",
        type: "toggle",
        default: false,
      },

      {
        id: "2",
        name: "Language",
        type: "dropdown",
        default: "english",
        options: ["english", "japanese"],
      },
      {
        id: "3",
        name: "Turn on Notifications",
        type: "toggle",
        key: "noti",
        default: true,
      },
    ],
  },
  {
    id: "2",
    title: "Appearance",
    data: [
      {
        id: "1",
        name: "Dark theme mode",
        type: "toggle",
        default: false,
        options: [],
      },
    ],
  },
  {
    id: "3",
    title: "User",
    data: [
      {
        id: "1",
        name: "Delete account",
        type: "action",
        default: null,
        options: "delete",
      },

      {
        id: "2",
        name: "Terms, Conditions & App policy",
        type: "action",
        default: "null",
        options: "account",
      },
    ],
  },
];

export const emailers = [
  {
    id: "1",
    text: "",
    focused: true,
    isBackspace: false,
  },
  {
    id: "2",
    text: "",
    focused: false,
    isBackspace: false,
  },
  {
    id: "3",
    text: "",
    focused: false,
    isBackspace: false,
  },
  {
    id: "4",
    text: "",
    focused: false,
    isBackspace: false,
  },
  {
    id: "5",
    text: "",
    focused: false,
    isBackspace: false,
  },
  {
    id: "6",
    text: "",
    focused: false,
    isBackspace: false,
  },
];

export const filters = [
  {
    id: uuid.v4(),
    name: "Genre",
    type: "genres",
    data: showGenres,
    title: "Filter by Genres",
  },
  {
    id: uuid.v4(),
    name: "Sub Genre",
    type: "subGenres",
    data: subGenres,
    title: "Filter by Sub-Genres",
  },
  {
    id: uuid.v4(),
    name: "Release Date",
    type: "releaseDate",
    data: null,
    title: "Filter by Release Date",
  },
  {
    id: uuid.v4(),
    name: "End Date",
    type: "endDate",
    data: null,
    title: "Filter by End Date",
  },
  {
    id: uuid.v4(),
    name: "Episodes",
    type: "episodes",
    data: null,
    title: "Sort by Episodes",
  },
  {
    id: uuid.v4(),
    name: "Characters",
    type: "characters",
    data: null,
    title: "Sort by Characters",
  },
  {
    id: uuid.v4(),
    name: "Groups",
    type: "groups",
    data: null,
    title: "Sort by Groups",
  },
  {
    id: uuid.v4(),
    name: "Followers",
    type: "followers",
    data: null,
    title: "Sort by Followers",
  },
];

export const ads_keywords = [
  "anime",
  "weeb",
  "otaku",
  "comics",
  "manga",
  "manhwa",
  "toon",
  "animation",
];

export const ADS_INTERVAL = 10;

export const alertGuide = [
  {
    id: uuid.v4(),
    icon: "gesture-swipe-left",
    text: "You can swipe notifications for more actions",
  },
];
export const homeGuide = [
  {
    id: uuid.v4(),
    icon: "heart-multiple-outline",
    text: "Double click on a post to like the post",
  },
  {
    id: uuid.v4(),
    icon: "play",
    text: "Press and hold on a video post to display fullscreen",
  },
];

export const app_policy = [
  {
    id: uuid.v4(),
    name: "APP POLICY",
    detail:
      "Thank you for using Weebo. This App Policy sets out the terms and conditions governing your use of the app. By accessing or using the Weebo app, you agree to be bound by this policy \n\n 1. Privacy Policy: Our app collects and uses your personal information in accordance with our Privacy Policy. By using our app, you agree to the collection and use of your personal information as described in our Privacy Policy. \n\n 2. User Content: Our app allows you to post content such as photos, videos, and text. You are solely responsible for the content that you post on the app. By posting content on the app, you represent and warrant that you own or have the necessary licenses, rights, consents, and permissions to use and authorize us to use your content. \n\n 3. Prohibited Activities: You agree not to engage in any activities that are prohibited by law or violate our community standards. Prohibited activities include, but are not limited to, posting content that is defamatory, obscene, or offensive, harassing other users, and violating the intellectual property rights of others. \n\n 4. Termination: We may terminate your access to the app at any time without notice or liability. Upon termination, you must immediately delete the app from your device. \n\n 5. Changes to App Policy: We reserve the right to modify this App Policy at any time. We will notify you of any changes by posting the updated policy on our app. Your continued use of our app after the updated policy has been posted constitutes your acceptance of the changes.",
  },
  {
    id: uuid.v4(),
    name: "TERMS AND CONDITIONS",
    detail:
      "Welcome to Weebo app. These Terms and Conditions set out the terms and conditions governing your use of our app. By accessing or using our app, you agree to be bound by these Terms and Conditions. \n\n 1. License: We grant you a non-exclusive, non-transferable, revocable license to use our app for personal, non-commercial purposes only. You may not copy, modify, distribute, sell, or transfer any part of our app without our prior written consent.\n\n 2. User Content: Our app allows you to post content such as photos, videos, and text. You are solely responsible for the content that you post on our app. By posting content on our app, you represent and warrant that you own or have the necessary licenses, rights, consents, and permissions to use and authorize us to use your content.\n\n 3. Prohibited Activities: You agree not to engage in any activities that are prohibited by law or violate our community standards. Prohibited activities include, but are not limited to, posting content that is defamatory, obscene, or offensive, harassing other users, and violating the intellectual property rights of others.\n\n 4. Intellectual Property: All intellectual property rights in our app, including but not limited to copyright, trademarks, and trade secrets, are owned by us or our licensors. You may not use our intellectual property without our prior written consent.\n\n 5. Disclaimers: Our app is provided 'as is' and without warranty of any kind, either express or implied, including but not limited to, the implied warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not warrant that our app will be uninterrupted or error-free, that defects will be corrected, or that our app or the servers that make it available are free of viruses or other harmful components.\n\n 6. Limitation of Liability: We will not be liable to you or any third party for any indirect, special, incidental, consequential, or punitive damages arising out of or relating to your use of our app, even if we have been advised of the possibility of such damages. Our liability to you or any third party shall in no event exceed the total amount paid by you to us.",
  },
];
