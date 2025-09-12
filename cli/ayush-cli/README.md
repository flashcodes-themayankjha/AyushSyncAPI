[![npm version](https://img.shields.io/npm/v/@mayankjha07/ayush-cli.svg)](https://www.npmjs.com/package/@mayankjha07/ayush-cli) [![License: MIT](https://img.shields.io/npm/l/@mayankjha07/ayush-cli.svg)](https://github.com/mayankjha07/AyushSyncAPI/blob/main/LICENSE)

# Ayush CLI

The `Ayush-cli` is a powerful command-line interface designed to bridge Indian Traditional Medicine with Modern Medicine. It leverages the AyushSync API to interact with FHIR Resources, offering functionalities for symptom diagnosis, medical code translation (ICD-11 to NAMASTE and vice-versa), and information lookup.

## Table of Contents

- [Features](#features)
- [Installation (NPM)](#installation-npm)
- [Installation (Local Development)](#installation-local-development)
- [Usage](#usage)
  - [Global Options (Flags)](#global-options-flags)
  - [Commands](#commands)
    - [Initial/Logged Out/Guest Commands](#initiallogged-outguest-commands)
    - [Logged In / Test Mode Commands](#logged-in--test-mode-commands)
  - [Interactive REPL Mode](#interactive-repl-mode)
- [Authentication](#authentication)
- [Example Usage](#example-usage)

## Features

*   **Symptom Diagnosis (Chat):** Engage in an interactive chat to describe symptoms and receive a diagnosis, recommended treatments, and information on datasets used.
*   **Medical Code Translation:** Translate between ICD-11 and NAMASTE codes.
*   **Information Lookup:** Find medical information by NAMASTE name or specific conditions.
*   **Interactive Experience:** User-friendly prompts and formatted output for a seamless CLI experience.
*   **Test Mode:** Bypass authentication for development and testing purposes.

## Installation (NPM)

To install the Ayush CLI globally via npm, open your terminal and run:

```bash
npm install -g @mayankjha07/ayush-cli
```

Once installed, you can run the CLI using the `ayush-cli` command followed by your desired command or flag:

```bash
ayush-cli <command> [options]
# Example: ayush-cli chat
# Example: ayush-cli --help
```

## Installation (Local Development)

To run the Ayush CLI directly from the project source for local development or testing, navigate to the project root and execute the following commands:

```bash
chmod 777 index.js
./index.js
```

## Usage

The Ayush CLI can be used with various commands and flags.

### Global Options (Flags)

These flags can be used with any command or when starting the CLI.

*   `-c`, `--clear`: Clears the console before executing the command.
*   `-d`, `--debug`: Prints debug information (for development purposes).
*   `-l`, `--logout`: Logs out the current user from the CLI.
*   `-q`, `--quit`: Quits the CLI application.
*   `-t`, `--testMode`: Enables test mode, allowing access to `chat` and `translate` features without requiring a login.

### Commands

The available commands depend on your authentication status (logged in, guest, or test mode).

#### Initial/Logged Out/Guest Commands

These commands are available when you are not logged in and not in test mode.

*   `help`: Displays comprehensive help information about all available commands and flags.
*   `login`: Initiates the interactive login process for the Ayush CLI.
*   `clear`: Clears the console.

#### Logged In / Test Mode Commands

These commands become available once you are successfully logged in or have enabled test mode.

*   `help`: Displays comprehensive help information about all available commands and flags.
*   `chat`:
    *   **Description:** Starts an interactive session where you can describe your symptoms. The CLI will process your input to provide a diagnosis, suggest recommended treatments, and indicate the medical datasets referenced.
    *   **Usage:** `./index.js chat` or simply `chat` when in REPL mode.
    *   **Interactive Flow:**
        *   You will be prompted to "Enter your symptoms:".
        *   After processing, a diagnosis (e.g., "Common Cold") and treatment plan will be displayed.
        *   You will then be asked if you wish to "enter more symptoms?".
        *   To exit the chat session, type `quit` when prompted for symptoms.
*   `translate`:
    *   **Description:** Provides a suite of tools for medical code translation and lookup. You can translate between ICD-11 and NAMASTE codes, or search for information using NAMASTE names or medical conditions.
    *   **Usage:** `./index.js translate` or simply `translate` when in REPL mode.
    *   **Interactive Flow:**
        *   A menu will be presented, allowing you to choose from the following options:
            *   `icd11ToNamaste`: Translate an ICD-11 code to its corresponding NAMASTE entry.
            *   `namasteToIcd11`: Translate a NAMASTE code to its corresponding ICD-11 entry.
            *   `findByNamasteName`: Search for medical information by providing a NAMASTE name.
            *   `findByCondition`: Search for medical information by providing a specific medical condition.
            *   `quit`: Exit the translation tool.
        *   After a successful translation or lookup, you will be offered further options to view detailed information (`showAll`, `showNamasteName`, `showCondition`, `showDescription`), `translateAnother` code, or `quitTranslation`.
*   `logout`: Logs the current user out of the CLI.
*   `clear`: Clears the console.

### Interactive REPL Mode

If you run `index.js` without any specific commands, the CLI will enter an interactive Read-Eval-Print Loop (REPL) mode. This allows you to execute commands one by one.

*   **Starting REPL:** `./index.js`
*   **Commands in REPL:** All available commands (based on your login status or test mode) can be typed directly at the `>` prompt.
*   **Exiting REPL:** Type `quit` at the prompt.

## Authentication

The `chat` and `translate` features require user authentication. If you are not logged in, the CLI will present an initial menu with the following options:

*   `Login`: Authenticate with your AyushSync API credentials.
*   `Sign Up`: Opens the AyushSync website in your browser for new user registration. After signing up, you can return to the CLI to log in.
*   `Continue as Guest`: Allows you to proceed, but most advanced features will be locked.
*   `Enter Test Mode`: Activates test mode, granting full access to all features without requiring a login. This is ideal for development and testing.

## Example Usage

```bash
# Start the CLI in interactive REPL mode
./index.js

# Clear the console before any operation
./index.js -c

# Enable test mode and then start the REPL
./index.js --test-mode

# Directly initiate the chat feature (requires login or test mode)
./index.js chat

# Get help information about the CLI
./index.js help

# Logout from the CLI
./index.js -l
```
