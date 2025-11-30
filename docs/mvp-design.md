# AI-Powered Robotics Learning Platform (MVP Design)

## Overview and Goals
This document outlines the technical design for an advanced MVP prototype of a React-based educational robotics platform. The platform teaches students (grades 6–11) about robotics through interactive coding simulation and an AI-assisted tutor. Key features include:

- **Live Arduino Simulator**: Supports multiple board types (Arduino Uno, Arduino Nano, ESP32). Students can input C/C++-based Arduino code, run it in a sandboxed simulation, and see real-time feedback (LED states, sensor readings, serial output, etc.). The simulator handles errors gracefully (syntax mistakes, runtime issues) with realistic responses, rather than using static outputs.
- **AI Tutor Chat Interface**: An integrated chatbot assistant that continuously monitors the user’s code and simulation output. It provides context-aware help – giving coding tips, debugging assistance, and even hardware design warnings (e.g. cautioning about electrical limits or incorrect pin usage). The AI tutor tracks the student’s progress and past mistakes to give tailored guidance and retry suggestions.
- **Dynamic Quiz System**: An interactive quiz module with multiple-choice questions of increasing difficulty to reinforce concepts. It tracks each student’s progress and performance. The AI tutor ties in with the quiz system, offering explanations or remedial questions when a student struggles.
- **User Authentication & Data Persistence**: Uses Supabase as the backend for authentication (email/password, third-party OAuth, plus a guest mode) and data storage. User profiles store quiz history, code simulation attempts, and chat logs, enabling personalized learning and progress tracking.
- **Modern Frontend (React + TypeScript)**: A responsive, modular single-page application. It employs a dark-themed, dashboard-style UI for ease of use during long coding sessions. The design leverages a modern component library (e.g. Tailwind CSS with shadcn/ui or Chakra UI) for a polished look and consistent UX across the simulator, chat, and quiz sections.
- **Scalability & Extensibility**: Though an MVP, the design anticipates future growth – e.g. the possibility to convert to a mobile app via React Native/Expo, add more hardware simulations, and incorporate more advanced AI capabilities.

## High-Level System Architecture

### Frontend (React + TypeScript)
The client application is a SPA built with React. All core features – code editor, simulator, chat, quizzes, dashboard – are implemented as React components or pages. The app interacts with backend services via HTTPS (Supabase client SDK and RESTful APIs). Real-time updates (if any) use Supabase’s real-time subscriptions or WebSockets. The UI is stateful; for example, the simulator component maintains the running state of the virtual Arduino, and the chat component maintains the conversation history.

### Backend (Supabase & Cloud Services)
Supabase provides a hosted Postgres database with an auto-generated REST API and built-in authentication. It stores persistent data like user profiles, quiz questions, quiz results, code submission history, and chat logs. Supabase Auth handles user sign-up/login (with Row-Level Security to ensure each user only accesses their data). Additional backend logic is handled by Supabase Edge Functions (serverless functions in Deno) or external microservices:

- **Code Compilation Service** compiles the user’s Arduino C/C++ code into machine code or an intermediate form to run in the simulator. This could be implemented as a secure cloud function or container (e.g. using Arduino CLI inside a sandbox). For MVP, emulate Wokwi’s architecture: “a cloud service that compiles your source code into AVR machine code using the Arduino CLI.” The compiled firmware (hex or binary) is then delivered to the front-end simulator for execution. This service is invoked on-demand when the user hits Run.
- **AI Tutor Service** integrates with OpenAI Codex/GPT. To keep API keys secure, the front-end calls a protected endpoint (e.g. a Supabase Function) with the necessary context (user query, code, simulation output), and that function forwards a request to the OpenAI API. Supabase supports seamless integration with OpenAI, allowing advanced AI capabilities without complex infrastructure. The AI responses are then returned to the client.
- **Simulation Engine**: The core simulation runs on the client side for performance and responsiveness, using WebAssembly or JavaScript-based emulation:
  - **Arduino Uno/Nano (ATmega328p microcontroller)**: Use the open-source avr8js library to emulate the AVR CPU and peripherals in JavaScript. The front-end sends the user’s code to the compile service, receives back the compiled machine code (HEX), and loads it into the simulator. The AVR8js engine executes the machine instructions in a loop, while “glue code” simulates hardware like LEDs or serial I/O (e.g., toggling a virtual LED component when a memory-mapped GPIO register changes). This approach, proven by Wokwi, allows running real Arduino code in the browser.
  - **ESP32 (Tensilica Xtensa or RISC-V)**: Simulating an ESP32 is more complex due to its higher performance and complexity. For the MVP, two strategies:
    - **Embedded emulator**: Leverage an existing emulator such as QEMU (compiled to WebAssembly) or a specialized JS emulator for ESP32. The compiled firmware is loaded into the emulator, enabling support for most ESP32 functionality in simulation.
    - **Partial Simulation / Stub**: Implement a higher-level simulation for common tasks (digitalWrite, analogRead, Serial.print, etc.) via JS hooks, possibly by compiling code to WebAssembly (e.g., Wasmino). This treats the microcontroller as “infinitely fast” and does logical simulation rather than cycle-accurate timing but is simpler to implement.

