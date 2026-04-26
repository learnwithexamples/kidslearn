// Chinese Vocabulary Data — 部编版语文
// Structure mirrors data/vocabulary-data.js
// Each entry: { char, pinyin, meaning, meaningEn, example, examplePinyin, exampleMeaning }

const chineseVocabData = {
  books: {
    'grade2b': {
      title: '二年级下册',
      level: '小学二年级',
      description: '人教版部编语文二年级下册生字词',
      lessons: [
        // ── Unit 1 ────────────────────────────────────────────────
        {
          number: 1,
          unit: 1,
          title: '古诗二首',
          words: [
            {
              char: '诗',
              pinyin: 'shī',
              meaning: '用文字写成的韵文',
              meaningEn: 'poem; poetry',
              example: '诗歌',
              examplePinyin: 'shī gē',
              exampleMeaning: 'poem / poetry'
            },
            {
              char: '童',
              pinyin: 'tóng',
              meaning: '小孩子',
              meaningEn: 'child; children',
              example: '儿童',
              examplePinyin: 'ér tóng',
              exampleMeaning: 'children'
            },
            {
              char: '妆',
              pinyin: 'zhuāng',
              meaning: '打扮；装饰',
              meaningEn: 'to adorn; to dress up',
              example: '妆扮',
              examplePinyin: 'zhuāng bàn',
              exampleMeaning: 'to dress up / adorn'
            },
            {
              char: '丝',
              pinyin: 'sī',
              meaning: '细长的线状物；蚕丝',
              meaningEn: 'silk; thread; fine strand',
              example: '丝绸',
              examplePinyin: 'sī chóu',
              exampleMeaning: 'silk fabric'
            },
            {
              char: '村',
              pinyin: 'cūn',
              meaning: '农村；村庄',
              meaningEn: 'village; rural',
              example: '村庄',
              examplePinyin: 'cūn zhuāng',
              exampleMeaning: 'village'
            },
            {
              char: '碧',
              pinyin: 'bì',
              meaning: '青绿色；像玉一样的颜色',
              meaningEn: 'jade green; emerald',
              example: '碧绿',
              examplePinyin: 'bì lǜ',
              exampleMeaning: 'jade green'
            },
            {
              char: '绿',
              pinyin: 'lǜ',
              meaning: '草和树叶的颜色',
              meaningEn: 'green',
              example: '绿色',
              examplePinyin: 'lǜ sè',
              exampleMeaning: 'green (color)'
            },
            {
              char: '剪',
              pinyin: 'jiǎn',
              meaning: '用剪刀切断',
              meaningEn: 'to cut with scissors',
              example: '剪刀',
              examplePinyin: 'jiǎn dāo',
              exampleMeaning: 'scissors'
            },
          ]
        },
        {
          number: 2,
          unit: 1,
          title: '找春天',
          words: []
        },
        {
          number: 3,
          unit: 1,
          title: '开满鲜花的小路',
          words: []
        },
        {
          number: 4,
          unit: 1,
          title: '邓小平爷爷植树',
          words: []
        },

        // ── Unit 2 ────────────────────────────────────────────────
        {
          number: 5,
          unit: 2,
          title: '雷锋叔叔，你在哪里',
          words: []
        },
        {
          number: 6,
          unit: 2,
          title: '千人糕',
          words: []
        },
        {
          number: 7,
          unit: 2,
          title: '一匹出色的马',
          words: []
        },

        // ── Unit 3 ────────────────────────────────────────────────
        {
          number: 8,
          unit: 3,
          title: '古诗二首',
          words: []
        },
        {
          number: 9,
          unit: 3,
          title: '彩色的梦',
          words: []
        },
        {
          number: 10,
          unit: 3,
          title: '沙滩上的童话',
          words: []
        },
        {
          number: 11,
          unit: 3,
          title: '枫树上的喜鹊',
          words: []
        },

        // ── Unit 4 ────────────────────────────────────────────────
        {
          number: 12,
          unit: 4,
          title: '小马过河',
          words: []
        },
        {
          number: 13,
          unit: 4,
          title: '画杨桃',
          words: []
        },
        {
          number: 14,
          unit: 4,
          title: '小毛虫',
          words: []
        },

        // ── Unit 5 ────────────────────────────────────────────────
        {
          number: 15,
          unit: 5,
          title: '古诗二首',
          words: []
        },
        {
          number: 16,
          unit: 5,
          title: '"贝"的故事',
          words: []
        },
        {
          number: 17,
          unit: 5,
          title: '祖先的摇篮',
          words: []
        },
        {
          number: 18,
          unit: 5,
          title: '我是一只小虫子',
          words: []
        },

        // ── Unit 6 ────────────────────────────────────────────────
        {
          number: 19,
          unit: 6,
          title: '古诗二首',
          words: []
        },
        {
          number: 20,
          unit: 6,
          title: '蜘蛛开店',
          words: []
        },
        {
          number: 21,
          unit: 6,
          title: '青蛙卖泥塘',
          words: []
        },
        {
          number: 22,
          unit: 6,
          title: '雷雨',
          words: []
        },

        // ── Unit 7 ────────────────────────────────────────────────
        {
          number: 23,
          unit: 7,
          title: '古诗二首',
          words: []
        },
        {
          number: 24,
          unit: 7,
          title: '大象的耳朵',
          words: []
        },
        {
          number: 25,
          unit: 7,
          title: '羿射九日',
          words: []
        },
        {
          number: 26,
          unit: 7,
          title: '蜗牛的奖杯',
          words: []
        },

        // ── Unit 8 ────────────────────────────────────────────────
        {
          number: 27,
          unit: 8,
          title: '古诗二首',
          words: []
        },
        {
          number: 28,
          unit: 8,
          title: '真正的英雄',
          words: []
        },
        {
          number: 29,
          unit: 8,
          title: '数星星的孩子',
          words: []
        },
        {
          number: 30,
          unit: 8,
          title: '爱迪生救妈妈',
          words: []
        },
      ]
    }
  }
};

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Return a lesson by lesson number */
function getCNLesson(lessonNumber) {
  return chineseVocabData.books['grade2b'].lessons.find(l => l.number === lessonNumber) || null;
}

/** Return all lessons for a given unit number */
function getCNUnit(unitNumber) {
  return chineseVocabData.books['grade2b'].lessons.filter(l => l.unit === unitNumber);
}

/** Return every word across all lessons (flat array) */
function getAllCNWords() {
  return chineseVocabData.books['grade2b'].lessons.flatMap(l => l.words);
}
