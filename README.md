# Editorial Magazine Hugo Theme

A bold editorial magazine-style Hugo theme with oversized typography, asymmetric layouts, and personality-driven design. Perfect for tech blogs, personal blogs, and content-first websites.

![Editorial Magazine Theme](screenshot.png)

## Features

- **Bold Editorial Design**: Oversized serif headlines with magazine-style layouts
- **Asymmetric Grid**: Break away from traditional blog layouts
- **Fully Responsive**: Works beautifully on all devices
- **Fast & Lightweight**: Minimal dependencies, pure CSS
- **SEO Optimized**: Semantic HTML and structured data
- **Syntax Highlighting**: Beautiful code blocks for technical content
- **Tag & Category Support**: Organize content your way
- **Newsletter Integration**: Built-in newsletter signup section
- **Social Links**: Connect all your profiles
- **RSS Feed**: Keep readers updated

## Installation

### Method 1: Hugo Modules (Recommended)

Initialize Hugo modules in your site:

```bash
hugo mod init github.com/yourusername/yoursite
```

Add the theme to your `config.toml`:

```toml
[module]
  [[module.imports]]
    path = "github.com/yourusername/editorial-theme"
```

### Method 2: Git Submodule

```bash
cd your-hugo-site
git submodule add https://github.com/yourusername/editorial-theme.git themes/editorial-theme
```

Then add to your `config.toml`:

```toml
theme = "editorial-theme"
```

### Method 3: Clone

```bash
cd your-hugo-site/themes
git clone https://github.com/yourusername/editorial-theme.git
```

## Configuration

Copy the example configuration from `exampleSite/config.toml` to your site's root:

```toml
baseURL = "https://yourdomain.com/"
languageCode = "en-us"
title = "Tech Insights"
theme = "editorial-theme"

paginate = 6

[params]
  description = "Deep Tech Wisdom for backend developers who care about craft"
  author = "Your Name"
  
  # Hero section
  heroTitle = "Deep Tech Wisdom"
  heroSubtitle = "For backend developers who care about craft"
  
  # Stats displayed on homepage
  [[params.stats]]
    label = "Articles"
    value = "40+"
  
  [[params.stats]]
    label = "Experience"
    value = "10+ yrs"

  # Social links
  [params.social]
    github = "https://github.com/yourusername"
    twitter = "https://twitter.com/yourusername"
    linkedin = "https://linkedin.com/in/yourusername"
    medium = "https://medium.com/@yourusername"

[menu]
  [[menu.main]]
    name = "Articles"
    url = "/posts/"
    weight = 1
  
  [[menu.main]]
    name = "Topics"
    url = "/tags/"
    weight = 2
  
  [[menu.main]]
    name = "About"
    url = "/about/"
    weight = 3

[taxonomies]
  tag = "tags"
  category = "categories"
```

## Creating Content

### Create a new post

```bash
hugo new posts/my-awesome-post.md
```

### Post Front Matter

```yaml
---
title: "My Awesome Post"
date: 2026-01-28
draft: false
categories: ["Node.js"]
tags: ["javascript", "backend", "security"]
author: "Your Name"
featuredTitle: "Custom featured title (optional)"
featuredDescription: "Custom featured description (optional)"
---

Your post content here...

<!--more-->

Content after the summary break...
```

### Front Matter Explained

- `title`: Post title (required)
- `date`: Publication date (required)
- `draft`: Set to `false` to publish
- `categories`: Primary category (first one shows as tag)
- `tags`: Multiple tags for the post
- `author`: Author name
- `featuredTitle`: Custom title for homepage featured section
- `featuredDescription`: Custom description for homepage

## Customization

### Colors

Edit `static/css/style.css` to change the color scheme:

```css
/* Main background */
background: #F5F1E8;

/* Primary text */
color: #1A1A1A;

/* Accent color (red) */
color: #E63946;
```

### Fonts

The theme uses:
- **Display font**: Fraunces (serif)
- **Body font**: Outfit (sans-serif)

To change fonts, edit the Google Fonts import in `static/css/style.css`.

### Hero Section

Customize the hero section in your `config.toml`:

```toml
[params]
  heroTitle = "Your Custom Title"
  heroSubtitle = "Your custom subtitle"
```

### Newsletter

The newsletter form action can be customized in `layouts/index.html`. Replace `action="#"` with your newsletter service endpoint (Mailchimp, ConvertKit, etc.).

## Typography

The theme uses editorial typography principles:

- **Oversized headlines**: 4rem to 10rem for maximum impact
- **Generous spacing**: Breathing room between elements
- **Bold weights**: 700-900 for headers
- **Readable body**: 1.125rem with 1.8 line height

## Layout Structure

```
editorial-theme/
├── archetypes/          # Post templates
├── layouts/
│   ├── _default/        # Default templates
│   │   ├── baseof.html  # Base template
│   │   ├── list.html    # List pages
│   │   ├── single.html  # Single post
│   │   ├── taxonomy.html # Tag pages
│   │   └── terms.html   # All tags page
│   ├── partials/        # Reusable components
│   │   ├── header.html
│   │   └── footer.html
│   └── index.html       # Homepage
├── static/
│   └── css/
│       └── style.css    # Main stylesheet
├── exampleSite/         # Example configuration
└── theme.toml           # Theme metadata
```

## Performance

The theme is optimized for performance:

- **No JavaScript dependencies**: Pure CSS animations
- **Minimal CSS**: Single stylesheet (~15KB)
- **Web fonts**: Google Fonts with `font-display: swap`
- **Semantic HTML**: Clean, accessible markup

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this theme for personal or commercial projects.

## Credits

- Design inspired by editorial magazine layouts
- Built for [Tech Insights](https://techinsights.manisuec.com)
- Created with Hugo

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: [your@email.com]

## Changelog

### v1.0.0 (2026-01-28)
- Initial release
- Homepage with hero section
- Single post layout
- Archive pages
- Tag/category support
- Newsletter section
- Responsive design
