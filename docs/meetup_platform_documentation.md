# Meetup Platform Documentation

## Project Overview
This documentation provides an overview of the files in the Meetup platform, which is built using React Native and Express. It is designed to help junior developers understand the structure and functionality of the codebase.

## File Documentation

### 1. EditScreenInfo.tsx
- **Description**: A React Native component that displays information about editing the screen. It includes a title, a description, and the path of the current file.
- **Key Features**:
  - Displays a title and description.
  - Shows the current file path.
  - Uses styles for layout.

### 2. app.json
- **Description**: Configuration file for the Expo application.
- **Key Features**:
  - Contains app name, slug, version, and scheme.
  - Configures plugins for image picking, location access, and Mapbox integration.
  - Defines splash screen and icon settings.

### 3. cesconfig.json
- **Description**: Configuration file for project settings.
- **Key Features**:
  - Lists project name and version.
  - Specifies packages used (e.g., `expo-router`, `nativewind`, `supabase`).
  - Contains flags for project management.

### 4. AddressAutocomplete.ts
- **Description**: Utility functions for fetching address suggestions and details from the Mapbox API.
- **Key Features**:
  - `getSuggestions`: Fetches address suggestions based on user input.
  - `retrieveDetails`: Retrieves detailed information for a specific address.
