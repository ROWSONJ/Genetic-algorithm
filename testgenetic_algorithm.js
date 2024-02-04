class DNA {
  constructor() {
    this.genes = this.generateUniqueGenes();
  }

  generateUniqueGenes() {
    let genes = Array.from({ length: 9 }, (_, i) => i + 1);
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
      child.genes[i] = i > midpoint ? this.genes[i] : partner.genes[i];
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
  constructor(scoreTable, mutationRate, populationSize, targetFitness, generationsCount) {
    this.scoreTable = scoreTable;
    this.mutationRate = mutationRate;
    this.populationSize = populationSize;
    this.targetFitness = targetFitness;
    this.population = [];
    this.generationsCount = generationsCount;

    for (let i = 0; i < this.populationSize; i++) {
      const individual = new DNA();
      console.log(`Generated individual ${i + 1}: Genes: ${individual.getGenes()}, Fitness: ${individual.getFitness(scoreTable)}`);
      this.population.push(individual);
    }
  }

  generate() {
    this.population.sort((a, b) => Math.abs(a.getFitness(this.scoreTable) - this.targetFitness) - Math.abs(b.getFitness(this.scoreTable) - this.targetFitness));

    this.population.forEach((individual, i) => {
      console.log(`Generation ${this.generationsCount}, Crossover process ${i + 1}: `);
      const a = Math.floor(Math.random() * this.population.length);
      const b = Math.floor(Math.random() * this.population.length);
      const partnerA = this.population[a];
      const partnerB = this.population[b];
      console.log(`Selected partners No.${a + 1} genes: ${partnerA.getGenes()} & No.${b + 1} genes: ${partnerB.getGenes()}`);
      const child = partnerA.crossover(partnerB);
      child.mutate(this.mutationRate);
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

  updateChart() {
    const currentBest = this.getBest();
    generationsChart.data.labels.push(`Gen ${this.generationsCount + 1}`);
    generationsChart.data.datasets[0].data.push(currentBest.getFitness(scoreTable));
    generationsChart.update();
  }

  updateIndividualComparisonChart() {
    const labels = Array.from({ length: this.populationSize }, (_, i) => `Ind ${i + 1}`);
    const data = this.population.map(individual => individual.getFitness(scoreTable));

    individualComparisonChart.data.labels = labels;
    individualComparisonChart.data.datasets[0].data = data;
    individualComparisonChart.update();
  }
}

// Charts setup
const ctx = document.getElementById('generationsChart').getContext('2d');
const generationsChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Best Fitness',
      borderColor: 'blue',
      backgroundColor: 'rgba(0, 123, 255, 0.2)',
      data: [],
    }],
  },
  options: {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Generations',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Fitness',
        },
      },
    },
  },
});

const individualComparisonCtx = document.getElementById('individualComparisonChart').getContext('2d');
const individualComparisonChart = new Chart(individualComparisonCtx, {
  type: 'bar',
  data: {
    labels: [],
    datasets: [{
      label: 'Fitness',
      backgroundColor: 'rgba(0, 123, 255, 0.5)',
      borderColor: 'blue',
      borderWidth: 1,
      data: [],
    }],
  },
  options: {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Individuals',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Fitness',
        },
      },
    },
  },
});

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
const populationSize = 100;
const targetFitness = 5;
const generations = 100;

let generationsCount = 0;
let bestIndividual = null;

const population = new Population(scoreTable, mutationRate, populationSize, targetFitness, generationsCount);

while (generationsCount < generations) {
  population.generate();
  const currentBest = population.getBest();

  if (!bestIndividual || currentBest.getFitness(scoreTable) < bestIndividual.getFitness(scoreTable)) {
    bestIndividual = currentBest;
    updateBestInfo();
  }

  if (bestIndividual.getFitness(scoreTable) <= targetFitness) {
    updateBestInfo();
    break;
  }

  population.generationsCount = generationsCount;  // Update generationsCount in the Population instance
  updateGenerationsInfo();
  generationsCount++;
}

if (bestIndividual.getFitness(scoreTable) > targetFitness) {
  console.log(`Closest fitness(${targetFitness}): ${bestIndividual.getFitness(scoreTable)}, Genes: ${bestIndividual.getGenes()}.`);
}

console.log(`Generations generated: ${generationsCount}`);

function updateBestInfo() {
  document.getElementById('bestFitness').innerText = `Fitness: ${bestIndividual.getFitness(scoreTable)}`;
  document.getElementById('bestGenes').innerText = `Genes: ${bestIndividual.getGenes()}`;
}

function updateGenerationsInfo() {
  population.updateChart();
  population.updateIndividualComparisonChart();
  const listItem = document.createElement('li');
  listItem.className = 'list-group-item';
  listItem.innerText = `Generation ${generationsCount + 1}, Best Fitness: ${bestIndividual.getFitness(scoreTable)}, Genes: ${bestIndividual.getGenes()}`;
  document.getElementById('generationsList').appendChild(listItem);
}
