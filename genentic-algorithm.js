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
  
    crossover(partner) {
      const child = new DNA();
      const midpoint = Math.floor(Math.random() * this.genes.length);
      for (let i = 0; i < this.genes.length; i++) {
        if (i > midpoint) {
          child.genes[i] = this.genes[i];
        } else {
          child.genes[i] = partner.genes[i];
        }
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
    constructor(scoreTable, mutationRate, populationSize, targetFitness) {
      this.scoreTable = scoreTable;
      this.mutationRate = mutationRate;
      this.populationSize = populationSize;
      this.targetFitness = targetFitness;
      this.population = [];
      for (let i = 0; i < this.populationSize; i++) {
        const individual = new DNA();
        console.log(`Generated individual ${i + 1}: Genes: ${individual.getGenes()}, Fitness: ${individual.getFitness(scoreTable)}`);
        this.population.push(individual);
      }
    }
  
    generate() {
        // Sort the population based on the absolute difference between fitness and targetFitness
        this.population.sort((a, b) => Math.abs(a.getFitness(this.scoreTable) - this.targetFitness) - Math.abs(b.getFitness(this.scoreTable) - this.targetFitness));
    
        this.population.forEach((individual, i) => {
          console.log(`Generation ${genCount}, Crossover process ${i + 1}: `);
          const a = Math.floor(Math.random() * this.population.length);
          const b = Math.floor(Math.random() * this.population.length);
          const partnerA = this.population[a];
          const partnerB = this.population[b];
          console.log(`Selected partners No.${a + 1} genes: ${partnerA.getGenes()} & No.${b + 1} genes: ${partnerB.getGenes()}`);
          const child = partnerA.crossover(partnerB);
          child.mutate(this.mutationRate);
          // Check if the new individual's fitness is smaller than the previous fitness
          const newFitness = child.getFitness(this.scoreTable);
          if (newFitness < individual.getFitness(this.scoreTable)) {
            individual.genes = child.genes;
            console.log(`Generated Crossover & Mutation get genes: ${individual.getGenes()}, Fitness: ${individual.getFitness(this.scoreTable)}`);
          } else {
            console.log(`Mutation skipped. Previous Fitness: ${individual.getFitness(this.scoreTable)}, New Fitness: ${newFitness}`);
          }
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
  }
  
  // Example usage:
  const scoreTable = [
    [2, 3, 4, 5, 6, 7, 8, 9, 1],
    [3, 4, 5, 6, 7, 8, 9, 1, 2],
    [4, 5, 6, 7, 8, 9, 1, 2, 3],
    [5, 6, 7, 8, 9, 1, 2, 3, 4],
    [6, 7, 8, 9, 1, 2, 3, 4, 5],
    [7, 8, 9, 1, 2, 3, 4, 5, 6],
    [8, 9, 1, 2, 3, 4, 5, 6, 7],
    [9, 1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
  ];
  
  const mutationRate = 0.1;
  const populationSize = 200;
  const targetFitness = 5; // Set your target fitness value here
  const generations = 500;

  const population = new Population(scoreTable, mutationRate, populationSize, targetFitness);
  
  let genCount = 0;
  let bestIndividual = null;
  
  while (genCount < generations) {
    population.generate();
    const currentBest = population.getBest();
    if (!bestIndividual || currentBest.getFitness(scoreTable) < bestIndividual.getFitness(scoreTable)) {
      bestIndividual = currentBest;
      console.log(`Best fitness updated at generation ${genCount}, Fitness: ${bestIndividual.getFitness(scoreTable)}, Genes: ${bestIndividual.getGenes()}`);
    }
    if (bestIndividual.getFitness(scoreTable) <= targetFitness) {
      console.log(`Target fitness(${targetFitness}) reached. Best Fitness: ${bestIndividual.getFitness(scoreTable)}, Genes: ${bestIndividual.getGenes()}`);
      break;
    }
    console.log(`Generation ${genCount}, Best Fitness: ${bestIndividual.getFitness(scoreTable)}, Genes: ${bestIndividual.getGenes()}`);
    genCount++;
  }  
  
  if (bestIndividual.getFitness(scoreTable) > targetFitness) {
    console.log(`Closest fitness(${targetFitness}): ${bestIndividual.getFitness(scoreTable)}, Genes: ${bestIndividual.getGenes()}.`);
  }

  console.log(`Generations generated: ${generations}`);
  