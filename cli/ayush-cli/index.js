#!/usr/bin/env node
/**
 * ayush-cli
 * This Cli uses AyushSync API to connect and App Indian Traditional Medicine and Modern Medicine using FHIR Resources
 *
 * @author Mayank-Jha <https://www.linkedin.com/in/mayankkumarjha07/>
 */

import { run, isTestMode } from './utils/cli.js';
import log from './utils/log.js';
import { isLoggedIn, logout } from './utils/auth.js';
import { translateNamasteToIcd11, translateIcd11ToNamaste } from './utils/code-translator.js';
import chalk from 'chalk';
import boxen from 'boxen';
import logSymbols from 'log-symbols';
import ora from 'ora';
import Table from 'cli-table3';
import enquirer from 'enquirer';
const { prompt } = enquirer;

const sleep = (ms = 2000) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
    

    let shouldQuit = false;

    while (!shouldQuit) {
        const cli = await run();

        if (!cli) {
            // This happens if the user chooses 'guest' mode and no command is provided
            // or if there's an issue with CLI initialization. We should probably exit here
            // or handle it more gracefully depending on desired behavior for 'guest' mode.
            // For now, let's assume if cli is null, we should exit.
            shouldQuit = true;
            continue;
        }
        const { flags, input, showHelp } = cli;
        const { clear, debug, l, quit } = flags;

        if (quit) {
            shouldQuit = true;
            console.log(logSymbols.info, chalk.yellow('Exiting Ayush CLI. Goodbye!'));
            break;
        }

        if (l) {
            logout();
            console.log(logSymbols.success, chalk.green.bold('You have been logged out.'));
            // After logout, the CLI should continue running, allowing other commands or re-login
            continue;
        }

        debug && log(flags);

        if(input.includes('help')){
            showHelp(0);
            continue;
        } else if (input.length === 0) {
            showHelp(0);
            continue;
        }

        if (input.includes('chat')) {
            if (!isLoggedIn() && !isTestMode) {
                console.log(logSymbols.error, chalk.red.bold('You must be logged in to use the chat feature.'));
                continue;
            }
            let keepChatting = true;
            while (keepChatting) {
                const { symptoms } = await prompt({
                    type: 'input',
                    name: 'symptoms',
                    message: `${logSymbols.info} ${chalk.cyan('Enter your symptoms:')}`,
                    result: (value) => chalk.white(value)
                });

                if (symptoms.toLowerCase() === 'quit') {
                    keepChatting = false;
                    shouldQuit = true; // Set shouldQuit to true to exit main loop
                    console.log(logSymbols.info, chalk.yellow('Exiting chat. Goodbye!'));
                    continue;
                }

                const spinner = ora(chalk.magenta('Generating diagnosis...')).start();
                await sleep();
                spinner.stop();

                const table = new Table();
                table.push(
                    { [chalk.green.bold('Diagnosis')]: chalk.white('Common Cold') },
                    {
                        [chalk.green.bold('Recommended Treatment')]:
                            chalk.white('Rest, fluids, and over-the-counter medication.')
                    },
                    { [chalk.green.bold('Datasets Used')]: chalk.white('NAMASTE, WHO TCM2') }
                );

                const diagnosis = boxen(table.toString(), {
                    title: chalk.bold.yellow('Ayush CLI Diagnosis'),
                    padding: 1,
                    margin: 1,
                    borderStyle: 'round',
                    borderColor: 'magenta'
                });

                console.log(diagnosis);

                const { continueChat } = await prompt({
                    type: 'confirm',
                    name: 'continueChat',
                    message: `${logSymbols.info} ${chalk.cyan(
                        'Do you want to enter more symptoms?'
                    )}`
                });
                keepChatting = continueChat;
                if (!keepChatting) { // If user chooses not to continue chatting
                    shouldQuit = true; // Set shouldQuit to true to exit main loop
                }
            }
        } else if (input.includes('translate')) {
            if (!isLoggedIn() && !isTestMode) {
                console.log(logSymbols.error, chalk.red.bold('You must be logged in to use the translate feature.'));
                continue;
            }

            let keepTranslating = true;
            while (keepTranslating) {
                const { translationChoice } = await prompt({
                    type: 'select',
                    name: 'translationChoice',
                    message: `${logSymbols.info} ${chalk.cyan('Choose a translation option:')}`,
                    choices: [
                        { name: 'icd11ToNamaste', message: 'ICD-11 to NAMASTE' },
                        { name: 'namasteToIcd11', message: 'NAMASTE to ICD-11' },
                        { name: 'quit', message: 'Quit' }
                    ]
                });

                let translatedEntry = null;
                let sourceCode = '';
                let targetCodeType = '';

                if (translationChoice === 'quit') { // Handle quit choice directly
                    keepTranslating = false;
                    shouldQuit = true; // Set shouldQuit to true to exit main loop
                    console.log(logSymbols.info, chalk.yellow('Exiting translation. Goodbye!'));
                    continue; // Continue to re-evaluate while loop condition
                }

                switch (translationChoice) {
                    case 'icd11ToNamaste':
                        const { icd11Code } = await prompt({
                            type: 'input',
                            name: 'icd11Code',
                            message: `${logSymbols.info} ${chalk.cyan('Enter ICD-11 code:')}`,

                        });
                        sourceCode = icd11Code;
                        targetCodeType = 'NAMASTE';
                        translatedEntry = translateIcd11ToNamaste(icd11Code);
                        break;
                    case 'namasteToIcd11':
                        const { namasteCode } = await prompt({
                            type: 'input',
                            name: 'namasteCode',
                            message: `${logSymbols.info} ${chalk.cyan('Enter NAMASTE code:')}`,

                        });
                        sourceCode = namasteCode;
                        targetCodeType = 'ICD-11';
                        translatedEntry = translateNamasteToIcd11(namasteCode);
                        break;
                }

                if (translatedEntry) {
                    console.log(logSymbols.success, chalk.green.bold(`Translation found for ${sourceCode} to ${targetCodeType}!`));
                    let showDetails = true;
                    while(showDetails) {
                        const { detailChoice } = await prompt({
                            type: 'select',
                            name: 'detailChoice',
                            message: `${logSymbols.info} ${chalk.cyan('What would you like to do next?')}`,
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
                                    margin: 1,
                                    borderStyle: 'round',
                                    borderColor: 'blue'
                                }));
                                break;
                            case 'showNamasteName':
                                console.log(boxen(`${chalk.yellow.bold('NAMASTE Name:')} ${chalk.white(translatedEntry['NAMASTE name'])}`, {
                                    title: chalk.bold.yellow('NAMASTE Name'),
                                    padding: 1,
                                    margin: 1,
                                    borderStyle: 'round',
                                    borderColor: 'green'
                                }));
                                break;
                            case 'showCondition':
                                console.log(boxen(`${chalk.yellow.bold('Condition:')} ${chalk.white(translatedEntry['Condition'])}`, {
                                    title: chalk.bold.yellow('Condition'),
                                    padding: 1,
                                    margin: 1,
                                    borderStyle: 'round',
                                    borderColor: 'red'
                                }));
                                break;
                            case 'showDescription':
                                console.log(boxen(`${chalk.yellow.bold('Description:')} ${chalk.white(translatedEntry['Description'])}`, {
                                    title: chalk.bold.yellow('Description'),
                                    padding: 1,
                                    margin: 1,
                                    borderStyle: 'round',
                                    borderColor: 'magenta'
                                }));
                                break;
                            case 'translateAnother':
                                showDetails = false; // Exit this inner loop to go back to translationChoice
                                break;
                            case 'quitTranslation':
                                showDetails = false;
                                keepTranslating = false;
                                shouldQuit = true; // Set shouldQuit to true to exit main loop
                                console.log(logSymbols.info, chalk.yellow('Exiting translation. Goodbye!'));
                                break;
                        }
                    }
                } else {
                    console.log(logSymbols.error, chalk.red.bold(`Translation not found for code: ${sourceCode}.`));
                    const { tryAgain } = await prompt({
                        type: 'confirm',
                        name: 'tryAgain',
                        message: `${logSymbols.info} ${chalk.cyan('Would you like to try translating another code?')}`
                    });
                    if (!tryAgain) {
                        keepTranslating = false;
                        shouldQuit = true; // Set shouldQuit to true to exit main loop
                        console.log(logSymbols.info, chalk.yellow('Exiting translation. Goodbye!'));
                    }
                }
            }
        }
    }
})();
