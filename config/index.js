module.exports = {
  //-- SITE SETTINGS -----
  author: "Giorgio Delle Grottaglie",
  siteTitle: "Giorgio Delle Grottaglie - giorgiodg.it",
  siteShortTitle: "giorgiodg.it", // Used as logo text in header, footer
  siteDescription:
    "I am Giorgio Delle Grottaglie, and I do Technology stuff. Born and raised in the Heel of Italy, based in Rome.",
  siteUrl: "https://giorgiodg.it",
  siteImage: "lighthouse.jpg",
  siteLanguage: "en_UK",
  siteIcon: "static/favicon.png", // Relative to gatsby-config file
  seoTitleSuffix: "giorgiodg.it", // SEO title syntax will be e.g. "Imprint - {seoTitleSuffix}"

  //-- ARTICLES SECTION SETTINGS -----
  // You can create your own Medium feed with this rss to json converter: https://rss2json.com/
  // To access your Medium RSS feed, just replace this url with your username: https://medium.com/feed/@{yourname}
  mediumRssFeed:
    "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fmedium.com%2Ffeed%2F%40geordie__",

  shownArticles: 3,

  //-- SOCIAL MEDIA SETTINGS -----
  // There are icons available for the following platforms:
  // Medium, GitHub, LinkedIn, XING, Behance
  socialMedia: [
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/giorgiodellegrottaglie/",
    },
    {
      name: "GitHub",
      url: "https://github.com/giorgiodg/",
    },
    {
      name: "Medium",
      url: "https://medium.com/@geordie__",
    },
  ],

  //-- NAVIGATION SETTINGS -----
  navLinks: {
    menu: [
      {
        name: "About",
        url: "/#about",
      },
    ],
    button: {
      name: "Contact",
      url: "/#contact",
    },
  },
  footerLinks: [
    {
      name: "Credits",
      url: "/credits",
    },
  ],
}
