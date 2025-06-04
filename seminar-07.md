# Готовим PRD в codeguide.dev
## Исходная заявка
```
Я хочу создать веб-приложение для B2B-продавцов, для подготовки ко встречи и увеличения продаж. Веб приложение должно взаимодействовать с AmoCRM для получения списка контактов и всей информации по каждому контакту (интересуют абсолютно все непустые поля) Документация по интеграции с AmoCRM есть по ссылке https://www.amocrm.ru/developers/content/integrations/intro
Веб приложение должно поддерживать темную тему, и ввод 4х API-ключей OpenAI, Brave Search, Perplexity, AmoCRM. Можно указать либо Brave Search API key, либо Perplexity API key, не обязательно оба сразу. Если указываются оба ключа Brave Search API и Perplexity, то сначала выполняется поиск при помощи Brave Search, и в случае если поиск неудался (нужная информация не найдена), то выполняется поиск при помощи Perplexity Deep Research. Все остальные ключи - обязательные!

В веб-приложении я выбираю клиента из списка, который получен через интеграцию с AmoCRM
При нажатии на контакт клиента, например Иван Петров из компании Сбер я сначала получаю подробную информацию о тех полях которые были переданы через интеграцию с AmoCRM
Затем чуть ниже у меня доступны 2 пункта меню:
1. "собрать данные” -  собирает информацию о компании и контакте из всех открытых источников используя Brave Search  и/или Perplexity Deep Research и суммирует ее
По компании мне обязательно нужно найти следующую информацию: отрасль, выручка, количество сотрудников, основные продукты - эту информацию надо вывести отдельными пунктами
по контакту мне обязательно нужна следующая информация: должность на текущем месте работы, 3 последние публикации в соц сетях - эту информацию надо вывести отдельными пунктамиТакже отдельно показывай сами запросы, которые делаешь и прогресс их выполнения вместе с ответами - но так чтобы не загромождать UI

2. “Рекомендации” - доступна только после отработки пункта 1 (собрать данные) и в результате показывает что можно еще продать с учетом текущих продуктов моей компании (playbook) и профиля клиента/компании предлагает Top 3 идеи продуктов, которые им стоит предложить, продать. Playbook компании задается статично в коде (придумай сам), также его можно подгрузить в любом текстовом формате - предусмотри соответствующую опцию меню. Если пользователь подгружает playbook, то он заменяет тот playbook, который указан в коде. На этой фазе работы происходит сопоставление playbook с суммарной информацией: все что есть в AmoCRM по данному контакту + резюме поиска по компании + резюме поиска по контакту
UI должен быть на русском языке

```
## Полученный PRD для replit
```
Create a project called B2B Sales Web App with AmoCRM Integration and OpenAI/Brave Search Support, description: Я хочу создать веб-приложение для B2B-продавцов, для подготовки ко встречи и увеличения продаж.Веб приложение должно взаимодействовать с AmoCRM для получения списка контактов и всей информации по каждому контакту (интересуют абсолютно все непустые поля)Документация по интеграции с AmoCRM есть по ссылке https://www.amocrm.ru/developers/content/integrations/introВеб приложение должно поддерживать темную тему, и ввод 2 ключа OpenAI и Brave Search
В веб-приложении я выбираю клиента из списка, который получен через интеграцию с AmoCRM
При нажатии на контакт клиента, например Иван Петров из компании Сбер я сначала получаю подробную информацию о тех полях которые были переданы через интеграцию с AmoCRM
Затем чуть ниже у меня доступны 2 пункта меню:
1. "собрать данные” -  собирает информацию о компании и контакте из всех открытых источников используя Brave Search и суммирует ее
по компании мне обязательно нужно найти следующую информацию: отрасль, выручка, количество сотрудников, основные продукты - эту информацию надо вывести отдельными пунктами
по контакту мне обязательно нужна следующая информация: должность на текущем месте работы, 3 последние публикации в соц сетях - эту информацию надо вывести отдельными пунктамиТакже отдельно показывай сами запросы, которые делаешь и прогресс их выполнения вместе с ответами - но так чтобы не загромождать UI

2. “Рекомендации” - доступна только после отработки пункта 1 (собрать данные) и в результате показывает что можно еще продать с учетом текущих продуктов моей компании (playbook) и профиля клиента/компании предлагает Top 3 идеи продуктов, которые им стоит предложить, продать.playbook компании задается статично в коде (придумай сам), также его можно подгрузить в любом текстовом формате - предусмотри соответствующую опцию меню. Если пользователь подгружает playbook, то он заменяет тот, который указан в коде.
UI должен быть на русском языке, refer to the following documentation:

# Unified Project Documentation

## Project Requirements Document

### 1. Project Overview
This project is a web application designed for B2B salespeople to prepare for client meetings and boost their sales performance. It connects directly to AmoCRM to fetch every non-empty field for each contact and company, then enriches that data with public information gathered via Brave Search and OpenAI. Users will be able to quickly see full contact details, gather extra context on companies and people, and get tailored product recommendations.

The core objectives are to reduce research time, present all relevant information in one place, and suggest the top three upsell or cross-sell ideas based on a static or user-uploaded playbook. Success means users can log in, pull client data from AmoCRM, collect public intelligence in seconds, and generate actionable recommendations with minimal effort. The app will run on Replit, use a dark-themed Russian interface, and support exports in PDF and Excel formats.

### 2. In-Scope vs. Out-of-Scope
**In-Scope:**
- Integration with AmoCRM API to fetch all non-empty contact and company fields in real time
- User authentication (email/password) and encrypted storage of OpenAI and Brave Search keys in user profiles
- Dark theme and Russian-language UI
- Contact list display with search and filtering
- Detailed contact view showing AmoCRM data
- “Собрать данные” feature to query Brave Search and OpenAI for company (industry, revenue, staff count, main products) and contact (current position, three latest social posts)
- Progress indicators and expandable query/result blocks in the UI
- “Рекомендации” feature that uses a built-in or user-uploaded playbook (TXT/JSON) to suggest top 3 product ideas with explanations
- Playbook management: view, edit, upload (TXT/JSON) to replace built-in rules
- Export of data collection results and recommendations to PDF and Excel
- Sound notification on completion of data gathering and recommendation generation
- Hosting on Replit with Replit DB for profile and key storage

**Out-of-Scope:**
- Long-term storage of collected or recommendation data beyond the current session
- Multiple user roles or permissions (only one user type exists)
- Email or in-app notifications beyond a simple sound alert
- Custom corporate branding beyond a dark theme and general modern look
- Offline mode or mobile-only support
- Extensive GDPR or other legal compliance beyond basic data protection measures

### 3. User Flow
A new user lands on the login page where they can register with email and password. After signing up and confirming their email, they log in and are taken to a settings screen where they enter and save their OpenAI and Brave Search API keys. These keys are encrypted and stored in their profile on the server. From there, the user is directed to the main dashboard.

On the dashboard, the user sees a list of contacts pulled from AmoCRM in a dark-themed, Russian interface. They can search or filter the contacts, then click on any contact card to view all the non-empty fields from AmoCRM. Below the contact details, they have two options: "Собрать данные" to fetch public data and "Рекомендации" to generate product ideas once the data is ready. At any point, the user can export reports or return to settings to update keys or manage the playbook.

### 4. Core Features
- **AmoCRM Integration:** Real-time fetching of every non-empty field for contacts and companies via the official AmoCRM API.
- **Authentication & Key Management:** Email/password login, encrypted storage of OpenAI and Brave Search API keys in user profiles.
- **Dark Theme & Russian UI:** Consistent dark-mode design and full Russian localization.
- **Contact List & Detail View:** Searchable, filterable list of contacts; detailed page showing all AmoCRM fields.
- **Data Collection Module:** Button "Собрать данные" triggers Brave Search and OpenAI queries for predefined company and contact attributes.
- **Progress & Query Display:** Visual progress indicators and collapsible panels showing each query and its result.
- **Recommendation Engine:** Button "Рекомендации" provides top 3 upsell/cross-sell ideas based on a static or uploaded playbook.
- **Playbook Management:** View built-in playbook, edit inline, or upload a TXT/JSON file to replace it.
- **Export Reports:** Generate and download PDF or Excel files summarizing collected data and recommendations.
- **Sound Notifications:** Short audio alert when data collection or recommendation generation completes.

### 5. Tech Stack & Tools
- Frontend: React with Material-UI for components, React Router for navigation, Context API for global state.
- Backend: Node.js with Express for API server, JWT for authentication, Replit DB for user profile and key storage.
- Integrations: AmoCRM API to fetch contact data, OpenAI API for summarization, Brave Search API for public data.
- Hosting & IDE: Deployed on Replit, using Replit Hosting and Replit IDE; development aided by Lovable.dev, Cursor, and Cline AI tools.

### 6. Non-Functional Requirements
- **Performance:** Contact list and detail pages should load within 2–3 seconds; full data collection should finish within 10–15 seconds under normal conditions.
- **Security:** All traffic over HTTPS; API keys encrypted at rest; JWT tokens for session management; protection against common web vulnerabilities.
- **Scalability:** Stateless backend services to support horizontal scaling if needed; real-time API calls without large data storage.

### 7. Constraints & Assumptions
- The app relies on AmoCRM, OpenAI, and Brave Search API rate limits and availability.
- Only TXT and JSON formats are supported for playbook uploads.
- No long-term storage of collected data; everything is processed in real time.
- All users share the same permission level; there is no role differentiation.
- The default playbook follows a simple structure (sections for product overview, audience, strategies, advantages).
- Keys must be stored on the server side for cross-session access; we assume Replit DB encryption is sufficient.

### 8. Known Issues & Potential Pitfalls
- **API Rate Limits:** Might hit limits on AmoCRM, OpenAI, or Brave Search. Mitigation: implement simple retry logic and inform users of delays.
- **Long-Running Requests:** Data collection can take time. Mitigation: show clear progress bars and let users collapse details.
- **Mixed Data Quality:** Public data can be incomplete or inconsistent. Mitigation: label uncertain results and allow user edits.
- **UI Clutter:** Showing all queries and results may clutter the screen. Mitigation: use collapsible panels and summaries.
- **Dependency on Replit:** Limits in customization and scaling; mitigate by planning migration to another host if needed.

## App Flow Document

### Onboarding and Sign-In/Sign-Up
A new user lands on the landing page where they can choose to register or log in. For registration, they enter an email and password, then receive an email confirmation link. Once confirmed, they return to the login page and sign in. Password recovery is available via a "Forgot Password" link that sends a reset email. Signing out is done via a profile menu option at the top right.

### Main Dashboard or Home Page
After a successful login, the user arrives at the main dashboard in dark mode. A sidebar or header menu offers navigation, and the central area shows a searchable list of contacts fetched from AmoCRM. Each contact card displays the person’s name, company, and a brief summary. The user can filter or search contacts and click on any card to view details.

### Detailed Feature Flows and Page Transitions
When the user clicks a contact, the app navigates to a detail view that lists every non-empty field returned by AmoCRM, organized into sections. Below that, two buttons appear: "Собрать данные" and, once data is collected, "Рекомендации." Tapping "Собрать данные" triggers background queries to Brave Search and OpenAI. A progress bar appears at the top of the page, and below it are collapsible panels for each query showing the raw request and a summary answer. Once complete, the results for company attributes (industry, revenue, staff count, main products) and contact attributes (current position, three latest social posts) are displayed in clear, labeled blocks. The "Рекомендации" button then becomes active; clicking it displays the top three product ideas with justifications based on the playbook.

### Settings and Account Management
From any page, the user can click their profile icon to open the settings screen. Here they can update their email/password, enter or replace OpenAI and Brave Search keys, and view or edit the current playbook. A section lets them upload a new playbook in TXT or JSON format, which immediately replaces the built-in version. After saving changes, the user returns to the main flow via a “Back to Dashboard” button.

### Error States and Alternate Paths
If an API key is invalid, the app shows a clear error message next to the key field and prevents data collection until corrected. If AmoCRM or search APIs fail or the network drops, a banner appears explaining the issue and offering a Retry button. Uploading a wrong file format prompts an inline alert. Any unauthorized access redirects the user to the login page with an explanatory note.

### Conclusion and Overall App Journey
Overall, users sign up, secure their API keys, and land on a contact dashboard. They select a contact to see full CRM data, use "Собрать данные" to enrich that profile with public sources, and then click "Рекомендации" to get three tailored product suggestions. Along the way, they can manage their keys and playbook, export reports, and rely on concise progress indicators and sound alerts to guide them.

## Tech Stack Document

### Frontend Technologies
- React: component-based UI for maintainability and reusability.
- Material-UI: pre-built components and theming for consistent dark design.
- React Router: client-side routing for smooth page transitions.
- Context API: central state management for user session and settings.

### Backend Technologies
- Node.js with Express: lightweight server to handle API requests and authentication.
- JWT Authentication: secure token-based sessions.
- Replit DB: simple NoSQL store for user profiles and encrypted API keys.
- AmoCRM API: fetch contact and company data in real time.
- OpenAI API & Brave Search API: external AI and search integrations for data enrichment.

### Infrastructure and Deployment
- Replit Hosting: one-click deployment and live preview for fast iteration.
- Replit IDE: collaborative coding environment.
- Automated Deploy on Push: Replit’s built-in auto-deploy ensures the latest code is always live.

### Third-Party Integrations
- AmoCRM API: source of CRM data for contacts and companies.
- OpenAI API: summarization and analysis of public data.
- Brave Search API: public web search for company and contact intelligence.
- PDF/Excel Export Library: generate downloadable reports in standard business formats.

### Security and Performance Considerations
- HTTPS for all communication.
- Encryption of API keys at rest in Replit DB.
- Rate-limit handling and retry logic for external APIs.
- Lazy loading of heavy components and code splitting to speed up initial load.
- Caching of recent AmoCRM queries for session speed improvements.

### Conclusion and Overall Tech Stack Summary
This stack combines modern, familiar tools—React and Node.js—for a responsive frontend and flexible backend. Material-UI speeds up design with a built-in dark theme, while Replit offers a simple host plus DB. External APIs (AmoCRM, OpenAI, Brave Search) provide rich data without complex infrastructure. Security and performance best practices are built in, making the app reliable and user-friendly.

## Frontend Guidelines Document

### Frontend Architecture
We use a component-based architecture with React. Each page is a composition of reusable components (buttons, cards, panels). Material-UI provides styling and theming support. The app is structured into folders: `components/` for UI pieces, `pages/` for routed views, `context/` for global state, and `services/` for API calls. This setup supports scalability and easy maintenance.

### Design Principles
Our design emphasizes usability, accessibility, and responsiveness. Every interactive element has clear labels and keyboard focus. Color contrasts meet accessibility standards even in dark mode. The layout adapts to different screen sizes so salespeople can use it on tablets or desktops without losing functionality.

### Styling and Theming
We use Material-UI’s theming system with CSS-in-JS. The dark theme defines primary and secondary palettes, background, and font colors. We follow a flat, minimal style to keep the UI clean. The primary font is a system sans-serif stack for speed and legibility.

### Component Structure
Components follow an atomic design approach: atoms (buttons, inputs), molecules (search bar, contact card), organisms (contact list, detail view), and templates (dashboard layout). This ensures high reusability, easy testing, and clear separation of concerns.

### State Management
We manage global, user-related state (auth token, API keys, playbook) with React Context. Local UI state (modal open/closed, progress percentage) is handled within individual components. This keeps the data flow predictable and makes debugging simpler.

### Routing and Navigation
React Router handles client-side routes. We define routes for `/login`, `/dashboard`, `/contact/:id`, and `/settings`. A `<ProtectedRoute>` component guards private pages, redirecting unauthenticated users to `/login`.

### Performance Optimization
We implement lazy loading for heavy pages like the data collection view. Code splitting with React’s `Suspense` ensures only needed code loads initially. We also memoize pure components with `React.memo` to avoid unnecessary re-renders.

### Testing and Quality Assurance
Unit tests use Jest and React Testing Library for component behavior. Integration tests cover API service modules. End-to-end tests with Cypress simulate user flows: sign-up, data collection, recommendation generation, and export.

### Conclusion and Overall Frontend Summary
Our frontend uses React and Material-UI in a clean, component-based setup that prioritizes performance and accessibility. Context API and React Router keep state and navigation straightforward. Automated testing and code splitting help maintain quality and speed as the project grows.

## Implementation Plan

1. **Project Setup:** Create a new Replit project, initialize Git, install dependencies (React, Material-UI, Express).
2. **Backend Foundation:** Set up Express server with JWT authentication endpoints and connect Replit DB.
3. **AmoCRM Integration:** Implement OAuth flow or API token retrieval, then build service to fetch all non-empty fields for contacts and companies.
4. **User Auth & Key Storage:** Build login/registration routes, profile routes to save/retrieve encrypted OpenAI and Brave Search keys.
5. **Frontend Skeleton:** Scaffold React app with routing, context provider for auth and settings, and basic Material-UI theme.
6. **Contact List & Detail Views:** Create components for listing contacts, search/filter logic, and detail page displaying AmoCRM fields.
7. **Data Collection Module:** Implement “Собрать данные” button, service calls to Brave Search and OpenAI, and UI progress indicators with collapsible panels.
8. **Recommendation Engine:** Define built-in playbook structure, build logic to merge collected data with playbook rules, and display top 3 recommendations.
9. **Playbook Management:** Add settings UI for viewing/editing the current playbook and uploading a TXT/JSON file to replace it.
10. **Export Feature:** Integrate a PDF/Excel generation library, add export buttons in the UI, and test downloads.
11. **Notifications & Errors:** Add sound alerts on task completion, build error handling for failed API calls, and display friendly messages.
12. **Testing:** Write unit tests for React components and services, integration tests for backend routes, and E2E tests covering full flows.
13. **Deployment & Review:** Configure auto-deploy on Replit, perform end-to-end manual QA, gather feedback, and iterate on any UI or performance issues.
14. **Documentation & Handover:** Finalize README, API docs, and user guide. Ensure all code and docs are merged to the main branch for release.

---
*End of Unified Project Documentation*
```

