import app from "./app.js"

const API_URL = 'http://hpb.health.gov.lk/api/get-current-statistical';
const DATE_FORMAT = 'YYYY/MM/DD hh:mm A';

const _formatDate = (dateString) => {
    return moment ? moment(dateString).format(DATE_FORMAT) : dateString;
};

/**
 * Render data in extension popup
 * @param {object} data Data from the API
 */
const _renderData = (data) => {
    const statProperties = [
        'update_date_time',
        'local_new_cases',
        'local_total_cases',
        'local_recovered',
        'local_deaths',
        'local_active_cases',
        'local_total_number_of_individuals_in_hospitals',
    ];

    statProperties.forEach((key) => {
        let value = data[key];
        if (key === 'update_date_time') {
            value = _formatDate(value);
        }
        document.querySelector(`#${key} .count`).innerHTML = value;
    });
}

/**
 * Display a spinner while loading the data from API
 */
const _loadingSpinner = () => {
    [...document.querySelectorAll('.count')].forEach(
        el => el.innerHTML = '<i class="fa fa-spinner fa-spin">');
}

/**
 * Fetch data from API
 */
const _fetchAPIData = async () => {
    try {
        const response = await fetch(API_URL)
        const { success, data } = await response.json();

        if (success) return data;
    } catch (err) {
        return false
    }
}

/**
 * Fetch data from API / local storage
 */
const _fetchData = async () => {
    let data = await module.fetchAPIData();
    if (data) return data;

    data = await app.getFromLocalStorageByKey('COVID19STATISTICS');
    if (data) return data;

    return false;
}

/**
 * Initialize extension when use clicks the icon
 */
const _init = async () => {
    _loadingSpinner();
    chrome.browserAction.setBadgeText({ text: '' });

    const data = await module.fetchData();
    if (!data) {
        return;
    }
    _renderData(data);
    app.setLocalStorageData({
        COVID19STATISTICS: data
    });
}

const module = {
    fetchAPIData: _fetchAPIData,
    fetchData: _fetchData,
    init: _init
}

export default module;