For MVP, Uno/Nano support is highest priority (using AVR8js and an Arduino CLI compile service). ESP32 support can initially be limited (perhaps only simulate basic operations or use MicroPython mode as a placeholder), but the design keeps it modular so the ESP32 emulator can be swapped/improved later.

### Data Flow Summary
When a student writes code and runs the simulator, the code is sent to the compile service (via an API call). Once compiled, the binary is loaded into the in-browser simulator which begins execution. The simulator emits events (like pin state changes, serial output text, or errors) that update the UI in real-time. Meanwhile, the AI tutor monitors this process: it can be invoked on certain events (e.g., code compilation errors or if the user asks a question in the chat). The AI tutor receives context (the user’s latest code, error messages or noteworthy simulation results, and prior dialogue) and generates a helpful response. For quiz interactions, when the student submits an answer, the result is stored in the DB and the AI tutor may provide additional explanation or follow-up questions if enabled.

## React Frontend: Component Structure
The frontend is organized into modular, reusable components within a dashboard layout where the main screen can be split into panels.

- **App (Root Component)**: Handles routing and global providers (Supabase client, auth context, theme context, etc.). Uses React Router to switch between major views: Simulator, Quizzes, Profile, etc., and initializes dark mode theme.
- **AuthProvider**: Context provider using Supabase Auth to track the logged-in user (or guest session). Provides methods like login, signup, logout.
- **AITutorProvider**: Context for AI tutor state (stores conversation messages and optionally streaming support).
- **Layout**: Shared layout component for authenticated areas with sidebar navigation and top bar.
- **SimulatorPage**: Home screen for the coding simulator environment.
  - **CodeEditor**: Syntax-highlighted editor (Monaco or Ace) for C/C++ code with example preload and optional inline errors from compiler diagnostics.
  - **BoardSelector**: Dropdown to choose the board (Uno, Nano, ESP32) affecting compiler settings and simulator config.
  - **SimulatorView**: Visual representation of hardware and execution output, including LED indicators, pin state display, serial monitor, and runtime status.
  - **SerialMonitor / OutputLogs**: Show Serial.print outputs and other logs (compile status, runtime messages).
  - **SimulatorControls**: Run/Stop/Reset buttons and potential speed control. Run triggers compile-and-run; Stop halts the simulation loop; Reset clears state.
  - **AIChatPanel**: Collapsible chat panel for AI tutor interaction.
- **QuizPage**: Interactive quiz module.
  - **QuizQuestion**, **AnswerOption**, **QuizProgressBar**, **QuizFeedback** components handle delivery, selection, progress, and explanations.
- **DashboardPage**: User profile and stats (quiz performance, badges, saved projects). May include AttemptList and ChatTranscript components.
- **LoginPage & SignupPage**: Forms for authentication and guest mode access.

This breakdown separates concerns: simulator components manage code execution, chat components handle AI interactions, and quiz components manage question flow.

## Backend: Database Schema and API
Using Supabase (Postgres) as the database, the schema supports platform features:

