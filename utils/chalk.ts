import chalk from 'chalk';

export const success = (param: any) => console.log(chalk.bgGreen(param));
export const fail = (param: any) => console.log(chalk.bgRedBright(param));
export const db = (param: any) => console.log(chalk.bgBlueBright(param));
