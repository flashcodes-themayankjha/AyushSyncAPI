#!/usr/bin/env node
/**
 * ayush-cli
 * This Cli uses AyushSync API to connect and App Indian Traditional Medicine and Modern Medicine using FHIR Resources
 *
 * @author Mayank-Jha <https://www.linkedin.com/in/mayankkumarjha07/>
 */

import { run, getCli } from './utils/cli.js';
import { getTestMode, setTestMode } from './utils/testModeManager.js';
import log from './utils/log.js';
import { isLoggedIn, logout } from './utils/auth.js';
import { translateTraditionalToIcd, translateIcdToTraditional, getAllConceptMaps, lookupCode, getTestMessage, getCodeSystemsOverview, getFhirCodeSystems, getFhirCodeSystemById, getDbTest, getHealthCheck } from './utils/code-translator.js';
import chalk from 'chalk';
import boxen from 'boxen';
import logSymbols from 'log-symbols';
import ora from 'ora';
import Table from 'cli-table3';
import enquirer from 'enquirer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import open from 'open';
const { prompt } = enquirer;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;

const sleep = (ms = 2000) => new Promise(resolve => setTimeout(resolve, ms));

async function handleChat() {
    if (!isLoggedIn() && !getTestMode()) {
        console.log(boxen(`${logSymbols.error} ${chalk.red.bold('You must be logged in to use the chat feature.')}`, { padding: 1, margin: { top: 1, bottom: 1, left: 2, right: 2 }, borderStyle: 'round', borderColor: 'red' }));
        return;
    }
    let keepChatting = true;
    while (keepChatting) {
        const boxedSymptomsMessage = `    ${logSymbols.info} ${chalk.cyan('Enter your symptoms:')}`;
        console.log('');
        console.log(boxedSymptomsMessage);
        const { symptoms } = await prompt({
            type: 'input',
            name: 'symptoms',
            message: '>',
            prefix: '  ',
            result: (value) => chalk.white(value)
        });

        if (symptoms.toLowerCase() === 'quit') {
            keepChatting = false;
            console.log(`    ${logSymbols.info} ${chalk.yellow('Exiting chat.')}`);
            return;
        }

        const spinner = ora(chalk.magenta('Generating diagnosis...')).start();
        await sleep();
        spinner.stop();

        const table = new Table({
            head: [chalk.green.bold('Category'), chalk.green.bold('Value')],
            wordWrap: true,
            colWidths: [30, 70] // Adjust column widths as needed
        });

        table.push(
            ['Diagnosis', 'Common Cold'],
            ['Recommended Treatment', 'Rest, fluids, and over-the-counter medication.'],
            ['Datasets Used', 'NAMASTE, WHO TCM2']
        );

        const tableString = table.toString();
            const diagnosis = boxen(tableString, {
            title: chalk.bold.yellow('Ayush CLI Diagnosis'),
            padding: 1,
            margin: { top: 1, bottom: 1, left: 2, right: 2 },
            borderStyle: 'round',
            borderColor: 'magenta'
        });

        console.log(diagnosis);

        const boxedContinueChatMessage = `    ${logSymbols.info} ${chalk.cyan('Do you want to enter more symptoms?')}`;
        console.log('');
        console.log(boxedContinueChatMessage);
        const { continueChat } = await prompt({
            type: 'confirm',
            name: 'continueChat',
            message: ' ',
            prefix: '  '
        });
        keepChatting = continueChat;
    }
}

