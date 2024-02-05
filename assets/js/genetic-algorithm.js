class DNA {
    constructor() {
        this.genes = this.generateUniqueGenes();
    }
  
    generateUniqueGenes() {
        let genes = [];
        for (let i = 1; i <= 9; i++) {
            genes.push(i);
        }
        // Shuffle the array
        for (let i = genes.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [genes[i], genes[j]] = [genes[j], genes[i]];
        }
        return genes;
    }
  
    crossover(partner, crossoverType) {
        const child = new DNA();
        if (crossoverType === 'singlePoint') {
            const midpoint = Math.floor(Math.random() * this.genes.length);
            for (let i = 0; i < this.genes.length; i++) {
                if (i > midpoint) {
                    child.genes[i] = this.genes[i];
                } else {
                    child.genes[i] = partner.genes[i];
                }
            }
        } else if (crossoverType === 'twoPoint') {
            const start = Math.floor(Math.random() * this.genes.length);
            const end = Math.floor(Math.random() * this.genes.length);
            for (let i = 0; i < this.genes.length; i++) {
                if (i >= start && i <= end) {
                    child.genes[i] = this.genes[i];
                } else {
                    child.genes[i] = partner.genes[i];
                }
            }
        } else {
            console.error('Invalid crossover type');
            return null;
        }
        return child;
    }
  
    mutate(mutationRate) {
        for (let i = 0; i < this.genes.length; i++) {
            if (Math.random() < mutationRate) {  
                const indexA = Math.floor(Math.random() * this.genes.length);
                const indexB = Math.floor(Math.random() * this.genes.length);
                [this.genes[indexA], this.genes[indexB]] = [this.genes[indexB], this.genes[indexA]];
            }
        }
    }
  
    getGenes() {
        return this.genes;
    }
  
    getFitness(scoreTable) {
        let totalScore = 0;
        for (let j = 0; j < this.genes.length - 1; j++) {
            const firstNumber = this.genes[j];
            const secondNumber = this.genes[j + 1];
            totalScore += scoreTable[firstNumber - 1][secondNumber - 1];
        }
        return totalScore;
    }
  }
  
  class Population {
    constructor(scoreTable, mutationRate, populationSize, targetFitness, crossoverType) {
        this.scoreTable = scoreTable;
        this.mutationRate = mutationRate;
        this.populationSize = populationSize;
        this.targetFitness = targetFitness;
        this.crossoverType = crossoverType;
        this.population = [];
        for (let i = 0; i < this.populationSize; i++) {
            const individual = new DNA();
            console.log(`Generated individual ${i + 1}: Genes: ${individual.getGenes()}, Fitness: ${individual.getFitness(scoreTable)}`);
            this.population.push(individual);
        }
    }
  
    generate(genCount) { 
      this.population.forEach((individual, i) => {
          console.log(`Generation: ${genCount + 1} ,Crossover process round ${i + 1}:`);
          const a = Math.floor(Math.random() * this.population.length);
          const b = Math.floor(Math.random() * this.population.length);
          const partnerA = this.population[a];
          const partnerB = this.population[b];
          console.log(`Selected partners No.${a + 1} genes: ${partnerA.getGenes()} & No.${b + 1} genes: ${partnerB.getGenes()}`);
          const child = partnerA.crossover(partnerB, this.crossoverType);
          console.log(`Child after crossover: ${child.getGenes()}`);
          child.mutate(this.mutationRate);
          console.log(`Mutation process: ${child.getGenes()}`);
          individual.genes = child.genes;
          const individualFitness = individual.getFitness(this.scoreTable);
          console.log(`Generated get genes: ${individual.getGenes()} Fitness:${individualFitness}`);
      });
      }
  
    getBest() {
        let bestFitness = Infinity;
        let bestIndividual = null;
        for (let i = 0; i < this.population.length; i++) {
            const fitness = this.population[i].getFitness(this.scoreTable);
            if (fitness < bestFitness) {
                bestFitness = fitness;
                bestIndividual = this.population[i];
            }
        }
        return bestIndividual;
    }
  
    getTargetFitness() {
        for (const individual of this.population) {
            if (individual.getFitness(this.scoreTable) === this.targetFitness) {
                return individual;
            }
        }
        return null;
    }
  }
  
  const scoreTable = [
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
  
  var BestFitness = null;
  var ExecutionTime = null;
  console.log("BestFitness: " + BestFitness); // for testing
  console.log("ExecutionTime: " + ExecutionTime); // for testing

  document.addEventListener("DOMContentLoaded", function () {
      const form = document.getElementById('geneticForm');
    
      form.addEventListener('submit', function (event) {
          event.preventDefault();
          const generations = parseInt(document.getElementById('generationnumber').value);
          const populationSize = parseInt(document.getElementById('populationsize').value);
          const targetFitness = parseInt(document.getElementById('fitnessfunction').value);
          const crossoverType = document.getElementById('crossover').value;
          const mutationRate = parseFloat(document.getElementById('mutation').value);
    
          if (!generations || !populationSize || !targetFitness || !crossoverType || !mutationRate) {
              alert('กรุณากรอกข้อมูลให้ครบทุกช่อง');
              return;
          }
          
          if (mutationRate < 0 || mutationRate > 1 || isNaN(mutationRate)) {
            alert("Invalid mutation rate. Please enter a value between 0 and 1.");
            return; // Exit the function
          }
    
          const startTime = performance.now(); // Record start time
    
          const population = new Population(scoreTable, mutationRate, populationSize, targetFitness, crossoverType);
    
          let genCount = 0;
          let bestIndividual = null;
          let bestOverallIndividual = null;
          let targetIndividual = null;
          let smallestBestFitness = Infinity;
          let generationWithSmallestFitness = 0;
    
          while (genCount < generations) {
            population.generate(genCount);
            const currentBest = population.getBest();
            const targetIndividual = population.getTargetFitness();
        
            console.log(`Crossover Type: ${crossoverType}, Mutation Rate: ${mutationRate},Generation: ${genCount + 1}`);
            if (!bestIndividual || currentBest.getFitness(scoreTable) < bestIndividual.getFitness(scoreTable)) {
                bestIndividual = currentBest;
            }
        
            if (currentBest.getFitness(scoreTable) < smallestBestFitness) {
                bestOverallIndividual = currentBest.getGenes()
                smallestBestFitness = currentBest.getFitness(scoreTable);
                generationWithSmallestFitness = genCount + 1;
            }

            if (targetIndividual) {
                console.log(`Target fitness(${targetFitness}) found at Generation ${genCount + 1}, Genes: ${targetIndividual.getGenes()}, Fitness: ${targetIndividual.getFitness(scoreTable)}`);
                break;
            }else{
                console.log(`Closest fitness(${targetFitness}) found in Generation ${generationWithSmallestFitness} is: Genes: ${bestOverallIndividual} , Fitness: ${smallestBestFitness}.`);
            }
            genCount++;
        }

        const endTime = performance.now(); // Record end time
        const totalTimeInSeconds = (endTime - startTime) / 1000; // Convert milliseconds to seconds
        
        BestFitness = smallestBestFitness;
        ExecutionTime = totalTimeInSeconds;

        console.log(`Best fitness found at generation ${generationWithSmallestFitness}, Genes: ${bestOverallIndividual}, Fitness: ${smallestBestFitness}`);   
        if (smallestBestFitness) {
            document.getElementById("BestFitness").innerHTML = `${BestFitness} Seconds`;
        }
        
        console.log(`Total time taken: ${totalTimeInSeconds.toFixed(2)} seconds`); 
        if (totalTimeInSeconds) {
            document.getElementById("ExecutionTime").innerHTML = `${ExecutionTime} Seconds`;
        }

        
      });
  });
  