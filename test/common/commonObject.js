const config = require('../../config/config')

class CommonObjects {

    async getTextViewByAccessibilityId(text) {
        return $(`~${text}`);
    }

}

class CommonObjectsAndroid extends CommonObjects {
}

class CommonObjectsIos extends CommonObjects {

}

module.exports = config.getCurrentPlatform() === 'Android' ? new CommonObjectsAndroid() : new CommonObjectsIos();
