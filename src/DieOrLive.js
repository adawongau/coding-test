export default class DieOrLive {
    constructor() {
        this.activeArray = [];
        this.inactiveArray = [];
        this.noOfRows = 0
        this.noOfColumns = 0

    }
    patternToArray(pattern) {
        return pattern.split("\n")
    }

    converStringDatatoArr(data) {
        if (data == '')
            return []

        let tempArr = data
        let rowArr = []
        tempArr.forEach(element => {
            element = element.split("")
            let rowData = []
            if (element.length > 0) {
                element.forEach(data => {
                    if (data == 'O') rowData.push(true)
                    else
                        rowData.push(false)
                })
                rowArr.push(rowData)
            }

        })
        return rowArr
    }

    constructArr = function (data) {
        if (data == [] || data == '') {
            this.activeArray = []
            this.inactiveArray = []
            return
        }
        this.activeArray = data
        this.noOfColumns = data[0].length
        this.noOfRows = data.length
        this.inactiveArray = this.activeArray
    }

    fillingArr = function () {
        if (this.activeArray == [] || this.inactiveArray == [])
            return []

        let generatedArrRow = []

        for (let i = 0; i < this.noOfRows; i++) {
            let genArrColumn = []
            for (let j = 0; j < this.noOfColumns; j++) {
                if (this.activeArray[i][j]) {
                    genArrColumn.push(true)
                } else {
                    genArrColumn.push(false)
                }

            }
            generatedArrRow.push(genArrColumn)
        }
        return generatedArrRow
    }
    updateDataSets = function () {
        if (this.activeArray == [] || this.inactiveArray == [])
            return []

        for (let i = 0; i < this.noOfRows; i++) {
            for (let j = 0; j < this.noOfColumns; j++) {
                let state = this.updateColValue(i, j);
                this.inactiveArray[i][j] = state;
            }
        }
        this.activeArray = this.inactiveArray
    }
    setColValueHelper = function (row, col) {
        try {
            if (this.activeArray[row][col]) return 1
            else return 0;
        } catch {
            return 0;
        }
    };

    getAllNeighbours = function (row, col) {
        let allNeighbours = 0;
        allNeighbours += this.setColValueHelper(row - 1, col - 1);
        allNeighbours += this.setColValueHelper(row - 1, col);
        allNeighbours += this.setColValueHelper(row - 1, col + 1);
        allNeighbours += this.setColValueHelper(row, col - 1);
        allNeighbours += this.setColValueHelper(row, col + 1);
        allNeighbours += this.setColValueHelper(row + 1, col - 1);
        allNeighbours += this.setColValueHelper(row + 1, col);
        allNeighbours += this.setColValueHelper(row + 1, col + 1);
        return allNeighbours;
    };

    updateColValue = function (row, col) {
        const total = this.getAllNeighbours(row, col);
        if(this.activeArray[row][col]){
            if (total == 1 || total < 1) {
                return false;
            } else if (total > 3) {
                return false;
            }else  if (total === 2 || total === 3) {
                return true;
            }
        }else{
          if(total == 3){
              return true
          }
        }
    }
       
       

}