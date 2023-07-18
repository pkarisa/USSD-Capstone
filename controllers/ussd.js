
/**
 *Retrieves a session from the session store based on the session ID
 * @param {Object} sessionStore
 * @param {string} sessionId
 * @returns {Promise<object>}
 * **/
function getSession(sessionStore, sessionId) {
    return new Promise((resolve, reject) => {
        sessionStore.get(sessionId, (err, session) => {
            if (err) {
                reject(err)
            } else {
                resolve(session)
            }
        })
    })
}

/**
 *Create a session with the provided details
 * @param {Object} sessionStore
 * @param {string} sessionId
 * @param {Object} sessionObj
 * @returns {Promise}
 * **/
function setSession(sessionStore, sessionId, sessionObj) {
    return new Promise((resolve, reject) => {
        sessionStore.set(sessionId, sessionObj, (err) => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

/**
 *Processes what the user has provided
 * @param {string} userInput
 * @param {string} menu
 * @param {Object} data
 * @returns {Promise}
 * **/
async function processUSSD(userInput, menu, data) {
    try {
        const menuOption = await validateInput(menu, userInput);
        return await generateMenuResponse(
            menuOption === "invalid" ? menu : menuOption,
            menuOption === "invalid", userInput, data
        );
    } catch (error) {
        return {
            menuOption: "main",
            response: "END Error! Please try again",
            error:error
        };
    }
}

/**
 *Validate what the user has provided
 * @param {string} currentOption
 * @param {string} userInput
 * @returns {promise}
 * **/
async function validateInput(currentOption, userInput) {
    switch (currentOption) {
        case '*':
            return "askAmount";

        case 'askAmount':
            const regex = /^\d+$/;
            if (!regex.test(userInput)) {
                // Invalid input, ask again
                return 'invalid';
            }
            return "availableOffers";

        case 'availableOffers':
            switch (userInput) {
                case '0':
                    return "return";
                case '1':
                    return "confirmSelectOffer";
                case '98':
                    return "moreOffers";
            }
            return "moreOffers";

        case 'moreOffers':
            return "confirmSelectOffer";

        case 'confirmSelectOffer':
            switch (userInput) {
                case '0':
                    return "return";
                case '1':
                    return "save";
                case '2':
                    return "dont_save";
            }
    }
}
module.exports = { getSession, setSession, processUSSD };