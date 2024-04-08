// cli.js

import { program } from 'commander';
import  profile  from "./index.js";
import chalk from 'chalk';

program
    .version('1.0.0')
    .description('A performance profiler for web applications')
    .arguments('<url>')
    .action(async (url) => {
        console.log(chalk.blue(`Profiling ${url}...`));
        const performanceTiming = await profile(url);
        console.log(chalk.green('Performance Metrics:'));
        console.log(performanceTiming);
    });

program.parse(process.argv);
