# Contributing to The Foodie Wagon

Thank you for your interest in contributing to The Foodie Wagon platform!

## About This Project

This is the platform for The Foodie Wagon, a Halal food truck in Ingolstadt, Germany. The site is built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, Zustand 5, and Supabase.

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md) to keep our community welcoming and respectful.

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended)
- Git
- A Supabase account (for full functionality)

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/System-for-Restaurants.git
   cd System-for-Restaurants
   ```

3. Install dependencies:
   ```bash
   pnpm install
   ```

4. Set up environment variables (see [SETUP.md](SETUP.md))

5. Run the development server:
   ```bash
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Development Workflow

### Branch Naming

- `feature/description` — New features
- `fix/description` — Bug fixes
- `docs/description` — Documentation updates
- `refactor/description` — Code refactoring
- `style/description` — UI/styling changes

### Commit Messages

Follow conventional commits:

```
feat: add new menu item component
fix: correct pricing display on mobile
docs: update README with setup instructions
style: improve hero section spacing
refactor: optimize menu category rendering
```

### Making Changes

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes

3. Test your changes:
   ```bash
   pnpm run build
   pnpm run lint
   ```

4. Commit your changes:
   ```bash
   git add .
   git commit -m "feat: your descriptive commit message"
   ```

5. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

6. Open a Pull Request

## Pull Request Guidelines

### Before Submitting

- Code builds without errors (`pnpm run build`)
- All existing functionality still works
- New features are documented
- Follows existing code style
- Responsive design tested (mobile, tablet, desktop)

### PR Description Should Include

- What changes were made
- Why these changes were necessary
- Screenshots (for UI changes)
- Related issue numbers (if applicable)

## Code Style Guidelines

### TypeScript/React

- Use functional components with TypeScript
- Prefer `const` over `let`
- Implement proper TypeScript types (avoid `any`)
- Use meaningful variable names

### Tailwind CSS

- Use Tailwind utility classes
- Follow mobile-first responsive design
- Maintain consistent spacing
- Use theme colors from `globals.css`

### File Organization

```
/app                  # Next.js App Router pages and layouts
/components           # Reusable UI components
/components/dashboard # Dashboard-specific components
/lib                  # Utilities, stores, hooks, config
/lib/supabase         # Supabase client, queries, mappers
/public               # Static assets (images, graphics)
/supabase             # Database schema and migrations
```

## Reporting Bugs

### Before Reporting

1. Check if the bug has already been reported
2. Verify the bug exists in the latest version
3. Collect information about your environment

### Bug Report Template

```
**Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- Browser: [e.g. Chrome 120]
- Device: [e.g. iPhone 12, Desktop]
```

## Suggesting Features

We welcome feature suggestions! Please:

1. Check if the feature has already been suggested
2. Explain the use case clearly
3. Describe how it would benefit users

## Areas We Need Help With

- Performance optimization
- Accessibility improvements
- SEO enhancements
- German/Arabic language translations
- Mobile responsiveness
- Testing and bug reports

## Legal

By contributing, you agree that your contributions will be licensed under the MIT License.

## Contact

For questions about contributing:
- Email: flavor.bytes.gmbh@gmail.com
- Phone: +49 176 22245627

Thank you for contributing to The Foodie Wagon!
