# Quick Start Guide

Get your Editorial Magazine Hugo site up and running in 5 minutes.

## Prerequisites

- Hugo Extended v0.120.0 or higher
- Git (for theme installation)

## Step 1: Install Hugo

### macOS
```bash
brew install hugo
```

### Windows
```bash
choco install hugo-extended
```

### Linux
```bash
snap install hugo
```

## Step 2: Create New Site

```bash
hugo new site my-blog
cd my-blog
```

## Step 3: Install Theme

```bash
git init
git submodule add https://github.com/yourusername/editorial-theme.git themes/editorial-theme
```

## Step 4: Configure

Copy the example config:

```bash
cp themes/editorial-theme/exampleSite/config.toml config.toml
```

Edit `config.toml` and update:
- `baseURL`
- `title`
- `params.author`
- Social media links

## Step 5: Add Content

Create your first post:

```bash
hugo new posts/my-first-post.md
```

Edit the file in `content/posts/my-first-post.md` and set `draft: false`.

## Step 6: Run Local Server

```bash
hugo server -D
```

Visit http://localhost:1313

## Step 7: Build for Production

```bash
hugo
```

Your site is now in the `public/` directory, ready to deploy!

## Deploy

### Netlify
1. Push your site to GitHub
2. Connect to Netlify
3. Set build command: `hugo`
4. Set publish directory: `public`

### Vercel
1. Push your site to GitHub
2. Import to Vercel
3. Framework preset: Hugo
4. Deploy!

### GitHub Pages
```bash
hugo
cd public
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/yourusername.github.io.git
git push -u origin main
```

## Customization

### Change Colors

Edit `themes/editorial-theme/static/css/style.css`:

```css
/* Change accent color */
color: #E63946; /* Change to your color */
background: #E63946; /* Change to your color */
```

### Change Fonts

Update the Google Fonts import in `static/css/style.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=YourFont&display=swap');
```

### Add Custom CSS

Create `static/css/custom.css` and add to your config:

```toml
[params]
  customCSS = ["css/custom.css"]
```

## Need Help?

- Check the [full README](README.md)
- Open an issue on GitHub
- Visit Hugo docs: https://gohugo.io/documentation/

## Next Steps

1. Write more content
2. Customize the design
3. Add analytics
4. Set up comments (Disqus, etc.)
5. Configure SEO
6. Deploy to production

Happy blogging! 🚀
