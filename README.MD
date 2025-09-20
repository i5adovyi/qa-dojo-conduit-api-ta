# 🚀 Conduit API Test Automation

## 📋 Project Description

Comprehensive API test automation suite for the [Conduit](https://demo.learnwebdriverio.com) blogging platform built with **Playwright** and **TypeScript**. This project implements the API Client pattern with fixtures, parameterized tests, and CI/CD integration.

## 🎯 Purpose

This project demonstrates modern API testing practices by:
- **Automated testing** of REST API endpoints
- **Quality assurance** for blog platform functionality
- **CI/CD integration** for continuous testing
- **Learning tool** for API test automation best practices

## 🔧 Tasks Covered

The test suite covers all core API functionality:

### ✅ **Users**
- User registration and creation
- User authentication (login/logout)
- User profile management and editing

### ✅ **Articles**
- Article CRUD operations (Create, Read, Update, Delete)
- Article search and filtering
- Search by tags functionality
- Pagination support

### ✅ **Favourite Articles**
- Add articles to favourites
- Remove articles from favourites

### ✅ **Comments**
- Add comments to articles
- Delete own comments

### ✅ **Tags**
- Search articles by tags
- Tag-based filtering

## 📊 Implementation Plan

### ✅ **Phase 1: Foundation** - COMPLETED
- [x] Playwright setup with TypeScript
- [x] API Client pattern implementation
- [x] Fixtures and test data management
- [x] Controllers for all endpoints

### ✅ **Phase 2: Core Testing** - COMPLETED
- [x] Authentication tests (create, login, edit)
- [x] Article CRUD operations
- [x] Comment management
- [x] Favourite functionality
- [x] Search and filtering

### ✅ **Phase 3: Quality & CI** - COMPLETED
- [x] Parameterized tests
- [x] GitHub Actions CI/CD
- [x] Test reporting and artifacts
- [x] Linting and type checking

## 🛠️ Technical Stack

- **Testing Framework:** Playwright
- **Language:** TypeScript
- **Test Data:** Faker.js
- **CI/CD:** GitHub Actions
- **Code Quality:** ESLint, Prettier
- **API:** Conduit REST API

## 📁 Project Structure

```
├── tests/
│   ├── api/                    # API test suites
│   │   ├── auth/              # Authentication tests
│   │   ├── article/           # Article CRUD & search tests
│   │   ├── comments/          # Comment management tests
│   │   └── favourite/         # Favourite functionality tests
│   ├── data/                  # Test data factories
│   ├── fixtures/              # Playwright fixtures
│   ├── types/                 # TypeScript type definitions
│   └── utils/
│       └── controllers/       # API client controllers
├── .github/workflows/         # CI/CD configuration
├── playwright.config.ts       # Playwright configuration
└── package.json              # Dependencies and scripts
```

## 🚀 How to Use This Project

### Prerequisites
- Node.js 20+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd qa-dojo-conduit-api-ta

# Install dependencies
npm install
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests with UI mode
npm run test:ui

# Run tests in headed mode
npm run test:headed

# Generate and view HTML report
npm run report
```

### Code Quality

```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking
npm run type-check
```

### CI/CD

Tests automatically run on:
- Push to `main` or `master` branch
- Pull requests to `main` or `master` branch

View results in the **Actions** tab of your GitHub repository.

### Test Tags

Tests are organized with tags for selective execution:

- `@smoke` - Core functionality tests
- `@regression` - Full regression suite
- `@positive` - Happy path scenarios

Run specific tags:
```bash
npx playwright test --grep "@smoke"
```

## 📈 Test Coverage

- **Users:** Registration, Login, Profile Management
- **Articles:** CRUD, Search, Pagination, Tags
- **Comments:** Add, Delete
- **Favourites:** Add, Remove
- **Authentication:** Token-based auth flows
- **Error Scenarios:** Validation, 4xx/5xx responses

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

---

**Built with ❤️ for learning API test automation**