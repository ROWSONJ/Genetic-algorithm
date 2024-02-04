function getFitness(row, scoreTable) {
    let totalScore = 0;
    for (let i = 0; i < row.length - 1; i++) {
        const firstNumber = row[i];
        const secondNumber = row[i + 1];
        totalScore += scoreTable[firstNumber - 1][secondNumber - 1];
    }
    return totalScore;
}

function generateRandomRow() {
    var numbers = Array.from({ length: 9 }, (_, index) => index + 1);
    numbers.sort(() => Math.random() - 0.5);
    return numbers;
}

function detectPairs(row) {
    var pairs = [];
    for (var i = 0; i < row.length - 1; i++) {
        pairs.push([row[i], row[i + 1]]);
    }
    return pairs;
}

function crossoverParents_Single(parent1, parent2) {
    var crossoverPoint = 3; // ตำแหน่งที่จะทำการ crossover
    var Singlechild1 = parent1.slice(0, crossoverPoint).concat(parent2.slice(crossoverPoint));
    var Singlechild2 = parent2.slice(0, crossoverPoint).concat(parent1.slice(crossoverPoint));

    return [Singlechild1, Singlechild2];
}

function crossoverParents_Two(parent1, parent2) {
    var crossoverPoint1 = 3; // ตำแหน่งที่จะทำการ crossover ครั้งที่ 1
    var crossoverPoint2 = 7; // ตำแหน่งที่จะทำการ crossover ครั้งที่ 2

    // สร้าง child1 โดยตัดจาก parent1 3 ตำแหน่งแรก และเอา parent2 ตำแหน่ง 4 ถึง 7 มาต่อท้าย และ parent1 ตำแหน่ง 8 ถึง 9
    var child1 = parent1.slice(0, crossoverPoint1).concat(parent2.slice(crossoverPoint1, crossoverPoint2), parent1.slice(crossoverPoint2));

    // สร้าง child2 โดยตัดจาก parent2 3 ตำแหน่งแรก และเอา parent1 ตำแหน่ง 4 ถึง 7 มาต่อท้าย และ parent2 ตำแหน่ง 8 ถึง 9
    var child2 = parent2.slice(0, crossoverPoint1).concat(parent1.slice(crossoverPoint1, crossoverPoint2), parent2.slice(crossoverPoint2));

    return [child1, child2];
}

// ฟังก์ชัน mutation
function mutation(child) {
    var position1 = 6;  // ตำแหน่งที่จะสลับ
    var position2 = 2;  // ตำแหน่งที่จะสลับ

    // สลับค่าที่ตำแหน่ง 3 และ 7
    var temp = child[position1];
    child[position1] = child[position2];
    child[position2] = temp;

    return child;
}