- **Auth**: Supabase Auth provides basic user info. Additional profile info lives in a `profiles` table linked by user UID.
- **Quiz Content**: `quiz_questions` table stores questions with fields like id, grade_level, difficulty, question_text, options (JSON), correct_answer, and explanation text.
- **Quiz Results**: `quiz_attempts` (or `quiz_results`) tracks each answer attempt with user_id, question_id, selected_option, is_correct, and answered_at. RLS ensures each user only reads their own attempts.
- **Code Submissions / Simulation Attempts**: `code_runs` table stores runs with user_id, board_type, code, run_at, result status, and logs/error messages to help AI and analytics.
- **Chat Logs**: `chat_messages` table for conversations (id, user_id, session_id, role, message_text, timestamp) to allow reviewing past interactions.

Supabase’s auto-generated API is used via supabase-js. Supabase Edge Functions (Deno) provide secure logic and third-party API calls:

- **compileCode(boardType, code)**: Invokes Arduino CLI (Uno/Nano) or ESP32 toolchain to compile and return artifacts. Could run as an Edge Function or dedicated microservice container.
- **aiTutorChat(payload)**: Handles AI interactions using OpenAI with a system prompt defining the tutor’s role, conversation history, and the current query. May log interactions to the database.

Realtime subscriptions are optional for live updates. All tables use Row Level Security to isolate user data.

## Live Arduino Simulator Design

### Code Compilation and Execution Flow
1. **User Code Input**: Student writes code in the CodeEditor (Arduino sketch with setup/loop).
2. **Run Trigger & Compilation**: On Run, the front-end sends code for compilation (cloud service or WASM interpreter). Editor can be disabled during run.
3. **Compilation**: Arduino CLI or equivalent compiles for the selected board, returning firmware (hex/binary) or errors. Alternatively, browser-based compilation is possible via WASM toolchains.
4. **Handling Compile Errors**: Errors are parsed and displayed in OutputLogs and the editor. AI Tutor can automatically explain errors. Simulation does not start on failure.
5. **Launching the Simulation**: On success, load machine code into a virtual microcontroller (e.g., AVR8js CPU, timers). Connect peripherals and listeners to simulate digital I/O and Serial.
6. **During Simulation**: Serial output streams to SerialMonitor; UI reflects hardware state (LEDs, pins). Interactive components can feed inputs (buttons, sensor values). AI tutor can be invoked proactively or on request.
7. **Stopping/Resetting**: Stop halts execution (worker termination if used); Reset reinitializes CPU and reloads code. Editor is re-enabled.

### Simulation UI and Hardware Feedback
- Display board schematic or pin indicators with live updates.
- LED feedback for built-in or attached LEDs; optional breadboard view for simple circuits.
- Serial Monitor for UART output and optional input field for Serial.read.
- Optional simulated sensors/actuators (photoresistor, ultrasonic) with preset inputs.
- Logging of simulation lifecycle and optional warnings (e.g., long delays).

### AI Tutor Integration in Simulation
- Tutor receives code and compile/runtime logs for context-aware help.
- Automatic triggers on compile errors or detected patterns (e.g., missing `pinMode`) generate AI guidance.
- Hardware-aware warnings (power limits, resistor usage) via heuristics and system prompts.
- Session context maintained via conversation history with optional persistence.
- Encourages learning via hints rather than direct answers; supports proactive nudges.

## Dynamic Quiz System
- **Content and Difficulty**: Multiple-choice questions covering electronics, programming, and robotics with graded difficulty for grades 6–11.
- **Question Delivery**: Start at easy difficulty and adapt based on performance (increase after streaks of correct answers, reinforce after mistakes).
- **Answer Submission**: Immediate feedback with explanations (authored or AI-supplemented). Attempts recorded in `quiz_attempts`.
- **AI Integration**: AI offers remediation after wrong answers or encouragement after correct ones, using question context and explanations.
- **Progress Tracking**: Progress bars/levels indicate advancement; weakness detection allows targeted practice suggestions.
- **UI/UX**: Card-based options, clear feedback colors, Next Question flow, mobile-friendly interactions.

