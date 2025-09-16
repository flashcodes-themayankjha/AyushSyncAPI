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
import { translateNamasteToIcd11, translateIcd11ToNamaste, findByNamasteName, findByCondition } from './utils/code-translator.js';
import chalk from 'chalk';
import boxen from 'boxen';
import logSymbols from 'log-symbols';
import ora from 'ora';
import Table from 'cli-table3';
import enquirer from 'enquirer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
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

async function handleTranslate() {
    if (!isLoggedIn() && !getTestMode()) {
        console.log(boxen(`${logSymbols.error} ${chalk.red.bold('You must be logged in to use the translate feature.')}`, { padding: 1, margin: { top: 1, bottom: 1, left: 2, right: 2 }, borderStyle: 'round', borderColor: 'red' }));
        return;
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
                { name: 'icd11ToNamaste', message: 'ICD-11 to NAMASTE' },
                { name: 'namasteToIcd11', message: 'NAMASTE to ICD-11' },
                { name: 'findByNamasteName', message: 'Find by NAMASTE name' },
                { name: 'findByCondition', message: 'Find by Condition' },
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
            case 'icd11ToNamaste':
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
                targetCodeType = 'NAMASTE';
                const spinnerIcd11ToNamaste = ora(chalk.magenta('Translating code using local mappings...')).start();
                await sleep(500); // Added artificial delay
                translatedEntry = translateIcd11ToNamaste(icd11Code);
                spinnerIcd11ToNamaste.stop();
                break;
            case 'namasteToIcd11':
                const boxedNamasteCodeMessage = `    ${logSymbols.info} ${chalk.cyan('Enter NAMASTE code:')}`;
                console.log('');
                console.log(boxedNamasteCodeMessage);
                const { namasteCode } = await prompt({
                    type: 'input',
                    name: 'namasteCode',
                    message: '>',
                    prefix: '  '
                });
                sourceCode = namasteCode;
                targetCodeType = 'ICD-11';
                const spinnerNamasteToIcd11 = ora(chalk.magenta('Translating code using local mappings...')).start();
                await sleep(500); // Added artificial delay
                translatedEntry = translateNamasteToIcd11(namasteCode);
                spinnerNamasteToIcd11.stop();
                break;
            case 'findByNamasteName':
                const boxedNamasteNameMessage = `    ${logSymbols.info} ${chalk.cyan('Enter NAMASTE name:')}`;
                console.log('');
                console.log(boxedNamasteNameMessage);
                const { namasteName } = await prompt({
                    type: 'input',
                    name: 'namasteName',
                    message: '>',
                    prefix: '  '
                });
                sourceCode = namasteName;
                targetCodeType = 'NAMASTE name';
                const spinnerFindByNamasteName = ora(chalk.magenta('Searching local mappings...')).start();
                await sleep(500); // Added artificial delay
                translatedEntry = findByNamasteName(namasteName);
                spinnerFindByNamasteName.stop();
                break;
            case 'findByCondition':
                const boxedConditionMessage = `    ${logSymbols.info} ${chalk.cyan('Enter Condition:')}`;
                console.log('');
                console.log(boxedConditionMessage);
                const { condition } = await prompt({
                    type: 'input',
                    name: 'condition',
                    message: '>',
                    prefix: '  '
                });
                sourceCode = condition;
                targetCodeType = 'Condition';
                const spinnerFindByCondition = ora(chalk.magenta('Searching local mappings...')).start();
                await sleep(500); // Added artificial delay
                const results = findByCondition(condition);
                spinnerFindByCondition.stop();
                if (results.length > 1) {
                    const boxedSelectedEntryMessage = `    Multiple matches found, please select one:`;
                    console.log('');
                    console.log(boxedSelectedEntryMessage);
                    const { selectedEntry } = await prompt({
                        type: 'select',
                        name: 'selectedEntry',
                        message: ' ',
                        prefix: '  ',
                        choices: results.map(r => ({ name: r['NAMASTE name'], message: `${r['NAMASTE name']} (${r['Condition']})` }))
                    });
                    translatedEntry = results.find(r => r['NAMASTE name'] === selectedEntry);
                } else if (results.length === 1) {
                    translatedEntry = results[0];
                } else {
                    translatedEntry = null;
                }
                break;
        }

        if (translatedEntry) {
            console.log(`    ${logSymbols.success} ${chalk.green.bold(`Translation found for ${sourceCode} to ${targetCodeType}!`)}`);
            let showDetails = true;
            while(showDetails) {
                const boxedDetailChoiceMessage = `    ${logSymbols.info} ${chalk.cyan('What would you like to do next?')}`;
                console.log('');
            console.log(boxedDetailChoiceMessage);
                const { detailChoice } = await prompt({
                    type: 'select',
                    name: 'detailChoice',
                    message: ' ',
                    prefix: '  ',
                    choices: [
                        { name: 'showAll', message: 'Show all details' },
                        { name: 'showNamasteName', message: 'Show NAMASTE Name' },
                        { name: 'showCondition', message: 'Show Condition' },
                        { name: 'showDescription', message: 'Show Description' },
                        { name: 'translateAnother', message: 'Translate another code' },
                        { name: 'quitTranslation', message: 'Quit Translation' }
                    ]
                });

                switch (detailChoice) {
                    case 'showAll':
                        const table = new Table();
                        for (const key in translatedEntry) {
                            table.push({ [chalk.yellow.bold(key)]: chalk.white(translatedEntry[key]) });
                        }
                        console.log(boxen(table.toString(), {
                            title: chalk.bold.yellow('Translation Details'),
                            padding: 1,
                            margin: { top: 1, bottom: 1, left: 2, right: 2 },
                            borderStyle: 'round',
                            borderColor: 'blue'
                        }));
                        break;
                    case 'showNamasteName':
                        console.log(boxen(`${chalk.yellow.bold('NAMASTE Name:')} ${chalk.white(translatedEntry['NAMASTE name'])}`, {
                            title: chalk.bold.yellow('NAMASTE Name'),
                            padding: 1,
                            margin: { top: 1, bottom: 1, left: 2, right: 2 },
                            borderStyle: 'round',
                            borderColor: 'green'
                        }));
                        break;
                    case 'showCondition':
                        console.log(boxen(`${chalk.yellow.bold('Condition:')} ${chalk.white(translatedEntry['Condition'])}`, {
                            title: chalk.bold.yellow('Condition'),
                            padding: 1,
                            margin: { top: 1, bottom: 1, left: 2, right: 2 },
                            borderStyle: 'round',
                            borderColor: 'red'
                        }));
                        break;
                    case 'showDescription':
                        console.log(boxen(`${chalk.yellow.bold('Description:')} ${chalk.white(translatedEntry['Description'])}`, {
                            title: chalk.bold.yellow('Description'),
                            padding: 1,
                            margin: { top: 1, bottom: 1, left: 2, right: 2 },
                            borderStyle: 'round',
                            borderColor: 'magenta'
                        }));
                        break;
                    case 'translateAnother':
                        showDetails = false;
                        break;
                    case 'quitTranslation':
                        showDetails = false;
                        keepTranslating = false;
                        break;
                }
            }
        } else {
            console.log(boxen(`${logSymbols.error} ${chalk.red.bold(`Translation not found for code: ${sourceCode.substring(0, 50)}${sourceCode.length > 50 ? '...' : ''}.`)}`, { padding: 1, margin: { top: 1, bottom: 1, left: 2, right: 2 }, borderStyle: 'round', borderColor: 'red' }));
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