function generateRows() {
    var targetFitness = parseInt(document.getElementById("targetFitness").value);
    var numRows = parseInt(document.getElementById("numRows").value);
    var outputElement = document.getElementById("output");
    outputElement.innerHTML = "";

    var scoreTable = [
        [1, 2, 3, 4, 5, 4, 3, 2, 1],
        [2, 3, 4, 5, 6, 5, 4, 3, 2],
        [3, 4, 5, 6, 7, 6, 5, 4, 3],
        [4, 5, 6, 7, 8, 7, 6, 5, 4],
        [5, 6, 7, 8, 9, 8, 7, 6, 5],
        [4, 5, 6, 7, 8, 7, 6, 5, 4],
        [3, 4, 5, 6, 7, 6, 5, 4, 3],
        [2, 3, 4, 5, 6, 5, 4, 3, 2],
        [1, 2, 3, 4, 5, 4, 3, 2, 1],
    ];

    var bestFitnessScore = 0;
    var bestFitnessRow;
    var bestFitnessRowNumber;  // เพิ่มตัวแปรนี้
    var secondBestFitnessScore = 0;
    var secondBestFitnessRow;
    var secondBestFitnessRowNumber;  // เพิ่มตัวแปรนี้
    
    for (var j = 1; j <= numRows; j++) {
        var randomRow = generateRandomRow();
        var rowSum = randomRow.reduce((acc, num) => acc + num, 0);
        var pairs = detectPairs(randomRow);
        var fitnessScore = getFitness(randomRow, scoreTable);

        if (Math.abs(fitnessScore - targetFitness) < Math.abs(bestFitnessScore - targetFitness)) {
            // ขยับข้อมูลจากอันดับที่ 2 ไปอันดับที่ 1
            secondBestFitnessScore = bestFitnessScore;
            secondBestFitnessRow = bestFitnessRow;
            secondBestFitnessRowNumber = bestFitnessRowNumber;

            bestFitnessScore = fitnessScore;
            bestFitnessRow = randomRow;
            bestFitnessRowNumber = j;  // เก็บข้อมูลของแถวที่ดีที่สุด
        } else if (Math.abs(fitnessScore - targetFitness) < Math.abs(secondBestFitnessScore - targetFitness)) {
            // ข้อมูลที่ดีที่สุดที่ 2
            secondBestFitnessScore = fitnessScore;
            secondBestFitnessRow = randomRow;
            secondBestFitnessRowNumber = j;  // เก็บข้อมูลของแถวที่ 2 ที่ดีที่สุด
        }

        outputElement.innerHTML += "Row " + j + ": " + randomRow.join(', ') + " (Pairs: " + JSON.stringify(pairs) + ", Fitness Score: " + fitnessScore + ")<br>";
    }

    // แสดง bestFitnessRow และ secondBestFitnessRow
    if (bestFitnessRow) {
        var bestFitnessRowSum = bestFitnessRow.reduce((acc, num) => acc + num, 0);
        var bestFitnessPairs = detectPairs(bestFitnessRow);
        outputElement.innerHTML += "<br>Best Fitness Row (Row " + bestFitnessRowNumber + "): " + bestFitnessRow.join(', ') + " (Row Sum: " + bestFitnessRowSum + ", Pairs: " + JSON.stringify(bestFitnessPairs) + ", Fitness Score: " + bestFitnessScore + ")<br>";

        // แสดง secondBestFitnessRow
        if (secondBestFitnessRow) {
            var secondBestFitnessRowSum = secondBestFitnessRow.reduce((acc, num) => acc + num, 0);
            var secondBestFitnessPairs = detectPairs(secondBestFitnessRow);
            outputElement.innerHTML += "Second Best Fitness Row (Row " + secondBestFitnessRowNumber + "): " + secondBestFitnessRow.join(', ') + " (Row Sum: " + secondBestFitnessRowSum + ", Pairs: " + JSON.stringify(secondBestFitnessPairs) + ", Fitness Score: " + secondBestFitnessScore + ")<br>";
        }
    }

    
    
    ////////////////////////////////////////////////////////////////////////////////////

    // Single Crossover
    var crossoverResultSingle = crossoverParents_Single(bestFitnessRow, secondBestFitnessRow);
    var Singlechild1 = crossoverResultSingle[0];
    var Singlechild2 = crossoverResultSingle[1];

    // Two Crossover
    var crossoverResultTwo = crossoverParents_Two(bestFitnessRow, secondBestFitnessRow);
    var child1 = crossoverResultTwo[0];
    var child2 = crossoverResultTwo[1];

    // แสดงผลลัพธ์ crossover
    outputElement.innerHTML += "<br>Single Crossover Result:<br>";
    outputElement.innerHTML += "Child 1: " + Singlechild1.join(', ') + " (Fitness Score: " + getFitness(Singlechild1, scoreTable) + ")<br>";
    outputElement.innerHTML += "Child 2: " + Singlechild2.join(', ') + " (Fitness Score: " + getFitness(Singlechild2, scoreTable) + ")<br>";

    outputElement.innerHTML += "<br>Two Crossover Result:<br>";
    outputElement.innerHTML += "Child 1: " + child1.join(', ') + " (Fitness Score: " + getFitness(child1, scoreTable) + ")<br>";
    outputElement.innerHTML += "Child 2: " + child2.join(', ') + " (Fitness Score: " + getFitness(child2, scoreTable) + ")<br>";


    ////////////////////////////////////////////////////////////////////////////////////
    /*<<<<<<<<<<<<<<<<<<<<<<<<mutation>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/


    Singmutation_child1 = mutation(Singlechild1);
    Singmutation_child2 = mutation(Singlechild2);
    var Singmutation1Fitness = getFitness(Singmutation_child1, scoreTable);
    var Singmutation2Fitness = getFitness(Singmutation_child2, scoreTable);

    Twomutation_child1 = mutation(child1);
    Twomutation_child2 = mutation(child2);
    var Twomutation1Fitness = getFitness(Twomutation_child1, scoreTable);
    var Twomutation2Fitness = getFitness(Twomutation_child2, scoreTable);

    // แสดงผลลัพธ์ mutation
    outputElement.innerHTML += "<br>Single Mutation Result:<br>";
    outputElement.innerHTML += "Mutated Child 1: " + Singmutation_child1.join(', ') + " (Fitness Score: " + Singmutation1Fitness + ")<br>";
    outputElement.innerHTML += "Mutated Child 2: " + Singmutation_child2.join(', ') + " (Fitness Score: " + Singmutation2Fitness + ")<br>";

    outputElement.innerHTML += "<br>Two Mutation Result:<br>";
    outputElement.innerHTML += "Mutated Child 1: " + Twomutation_child1.join(', ') + " (Fitness Score: " + Twomutation1Fitness + ")<br>";
    outputElement.innerHTML += "Mutated Child 2: " + Twomutation_child2.join(', ') + " (Fitness Score: " + Twomutation2Fitness + ")<br>";

}