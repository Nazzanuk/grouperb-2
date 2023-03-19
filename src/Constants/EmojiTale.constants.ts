import toArray from 'lodash/toArray';

function reorderAndRemoveDuplicates(inputArray: string[]): string[] {
  // Sort the array based on Unicode code points
  inputArray.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

  // Remove duplicates
  const uniqueArray: string[] = Array.from(new Set(inputArray));

  // Join the unique and sorted array back into a string
  return uniqueArray;
}

export const EmojiList = toArray(
  `🐈🔍🌍🕵️‍♂️🐾😼✅📍📚🔐🚗🛸👽🔧🚀🎤🌌😆🎉🌠🐧🏜️🍦🎬🌟📺😂🌴🐪🍨🌱🥕🍅🏆🗣️🎉🚣‍♀️🌊😁🏁🌕🏨💰🧘‍♀️🌟🥘🚀🌎🤳🌌🐶🏔️🧗‍♂️😨🦮🧣🏅🌐🐾💪🐜🎻🎺🪕🎼🦟🐝🕷️🎶📆🦎🎭🕵️‍♂️🔎🏞️🏢🛋️😅📝🎖️🐙🎨🖌️🌊🖼️🐠🐡🦈⭐🐚⌛🕺🔙🕶️💃👾🚀🎵🌐🎊🐌🎒🌏🌁🗺️⏳🏞️🏰📜🦜🚶‍♀️🎩🦜🐿️🦝🗣️💬👑😄🏘️🚗🛸👽🔧🚀🎤🌌😆🎉🌠👨‍🔬🔧🤖🍞😒❄️🗣️🌡️🎭🛠️🌱🥕🍅🏆🗣️🎉🚣‍♀️🌊😁🏁🐧🏜️🍦🎬🌟📺😂🌴🐪🍨🐈🔍🌍🕵️‍♂️🐾😼✅📍📚🔐🐘😄💨🎈🏙️🌄🎉🧼🌈🌍`,
);

export const orderedEmojis = reorderAndRemoveDuplicates(EmojiList);

export const Tales = [
  {
    story:
      'Sarah found a peculiar hat at a flea market that granted her the ability to understand animals. She quickly became the neighborhood gossip queen, learning juicy secrets from chatty birds, mischievous squirrels, and the occasional nosy raccoon.',
    solution: `🚶‍♀️🎩🦜🐿️🦝🗣️💬👑😄🏘️`,
  },
  {
    story:
      'Clara discovered a hidden talent for growing enormous vegetables in her garden. Her colossal carrots and titanic tomatoes became the talk of the town, eventually leading to a wildly popular annual event: the Great Veggie Raft Race.',
    solution: `🌱🥕🍅🏆🗣️🎉🚣‍♀️🌊😁🏁`,
  },
  {
    story:
      'In a bizarre twist of fate, a group of penguins somehow found themselves in the Sahara Desert. Adapting to their new environment, they opened a successful ice cream stand, becoming local celebrities and starring in their own reality TV show.',
    solution: `🐧🏜️🍦🎬🌟📺😂🌴🐪🍨`,
  },
  {
    story:
      "John's car broke down in the middle of nowhere, only to be rescued by a group of aliens on a road trip. They fixed his car with their advanced technology, turning it into a flying vehicle, and invited him to join their cosmic karaoke party.",
    solution: `🚗🛸👽🔧🚀🎤🌌😆🎉🌠`,
  },
  {
    story: `A cat named Whiskers became the world's greatest detective, solving cases with his sharp feline instincts and stealthy paw work. His signature move was always leaving a furball at the scene, marking the solved case as "Whiskers-approved."`,
    solution: `🐈🔍🌍🕵️‍♂️🐾😼✅📍📚🔐`,
  },
];