## Полученный PRD для lovable
```
Create a project called B2B Sales Web App with AmoCRM Integration and OpenAI/Brave Search Support, description: Я хочу создать веб-приложение для B2B-продавцов, для подготовки ко встречи и увеличения продаж.Веб приложение должно взаимодействовать с AmoCRM для получения списка контактов и всей информации по каждому контакту (интересуют абсолютно все непустые поля)Документация по интеграции с AmoCRM есть по ссылке https://www.amocrm.ru/developers/content/integrations/introВеб приложение должно поддерживать темную тему, и ввод 2 ключа OpenAI и Brave Search
В веб-приложении я выбираю клиента из списка, который получен через интеграцию с AmoCRM
При нажатии на контакт клиента, например Иван Петров из компании Сбер я сначала получаю подробную информацию о тех полях которые были переданы через интеграцию с AmoCRM
Затем чуть ниже у меня доступны 2 пункта меню:
1. "собрать данные” -  собирает информацию о компании и контакте из всех открытых источников используя Brave Search и суммирует ее
по компании мне обязательно нужно найти следующую информацию: отрасль, выручка, количество сотрудников, основные продукты - эту информацию надо вывести отдельными пунктами
по контакту мне обязательно нужна следующая информация: должность на текущем месте работы, 3 последние публикации в соц сетях - эту информацию надо вывести отдельными пунктамиТакже отдельно показывай сами запросы, которые делаешь и прогресс их выполнения вместе с ответами - но так чтобы не загромождать UI

2. “Рекомендации” - доступна только после отработки пункта 1 (собрать данные) и в результате показывает что можно еще продать с учетом текущих продуктов моей компании (playbook) и профиля клиента/компании предлагает Top 3 идеи продуктов, которые им стоит предложить, продать.playbook компании задается статично в коде (придумай сам), также его можно подгрузить в любом текстовом формате - предусмотри соответствующую опцию меню. Если пользователь подгружает playbook, то он заменяет тот, который указан в коде.
UI должен быть на русском языке, refer to the following documentation:

# Unified Project Documentation

## Project Requirements Document

### 1. Project Overview
This project is a web application designed for B2B salespeople to prepare for client meetings and boost their sales performance. It connects directly to AmoCRM to fetch every non-empty field for each contact and company, then enriches that data with public information gathered via Brave Search and OpenAI. Users will be able to quickly see full contact details, gather extra context on companies and people, and get tailored product recommendations.

The core objectives are to reduce research time, present all relevant information in one place, and suggest the top three upsell or cross-sell ideas based on a static or user-uploaded playbook. Success means users can log in, pull client data from AmoCRM, collect public intelligence in seconds, and generate actionable recommendations with minimal effort. The app will run on Replit, use a dark-themed Russian interface, and support exports in PDF and Excel formats.

### 2. In-Scope vs. Out-of-Scope
**In-Scope:**
- Integration with AmoCRM API to fetch all non-empty contact and company fields in real time
- User authentication (email/password) and encrypted storage of OpenAI and Brave Search keys in user profiles
- Dark theme and Russian-language UI
- Contact list display with search and filtering
- Detailed contact view showing AmoCRM data
- “Собрать данные” feature to query Brave Search and OpenAI for company (industry, revenue, staff count, main products) and contact (current position, three latest social posts)
- Progress indicators and expandable query/result blocks in the UI
- “Рекомендации” feature that uses a built-in or user-uploaded playbook (TXT/JSON) to suggest top 3 product ideas with explanations
- Playbook management: view, edit, upload (TXT/JSON) to replace built-in rules
- Export of data collection results and recommendations to PDF and Excel
- Sound notification on completion of data gathering and recommendation generation
- Hosting on Replit with Replit DB for profile and key storage

**Out-of-Scope:**
- Long-term storage of collected or recommendation data beyond the current session
- Multiple user roles or permissions (only one user type exists)
- Email or in-app notifications beyond a simple sound alert
- Custom corporate branding beyond a dark theme and general modern look
- Offline mode or mobile-only support
- Extensive GDPR or other legal compliance beyond basic data protection measures

### 3. User Flow
A new user lands on the login page where they can register with email and password. After signing up and confirming their email, they log in and are taken to a settings screen where they enter and save their OpenAI and Brave Search API keys. These keys are encrypted and stored in their profile on the server. From there, the user is directed to the main dashboard.

On the dashboard, the user sees a list of contacts pulled from AmoCRM in a dark-themed, Russian interface. They can search or filter the contacts, then click on any contact card to view all the non-empty fields from AmoCRM. Below the contact details, they have two options: "Собрать данные" to fetch public data and "Рекомендации" to generate product ideas once the data is ready. At any point, the user can export reports or return to settings to update keys or manage the playbook.

### 4. Core Features
- **AmoCRM Integration:** Real-time fetching of every non-empty field for contacts and companies via the official AmoCRM API.
- **Authentication & Key Management:** Email/password login, encrypted storage of OpenAI and Brave Search API keys in user profiles.
- **Dark Theme & Russian UI:** Consistent dark-mode design and full Russian localization.
- **Contact List & Detail View:** Searchable, filterable list of contacts; detailed page showing all AmoCRM fields.
- **Data Collection Module:** Button "Собрать данные" triggers Brave Search and OpenAI queries for predefined company and contact attributes.
- **Progress & Query Display:** Visual progress indicators and collapsible panels showing each query and its result.
- **Recommendation Engine:** Button "Рекомендации" provides top 3 upsell/cross-sell ideas based on a static or uploaded playbook.
- **Playbook Management:** View built-in playbook, edit inline, or upload a TXT/JSON file to replace it.
- **Export Reports:** Generate and download PDF or Excel files summarizing collected data and recommendations.
- **Sound Notifications:** Short audio alert when data collection or recommendation generation completes.

### 5. Tech Stack & Tools
- Frontend: React with Material-UI for components, React Router for navigation, Context API for global state.
- Backend: Node.js with Express for API server, JWT for authentication, Replit DB for user profile and key storage.
- Integrations: AmoCRM API to fetch contact data, OpenAI API for summarization, Brave Search API for public data.
- Hosting & IDE: Deployed on Replit, using Replit Hosting and Replit IDE; development aided by Lovable.dev, Cursor, and Cline AI tools.

### 6. Non-Functional Requirements
- **Performance:** Contact list and detail pages should load within 2–3 seconds; full data collection should finish within 10–15 seconds under normal conditions.
- **Security:** All traffic over HTTPS; API keys encrypted at rest; JWT tokens for session management; protection against common web vulnerabilities.
- **Scalability:** Stateless backend services to support horizontal scaling if needed; real-time API calls without large data storage.

### 7. Constraints & Assumptions
- The app relies on AmoCRM, OpenAI, and Brave Search API rate limits and availability.
- Only TXT and JSON formats are supported for playbook uploads.
- No long-term storage of collected data; everything is processed in real time.
- All users share the same permission level; there is no role differentiation.
- The default playbook follows a simple structure (sections for product overview, audience, strategies, advantages).
- Keys must be stored on the server side for cross-session access; we assume Replit DB encryption is sufficient.

### 8. Known Issues & Potential Pitfalls
- **API Rate Limits:** Might hit limits on AmoCRM, OpenAI, or Brave Search. Mitigation: implement simple retry logic and inform users of delays.
- **Long-Running Requests:** Data collection can take time. Mitigation: show clear progress bars and let users collapse details.
- **Mixed Data Quality:** Public data can be incomplete or inconsistent. Mitigation: label uncertain results and allow user edits.
- **UI Clutter:** Showing all queries and results may clutter the screen. Mitigation: use collapsible panels and summaries.
- **Dependency on Replit:** Limits in customization and scaling; mitigate by planning migration to another host if needed.

## App Flow Document

### Onboarding and Sign-In/Sign-Up
A new user lands on the landing page where they can choose to register or log in. For registration, they enter an email and password, then receive an email confirmation link. Once confirmed, they return to the login page and sign in. Password recovery is available via a "Forgot Password" link that sends a reset email. Signing out is done via a profile menu option at the top right.

### Main Dashboard or Home Page
After a successful login, the user arrives at the main dashboard in dark mode. A sidebar or header menu offers navigation, and the central area shows a searchable list of contacts fetched from AmoCRM. Each contact card displays the person’s name, company, and a brief summary. The user can filter or search contacts and click on any card to view details.

### Detailed Feature Flows and Page Transitions
When the user clicks a contact, the app navigates to a detail view that lists every non-empty field returned by AmoCRM, organized into sections. Below that, two buttons appear: "Собрать данные" and, once data is collected, "Рекомендации." Tapping "Собрать данные" triggers background queries to Brave Search and OpenAI. A progress bar appears at the top of the page, and below it are collapsible panels for each query showing the raw request and a summary answer. Once complete, the results for company attributes (industry, revenue, staff count, main products) and contact attributes (current position, three latest social posts) are displayed in clear, labeled blocks. The "Рекомендации" button then becomes active; clicking it displays the top three product ideas with justifications based on the playbook.

### Settings and Account Management
From any page, the user can click their profile icon to open the settings screen. Here they can update their email/password, enter or replace OpenAI and Brave Search keys, and view or edit the current playbook. A section lets them upload a new playbook in TXT or JSON format, which immediately replaces the built-in version. After saving changes, the user returns to the main flow via a “Back to Dashboard” button.

### Error States and Alternate Paths
If an API key is invalid, the app shows a clear error message next to the key field and prevents data collection until corrected. If AmoCRM or search APIs fail or the network drops, a banner appears explaining the issue and offering a Retry button. Uploading a wrong file format prompts an inline alert. Any unauthorized access redirects the user to the login page with an explanatory note.

### Conclusion and Overall App Journey
Overall, users sign up, secure their API keys, and land on a contact dashboard. They select a contact to see full CRM data, use "Собрать данные" to enrich that profile with public sources, and then click "Рекомендации" to get three tailored product suggestions. Along the way, they can manage their keys and playbook, export reports, and rely on concise progress indicators and sound alerts to guide them.

## Tech Stack Document

### Frontend Technologies
- React: component-based UI for maintainability and reusability.
- Material-UI: pre-built components and theming for consistent dark design.
- React Router: client-side routing for smooth page transitions.
- Context API: central state management for user session and settings.

### Backend Technologies
- Node.js with Express: lightweight server to handle API requests and authentication.
- JWT Authentication: secure token-based sessions.
- Replit DB: simple NoSQL store for user profiles and encrypted API keys.
- AmoCRM API: fetch contact and company data in real time.
- OpenAI API & Brave Search API: external AI and search integrations for data enrichment.

### Infrastructure and Deployment
- Replit Hosting: one-click deployment and live preview for fast iteration.
- Replit IDE: collaborative coding environment.
- Automated Deploy on Push: Replit’s built-in auto-deploy ensures the latest code is always live.

### Third-Party Integrations
- AmoCRM API: source of CRM data for contacts and companies.
- OpenAI API: summarization and analysis of public data.
- Brave Search API: public web search for company and contact intelligence.
- PDF/Excel Export Library: generate downloadable reports in standard business formats.

### Security and Performance Considerations
- HTTPS for all communication.
- Encryption of API keys at rest in Replit DB.
- Rate-limit handling and retry logic for external APIs.
- Lazy loading of heavy components and code splitting to speed up initial load.
- Caching of recent AmoCRM queries for session speed improvements.

### Conclusion and Overall Tech Stack Summary
This stack combines modern, familiar tools—React and Node.js—for a responsive frontend and flexible backend. Material-UI speeds up design with a built-in dark theme, while Replit offers a simple host plus DB. External APIs (AmoCRM, OpenAI, Brave Search) provide rich data without complex infrastructure. Security and performance best practices are built in, making the app reliable and user-friendly.

## Frontend Guidelines Document

### Frontend Architecture
We use a component-based architecture with React. Each page is a composition of reusable components (buttons, cards, panels). Material-UI provides styling and theming support. The app is structured into folders: `components/` for UI pieces, `pages/` for routed views, `context/` for global state, and `services/` for API calls. This setup supports scalability and easy maintenance.

### Design Principles
Our design emphasizes usability, accessibility, and responsiveness. Every interactive element has clear labels and keyboard focus. Color contrasts meet accessibility standards even in dark mode. The layout adapts to different screen sizes so salespeople can use it on tablets or desktops without losing functionality.

### Styling and Theming
We use Material-UI’s theming system with CSS-in-JS. The dark theme defines primary and secondary palettes, background, and font colors. We follow a flat, minimal style to keep the UI clean. The primary font is a system sans-serif stack for speed and legibility.

### Component Structure
Components follow an atomic design approach: atoms (buttons, inputs), molecules (search bar, contact card), organisms (contact list, detail view), and templates (dashboard layout). This ensures high reusability, easy testing, and clear separation of concerns.

### State Management
We manage global, user-related state (auth token, API keys, playbook) with React Context. Local UI state (modal open/closed, progress percentage) is handled within individual components. This keeps the data flow predictable and makes debugging simpler.

### Routing and Navigation
React Router handles client-side routes. We define routes for `/login`, `/dashboard`, `/contact/:id`, and `/settings`. A `<ProtectedRoute>` component guards private pages, redirecting unauthenticated users to `/login`.

### Performance Optimization
We implement lazy loading for heavy pages like the data collection view. Code splitting with React’s `Suspense` ensures only needed code loads initially. We also memoize pure components with `React.memo` to avoid unnecessary re-renders.

### Testing and Quality Assurance
Unit tests use Jest and React Testing Library for component behavior. Integration tests cover API service modules. End-to-end tests with Cypress simulate user flows: sign-up, data collection, recommendation generation, and export.

### Conclusion and Overall Frontend Summary
Our frontend uses React and Material-UI in a clean, component-based setup that prioritizes performance and accessibility. Context API and React Router keep state and navigation straightforward. Automated testing and code splitting help maintain quality and speed as the project grows.

## Implementation Plan

1. **Project Setup:** Create a new Replit project, initialize Git, install dependencies (React, Material-UI, Express).
2. **Backend Foundation:** Set up Express server with JWT authentication endpoints and connect Replit DB.
3. **AmoCRM Integration:** Implement OAuth flow or API token retrieval, then build service to fetch all non-empty fields for contacts and companies.
4. **User Auth & Key Storage:** Build login/registration routes, profile routes to save/retrieve encrypted OpenAI and Brave Search keys.
5. **Frontend Skeleton:** Scaffold React app with routing, context provider for auth and settings, and basic Material-UI theme.
6. **Contact List & Detail Views:** Create components for listing contacts, search/filter logic, and detail page displaying AmoCRM fields.
7. **Data Collection Module:** Implement “Собрать данные” button, service calls to Brave Search and OpenAI, and UI progress indicators with collapsible panels.
8. **Recommendation Engine:** Define built-in playbook structure, build logic to merge collected data with playbook rules, and display top 3 recommendations.
9. **Playbook Management:** Add settings UI for viewing/editing the current playbook and uploading a TXT/JSON file to replace it.
10. **Export Feature:** Integrate a PDF/Excel generation library, add export buttons in the UI, and test downloads.
11. **Notifications & Errors:** Add sound alerts on task completion, build error handling for failed API calls, and display friendly messages.
12. **Testing:** Write unit tests for React components and services, integration tests for backend routes, and E2E tests covering full flows.
13. **Deployment & Review:** Configure auto-deploy on Replit, perform end-to-end manual QA, gather feedback, and iterate on any UI or performance issues.
14. **Documentation & Handover:** Finalize README, API docs, and user guide. Ensure all code and docs are merged to the main branch for release.

---
*End of Unified Project Documentation*
```


