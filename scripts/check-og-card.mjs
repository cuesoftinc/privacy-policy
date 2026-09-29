import { verifyCard } from './generate-og-image.mjs';

const problems = await verifyCard();
for (const problem of problems) console.error(`og card: ${problem}`);
if (problems.length > 0) process.exit(1);
console.log('og card: current');
