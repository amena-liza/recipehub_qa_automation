class Utility {

    async generateRandomNumber(minNum, maxNum) {
        var min = minNum;
        var max = maxNum;
        var randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
        return randomNum;
    }

    async roundIfFloat(value) {
        if (!isNaN(value) && value.toString().includes('.')) {
            return parseFloat(value).toFixed(2);
        }
        return value; // Return as is if it's not a float
    }

    async removeAlphabetFromString(inputText) {
        const sortedNumbers = inputText.match(/[0-9.]+/g);
        return sortedNumbers ? sortedNumbers.join('') : '';
    }

    convertTimeStampToDateString(timestamp, separator = '/'){
        const date = new Date(Number(timestamp) * 1000);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        let dateString = '';
        dateString += (day <= 9 ? `0${day}` : `${day}`);
        dateString += separator;
        dateString += (month <= 9 ? `0${month}` : `${month}`);
        dateString += `${separator}${year}`;
        return dateString;
    }

}
module.exports = new Utility();
