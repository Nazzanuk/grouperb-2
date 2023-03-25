import toArray from 'lodash/toArray';

function reorderAndRemoveDuplicates(inputArray: string[]): string[] {
  // Sort the array based on Unicode code points
  inputArray.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

  // Remove duplicates
  const uniqueArray: string[] = Array.from(new Set(inputArray));

  // Join the unique and sorted array back into a string
  return uniqueArray;
}

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
  {
    story:
      'An adventurous snail named Speedy was tired of being slow, so he built himself a tiny jetpack. With his newfound speed, he traveled the world, capturing breathtaking photos of his journey, and became an Instagram sensation.',
    solution: `🐌🚀💨🌍📸🛫🌇🌄📲🌟`,
  },
  {
    story:
      'A time-traveling raccoon named Rocket accidentally landed in the age of dinosaurs. He befriended a T-Rex and taught it to play fetch, leading to the formation of the first-ever prehistoric petting zoo.',
    solution: `🦝⌛️🦖🏃‍♂️🦴🤝🌳🐾🔙🎡`,
  },
  {
    story:
      'A group of bees with a love for fashion started their own clothing line made entirely from honeycomb. Their buzzworthy designs soon became the talk of the insect world, and they were featured in the annual Bug Couture Fashion Show.',
    solution: `🐝👗🍯🕶️🐜🦋👠🌟🐞🎩`,
  },
  {
    story:
      "A daring donut named Dizzy decided to become the world's first pastry stunt performer. He wowed audiences by diving into cups of coffee from great heights, becoming a sensation in the snack world and a role model for adventurous treats.",
    solution: `🍩🎢💥☕🤸‍♂️🌍🎯🎉👏🍪`,
  },
  {
    story:
      'A talented giraffe named Gigi discovered her passion for basketball and joined the local team. With her exceptional height and agility, she quickly became the star player, leading her team to victory in the national championships.',
    solution: `🦒🏀❤️🏃‍♀️🌟🥇🏆🎖️📣🥳`,
  },
  {
    story:
      'An adventurous potato named Spudnik journeyed to the center of the Earth. Along the way, he discovered a hidden world of crystals, where he met a group of friendly rock creatures who taught him the art of gemstone carving.',
    solution: `🥔🌎🔥💎🔦🪐🤝🪨🗿🌋`,
  },
  {
    story:
      'A group of friends decided to participate in a local cooking competition. Working together, they prepared a delicious three-course meal that impressed the judges and won them first place, strengthening their bond as friends.',
    solution: `👫🍳🏆🥘🥗🍰🎉🎖️❤️🤗`,
  },
  {
    story:
      'After moving to a new city, Emily decided to join a book club to make friends. Over time, she not only discovered great books, but also formed a strong connection with her fellow book lovers, creating a lifetime of memories and friendships.',
    solution: `🏙️📚👩🏼‍🤝‍👩🏻🌟🤓❤️📖😊👭`,
  },
  {
    story:
      'Jack started jogging in the park every morning as a way to stay healthy. Soon, he joined a group of fellow joggers and formed lasting friendships. They motivated each other to reach new fitness goals and explored different running trails together.',
    solution: `🏃‍♂️🌳👟🏃‍♀️🎽🏁👫🌄🌟💪`,
  },
  {
    story:
      'Sophie, an aspiring artist, decided to share her art on social media. Her creations quickly gained attention, and she received supportive messages from people all over the world. Encouraged, she continued to create and inspire others with her work.',
    solution: `👩‍🎨🎨🖼️📲🌍❤️💌🌟💡👩‍🎤`,
  },
  {
    story:
      "On a whim, Tom decided to take up gardening as a hobby. Over time, his once-empty backyard transformed into a lush, green oasis, where neighbors and friends gathered to relax and enjoy the fruits of Tom's labor.",
    solution: `👨‍🌾🌱🏡🌻🌳🍇👨‍👩‍👧‍👦🌿🌞`,
  },
  {
    story:
      'Lily adopted a rescue dog named Charlie and started taking him for walks in the park. Through their daily walks, they met other dog owners, and Lily became a part of a tight-knit pet-lover community.',
    solution: `👩🐶🏞️🚶‍♀️🐾👥🤝❤️🐕🏠`,
  },
  {
    story:
      'Anna decided to learn a new language and joined a local language exchange group. As her skills improved, she made friends from different cultures and expanded her worldview, eventually traveling to new countries to practice her skills.',
    solution: `👩🌍🗣️📚🌐👥✈️🗺️🤗🏞️`,
  },
  {
    story:
      'Sam took up photography as a hobby and began capturing the beauty of his city. Sharing his photos online, he connected with other photographers and enthusiasts, who inspired him to continue exploring and honing his craft.',
    solution: `📸🏙️🖼️🌇🌆🤳💻🌉🌃👨‍🎨`,
  },
  {
    story:
      'A retired couple, Ben and Susan, started volunteering at a local food bank. Through their selfless work, they not only helped their community but also formed friendships with other volunteers, creating a network of support and compassion.',
    solution: `👵👴🍲🥫🏥💖🤲👩‍👩‍👧‍👦🌟🤗`,
  },
  {
    story:
      'Lucy joined a yoga class to improve her flexibility and focus. Over time, she discovered the benefits of mindfulness and meditation, which helped her achieve a sense of balance and calm in her daily life.',
    solution: `🧘‍♀️💆‍♀️🧩🕉️✨👣🙏🧠⏳🍵`,
  },
  {
    story:
      'David started playing guitar and joined a local band with some of his friends. As they practiced and performed together, their bond grew stronger, and they created unforgettable memories on and off the stage.',
    solution: `🎸🎶🎤🎼👨‍🎤👩‍🎤🎹🎷🤘🎵`,
  },
  {
    story:
      'Olivia decided to take up knitting and discovered a love for creating handmade gifts. As she crafted cozy blankets and scarves, she shared her creations with friends and family, who appreciated the warmth and thoughtfulness behind each stitch.',
    solution: `🧶🧵🧣🧥🎁💕👪💌🤗👩‍🦳`,
  },
  {
    story:
      'Mike began taking cooking classes and discovered a passion for creating delicious dishes. As he experimented with new recipes, he invited friends and family over for dinner parties, turning his home into a hub of laughter and good food.',
    solution: `👨‍🍳🍽️🥘🍛🥂🏠👫🥳🍲🍝`,
  },
];

export const EmojiList = Tales.map((story) => toArray(story.solution)).flat();

export const orderedEmojis = reorderAndRemoveDuplicates(EmojiList);
