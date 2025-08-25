# GitHub Pages Deployment Guide for Vue Version

## Yes, the Vue version CAN run on GitHub Pages! 

Here's how it works and how to deploy it:

## How It Works

1. **Build Process**: Vite compiles the Vue app into static HTML, CSS, and JS files
2. **Static Files**: The built files are just regular static files that GitHub Pages can serve
3. **Asset Optimization**: Vite optimizes and bundles all assets for production
4. **Progressive Enhancement**: Users get a fast, static site that becomes interactive when JS loads

## Deployment Options

### Option 1: Automatic Deployment (Recommended)

I've created a GitHub Actions workflow that automatically:
- Builds the Vue app when you push changes
- Maintains the current vanilla JS version as a fallback  
- Creates a version selector page
- Deploys everything to GitHub Pages

**Setup Steps:**
1. Commit and push the Vue files to your repo
2. Enable GitHub Pages in repository settings → Pages → Source: "GitHub Actions"
3. The workflow will automatically run on pushes to main branch

**Result:**
- Main page offers choice between Current (vanilla) and Vue (beta) versions
- Both versions available at same domain
- Automatic deployment on code changes

### Option 2: Manual Deployment

**Build locally:**
```bash
# Install dependencies
npm install

# Build for GitHub Pages
npm run build:github

# The dist-vue/ folder contains deployable files
```

**Deploy:**
1. Copy contents of `dist-vue/` to your GitHub Pages branch
2. Ensure data files and assets are accessible
3. Test that paths work correctly

## File Structure After Deployment

```
your-site.github.io/cotc/
├── index.html          # Version selector page
├── vanilla.html        # Current vanilla JS version  
├── vue.html           # New Vue version
├── assets/            # Vue app JS/CSS (hashed filenames)
├── css/              # Original stylesheets
├── js/               # Original JavaScript
├── data/             # Character data (shared)
├── images/           # Character images (shared)
└── docs/             # Documentation
```

## Configuration Details

### Vite Configuration
- **Base Path**: Set to `/cotc/` for GitHub Pages
- **Build Output**: `dist-vue/` to avoid conflicts
- **Asset Optimization**: Automatic code splitting and minification
- **Entry Point**: Uses `index-vue.html` as template

### GitHub Actions Workflow
- **Trigger**: Pushes to main branch affecting Vue files
- **Build**: Node.js 18, npm ci, Vue build process
- **Deploy**: Uses official GitHub Pages actions
- **Fallback**: Maintains current site alongside Vue version

## Testing Deployment

### Local Testing
```bash
# Build and preview locally
npm run build:github
npm run preview

# Or test with Python server
cd dist-vue
python -m http.server 8080
```

### Production Testing
1. Check version selector loads
2. Test both vanilla and Vue versions
3. Verify data loads correctly  
4. Test on mobile devices
5. Check console for errors

## Performance Considerations

### Vue Version Benefits
- **Code Splitting**: Only loads needed code
- **Tree Shaking**: Removes unused code
- **Asset Optimization**: Compressed CSS and JS
- **Modern JavaScript**: Uses latest browser features
- **Progressive Loading**: UI shows while data loads

### Bundle Analysis
```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist-vue
```

## Rollback Plan

If issues occur:
1. **Immediate**: Change version selector to default to vanilla version
2. **Quick Fix**: Disable Vue version link temporarily  
3. **Full Rollback**: Remove Vue version and revert to vanilla-only
4. **Debug**: Use browser dev tools and GitHub Actions logs

## Migration Timeline

### Phase 1: Side-by-Side (Current)
- Both versions available
- Users can choose which to use
- Gather feedback and fix issues

### Phase 2: Beta Default
- Make Vue version the default choice
- Keep vanilla as "Classic Version"
- Monitor usage and performance

### Phase 3: Vue Primary
- Vue becomes main version
- Vanilla available as legacy option
- Focus development on Vue

### Phase 4: Vue Only
- Remove vanilla version
- Single Vue application
- Clean up old files

## Monitoring & Analytics

The deployment includes:
- **GoatCounter Analytics**: Tracks which version users choose
- **Error Tracking**: Console errors logged to browser dev tools
- **Performance**: Core Web Vitals automatically tracked
- **Usage Patterns**: See which features are most used

## Troubleshooting

### Common Issues

**"Module not found" errors:**
- Check that base path is set correctly in vite.config.js
- Ensure data files are copied to build output

**Blank page on load:**
- Check browser console for JavaScript errors
- Verify assets are loading from correct paths
- Test locally first with `npm run preview`

**Styling issues:**
- Ensure CSS files are included in build
- Check that CSS custom properties are supported
- Test on different browsers

**Data loading fails:**
- Verify `data/characters_enhanced_v2.json` is accessible
- Check network tab for failed requests
- Ensure CORS isn't blocking requests

### Debug Commands
```bash
# Check build output
ls -la dist-vue/

# Test static serving
cd dist-vue && python -m http.server 8080

# Check for broken links
# Use browser dev tools Network tab
```

## Next Steps

1. **Test Locally**: Run `npm run build:github` and test the build
2. **Setup Deployment**: Enable GitHub Actions in your repo
3. **Monitor Launch**: Watch for issues in first few days
4. **Iterate**: Based on user feedback and usage data
5. **Gradual Migration**: Follow the phase plan above

The Vue version is fully compatible with GitHub Pages and will provide a much better foundation for future development while maintaining all current functionality.