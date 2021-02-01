/**
 * Get local storage values by key
 */
const _getFromLocalStorageByKey = async(key) => {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.local.get(key, (result) => {
                resolve(result[key])
            })
        } catch (err) {
            reject(err)
        }
    })
}

const _setLocalStorageData = (data) => {
    chrome.storage.local.set(data);
}

const module = {
    getFromLocalStorageByKey: _getFromLocalStorageByKey,
    setLocalStorageData: _setLocalStorageData
}

export default module;