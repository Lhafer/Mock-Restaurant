# Restaurant Website Template

A modern, full-featured restaurant website template built with **React**, **Vite**, **Supabase**, **Resend**, and **Stripe**.

## Features

- ⚡ **Fast & Modern Stack** - Built with React and Vite for optimal performance
- 🗄️ **Backend Database** - Supabase for real-time data management
- 📧 **Email Notifications** - Resend for reliable email delivery
- 💳 **Payment Processing** - Stripe integration for online orders and payments
- 🎨 **Responsive Design** - Mobile-first CSS styling (13.8% of codebase)
- ⚙️ **ESLint Configuration** - Code quality standards built-in

## Tech Stack

### Frontend
- **React** - UI library for building interactive components
- **Vite** - Next-generation build tool for lightning-fast development
- **JavaScript** - Primary language (85.5% of codebase)
- **CSS** - Styling and responsive design (13.8% of codebase)
- **HTML** - Markup (0.7% of codebase)

### Backend & Services
- **Supabase** - PostgreSQL database, authentication, and real-time features
- **Resend** - Email API for transactional emails
- **Stripe** - Payment processing and subscription management

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account
- Resend API key
- Stripe API keys

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Lhafer/restrauntTemplate.git
   cd restrauntTemplate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_RESEND_API_KEY=your_resend_api_key
   VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## Project Structure

```
restrauntTemplate/
├── src/
│   ├── components/     # React components
│   ├── pages/          # Page components
│   ├── styles/         # CSS styling
│   ├── App.jsx         # Main application component
│   └── main.jsx        # Entry point
├── public/             # Static assets
├── .env.local          # Environment variables (not committed)
├── vite.config.js      # Vite configuration
├── eslintrc.config.js  # ESLint rules
└── package.json        # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

## Key Features

- [ ] Restaurant menu display and management
- [ ] Online ordering system
- [ ] Payment processing with Stripe
- [ ] Email confirmations via Resend
- [ ] User authentication with Supabase
- [ ] Order tracking and management
- [ ] Admin dashboard
- [ ] Responsive mobile design

## Development

### HMR (Hot Module Replacement)
Vite provides fast HMR out of the box, allowing you to see changes instantly during development.

### ESLint Configuration
The project includes ESLint rules to maintain code quality. For production applications, consider enabling TypeScript with type-aware lint rules.

### React Plugin Options
Two official React plugins are available for optimization:
- `@vitejs/plugin-react` - Uses [Oxc](https://oxc.rs) for faster compilation
- `@vitejs/plugin-react-swc` - Uses [SWC](https://swc.rs/) for alternative processing

### React Compiler
The React Compiler is not enabled on this template by default due to its impact on dev & build performance. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or suggestions, please open an issue on the GitHub repository.

---

**Happy coding! 🚀**