async function openJsonInBrowser(data, filename = 'data') {
    const tempDir = path.join(__dirname, 'temp');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }

    const jsFilePath = path.join(tempDir, `${filename}.js`);
    const htmlFilePath = path.join(tempDir, `${filename}.html`);

    const seen = new WeakSet(); // Define seen here, before its first use
    fs.writeFileSync(jsFilePath, `export const data = ${JSON.stringify(data, (key, value) => {
        // Custom replacer to handle circular references for initial stringification
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return; // Circular reference found, discard key
            }
            seen.add(value);
        }
        return value;
    }, 2)};`, 'utf8');

    // No need to reset seen for the HTML stringify, as it's a separate stringify call

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${filename} Data</title>
    <style>
        body { font-family: monospace; background-color: #1e1e1e; color: #d4d4d4; padding: 20px; }
        pre { background-color: #2d2d2d; padding: 15px; border-radius: 5px; overflow-x: auto; }
        h1 { color: #569cd6; }
    </style>
</head>
<body>
    <h1>${filename} Data</h1>
    <pre id="json-data"></pre>
    <script type="module">
        import { data } from './${filename}.js';
        document.getElementById('json-data').textContent = JSON.stringify(data, null, 2);
    </script>
</body>
</html>
    `;
    fs.writeFileSync(htmlFilePath, htmlContent, 'utf8');

    console.log(boxen(`${logSymbols.info} ${chalk.blue.bold(`Opening ${filename} data in your browser: file://${htmlFilePath}`)}`, { padding: 1, margin: { top: 1, bottom: 1, left: 2, right: 2 }, borderStyle: 'round', borderColor: 'blue' }));
    await open(htmlFilePath);

    // Clean up temporary files after a short delay
    setTimeout(() => {
        fs.unlink(jsFilePath, (err) => {
            if (err) console.error('Error deleting temporary JS file:', err);
        });
        fs.unlink(htmlFilePath, (err) => {
            if (err) console.error('Error deleting temporary HTML file:', err);
        });
    }, 5000); // Delete after 5 seconds
}

async function handleTranslate() {
    if (!isLoggedIn() && !getTestMode()) {
        console.log(boxen(`${logSymbols.error} ${chalk.red.bold('You must be logged in to use the translate feature.')}`, { padding: 1, margin: { top: 1, bottom: 1, left: 2, right: 2 }, borderStyle: 'round', borderColor: 'red' }));
        return;
    }

    const testMessage = await getTestMessage();
    if (testMessage) {
        console.log(boxen(chalk.green(testMessage), { padding: 1, margin: { top: 1, bottom: 1, left: 2, right: 2 }, borderStyle: 'round', borderColor: 'green' }));
    }

    let keepTranslating = true;
    while (keepTranslating) {
        const boxedTranslationChoiceMessage = `    ${logSymbols.info} ${chalk.cyan('Choose a translation or lookup option:')}`;
        console.log('');
    console.log(boxedTranslationChoiceMessage);
        const { translationChoice } = await prompt({
            type: 'select',
            name: 'translationChoice',
            message: ' ',
            prefix: '  ',
            choices: [
                { name: 'icdToTraditional', message: 'ICD-11 to Traditional' },
                { name: 'traditionalToIcd', message: 'Traditional to ICD-11' },
                { name: 'lookup', message: 'Lookup a code' },
                { name: 'getCodeSystemsOverview', message: 'Get All CodeSystems Overview' },
                { name: 'getFhirCodeSystems', message: 'Get All FHIR CodeSystems' },
                { name: 'getFhirCodeSystemById', message: 'Get FHIR CodeSystem by ID' },
                { name: 'getDbTest', message: 'Test Database Connection' },
                { name: 'getHealthCheck', message: 'Health Check' },
                { name: 'quit', message: 'Quit' }
            ]
        });

        if (translationChoice === 'quit') {
            keepTranslating = false;
            console.log(`    ${logSymbols.info} ${chalk.yellow('Exiting translation.')}`);
            return;
        }

        let translatedEntry = null;
        let sourceCode = '';
        let targetCodeType = '';

        switch (translationChoice) {
            case 'icdToTraditional':
                const boxedIcd11CodeMessage = `    ${logSymbols.info} ${chalk.cyan('Enter ICD-11 code:')}`;
                console.log('');
                console.log(boxedIcd11CodeMessage);
                const { icd11Code } = await prompt({
                    type: 'input',
                    name: 'icd11Code',
                    message: '>',
                    prefix: '  '
                });
                sourceCode = icd11Code;
                targetCodeType = 'Traditional';
                const spinnerIcd11ToNamaste = ora(chalk.magenta('Translating code using Ayush API...')).start();
                translatedEntry = await translateIcdToTraditional(icd11Code);
                spinnerIcd11ToNamaste.stop();
                break;
            case 'traditionalToIcd':
                const boxedNamasteCodeMessage = `    ${logSymbols.info} ${chalk.cyan('Enter Traditional code (e.g., NAMC:AAB-52):')}`;
                console.log('');
                console.log(boxedNamasteCodeMessage);
                const { traditionalCode } = await prompt({
                    type: 'input',
                    name: 'traditionalCode',
                    message: '>',
                    prefix: '  '
                });
                sourceCode = traditionalCode;
                targetCodeType = 'ICD-11';
                const spinnerNamasteToIcd11 = ora(chalk.magenta('Translating code using Ayush API...')).start();
                translatedEntry = await translateTraditionalToIcd(traditionalCode);
                spinnerNamasteToIcd11.stop();
                break;
            case 'lookup':
                const boxedSystemMessage = `    ${logSymbols.info} ${chalk.cyan('Enter system URL:')}`;
                console.log('');
                console.log(boxedSystemMessage);
                const { system } = await prompt({
                    type: 'input',
                    name: 'system',
                    message: '>',
                    prefix: '  '
                });
                const boxedCodeMessage = `    ${logSymbols.info} ${chalk.cyan('Enter code:')}`;
                console.log('');
                console.log(boxedCodeMessage);
                const { code } = await prompt({
                    type: 'input',
                    name: 'code',
                    message: '>',
                    prefix: '  '
                });
                sourceCode = code;
                targetCodeType = 'Lookup';
                const spinnerLookup = ora(chalk.magenta('Looking up code using Ayush API...')).start();
                translatedEntry = await lookupCode(system, code);
                spinnerLookup.stop();
                break;
            case 'getAll':
                const spinnerGetAll = ora(chalk.magenta('Getting all concept maps using Ayush API...')).start();
                translatedEntry = await getAllConceptMaps();
                spinnerGetAll.stop();
                break;
            case 'getCodeSystemsOverview':
                const spinnerCodeSystemsOverview = ora(chalk.magenta('Getting code systems overview...')).start();
                translatedEntry = await getCodeSystemsOverview();
                spinnerCodeSystemsOverview.stop();
                break;
            case 'getFhirCodeSystems':
                const spinnerFhirCodeSystems = ora(chalk.magenta('Getting FHIR code systems...')).start();
                translatedEntry = await getFhirCodeSystems();
                spinnerFhirCodeSystems.stop();
                break;
            case 'getFhirCodeSystemById':
                const { fhirCodeSystemId } = await prompt({
                    type: 'input',
                    name: 'fhirCodeSystemId',
                    message: 'Enter FHIR CodeSystem ID:'
                });
                const spinnerFhirCodeSystemById = ora(chalk.magenta(`Getting FHIR code system by ID ${fhirCodeSystemId}...`)).start();
                translatedEntry = await getFhirCodeSystemById(fhirCodeSystemId);
                spinnerFhirCodeSystemById.stop();
                break;
            case 'getDbTest':
                const spinnerDbTest = ora(chalk.magenta('Testing database connection...')).start();
                translatedEntry = await getDbTest();
                spinnerDbTest.stop();
                break;
            case 'getHealthCheck':
                const spinnerHealthCheck = ora(chalk.magenta('Running health check...')).start();
                translatedEntry = await getHealthCheck();
                spinnerHealthCheck.stop();
                break;
        }

        const displayResults = (entry, choice) => {
            if (!entry || (Array.isArray(entry) && entry.length === 0) || (typeof entry === 'object' && Object.keys(entry).length === 0)) {
                return false;
            }

            if (choice === 'getAll') {
                console.log(`    ${logSymbols.success} ${chalk.green.bold(`Concept Maps found!`)}`);
                const table = new Table({
                    head: [chalk.green.bold('ID'), chalk.green.bold('Name'), chalk.green.bold('Description')],
                    wordWrap: true,
                });
                const rows = [];
                entry.forEach(conceptMap => {
                    const name = conceptMap.title || conceptMap.name || '';
                    const description = conceptMap.description || '';

                    if (!name && !description) {
                        // If name and description are missing, offer to open in browser
                        openJsonInBrowser(conceptMap, `conceptmap-${conceptMap.id || 'details'}`);
                        rows.push([
                            conceptMap.id || '',
                            '(Details opened in browser)',
                            ''
                        ]);
                    } else {
                        rows.push([
                            conceptMap.id || '',
                            name,
                            description
                        ]);
                    }
                });
                const truncatedRows = rows.slice(0, 10);
                truncatedRows.forEach(row => table.push(row));

                console.log(boxen(table.toString(), {
                    title: chalk.bold.yellow('Concept Maps Overview'),
                    padding: 1,
                    margin: { top: 1, bottom: 1, left: 2, right: 2 },
                    borderStyle: 'round',
                    borderColor: 'blue'
                }));
                if (rows.length > 10) {
                    console.log(chalk.yellow.bold(`\n    Showing 10 of ${rows.length} results. Use 'Get FHIR CodeSystem by ID' to view full details.`));
                }
            }
            else if (Array.isArray(entry)) {
                console.log(`    ${logSymbols.success} ${chalk.green.bold(
`Translation found for ${sourceCode}!`
)}`);
                const table = new Table({
                    head: [chalk.green.bold('Traditional Code'), chalk.green.bold('Traditional Display'), chalk.green.bold('ICD Code'), chalk.green.bold('System')],
                    wordWrap: true,
                });
                const truncatedEntries = entry.slice(0, 10);
                truncatedEntries.forEach(e => {
                    table.push([e.traditionalCode, e.traditionalDisplay, e.icdCode, e.system]);
                });
                console.log(boxen(table.toString(), {
                    title: chalk.bold.yellow('Translation Details'),
                    padding: 1,
                    margin: { top: 1, bottom: 1, left: 2, right: 2 },
                    borderStyle: 'round',
                    borderColor: 'blue'
                }));
                if (entry.length > 10) {
                    console.log(chalk.yellow.bold(`
    Showing 10 of ${entry.length} results.`));
                }
            } else {
                console.log(`    ${logSymbols.success} ${chalk.green.bold(
`Translation found for ${sourceCode}!`
)}`);
                const table = new Table({
                    head: [chalk.green.bold('Key'), chalk.green.bold('Value')],
                    wordWrap: true,
                    colWidths: [30, 70]
                });
                for (const key in entry) {
                    if (typeof entry[key] === 'object' && entry[key] !== null) {
                        table.push([chalk.yellow.bold(key), JSON.stringify(entry[key], null, 2)]);
                    } else {
                        table.push([chalk.yellow.bold(key), chalk.white(entry[key])]);
                    }
                }
                console.log(boxen(table.toString(), {
                    title: chalk.bold.yellow('Details'),
                    padding: 1,
                    margin: { top: 1, bottom: 1, left: 2, right: 2 },
                    borderStyle: 'round',
                    borderColor: 'blue'
                }));
            }
            return true;
        }

        if (!displayResults(translatedEntry, translationChoice)) {
            if (translationChoice === 'traditionalToIcd' || translationChoice === 'icdToTraditional') {
                const csvPath = path.join(__dirname, 'map.csv');
                if (fs.existsSync(csvPath)) {
                    const csvData = fs.readFileSync(csvPath, 'utf8');
                    const rows = csvData.split('\n').slice(1);
                    const mappings = rows.map(row => {
                        const [traditional_code, icd_code] = row.split(',');
                        return { traditional_code, icd_code };
                    });

                    const foundMapping = mappings.find(m => m.traditional_code === sourceCode || m.icd_code === sourceCode);

                    if (foundMapping) {
                        displayResults(foundMapping);
                    } else {
                        console.log(boxen(`${logSymbols.error} ${chalk.red.bold(`Translation not found for code: ${sourceCode.substring(0, 50)}${sourceCode.length > 50 ? '...' : ''}.`)}`, { padding: 1, margin: { top: 1, bottom: 1, left: 2, right: 2 }, borderStyle: 'round', borderColor: 'red' }));
                    }
                } else {
                    console.log(boxen(`${logSymbols.error} ${chalk.red.bold(`Translation not found for code: ${sourceCode.substring(0, 50)}${sourceCode.length > 50 ? '...' : ''}.`)}`, { padding: 1, margin: { top: 1, bottom: 1, left: 2, right: 2 }, borderStyle: 'round', borderColor: 'red' }));
                }
            } else {
                console.log(boxen(`${logSymbols.error} ${chalk.red.bold(`No results found.`)}`, { padding: 1, margin: { top: 1, bottom: 1, left: 2, right: 2 }, borderStyle: 'round', borderColor: 'red' }));
            }
        }
        const boxedTryAgainMessage = `    ${logSymbols.info} ${chalk.cyan('Would you like to try translating another code?')}`;
        console.log('');
        console.log(boxedTryAgainMessage);
        const { tryAgain } = await prompt({
            type: 'confirm',
            name: 'tryAgain',
            message: ' ',
            prefix: '  '
        });
        if (!tryAgain) {
            keepTranslating = false;
        }
    }
}

async function startRepl() {
    const cli = getCli(isLoggedIn() || getTestMode());

    console.log('    Type "help" for a list of commands.');

    let keepRunning = true;
    while (keepRunning) {
        const { command } = await prompt({
            type: 'input',
            name: 'command',
            message: '>',
            prefix: '  '
        });

        const [cmd, ...args] = command.trim().split(' ');

        switch (cmd) {
            case 'chat':
                await handleChat();
                break;
            case 'translate':
                await handleTranslate();
                break;
            case 'help':
                console.log(`    ${cli.help}`);
                break;
            case 'login':
                await login();
                break;
            case 'register':
                await register();
                break;
            case 'logout':
                logout();
                console.log(`    ${logSymbols.success} ${chalk.green.bold('You have been logged out.')}`);
                break;
            case 'quit':
                keepRunning = false;
                console.log(''); // Top margin
                console.log(`    ${logSymbols.info} ${chalk.yellow(`Exiting Ayush CLI v${version}. Goodbye!`)}`);
                console.log(''); // Bottom margin
                break;
            case 'clear':
                console.clear();
                break;
            case '':
                break;
            default:
                console.log(boxen(`${logSymbols.error} ${chalk.red.bold(`Unknown command: ${cmd}. Type "help" for a list of commands.`)}`, { padding: 1, margin: { top: 1, bottom: 1, left: 2, right: 2 }, borderStyle: 'round', borderColor: 'red' }));
        }
    }
}

(async () => {
    // Manual check for --test-mode or -t flag at the very beginning
    const args = process.argv.slice(2);
    if (args.includes('--test-mode') || args.includes('-t')) {
        setTestMode(true);
        console.log('index.js: Test Mode enabled via manual argv check.');
    }

    const cli = await run(); // from utils/cli.js

    if (cli) {
        const { input, flags } = cli;
        if (flags.clear) {
            console.clear();
        }

        if (input.length > 0) {
            // if user passed a command directly, execute it and exit (old behavior)
            if (input.includes('chat')) {
                await handleChat();
            } else if (input.includes('translate')) {
                await handleTranslate();
            } else if (input.includes('help')) {
                cli.showHelp(0);
            }
        } else {
            // if no command is passed, start the REPL
            await startRepl();
        }
    }
})();
