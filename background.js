import stats from "./module/stats.js"
import app from "./module/app.js"

const REFRESH_ALARM = "REFRESH";
const NotificationType = {
    NewCases: 'NewCases',
    NewDeads: 'NewDeads',
    NewRecovered: 'NewRecovered',
}

const scheduleWatch = () => {
    chrome.alarms.create(REFRESH_ALARM, {
        periodInMinutes: 1
    });
};

chrome.runtime.onInstalled.addListener(() => {
    scheduleWatch();
});

/**
 * Listen to alarm 'refresh' and notify user
 */
chrome.alarms.onAlarm.addListener(({ name }) => {
    if (name === REFRESH_ALARM) {
        notify();
    }
});

const createNotification = (newCount, notificationType) => {
    const timestamp = Date.now();
    const pluralSuffix = newCount > 1 ? 's' : '';
    if (notificationType == NotificationType.NewCases) {
        const notificationObject = {
            type: 'basic',
            iconUrl: 'images/covid128.png',
            title: `UPDATE: New COVID-19 Case${pluralSuffix}`,
            message: `${newCount} new COVID-19 patient${pluralSuffix} found in Sri Lanka`
        };

        chrome.notifications.create(`NewPatients${timestamp}`, notificationObject);
        chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
        chrome.browserAction.setBadgeText({ text: `${newCount}` });
    }
    if (notificationType == NotificationType.NewDeads) {
        const notificationObject = {
            type: 'basic',
            iconUrl: 'images/covid128.png',
            title: `UPDATE: New COVID-19 Dead${pluralSuffix}`,
            message: `${newCount} new COVID-19 Dead${pluralSuffix} happened in Sri Lanka`
        };

        chrome.notifications.create(`NewDeads${timestamp}`, notificationObject);
        chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
        chrome.browserAction.setBadgeText({ text: `${newCount}` });
    }
    if (notificationType == NotificationType.NewRecovered) {
        const notificationObject = {
            type: 'basic',
            iconUrl: 'images/covid128.png',
            title: `UPDATE: New COVID-19 Recovered${pluralSuffix}`,
            message: `${newCount} new COVID-19 patient${pluralSuffix} recovered in Sri Lanka`
        };

        chrome.notifications.create(`NewDeads${timestamp}`, notificationObject);
        chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
        chrome.browserAction.setBadgeText({ text: `${newCount}` });
    }
};

/**
 * Notify user by rich notification and updating extension bubble
 */
const notify = async () => {
    const apiData = await stats.fetchAPIData();

    if (!apiData) return;

    const localData = await app.getFromLocalStorageByKey('COVID19STATISTICS');
    if (!localData) return;

    let bubbleCountCases = await app.getFromLocalStorageByKey('BUBBLECOUNTCASES');
    let bubbleCountDeads = await app.getFromLocalStorageByKey('BUBBLECOUNTDEADS');
    let bubbleCountRecovered = await app.getFromLocalStorageByKey('BUBBLECOUNTRECOVERED');

    const newCasesCount = apiData.local_total_cases - localData.local_total_cases;
    const newDeadsCount = apiData.local_deaths - localData.local_deaths;
    const newRecoveredCount = apiData.local_recovered - localData.local_recovered;
    
    bubbleCountCases = typeof bubbleCountCases === typeof undefined ? 0 : bubbleCountCases;
    bubbleCountDeads = typeof bubbleCountDeads === typeof undefined ? 0 : bubbleCountDeads;
    bubbleCountRecovered = typeof bubbleCountRecovered === typeof undefined ? 0 : bubbleCountRecovered;

    if (newCasesCount > bubbleCountCases) {

        createNotification(newCasesCount, NotificationType.NewCases);

        app.setLocalStorageData({
            BUBBLECOUNTCASES: newCasesCount,
            COVID19STATISTICS: apiData
        });
    }
    if (newDeadsCount > bubbleCountDeads) {

        createNotification(newDeadsCount, NotificationType.NewDeads);

        app.setLocalStorageData({
            BUBBLECOUNTDEADS: newDeadsCount,
            COVID19STATISTICS: apiData
        });
    }
    if (newRecoveredCount > bubbleCountRecovered) {

        createNotification(newRecoveredCount, NotificationType.NewRecovered);

        app.setLocalStorageData({
            BUBBLECOUNTRECOVERED: newRecoveredCount,
            COVID19STATISTICS: apiData
        });
    }
}