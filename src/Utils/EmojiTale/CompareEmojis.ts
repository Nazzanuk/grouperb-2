type Emoji = string;

export function compareEmojis(originalSet: Emoji[], userSet: Emoji[]): number {
  const maxLength = Math.max(originalSet.length, userSet.length);
  const minLength = Math.min(originalSet.length, userSet.length);

  const maxScorePerEmoji = 1;
  let totalScore = 0;

  for (let i = 0; i < minLength; i++) {
    const originalEmoji = originalSet[i];
    const userEmoji = userSet[i];

    if (originalEmoji === userEmoji) {
      totalScore += maxScorePerEmoji;
    } else {
      // Find the closest matching emoji and its position difference
      let minPositionDifference = maxLength;
      for (let j = 0; j < originalSet.length; j++) {
        if (originalSet[j] === userEmoji) {
          const positionDifference = Math.abs(i - j);
          if (positionDifference < minPositionDifference) {
            minPositionDifference = positionDifference;
          }
        }
      }

      // Add a partial score based on position difference
      if (minPositionDifference < maxLength) {
        const partialScore = (1 - minPositionDifference / maxLength) * maxScorePerEmoji;
        totalScore += partialScore;
      }
    }
  }

  // Calculate the accuracy as a percentage
  const accuracy = (totalScore / maxLength) * 100;

  // Return the accuracy score, rounded to the nearest whole number
  return Math.round(accuracy);
}

// Example usage:
const originalSet: Emoji[] = ["🍎", "🍊", "🍇", "🍓", "🍌"];
const userSet: Emoji[] = ["🍎", "🍌", "🍇", "🍊"];

const accuracy = compareEmojis(originalSet, userSet);
console.log(`Accuracy: ${accuracy}%`);
