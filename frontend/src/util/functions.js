export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const classJoin = (...classes) => classes.join(' ')