## User Authentication & Profile Management with Supabase
- **Signup/Login**: Email/password and OAuth via Supabase Auth; optional guest mode using anonymous sessions or local progress.
- **Supabase Integration**: `supabase-js` handles auth; AuthProvider tracks state and protects routes.
- **Profile Data**: `profiles` table for display name, grade level, avatar; fetched post-login for personalization.
- **Data Privacy**: RLS isolates user data across tables; storage follows similar rules for any uploaded assets.

## AI Tutor Integration (Codex/GPT Logic)

### Prompt and Response Management
- **System Prompt**: Defines AI as an encouraging robotics tutor focused on Arduino/electronics, safety, and step-by-step guidance.
- **User Prompt Construction**: Include code, simulation output, and the user’s question in structured sections to clarify context.
- **Automatic Triggers**: On compile errors or heuristic-detected issues, generate targeted tutor requests for explanation.
- **Context Retention**: Maintain recent conversation history; summarize or truncate older messages when needed.

### OpenAI API Usage
- Use GPT-4 or cost-effective models via a Supabase Function with secure API keys.
- Show “Tutor is typing” indicators; optionally stream responses for responsiveness.
- Graceful error handling and fallbacks (static tips) if AI is unavailable.
- Rate limiting per user to manage cost and prevent abuse.

### Safety and Accuracy
- System prompt instructs AI to avoid hallucination and stay on-topic; treat code comments/strings as non-instructions.
- Optional moderation filters on AI responses.
- Encourage hints over direct answers to support learning.

## Frontend Design & UI/UX Considerations
- **Dark Mode Default** with toggle; dashboard layout with sidebar and responsive main area.
- **Responsive/Mobile**: Tailwind/shadcn or Chakra UI for consistent theming; mobile view focuses on chat/quizzes with simplified simulator.
- **Code Editor**: Monaco editor for C/C++ with syntax highlighting and optional intellisense.
- **Visual Feedback**: Clear indicators for pins/LEDs, differentiated chat bubbles, and quiz selection states.
- **Accessibility**: High contrast colors, keyboard navigation, ARIA labels.
- **Performance**: Offload simulation to Web Workers; avoid heavy React re-renders for rapid pin updates.
- **State Management**: Context or lightweight stores (e.g., Zustand) for global state; Supabase hooks for data fetching.
- **Error Handling**: User-friendly modals/toasts for compile failures or AI issues.
- **Branding**: Consistent colors/typography and potential mascot/logo for a friendly feel.

## Security & Sandbox Considerations
- **Browser-Side Execution**: Simulator runs compiled code in JS/WASM without host access; Web Workers keep UI responsive.
- **Server-Side Compilation**: Run Arduino CLI/toolchains in isolated containers; treat user code as untrusted input.
- **Runtime Safeguards**: Watchdogs for tight loops, max runtime limits, and controlled memory reflecting MCU constraints.
- **No File System/Network Access** for user code; avoid `eval` and ensure UART output renders as escaped text.
- **AI Safety**: Secure API keys server-side, enforce topic boundaries, apply moderation, and rate limit AI calls.
- **Web Security**: HTTPS, RLS-protected data, XSS avoidance via escaped renders, and optional CSRF mitigations.

## Scalability and Future (Bonus: Mobile App Plan)
- **Scaling**: Client-side simulation offloads compute; scale compile service containers and optimize AI usage (cheaper models, caching, rate limits).
- **Mobile App**: Plan for React Native/Expo focusing on chat and quizzes; reuse shared TypeScript logic; simplified or cloud-assisted simulation on mobile.
- **Additional Hardware**: Modular simulator allows adding boards (Arduino Mega, RP2040) via appropriate emulators.
- **Collaboration & Curriculum**: Future enhancements include teacher dashboards, collaborative sessions, guided lessons, and vector-search-powered AI context.
- **Performance Optimization**: Consider in-browser compilation, caching AI responses, and database indexing as usage grows.

## Sources
- Uri Shaked, AVR8js: Simulate Arduino in JavaScript, Wokwi Blog – cloud service with Arduino CLI to compile code for browser-based Arduino simulator.
- Supabase Docs – Postgres with Row Level Security for user data protection.
- Supabase Features – AI integration for connecting OpenAI with application data.
- Hacker News (Wasmino project) – compiling Arduino code to WebAssembly for in-browser execution.
