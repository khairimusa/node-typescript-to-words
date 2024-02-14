#!/usr/bin/env node
import chalk from "chalk";
import inquirer from "inquirer";
import chalkAnimation from "chalk-animation";
import { createSpinner } from "nanospinner";
import { ToWords } from "./src/ToWords.js";

let supportedLocales = ["en-US", "en-MY"];
let selectedLocale;
let numberInput;
let config;

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

async function welcome() {
  const rainbowTitle = chalkAnimation.rainbow(
    "\nNumbers to Words Converter \n"
  );

  await sleep();

  rainbowTitle.stop();

  console.log(`
  ${chalk.bgBlue("HOW TO PLAY")}
    1) Select locale & Currency
    2) Enter a number that you can think of
    3) It would output the number to words with the currency
  `);
}

async function askLocale() {
  const answers = await inquirer.prompt({
    name: "locale_currency",
    type: "list",
    message: "Select your locale",
    choices: supportedLocales,
  });

  selectedLocale = answers.locale_currency;
}

async function inputNumber() {
  const answers = await inquirer.prompt({
    name: "number",
    type: "input",
    message: "Input a number",
    validate: (input) => {
      if (Number.isNaN(+input)) {
        return "Must be a number";
      }
      return true;
    },
  });

  numberInput = answers.number;

  return convertNumber(numberInput);
}

async function convertNumber(num) {
  const spinner = createSpinner("Converting number...").start();

  await sleep();

  config = {
    localeCode: selectedLocale,
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
    },
  };

  const toWords = new ToWords(config);

  const words = toWords.convert(num);

  spinner.success({ text: `${words}` });
}

await welcome();
await askLocale();
await inputNumber();
