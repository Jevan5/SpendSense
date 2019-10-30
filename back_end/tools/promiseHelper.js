const fakeError = 'HANDLED';

/**
 * Leave a promise chain early by throwing an error.
 * Catch at the end of the chain and check if the error
 * is from the result of leaving the chain purposely.
 */
function leaveChain() {
    throw new Error(fakeError);
}

/**
 * Determines if the error was as a result of leaving
 * the promise chain purposely.
 * @param {string} err Value of error.
 * @returns True if the chain was left purposely. Otherwise, false.
 */
function hasLeftChain(err) {
    return err === fakeError;
}

module.exports = {
    leaveChain: leaveChain,
    hasLeftChain: hasLeftChain
};