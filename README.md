# Canvas LLM Builder - GitHub Coding Challenge
The project has been deployed in Vercel: https://canvas-llm-builder.vercel.app/.

- I'm using keywords to identify the state transitions.
      - need to set the keywords for every edge
- call not implemented

## Overview

Your task is to build a drag-and-drop state-based LLM builder where users can visually create AI agents with different conversational states. The system will allow users to define a global prompt, configure state-specific prompts, and define edges (transitions) between states.

## How to Use it

Start by setting a global prompt, then create individual states with their own prompts. You can connect states using edges and define transition logic based on keywords. Use the built-in Test Mode sidebar to interact with your agent in real time and observe how it moves between states. All data is persisted using PostgreSQL and managed via Drizzle ORM. I'm not saving the chat messages. 

## Implemented Features

- **Agent Editor**: Create an agent with yor global prompt and state schema.
- **Visual Flow Editor**: Drag-and-drop interface to create and connect conversation states
- **State CRUD**: Define specific prompts for each conversation state
- **Transition Rules**: Create transitions between states using keywords
- **Real-time Testing**: Test your agent directly in the application with a built-in chat interface
- **State Visualization**: See which states are active during testing
- **Database Integration**: Save and load your agents for continued development

## Technical Architecture

### Frontend

- **React & Next.js**: Modern React with the App Router for routing and server components
- **ReactFlow**: For the interactive node-based editor
- **TailwindCSS & shadcn/ui**: For styling and UI components
- **TypeScript**: For type safety and better developer experience

### Backend

- **Next.js API Routes & Server Actions**: Handle data operations
- **PostgreSQL with Drizzle ORM**: Data persistence
- **OpenAI API**: Powers the LLM interactions
- **Server Components**: For efficient data loading

### Database Schema

The application uses a relational database with three main tables:

1. **agents**: Stores agent metadata including name and global prompt
2. **states**: Stores state data including position, prompt, and name
3. **edges**: Stores transition data including source, target, and keywords

This schema enables efficient storage and retrieval of complex agent configurations.

### Agent Testing Implementation

The testing feature uses a combination of:

1. **OpenAI's API**: For generating responses within each state
2. **Custom Transition Logic**: Evaluates user messages and IA responses with the keywords
3. **State Tracking**: Maintains the current state
4. **Visualizations**: Highlights active states and transitions during testing

