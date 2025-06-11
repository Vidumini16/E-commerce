# E-Commerce Product Dashboard

A full-featured React + Vite application for managing an e-commerce product catalog with complete CRUD functionality, advanced search/filter, and performance optimizations.

## Features

- **Product Grid:** Responsive display of products with image, name, price, category, stock status, and truncated description.
- **CRUD Operations:** Add, edit, delete, and bulk delete products with confirmation and undo support.
- **Advanced Filtering:** Real-time search, category, price range, and stock status filters—all combinable.
- **Form Validation:** Inline, real-time validation for all product form fields.
- **Local Storage Persistence:** Products are saved to and loaded from localStorage.
- **State Management:** Uses `useReducer` and custom hooks for robust state handling.
- **Performance:** Memoized components, debounced search, lazy-loaded images, and optimized renders.
- **Testing:** Comprehensive test suite using React Testing Library and Jest.
- **Accessibility:** Keyboard navigation, ARIA labels, and screen reader support.
- **Error Handling:** Graceful error boundaries and user feedback for all operations.

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

```sh
git clone https://github.com/your-username/ecommerce-dashboard.git
cd ecommerce-dashboard
npm install
# or
yarn install
```

### Running Locally

```sh
npm run dev
# or
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```sh
npm run build
# or
yarn build
```

### Running Tests

```sh
npm test
# or
yarn test
```

> **Note:**  
> The test files are located in the `src/__tests__/` directory and use [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).
>
> To run all tests, use the command above in your project root.  
> Make sure you have installed all dependencies (`npm install` or `yarn install`) before running tests.

## Project Structure

```
src/
  components/      # React components (Header, ProductForm, ProductList, etc.)
  hooks/           # Custom React hooks (useLocalStorage, etc.)
  utils/           # Utility functions (formatting, validation, etc.)
  __tests__/       # Test files for components and features
  App.jsx          # Main application component
  main.jsx         # Entry point
  index.css        # Global styles
```

## Key Architectural Decisions

- **useReducer** is used for product state to handle complex updates and ensure immutability.
- **Custom hooks** (`useLocalStorage`, etc.) encapsulate reusable logic.
- **Component splitting** and memoization are applied for performance.
- **All product data** is persisted in localStorage for offline support.
- **Testing** covers forms, lists, filtering, and CRUD operations.

## Accessibility & UX

- All interactive elements are keyboard accessible.
- ARIA attributes and roles are used where appropriate.
- Loading and empty states are handled gracefully.

## Contributing

Pull requests are welcome! Please open an issue first to discuss any major changes.

## License

[MIT](LICENSE)

---