## Вариант PRD для replit полученный на занятии
```
Create a project called B2B Sales Web App with AmoCRM Integration and AI Search, description: Я хочу создать веб-приложение для B2B-продавцов, для подготовки ко встречи и увеличения продаж. Веб приложение должно взаимодействовать с AmoCRM для получения списка контактов и всей информации по каждому контакту (интересуют абсолютно все непустые поля) Документация по интеграции с AmoCRM есть по ссылке https://www.amocrm.ru/developers/content/integrations/intro
Веб приложение должно поддерживать темную тему, и ввод 4х API-ключей OpenAI, Brave Search, Perplexity, AmoCRM. Можно указать либо Brave Search API key, либо Perplexity API key, не обязательно оба сразу. Если указываются оба ключа Brave Search API и Perplexity, то сначала выполняется поиск при помощи Brave Search, и в случае если поиск неудался (нужная информация не найдена), то выполняется поиск при помощи Perplexity Deep Research. Все остальные ключи - обязательные!

В веб-приложении я выбираю клиента из списка, который получен через интеграцию с AmoCRM
При нажатии на контакт клиента, например Иван Петров из компании Сбер я сначала получаю подробную информацию о тех полях которые были переданы через интеграцию с AmoCRM
Затем чуть ниже у меня доступны 2 пункта меню:
1. "собрать данные” -  собирает информацию о компании и контакте из всех открытых источников используя Brave Search  и/или Perplexity Deep Research и суммирует ее
По компании мне обязательно нужно найти следующую информацию: отрасль, выручка, количество сотрудников, основные продукты - эту информацию надо вывести отдельными пунктами
по контакту мне обязательно нужна следующая информация: должность на текущем месте работы, 3 последние публикации в соц сетях - эту информацию надо вывести отдельными пунктамиТакже отдельно показывай сами запросы, которые делаешь и прогресс их выполнения вместе с ответами - но так чтобы не загромождать UI

2. “Рекомендации” - доступна только после отработки пункта 1 (собрать данные) и в результате показывает что можно еще продать с учетом текущих продуктов моей компании (playbook) и профиля клиента/компании предлагает Top 3 идеи продуктов, которые им стоит предложить, продать. Playbook компании задается статично в коде (придумай сам), также его можно подгрузить в любом текстовом формате - предусмотри соответствующую опцию меню. Если пользователь подгружает playbook, то он заменяет тот playbook, который указан в коде. На этой фазе работы происходит сопоставление playbook с суммарной информацией: все что есть в AmoCRM по данному контакту + резюме поиска по компании + резюме поиска по контакту
UI должен быть на русском языке
, refer to the following documentation:

# Unified Project Documentation

## 1. Project Requirements Document

### 1.1 Project Overview
This web application is built for B2B sales teams to streamline meeting preparation and boost sales. By integrating with AmoCRM, it fetches every non-empty field of a client’s contact and company data. On top of that, it uses external search services (Brave Search and Perplexity Deep Research) plus OpenAI models to gather up-to-date insights about a company’s industry, revenue, headcount, products and a contact’s job title and recent social media posts.

The key objectives are to give sales reps a one-stop dashboard with complete context for each client, automate data gathering from public sources, and then generate three tailored upsell ideas based on a static or user-uploaded playbook. We’ll know we’re successful if users can log in, set their own API keys, pick a contact, see all AmoCRM fields, run data collection with clear progress feedback, and get AI-driven recommendations—all in under two minutes per contact.

### 1.2 In-Scope vs. Out-of-Scope

**In-Scope**
- User registration, login and role-based access (admin vs. standard user)
- Secure, encrypted storage of individual API keys for AmoCRM, OpenAI, Brave Search, Perplexity
- Light and dark theme support with a modern, professional look in Russian
- Real-time fetching of all non-empty fields from AmoCRM contacts and associated companies
- “Собрать данные” workflow: Brave Search first, automatic fallback to Perplexity if key data (industry, revenue, employees, products) is missing or too fragmented
- Progress feed showing each raw search query, status and brief responses in a collapsible UI
- Display of company insights (industry, revenue, employees, main products) and contact insights (current job title, three latest social posts)
- Static playbook embedded in code plus option to upload a .txt playbook that replaces the default
- “Рекомендации” workflow: AI algorithm matches playbook to gathered data and suggests top three product ideas, letting users choose GPT-4o, GPT-4o-mini or o4-mini
- Export or copy recommendations as text; settings (keys, theme, uploaded playbook) persist per user profile
- Deployment as a cloud prototype (e.g., Replit or Railway) without long-term data retention beyond the current session

**Out-of-Scope**
- Historical storage of past data collection or recommendation results
- Detailed audit logs or GDPR-style data retention policies
- Alternative search providers beyond Brave and Perplexity
- Advanced analytics dashboards or reports beyond the three upsell suggestions
- Mobile-specific UI—focus is on desktop web

### 1.3 User Flow
A new user visits the landing page, signs up with an email and password, then logs in. Upon first login, they go to Settings to enter and save their API keys for AmoCRM, OpenAI and either or both Brave Search and Perplexity. They also select their theme preference. After saving, they see a dashboard listing all contacts pulled automatically from AmoCRM.

From the dashboard, the user searches or filters to find a contact. Clicking a contact shows every field fetched from AmoCRM grouped by section. Below that, two buttons appear: “Собрать данные” and “Рекомендации”. The user first clicks “Собрать данные” to trigger external searches—Brave Search runs first and if it doesn’t return complete key data, the app falls back to Perplexity. A live feed shows each query’s text, status and summary. When complete, the company and contact insights display. Then the user clicks “Рекомендации” to run an AI prompt that matches the active playbook to the collected data and shows the top three products to offer. The user can copy or export these. Settings and selected contact remain available until logout.

### 1.4 Core Features
- Authentication & Access Control: Email/password signup, JWT-based sessions, admin vs. standard roles.
- API Key Management: Encrypted per-user storage of AmoCRM, OpenAI, Brave Search, Perplexity keys, with validation on save.
- AmoCRM Integration: Fetch and display all non-empty contact and company fields via AmoCRM REST API.
- Theme & Localization: Light/dark mode with instant switch, Russian UI text.
- Data Collection Workflow: “Собрать данные” button that triggers Brave Search, falls back to Perplexity if industry, revenue, employee count or products are missing; grouped company/contact data.
- Progress Feed: Real-time log of queries, statuses (“running,” “success,” “switching to Perplexity”), expandable details without cluttering the main UI.
- Playbook Management: Built-in static playbook in code; .txt upload to replace it, with simple sections: Products, Target Audience, Unique Propositions.
- AI Recommendations: After data collection, trigger OpenAI with a detailed prompt and chosen model to produce top three upsell ideas.
- Export & Copy: Ability to copy results or download recommendations as plain text.
- Settings Persistence: User preferences (keys, theme, playbook) stored and reloaded on login.
- Cloud Deployment: Prototype hosted on Replit/Railway with Node.js support and secure environmental variables.

### 1.5 Tech Stack & Tools
- Frontend: React.js + TypeScript, Tailwind CSS for styling, React Router for navigation.
- Backend: Node.js + Express.js, PostgreSQL for encrypted settings storage, JWT for authentication.
- AI & Search: OpenAI SDK for recommendations, Brave Search API with fallback, Perplexity API for deep research.
- CRM Integration: AmoCRM REST API for fetching contacts and company data.
- Dev & Collaboration: Lovable.dev, Cursor, Replit, Cline as coding and prototyping tools.

### 1.6 Non-Functional Requirements
- Performance: Dashboard load under 2 seconds; each external search stage should report progress within 3–5 seconds.
- Security: HTTPS everywhere, encrypted storage of API keys, salted password hashing, JWT token expiration.
- Compliance: Basic privacy by not storing session data permanently; future GDPR compliance planned for later phases.

### 1.7 Constraints & Assumptions
- Must run on Node.js environments in the cloud (Replit/Railway).
- Users supply valid API keys for AmoCRM and OpenAI; at least one of Brave or Perplexity.
- Prototype limits data to current session; no history table is maintained.
- Playbook format is plain .txt with predictable section headers.
- AmoCRM rate limits and custom fields may vary—assume reasonable API limits.

### 1.8 Known Issues & Potential Pitfalls
- Retrieving all custom fields from AmoCRM may lead to inconsistent schemas. Mitigation: normalize by listing only non-empty entries with field labels.
- API rate limits on Brave Search or AmoCRM could slow process. Mitigation: respect rate limits, show errors and encourage retries.
- Parsing search results into structured key data (industry, revenue, etc.) can be error-prone. Mitigation: use strict prompt templates and fallback conditions.
- Large playbooks may slow recommendation generation. Mitigation: limit file size or break into sections for separate prompts.
- Fallback logic must detect “too fragmented” data reliably. Mitigation: define thresholds for minimal data completeness.

## 2. App Flow Document

### Onboarding and Sign-In/Sign-Up
When a new user arrives, they land on a login page where they can either sign in or register. To register, they provide an email, password and confirm it. After registration, they’re taken to the settings screen where they enter their API keys for AmoCRM, OpenAI and optionally Brave Search or Perplexity. The system validates each key and shows a success or error message. Password recovery is available via “Forgot password,” sending a reset link by email. Users can sign out at any time with a button in the header.

### Main Dashboard or Home Page
Once logged in, the user sees the main dashboard with a header, theme switcher, and sidebar menu. The central panel lists all contacts fetched from AmoCRM, each showing the contact’s name, position and company. A search box at the top lets users filter by name or company. The sidebar offers links to Settings, Playbook Upload and Logout. Clicking a contact replaces the list view with their detail page.

### Detailed Feature Flows and Page Transitions
On a contact’s detail page, every field returned by AmoCRM is displayed in grouped sections. Beneath this, two buttons appear: “Собрать данные” and “Рекомендации.” The user first clicks “Собрать данные,” which opens a progress panel at the bottom. That panel lists each query sent to Brave Search, shows its status, and if key data is missing, automatically continues with Perplexity queries. Once complete, the panel collapses and the summarized company and contact insights show in labeled boxes. The “Рекомендации” button then becomes active; clicking it sends all data plus the active playbook to OpenAI. When results return, the UI scrolls to a recommendations section listing the top three product ideas. Users can navigate back to the main dashboard or go to Settings without losing data.

### Settings and Account Management
In Settings, users can update their email or password and re-enter any API keys. They can also choose light or dark theme and upload a new .txt playbook. Uploading replaces the built-in playbook immediately. After saving, a confirmation toast appears and users return to the dashboard by clicking “Back to Dashboard.” Changes take effect instantly.

### Error States and Alternate Paths
If users enter invalid API keys, red error messages appear alongside each field with guidance to recheck the key. If the AmoCRM fetch fails or rate limits are hit, a banner suggests retrying in a few minutes. During data collection, if Brave Search returns no useful data, a notice indicates automatic fallback to Perplexity. If both fail, a critical error message asks the user to retry or adjust keys. Network failures prompt a generic “Connection lost” screen with a retry button. Once errors are resolved, users return to the last step without restarting the entire flow.

### Conclusion and Overall App Journey
Overall, the user journey flows from secure sign-up and API key entry, to an instantly populated contact dashboard, through guided data collection with visible progress, and ends with AI-powered, playbook-driven product recommendations. All along, users can adjust settings, switch themes, or switch contacts without losing context, making the entire process smooth and focused on preparing for successful sales meetings.

## 3. Tech Stack Document

### Frontend Technologies
- React.js with TypeScript: for modular, type-safe component development and overall maintainability.
- Tailwind CSS: to speed up styling with utility classes and handle dark/light themes easily.
- React Router: for client-side routing between Dashboard, Contact Detail, Settings and Playbook Upload.
- JWT stored in memory or secure HTTP‐only cookie: to manage authentication flows.

### Backend Technologies
- Node.js with Express.js: lightweight server to handle API requests, user auth, key storage and triggers for external services.
- PostgreSQL: relational database to store user credentials, encrypted API keys and minimal session data.
- JWT Authentication: secure, stateless tokens for user sessions and role management.

### Infrastructure and Deployment
- Replit or Railway: cloud hosting supporting Node.js, environment variables for API keys, and easy scaling for prototypes.
- GitHub (or GitLab) + CI/CD: automated testing and deployments on push to main branch.
- Environment Variables: secure storage of service credentials in the deployment platform.

### Third-Party Integrations
- AmoCRM REST API: fetch all contact and company data in real time.
- OpenAI SDK: generate AI recommendations using GPT-4o family models.
- Brave Search API: first-pass web search for public company/contact info.
- Perplexity API: fallback deep research when Brave results are insufficient.

### Security and Performance Considerations
- HTTPS for all client-server and server-external API calls.
- Encryption at rest for API keys in the database.
- Rate-limit handling and retries for external APIs to avoid downtime.
- Lazy loading of components and code splitting to speed up initial page load.

### Conclusion and Overall Tech Stack Summary
This stack balances rapid front-end development with React and Tailwind, a simple yet robust Node/Express back end, and PostgreSQL for secure data storage. Integration with AmoCRM and AI/search services sits behind clear interfaces, while cloud deployment ensures we can prototype quickly and scale gracefully.

## 4. Frontend Guidelines Document

### Frontend Architecture
We use a component-based React architecture with TypeScript for clear contracts between data and UI. The app is split into containers (pages like Dashboard, ContactDetail, Settings) and reusable components (buttons, cards, modals). This setup allows teams to add features with minimal impact on existing code.

### Design Principles
We follow four key principles: 1) Usability: simple, familiar layouts and clear calls to action; 2) Accessibility: proper contrast in both themes, semantic HTML for screen readers; 3) Responsiveness: fluid layouts that adapt from mobile to desktop; and 4) Consistency: shared components, spacing and color usage throughout the app.

### Styling and Theming
Tailwind CSS provides utility-first styling, making it easy to enforce spacing, typography and color rules. We define a color palette optimized for light and dark modes, with neutral backgrounds and accent colors for buttons. We use web-safe sans-serif fonts (e.g., Inter or system UI) for readability. Theme toggles switch CSS variables for quick style changes.

### Component Structure
Components live under `src/components` grouped by function (e.g., `Button`, `Card`, `ProgressFeed`). Page containers live under `src/pages`. Each component folder contains a `.tsx` file, a `.css` or Tailwind snippet, and tests. This organization supports reusability and discoverability.

### State Management
We use Redux Toolkit to manage global state like user auth, API key settings and playbook content. Asynchronous data fetching (e.g., AmoCRM contacts, Brave Search results, recommendations) is handled with Redux Thunks. Local UI state (modals, collapsible panels) uses React’s built-in `useState` or `useReducer`.

### Routing and Navigation
React Router handles routes such as `/dashboard`, `/contact/:id`, `/settings` and `/playbook`. A sidebar navigation component reads route changes to highlight active links. Route guards ensure only authenticated users can access core pages.

### Performance Optimization
We implement code splitting with React.lazy and Suspense so that large modules (e.g., settings page) load only when needed. Images and icons are optimized SVGs. We memoize pure components with `React.memo` and heavy calculations with `useMemo` or `useCallback`.

### Testing and Quality Assurance
Unit tests use Jest and React Testing Library to verify component rendering and state changes. End-to-end tests run with Cypress to simulate user flows: signup, API key entry, data collection and recommendation display. CI pipelines run tests on each pull request.

### Conclusion and Overall Frontend Summary
Our front-end setup prioritizes clarity, performance and scalability. React with TypeScript ensures predictable behavior, while Tailwind CSS and a clear component hierarchy guarantee visual consistency. State and routing patterns keep code manageable, and testing practices protect against regressions.

## 5. Implementation Plan

1. Initialize the monorepo with React + TypeScript front end and Node.js + Express back end.
2. Set up PostgreSQL schema for users, encrypted API keys and roles.
3. Implement authentication: registration, login, JWT issuing and route guards.
4. Build the Settings page UI and back-end API to save and validate API keys.
5. Integrate AmoCRM API on the server, create endpoint to fetch and return all non-empty fields.
6. Create Dashboard page: fetch contacts from our API, display list with search and filter.
7. Develop Contact Detail page: show fetched AmoCRM fields and buttons for workflows.
8. Implement the “Собрать данные” workflow: server endpoint to call Brave Search API, check data completeness, fallback to Perplexity, return structured summary and raw logs.
9. Build ProgressFeed component to display real-time query statuses and allow collapse/expand.
10. Implement playbook logic: embed default .txt, support file upload to replace it, parse sections into JSON.
11. Develop “Рекомендации” workflow: assemble data and playbook, call OpenAI with a crafted prompt, return top three ideas.
12. Create export/copy functions for recommendation results.
13. Add theme toggling and store preference in user profile.
14. Write tests: unit tests for components and services, end-to-end tests for the main flows.
15. Configure CI/CD pipeline for automated tests and deployment to Replit/Railway.
16. Perform security review: ensure HTTPS, encrypted storage, safe error handling.
17. Conduct user acceptance tests and polish UI/UX based on feedback.

---
This unified document captures all requirements, flows, technology choices and front-end guidelines to guide development and AI-driven automation without ambiguity.
```

