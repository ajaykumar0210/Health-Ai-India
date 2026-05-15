/**
 * Singleton to hold Firebase phone confirmation result between screens.
 * Firebase's ConfirmationResult object cannot be passed as a navigation param
 * (not serializable), so we store it here.
 */
let phoneConfirmation = null;

export const setPhoneConfirmation = (c) => { phoneConfirmation = c; };
export const getPhoneConfirmation = () => phoneConfirmation;
export const clearPhoneConfirmation = () => { phoneConfirmation = null; };