## Вариант для lovable полученный на занятии
```
Create a project called B2B Sales Web App with AmoCRM Integration and AI Search, description: Я хочу создать веб-приложение для B2B-продавцов, для подготовки ко встречи и увеличения продаж. Веб приложение должно взаимодействовать с AmoCRM для получения списка контактов и всей информации по каждому контакту (интересуют абсолютно все непустые поля) Документация по интеграции с AmoCRM есть по ссылке https://www.amocrm.ru/developers/content/integrations/intro
Веб приложение должно поддерживать темную тему, и ввод 4х API-ключей OpenAI, Brave Search, Perplexity, AmoCRM. Можно указать либо Brave Search API key, либо Perplexity API key, не обязательно оба сразу. Если указываются оба ключа Brave Search API и Perplexity, то сначала выполняется поиск при помощи Brave Search, и в случае если поиск неудался (нужная информация не найдена), то выполняется поиск при помощи Perplexity Deep Research. Все остальные ключи - обязательные!

В веб-приложении я выбираю клиента из списка, который получен через интеграцию с AmoCRM
При нажатии на контакт клиента, например Иван Петров из компании Сбер я сначала получаю подробную информацию о тех полях которые были переданы через интеграцию с AmoCRM
Затем чуть ниже у меня доступны 2 пункта меню:
1. "собрать данные” -  собирает информацию о компании и контакте из всех открытых источников используя Brave Search  и/или Perplexity Deep Research и суммирует ее
По компании мне обязательно нужно найти следующую информацию: отрасль, выручка, количество сотрудников, основные продукты - эту информацию надо вывести отдельными пунктами
по контакту мне обязательно нужна следующая информация: должность на текущем месте работы, 3 последние публикации в соц сетях - эту информацию надо вывести отдельными пунктамиТакже отдельно показывай сами запросы, которые делаешь и прогресс их выполнения вместе с ответами - но так чтобы не загромождать UI

2. “Рекомендации” - доступна только после отработки пункта 1 (собрать данные) и в результате показывает что можно еще продать с учетом текущих продуктов моей компании (playbook) и профиля клиента/компании предлагает Top 3 идеи продуктов, которые им стоит предложить, продать. Playbook компании задается статично в коде (придумай сам), также его можно подгрузить в любом текстовом формате - предусмотри соответствующую опцию меню. Если пользователь подгружает playbook, то он заменяет тот playbook, который указан в коде. На этой фазе работы происходит сопоставление playbook с суммарной информацией: все что есть в AmoCRM по данному контакту + резюме поиска по компании + резюме поиска по контакту
UI должен быть на русском языке
, refer to the following documentation:

# Unified Project Documentation

## 1. Project Requirements Document

### 1.1 Project Overview
This web application is built for B2B sales teams to streamline meeting preparation and boost sales. By integrating with AmoCRM, it fetches every non-empty field of a client’s contact and company data. On top of that, it uses external search services (Brave Search and Perplexity Deep Research) plus OpenAI models to gather up-to-date insights about a company’s industry, revenue, headcount, products and a contact’s job title and recent social media posts.

The key objectives are to give sales reps a one-stop dashboard with complete context for each client, automate data gathering from public sources, and then generate three tailored upsell ideas based on a static or user-uploaded playbook. We’ll know we’re successful if users can log in, set their own API keys, pick a contact, see all AmoCRM fields, run data collection with clear progress feedback, and get AI-driven recommendations—all in under two minutes per contact.

### 1.2 In-Scope vs. Out-of-Scope

**In-Scope**
- User registration, login and role-based access (admin vs. standard user)
- Secure, encrypted storage of individual API keys for AmoCRM, OpenAI, Brave Search, Perplexity
- Light and dark theme support with a modern, professional look in Russian
- Real-time fetching of all non-empty fields from AmoCRM contacts and associated companies
- “Собрать данные” workflow: Brave Search first, automatic fallback to Perplexity if key data (industry, revenue, employees, products) is missing or too fragmented
- Progress feed showing each raw search query, status and brief responses in a collapsible UI
- Display of company insights (industry, revenue, employees, main products) and contact insights (current job title, three latest social posts)
- Static playbook embedded in code plus option to upload a .txt playbook that replaces the default
- “Рекомендации” workflow: AI algorithm matches playbook to gathered data and suggests top three product ideas, letting users choose GPT-4o, GPT-4o-mini or o4-mini
- Export or copy recommendations as text; settings (keys, theme, uploaded playbook) persist per user profile
- Deployment as a cloud prototype (e.g., Replit or Railway) without long-term data retention beyond the current session

**Out-of-Scope**
- Historical storage of past data collection or recommendation results
- Detailed audit logs or GDPR-style data retention policies
- Alternative search providers beyond Brave and Perplexity
- Advanced analytics dashboards or reports beyond the three upsell suggestions
- Mobile-specific UI—focus is on desktop web

### 1.3 User Flow
A new user visits the landing page, signs up with an email and password, then logs in. Upon first login, they go to Settings to enter and save their API keys for AmoCRM, OpenAI and either or both Brave Search and Perplexity. They also select their theme preference. After saving, they see a dashboard listing all contacts pulled automatically from AmoCRM.

From the dashboard, the user searches or filters to find a contact. Clicking a contact shows every field fetched from AmoCRM grouped by section. Below that, two buttons appear: “Собрать данные” and “Рекомендации”. The user first clicks “Собрать данные” to trigger external searches—Brave Search runs first and if it doesn’t return complete key data, the app falls back to Perplexity. A live feed shows each query’s text, status and summary. When complete, the company and contact insights display. Then the user clicks “Рекомендации” to run an AI prompt that matches the active playbook to the collected data and shows the top three products to offer. The user can copy or export these. Settings and selected contact remain available until logout.

### 1.4 Core Features
- Authentication & Access Control: Email/password signup, JWT-based sessions, admin vs. standard roles.
- API Key Management: Encrypted per-user storage of AmoCRM, OpenAI, Brave Search, Perplexity keys, with validation on save.
- AmoCRM Integration: Fetch and display all non-empty contact and company fields via AmoCRM REST API.
- Theme & Localization: Light/dark mode with instant switch, Russian UI text.
- Data Collection Workflow: “Собрать данные” button that triggers Brave Search, falls back to Perplexity if industry, revenue, employee count or products are missing; grouped company/contact data.
- Progress Feed: Real-time log of queries, statuses (“running,” “success,” “switching to Perplexity”), expandable details without cluttering the main UI.
- Playbook Management: Built-in static playbook in code; .txt upload to replace it, with simple sections: Products, Target Audience, Unique Propositions.
- AI Recommendations: After data collection, trigger OpenAI with a detailed prompt and chosen model to produce top three upsell ideas.
- Export & Copy: Ability to copy results or download recommendations as plain text.
- Settings Persistence: User preferences (keys, theme, playbook) stored and reloaded on login.
- Cloud Deployment: Prototype hosted on Replit/Railway with Node.js support and secure environmental variables.

### 1.5 Tech Stack & Tools
- Frontend: React.js + TypeScript, Tailwind CSS for styling, React Router for navigation.
- Backend: Node.js + Express.js, PostgreSQL for encrypted settings storage, JWT for authentication.
- AI & Search: OpenAI SDK for recommendations, Brave Search API with fallback, Perplexity API for deep research.
- CRM Integration: AmoCRM REST API for fetching contacts and company data.
- Dev & Collaboration: Lovable.dev, Cursor, Replit, Cline as coding and prototyping tools.

### 1.6 Non-Functional Requirements
- Performance: Dashboard load under 2 seconds; each external search stage should report progress within 3–5 seconds.
- Security: HTTPS everywhere, encrypted storage of API keys, salted password hashing, JWT token expiration.
- Compliance: Basic privacy by not storing session data permanently; future GDPR compliance planned for later phases.

### 1.7 Constraints & Assumptions
- Must run on Node.js environments in the cloud (Replit/Railway).
- Users supply valid API keys for AmoCRM and OpenAI; at least one of Brave or Perplexity.
- Prototype limits data to current session; no history table is maintained.
- Playbook format is plain .txt with predictable section headers.
- AmoCRM rate limits and custom fields may vary—assume reasonable API limits.

### 1.8 Known Issues & Potential Pitfalls
- Retrieving all custom fields from AmoCRM may lead to inconsistent schemas. Mitigation: normalize by listing only non-empty entries with field labels.
- API rate limits on Brave Search or AmoCRM could slow process. Mitigation: respect rate limits, show errors and encourage retries.
- Parsing search results into structured key data (industry, revenue, etc.) can be error-prone. Mitigation: use strict prompt templates and fallback conditions.
- Large playbooks may slow recommendation generation. Mitigation: limit file size or break into sections for separate prompts.
- Fallback logic must detect “too fragmented” data reliably. Mitigation: define thresholds for minimal data completeness.

## 2. App Flow Document

### Onboarding and Sign-In/Sign-Up
When a new user arrives, they land on a login page where they can either sign in or register. To register, they provide an email, password and confirm it. After registration, they’re taken to the settings screen where they enter their API keys for AmoCRM, OpenAI and optionally Brave Search or Perplexity. The system validates each key and shows a success or error message. Password recovery is available via “Forgot password,” sending a reset link by email. Users can sign out at any time with a button in the header.

### Main Dashboard or Home Page
Once logged in, the user sees the main dashboard with a header, theme switcher, and sidebar menu. The central panel lists all contacts fetched from AmoCRM, each showing the contact’s name, position and company. A search box at the top lets users filter by name or company. The sidebar offers links to Settings, Playbook Upload and Logout. Clicking a contact replaces the list view with their detail page.

### Detailed Feature Flows and Page Transitions
On a contact’s detail page, every field returned by AmoCRM is displayed in grouped sections. Beneath this, two buttons appear: “Собрать данные” and “Рекомендации.” The user first clicks “Собрать данные,” which opens a progress panel at the bottom. That panel lists each query sent to Brave Search, shows its status, and if key data is missing, automatically continues with Perplexity queries. Once complete, the panel collapses and the summarized company and contact insights show in labeled boxes. The “Рекомендации” button then becomes active; clicking it sends all data plus the active playbook to OpenAI. When results return, the UI scrolls to a recommendations section listing the top three product ideas. Users can navigate back to the main dashboard or go to Settings without losing data.

### Settings and Account Management
In Settings, users can update their email or password and re-enter any API keys. They can also choose light or dark theme and upload a new .txt playbook. Uploading replaces the built-in playbook immediately. After saving, a confirmation toast appears and users return to the dashboard by clicking “Back to Dashboard.” Changes take effect instantly.

### Error States and Alternate Paths
If users enter invalid API keys, red error messages appear alongside each field with guidance to recheck the key. If the AmoCRM fetch fails or rate limits are hit, a banner suggests retrying in a few minutes. During data collection, if Brave Search returns no useful data, a notice indicates automatic fallback to Perplexity. If both fail, a critical error message asks the user to retry or adjust keys. Network failures prompt a generic “Connection lost” screen with a retry button. Once errors are resolved, users return to the last step without restarting the entire flow.

### Conclusion and Overall App Journey
Overall, the user journey flows from secure sign-up and API key entry, to an instantly populated contact dashboard, through guided data collection with visible progress, and ends with AI-powered, playbook-driven product recommendations. All along, users can adjust settings, switch themes, or switch contacts without losing context, making the entire process smooth and focused on preparing for successful sales meetings.

## 3. Tech Stack Document

### Frontend Technologies
- React.js with TypeScript: for modular, type-safe component development and overall maintainability.
- Tailwind CSS: to speed up styling with utility classes and handle dark/light themes easily.
- React Router: for client-side routing between Dashboard, Contact Detail, Settings and Playbook Upload.
- JWT stored in memory or secure HTTP‐only cookie: to manage authentication flows.

### Backend Technologies
- Node.js with Express.js: lightweight server to handle API requests, user auth, key storage and triggers for external services.
- PostgreSQL: relational database to store user credentials, encrypted API keys and minimal session data.
- JWT Authentication: secure, stateless tokens for user sessions and role management.

### Infrastructure and Deployment
- Replit or Railway: cloud hosting supporting Node.js, environment variables for API keys, and easy scaling for prototypes.
- GitHub (or GitLab) + CI/CD: automated testing and deployments on push to main branch.
- Environment Variables: secure storage of service credentials in the deployment platform.

### Third-Party Integrations
- AmoCRM REST API: fetch all contact and company data in real time.
- OpenAI SDK: generate AI recommendations using GPT-4o family models.
- Brave Search API: first-pass web search for public company/contact info.
- Perplexity API: fallback deep research when Brave results are insufficient.

### Security and Performance Considerations
- HTTPS for all client-server and server-external API calls.
- Encryption at rest for API keys in the database.
- Rate-limit handling and retries for external APIs to avoid downtime.
- Lazy loading of components and code splitting to speed up initial page load.

### Conclusion and Overall Tech Stack Summary
This stack balances rapid front-end development with React and Tailwind, a simple yet robust Node/Express back end, and PostgreSQL for secure data storage. Integration with AmoCRM and AI/search services sits behind clear interfaces, while cloud deployment ensures we can prototype quickly and scale gracefully.

## 4. Frontend Guidelines Document

### Frontend Architecture
We use a component-based React architecture with TypeScript for clear contracts between data and UI. The app is split into containers (pages like Dashboard, ContactDetail, Settings) and reusable components (buttons, cards, modals). This setup allows teams to add features with minimal impact on existing code.

### Design Principles
We follow four key principles: 1) Usability: simple, familiar layouts and clear calls to action; 2) Accessibility: proper contrast in both themes, semantic HTML for screen readers; 3) Responsiveness: fluid layouts that adapt from mobile to desktop; and 4) Consistency: shared components, spacing and color usage throughout the app.

### Styling and Theming
Tailwind CSS provides utility-first styling, making it easy to enforce spacing, typography and color rules. We define a color palette optimized for light and dark modes, with neutral backgrounds and accent colors for buttons. We use web-safe sans-serif fonts (e.g., Inter or system UI) for readability. Theme toggles switch CSS variables for quick style changes.

### Component Structure
Components live under `src/components` grouped by function (e.g., `Button`, `Card`, `ProgressFeed`). Page containers live under `src/pages`. Each component folder contains a `.tsx` file, a `.css` or Tailwind snippet, and tests. This organization supports reusability and discoverability.

### State Management
We use Redux Toolkit to manage global state like user auth, API key settings and playbook content. Asynchronous data fetching (e.g., AmoCRM contacts, Brave Search results, recommendations) is handled with Redux Thunks. Local UI state (modals, collapsible panels) uses React’s built-in `useState` or `useReducer`.

### Routing and Navigation
React Router handles routes such as `/dashboard`, `/contact/:id`, `/settings` and `/playbook`. A sidebar navigation component reads route changes to highlight active links. Route guards ensure only authenticated users can access core pages.

### Performance Optimization
We implement code splitting with React.lazy and Suspense so that large modules (e.g., settings page) load only when needed. Images and icons are optimized SVGs. We memoize pure components with `React.memo` and heavy calculations with `useMemo` or `useCallback`.

### Testing and Quality Assurance
Unit tests use Jest and React Testing Library to verify component rendering and state changes. End-to-end tests run with Cypress to simulate user flows: signup, API key entry, data collection and recommendation display. CI pipelines run tests on each pull request.

### Conclusion and Overall Frontend Summary
Our front-end setup prioritizes clarity, performance and scalability. React with TypeScript ensures predictable behavior, while Tailwind CSS and a clear component hierarchy guarantee visual consistency. State and routing patterns keep code manageable, and testing practices protect against regressions.

## 5. Implementation Plan

1. Initialize the monorepo with React + TypeScript front end and Node.js + Express back end.
2. Set up PostgreSQL schema for users, encrypted API keys and roles.
3. Implement authentication: registration, login, JWT issuing and route guards.
4. Build the Settings page UI and back-end API to save and validate API keys.
5. Integrate AmoCRM API on the server, create endpoint to fetch and return all non-empty fields.
6. Create Dashboard page: fetch contacts from our API, display list with search and filter.
7. Develop Contact Detail page: show fetched AmoCRM fields and buttons for workflows.
8. Implement the “Собрать данные” workflow: server endpoint to call Brave Search API, check data completeness, fallback to Perplexity, return structured summary and raw logs.
9. Build ProgressFeed component to display real-time query statuses and allow collapse/expand.
10. Implement playbook logic: embed default .txt, support file upload to replace it, parse sections into JSON.
11. Develop “Рекомендации” workflow: assemble data and playbook, call OpenAI with a crafted prompt, return top three ideas.
12. Create export/copy functions for recommendation results.
13. Add theme toggling and store preference in user profile.
14. Write tests: unit tests for components and services, end-to-end tests for the main flows.
15. Configure CI/CD pipeline for automated tests and deployment to Replit/Railway.
16. Perform security review: ensure HTTPS, encrypted storage, safe error handling.
17. Conduct user acceptance tests and polish UI/UX based on feedback.

---
This unified document captures all requirements, flows, technology choices and front-end guidelines to guide development and AI-driven automation without ambiguity.

```